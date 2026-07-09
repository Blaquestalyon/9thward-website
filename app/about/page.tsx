import type { Metadata } from "next";
import Link from "next/link";
import { Disc3, LineChart, Megaphone } from "lucide-react";
import { PageHeader } from "@/components/site/page-header";
import { Section } from "@/components/site/section";
import { FadeUp } from "@/components/site/motion";
import { JsonLd } from "@/components/site/json-ld";
import { breadcrumbLd } from "@/lib/jsonld";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description:
    "9th Ward Production & Promotions was born to protect independent artists. New Orleans gave the name meaning. Houston gave the mission a home. El Paso proved the model could scale. Today, 9th Ward is international.",
};

// About copy reflects the founder-led origin: the 9th Ward name and model began
// in Houston in 2010 as Jay Davis' artist-protection brand, shaped in part by
// post-Katrina New Orleans artists he met in Houston. Shakara Weston became the
// first artist to fully buy in in 2012. Jay and Shakara co-founded
// 9th Ward Production & Promotions Company, LLC in 2015. In 2017-18 the model
// extended into venue ownership via The Foundation in El Paso. Today the reach
// is international.

const FOUNDERS = [
  {
    name: "Jay Davis",
    role: "Co-founder · aka Blaquestalyon",
    initials: "JD",
    line: "Brought the brand, the model, and the mission — a producer and artist set on building careers the independent way.",
  },
  {
    name: "Shakara Weston",
    role: "Co-founder",
    initials: "SW",
    line: "The first artist to fully buy in — she brought the belief, discipline, and drive to bring the model to other artists.",
  },
];

const TIMELINE = [
  {
    year: "2010",
    text: "The 9th Ward name begins in Houston as Jay Davis' artist-protection brand and independent music model.",
  },
  {
    year: "2012",
    text: "Shakara Weston becomes the first artist to buy in; together they form Somethin' 4 The Fellas (S4TF).",
  },
  {
    year: "2015",
    text: "Jay and Shakara formally found 9th Ward Production & Promotions Company, LLC.",
  },
  {
    year: "2017–18",
    text: "The Foundation develops in El Paso as a community-owned venue model built around artist ownership.",
  },
  {
    year: "2025",
    text: "9th Ward and the 144K Collective launch iMused.ai, the first ethical AI music platform.",
    gold: true,
  },
  {
    year: "Today",
    text: "Based in Houston with international reach — from El Paso and the Bronx to Seoul, Aruba, and beyond.",
  },
];

const REACH = [
  "New Orleans",
  "Houston",
  "El Paso",
  "The Bronx",
  "South Korea",
  "Aruba",
  "UK / Nigeria",
];

const WHAT_WE_DO = [
  {
    icon: Disc3,
    title: "Production",
    body: "Beats, recording, mixing, and mastering. We help artists get a record that sounds like it belongs next to anything on the charts.",
  },
  {
    icon: LineChart,
    title: "Management",
    body: "The strategy and the business side most artists don't have time for. Release planning, branding, bookings, and the long game of building a career instead of chasing one moment.",
  },
  {
    icon: Megaphone,
    title: "Promotion",
    body: "Getting the music in front of the people who matter. Playlists, press, and social campaigns, plus the grassroots push that actually moves streams and fills rooms.",
  },
];

