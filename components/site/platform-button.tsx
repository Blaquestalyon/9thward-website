import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SocialIcon } from "./social-icons";
import type { SocialKey } from "@/lib/site";

type Platform = {
  key: SocialKey | "apple" | "bandcamp";
  label: string;
  url?: string;
};

const ICON_KEY: Record<string, SocialKey> = {
  spotify: "spotify",
  soundcloud: "soundcloud",
  youtube: "youtube",
};

/** Renders outbound platform buttons — only for platforms that have a URL. */
export function PlatformButtons({
  platforms,
  className,
}: {
  platforms: Platform[];
  className?: string;
}) {
  const present = platforms.filter((p) => p.url && p.url.trim() !== "");
  if (present.length === 0) return null;

  return (
    <div className={className}>
      <div className="flex flex-wrap gap-2">
        {present.map((p) => (
          <Button
            key={p.key}
            asChild
            variant="outline"
            size="sm"
            className="gap-2"
          >
            <a href={p.url} target="_blank" rel="noopener noreferrer">
              {ICON_KEY[p.key] ? (
                <SocialIcon keyName={ICON_KEY[p.key]} className="h-4 w-4" />
              ) : (
                <ExternalLink className="h-4 w-4" />
              )}
              {p.label}
            </a>
          </Button>
        ))}
      </div>
    </div>
  );
}
