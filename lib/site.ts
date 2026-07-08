/** Static site metadata, navigation, and social links (non-Airtable). */

export const SITE = {
  name: "9th Ward Production & Promotions",
  shortName: "9th Ward",
  legalName: "9th Ward Production & Promotions Company, LLC",
  tagline: "Indie Artist Management Group. Music Production, Management & Promotion.",
  description:
    "9th Ward Production & Promotions is a Houston-based indie music label and artist-management company with New Orleans roots. We produce, manage, and promote independent artists.",
  productionCompanyFoundedYear: "2010", // Jay Davis started the production company in Houston
  labelFoundedYear: "2015", // year the production company became a full indie label
  foundingYear: "2010", // used as the canonical founding year in schema.org
  contactEmail: "info@9thwardproductions.com", // placeholder — confirm
  address: {
    street: "2800 Post Oak Blvd, Suite 5600",
    city: "Houston",
    region: "TX",
    postalCode: "77056",
    country: "US",
    formatted: "2800 Post Oak Blvd, Suite 5600, Houston, TX 77056",
  },
  founders: [
    { name: "Jay Davis", role: "Co-founder" },
    { name: "Shakara Weston", role: "Co-founder" },
  ],
};

/** In-house ventures / products created by 9th Ward. */
export const VENTURES = [
  {
    key: "imused",
    name: "ImUsed.ai",
    tagline: "The first ethical AI music platform.",
    description:
      "Powered by 9th Ward Production & Promotions and the 144K Collective, ImUsed.ai protects, credits, and pays artists every time their creative DNA inspires a new track. Musical DNA Technology™ analyzes an artist's signature sound across 12+ dimensions, and Muses automatically earn a 10–20% royalty share plus co-producer credit on every commercial release.",
    href: "https://imused.ai",
    launchedYear: "2025",
    partner: "144K Collective",
  },
] as const;

/** Press coverage and notable mentions. */
export const PRESS = [
  {
    outlet: "Yahoo Finance",
    title:
      "iMused.ai Launches as the First Ethical AI Music Platform Highlighting a New Era for Artists, Rights, and the Future of Creative Collaboration",
    href: "https://finance.yahoo.com/news/imused-ai-launches-first-ethical-162600453.html",
    date: "2025-08-28",
    kicker: "Launch Coverage",
  },
  {
    outlet: "The International Telegraph",
    title:
      "The Day the Music AI Got a Conscience: Why iMused.ai is the Industry's New Best Friend",
    href: "https://theinternationaltelegraph.news/2026/02/15/the-day-the-music-ai-got-a-conscience-why-imused-ai-is-the-industrys-new-best-friend/",
    date: "2026-02-15",
    kicker: "Feature",
  },
] as const;

/** Featured videos from Blaquestalyon / 9th Ward YouTube channel. */
export const YOUTUBE_CHANNEL = {
  handle: "@blaquestalyon",
  channelName: "Blaquestalyon — 9th Ward Productions",
  href: "https://www.youtube.com/@blaquestalyon",
  subscriberCount: "102K",
};

export const FEATURED_VIDEOS = [
  {
    id: "h1gZeqiUZyQ",
    title: "Caribbean Connection",
    artists: "Blaquestalyon, AVO & Var Don",
    views: "2.6M",
    label: "Official Music Video",
  },
  {
    id: "tb9kaojV1AQ",
    title: "Shaq-Fu: A Legend Reborn",
    artists: "Blaquestalyon",
    views: "557K",
    label: "Music Video",
  },
  {
    id: "29zc0t4blQM",
    title: "Sinful Taboo",
    artists: "Blaquestalyon / S4TF",
    views: "80K",
    label: "Official Music Video",
  },
  {
    id: "hMgp9VnJlCo",
    title: "Oye Mamita",
    artists: "Blaquestalyon",
    views: "52K",
    label: "Instrumental",
  },
  {
    id: "y_Mam5Uh-po",
    title: "Caribbean Connection — 2Klean Mix",
    artists: "Blaquestalyon",
    views: "33K",
    label: "Radio Edit",
  },
  {
    id: "WndIjKmtn9g",
    title: "Dreamin' Bout U",
    artists: "Blaquestalyon",
    views: "33K",
    label: "Single",
  },
] as const;

export const NAV_LINKS = [
  { href: "/music", label: "Music" },
  { href: "/artists", label: "Artists" },
  { href: "/events", label: "Events" },
  { href: "/services", label: "Services" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;

/**
 * Social links. Facebook + SoundCloud are the real, known accounts.
 * The rest are placeholders (href: undefined) until confirmed — the footer
 * renders them muted/disabled with a "coming soon" note.
 */
export const SOCIAL_LINKS = [
  {
    key: "facebook",
    label: "Facebook",
    href: "https://facebook.com/9thwardProductions",
  },
  {
    key: "soundcloud",
    label: "SoundCloud",
    href: "https://soundcloud.com/blaquestalyon",
  },
  { key: "instagram", label: "Instagram", href: undefined },
  { key: "spotify", label: "Spotify", href: undefined },
  {
    key: "youtube",
    label: "YouTube",
    href: "https://www.youtube.com/@blaquestalyon",
  },
  { key: "tiktok", label: "TikTok", href: undefined },
] as const;

export type SocialKey = (typeof SOCIAL_LINKS)[number]["key"];
