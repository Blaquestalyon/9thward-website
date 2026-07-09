import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getPostBySlug } from "@/lib/airtable/read";
import { PageHeader } from "@/components/site/page-header";
import { Section } from "@/components/site/section";
import { Artwork } from "@/components/site/artwork";
import { Markdown } from "@/components/site/markdown";
import { JsonLd } from "@/components/site/json-ld";
import { breadcrumbLd } from "@/lib/jsonld";
import { Badge } from "@/components/ui/badge";
import { formatDate, absoluteUrl } from "@/lib/utils";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "Post not found" };
  const desc = post.excerpt?.slice(0, 155) || post.title;
  return {
    title: post.title,
    description: desc,
    openGraph: {
      type: "article",
      title: post.title,
      description: desc,
      url: absoluteUrl(`/blog/${post.slug}`),
      ...(post.coverImage ? { images: [{ url: post.coverImage.url }] } : {}),
      ...(post.publishedDate ? { publishedTime: post.publishedDate } : {}),
    },
    alternates: { canonical: absoluteUrl(`/blog/${post.slug}`) },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  return (
    <>
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: post.title,
            url: absoluteUrl(`/blog/${post.slug}`),
            ...(post.author ? { author: { "@type": "Person", name: post.author } } : {}),
            ...(post.publishedDate ? { datePublished: post.publishedDate } : {}),
            ...(post.coverImage ? { image: post.coverImage.url } : {}),
            ...(post.excerpt ? { description: post.excerpt } : {}),
          },
          breadcrumbLd([
            { name: "Home", path: "/" },
            { name: "Blog", path: "/blog" },
            { name: post.title, path: `/blog/${post.slug}` },
          ]),
        ]}
      />

      <PageHeader eyebrow="Article" title={post.title}>
        <p className="text-sm text-muted-foreground">
          {post.publishedDate && formatDate(post.publishedDate)}
          {post.author ? ` · ${post.author}` : ""}
        </p>
      </PageHeader>

      <Section>
        <article className="mx-auto max-w-[68ch]">
          <Link
            href="/blog"
            className="mb-8 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" /> All posts
          </Link>

          {post.coverImage && (
            <div className="relative mb-10 aspect-[16/9] w-full overflow-hidden rounded-xl border border-border">
              <Artwork
                src={post.coverImage}
                alt={post.title}
                kind="event"
                priority
                sizes="(max-width: 768px) 100vw, 720px"
              />
            </div>
          )}

          {post.tags && post.tags.length > 0 && (
            <div className="mb-8 flex flex-wrap gap-1.5">
              {post.tags.map((t) => (
                <Badge key={t} variant="secondary">
                  {t}
                </Badge>
              ))}
            </div>
          )}

          {post.excerpt && post.body && (
            <p className="mb-8 border-l-2 border-primary pl-5 text-lg font-medium leading-relaxed text-foreground/95">
              {post.excerpt}
            </p>
          )}

          {post.body ? (
            <Markdown content={post.body} />
          ) : post.excerpt ? (
            <p className="text-lg leading-relaxed text-foreground/90">{post.excerpt}</p>
          ) : (
            <p className="text-muted-foreground">Content coming soon.</p>
          )}

          <hr className="my-12 border-border" />

          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" /> More from the blog
          </Link>
        </article>
      </Section>
    </>
  );
}
