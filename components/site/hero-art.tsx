"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Home hero: the feature art itself, with invisible hotspot links traced
 * around every card and label baked into it (an SVG over the image, so only
 * the inside of each outline is clickable).
 *
 * FRAGILE: points are pixels of public/img/hero-9thward.webp (1920x1080, the
 * intro clip's last frame), which is also the SVG viewBox. If the art changes,
 * re-trace (see "Redesign" in HANDOFF.md) and keep HERO_W/H in sync with the
 * file's real pixel size so the outlines never drift from the art.
 * Below 760px the hotspots hide and the HTML cards underneath take over.
 */
const HERO_W = 1920;
const HERO_H = 1080;

type Pt = [x: number, y: number];
const toward = ([x, y]: Pt, [tx, ty]: Pt, r: number) => {
  const l = Math.hypot(tx - x, ty - y);
  return `${+(x + ((tx - x) * r) / l).toFixed(1)} ${+(y + ((ty - y) * r) / l).toFixed(1)}`;
};
/** Path through the card's corners, rounded by r like the art's cards. */
function poly(pts: Pt[], r = 16) {
  const c = pts.map((p, i, a) => [toward(p, a.at(i - 1)!, r), `${p[0]} ${p[1]}`, toward(p, a[(i + 1) % a.length], r)]);
  return `M${c[0][2]}` + [...c.slice(1), c[0]].map(([a, p, b]) => `L${a}Q${p} ${b}`).join("") + "Z";
}
const rect = (x1: number, y1: number, x2: number, y2: number, r = 12) =>
  poly([[x1, y1], [x2, y1], [x2, y2], [x1, y2]], r);

/** The microphone stands in front of the Artists, Film and Music cards: cut out of every hotspot. */
const MIC = poly([[892, 302], [1022, 302], [1024, 444], [1072, 460], [1080, 540], [1074, 620], [860, 620], [855, 540], [860, 460], [890, 444]], 12);

type Spot = {
  label: string; // aria-label
  href?: string; // no href = "coming soon"
  d: string; // SVG path in hero pixels
};

const SPOTS: Spot[] = [
  {
    label: "9th Ward Production & Promotions: our story",
    href: "/about",
    // name plate + crosshair circle as one outline, then the wordmark below it
    d: "M145 72H497Q505 72 505 80V135H389A150 150 0 1 1 251 135H137V80Q137 72 145 72Z" + rect(83, 435, 575, 550, 10),
  },
  { label: "Born to protect independent artists: read our story", href: "/about", d: rect(83, 567, 611, 691) },
  { label: "Production, management and promotion services", href: "/services", d: rect(48, 702, 605, 750) },
  { label: "Artists and roster", href: "/artists", d: poly([[583, 102], [980, 61], [985, 352], [588, 368]]) },
  { label: "Music releases", href: "/music", d: poly([[1017, 72], [1396, 17], [1396, 346], [1021, 357]]) },
  {
    label: "Live events",
    href: "/events",
    d: poly([[1428, 87], [1851, 37], [1855, 222], [1868, 230], [1868, 325], [1740, 335], [1428, 352]]),
  },
  { label: "Independent film (coming soon)", d: poly([[612, 386], [896, 376], [900, 614], [612, 619]]) },
  { label: "iMused.ai: ethical AI, musical DNA", href: "/about#imused", d: poly([[1477, 384], [1866, 364], [1868, 582], [1478, 586]]) },
  // bottom bar: one segment per label, between the art's divider lines
  { label: "Production services", href: "/services", d: rect(78, 898, 342, 986, 24) },
  { label: "Artist management services", href: "/services", d: rect(349, 898, 606, 986) },
  { label: "Promotion services", href: "/services", d: rect(614, 898, 844, 986) },
  { label: "Music and video", href: "/music", d: rect(852, 898, 1118, 986) },
  { label: "Live events and shows", href: "/events", d: rect(1126, 898, 1369, 986) },
  { label: "Film (coming soon)", d: rect(1377, 898, 1546, 986) },
  { label: "Ethical AI: iMused.ai", href: "/about#imused", d: rect(1554, 898, 1814, 986, 24) },
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
 * into the still. Its last frame was generated to match the still, so the
 * hand-off has no size jump. Hotspots stay off until "done" (globals.css).
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
        <svg
          viewBox={`0 0 ${HERO_W} ${HERO_H}`}
          className="hero-spots absolute inset-0 h-full w-full max-[759px]:hidden"
        >
          <defs>
            <clipPath id="hero-no-mic">
              <path clipRule="evenodd" d={`M0 0H${HERO_W}V${HERO_H}H0Z${MIC}`} />
            </clipPath>
          </defs>
          <g clipPath="url(#hero-no-mic)">
            {SPOTS.map((s) => {
              const soon = () => comingSoon(s.label.replace(" (coming soon)", ""));
              return s.href ? (
                <Link key={s.label} href={s.href} aria-label={s.label} className="hotspot">
                  <path d={s.d} />
                </Link>
              ) : (
                // SVG has no <button>, so a role=button link with keyboard support
                <a
                  key={s.label}
                  role="button"
                  tabIndex={0}
                  aria-label={s.label}
                  className="hotspot cursor-pointer"
                  onClick={soon}
                  onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), soon())}
                >
                  <path d={s.d} />
                </a>
              );
            })}
          </g>
        </svg>
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
