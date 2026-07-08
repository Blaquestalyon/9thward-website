import Link from "next/link";
import { ArrowUpRight, Sparkles, ScrollText, Coins } from "lucide-react";
import { VENTURES } from "@/lib/site";
import { FadeUp } from "./motion";
import { Button } from "@/components/ui/button";

/**
 * Feature block for ImUsed.ai — the first ethical AI music platform,
 * powered by 9th Ward Production & Promotions and the 144K Collective.
 */
export function ImUsedFeature() {
  const venture = VENTURES.find((v) => v.key === "imused");
  if (!venture) return null;

  const pillars = [
    {
      icon: Sparkles,
      title: "Musical DNA Technology™",
      body: "Analyzes an artist's signature sound across 12+ dimensions — vocal patterns, harmonic preferences, and lyrical DNA.",
    },
    {
      icon: Coins,
      title: "10–20% royalty share",
      body: "When a Muse's DNA inspires a track, they automatically earn an auditable share and full co-producer credit.",
    },
    {
      icon: ScrollText,
      title: "Public, verifiable ledger",
      body: "PRO registration and public attribution built in. Ethical by design, compliant on every commercial release.",
    },
  ];

  return (
    <FadeUp className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-primary/10 via-card to-card p-6 sm:p-10 md:p-12">
      {/* Ambient glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-primary/25 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-32 -left-24 h-72 w-72 rounded-full bg-gold/15 blur-3xl"
      />

      <div className="relative grid gap-10 md:grid-cols-2 md:items-center">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-gold">
            <Sparkles className="h-3.5 w-3.5" />
            Our latest venture
          </div>
          <h2 className="mt-4 font-display text-3xl font-bold sm:text-4xl md:text-5xl">
            {venture.name}
          </h2>
          <p className="mt-3 text-lg text-foreground/90 sm:text-xl">
            {venture.tagline}
          </p>
          <p className="mt-5 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            {venture.description}
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Button asChild size="lg">
              <a href={venture.href} target="_blank" rel="noopener noreferrer">
                Visit ImUsed.ai
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </Button>
            <Button asChild size="lg" variant="ghost">
              <Link href="/about#imused">How it came together</Link>
            </Button>
          </div>
          <p className="mt-5 text-xs text-muted-foreground">
            Powered by 9th Ward Production & Promotions and the {venture.partner}.
          </p>
        </div>

        <ul className="grid gap-3">
          {pillars.map((p) => (
            <li
              key={p.title}
              className="flex gap-4 rounded-xl border border-border bg-background/60 p-5 backdrop-blur-sm"
            >
              <div className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
                <p.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="font-display text-lg font-semibold">{p.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {p.body}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </FadeUp>
  );
}
