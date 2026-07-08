"use client";

import { useState } from "react";
import Image from "next/image";
import { Play, X } from "lucide-react";
import { FEATURED_VIDEOS } from "@/lib/site";
import { cn } from "@/lib/utils";

type Video = (typeof FEATURED_VIDEOS)[number];

/**
 * Featured videos grid — clicking a card opens an inline lightbox
 * with the YouTube embed. Thumbnails come from YouTube's standard CDN.
 */
export function FeaturedVideos() {
  const [active, setActive] = useState<Video | null>(null);

  return (
    <>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURED_VIDEOS.map((video, i) => (
          <button
            key={video.id}
            type="button"
            onClick={() => setActive(video)}
            className={cn(
              "group relative overflow-hidden rounded-xl border border-border bg-card text-left transition-all hover:-translate-y-0.5 hover:border-primary/60 hover:shadow-[0_20px_50px_-24px_rgba(139,92,246,0.55)]",
              i === 0 && "sm:col-span-2 lg:col-span-2 lg:row-span-2"
            )}
            aria-label={`Play ${video.title}`}
          >
            <div className={cn("relative aspect-video w-full", i === 0 && "lg:aspect-[16/10]")}>
              <Image
                src={`https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`}
                alt={`${video.title} — ${video.artists}`}
                fill
                sizes={
                  i === 0
                    ? "(min-width: 1024px) 66vw, (min-width: 640px) 100vw, 100vw"
                    : "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                }
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                unoptimized
              />
              {/* Play overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/95 text-primary-foreground shadow-lg ring-4 ring-primary/20 transition-transform group-hover:scale-110">
                  <Play className="ml-0.5 h-6 w-6 fill-current" />
                </span>
              </div>
              {/* Views badge */}
              <span className="absolute right-3 top-3 inline-flex items-center rounded-full bg-black/70 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                {video.views} views
              </span>
              {/* Kicker + title */}
              <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold">
                  {video.label}
                </p>
                <p className="mt-1 font-display text-lg font-semibold leading-tight text-white sm:text-xl">
                  {video.title}
                </p>
                <p className="mt-0.5 text-xs text-white/80 sm:text-sm">
                  {video.artists}
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>

      {active && <VideoLightbox video={active} onClose={() => setActive(null)} />}
    </>
  );
}

function VideoLightbox({ video, onClose }: { video: Video; onClose: () => void }) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Playing ${video.title}`}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-5xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute -top-12 right-0 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
          aria-label="Close video"
        >
          <X className="h-5 w-5" />
        </button>
        <div className="aspect-video w-full overflow-hidden rounded-xl bg-black shadow-2xl">
          <iframe
            src={`https://www.youtube.com/embed/${video.id}?autoplay=1&rel=0`}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="h-full w-full border-0"
          />
        </div>
        <div className="mt-4 text-center">
          <p className="font-display text-lg font-semibold text-white">
            {video.title}
          </p>
          <p className="text-sm text-white/70">{video.artists}</p>
        </div>
      </div>
    </div>
  );
}
