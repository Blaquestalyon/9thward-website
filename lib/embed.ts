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
  /**
   * Recommended pixel height for audio embeds. Ignored for video (uses aspect-video).
   * Spotify single-track/episode = 152, album/playlist/show = 352.
   * SoundCloud compact = 166. Apple Music single = 175, album/playlist = 450.
   * Bandcamp defaults to 120.
   */
  audioHeight?: number;
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
      const finalPath = path.startsWith("/embed") ? path : `/embed${path}`;
      // Spotify's plain iframe embed renders a fixed mini-player card ~80px
      // tall regardless of the iframe height we allocate, so we match that
      // exactly to avoid dead space inside the container.
      return {
        platform,
        src: `https://open.spotify.com${finalPath}`,
        ratio: "audio",
        audioHeight: 80,
      };
    }
    case "soundcloud": {
      // If already an embed player URL, keep it; otherwise wrap via widget.
      if (raw.hostname.includes("w.soundcloud.com")) {
        return { platform, src: url, ratio: "audio", audioHeight: 166 };
      }
      return {
        platform,
        src: `https://w.soundcloud.com/player/?url=${encodeURIComponent(
          url
        )}&color=%237c3aed&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false`,
        ratio: "audio",
        audioHeight: 166,
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
      // Apple: album/playlist pages are taller than single track pages.
      const isMulti = /\/(album|playlist)\//.test(raw.pathname) && !raw.searchParams.get("i");
      return {
        platform,
        src: `https://${embedHost}${raw.pathname}${raw.search}`,
        ratio: "audio",
        audioHeight: isMulti ? 450 : 175,
      };
    }
    case "bandcamp": {
      // Bandcamp embeds require an EmbeddedPlayer URL; pass through if present.
      if (raw.pathname.includes("EmbeddedPlayer")) {
        return { platform, src: url, ratio: "audio", audioHeight: 120 };
      }
      return null;
    }
    default:
      return null;
  }
}
