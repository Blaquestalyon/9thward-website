import type { Metadata } from "next";
import { MapPin, Ticket } from "lucide-react";
import { listEvents, listArtists } from "@/lib/airtable/read";
import { PageHeader } from "@/components/site/page-header";
import { Section, SectionHeader, EmptyState } from "@/components/site/section";
import { EventCard } from "@/components/site/event-card";
import { BookingDialog } from "@/components/site/booking-dialog";
import { Artwork } from "@/components/site/artwork";
import { FadeUp } from "@/components/site/motion";
import { JsonLd } from "@/components/site/json-ld";
import { eventLd, breadcrumbLd } from "@/lib/jsonld";
import { Button } from "@/components/ui/button";
import { formatDateTime } from "@/lib/utils";

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

  const next = upcoming[0];
  const restUpcoming = upcoming.slice(1);

  const nextDate = next?.dateTime ? new Date(next.dateTime) : null;
  const nextMonth = nextDate
    ? nextDate.toLocaleDateString("en-US", { month: "short" }).toUpperCase()
    : "";
  const nextDay = nextDate
    ? nextDate.toLocaleDateString("en-US", { day: "numeric" })
    : "";

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
              e.artistIds
                .map((id) => nameById.get(id))
                .filter((n): n is string => Boolean(n))
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

      {upcoming.length === 0 ? (
        <Section>
          <SectionHeader eyebrow="On the calendar" title="Upcoming shows" />
          <EmptyState
            title="No upcoming shows"
            description="Check back soon — new dates are added here as they're booked."
            action={
              <BookingDialog
                artistOptions={artistOptions}
                label="Book an artist"
              />
            }
          />
        </Section>
      ) : (
        <>
          {/* Next show — hero banner */}
          <Section>
            <FadeUp className="overflow-hidden rounded-2xl border border-gold/30 bg-gradient-to-br from-gold/10 via-card to-card">
              {next.flyer && (
                <div className="relative aspect-[21/9] w-full md:aspect-[3/1]">
                  <Artwork
                    src={next.flyer}
                    alt={`${next.title} flyer`}
                    kind="event"
                    priority
                    sizes="(max-width: 1024px) 100vw, 1000px"
                  />
                </div>
              )}
              <div className="grid gap-6 p-6 sm:grid-cols-[auto_1fr] sm:items-center md:p-8">
                <div className="flex min-w-[7rem] flex-col items-center justify-center rounded-xl border border-gold/40 bg-background/40 px-6 py-4 text-center">
                  <span className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">
                    Next show
                  </span>
                  <span className="mt-1 font-display text-4xl font-bold leading-none">
                    {nextDay}
                  </span>
                  <span className="font-display text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                    {nextMonth}
                  </span>
                </div>
                <div>
                  <h2 className="font-display text-2xl font-bold sm:text-3xl">
                    {next.title}
                  </h2>
                  <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                    {next.dateTime && <p>{formatDateTime(next.dateTime)}</p>}
                    {(next.venue || next.city) && (
                      <p className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 shrink-0" aria-hidden />
                        {[next.venue, next.city].filter(Boolean).join(" · ")}
                      </p>
                    )}
                  </div>
                  {next.description && (
                    <p className="mt-3 max-w-prose text-sm text-muted-foreground">
                      {next.description}
                    </p>
                  )}
                  {(next.ticketUrl || next.rsvpUrl) && (
                    <div className="mt-5 flex flex-wrap gap-3">
                      {next.ticketUrl && (
                        <Button asChild size="lg" className="gap-2">
                          <a
                            href={next.ticketUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Ticket className="h-4 w-4" /> Get tickets
                          </a>
                        </Button>
                      )}
                      {next.rsvpUrl && (
                        <Button asChild size="lg" variant="outline">
                          <a
                            href={next.rsvpUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            RSVP
                          </a>
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </FadeUp>
          </Section>

          {/* More upcoming */}
          {restUpcoming.length > 0 && (
            <Section className="pt-0">
              <SectionHeader
                eyebrow="On the calendar"
                title="More upcoming shows"
              />
              <div className="space-y-4">
                {restUpcoming.map((e) => (
                  <FadeUp key={e.id}>
                    <EventCard event={e} />
                  </FadeUp>
                ))}
              </div>
            </Section>
          )}
        </>
      )}

      {/* Past shows — compact archive */}
      {past.length > 0 && (
        <Section className="pt-0">
          <SectionHeader eyebrow="Archive" title="Past shows" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {past.map((e) => (
              <FadeUp
                key={e.id}
                className="flex gap-3 rounded-lg border border-border bg-card p-3"
              >
                {e.flyer && (
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md">
                    <Artwork
                      src={e.flyer}
                      alt={`${e.title} flyer`}
                      kind="event"
                      sizes="64px"
                    />
                  </div>
                )}
                <div className="min-w-0">
                  <p className="truncate font-display text-sm font-semibold">
                    {e.title}
                  </p>
                  {e.dateTime && (
                    <p className="text-xs text-muted-foreground">
                      {formatDateTime(e.dateTime)}
                    </p>
                  )}
                  {(e.venue || e.city) && (
                    <p className="truncate text-xs text-muted-foreground">
                      {[e.venue, e.city].filter(Boolean).join(" · ")}
                    </p>
                  )}
                </div>
              </FadeUp>
            ))}
          </div>
        </Section>
      )}
    </>
  );
}
