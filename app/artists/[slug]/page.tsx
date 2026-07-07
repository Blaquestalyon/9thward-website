import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Mail, MapPin, Music2 } from "lucide-react";
import {
  getArtistBySlug,
  listArtists,
  listEventsForArtist,
  listReleases,
} from "@/lib/airtable/read";
import { PageHeader } from "@/components/site/page-header";
import { Section, SectionHeader } from "@/components/site/section";
import { Artwork } from "@/components/site/artwork";
import { MusicEmbed } from "@/components/site/music-embed";
import { PlatformButtons } from "@/components/site/platform-button";
import { EventCard } from "@/components/site/event-card";
import { ReleaseCard } from "@/components/site/release-card";
import { SocialIcon } from "@/components/site/social-icons";
import { BookingDialog } from "@/components/site/booking-dialog";
import { JsonLd } from "@/components/site/json-ld";
import { artistMusicGroupLd, breadcrumbLd } from "@/lib/jsonld";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { absoluteUrl } from "@/lib/utils";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const artist = await getArtistBySlug(slug);
  if (!artist) return { title: "Artist not found" };
  const title = artist.stageName || artist.name;
  const desc =
    artist.bio?.slice(0, 155) ||
    `${title} — on the 9th Ward roster.`;
  return {
    title,
    description: desc,
    openGraph: {
      title,
      description: desc,
      url: absoluteUrl(`/artists/${artist.slug}`),
      ...(artist.photo ? { images: [{ url: artist.photo.url }] } : {}),
    },
    alternates: { canonical: absoluteUrl(`/artists/${artist.slug}`) },
  };
}

export default async function ArtistDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const artist = await getArtistBySlug(slug);
  if (!artist) notFound();

  const title = artist.stageName || artist.name;

  const [allReleases, upcomingEvents] = await Promise.all([
    listReleases(),
    listEventsForArtist(artist.id),
  ]);

  const artistReleases = allReleases.filter((r) =>
    r.artistIds.includes(artist.id)
  );
  const topTrack = artistReleases.find((r) => r.embedUrl);

  const socials = [
    { key: "spotify" as const, url: artist.spotifyUrl },
    { key: "soundcloud" as const, url: artist.soundcloudUrl },
    { key: "youtube" as const, url: artist.youtubeUrl },
    { key: "instagram" as const, url: artist.instagramUrl },
  ].filter((s) => s.url);

  return (
    <>
      <JsonLd
        data={[
          artistMusicGroupLd(artist),
          breadcrumbLd([
            { name: "Home", path: "/" },
            { name: "Artists", path: "/artists" },
            { name: title, path: `/artists/${artist.slug}` },
          ]),
        ]}
      />

      <PageHeader eyebrow="Artist" title={title}>
        <div className="flex flex-wrap items-center gap-2">
          {artist.genre && <Badge variant="secondary">{artist.genre}</Badge>}
          {artist.hometown && (
            <Badge variant="outline" className="gap-1">
              <MapPin className="h-3 w-3" /> {artist.hometown}
            </Badge>
          )}
        </div>
      </PageHeader>

      <Section>
        <div className="grid gap-10 lg:grid-cols-[minmax(0,340px)_1fr]">
          {/* Left: photo + links */}
          <div className="space-y-6">
            <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl border border-border">
              <Artwork
                src={artist.photo}
                alt={title}
                kind="artist"
                priority
                sizes="(max-width: 1024px) 100vw, 340px"
              />
            </div>

            {socials.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {socials.map((s) => (
                  <a
                    key={s.key}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.key}
                    className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:border-primary hover:text-foreground"
                  >
                    <SocialIcon keyName={s.key} />
                  </a>
                ))}
              </div>
            )}

            <div className="flex flex-col gap-2">
              {artist.bookingEmail && (
                <Button asChild variant="outline" className="w-full gap-2">
                  <a href={`mailto:${artist.bookingEmail}`}>
                    <Mail className="h-4 w-4" /> Booking &amp; press
                  </a>
                </Button>
              )}
              <BookingDialog
                artistOptions={[title]}
                label={`Book ${title}`}
                className="w-full"
              />
            </div>
          </div>

          {/* Right: bio + music + shows */}
          <div className="space-y-10">
            <div>
              <h2 className="font-display text-2xl font-semibold">Bio</h2>
              <p className="mt-3 whitespace-pre-line leading-relaxed text-foreground/90">
                {artist.bio || "Bio coming soon."}
              </p>
            </div>

            {topTrack?.embedUrl && (
              <div>
                <h2 className="mb-3 font-display text-2xl font-semibold">
                  Listen
                </h2>
                <MusicEmbed
                  url={topTrack.embedUrl}
                  title={`${title} — ${topTrack.title}`}
                />
                <PlatformButtons
                  className="mt-4"
                  platforms={[
                    { key: "spotify", label: "Spotify", url: artist.spotifyUrl },
                    { key: "soundcloud", label: "SoundCloud", url: artist.soundcloudUrl },
                    { key: "youtube", label: "YouTube", url: artist.youtubeUrl },
                    { key: "apple", label: "Apple Music", url: artist.appleMusicUrl },
                    { key: "bandcamp", label: "Bandcamp", url: artist.bandcampUrl },
                  ]}
                />
              </div>
            )}

            {artistReleases.length > 0 && (
              <div>
                <h2 className="mb-4 font-display text-2xl font-semibold">
                  Releases
                </h2>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                  {artistReleases.map((r) => (
                    <ReleaseCard key={r.id} release={r} />
                  ))}
                </div>
              </div>
            )}

            {upcomingEvents.length > 0 && (
              <div>
                <h2 className="mb-4 font-display text-2xl font-semibold">
                  Upcoming shows
                </h2>
                <div className="space-y-4">
                  {upcomingEvents.map((e) => (
                    <EventCard key={e.id} event={e} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </Section>
    </>
  );
}
