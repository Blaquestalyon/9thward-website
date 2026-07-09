import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getReleaseBySlug, listArtists } from "@/lib/airtable/read";
import { PageHeader } from "@/components/site/page-header";
import { Section } from "@/components/site/section";
import { Artwork } from "@/components/site/artwork";
import { MusicEmbed } from "@/components/site/music-embed";
import { PlatformButtons } from "@/components/site/platform-button";
import { JsonLd } from "@/components/site/json-ld";
import { releaseLd, breadcrumbLd } from "@/lib/jsonld";
import { Badge } from "@/components/ui/badge";
import { formatDate, absoluteUrl } from "@/lib/utils";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const release = await getReleaseBySlug(slug);
  if (!release) return { title: "Release not found" };
  const desc =
    release.description?.slice(0, 155) ||
    `${release.title}${release.artistNames?.length ? ` by ${release.artistNames.join(", ")}` : ""} — out now.`;
  return {
    title: release.title,
    description: desc,
    openGraph: {
      title: release.title,
      description: desc,
      url: absoluteUrl(`/music/${release.slug}`),
      ...(release.coverArt ? { images: [{ url: release.coverArt.url }] } : {}),
    },
    alternates: { canonical: absoluteUrl(`/music/${release.slug}`) },
  };
}

export default async function ReleaseDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const release = await getReleaseBySlug(slug);
  if (!release) notFound();

  const artists = await listArtists();
  const linkedArtists = artists.filter((a) => release.artistIds.includes(a.id));

  // Primary embed: Embed URL, else first available platform URL.
  // Preference: YouTube (reliable 16:9 iframe) → Apple → SoundCloud → Spotify.
  const embedSrc =
    release.embedUrl ||
    release.youtubeUrl ||
    release.appleMusicUrl ||
    release.soundcloudUrl ||
    release.spotifyUrl;

  return (
    <>
      <JsonLd
        data={[
          releaseLd(release),
          breadcrumbLd([
            { name: "Home", path: "/" },
            { name: "Music", path: "/music" },
            { name: release.title, path: `/music/${release.slug}` },
          ]),
        ]}
      />

      <PageHeader eyebrow={release.type || "Release"} title={release.title}>
        {linkedArtists.length > 0 && (
          <p className="text-lg text-muted-foreground">
            by{" "}
            {linkedArtists.map((a, i) => (
              <span key={a.id}>
                <Link
                  href={`/artists/${a.slug}`}
                  className="text-foreground underline-offset-4 hover:underline"
                >
                  {a.stageName || a.name}
                </Link>
                {i < linkedArtists.length - 1 ? ", " : ""}
              </span>
            ))}
          </p>
        )}
      </PageHeader>

      <Section>
        <div className="grid gap-10 lg:grid-cols-[minmax(0,360px)_1fr]">
          <div>
            <div className="relative aspect-square w-full overflow-hidden rounded-xl border border-border shadow-xl">
              <Artwork
                src={release.coverArt}
                alt={`${release.title} cover art`}
                kind="release"
                priority
                sizes="(max-width: 1024px) 100vw, 360px"
              />
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              {release.type && <Badge variant="gold">{release.type}</Badge>}
              {release.releaseDate && (
                <Badge variant="outline">
                  {formatDate(release.releaseDate)}
                </Badge>
              )}
            </div>
          </div>

          <div className="space-y-8">
            {embedSrc && (
              <div>
                <h2 className="mb-3 font-display text-xl font-semibold">
                  Listen
                </h2>
                <MusicEmbed
                  url={embedSrc}
                  title={`${release.title} player`}
                  className="lg:max-w-xl"
                />
              </div>
            )}

            <div>
              <h2 className="mb-3 font-display text-xl font-semibold">
                Where to stream
              </h2>
              <PlatformButtons
                platforms={[
                  { key: "spotify", label: "Spotify", url: release.spotifyUrl },
                  { key: "apple", label: "Apple Music", url: release.appleMusicUrl },
                  { key: "soundcloud", label: "SoundCloud", url: release.soundcloudUrl },
                  { key: "youtube", label: "YouTube", url: release.youtubeUrl },
                  { key: "bandcamp", label: "Bandcamp", url: release.bandcampUrl },
                ]}
              />
              {![
                release.spotifyUrl,
                release.appleMusicUrl,
                release.soundcloudUrl,
                release.youtubeUrl,
                release.bandcampUrl,
              ].some(Boolean) && (
                <p className="text-sm text-muted-foreground">
                  Streaming links coming soon.
                </p>
              )}
            </div>

            {release.description && (
              <div>
                <h2 className="mb-3 font-display text-xl font-semibold">
                  About this release
                </h2>
                <p className="whitespace-pre-line leading-relaxed text-foreground/90">
                  {release.description}
                </p>
              </div>
            )}
          </div>
        </div>
      </Section>
    </>
  );
}
