/**
 * High-level Airtable readers.
 *
 * Every reader:
 *  - uses ISR caching (revalidate + cache tags) via the client
 *  - normalizes raw records into typed domain models
 *  - filters/sorts per spec (Status, Active, Featured, Sort Order)
 *  - is defensive: a single malformed row is skipped, never crashes a page
 *  - returns [] (or seed fallback for artists) when Airtable is unconfigured
 */

import "server-only";
import { listRecords } from "./client";
import { TABLES, FIELDS, CACHE_TAGS, REVALIDATE_SECONDS } from "./config";
import type {
  AirtableAttachment,
  AirtableRecord,
  Artist,
  BlogPost,
  EventItem,
  Release,
  Service,
} from "./types";

// ── small field accessors (defensive) ──
function str(v: unknown): string | undefined {
  if (typeof v === "string") return v.trim() || undefined;
  if (typeof v === "number") return String(v);
  return undefined;
}
function bool(v: unknown): boolean {
  return v === true;
}
function num(v: unknown, fallback = 9999): number {
  return typeof v === "number" && !isNaN(v) ? v : fallback;
}
function firstAttachment(v: unknown): AirtableAttachment | undefined {
  if (Array.isArray(v) && v.length > 0 && v[0] && typeof v[0].url === "string") {
    return v[0] as AirtableAttachment;
  }
  return undefined;
}
function linkedIds(v: unknown): string[] {
  return Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : [];
}
function tagList(v: unknown): string[] | undefined {
  if (Array.isArray(v)) return v.filter((x): x is string => typeof x === "string");
  if (typeof v === "string") return v.split(",").map((s) => s.trim()).filter(Boolean);
  return undefined;
}

// ─────────────────────────────────────────────────────────────
// ARTISTS
// ─────────────────────────────────────────────────────────────
function toArtist(rec: AirtableRecord<Record<string, unknown>>): Artist | null {
  const f = rec.fields;
  const F = FIELDS.Artists;
  const name = str(f[F.Name]);
  const slug = str(f[F.Slug]);
  if (!name || !slug) return null; // require the essentials
  return {
    id: rec.id,
    name,
    slug,
    stageName: str(f[F.StageName]),
    bio: str(f[F.Bio]),
    microTagline: str(f[F.MicroTagline]),
    genre: str(f[F.Genre]),
    hometown: str(f[F.Hometown]),
    photo: firstAttachment(f[F.Photo]),
    featured: bool(f[F.Featured]),
    sortOrder: num(f[F.SortOrder]),
    spotifyUrl: str(f[F.SpotifyURL]),
    appleMusicUrl: str(f[F.AppleMusicURL]),
    soundcloudUrl: str(f[F.SoundCloudURL]),
    youtubeUrl: str(f[F.YouTubeURL]),
    instagramUrl: str(f[F.InstagramURL]),
    bandcampUrl: str(f[F.BandcampURL]),
    bookingEmail: str(f[F.BookingEmail]),
    // Blank / unrecognized Status = treat as Inactive. Only records with the
    // literal Airtable single-select value "Active" are ever rendered on the
    // site. New submissions from the Airtable form land with a blank Status
    // and must be reviewed + manually flipped to Active before they appear.
    status: str(f[F.Status]) === "Active" ? "Active" : "Inactive",
  };
}

