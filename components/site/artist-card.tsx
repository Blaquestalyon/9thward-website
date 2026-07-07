import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Artist } from "@/lib/airtable/types";
import { Badge } from "@/components/ui/badge";
import { Artwork } from "./artwork";
import { HoverLift } from "./motion";

export function ArtistCard({ artist }: { artist: Artist }) {
  const title = artist.stageName || artist.name;
  return (
    <HoverLift>
      <Link
        href={`/artists/${artist.slug}`}
        className="group block overflow-hidden rounded-lg border border-border bg-card transition-colors hover:border-primary/60"
      >
        <div className="relative aspect-[3/4] w-full overflow-hidden">
          <Artwork
            src={artist.photo}
            alt={title}
            kind="artist"
            className="transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <div className="flex items-center justify-between gap-2">
              <h3 className="font-display text-lg font-semibold text-white">
                {title}
              </h3>
              <ArrowUpRight className="h-5 w-5 shrink-0 text-white/80 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </div>
            {artist.microTagline && (
              <p className="mt-0.5 text-sm text-white/70">
                {artist.microTagline}
              </p>
            )}
          </div>
        </div>
        {(artist.genre || artist.hometown) && (
          <div className="flex flex-wrap items-center gap-1.5 p-3">
            {artist.genre && <Badge variant="secondary">{artist.genre}</Badge>}
            {artist.hometown && (
              <Badge variant="outline">{artist.hometown}</Badge>
            )}
          </div>
        )}
      </Link>
    </HoverLift>
  );
}
