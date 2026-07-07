/**
 * Turn a platform URL (or an explicit Embed URL) into an iframe-embeddable
 * src, and detect the platform for sizing. Returns null if not embeddable.
 */

export type EmbedPlatform = "spotify" | "soundcloud" | "youtube" | "apple" | "bandcamp" | "unknown";

export interface EmbedInfo {
  platform: EmbedPlatform;
  src: string;
  /** Recommended aspect: "video" (16:9) or "audio" (compact). */
  ratio: "video" | "audio";
}

export function detectPlatform(url: string): EmbedPlatform {
  const u = url.toLowerCase();
  if (u.includes("spotify.com")) return "spotify";
  if (u.includes("soundcloud.com")) return "soundcloud";
  if (u.includes("youtube.com") || u.includes("youtu.be")) return "youtube";
  if (u.includes("music.apple.com")) return "apple";
  if (u.includes("bandcamp.com")) return "bandcamp";
  return "unknown";
}

/** Build an embeddable iframe src from a share/embed URL. */
export function toEmbed(url?: string | null): EmbedInfo | null {
  if (!url) return null;
  let raw: URL;
  try {
    raw = new URL(url);
  } catch {
    return null;
  }
  const platform = detectPlatform(url);

  switch (platform) {
    case "spotify": {
      // https://open.spotify.com/track/ID -> /embed/track/ID
      const path = raw.pathname.replace(/^\/embed/, "");
      return {
        platform,
        src: `https://open.spotify.com${
          path.startsWith("/embed") ? path : `/embed${path}`
        }`,
        ratio: "audio",
      };
    }
    case "soundcloud": {
      // If already an embed player URL, keep it; otherwise wrap via widget.
      if (raw.hostname.includes("w.soundcloud.com")) {
        return { platform, src: url, ratio: "audio" };
      }
      return {
        platform,
        src: `https://w.soundcloud.com/player/?url=${encodeURIComponent(
          url
        )}&color=%237c3aed&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false`,
        ratio: "audio",
      };
    }
    case "youtube": {
      let id = "";
      if (raw.hostname.includes("youtu.be")) {
        id = raw.pathname.slice(1);
      } else if (raw.pathname.startsWith("/embed/")) {
        id = raw.pathname.split("/embed/")[1];
      } else {
        id = raw.searchParams.get("v") ?? "";
      }
      if (!id) return null;
      return {
        platform,
        src: `https://www.youtube-nocookie.com/embed/${id}`,
        ratio: "video",
      };
    }
    case "apple": {
      // music.apple.com -> embed.music.apple.com
      const embedHost = raw.hostname.startsWith("embed.")
        ? raw.hostname
        : `embed.${raw.hostname}`;
      return {
        platform,
        src: `https://${embedHost}${raw.pathname}${raw.search}`,
        ratio: "audio",
      };
    }
    case "bandcamp": {
      // Bandcamp embeds require an EmbeddedPlayer URL; pass through if present.
      if (raw.pathname.includes("EmbeddedPlayer")) {
        return { platform, src: url, ratio: "audio" };
      }
      return null;
    }
    default:
      return null;
  }
}
