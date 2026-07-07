/** Static site metadata, navigation, and social links (non-Airtable). */

export const SITE = {
  name: "9th Ward Production & Promotions",
  shortName: "9th Ward",
  legalName: "9th Ward Production & Promotions Company, LLC",
  tagline: "Indie Artist Management Group. Music Production, Management & Promotion.",
  description:
    "9th Ward Production & Promotions is a New Orleans indie music label and artist-management company. We produce, manage, and promote independent artists.",
  foundingYear: "2015", // placeholder from the old site's copyright — confirm
  contactEmail: "info@9thwardproductions.com", // placeholder — confirm
};

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
  { key: "youtube", label: "YouTube", href: undefined },
  { key: "tiktok", label: "TikTok", href: undefined },
] as const;

export type SocialKey = (typeof SOCIAL_LINKS)[number]["key"];
