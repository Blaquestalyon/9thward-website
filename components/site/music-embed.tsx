"use client";

import * as React from "react";
import { Play } from "lucide-react";
import { toEmbed } from "@/lib/embed";
import { cn } from "@/lib/utils";

/**
 * Lazily-mounted music player. The iframe is only inserted once the component
 * scrolls into view (IntersectionObserver), so below-the-fold players never
 * block render or hurt Core Web Vitals. Falls back to nothing if the URL is
 * not embeddable.
 */
export function MusicEmbed({
  url,
  title = "Music player",
  className,
}: {
  url?: string | null;
  title?: string;
  className?: string;
}) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [inView, setInView] = React.useState(false);
  const info = React.useMemo(() => toEmbed(url), [url]);

  React.useEffect(() => {
    if (!ref.current || inView) return;
    const el = ref.current;
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setInView(true);
          obs.disconnect();
        }
      },
      { rootMargin: "200px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [inView]);

  if (!info) return null;

  const isVideo = info.ratio === "video";
  const heightClass = isVideo ? "aspect-video" : "h-[166px]";

  return (
    <div
      ref={ref}
      className={cn(
        "relative w-full overflow-hidden rounded-lg border border-border bg-secondary",
        heightClass,
        className
      )}
    >
      {inView ? (
        <iframe
          src={info.src}
          title={title}
          loading="lazy"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 h-full w-full"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-muted-foreground">
          <Play className="mr-2 h-5 w-5" />
          <span className="text-sm">Loading player…</span>
        </div>
      )}
    </div>
  );
}
