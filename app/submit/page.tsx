import type { Metadata } from "next";
import { CheckCircle2 } from "lucide-react";
import { PageHeader } from "@/components/site/page-header";
import { Section } from "@/components/site/section";
import { SubmitForm } from "@/components/site/submit-form";
import { JsonLd } from "@/components/site/json-ld";
import { breadcrumbLd } from "@/lib/jsonld";

export const metadata: Metadata = {
  title: "Submit Your Music",
  description:
    "Independent artist who's serious about the work? Send us your music. We listen to everything.",
};

const POINTS = [
  "We listen to every submission that comes through.",
  "A link to your music is required — Spotify, SoundCloud, YouTube, or a Drive link.",
  "We're selective on purpose and reach out when there's a real fit.",
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
        title="Submit your music"
        description="If you're an indie artist who's serious about the work, we want to hear you."
      />
      <Section>
        <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
          <div className="order-2 lg:order-1">
            <SubmitForm />
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
            </div>
          </aside>
        </div>
      </Section>
    </>
  );
}
