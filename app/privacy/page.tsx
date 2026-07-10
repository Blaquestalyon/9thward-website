import type { Metadata } from "next";
import { PageHeader } from "@/components/site/page-header";
import { Section } from "@/components/site/section";
import { Markdown } from "@/components/site/markdown";
import { JsonLd } from "@/components/site/json-ld";
import { breadcrumbLd } from "@/lib/jsonld";
import { absoluteUrl } from "@/lib/utils";
import { PRIVACY } from "@/lib/legal";

export const metadata: Metadata = {
  title: PRIVACY.title,
  description:
    "How 9th Ward Production & Promotions collects, uses, and protects information you share through the website.",
  alternates: { canonical: absoluteUrl("/privacy") },
};

export default function PrivacyPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbLd([
          { name: "Home", path: "/" },
          { name: PRIVACY.title, path: "/privacy" },
        ])}
      />
      <PageHeader
        eyebrow="Legal"
        title={PRIVACY.title}
        description={`Effective ${PRIVACY.effectiveDate}. Last updated ${PRIVACY.lastUpdated}.`}
      />
      <Section>
        <div className="mx-auto max-w-3xl">
          <Markdown content={PRIVACY.body} dropCap={false} />
        </div>
      </Section>
    </>
  );
}
