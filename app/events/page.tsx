import type { Metadata } from "next";
import { listEvents, listArtists } from "@/lib/airtable/read";
import { PageHeader } from "@/components/site/page-header";
import { Section, SectionHeader, EmptyState } from "@/components/site/section";
import { EventCard } from "@/components/site/event-card";
import { BookingDialog } from "@/components/site/booking-dialog";
import { FadeUp } from "@/components/site/motion";
import { JsonLd } from "@/components/site/json-ld";
import { eventLd, breadcrumbLd } from "@/lib/jsonld";

export const metadata: Metadata = {
  title: "Events",
  description:
    "Upcoming and past shows from the 9th Ward roster. Book an artist for your event.",
};

export default async function EventsPage() {
  const [{ upcoming, past }, artists] = await Promise.all([
    listEvents(),
    listArtists(),
  ]);
  const nameById = new Map(artists.map((a) => [a.id, a.stageName || a.name]));
  const artistOptions = artists.map((a) => a.stageName || a.name);

  return (
    <>
      <JsonLd
        data={[
          breadcrumbLd([
            { name: "Home", path: "/" },
            { name: "Events", path: "/events" },
          ]),
          ...upcoming.map((e) =>
            eventLd(
              e,
              e.artistIds.map((id) => nameById.get(id)).filter((n): n is string => Boolean(n))
            )
          ),
        ]}
      />
      <PageHeader
        eyebrow="Live"
        title="Events"
        description="Catch the roster on stage. Booking an artist for your own event? Reach out."
      >
        <BookingDialog artistOptions={artistOptions} />
      </PageHeader>

      <Section>
        <SectionHeader eyebrow="On the calendar" title="Upcoming shows" />
        {upcoming.length === 0 ? (
          <EmptyState
            title="No upcoming shows"
            description="Check back soon — new dates are added here as they're booked."
            action={<BookingDialog artistOptions={artistOptions} label="Book an artist" />}
          />
        ) : (
          <div className="space-y-4">
            {upcoming.map((e) => (
              <FadeUp key={e.id}>
                <EventCard event={e} />
              </FadeUp>
            ))}
          </div>
        )}
      </Section>

      {past.length > 0 && (
        <Section className="pt-0">
          <SectionHeader eyebrow="Archive" title="Past shows" />
          <div className="space-y-4">
            {past.map((e) => (
              <FadeUp key={e.id}>
                <EventCard event={e} past />
              </FadeUp>
            ))}
          </div>
        </Section>
      )}
    </>
  );
}
