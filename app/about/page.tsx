import type { Metadata } from "next";
import Link from "next/link";
import { Disc3, LineChart, Megaphone } from "lucide-react";
import { PageHeader } from "@/components/site/page-header";
import { Section } from "@/components/site/section";
import { FadeUp } from "@/components/site/motion";
import { JsonLd } from "@/components/site/json-ld";
import { breadcrumbLd } from "@/lib/jsonld";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "About",
  description:
    "9th Ward started in New Orleans with a simple belief: independent artists don't need permission to build a career, they need the right team behind them.",
};

// NOTE: Copy below is verbatim from the brand's About page doc. The [2015]
// founding year is a placeholder from the old site's copyright — kept visible.
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
        description="We produce, manage, and promote independent artists who have the talent and the work ethic to go the distance."
      />

      <Section className="max-w-3xl">
        <FadeUp>
          <h2 className="font-display text-2xl font-bold sm:text-3xl">
            Our Story
          </h2>
          <div className="mt-4 space-y-4 text-lg leading-relaxed text-foreground/90">
            <p>
              9th Ward started in New Orleans with a simple belief: independent
              artists don&apos;t need permission to build a career, they need the
              right team behind them. Since [2015], we&apos;ve helped indie artists
              turn raw talent into finished records, real audiences, and paying
              opportunities.
            </p>
            <p>
              The name is a nod to where we come from. The reach is wherever the
              music takes us. Our roster runs from New Orleans to the Bronx and
              beyond, and every artist on it shares the same thing: they show up,
              they put in the work, and they mean it.
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
        </FadeUp>
      </Section>
    </>
  );
}
