import type { Metadata } from "next";
import Link from "next/link";
import { listPosts } from "@/lib/airtable/read";
import { PageHeader } from "@/components/site/page-header";
import { Section, EmptyState } from "@/components/site/section";
import { Artwork } from "@/components/site/artwork";
import { StaggerGrid, StaggerItem } from "@/components/site/motion";
import { JsonLd } from "@/components/site/json-ld";
import { breadcrumbLd } from "@/lib/jsonld";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "News, releases, and stories from 9th Ward Production & Promotions and its roster.",
};

export default async function BlogPage() {
  const posts = await listPosts();

  return (
    <>
      <JsonLd
        data={breadcrumbLd([
          { name: "Home", path: "/" },
          { name: "Blog", path: "/blog" },
        ])}
      />
      <PageHeader
        eyebrow="The latest"
        title="Blog"
        description="News, releases, and stories from the label and the roster."
      />
      <Section>
        {posts.length === 0 ? (
          <EmptyState
            title="No posts yet"
            description="Published articles from the Airtable BlogPosts table will appear here."
          />
        ) : (
          <StaggerGrid className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <StaggerItem key={post.id}>
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
              </StaggerItem>
            ))}
          </StaggerGrid>
        )}
      </Section>
    </>
  );
}
