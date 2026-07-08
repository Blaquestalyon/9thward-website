import type { Metadata } from "next";
import Link from "next/link";
import { Disc3, LineChart, Megaphone } from "lucide-react";
import { PageHeader } from "@/components/site/page-header";
import { Section } from "@/components/site/section";
import { FadeUp } from "@/components/site/motion";
import { JsonLd } from "@/components/site/json-ld";
import { breadcrumbLd } from "@/lib/jsonld";
import { Button } from "@/components/ui/button";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description:
    "9th Ward Production & Promotions is a Houston-based indie music label with New Orleans roots. Co-founded in 2010 by Jay Davis and Shakara Weston, working with independent artists across the South.",
};

// About copy reflects the real origin story: Jay Davis moved to Houston in 2010
// and started meeting artists who'd migrated from New Orleans after Katrina;
// Jay met Shakara Weston in 2012, formed S4TF, and in 2015 the production company
// became a full independent label. Still based in Houston, TX.
const WHAT_WE_DO = [
  {
    icon: Disc3,
    title: "Production",
    body: "Beats, recording, mixing, and mastering. We help artists get a record that sounds like it belongs next to anything on the charts. [Add your in-house producers, studio, or notable credits here.]",
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
        description="Houston-based, New Orleans in the DNA. We produce, manage, and promote independent artists who have the talent and the work ethic to go the distance."
      />

      <Section className="max-w-3xl">
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
              moved to Houston, he started connecting with independent artists
              and testing a simple idea: that indie artists could build real
              careers, make real money, and keep control of their work without
              surrendering themselves to the predatory side of the music
              industry.
            </p>
            <p>
              As Jay worked the Houston music scene, he kept meeting artists
              from New Orleans who had been displaced by Hurricane Katrina and
              had made Houston their new home. Many of them were still carrying
              the sound, culture, pain, and pride of New Orleans with them.
              That connection gave the name its first layer of meaning.
            </p>
          </div>
        </FadeUp>

        <FadeUp className="mt-10">
          <h3 className="font-display text-xl font-semibold sm:text-2xl">
            A play on words
          </h3>
          <div className="mt-4 space-y-4 text-lg leading-relaxed text-foreground/90">
            <p>
              9th Ward also became a play on words. The Ninth Ward is a real
              place in New Orleans. The number nine is the last and highest
              single digit in our number system. And a ward is a place of
              protection. So, at first, Jay used the name almost like a saying:
              if you were an indie artist trying to survive, stay independent,
              and make a living without being exploited, you needed to come to
              the 9th Ward.
            </p>
          </div>
          <blockquote className="mt-6 border-l-2 border-primary/70 pl-5 font-display text-lg italic text-foreground/90 sm:text-xl">
            <p>It meant protection.</p>
            <p>It meant independence.</p>
            <p>
              It meant this is where artists could live safely inside the
              music business.
            </p>
          </blockquote>
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
              artist to fully buy into Jay&apos;s model, even vetting the plan
              through her father before committing to the journey.
            </p>
            <p>
              Together, Jay and Shakara formed the female group{" "}
              <strong className="font-semibold text-foreground">Somethin&apos; 4 The Fellas</strong>,
              also known as{" "}
              <strong className="font-semibold text-foreground">S4TF</strong>,
              with Jay producing and Shakara as the first member. The model
              worked. It was no longer just a theory, a pitch, or a name Jay
              was using in the Houston music scene. It had an artist, a sound,
              a system, and proof.
            </p>
            <p>
              That partnership became the foundation of{" "}
              <strong className="font-semibold text-foreground">
                9th Ward Production &amp; Promotions Company, LLC
              </strong>.
            </p>
            <p>
              Jay brought the brand, the model, and the mission. Shakara
              brought belief, talent, discipline, and the desire to help other
              artists benefit from the same system. Together, they turned 9th
              Ward from a name associated with Jay into a company, then into
              an independent label built around the same principle that
              started it all:
            </p>
          </div>
          <blockquote className="mt-6 border-l-2 border-primary/70 pl-5 font-display text-lg italic text-foreground sm:text-xl">
            protect the artist, protect the art, and build without compromise.
          </blockquote>
        </FadeUp>

        <FadeUp className="mt-10">
          <h3 className="font-display text-xl font-semibold sm:text-2xl">
            Houston to New Orleans to the Bronx and beyond
          </h3>
          <div className="mt-4 space-y-4 text-lg leading-relaxed text-foreground/90">
            <p>
              Since then, 9th Ward has helped independent artists turn raw
              talent into finished records, real audiences, and paying
              opportunities. We are still based in Houston, Texas, with New
              Orleans in our DNA, and our roster reaches from Houston to New
              Orleans to the Bronx and beyond.
            </p>
            <p>
              The artists may come from different cities and different sounds,
              but they all share the same thing: they show up, they put in the
              work, and they mean it.
            </p>
          </div>
        </FadeUp>

        <FadeUp className="mt-10" id="imused">
          <h3 className="font-display text-xl font-semibold sm:text-2xl">
            2025 &mdash; the mission enters a new era
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
              </a>, introduced publicly as the first ethical AI music platform
              built to protect, credit, and pay artists when their Musical DNA
              helps inspire new music.
            </p>
            <p>
              For 9th Ward, iMused.ai was not a departure from the original
              mission. It was the same mission entering a new era.
            </p>
            <p>
              Where many AI music tools raise questions about consent, credit,
              ownership, and exploitation, iMused.ai was built around the
              opposite principle: artists should not disappear inside the
              machine. They should be seen, credited, protected, and paid.
            </p>
            <p>
              Through{" "}
              <em className="font-medium text-foreground">
                Musical DNA Technology&trade;
              </em>, public attribution, PRO registration, co-producer credit,
              and auditable royalty participation, iMused.ai gives artists a
              way to participate in AI-powered music creation without being
              erased by it.
            </p>
          </div>
          <blockquote className="mt-6 border-l-2 border-gold/70 pl-5 font-display text-lg italic text-foreground sm:text-xl">
            <p>Different technology. Same mission.</p>
            <p className="mt-1">
              Protect the art. Pay the artist. Build without compromise.
            </p>
          </blockquote>
        </FadeUp>

        <FadeUp className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border border-border bg-card p-5">
            <p className="font-display text-2xl font-bold text-primary">2010</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Jay Davis lands in Houston. The name, and the model behind it,
              take shape.
            </p>
          </div>
          <div className="rounded-lg border border-border bg-card p-5">
            <p className="font-display text-2xl font-bold text-primary">2012</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Shakara Weston joins the mission; S4TF is formed and the
              9th Ward LLC takes root.
            </p>
          </div>
          <div className="rounded-lg border border-border bg-card p-5">
            <p className="font-display text-2xl font-bold text-primary">2015</p>
            <p className="mt-1 text-sm text-muted-foreground">
              9th Ward grows into a full independent record label.
            </p>
          </div>
          <div className="rounded-lg border border-gold/40 bg-gold/[0.06] p-5">
            <p className="font-display text-2xl font-bold text-gold">2025</p>
            <p className="mt-1 text-sm text-muted-foreground">
              ImUsed.ai launches with the 144K Collective &mdash; the first
              ethical AI music platform.
            </p>
          </div>
        </FadeUp>
      </Section>

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
              If you&apos;re an indie artist who&apos;s serious about the work, we
              want to hear you.
            </p>
          </div>
        </FadeUp>

        <FadeUp className="mt-10 rounded-2xl border border-border bg-card p-8">
          <h2 className="font-display text-2xl font-bold">Work With Us</h2>
          <p className="mt-3 text-muted-foreground">
            Two ways in. If you want to be managed or featured on the roster,
            send us your music through the submission page. If you&apos;re looking
            for production, management, or promotion, tell us what you need
            through Contact and we&apos;ll take it from there.
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
