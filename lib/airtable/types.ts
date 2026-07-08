/** TypeScript shapes for Airtable records used by the site. */

export interface AirtableAttachment {
  id?: string;
  url: string;
  filename?: string;
  width?: number;
  height?: number;
  thumbnails?: {
    small?: { url: string; width: number; height: number };
    large?: { url: string; width: number; height: number };
    full?: { url: string; width: number; height: number };
  };
}

/** Raw Airtable record wrapper as returned by the REST API. */
export interface AirtableRecord<T> {
  id: string;
  createdTime: string;
  fields: Partial<T>;
}

export interface AirtableListResponse<T> {
  records: AirtableRecord<T>[];
  offset?: string;
}

// ─────────────────────────────────────────────────────────────
// Normalized domain models (what the UI consumes)
// ─────────────────────────────────────────────────────────────

export type ArtistStatus = "Active" | "Inactive";

export interface Artist {
  id: string;
  name: string;
  slug: string;
  stageName?: string;
  bio?: string;
  microTagline?: string;
  genre?: string;
  hometown?: string;
  photo?: AirtableAttachment;
  featured: boolean;
  sortOrder: number;
  spotifyUrl?: string;
  appleMusicUrl?: string;
  soundcloudUrl?: string;
  youtubeUrl?: string;
  instagramUrl?: string;
  bandcampUrl?: string;
  bookingEmail?: string;
  status: ArtistStatus;
}

export type ReleaseType = "Single" | "EP" | "Album" | "Mixtape";

export interface Release {
  id: string;
  title: string;
  slug: string;
  artistIds: string[];
  artistNames?: string[];
  releaseDate?: string;
  coverArt?: AirtableAttachment;
  type?: ReleaseType;
  spotifyUrl?: string;
  appleMusicUrl?: string;
  soundcloudUrl?: string;
  youtubeUrl?: string;
  bandcampUrl?: string;
  embedUrl?: string;
  featured: boolean;
  description?: string;
}

export type EventStatus = "Upcoming" | "Past";

export interface EventItem {
  id: string;
  title: string;
  dateTime?: string;
  venue?: string;
  city?: string;
  artistIds: string[];
  ticketUrl?: string;
  rsvpUrl?: string;
  flyer?: AirtableAttachment;
  status: EventStatus;
  description?: string;
}

export interface Service {
  id: string;
  name: string;
  slug: string;
  summary?: string;
  details?: string;
  icon?: string;
  sortOrder: number;
  active: boolean;
}

export type PostStatus = "Draft" | "Published";

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  author?: string;
  publishedDate?: string;
  coverImage?: AirtableAttachment;
  excerpt?: string;
  body?: string;
  tags?: string[];
  status: PostStatus;
}

// ─────────────────────────────────────────────────────────────
// Write payloads (form intake)
// ─────────────────────────────────────────────────────────────

// NOTE: `SubmissionPayload` was removed when /submit was migrated to an
// Airtable-hosted form that writes directly to the `Artists` table. Restore
// from git history if a separate demo-intake queue is ever needed again.

export interface BookingRequestPayload {
  name: string;
  email: string;
  phone?: string;
  artistRequested?: string;
  eventDate?: string;
  venueCity?: string;
  budget?: string;
  details?: string;
}

export interface ServiceInquiryPayload {
  name: string;
  email: string;
  phone?: string;
  serviceInterestedIn: string;
  artistProject?: string;
  details?: string;
}

export interface ContactMessagePayload {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface NewsletterSignupPayload {
  email: string;
}
