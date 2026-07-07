import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles } from "lucide-react";
import type { Release } from "@/lib/airtable/types";
import { SITE } from "@/lib/site";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Artwork } from "./artwork";
import { MusicEmbed } from "./music-embed";
import { FadeUp } from "./motion";

/**
 * Home hero. If a featured release exists, it foregrounds the release with its
 * embedded player. Otherwise it degrades to a clean brand hero (empty-state
 * safe for first deploy before Airtable is populated).
 */
export function HeroRelease({ release }: { release: Release | null }) {
  return (
    <section className="grain gradient-wash relative overflow-hidden border-b border-border">
      <div className="container relative z-10 py-20 md:py-28">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <FadeUp>
            <p className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-gold">
              <Sparkles className="h-4 w-4" />
              {release ? "Latest release" : "Houston-based indie label"}
            </p>
            <h1 className="text-4xl font-bold leading-[1.05] sm:text-5xl md:text-6xl">
              {release ? (
                <span className="text-gradient">{release.title}</span>
              ) : (
                <>
                  Indie artists,
                  <br />
                  built from the{" "}
                  <span className="text-gradient">ground up.</span>
                </>
              )}
            </h1>
            <p className="mt-5 max-w-md text-lg text-muted-foreground">
              {release
                ? release.artistNames?.length
                  ? `New from ${release.artistNames.join(", ")}. Stream it now.`
                  : "Out now. Stream it everywhere."
                : SITE.tagline}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              {release ? (
                <>
                  <Button asChild size="lg">
                    <Link href={`/music/${release.slug}`}>
                      Listen now <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild size="lg" variant="outline">
                    <Link href="/artists">Meet the roster</Link>
                  </Button>
                </>
              ) : (
                <>
                  <Button asChild size="lg">
                    <Link href="/artists">
                      Meet the roster <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild size="lg" variant="outline">
                    <Link href="/submit">Submit your music</Link>
                  </Button>
                </>
              )}
            </div>
          </FadeUp>

          <FadeUp delay={0.1}>
            {release ? (
              <div className="space-y-4">
                <div className="relative mx-auto aspect-square w-full max-w-md overflow-hidden rounded-xl border border-border shadow-2xl">
                  <Artwork
                    src={release.coverArt}
                    alt={`${release.title} cover art`}
                    kind="release"
                    priority
                    sizes="(max-width: 1024px) 100vw, 480px"
                  />
                  {release.type && (
                    <Badge variant="gold" className="absolute left-3 top-3">
                      {release.type}
                    </Badge>
                  )}
                </div>
                {release.embedUrl && (
                  <div className="mx-auto max-w-md">
                    <MusicEmbed
                      url={release.embedUrl}
                      title={`${release.title} player`}
                    />
                  </div>
                )}
              </div>
            ) : (
              <div className="relative mx-auto grid aspect-square w-full max-w-md place-items-center">
                {/* Subtle purple glow behind the logo, respects reduced motion */}
                <div
                  aria-hidden
                  className="absolute inset-8 rounded-full bg-primary/20 blur-3xl"
                />
                <Image
                  src="/logo.png"
                  alt="9th Ward Production & Promotions"
                  width={640}
                  height={640}
                  priority
                  sizes="(max-width: 1024px) 80vw, 480px"
                  className="relative z-10 h-auto w-[80%] max-w-md object-contain drop-shadow-[0_10px_40px_rgba(124,58,237,0.35)]"
                />
              </div>
            )}
          </FadeUp>
        </div>
      </div>
    </section>
  );
}
