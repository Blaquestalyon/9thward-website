import { Facebook, Instagram, Youtube, Music2 } from "lucide-react";
import type { SocialKey } from "@/lib/site";

/** Small brand-ish glyphs. lucide covers most; SoundCloud/Spotify/TikTok are inline. */
export function SocialIcon({
  keyName,
  className = "h-5 w-5",
}: {
  keyName: SocialKey;
  className?: string;
}) {
  switch (keyName) {
    case "facebook":
      return <Facebook className={className} aria-hidden />;
    case "instagram":
      return <Instagram className={className} aria-hidden />;
    case "youtube":
      return <Youtube className={className} aria-hidden />;
    case "soundcloud":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
          <path d="M1.2 12.9c-.07 0-.12.05-.13.12l-.2 1.68.2 1.65c.01.07.06.12.13.12.06 0 .11-.05.12-.12l.24-1.65-.24-1.68c-.01-.07-.06-.12-.12-.12zm1.1-.6c-.08 0-.14.06-.15.14l-.27 2.28.27 2.22c.01.08.07.14.15.14.07 0 .13-.06.14-.14l.31-2.22-.31-2.28c-.01-.08-.07-.14-.14-.14zm10.5-4.1c-.3 0-.58.05-.85.14-.18-2.02-1.87-3.6-3.94-3.6-.5 0-.99.1-1.42.27-.17.07-.21.13-.21.26v9.9c0 .14.11.25.24.26h6.18c1.23 0 2.23-.99 2.23-2.22a2.22 2.22 0 0 0-2.23-2.22zM6 5.9c-.09 0-.16.07-.17.16l-.34 6.06.34 3.98c.01.09.08.16.17.16.08 0 .15-.07.16-.16l.39-3.98-.39-6.06c-.01-.09-.08-.16-.16-.16zm-1.3.55c-.09 0-.15.07-.16.16l-.3 5.5.3 3.98c.01.09.07.16.16.16.08 0 .15-.07.16-.16l.34-3.98-.34-5.5c-.01-.09-.08-.16-.16-.16zm-1.28 1.3c-.08 0-.15.06-.16.15l-.27 4.2.27 4c.01.08.08.15.16.15.08 0 .14-.07.15-.15l.31-4-.31-4.2c-.01-.09-.07-.15-.15-.15z" />
        </svg>
      );
    case "spotify":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
          <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm4.59 14.44a.62.62 0 01-.86.21c-2.35-1.44-5.3-1.76-8.79-.96a.62.62 0 11-.28-1.22c3.8-.87 7.08-.5 9.72 1.11.3.18.39.57.21.86zm1.22-2.72a.78.78 0 01-1.07.26c-2.69-1.65-6.79-2.13-9.98-1.17a.78.78 0 11-.45-1.5c3.64-1.1 8.16-.56 11.24 1.34.37.22.49.71.26 1.07zm.11-2.84c-3.23-1.92-8.56-2.1-11.64-1.16a.94.94 0 11-.54-1.8c3.54-1.07 9.42-.86 13.14 1.35a.94.94 0 11-.96 1.61z" />
        </svg>
      );
    case "tiktok":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
          <path d="M16.6 5.82a4.28 4.28 0 01-1.06-2.82h-3.06v12.4a2.6 2.6 0 11-2.6-2.6c.27 0 .53.04.78.12V9.8a5.66 5.66 0 00-.78-.06 5.66 5.66 0 105.66 5.66V9.01a7.3 7.3 0 004.2 1.33V7.28a4.28 4.28 0 01-3.14-1.46z" />
        </svg>
      );
    default:
      return <Music2 className={className} aria-hidden />;
  }
}
