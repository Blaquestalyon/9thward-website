import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles } from "lucide-react";
import type { Release } from "@/lib/airtable/types";
import { YOUTUBE_CHANNEL } from "@/lib/site";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Artwork } from "./artwork";
import { FadeUp } from "./motion";

/**
 * Home 2 (preview) hero.
 *
 * Reframed for label credibility: the label positioning is the H1, a proof
 * stat row sits under the CTAs, and the featured release moves to a supporting
 * card on the right instead of being the headline. Colors + fonts are
 * unchanged from the live site — only the hierarchy differs.
 */
const STATS = [
  { value: "16 yrs", label: "independent" },
  { value: YOUTUBE_CHANNEL.subscriberCount, label: "YouTube subscribers" },
  { value: "2.6M+", label: "views, top video" },
  { value: "4 continents", label: "artist reach" },
];

export function HeroHome2({ release }: { release: Release | null }) {
  return (
    <section className="grain gradient-wash relative overflow-hidden border-b border-border">
      <div className="container relative z-10 py-20 md:py-28">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <FadeUp>
            <p className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-gold">
              <Sparkles className="h-4 w-4" />
              Independent since 2010 · Houston
            </p>
            <h1 className="text-4xl font-bold leading-[1.05] sm:text-5xl md:text-6xl">
              Indie <span className="text-gradient">artists,</span>
              <br />
              built from the ground up.
            </h1>
            <p className="mt-5 max-w-md text-lg text-muted-foreground">
              Music production, management, and promotion. Born to protect
              independent artists.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href="/artists">
                  Meet the roster <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/contact">Partner with us</Link>
              </Button>
            </div>

            {/* Proof stat row */}
            <dl className="mt-10 grid max-w-xl grid-cols-2 gap-3 sm:grid-cols-4">
              {STATS.map((s) => (
                <div
                  key={s.label}
                  className="rounded-lg border border-border bg-card/70 px-3 py-3"
                >
                  <dt className="font-display text-lg font-bold leading-tight text-primary">
                    {s.value}
                  </dt>
                  <dd className="mt-0.5 text-xs leading-tight text-muted-foreground">
                    {s.label}
                  </dd>
                </div>
              ))}
            </dl>
          </FadeUp>

          <FadeUp delay={0.1}>
            {release ? (
              <div className="mx-auto w-full max-w-sm rounded-2xl border border-border bg-card p-4 shadow-2xl">
                <div className="relative aspect-square w-full overflow-hidden rounded-xl border border-border">
                  <Artwork
                    src={release.coverArt}
                    alt={`${release.title} cover art`}
                    kind="release"
                    priority
                    sizes="(max-width: 1024px) 100vw, 380px"
                  />
                  {release.type && (
                    <Badge variant="gold" className="absolute left-3 top-3">
                      {release.type}
                    </Badge>
                  )}
                </div>
                <div className="mt-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">
                    Latest release
                  </p>
                  <h2 className="mt-1 font-display text-xl font-bold leading-tight">
                    {release.title}
                  </h2>
                  {release.artistNames?.length ? (
                    <p className="mt-0.5 text-sm text-muted-foreground">
                      {release.artistNames.join(", ")}
                    </p>
                  ) : null}
                  <Button asChild className="mt-4 w-full">
                    <Link href={`/music/${release.slug}`}>
                      Listen now <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            ) : (
              <div className="relative mx-auto grid aspect-square w-full max-w-md place-items-center">
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
