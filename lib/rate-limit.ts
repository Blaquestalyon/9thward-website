/**
 * Dead-simple in-memory rate limiter.
 *
 * Keyed by an identifier (typically the client IP + form name). Allows N
 * requests per rolling window. This works on a single Railway instance.
 *
 * NOTE: For a multi-instance / horizontally-scaled deployment this must be
 * replaced with a shared store (e.g. Redis / Upstash). The in-memory Map is
 * per-process and resets on restart.
 */

import "server-only";

interface Bucket {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, Bucket>();

const WINDOW_MS = 60_000; // 60-second window
const MAX_REQUESTS = 5; // per window per key

export function rateLimit(
  key: string,
  { max = MAX_REQUESTS, windowMs = WINDOW_MS } = {}
): { ok: boolean; remaining: number; retryAfter: number } {
  const now = Date.now();
  const existing = buckets.get(key);

  if (!existing || now > existing.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, remaining: max - 1, retryAfter: 0 };
  }

  if (existing.count >= max) {
    return {
      ok: false,
      remaining: 0,
      retryAfter: Math.ceil((existing.resetAt - now) / 1000),
    };
  }

  existing.count += 1;
  return { ok: true, remaining: max - existing.count, retryAfter: 0 };
}

/** Best-effort client IP extraction from request headers. */
export function getClientIp(headers: Headers): string {
  const xff = headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return (
    headers.get("x-real-ip") ||
    headers.get("cf-connecting-ip") ||
    "unknown"
  );
}

// Periodically prune expired buckets to avoid unbounded growth.
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, b] of buckets.entries()) {
      if (now > b.resetAt) buckets.delete(key);
    }
  }, 5 * 60_000).unref?.();
}
