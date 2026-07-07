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
