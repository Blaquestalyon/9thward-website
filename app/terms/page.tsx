import type { Metadata } from "next";
import { PageHeader } from "@/components/site/page-header";
import { Section } from "@/components/site/section";
import { Markdown } from "@/components/site/markdown";
import { JsonLd } from "@/components/site/json-ld";
import { breadcrumbLd } from "@/lib/jsonld";
import { absoluteUrl } from "@/lib/utils";
import { TERMS } from "@/lib/legal";

export const metadata: Metadata = {
  title: TERMS.title,
  description:
    "The terms that govern your access to and use of the 9th Ward Production & Promotions website.",
  alternates: { canonical: absoluteUrl("/terms") },
};

export default function TermsPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbLd([
          { name: "Home", path: "/" },
          { name: TERMS.title, path: "/terms" },
        ])}
      />
      <PageHeader
        eyebrow="Legal"
        title={TERMS.title}
        description={`Effective ${TERMS.effectiveDate}. Last updated ${TERMS.lastUpdated}.`}
      />
      <Section>
        <div className="mx-auto max-w-3xl">
          <Markdown content={TERMS.body} dropCap={false} />
        </div>
      </Section>
    </>
  );
}
