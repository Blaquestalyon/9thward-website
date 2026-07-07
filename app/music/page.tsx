import type { Metadata } from "next";
import Link from "next/link";
import { listReleases, listFeaturedReleases } from "@/lib/airtable/read";
import { PageHeader } from "@/components/site/page-header";
import { Section, SectionHeader, EmptyState } from "@/components/site/section";
import { ReleaseCard } from "@/components/site/release-card";
import { StaggerGrid, StaggerItem } from "@/components/site/motion";
import { JsonLd } from "@/components/site/json-ld";
import { breadcrumbLd } from "@/lib/jsonld";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Music",
  description:
    "Releases from the 9th Ward roster — singles, EPs, albums, and mixtapes. Stream everywhere.",
};

export default async function MusicPage() {
  const [all, featured] = await Promise.all([
    listReleases(),
    listFeaturedReleases(),
  ]);
  const featuredIds = new Set(featured.map((r) => r.id));
  const rest = all.filter((r) => !featuredIds.has(r.id));

  return (
    <>
      <JsonLd
        data={breadcrumbLd([
          { name: "Home", path: "/" },
          { name: "Music", path: "/music" },
        ])}
      />
      <PageHeader
        eyebrow="Releases"
        title="Music"
        description="Every release from the label and its artists. Newest first."
      />

      {all.length === 0 ? (
        <Section>
          <EmptyState
            title="No releases yet"
            description="Releases will appear here once they're added in Airtable."
            action={
              <Button asChild>
                <Link href="/artists">Meet the roster</Link>
              </Button>
            }
          />
        </Section>
      ) : (
        <>
          {featured.length > 0 && (
            <Section className="pb-8">
              <SectionHeader eyebrow="Spotlight" title="Featured" />
              <StaggerGrid className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {featured.map((r) => (
                  <StaggerItem key={r.id}>
                    <ReleaseCard release={r} />
                  </StaggerItem>
                ))}
              </StaggerGrid>
            </Section>
          )}

          {rest.length > 0 && (
            <Section className={featured.length > 0 ? "pt-4" : ""}>
              {featured.length > 0 && (
                <SectionHeader eyebrow="Catalog" title="All releases" />
              )}
              <StaggerGrid className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {rest.map((r) => (
                  <StaggerItem key={r.id}>
                    <ReleaseCard release={r} />
                  </StaggerItem>
                ))}
              </StaggerGrid>
            </Section>
          )}
        </>
      )}
    </>
  );
}
