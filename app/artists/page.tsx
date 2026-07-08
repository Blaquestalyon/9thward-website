import type { Metadata } from "next";
import Link from "next/link";
import { listArtists } from "@/lib/airtable/read";

// Render on every request so Airtable edits propagate immediately.
export const dynamic = "force-dynamic";
import { PageHeader } from "@/components/site/page-header";
import { Section, EmptyState } from "@/components/site/section";
import { ArtistCard } from "@/components/site/artist-card";
import { StaggerGrid, StaggerItem } from "@/components/site/motion";
import { JsonLd } from "@/components/site/json-ld";
import { breadcrumbLd } from "@/lib/jsonld";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Artists",
  description:
    "The 9th Ward roster — independent artists we produce, manage, and promote, from Houston to New Orleans to the Bronx and beyond.",
};

export default async function ArtistsPage() {
  const artists = await listArtists();

  return (
    <>
      <JsonLd
        data={breadcrumbLd([
          { name: "Home", path: "/" },
          { name: "Artists", path: "/artists" },
        ])}
      />
      <PageHeader
        eyebrow="The roster"
        title="Artists"
        description="Independent talent with the work ethic to go the distance. Tap in."
      />
      <Section>
        {artists.length === 0 ? (
          <EmptyState
            title="Roster coming soon"
            description="Artists will appear here once they're added in Airtable."
            action={
              <Button asChild>
                <Link href="/submit">Submit your music</Link>
              </Button>
            }
          />
        ) : (
          <StaggerGrid className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {artists.map((artist) => (
              <StaggerItem key={artist.id}>
                <ArtistCard artist={artist} />
              </StaggerItem>
            ))}
          </StaggerGrid>
        )}
      </Section>
    </>
  );
}
