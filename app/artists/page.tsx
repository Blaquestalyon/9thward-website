import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { listArtists } from "@/lib/airtable/read";

// Render on every request so Airtable edits propagate immediately.
export const dynamic = "force-dynamic";
import { PageHeader } from "@/components/site/page-header";
import { Section, EmptyState } from "@/components/site/section";
import { ArtistRoster } from "@/components/site/artist-roster";
import { Artwork } from "@/components/site/artwork";
import { SocialIcon } from "@/components/site/social-icons";
import { FadeUp } from "@/components/site/motion";
import { JsonLd } from "@/components/site/json-ld";
import { breadcrumbLd } from "@/lib/jsonld";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Artists",
  description:
    "The 9th Ward roster — independent artists we produce, manage, and promote, from Houston to New Orleans to the Bronx and beyond.",
};

export default async function ArtistsPage() {
  const artists = await listArtists();
  const spotlight = artists.find((a) => a.featured) ?? artists[0];
  const rest = spotlight ? artists.filter((a) => a.id !== spotlight.id) : [];
  const spotlightTitle = spotlight ? spotlight.stageName || spotlight.name : "";
  const spotlightBio = spotlight?.bio
    ? spotlight.bio.slice(0, 260) + (spotlight.bio.length > 260 ? "…" : "")
    : spotlight?.microTagline;
  const socials = spotlight
    ? [
        { key: "spotify" as const, url: spotlight.spotifyUrl },
        { key: "soundcloud" as const, url: spotlight.soundcloudUrl },
        { key: "youtube" as const, url: spotlight.youtubeUrl },
        { key: "instagram" as const, url: spotlight.instagramUrl },
      ].filter((s) => s.url)
    : [];

  return (
    <>
      <JsonLd
        data={breadcrumbLd([
          { name: "Home", path: "/" },
          { name: "Artists", path: "/artists" },
        ])}
      />
      <PageHeader
        eyebrow="The roster"
        title="Artists"
        description="Independent talent with the work ethic to go the distance. Tap in."
      />

      {artists.length === 0 ? (
        <Section>
          <EmptyState
            title="Roster coming soon"
            description="Artists will appear here once they're added in Airtable."
            action={
              <Button asChild>
                <Link href="/submit">Submit your music</Link>
              </Button>
            }
          />
        </Section>
      ) : (
        <>
          {spotlight && (
            <Section>
              <FadeUp className="grid items-center gap-8 overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-primary/10 via-card to-card p-6 md:grid-cols-2 md:p-8">
                <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xl border border-border">
                  <Artwork
                    src={spotlight.photo}
                    alt={spotlightTitle}
                    kind="artist"
                    priority
                    sizes="(max-width: 768px) 100vw, 520px"
                  />
                </div>
                <div>
                  <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-gold">
                    Featured artist
                  </p>
                  <h2 className="font-display text-3xl font-bold sm:text-4xl">
                    {spotlightTitle}
                  </h2>
                  {(spotlight.genre || spotlight.hometown) && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {spotlight.genre && (
                        <Badge variant="secondary">{spotlight.genre}</Badge>
                      )}
                      {spotlight.hometown && (
                        <Badge variant="outline">{spotlight.hometown}</Badge>
                      )}
                    </div>
                  )}
                  {spotlightBio && (
                    <p className="mt-4 max-w-prose leading-relaxed text-muted-foreground">
                      {spotlightBio}
                    </p>
                  )}
                  <div className="mt-6 flex flex-wrap items-center gap-3">
                    <Button asChild size="lg">
                      <Link href={`/artists/${spotlight.slug}`}>
                        View profile <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
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
                  </div>
                </div>
              </FadeUp>
            </Section>
          )}

          {rest.length > 0 && (
            <Section className={spotlight ? "pt-0" : ""}>
              <ArtistRoster artists={rest} />
            </Section>
          )}
        </>
      )}
    </>
  );
}
