import type { Metadata } from "next";
import { listServices } from "@/lib/airtable/read";
import type { Service } from "@/lib/airtable/types";
import { PageHeader } from "@/components/site/page-header";
import { Section } from "@/components/site/section";
import { ServiceCard } from "@/components/site/service-card";
import { StaggerGrid, StaggerItem } from "@/components/site/motion";
import { JsonLd } from "@/components/site/json-ld";
import { breadcrumbLd } from "@/lib/jsonld";

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
      <Section>
        <StaggerGrid className="grid gap-6 md:grid-cols-3">
          {services.map((service) => (
            <StaggerItem key={service.id} className="h-full">
              <ServiceCard service={service} />
            </StaggerItem>
          ))}
        </StaggerGrid>

        <p className="mt-10 rounded-lg border border-dashed border-border bg-card/40 p-6 text-center text-muted-foreground">
          <span className="font-display text-lg font-semibold text-foreground">
            Not sure where to start?
          </span>
          <br />
          Tell us about your project and your goals and we&apos;ll point you to
          the right fit, or build something custom.
        </p>
      </Section>
    </>
  );
}
