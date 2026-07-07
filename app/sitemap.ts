import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/utils";
import { listArtists, listReleases, listPosts } from "@/lib/airtable/read";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPaths = [
    "/",
    "/music",
    "/artists",
    "/events",
    "/services",
    "/submit",
    "/blog",
    "/about",
    "/contact",
  ];

  const base: MetadataRoute.Sitemap = staticPaths.map((p) => ({
    url: absoluteUrl(p),
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: p === "/" ? 1 : 0.7,
  }));

  // Dynamic slugs — guarded so a failed read never breaks the sitemap.
  try {
    const [artists, releases, posts] = await Promise.all([
      listArtists(),
      listReleases(),
      listPosts(),
    ]);

    for (const a of artists) {
      base.push({
        url: absoluteUrl(`/artists/${a.slug}`),
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.6,
      });
    }
    for (const r of releases) {
      base.push({
        url: absoluteUrl(`/music/${r.slug}`),
        lastModified: r.releaseDate ? new Date(r.releaseDate) : new Date(),
        changeFrequency: "monthly",
        priority: 0.6,
      });
    }
    for (const post of posts) {
      base.push({
        url: absoluteUrl(`/blog/${post.slug}`),
        lastModified: post.publishedDate ? new Date(post.publishedDate) : new Date(),
        changeFrequency: "monthly",
        priority: 0.5,
      });
    }
  } catch {
    // fall through with static paths only
  }

  return base;
}
