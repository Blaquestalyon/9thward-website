import Image from "next/image";
import { Disc3, Music2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AirtableAttachment } from "@/lib/airtable/types";

/**
 * Renders an attachment via next/image, or a themed gradient placeholder with
 * an icon when no image exists (e.g. empty Airtable records). Never renders a
 * broken image.
 */
export function Artwork({
  src,
  alt,
  kind = "artist",
  className,
  sizes = "(max-width: 768px) 100vw, 33vw",
  priority = false,
}: {
  src?: AirtableAttachment | string | null;
  alt: string;
  kind?: "artist" | "release" | "event";
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  const url = typeof src === "string" ? src : src?.url;

  if (!url) {
    const Icon = kind === "release" ? Disc3 : Music2;
    return (
      <div
        className={cn(
          "grid place-items-center bg-gradient-to-br from-secondary via-secondary to-primary/20",
          className
        )}
        role="img"
        aria-label={`${alt} (placeholder artwork)`}
      >
        <Icon className="h-10 w-10 text-muted-foreground/50" aria-hidden />
      </div>
    );
  }

  return (
    <Image
      src={url}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      className={cn("object-cover", className)}
    />
  );
}
