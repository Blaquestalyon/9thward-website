/**
 * Airtable contract map.
 *
 * This is the SINGLE source of truth for every table name and field name the
 * site reads from or writes to. If a field is ever renamed in Airtable, change
 * it HERE — nowhere else in the codebase should hard-code an Airtable string.
 *
 * Field names must match the Airtable base EXACTLY (case-sensitive, spaces
 * included). See AIRTABLE_SETUP.md for the full schema.
 */

export const TABLES = {
  // ── Read tables (rendered content / CMS) ──
  Artists: "Artists",
  Releases: "Releases",
  Events: "Events",
  Services: "Services",
  BlogPosts: "BlogPosts",
  // ── Write tables (form intake) ──
  Submissions: "Submissions",
  BookingRequests: "BookingRequests",
  ServiceInquiries: "ServiceInquiries",
  ContactMessages: "ContactMessages",
  NewsletterSignups: "NewsletterSignups",
} as const;

export type TableName = (typeof TABLES)[keyof typeof TABLES];

/** Field-name constants per table. */
export const FIELDS = {
  Artists: {
    Name: "Name",
    Slug: "Slug",
    StageName: "Stage Name",
    Bio: "Bio",
    MicroTagline: "Micro Tagline",
    Genre: "Genre",
    Hometown: "Hometown",
    Photo: "Photo",
    Featured: "Featured",
    SortOrder: "Sort Order",
    SpotifyURL: "Spotify URL",
    AppleMusicURL: "Apple Music URL",
    SoundCloudURL: "SoundCloud URL",
    YouTubeURL: "YouTube URL",
    InstagramURL: "Instagram URL",
    BandcampURL: "Bandcamp URL",
    BookingEmail: "Booking Email",
    Status: "Status", // Active | Inactive
  },
  Releases: {
    Title: "Title",
    Slug: "Slug",
    Artist: "Artist", // linked record -> Artists
    ReleaseDate: "Release Date",
    CoverArt: "Cover Art",
    Type: "Type", // Single | EP | Album | Mixtape
    SpotifyURL: "Spotify URL",
    AppleMusicURL: "Apple Music URL",
    SoundCloudURL: "SoundCloud URL",
    YouTubeURL: "YouTube URL",
    BandcampURL: "Bandcamp URL",
    EmbedURL: "Embed URL",
    Featured: "Featured",
    Description: "Description",
  },
  Events: {
    Title: "Title",
    DateTime: "Date/Time",
    Venue: "Venue",
    City: "City",
    Artists: "Artist(s)", // linked record -> Artists
    TicketURL: "Ticket URL",
    RSVPURL: "RSVP URL",
    Flyer: "Flyer",
    Status: "Status", // Upcoming | Past
    Description: "Description",
  },
  Services: {
    Name: "Name",
    Slug: "Slug",
    Summary: "Summary",
    Details: "Details",
    Icon: "Icon",
    SortOrder: "Sort Order",
    Active: "Active",
  },
  BlogPosts: {
    Title: "Title",
    Slug: "Slug",
    Author: "Author",
    PublishedDate: "Published Date",
    CoverImage: "Cover Image",
    Excerpt: "Excerpt",
    Body: "Body",
    Tags: "Tags",
    Status: "Status", // Draft | Published
  },
  // ── Write tables ──
  Submissions: {
    ArtistBandName: "Artist/Band Name",
    ContactName: "Contact Name",
    Email: "Email",
    Phone: "Phone",
    Genre: "Genre",
    City: "City",
    MusicLink: "Music Link",
    SocialLinks: "Social Links",
    Message: "Message",
    SubmittedAt: "Submitted At",
    Source: "Source",
    Status: "Status",
  },
  BookingRequests: {
    Name: "Name",
    Email: "Email",
    Phone: "Phone",
    ArtistRequested: "Artist Requested",
    EventDate: "Event Date",
    VenueCity: "Venue/City",
    Budget: "Budget",
    Details: "Details",
    SubmittedAt: "Submitted At",
    Source: "Source",
    Status: "Status",
  },
  ServiceInquiries: {
    Name: "Name",
    Email: "Email",
    Phone: "Phone",
    ServiceInterestedIn: "Service Interested In",
    ArtistProject: "Artist/Project",
    Details: "Details",
    SubmittedAt: "Submitted At",
    Source: "Source",
    Status: "Status",
  },
  ContactMessages: {
    Name: "Name",
    Email: "Email",
    Subject: "Subject",
    Message: "Message",
    SubmittedAt: "Submitted At",
    Source: "Source",
    Status: "Status",
  },
  NewsletterSignups: {
    Email: "Email",
    Source: "Source",
    SubmittedAt: "Submitted At",
  },
} as const;

/** ISR cache tags used for on-demand revalidation. */
export const CACHE_TAGS = {
  artists: "artists",
  releases: "releases",
  events: "events",
  services: "services",
  posts: "posts",
} as const;

export type CacheTag = (typeof CACHE_TAGS)[keyof typeof CACHE_TAGS];

/** Default ISR revalidation window (seconds). */
export const REVALIDATE_SECONDS = 300;
