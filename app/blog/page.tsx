import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { listPosts } from "@/lib/airtable/read";
import { PageHeader } from "@/components/site/page-header";
import { Section, EmptyState } from "@/components/site/section";
import { Artwork } from "@/components/site/artwork";
import { BlogList } from "@/components/site/blog-list";
import { FadeUp } from "@/components/site/motion";
import { JsonLd } from "@/components/site/json-ld";
import { breadcrumbLd } from "@/lib/jsonld";
import { formatDate } from "@/lib/utils";

// Render on every request so post cover-image URLs are always freshly fetched
// from Airtable. Airtable attachment URLs are temporary and expire; a cached
// (static/ISR) page can serve an expired URL → broken image on first load.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "News, releases, and stories from 9th Ward Production & Promotions and its roster.",
};

export default async function BlogPage() {
  const posts = await listPosts();
  const featured = posts[0];
  const rest = posts.slice(1);

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

      {posts.length === 0 ? (
        <Section>
          <EmptyState
            title="No posts yet"
            description="Published articles from the Airtable BlogPosts table will appear here."
          />
        </Section>
      ) : (
        <>
          {/* Featured lead post */}
          <Section>
            <FadeUp>
              <Link
                href={`/blog/${featured.slug}`}
                className="group grid overflow-hidden rounded-2xl border border-border bg-card transition-colors hover:border-primary/60 md:grid-cols-2"
              >
                <div className="relative aspect-[16/10] w-full overflow-hidden md:aspect-auto md:min-h-[20rem]">
                  <Artwork
                    src={featured.coverImage}
                    alt={featured.title}
                    kind="event"
                    priority
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-col justify-center p-6 md:p-10">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-gold">
                    <span>Featured</span>
                    {featured.tags?.[0] && (
                      <span className="text-muted-foreground">
                        · {featured.tags[0]}
                      </span>
                    )}
                  </div>
                  <h2 className="mt-3 font-display text-2xl font-bold group-hover:text-primary sm:text-3xl">
                    {featured.title}
                  </h2>
                  {featured.publishedDate && (
                    <p className="mt-2 text-sm text-muted-foreground">
                      {formatDate(featured.publishedDate)}
                      {featured.author ? ` · ${featured.author}` : ""}
                    </p>
                  )}
                  {featured.excerpt && (
                    <p className="mt-3 line-clamp-3 text-muted-foreground">
                      {featured.excerpt}
                    </p>
                  )}
                  <span className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-primary">
                    Read article <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </Link>
            </FadeUp>
          </Section>

          {/* The rest, filterable by category */}
          {rest.length > 0 && (
            <Section className="pt-0">
              <BlogList posts={rest} />
            </Section>
          )}
        </>
      )}
    </>
  );
}
