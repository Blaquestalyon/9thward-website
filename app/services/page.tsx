import type { Metadata } from "next";
import Link from "next/link";
import { listServices } from "@/lib/airtable/read";
import type { Service } from "@/lib/airtable/types";
import { PageHeader } from "@/components/site/page-header";
import { Section, SectionHeader } from "@/components/site/section";
import { ServiceCard } from "@/components/site/service-card";
import { StaggerGrid, StaggerItem, FadeUp } from "@/components/site/motion";
import { JsonLd } from "@/components/site/json-ld";
import { breadcrumbLd } from "@/lib/jsonld";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Production, management, and promotion for independent artists. Inquiry-only — no pricing, just a conversation.",
};

/**
 * Fallback services copy — verbatim from the brand copy doc. Used only when the
 * Airtable Services table is empty, so the page has content on first deploy.
 * Move these into Airtable to edit without code.
 */
const FALLBACK_SERVICES: Service[] = [
  {
    id: "svc-production",
    name: "Production",
    slug: "production",
    summary: "From first take to final master.",
    details:
      "Recording, production, mixing, and mastering under one roof. We help you get a record that sounds finished and competitive, not homemade. Whether you're cutting a single or building a full project, we shape the sound with you and hand back something you're proud to release. [Add studio, gear, or producer credits here.]",
    sortOrder: 1,
    active: true,
  },
  {
    id: "svc-management",
    name: "Management",
    slug: "management",
    summary: "The business, handled, so you can focus on the music.",
    details:
      "Day-to-day guidance and the strategy that turns talent into a career. Release planning, branding, bookings, and the decisions that are easy to get wrong on your own. We take on a small number of artists on purpose and give each one real attention. This is a long-game partnership, not a favor.",
    sortOrder: 2,
    active: true,
  },
  {
    id: "svc-promotion",
    name: "Promotion",
    slug: "promotion",
    summary: "Get heard by the people who matter.",
    details:
      "Playlist pitching, press outreach, and social campaigns built around your release. We target the right curators, blogs, and audiences and run the push so your music actually reaches ears instead of sitting on a page. We pitch hard and report honestly. Placements are earned, never guaranteed.",
    sortOrder: 3,
    active: true,
  },
];

const PROCESS = [
  {
    step: "1",
    title: "Submit",
    body: "Send us your music and where you want to take it through the submission page.",
  },
  {
    step: "2",
    title: "Sit-down",
    body: "We talk honestly about your goals, your sound, and whether we're the right fit.",
  },
  {
    step: "3",
    title: "Plan",
    body: "You get a clear plan — release strategy, roles, and a timeline, not a price sheet.",
  },
  {
    step: "4",
    title: "Build & release",
    body: "We produce, manage, and promote the work, and report back honestly at every step.",
  },
];

const PROOF = [
  { value: "16 yrs", label: "independent" },
  { value: "102K", label: "YouTube subscribers" },
  { value: "2.6M+", label: "views, top video" },
  { value: "Press", label: "Yahoo Finance & more" },
];

export default async function ServicesPage() {
  const fromAirtable = await listServices();
  const services = fromAirtable.length > 0 ? fromAirtable : FALLBACK_SERVICES;

  return (
    <>
      <JsonLd
        data={breadcrumbLd([
          { name: "Home", path: "/" },
          { name: "Services", path: "/services" },
        ])}
      />
      <PageHeader
        eyebrow="What we do"
        title="Services"
        description="Three ways we help independent artists move. Every engagement is built around the artist, so we start with a conversation, not a price sheet. Tell us where you are and where you want to go."
      />

      {/* Service cards */}
      <Section>
        <StaggerGrid className="grid gap-6 md:grid-cols-3">
          {services.map((service) => (
            <StaggerItem key={service.id} className="h-full">
              <ServiceCard service={service} />
            </StaggerItem>
          ))}
        </StaggerGrid>
      </Section>

      {/* How we work */}
      <Section className="pt-0">
        <SectionHeader
          eyebrow="How we work"
          title="From first listen to release"
          description="We're selective on purpose. A small roster, real attention, and a team that answers when you call."
        />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {PROCESS.map((p) => (
            <FadeUp
              key={p.step}
              className="relative h-full rounded-xl border border-border bg-card p-6"
            >
              <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full border border-primary/35 bg-primary/15 font-display text-base font-bold text-primary">
                {p.step}
              </div>
              <h3 className="font-display text-lg font-semibold">{p.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {p.body}
              </p>
            </FadeUp>
          ))}
        </div>
      </Section>

      {/* Proof band */}
      <Section className="pt-0">
        <FadeUp>
          <dl className="grid grid-cols-2 gap-4 rounded-2xl border border-border bg-card p-6 sm:p-8 lg:grid-cols-4">
            {PROOF.map((s) => (
              <div key={s.label} className="text-center">
                <dt className="font-display text-2xl font-bold text-primary sm:text-3xl">
                  {s.value}
                </dt>
                <dd className="mt-1 text-sm text-muted-foreground">{s.label}</dd>
              </div>
            ))}
          </dl>
        </FadeUp>
      </Section>

      {/* Closing CTA */}
      <Section className="pt-0">
        <FadeUp className="flex flex-col items-start justify-between gap-6 rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/12 via-card to-card p-8 md:flex-row md:items-center md:p-12">
          <div>
            <h2 className="font-display text-2xl font-bold sm:text-3xl">
              Tell us what you need
            </h2>
            <p className="mt-2 max-w-md text-muted-foreground">
              Not sure where to start? Tell us about your project and your goals
              and we&apos;ll point you to the right fit, or build something
              custom.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href="/contact">Start a project</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/submit">Submit your music</Link>
            </Button>
          </div>
        </FadeUp>
      </Section>
    </>
  );
}
