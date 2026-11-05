"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Home hero: the feature art itself, with invisible hotspot links over every
 * card and label baked into it.
 *
 * FRAGILE: positions are % of public/img/hero-9thward.webp (2200x1238). If the
 * art changes, re-measure (see "Redesign" in HANDOFF.md) and keep HERO_W/H in
 * sync with the file's real pixel size so the box never drifts from the art.
 * Below 760px the hotspots hide and the HTML cards underneath take over.
 */
const HERO_W = 2200;
const HERO_H = 1238;

type Spot = {
  label: string; // aria-label
  href?: string; // no href = "coming soon"
  box: [left: number, top: number, width: number, height: number];
};

const SPOTS: Spot[] = [
  { label: "9th Ward Production & Promotions: our story", href: "/about", box: [5, 6, 25.5, 46] },
  { label: "Born to protect independent artists: read our story", href: "/about", box: [4.5, 53.5, 28.5, 13] },
  { label: "Production, management and promotion services", href: "/services", box: [2.5, 67, 30, 4.5] },
  { label: "Artists and roster", href: "/artists", box: [30.8, 5.5, 21.4, 29.5] },
  { label: "Music releases", href: "/music", box: [53.6, 1.5, 20.2, 32.5] },
  { label: "Live events", href: "/events", box: [75, 3, 22.8, 31] },
  { label: "Independent film (coming soon)", box: [32.4, 36, 14, 23] },
  { label: "iMused.ai: ethical AI, musical DNA", href: "/about#imused", box: [77.6, 34.8, 20.8, 21.4] },
  { label: "Production services", href: "/services", box: [4.6, 85.5, 13.6, 9] },
  { label: "Artist management services", href: "/services", box: [18.7, 85.5, 13.6, 9] },
  { label: "Promotion services", href: "/services", box: [32.7, 85.5, 12.2, 9] },
  { label: "Music and video", href: "/music", box: [45.1, 85.5, 14.5, 9] },
  { label: "Live events and shows", href: "/events", box: [60, 85.5, 12.3, 9] },
  { label: "Film (coming soon)", box: [72.6, 85.5, 8.8, 9] },
  { label: "Ethical AI: iMused.ai", href: "/about#imused", box: [81.9, 85.5, 13.8, 9] },
];

/** Phone cards: wording reused from the art. */
const CARDS: { title: string; sub?: string; href?: string }[] = [
  { title: "Artists & Roster", href: "/artists" },
  { title: "Music Releases", href: "/music" },
  { title: "Live Events", href: "/events" },
  { title: "Independent Film" },
  { title: "iMused.ai", sub: "Ethical AI · Musical DNA", href: "/about#imused" },
];

function comingSoon(what: string) {
  toast(`${what}: coming soon`, { id: "coming-soon" });
}

/**
 * Intro clip (public/img/hero-9thward.mp4) plays once, muted, then dissolves
 * into the still. It's cut at 2.3s on purpose: the source clip's later frames
 * still read "Roots in New Orleans", which breaks the brand rules.
 */
function useIntro() {
  const ref = useRef<HTMLVideoElement>(null);
  const [phase, setPhase] = useState<"intro" | "play" | "done">("intro");
  useEffect(() => {
    const v = ref.current;
    if (!v || matchMedia("(prefers-reduced-motion: reduce)").matches) return setPhase("done");
    const end = () => (v.pause(), setPhase("done"));
    const stall = setTimeout(end, 3000); // never started: show the still
    v.muted = true;
    v.play().then(() => (clearTimeout(stall), setPhase((p) => (p === "intro" ? "play" : p))), end);
    v.addEventListener("ended", end);
    v.addEventListener("error", end);
    return () => (clearTimeout(stall), v.removeEventListener("ended", end), v.removeEventListener("error", end));
  }, []);
  return { ref, phase };
}

export function HeroArt() {
  const intro = useIntro();
  return (
    <section aria-labelledby="hero-title" className="relative">
      <h1 id="hero-title" className="sr-only">
        9th Ward Production &amp; Promotions: born to protect independent
        artists. Production, management and promotion. Houston-based
        independent label, founded 2010.
      </h1>

      <div
        data-hero={intro.phase}
        className="relative mx-auto w-full max-w-[1920px]"
        style={{ aspectRatio: `${HERO_W} / ${HERO_H}` }}
      >
        <Image
          src="/img/hero-9thward.webp"
          alt=""
          fill
          priority
          sizes="(max-width: 1920px) 100vw, 1920px"
          className="hero-still object-cover"
        />
        <video
          ref={intro.ref}
          src="/img/hero-9thward.mp4"
          muted
          playsInline
          preload="auto"
          aria-hidden
          tabIndex={-1}
          className="hero-intro pointer-events-none absolute inset-0 h-full w-full object-cover"
        />
        <div className="hero-spots absolute inset-0 max-[759px]:hidden">
          {SPOTS.map((s) => {
            const [left, top, width, height] = s.box;
            const style = { left: `${left}%`, top: `${top}%`, width: `${width}%`, height: `${height}%` };
            return s.href ? (
              <Link key={s.label} href={s.href} aria-label={s.label} className="hotspot" style={style} />
            ) : (
              <button
                key={s.label}
                type="button"
                aria-label={s.label}
                className="hotspot cursor-pointer"
                style={style}
                onClick={() => comingSoon(s.label.replace(" (coming soon)", ""))}
              />
            );
          })}
        </div>
        {/* Fade the art's bottom edge into the page */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[8%] bg-gradient-to-b from-transparent to-background"
        />
      </div>

      {/* Phones: plain HTML navigation in place of the hotspots */}
      <div className="container pb-4 pt-3 min-[760px]:hidden">
        <p className="eyebrow text-[10px] tracking-[0.22em] before:w-5">Production · Management · Promotion</p>
        <div className="mt-4 grid grid-cols-2 gap-3">
          {CARDS.map((c, i) => {
            const cls = cn(
              "lift flex min-h-20 flex-col justify-between rounded-xl border border-gold/30 bg-card p-4 text-left",
              i === CARDS.length - 1 && "col-span-2"
            );
            const inner = (
              <>
                <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-foreground">
                  {c.title}
                </span>
                <span className="mt-2 flex items-center justify-between text-xs text-gold">
                  {c.sub ?? (c.href ? "Explore" : "Coming soon")}
                  {c.href && <ArrowRight className="h-3.5 w-3.5" />}
                </span>
              </>
            );
            return c.href ? (
              <Link key={c.title} href={c.href} className={cls}>
                {inner}
              </Link>
            ) : (
              <button key={c.title} type="button" className={cls} onClick={() => comingSoon(c.title)}>
                {inner}
              </button>
            );
          })}
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link href="/services" className="rounded-full border border-gold/40 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-gold">
            Production
          </Link>
          <Link href="/services" className="rounded-full border border-gold/40 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-gold">
            Artist Management
          </Link>
          <Link href="/services" className="rounded-full border border-gold/40 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-gold">
            Promotion
          </Link>
        </div>
      </div>
    </section>
  );
}