export async function listArtists(): Promise<Artist[]> {
  const records = await listRecords<Record<string, unknown>>(TABLES.Artists, {
    revalidate: REVALIDATE_SECONDS,
    tags: [CACHE_TAGS.artists],
  });

  return records
    .map(toArtist)
    .filter((a): a is Artist => a !== null)
    .filter((a) => a.status === "Active")
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

export async function getArtistBySlug(slug: string): Promise<Artist | null> {
  const all = await listArtists();
  return all.find((a) => a.slug === slug) ?? null;
}

export async function listFeaturedArtists(limit = 4): Promise<Artist[]> {
  const all = await listArtists();
  // Strict: only artists with Featured=true render on the home page.
  // No fallback to "all" — an empty featured set means an empty section.
  return all.filter((a) => a.featured).slice(0, limit);
}

// ─────────────────────────────────────────────────────────────
// RELEASES
// ─────────────────────────────────────────────────────────────
function toRelease(rec: AirtableRecord<Record<string, unknown>>): Release | null {
  const f = rec.fields;
  const F = FIELDS.Releases;
  const title = str(f[F.Title]);
  const slug = str(f[F.Slug]);
  if (!title || !slug) return null;
  return {
    id: rec.id,
    title,
    slug,
    artistIds: linkedIds(f[F.Artist]),
    releaseDate: str(f[F.ReleaseDate]),
    coverArt: firstAttachment(f[F.CoverArt]),
    type: str(f[F.Type]) as Release["type"],
    spotifyUrl: str(f[F.SpotifyURL]),
    appleMusicUrl: str(f[F.AppleMusicURL]),
    soundcloudUrl: str(f[F.SoundCloudURL]),
    youtubeUrl: str(f[F.YouTubeURL]),
    bandcampUrl: str(f[F.BandcampURL]),
    embedUrl: str(f[F.EmbedURL]),
    featured: bool(f[F.Featured]),
    description: str(f[F.Description]),
  };
}

export async function listReleases(): Promise<Release[]> {
  const records = await listRecords<Record<string, unknown>>(TABLES.Releases, {
    revalidate: REVALIDATE_SECONDS,
    tags: [CACHE_TAGS.releases],
  });

  const artists = await listArtists();
  const nameById = new Map(artists.map((a) => [a.id, a.stageName || a.name]));

  return records
    .map(toRelease)
    .filter((r): r is Release => r !== null)
    .map((r) => ({
      ...r,
      artistNames: r.artistIds
        .map((id) => nameById.get(id))
        .filter((n): n is string => Boolean(n)),
    }))
    .sort((a, b) => {
      // newest first
      const da = a.releaseDate ? new Date(a.releaseDate).getTime() : 0;
      const db = b.releaseDate ? new Date(b.releaseDate).getTime() : 0;
      return db - da;
    });
}

export async function getReleaseBySlug(slug: string): Promise<Release | null> {
  const all = await listReleases();
  return all.find((r) => r.slug === slug) ?? null;
}

export async function listFeaturedReleases(): Promise<Release[]> {
  const all = await listReleases();
  return all.filter((r) => r.featured);
}

export async function getLatestFeaturedRelease(): Promise<Release | null> {
  const featured = await listFeaturedReleases();
  if (featured.length > 0) return featured[0];
  const all = await listReleases();
  return all[0] ?? null;
}

// ─────────────────────────────────────────────────────────────
// EVENTS
// ─────────────────────────────────────────────────────────────
function toEvent(rec: AirtableRecord<Record<string, unknown>>): EventItem | null {
  const f = rec.fields;
  const F = FIELDS.Events;
  const title = str(f[F.Title]);
  if (!title) return null;
  const rawStatus = str(f[F.Status]);
  return {
    id: rec.id,
    title,
    dateTime: str(f[F.DateTime]),
    venue: str(f[F.Venue]),
    city: str(f[F.City]),
    artistIds: linkedIds(f[F.Artists]),
    ticketUrl: str(f[F.TicketURL]),
    rsvpUrl: str(f[F.RSVPURL]),
    flyer: firstAttachment(f[F.Flyer]),
    status: rawStatus === "Past" ? "Past" : "Upcoming",
    description: str(f[F.Description]),
  };
}

export async function listEvents(): Promise<{
  upcoming: EventItem[];
  past: EventItem[];
}> {
  const records = await listRecords<Record<string, unknown>>(TABLES.Events, {
    revalidate: REVALIDATE_SECONDS,
    tags: [CACHE_TAGS.events],
  });

  const events = records.map(toEvent).filter((e): e is EventItem => e !== null);
  const now = Date.now();

  const upcoming = events
    .filter((e) => e.status === "Upcoming")
    .sort((a, b) => {
      const da = a.dateTime ? new Date(a.dateTime).getTime() : Infinity;
      const db = b.dateTime ? new Date(b.dateTime).getTime() : Infinity;
      return da - db; // soonest first
    });

  const past = events
    .filter((e) => e.status === "Past" || (e.dateTime && new Date(e.dateTime).getTime() < now && e.status !== "Upcoming"))
    .sort((a, b) => {
      const da = a.dateTime ? new Date(a.dateTime).getTime() : 0;
      const db = b.dateTime ? new Date(b.dateTime).getTime() : 0;
      return db - da; // most recent first
    });

  return { upcoming, past };
}

export async function listEventsForArtist(artistId: string): Promise<EventItem[]> {
  const { upcoming } = await listEvents();
  return upcoming.filter((e) => e.artistIds.includes(artistId));
}

// ─────────────────────────────────────────────────────────────
// SERVICES
// ─────────────────────────────────────────────────────────────
function toService(rec: AirtableRecord<Record<string, unknown>>): Service | null {
  const f = rec.fields;
  const F = FIELDS.Services;
  const name = str(f[F.Name]);
  const slug = str(f[F.Slug]);
  if (!name || !slug) return null;
  return {
    id: rec.id,
    name,
    slug,
    summary: str(f[F.Summary]),
    details: str(f[F.Details]),
    icon: str(f[F.Icon]),
    sortOrder: num(f[F.SortOrder]),
    active: bool(f[F.Active]),
  };
}

export async function listServices(): Promise<Service[]> {
  const records = await listRecords<Record<string, unknown>>(TABLES.Services, {
    revalidate: REVALIDATE_SECONDS,
    tags: [CACHE_TAGS.services],
  });

  return records
    .map(toService)
    .filter((s): s is Service => s !== null)
    .filter((s) => s.active)
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

// ─────────────────────────────────────────────────────────────
// BLOG POSTS
// ─────────────────────────────────────────────────────────────
function toPost(rec: AirtableRecord<Record<string, unknown>>): BlogPost | null {
  const f = rec.fields;
  const F = FIELDS.BlogPosts;
  const title = str(f[F.Title]);
  const slug = str(f[F.Slug]);
  if (!title || !slug) return null;
  return {
    id: rec.id,
    title,
    slug,
    author: str(f[F.Author]),
    publishedDate: str(f[F.PublishedDate]),
    coverImage: firstAttachment(f[F.CoverImage]),
    excerpt: str(f[F.Excerpt]),
    body: str(f[F.Body]),
    tags: tagList(f[F.Tags]),
    status: str(f[F.Status]) === "Published" ? "Published" : "Draft",
  };
}

export async function listPosts(): Promise<BlogPost[]> {
  const records = await listRecords<Record<string, unknown>>(TABLES.BlogPosts, {
    revalidate: REVALIDATE_SECONDS,
    tags: [CACHE_TAGS.posts],
  });

  return records
    .map(toPost)
    .filter((p): p is BlogPost => p !== null)
    .filter((p) => p.status === "Published")
    .sort((a, b) => {
      const da = a.publishedDate ? new Date(a.publishedDate).getTime() : 0;
      const db = b.publishedDate ? new Date(b.publishedDate).getTime() : 0;
      return db - da; // newest first
    });
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const all = await listPosts();
  return all.find((p) => p.slug === slug) ?? null;
}
