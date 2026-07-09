import Link from "next/link";
import { Calendar, MapPin, Ticket } from "lucide-react";
import type { EventItem, Artist } from "@/lib/airtable/types";
import { cn, formatDateTime } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Artwork } from "./artwork";

/**
 * Lineup row: linked avatar + name chips for the artists booked on an event.
 * Renders nothing when there are no (resolved, active) performers.
 */
export function EventPerformers({
  performers,
  label = "Performing",
  className,
}: {
  performers?: Artist[];
  label?: string;
  className?: string;
}) {
  if (!performers || performers.length === 0) return null;
  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      <span className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </span>
      {performers.map((a) => (
        <Link
          key={a.id}
          href={`/artists/${a.slug}`}
          className="group inline-flex items-center gap-1.5 rounded-full border border-border bg-background/50 py-1 pl-1 pr-3 text-sm transition-colors hover:border-primary/60"
        >
          <span className="relative h-6 w-6 shrink-0 overflow-hidden rounded-full border border-border">
            <Artwork
              src={a.photo}
              alt={a.stageName || a.name}
              kind="artist"
              sizes="24px"
            />
          </span>
          <span className="font-medium text-foreground/90 group-hover:text-primary">
            {a.stageName || a.name}
          </span>
        </Link>
      ))}
    </div>
  );
}

export function EventCard({
  event,
  performers,
  past = false,
}: {
  event: EventItem;
  performers?: Artist[];
  past?: boolean;
}) {
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card">
      {event.flyer && (
        <div className="relative aspect-video w-full overflow-hidden border-b border-border bg-background/40">
          <Artwork
            src={event.flyer}
            alt={`${event.title} flyer`}
            kind="event"
            className="object-contain"
            sizes="(max-width: 768px) 100vw, 720px"
          />
        </div>
      )}
      <div className="flex min-w-0 flex-1 flex-col p-4 sm:p-5">
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

        <EventPerformers performers={performers} className="mt-3" />

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
