import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format an ISO date string for display. Returns "" if invalid/empty. */
export function formatDate(
  input?: string | null,
  opts: Intl.DateTimeFormatOptions = { year: "numeric", month: "long", day: "numeric" }
): string {
  if (!input) return "";
  const d = new Date(input);
  if (isNaN(d.getTime())) return "";
  return new Intl.DateTimeFormat("en-US", opts).format(d);
}

/** Format a date + time (used for events). Returns "" if invalid/empty. */
export function formatDateTime(input?: string | null): string {
  if (!input) return "";
  const d = new Date(input);
  if (isNaN(d.getTime())) return "";
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(d);
}

/** Absolute URL helper for canonical/OG tags. Tolerates missing scheme so a
 *  misconfigured NEXT_PUBLIC_SITE_URL never crashes rendering. */
export function absoluteUrl(path = ""): string {
  const raw =
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.NODE_ENV === "production"
      ? "https://www.9thwardrecording.com"
      : "http://localhost:3000");
  const withScheme = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
  const base = withScheme.replace(/\/$/, "");
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

/** An event counts as over 12h after it starts (it stays "upcoming" while
 *  it's on). Date-only values ("2026-10-23") get the whole day first. */
export function eventHasEnded(dateTime?: string | null, now = Date.now()): boolean {
  if (!dateTime) return false;
  const start = Date.parse(dateTime);
  if (isNaN(start)) return false;
  const graceHours = dateTime.length <= 10 ? 36 : 12;
  return start + graceHours * 3_600_000 < now;
}
