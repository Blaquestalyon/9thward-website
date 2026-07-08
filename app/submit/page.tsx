import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";
import { PageHeader } from "@/components/site/page-header";
import { Section } from "@/components/site/section";
import { JsonLd } from "@/components/site/json-ld";
import { breadcrumbLd } from "@/lib/jsonld";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Submit Your Artist Profile",
  description:
    "Independent artist who's serious about the work? Submit your profile — we review every one and reach out when there's a fit.",
};

/**
 * Airtable-hosted form that writes directly to the Artists table.
 *
 * Base:       app3HHnUsEOOvO9ND
 * Form page:  pagxwnnGAwHRT7m1e
 *
 * New submissions land with Status blank; only records manually flipped to
 * Status = "Active" in Airtable render on the site (see lib/airtable/read.ts
 * → toArtist).
 */
const AIRTABLE_FORM_ID = "pagxwnnGAwHRT7m1e";
const AIRTABLE_BASE_ID = "app3HHnUsEOOvO9ND";
const AIRTABLE_FORM_EMBED = `https://airtable.com/embed/${AIRTABLE_BASE_ID}/${AIRTABLE_FORM_ID}`;
const AIRTABLE_FORM_URL = `https://airtable.com/${AIRTABLE_BASE_ID}/${AIRTABLE_FORM_ID}/form`;

const POINTS = [
  "We review every artist profile that comes through.",
  "The more you fill in — photo, bio, links — the faster we can decide.",
  "We're selective on purpose and only reach out when there's a real fit.",
  "Nothing goes live on the site until we approve your profile.",
];

export default function SubmitPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbLd([
          { name: "Home", path: "/" },
          { name: "Submit", path: "/submit" },
        ])}
      />
      <PageHeader
        eyebrow="Work with us"
        title="Submit your artist profile"
        description="Independent artist who's serious about the work? Tell us who you are. If we're a fit, we'll be in touch."
      />
      <Section>
        <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
          <div className="order-2 lg:order-1">
            {/*
              The Airtable form embed. Height is generous to fit the whole
              form without an inner scrollbar on desktop; the iframe itself
              handles internal scroll on mobile. `background: transparent` on
              the src keeps the form area from clashing with the site theme.
            */}
            <div className="overflow-hidden rounded-lg border border-border bg-card">
              <iframe
                title="Submit your artist profile"
                src={`${AIRTABLE_FORM_EMBED}?backgroundColor=gray`}
                className="block h-[1600px] w-full border-0 sm:h-[1500px]"
                loading="lazy"
              />
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              Form not loading?{" "}
              <a
                href={AIRTABLE_FORM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-foreground underline decoration-primary/40 underline-offset-4 hover:decoration-primary"
              >
                Open it in a new tab
                <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
              </a>
              .
            </p>
          </div>

          <aside className="order-1 lg:order-2">
            <div className="rounded-lg border border-border bg-card p-6">
              <h2 className="font-display text-lg font-semibold">
                What to expect
              </h2>
              <ul className="mt-4 space-y-3">
                {POINTS.map((p) => (
                  <li key={p} className="flex gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6 border-t border-border pt-6">
                <p className="text-sm text-muted-foreground">
                  Prefer to reach out directly?
                </p>
                <Button asChild variant="outline" className="mt-3 w-full">
                  <Link href="/contact">Contact us</Link>
                </Button>
              </div>
            </div>
          </aside>
        </div>
      </Section>
    </>
  );
}
