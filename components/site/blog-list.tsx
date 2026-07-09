"use client";

import * as React from "react";
import Link from "next/link";
import type { BlogPost } from "@/lib/airtable/types";
import { cn, formatDate } from "@/lib/utils";
import { Artwork } from "./artwork";
import { StaggerGrid, StaggerItem } from "./motion";
import { Badge } from "@/components/ui/badge";

/**
 * Blog feed with a category (tag) filter bar. Chips are derived from the tags
 * present on the passed posts; selecting one filters to posts carrying it.
 */
export function BlogList({ posts }: { posts: BlogPost[] }) {
  const tags = React.useMemo(() => {
    const set = new Set<string>();
    for (const p of posts) p.tags?.forEach((t) => set.add(t));
    return ["All", ...set];
  }, [posts]);

  const [active, setActive] = React.useState("All");
  const shown =
    active === "All"
      ? posts
      : posts.filter((p) => p.tags?.includes(active));

  return (
    <div>
      {tags.length > 1 && (
        <div className="mb-8 flex flex-wrap gap-2">
          {tags.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setActive(t)}
              aria-pressed={active === t}
              className={cn(
                "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
                active === t
                  ? "border-transparent bg-primary text-primary-foreground"
                  : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
              )}
            >
              {t}
            </button>
          ))}
        </div>
      )}

      <StaggerGrid className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {shown.map((post) => (
          <StaggerItem key={post.id}>
            <PostCard post={post} />
          </StaggerItem>
        ))}
      </StaggerGrid>

      {shown.length === 0 && (
        <p className="py-12 text-center text-sm text-muted-foreground">
          No posts in that category yet.
        </p>
      )}
    </div>
  );
}

function PostCard({ post }: { post: BlogPost }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-lg border border-border bg-card transition-colors hover:border-primary/60"
    >
      <div className="relative aspect-[16/9] w-full overflow-hidden">
        <Artwork
          src={post.coverImage}
          alt={post.title}
          kind="event"
          sizes="(max-width: 768px) 100vw, 33vw"
          className="transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col p-5">
        {post.publishedDate && (
          <span className="text-xs text-muted-foreground">
            {formatDate(post.publishedDate)}
            {post.author ? ` · ${post.author}` : ""}
          </span>
        )}
        <h2 className="mt-1 font-display text-lg font-semibold group-hover:text-primary">
          {post.title}
        </h2>
        {post.excerpt && (
          <p className="mt-2 line-clamp-3 flex-1 text-sm text-muted-foreground">
            {post.excerpt}
          </p>
        )}
        {post.tags && post.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {post.tags.slice(0, 3).map((t) => (
              <Badge key={t} variant="secondary">
                {t}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
