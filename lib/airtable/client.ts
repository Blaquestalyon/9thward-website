/**
 * Server-side Airtable REST client.
 *
 * - Uses the Personal Access Token from AIRTABLE_PAT (server env only).
 * - Reads use Next.js fetch caching (ISR) via `next: { revalidate, tags }`.
 * - Writes use `cache: "no-store"`.
 * - Exponential backoff on HTTP 429 to respect Airtable's 5 req/sec/base limit.
 * - Returns null / empty on missing credentials so `next build` and empty
 *   deployments never crash (the site renders empty states / seed fallback).
 *
 * SECURITY: This module must only ever run on the server. It reads
 * AIRTABLE_PAT which must NOT be exposed to the browser.
 */

import "server-only";
import type { AirtableListResponse, AirtableRecord } from "./types";
import type { CacheTag } from "./config";

const API_ROOT = "https://api.airtable.com/v0";
const MAX_RETRIES = 3;

function creds(): { pat: string; baseId: string } | null {
  const pat = process.env.AIRTABLE_PAT;
  const baseId = process.env.AIRTABLE_BASE_ID;
  if (!pat || !baseId) return null;
  return { pat, baseId };
}

/** True when Airtable is configured. Callers can short-circuit if false. */
export function isAirtableConfigured(): boolean {
  return creds() !== null;
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

interface ReadOptions {
  /** ISR revalidation window in seconds. */
  revalidate?: number;
  /** Cache tags for on-demand revalidation. */
  tags?: CacheTag[];
  /** Query params (filterByFormula, sort, etc.). */
  params?: Record<string, string | string[]>;
}

function buildUrl(baseId: string, table: string, params?: ReadOptions["params"]): string {
  const url = new URL(`${API_ROOT}/${baseId}/${encodeURIComponent(table)}`);
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (Array.isArray(value)) {
        // Repeatable params like sort[0][field]
        value.forEach((v) => url.searchParams.append(key, v));
      } else {
        url.searchParams.set(key, value);
      }
    }
  }
  return url.toString();
}

/**
 * List records from a table. Follows pagination. Returns [] on any failure or
 * when Airtable is not configured — never throws to the caller.
 */
export async function listRecords<T>(
  table: string,
  opts: ReadOptions = {}
): Promise<AirtableRecord<T>[]> {
  const c = creds();
  if (!c) return [];

  const records: AirtableRecord<T>[] = [];
  let offset: string | undefined;

  try {
    do {
      const params = { ...(opts.params ?? {}) };
      if (offset) params["offset"] = offset;
      const url = buildUrl(c.baseId, table, params);

      const res = await fetchWithBackoff(url, {
        headers: { Authorization: `Bearer ${c.pat}` },
        next: {
          revalidate: opts.revalidate ?? 300,
          tags: opts.tags,
        },
      });

      if (!res || !res.ok) {
        // Log server-side; return whatever we've collected so far.
        if (res) console.error(`[airtable] list ${table} -> HTTP ${res.status}`);
        break;
      }

      const json = (await res.json()) as AirtableListResponse<T>;
      records.push(...(json.records ?? []));
      offset = json.offset;
    } while (offset);
  } catch (err) {
    console.error(`[airtable] list ${table} failed:`, err);
    return records;
  }

  return records;
}

/**
 * Create a record in a table. Returns the created record id, or null on
 * failure / missing config. Never throws — callers decide how to react.
 */
/** Detailed result surface for writes so callers can surface *why* it failed. */
export type CreateResult =
  | { ok: true; id: string }
  | { ok: false; reason: "not_configured" }
  | { ok: false; reason: "http"; status: number; detail: string }
  | { ok: false; reason: "threw"; message: string };

export async function createRecordDetailed(
  table: string,
  fields: Record<string, unknown>
): Promise<CreateResult> {
  const c = creds();
  if (!c) {
    console.error(
      `[airtable] createRecord SKIPPED (not configured) table=${table} pat_set=${!!process.env.AIRTABLE_PAT} base_set=${!!process.env.AIRTABLE_BASE_ID}`
    );
    return { ok: false, reason: "not_configured" };
  }

  const patTail = c.pat.slice(-4);
  console.log(
    `[airtable] createRecord → base=${c.baseId} table=${table} pat=***${patTail} fieldCount=${Object.keys(fields).length}`
  );

  try {
    const url = buildUrl(c.baseId, table);
    const res = await fetchWithBackoff(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${c.pat}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
      body: JSON.stringify({ fields, typecast: true }),
    });

    if (!res || !res.ok) {
      const detail = res ? await res.text().catch(() => "") : "no response";
      console.error(
        `[airtable] create ${table} HTTP ${res?.status ?? "n/a"}: ${detail}`
      );
      // Include the base+table+pat-tail we actually used so we can tell which
      // env var is wrong when Airtable returns NOT_FOUND.
      const context = `base=${c.baseId} table=${table} pat=***${patTail}`;
      return {
        ok: false,
        reason: "http",
        status: res?.status ?? 0,
        detail: `${detail.slice(0, 300)} [${context}]`,
      };
    }

    const json = (await res.json()) as AirtableRecord<unknown>;
    if (!json.id) {
      console.error(`[airtable] create ${table} succeeded but no id in response`);
      return { ok: false, reason: "threw", message: "no id in response" };
    }
    console.log(`[airtable] create ${table} ✓ id=${json.id}`);
    return { ok: true, id: json.id };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`[airtable] create ${table} THREW:`, message, err);
    return { ok: false, reason: "threw", message };
  }
}

/** Legacy signature preserved for existing callers. */
export async function createRecord(
  table: string,
  fields: Record<string, unknown>
): Promise<string | null> {
  const r = await createRecordDetailed(table, fields);
  return r.ok ? r.id : null;
}

/**
 * fetch with exponential backoff on 429 (and 5xx). Respects Airtable's
 * Retry-After header when present.
 */
async function fetchWithBackoff(
  url: string,
  init: RequestInit & { next?: { revalidate?: number; tags?: string[] } }
): Promise<Response | null> {
  let attempt = 0;
  let lastRes: Response | null = null;

  while (attempt <= MAX_RETRIES) {
    lastRes = await fetch(url, init);

    if (lastRes.status !== 429 && lastRes.status < 500) {
      return lastRes;
    }

    if (attempt === MAX_RETRIES) break;

    const retryAfter = Number(lastRes.headers.get("Retry-After"));
    // Base delay honours the 5 req/sec/base limit (>=200ms), grows exponentially.
    const backoff = retryAfter
      ? retryAfter * 1000
      : Math.min(2 ** attempt * 250 + Math.random() * 150, 4000);
    await sleep(backoff);
    attempt += 1;
  }

  return lastRes;
}
