import { Calendar, MapPin, Ticket } from "lucide-react";
import type { EventItem } from "@/lib/airtable/types";
import { formatDateTime } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Artwork } from "./artwork";

export function EventCard({
  event,
  past = false,
}: {
  event: EventItem;
  past?: boolean;
}) {
  return (
    <div className="flex flex-col gap-4 overflow-hidden rounded-lg border border-border bg-card p-4 sm:flex-row">
      {event.flyer && (
        <div className="relative aspect-square w-full shrink-0 overflow-hidden rounded-md sm:h-32 sm:w-32">
          <Artwork
            src={event.flyer}
            alt={`${event.title} flyer`}
            kind="event"
            sizes="128px"
          />
        </div>
      )}
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display text-lg font-semibold">{event.title}</h3>
          {past ? (
            <Badge variant="outline">Past</Badge>
          ) : (
            <Badge variant="gold">Upcoming</Badge>
          )}
        </div>

        <dl className="mt-2 space-y-1 text-sm text-muted-foreground">
          {event.dateTime && (
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 shrink-0" aria-hidden />
              <dd>{formatDateTime(event.dateTime)}</dd>
            </div>
          )}
          {(event.venue || event.city) && (
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 shrink-0" aria-hidden />
              <dd>{[event.venue, event.city].filter(Boolean).join(" · ")}</dd>
            </div>
          )}
        </dl>

        {event.description && (
          <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
            {event.description}
          </p>
        )}

        {!past && (event.ticketUrl || event.rsvpUrl) && (
          <div className="mt-auto flex flex-wrap gap-2 pt-3">
            {event.ticketUrl && (
              <Button asChild size="sm" className="gap-2">
                <a href={event.ticketUrl} target="_blank" rel="noopener noreferrer">
                  <Ticket className="h-4 w-4" />
                  Tickets
                </a>
              </Button>
            )}
            {event.rsvpUrl && (
              <Button asChild size="sm" variant="outline">
                <a href={event.rsvpUrl} target="_blank" rel="noopener noreferrer">
                  RSVP
                </a>
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
