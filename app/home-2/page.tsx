import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

// Preview homepage (Home 2). Render on every request so Airtable edits show up
// immediately, matching the live homepage behavior.
export const dynamic = "force-dynamic";

import {
  getLatestFeaturedRelease,
  listFeaturedArtists,
  listReleases,
} from "@/lib/airtable/read";
import { SITE, YOUTUBE_CHANNEL } from "@/lib/site";
import { HeroHome2 } from "@/components/site/hero-home2";
import { PressBar } from "@/components/site/press-bar";
import { Section, SectionHeader } from "@/components/site/section";
import { ArtistCard } from "@/components/site/artist-card";
import { ReleaseCard } from "@/components/site/release-card";
import { StaggerGrid, StaggerItem, FadeUp } from "@/components/site/motion";
import { ImUsedFeature } from "@/components/site/imused-feature";
import { FeaturedVideos } from "@/components/site/featured-videos";
import { PressStrip } from "@/components/site/press-strip";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Home 2 (preview)",
  description:
    "Preview of a credibility-first homepage layout for 9th Ward Production & Promotions.",
  robots: { index: false, follow: false },
};

const FOUNDERS = [
  { name: "Jay Davis", role: "Co-founder · aka Blaquestalyon", initials: "JD" },
  { name: "Shakara Weston", role: "Co-founder", initials: "SW" },
];

export default async function Home2Page() {
  const [featuredRelease, featuredArtists, releases] = await Promise.all([
    getLatestFeaturedRelease(),
    listFeaturedArtists(3),
    listReleases(),
  ]);
  const latestReleases = releases.slice(0, 4);

  return (
    <>
      <HeroHome2 release={featuredRelease} />

      {/* Press trust bar — highest-trust real estate, right under the hero */}
      <PressBar />

      {/* Who we are — pulls the label's story forward from the About page */}
      <Section className="py-14 md:py-16">
        <FadeUp className="grid items-center gap-8 rounded-2xl border border-border bg-card p-8 md:grid-cols-[1.2fr_0.8fr] md:p-10">
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-gold">
              Who we are
            </p>
            <h2 className="font-display text-2xl font-bold sm:text-3xl">
              Born to protect independent artists
            </h2>
            <p className="mt-4 max-w-xl text-muted-foreground">
              The name began in Houston in 2010. New Orleans gave it meaning; a
              ward is a place of protection. Sixteen years later the standard is
              the same: protect the art, pay the artist, and build without
              compromise.
            </p>
            <Button asChild variant="ghost" className="mt-5 px-0 hover:bg-transparent hover:text-primary">
              <Link href="/about">
                Read our story <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          <ul className="grid gap-4">
            {FOUNDERS.map((f) => (
              <li key={f.name} className="flex items-center gap-4">
                <span
                  aria-hidden
                  className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-border bg-primary/15 font-display text-lg font-bold text-primary"
                >
                  {f.initials}
                </span>
                <div>
                  <p className="font-display text-base font-semibold">
                    {f.name}
                  </p>
                  <p className="text-sm text-muted-foreground">{f.role}</p>
                </div>
              </li>
            ))}
          </ul>
        </FadeUp>
      </Section>

      {/* Flagship venture — moved up: the press hook and innovation proof */}
      <Section className="pt-0">
        <ImUsedFeature />
      </Section>

      {/* Roster */}
      {featuredArtists.length > 0 && (
        <Section className="pt-4 md:pt-4">
          <div className="mb-8 flex items-end justify-between gap-4">
            <SectionHeader
              eyebrow="The roster"
              title="Artists we build with"
              description="Independent artists we produce, manage, and promote. Great music doesn't need a zip code."
              className="mb-0"
            />
            <Button asChild variant="ghost" className="hidden shrink-0 sm:inline-flex">
              <Link href="/artists">
                View all <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          <StaggerGrid className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3">
            {featuredArtists.map((artist) => (
              <StaggerItem key={artist.id}>
                <ArtistCard artist={artist} />
              </StaggerItem>
            ))}
          </StaggerGrid>
        </Section>
      )}

      {/* The work — releases + video in one section (was two) */}
      <Section className="pt-4 md:pt-4">
        <div className="mb-8 flex items-end justify-between gap-4">
          <SectionHeader
            eyebrow="The work"
            title="Releases & video, in one place"
            description={`New music and the most-watched videos from the Blaquestalyon / 9th Ward channel — ${YOUTUBE_CHANNEL.subscriberCount} subscribers and counting.`}
            className="mb-0"
          />
          <Button asChild variant="ghost" className="hidden shrink-0 sm:inline-flex">
            <Link href="/music">
              All music <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        {latestReleases.length > 0 && (
          <StaggerGrid className="mb-10 grid grid-cols-2 gap-4 md:grid-cols-4">
            {latestReleases.map((release) => (
              <StaggerItem key={release.id}>
                <ReleaseCard release={release} />
              </StaggerItem>
            ))}
          </StaggerGrid>
        )}

        <FeaturedVideos />
      </Section>

      {/* Press coverage — the detailed version */}
      <Section className="pt-4 md:pt-4">
        <PressStrip />
      </Section>

      {/* Closing CTA — work with us, not just follow us */}
      <Section className="pt-4">
        <FadeUp className="flex flex-col items-start justify-between gap-6 rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/12 via-card to-card p-8 md:flex-row md:items-center md:p-12">
          <div>
            <h2 className="font-display text-2xl font-bold sm:text-3xl">
              Work with 9th Ward
            </h2>
            <p className="mt-2 max-w-md text-muted-foreground">
              Artists, partners, and press — start here.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href="/submit">Submit your music</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/contact">Partner with us</Link>
            </Button>
            <Button asChild size="lg" variant="ghost">
              <Link href="/services">Explore services</Link>
            </Button>
          </div>
        </FadeUp>
      </Section>
    </>
  );
}
