/**
 * ┌─────────────────────────────────────────────────────────────────────┐
 * │  SEED / FALLBACK ROSTER — REMOVE OR EMPTY ONCE AIRTABLE IS LIVE.       │
 * │                                                                       │
 * │  This is example/fallback data ONLY. The primary content pipeline is  │
 * │  Airtable. `listArtists()` falls back to this array when Airtable      │
 * │  returns 0 records, so the site has content on first deploy before    │
 * │  the base is wired up.                                                 │
 * │                                                                       │
 * │  Once the Airtable Artists table is populated, this fallback is never  │
 * │  used. To fully retire it, set SEED_ARTISTS = [] (or delete this file  │
 * │  and the import in read.ts).                                           │
 * │                                                                       │
 * │  IMPORTANT: No fabricated stats, streaming links, quotes, or collabs. │
 * │  All facts we don't know are left as visible [bracketed placeholders]. │
 * │  Bios follow the fill-in template from the brand style guide.          │
 * └─────────────────────────────────────────────────────────────────────┘
 */

import type { Artist } from "./types";

const PLACEHOLDER_BIO = (stage: string, hometown: string) =>
  `${stage} is a [genre — replace in Airtable] artist from ${hometown}. ` +
  `[One line on their sound or what sets them apart — replace in Airtable.] ` +
  `[The story or edge: one real detail — replace in Airtable.] ` +
  `Right now, ${stage} is [latest release or current project — replace in Airtable]. ` +
  `[Placeholder bio — replace in Airtable with a verified 4–6 sentence bio.]`;

/**
 * The 9 known roster names from the previous site. Bios, photos, genres, and
 * links are deliberately left as placeholders — do NOT invent facts. Confirm
 * each artist's details, then move this content into Airtable.
 */
export const SEED_ARTISTS: Artist[] = [
  {
    id: "seed-blaquestalyon",
    name: "Blaquestalyon",
    slug: "blaquestalyon",
    stageName: "Blaquestalyon",
    microTagline: "Producer & artist — co-founder of 9th Ward, Houston",
    genre: "Hip-Hop / R&B",
    hometown: "Houston, TX",
    bio:
      "Blaquestalyon is the recording name of Jay Davis, co-founder of 9th Ward Production & Promotions. He founded the production company in Houston in 2010 and helped grow it into a full independent label by 2015. His catalog spans hip-hop, R&B, and Caribbean fusion — including the multi-million-view Caribbean Connection with AVO and Var Don — with 100K+ subscribers on YouTube. [Placeholder bio — confirm/expand in Airtable.]",
    featured: true,
    sortOrder: 1,
    status: "Active",
    youtubeUrl: "https://www.youtube.com/@blaquestalyon",
    soundcloudUrl: "https://soundcloud.com/blaquestalyon",
  },
  {
    id: "seed-s4tf",
    name: "Somethin' 4 The Fellas (S4TF)",
    slug: "somethin-4-the-fellas",
    stageName: "Somethin' 4 The Fellas (S4TF)",
    microTagline: "The group that started the label — Houston, TX",
    genre: "R&B / Hip-Hop",
    hometown: "Houston, TX",
    bio:
      "Somethin' 4 The Fellas (S4TF) is the Houston group Jay Davis and Shakara Weston put together in 2012 — Jay producing, Shakara the first member. S4TF is the foundation of what 9th Ward is now, and the reason the production company became a full independent record label in 2015. [Placeholder bio — confirm/expand in Airtable.]",
    featured: true,
    sortOrder: 2,
    status: "Active",
  },
  {
    id: "seed-var-don",
    name: "Var Don",
    slug: "var-don",
    stageName: "Var Don",
    microTagline: "9th Ward artist — featured on Caribbean Connection",
    genre: "[Genre TBD]",
    hometown: "[Hometown TBD]",
    bio:
      "Var Don is a 9th Ward artist featured alongside Blaquestalyon and AVO on the multi-million-view single Caribbean Connection. [Placeholder bio — confirm/expand in Airtable.]",
    featured: true,
    sortOrder: 3,
    status: "Active",
  },
  {
    id: "seed-dame-scott",
    name: "Dame Scott",
    slug: "dame-scott",
    stageName: 'Dame Scott (aka "Bass Ghost")',
    microTagline: "[Sound/vibe] out of [Hometown TBD]",
    genre: "[Genre TBD]",
    hometown: "[Hometown TBD]",
    bio: PLACEHOLDER_BIO('Dame Scott (aka "Bass Ghost")', "[Hometown TBD]"),
    featured: false,
    sortOrder: 4,
    status: "Active",
  },
  {
    id: "seed-kenni-sosa",
    name: "Kenni Sosa",
    slug: "kenni-sosa",
    stageName: "Kenni Sosa",
    microTagline: "[Sound/vibe] out of [Hometown TBD]",
    genre: "[Genre TBD]",
    hometown: "[Hometown TBD]",
    bio: PLACEHOLDER_BIO("Kenni Sosa", "[Hometown TBD]"),
    featured: false,
    sortOrder: 5,
    status: "Active",
  },
  {
    id: "seed-telurtron",
    name: "Telurtron",
    slug: "telurtron",
    stageName: "Telurtron",
    // Only known non-NOLA hometown per brand notes: billed out of the Bronx.
    microTagline: "[Sound/vibe] out of the Bronx",
    genre: "[Genre TBD]",
    hometown: "Bronx, NY",
    bio: PLACEHOLDER_BIO("Telurtron", "the Bronx, NY"),
    featured: false,
    sortOrder: 6,
    status: "Active",
  },
  {
    id: "seed-sly-t",
    name: 'Janelle "Sly-T" Thompson',
    slug: "janelle-sly-t-thompson",
    stageName: 'Janelle "Sly-T" Thompson',
    microTagline: "[Sound/vibe] out of [Hometown TBD]",
    genre: "[Genre TBD]",
    hometown: "[Hometown TBD]",
    bio: PLACEHOLDER_BIO('Janelle "Sly-T" Thompson', "[Hometown TBD]"),
    featured: false,
    sortOrder: 7,
    status: "Active",
  },
  {
    id: "seed-greenline",
    name: "Greenline",
    slug: "greenline",
    stageName: "Greenline",
    microTagline: "[Sound/vibe] out of [Hometown TBD]",
    genre: "[Genre TBD]",
    hometown: "[Hometown TBD]",
    bio: PLACEHOLDER_BIO("Greenline", "[Hometown TBD]"),
    featured: false,
    sortOrder: 8,
    status: "Active",
  },
  {
    id: "seed-the-chamanas",
    name: "The Chamanas",
    slug: "the-chamanas",
    stageName: "The Chamanas",
    microTagline: "[Sound/vibe] out of [Hometown TBD]",
    genre: "[Genre TBD]",
    hometown: "[Hometown TBD]",
    bio: PLACEHOLDER_BIO("The Chamanas", "[Hometown TBD]"),
    featured: false,
    sortOrder: 9,
    status: "Active",
  },
  {
    id: "seed-anna-choi",
    name: "Anna Choi",
    slug: "anna-choi",
    stageName: "Anna Choi",
    microTagline: "[Sound/vibe] out of [Hometown TBD]",
    genre: "[Genre TBD]",
    hometown: "[Hometown TBD]",
    bio: PLACEHOLDER_BIO("Anna Choi", "[Hometown TBD]"),
    featured: false,
    sortOrder: 10,
    status: "Active",
  },
];
