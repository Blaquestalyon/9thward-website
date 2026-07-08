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
              9th Ward started in Houston in 2010, when co-founder Jay Davis
              moved to the city and set out to build a production company. The
              first artists he found were people carrying New Orleans with them
              &mdash; musicians who had landed in Houston after Katrina and were
              still making the sound of home. That&apos;s where the name comes
              from, and it&apos;s never left the work.
            </p>
            <p>
              In 2012 Jay met Shakara Weston, a Houston native with the ear and
              the drive to match. Together they built the group
              {" "}<strong className="font-semibold text-foreground">Somethin&apos; 4 The Fellas (S4TF)</strong>{" "}
              &mdash; Jay producing, Shakara the first member. That partnership
              became the foundation of what 9th Ward is now.
            </p>
            <p>
              In 2015 we grew from a production company into a full independent
              label. Since then we&apos;ve helped indie artists turn raw talent
              into finished records, real audiences, and paying opportunities.
              We&apos;re still based in Houston, TX, and our roster runs from
              Houston to New Orleans to the Bronx and beyond &mdash; every artist
              on it shares the same thing: they show up, they put in the work,
              and they mean it.
            </p>
            <p id="imused">
              In 2025 we took the mission further. Together with the{" "}
              <strong className="font-semibold text-foreground">144K Collective</strong>,
              we launched{" "}
              <a
                href="https://imused.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-primary underline-offset-4 hover:underline"
              >
                ImUsed.ai
              </a>{" "}
              &mdash; the first ethical AI music platform. Where most AI tools
              treat artists as training data, ImUsed protects them: every song
              built from an artist&apos;s{" "}
              <em className="font-medium text-foreground">Musical DNA</em>{" "}
              earns them an auditable 10&ndash;20% royalty share and full
              co-producer credit, with public attribution and PRO registration
              on every commercial release. Same principle we&apos;ve stood on
              since 2010: protect the art, pay the artist, and build without
              compromise.
            </p>
          </div>
        </FadeUp>

        <FadeUp className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border border-border bg-card p-5">
            <p className="font-display text-2xl font-bold text-primary">2010</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Production company founded in Houston by Jay Davis.
            </p>
          </div>
          <div className="rounded-lg border border-border bg-card p-5">
            <p className="font-display text-2xl font-bold text-primary">2012</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Shakara Weston joins as co-founder; S4TF is formed.
            </p>
          </div>
          <div className="rounded-lg border border-border bg-card p-5">
            <p className="font-display text-2xl font-bold text-primary">2015</p>
            <p className="mt-1 text-sm text-muted-foreground">
              9th Ward becomes a full independent record label.
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
