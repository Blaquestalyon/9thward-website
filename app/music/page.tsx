import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { listReleases, getLatestFeaturedRelease } from "@/lib/airtable/read";

// Render on every request so Airtable edits propagate immediately.
export const dynamic = "force-dynamic";
import { PageHeader } from "@/components/site/page-header";
import { Section, EmptyState } from "@/components/site/section";
import { Artwork } from "@/components/site/artwork";
import { MusicEmbed } from "@/components/site/music-embed";
import { PlatformButtons } from "@/components/site/platform-button";
import { MusicCatalog } from "@/components/site/music-catalog";
import { FadeUp } from "@/components/site/motion";
import { JsonLd } from "@/components/site/json-ld";
import { breadcrumbLd } from "@/lib/jsonld";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Music",
  description:
    "Releases from the 9th Ward roster — singles, EPs, albums, and mixtapes. Stream everywhere.",
};

export default async function MusicPage() {
  const [all, featured] = await Promise.all([
    listReleases(),
    getLatestFeaturedRelease(),
  ]);
  const rest = featured ? all.filter((r) => r.id !== featured.id) : all;
  const embedSrc = featured
    ? featured.embedUrl ||
      featured.youtubeUrl ||
      featured.appleMusicUrl ||
      featured.soundcloudUrl ||
      featured.spotifyUrl
    : undefined;

  return (
    <>
      <JsonLd
        data={breadcrumbLd([
          { name: "Home", path: "/" },
          { name: "Music", path: "/music" },
        ])}
      />
      <PageHeader
        eyebrow="Releases"
        title="Music"
        description="Every release from the label and its artists. Newest first."
      />

      {all.length === 0 ? (
        <Section>
          <EmptyState
            title="No releases yet"
            description="Releases will appear here once they're added in Airtable."
            action={
              <Button asChild>
                <Link href="/artists">Meet the roster</Link>
              </Button>
            }
          />
        </Section>
      ) : (
        <>
          {featured && (
            <Section>
              <FadeUp className="grid gap-8 overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-primary/10 via-card to-card p-6 md:grid-cols-[minmax(0,300px)_1fr] md:items-center md:p-8">
                <div className="relative aspect-square w-full overflow-hidden rounded-xl border border-border shadow-xl">
                  <Artwork
                    src={featured.coverArt}
                    alt={`${featured.title} cover art`}
                    kind="release"
                    priority
                    sizes="(max-width: 768px) 100vw, 300px"
                  />
                </div>
                <div>
                  <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-gold">
                    Featured release
                  </p>
                  <h2 className="font-display text-3xl font-bold sm:text-4xl">
                    {featured.title}
                  </h2>
                  {featured.artistNames?.length ? (
                    <p className="mt-1 text-muted-foreground">
                      {featured.artistNames.join(", ")}
                    </p>
                  ) : null}
                  <div className="mt-3 flex flex-wrap gap-2">
                    {featured.type && <Badge variant="gold">{featured.type}</Badge>}
                    {featured.releaseDate && (
                      <Badge variant="outline">
                        {formatDate(featured.releaseDate)}
                      </Badge>
                    )}
                  </div>
                  {embedSrc && (
                    <MusicEmbed
                      url={embedSrc}
                      title={`${featured.title} player`}
                      className="mt-5 lg:max-w-xl"
                    />
                  )}
                  <PlatformButtons
                    className="mt-4"
                    platforms={[
                      { key: "spotify", label: "Spotify", url: featured.spotifyUrl },
                      { key: "apple", label: "Apple Music", url: featured.appleMusicUrl },
                      { key: "soundcloud", label: "SoundCloud", url: featured.soundcloudUrl },
                      { key: "youtube", label: "YouTube", url: featured.youtubeUrl },
                      { key: "bandcamp", label: "Bandcamp", url: featured.bandcampUrl },
                    ]}
                  />
                  <div className="mt-5">
                    <Button
                      asChild
                      variant="ghost"
                      className="px-0 hover:bg-transparent hover:text-primary"
                    >
                      <Link href={`/music/${featured.slug}`}>
                        Full release page <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </FadeUp>
            </Section>
          )}

          {rest.length > 0 && (
            <Section className={featured ? "pt-0" : ""}>
              <MusicCatalog releases={rest} />
            </Section>
          )}
        </>
      )}
    </>
  );
}
