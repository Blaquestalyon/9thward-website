import Link from "next/link";
import { ArrowRight, Disc3, Send, Users, Wrench } from "lucide-react";
import {
  getLatestFeaturedRelease,
  listFeaturedArtists,
  listReleases,
} from "@/lib/airtable/read";
import { SOCIAL_LINKS } from "@/lib/site";
import { HeroRelease } from "@/components/site/hero-release";
import { Section, SectionHeader } from "@/components/site/section";
import { ArtistCard } from "@/components/site/artist-card";
import { ReleaseCard } from "@/components/site/release-card";
import { StaggerGrid, StaggerItem, FadeUp } from "@/components/site/motion";
import { SocialIcon } from "@/components/site/social-icons";
import { Button } from "@/components/ui/button";

export default async function HomePage() {
  const [featuredRelease, featuredArtists, releases] = await Promise.all([
    getLatestFeaturedRelease(),
    listFeaturedArtists(4),
    listReleases(),
  ]);
  const latestReleases = releases.slice(0, 4);

  const quickLinks = [
    { href: "/music", label: "Music", icon: Disc3, desc: "Releases & smart links" },
    { href: "/artists", label: "Artists", icon: Users, desc: "Meet the roster" },
    { href: "/submit", label: "Submit", icon: Send, desc: "Send us your music" },
    { href: "/services", label: "Services", icon: Wrench, desc: "How we help" },
  ];

  return (
    <>
      <HeroRelease release={featuredRelease} />

      {/* Quick links */}
      <Section className="py-14 md:py-16">
        <StaggerGrid className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {quickLinks.map((q) => (
            <StaggerItem key={q.href}>
              <Link
                href={q.href}
                className="group flex h-full flex-col rounded-lg border border-border bg-card p-6 transition-colors hover:border-primary/60"
              >
                <q.icon className="h-6 w-6 text-primary" />
                <span className="mt-4 font-display text-lg font-semibold group-hover:text-primary">
                  {q.label}
                </span>
                <span className="text-sm text-muted-foreground">{q.desc}</span>
                <ArrowRight className="mt-4 h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
              </Link>
            </StaggerItem>
          ))}
        </StaggerGrid>
      </Section>

      {/* Featured roster */}
      {featuredArtists.length > 0 && (
        <Section className="pt-4 md:pt-4">
          <div className="mb-8 flex items-end justify-between gap-4">
            <SectionHeader
              eyebrow="The roster"
              title="Artists we build with"
              description="Independent talent we produce, manage, and promote — from Houston to New Orleans to the Bronx and beyond."
              className="mb-0"
            />
            <Button asChild variant="ghost" className="hidden shrink-0 sm:inline-flex">
              <Link href="/artists">
                View all <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          <StaggerGrid className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {featuredArtists.map((artist) => (
              <StaggerItem key={artist.id}>
                <ArtistCard artist={artist} />
              </StaggerItem>
            ))}
          </StaggerGrid>
        </Section>
      )}

      {/* Latest music */}
      {latestReleases.length > 0 && (
        <Section className="pt-4 md:pt-4">
          <div className="mb-8 flex items-end justify-between gap-4">
            <SectionHeader
              eyebrow="New music"
              title="Latest releases"
              className="mb-0"
            />
            <Button asChild variant="ghost" className="hidden shrink-0 sm:inline-flex">
              <Link href="/music">
                All music <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          <StaggerGrid className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {latestReleases.map((release) => (
              <StaggerItem key={release.id}>
                <ReleaseCard release={release} />
              </StaggerItem>
            ))}
          </StaggerGrid>
        </Section>
      )}

      {/* Social proof / follow */}
      <Section className="pt-4">
        <FadeUp className="rounded-2xl border border-border bg-card p-8 text-center md:p-12">
          <h2 className="font-display text-2xl font-bold sm:text-3xl">
            Follow the movement
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-muted-foreground">
            New releases, shows, and roster news across the platforms.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            {SOCIAL_LINKS.filter((s) => s.href).map((s) => (
              <a
                key={s.key}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-primary hover:text-foreground"
              >
                <SocialIcon keyName={s.key} />
              </a>
            ))}
          </div>
        </FadeUp>
      </Section>
    </>
  );
}