export default function AboutPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbLd([
          { name: "Home", path: "/" },
          { name: "About", path: "/about" },
        ])}
      />
      <PageHeader
        eyebrow="9th Ward Production & Promotions"
        title="Indie artists, built from the ground up."
        description="Born to protect independent artists. New Orleans gave the name meaning. Houston gave the mission a home. El Paso proved the model could scale. Today, 9th Ward reaches wherever serious artists are building without compromise."
      />

      {/* Founders */}
      <Section className="pb-0">
        <FadeUp>
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-gold">
            The people
          </p>
          <h2 className="font-display text-2xl font-bold sm:text-3xl">
            Founders
          </h2>
        </FadeUp>
        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          {FOUNDERS.map((f) => (
            <FadeUp
              key={f.name}
              className="flex gap-5 rounded-2xl border border-border bg-card p-6"
            >
              <span
                aria-hidden
                className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-border bg-primary/15 font-display text-lg font-bold text-primary"
              >
                {f.initials}
              </span>
              <div>
                <p className="font-display text-lg font-semibold">{f.name}</p>
                <p className="text-sm font-medium text-gold">{f.role}</p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {f.line}
                </p>
              </div>
            </FadeUp>
          ))}
        </div>
      </Section>

      {/* Timeline — the spine of the story */}
      <Section>
        <FadeUp className="max-w-2xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-gold">
            The journey
          </p>
          <h2 className="font-display text-2xl font-bold sm:text-3xl">
            Fifteen years, one standard
          </h2>
        </FadeUp>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
          {TIMELINE.map((t) => (
            <FadeUp
              key={t.year}
              className={
                t.gold
                  ? "rounded-xl border border-gold/40 bg-gold/[0.06] p-5"
                  : "rounded-xl border border-border bg-card p-5"
              }
            >
              <span
                aria-hidden
                className={
                  t.gold
                    ? "mb-3 block h-2.5 w-2.5 rounded-full bg-gold"
                    : "mb-3 block h-2.5 w-2.5 rounded-full bg-primary"
                }
              />
              <p
                className={
                  t.gold
                    ? "font-display text-xl font-bold text-gold"
                    : "font-display text-xl font-bold"
                }
              >
                {t.year}
              </p>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                {t.text}
              </p>
            </FadeUp>
          ))}
        </div>
      </Section>

      {/* International reach */}
      <Section className="pt-0">
        <FadeUp className="rounded-2xl border border-border bg-card p-6 sm:p-8">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-gold">
            International reach
          </p>
          <p className="max-w-3xl text-muted-foreground">
            Our foundation runs through New Orleans, Houston, El Paso, and the
            Bronx — and our artists and collaborators now connect us to South
            Korea, Aruba, and the UK by way of Nigeria.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {REACH.map((place) => (
              <Badge key={place} variant="secondary" className="text-sm">
                {place}
              </Badge>
            ))}
          </div>
        </FadeUp>
      </Section>

      {/* Our story — narrative with a pull-quote sidebar */}
      <Section className="pt-0">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,42rem)_18rem] lg:justify-between lg:gap-16">
          <div>
            <FadeUp>
              <h2 className="font-display text-2xl font-bold sm:text-3xl">
                Our Story
              </h2>
              <div className="mt-4 space-y-4 text-lg leading-relaxed text-foreground/90">
                <p>
                  The name 9th Ward began in Houston in 2010, before there was a
                  company, a label, or a roster.
                </p>
                <p>
                  When Jay Davis, also known as{" "}
                  <strong className="font-semibold text-foreground">Blaquestalyon</strong>,
                  moved to Houston, he started connecting with independent
                  artists and testing a simple idea: that indie artists could
                  build real careers, make real money, and keep control of their
                  work without surrendering themselves to the predatory side of
                  the music industry.
                </p>
                <p>
                  As Jay worked the Houston music scene, he kept meeting artists
                  from New Orleans who had been displaced by Hurricane Katrina
                  and had made Houston their new home. Many of them were still
                  carrying the pride, culture, and survival spirit of New Orleans
                  with them. That connection helped give the name its meaning.
                </p>
              </div>
            </FadeUp>

            <FadeUp className="mt-10">
              <h3 className="font-display text-xl font-semibold sm:text-2xl">
                A play on words
              </h3>
              <div className="mt-4 space-y-4 text-lg leading-relaxed text-foreground/90">
                <p>
                  &ldquo;9th Ward&rdquo; is a deliberate play on words. The Ninth
                  Ward is a real place in New Orleans. The number nine is the
                  highest and final single digit in our number system. And a
                  ward is a place of protection. So, at first, Jay used the name
                  almost like a saying: if you were an independent artist trying
                  to survive, stay independent, and make a living without being
                  exploited, you needed to &ldquo;come to the 9th Ward&rdquo;.
                </p>
              </div>
            </FadeUp>

            <FadeUp className="mt-10">
              <h3 className="font-display text-xl font-semibold sm:text-2xl">
                From a name to a company
              </h3>
              <div className="mt-4 space-y-4 text-lg leading-relaxed text-foreground/90">
                <p>
                  In 2012, Jay met{" "}
                  <strong className="font-semibold text-foreground">Shakara Weston</strong>,
                  a Houston native with the ear, discipline, and belief to help
                  turn the idea into something real. Shakara became the first
                  artist to fully buy into Jay&apos;s model, even vetting the
                  plan through her father before committing to the journey.
                </p>
                <p>
                  Together, Jay and Shakara formed the female group{" "}
                  <strong className="font-semibold text-foreground">Somethin&apos; 4 The Fellas</strong>,
                  also known as{" "}
                  <strong className="font-semibold text-foreground">S4TF</strong>,
                  with Jay producing and Shakara as the first member. The model
                  worked. It was no longer just a theory, a pitch, or a name Jay
                  was using in the Houston music scene. It had an artist, a
                  sound, a system, and proof.
                </p>
                <p>
                  That partnership became the foundation of{" "}
                  <strong className="font-semibold text-foreground">
                    9th Ward Production &amp; Promotions Company, LLC
                  </strong>.
                </p>
                <p>
                  Jay brought the brand, the model, and the mission. Shakara
                  brought belief, talent, discipline, and the desire to help
                  other artists benefit from the same system. Together, they
                  turned 9th Ward from a name associated with Jay into a company,
                  then into an independent label built around the same principle
                  that started it all: protect the artist, protect the art, and
                  build without compromise.
                </p>
              </div>
            </FadeUp>

            <FadeUp className="mt-10">
              <h3 className="font-display text-xl font-semibold sm:text-2xl">
                The story did not stay in one city
              </h3>
              <div className="mt-4 space-y-4 text-lg leading-relaxed text-foreground/90">
                <p>
                  New Orleans gave the name meaning. Houston gave the mission a
                  home. The Bronx helped carry the roster and creative reach
                  beyond its first borders. And in El Paso, 9th Ward helped push
                  the model even further through{" "}
                  <a
                    href="https://www.power-in-numbers.net/track-record/2017-foundation-venu/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-primary underline-offset-4 hover:underline"
                  >
                    The Foundation
                  </a>
                  , a community-owned venue concept designed around artist
                  participation, public access, and shared ownership.
                </p>
                <p>
                  The Foundation matters because it showed that 9th Ward was
                  never only about making records. The mission was bigger than
                  the studio. It was about building systems where artists could
                  own more, earn more, and participate more fully in the business
                  created around their work.
                </p>
                <p>
                  Today, 9th Ward is still based in Houston, Texas, but its reach
                  is international. Our foundation runs through New Orleans,
                  Houston, El Paso, and the Bronx, and our artists and
                  collaborators now connect us to South Korea, Aruba, the UK by
                  way of Nigeria, and beyond.
                </p>
                <p>
                  Every artist may come from a different place, but the standard
                  is the same: they show up, they put in the work, and they mean
                  it.
                </p>
              </div>
            </FadeUp>

            <FadeUp className="mt-10 scroll-mt-28" id="imused">
              <h3 className="font-display text-xl font-semibold sm:text-2xl">
                2025: the mission enters a new era
              </h3>
              <div className="mt-4 space-y-4 text-lg leading-relaxed text-foreground/90">
                <p>
                  In 2025, we took the mission further. Together with the{" "}
                  <strong className="font-semibold text-foreground">144K Collective</strong>,
                  9th Ward helped launch{" "}
                  <a
                    href="https://imused.ai"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-primary underline-offset-4 hover:underline"
                  >
                    iMused.ai
                  </a>, introduced publicly as the first ethical AI music
                  platform built to protect, credit, and pay artists when their
                  Musical DNA helps inspire new music.
                </p>
                <p>
                  For 9th Ward, iMused.ai was not a departure from the original
                  mission. It was the same mission entering a new era.
                </p>
                <p>
                  Where many AI music tools raise questions about consent,
                  credit, ownership, and exploitation, iMused.ai was built around
                  the opposite principle: artists should not disappear inside the
                  machine. They should be seen, credited, protected, and paid.
                </p>
                <p>
                  Through{" "}
                  <em className="font-medium text-foreground">
                    Musical DNA Technology&trade;
                  </em>, public attribution, PRO registration, co-producer
                  credit, and auditable royalty participation, iMused.ai gives
                  artists a way to participate in AI-powered music creation
                  without being erased by it.
                </p>
              </div>
              <blockquote className="mt-6 border-l-2 border-gold/70 pl-5 font-display text-lg italic text-foreground sm:text-xl">
                <p>Different technology. Same mission.</p>
                <p className="mt-1">
                  Protect the art. Pay the artist. Build without compromise.
                </p>
              </blockquote>
            </FadeUp>
          </div>

          {/* Pull-quote sidebar */}
          <aside className="hidden lg:block">
            <FadeUp
              delay={0.1}
              className="sticky top-24 rounded-2xl border border-border bg-card/60 p-6"
            >
              <blockquote className="border-l-2 border-primary/70 pl-5 font-display text-xl italic leading-relaxed text-foreground/90">
                <p>It meant protection.</p>
                <p className="mt-2">It meant independence.</p>
                <p className="mt-2">
                  It meant this is where artists could live safely inside the
                  music business.
                </p>
              </blockquote>
            </FadeUp>
          </aside>
        </div>
      </Section>

      {/* What We Do */}
      <Section className="pt-0">
        <FadeUp>
          <h2 className="font-display text-2xl font-bold sm:text-3xl">
            What We Do
          </h2>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            We handle the three things that make or break an independent career.
          </p>
        </FadeUp>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {WHAT_WE_DO.map((item) => (
            <FadeUp key={item.title}>
              <div className="h-full rounded-lg border border-border bg-card p-6">
                <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <item.icon className="h-5 w-5" />
                </div>
                <h3 className="font-display text-xl font-semibold">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {item.body}
                </p>
              </div>
            </FadeUp>
          ))}
        </div>
      </Section>

      {/* How We Work + Work With Us */}
      <Section className="max-w-3xl pt-0">
        <FadeUp>
          <h2 className="font-display text-2xl font-bold sm:text-3xl">
            How We Work
          </h2>
          <div className="mt-4 space-y-4 text-lg leading-relaxed text-foreground/90">
            <p>
              We&apos;re selective on purpose. We take on artists we believe in
              and give them real attention, not a spot on a list. That means
              honest feedback, a clear plan, and a team that answers when you
              call.
            </p>
            <p>
              If you&apos;re an indie artist who&apos;s serious about the work,
              we want to hear you.
            </p>
          </div>
        </FadeUp>

        <FadeUp className="mt-10 rounded-2xl border border-border bg-card p-8">
          <h2 className="font-display text-2xl font-bold">Work With Us</h2>
          <p className="mt-3 text-muted-foreground">
            Two ways in. If you want to be managed or featured on the roster,
            send us your music through the submission page. If you&apos;re
            looking for production, management, or promotion, tell us what you
            need through Contact and we&apos;ll take it from there.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href="/submit">Submit Your Music</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/services">Explore Our Services</Link>
            </Button>
          </div>
          <p className="mt-6 text-xs text-muted-foreground">
            Based in Houston, TX &middot; {SITE.address.formatted}
          </p>
        </FadeUp>
      </Section>
    </>
  );
}
