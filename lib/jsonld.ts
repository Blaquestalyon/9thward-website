/** JSON-LD builders. Kept in one place so schema stays consistent. */

import { SITE } from "./site";
import { absoluteUrl } from "./utils";
import type { Artist, EventItem, Release } from "./airtable/types";

export function organizationLd() {
  return {
    "@context": "https://schema.org",
    "@type": "MusicLabel",
    name: SITE.legalName,
    alternateName: SITE.shortName,
    url: absoluteUrl("/"),
    logo: absoluteUrl("/logo.png"),
    image: absoluteUrl("/logo.png"),
    description: SITE.description,
    foundingDate: SITE.foundingYear,
    foundingLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Houston",
        addressRegion: "TX",
        addressCountry: "US",
      },
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: SITE.address.street,
      addressLocality: SITE.address.city,
      addressRegion: SITE.address.region,
      postalCode: SITE.address.postalCode,
      addressCountry: SITE.address.country,
    },
    email: SITE.contactEmail,
    founder: SITE.founders.map((f) => ({
      "@type": "Person",
      name: f.name,
      jobTitle: f.role,
    })),
    sameAs: [
      "https://facebook.com/9thwardProductions",
      "https://soundcloud.com/blaquestalyon",
    ],
  };
}

export function labelMusicGroupLd() {
  return {
    "@context": "https://schema.org",
    "@type": "MusicGroup",
    name: SITE.name,
    url: absoluteUrl("/"),
    image: absoluteUrl("/logo.png"),
    description: SITE.description,
    genre: "Independent",
    foundingLocation: "Houston, TX",
  };
}

export function artistMusicGroupLd(artist: Artist) {
  const sameAs = [
    artist.spotifyUrl,
    artist.appleMusicUrl,
    artist.soundcloudUrl,
    artist.youtubeUrl,
    artist.instagramUrl,
    artist.bandcampUrl,
  ].filter((v): v is string => Boolean(v));

  return {
    "@context": "https://schema.org",
    "@type": "MusicGroup",
    name: artist.stageName || artist.name,
    url: absoluteUrl(`/artists/${artist.slug}`),
    ...(artist.genre ? { genre: artist.genre } : {}),
    ...(artist.hometown ? { foundingLocation: artist.hometown } : {}),
    ...(artist.photo ? { image: artist.photo.url } : {}),
    ...(sameAs.length ? { sameAs } : {}),
  };
}

export function releaseLd(release: Release) {
  const type = release.type === "Single" ? "MusicRecording" : "MusicAlbum";
  return {
    "@context": "https://schema.org",
    "@type": type,
    name: release.title,
    url: absoluteUrl(`/music/${release.slug}`),
    ...(release.artistNames?.length
      ? { byArtist: release.artistNames.map((n) => ({ "@type": "MusicGroup", name: n })) }
      : {}),
    ...(release.releaseDate ? { datePublished: release.releaseDate } : {}),
    ...(release.coverArt ? { image: release.coverArt.url } : {}),
    ...(release.description ? { description: release.description } : {}),
  };
}

export function eventLd(event: EventItem, artistNames: string[] = []) {
  return {
    "@context": "https://schema.org",
    "@type": "MusicEvent",
    name: event.title,
    ...(event.dateTime ? { startDate: event.dateTime } : {}),
    eventStatus: "https://schema.org/EventScheduled",
    ...(event.venue || event.city
      ? {
          location: {
            "@type": "Place",
            name: event.venue || event.city,
            ...(event.city
              ? { address: { "@type": "PostalAddress", addressLocality: event.city } }
              : {}),
          },
        }
      : {}),
    ...(artistNames.length
      ? { performer: artistNames.map((n) => ({ "@type": "MusicGroup", name: n })) }
      : {}),
    ...(event.ticketUrl
      ? { offers: { "@type": "Offer", url: event.ticketUrl, availability: "https://schema.org/InStock" } }
      : {}),
  };
}

export function breadcrumbLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: absoluteUrl(it.path),
    })),
  };
}
