"use client";

import * as React from "react";
import type { Artist } from "@/lib/airtable/types";
import { cn } from "@/lib/utils";
import { ArtistCard } from "./artist-card";
import { StaggerGrid, StaggerItem } from "./motion";

/**
 * Roster grid with a genre/city filter bar. Chips are derived from the genres
 * and hometowns present on the passed artists; selecting one filters to artists
 * matching that genre OR hometown.
 */
export function ArtistRoster({ artists }: { artists: Artist[] }) {
  const filters = React.useMemo(() => {
    const set = new Set<string>();
    for (const a of artists) {
      if (a.genre) set.add(a.genre);
      if (a.hometown) set.add(a.hometown);
    }
    return ["All", ...set];
  }, [artists]);

  const [active, setActive] = React.useState("All");
  const shown =
    active === "All"
      ? artists
      : artists.filter((a) => a.genre === active || a.hometown === active);

  return (
    <div>
      {filters.length > 1 && (
        <div className="mb-8 flex flex-wrap gap-2">
          {filters.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setActive(f)}
              aria-pressed={active === f}
              className={cn(
                "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
                active === f
                  ? "border-transparent bg-primary text-primary-foreground"
                  : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
              )}
            >
              {f}
            </button>
          ))}
        </div>
      )}

      <StaggerGrid className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {shown.map((artist) => (
          <StaggerItem key={artist.id}>
            <ArtistCard artist={artist} />
          </StaggerItem>
        ))}
      </StaggerGrid>

      {shown.length === 0 && (
        <p className="py-12 text-center text-sm text-muted-foreground">
          No artists match that filter yet.
        </p>
      )}
    </div>
  );
}
