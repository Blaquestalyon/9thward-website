"use client";

import * as React from "react";
import type { Release } from "@/lib/airtable/types";
import { cn } from "@/lib/utils";
import { ReleaseCard } from "./release-card";
import { StaggerGrid, StaggerItem } from "./motion";

const TYPE_ORDER = ["Single", "EP", "Album", "Mixtape"];

/**
 * Release catalog with a type filter (Singles / EPs / Albums / Mixtapes) and a
 * newest/oldest sort. Type chips only appear for types actually present.
 */
export function MusicCatalog({ releases }: { releases: Release[] }) {
  const types = React.useMemo(() => {
    const present = new Set<string>();
    for (const r of releases) if (r.type) present.add(r.type);
    return ["All", ...TYPE_ORDER.filter((t) => present.has(t))];
  }, [releases]);

  const [type, setType] = React.useState("All");
  const [sort, setSort] = React.useState<"newest" | "oldest">("newest");

  const shown = React.useMemo(() => {
    const list =
      type === "All" ? releases : releases.filter((r) => r.type === type);
    return [...list].sort((a, b) => {
      const da = a.releaseDate ? new Date(a.releaseDate).getTime() : 0;
      const db = b.releaseDate ? new Date(b.releaseDate).getTime() : 0;
      return sort === "newest" ? db - da : da - db;
    });
  }, [releases, type, sort]);

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        {types.length > 1 ? (
          <div className="flex flex-wrap gap-2">
            {types.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setType(t)}
                aria-pressed={type === t}
                className={cn(
                  "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
                  type === t
                    ? "border-transparent bg-primary text-primary-foreground"
                    : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
                )}
              >
                {t === "All" ? "All" : `${t}s`}
              </button>
            ))}
          </div>
        ) : (
          <span />
        )}

        <div className="flex items-center gap-1 rounded-full border border-border p-1 text-sm">
          {(["newest", "oldest"] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSort(s)}
              aria-pressed={sort === s}
              className={cn(
                "rounded-full px-3 py-1 font-medium transition-colors",
                sort === s
                  ? "bg-secondary text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {s === "newest" ? "Newest" : "Oldest"}
            </button>
          ))}
        </div>
      </div>

      <StaggerGrid className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {shown.map((r) => (
          <StaggerItem key={r.id}>
            <ReleaseCard release={r} />
          </StaggerItem>
        ))}
      </StaggerGrid>
    </div>
  );
}
