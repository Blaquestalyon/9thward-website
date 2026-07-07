import Link from "next/link";
import type { Release } from "@/lib/airtable/types";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Artwork } from "./artwork";
import { HoverLift } from "./motion";

export function ReleaseCard({ release }: { release: Release }) {
  const artists = release.artistNames?.join(", ");
  return (
    <HoverLift>
      <Link
        href={`/music/${release.slug}`}
        className="group block overflow-hidden rounded-lg border border-border bg-card transition-colors hover:border-primary/60"
      >
        <div className="relative aspect-square w-full overflow-hidden">
          <Artwork
            src={release.coverArt}
            alt={`${release.title} cover art`}
            kind="release"
            sizes="(max-width: 768px) 50vw, 25vw"
            className="transition-transform duration-500 group-hover:scale-105"
          />
          {release.featured && (
            <Badge variant="gold" className="absolute left-2 top-2">
              Featured
            </Badge>
          )}
        </div>
        <div className="p-4">
          {release.type && (
            <span className="text-xs font-medium uppercase tracking-wider text-gold">
              {release.type}
            </span>
          )}
          <h3 className="mt-1 line-clamp-1 font-display text-base font-semibold group-hover:text-primary">
            {release.title}
          </h3>
          {artists && (
            <p className="line-clamp-1 text-sm text-muted-foreground">{artists}</p>
          )}
          {release.releaseDate && (
            <p className="mt-1 text-xs text-muted-foreground">
              {formatDate(release.releaseDate, { year: "numeric", month: "short", day: "numeric" })}
            </p>
          )}
        </div>
      </Link>
    </HoverLift>
  );
}
