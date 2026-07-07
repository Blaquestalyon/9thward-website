/**
 * On-demand ISR revalidation.
 *
 * POST /api/revalidate?secret=REVALIDATE_SECRET&tag=artists
 *
 * Validates the secret and a known cache tag, then calls revalidateTag() so
 * content refreshes when the Airtable base changes (e.g. via an Airtable
 * automation webhook). Returns 401 on a bad/missing secret, 400 on a bad tag.
 */

import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { CACHE_TAGS } from "@/lib/airtable/config";

export const dynamic = "force-dynamic";

const VALID_TAGS = new Set<string>(Object.values(CACHE_TAGS));

export async function POST(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const secret = searchParams.get("secret");
  const tag = searchParams.get("tag");

  const expected = process.env.REVALIDATE_SECRET;
  if (!expected || secret !== expected) {
    return NextResponse.json(
      { revalidated: false, message: "Invalid or missing secret." },
      { status: 401 }
    );
  }

  if (!tag || !VALID_TAGS.has(tag)) {
    return NextResponse.json(
      {
        revalidated: false,
        message: `Invalid or missing tag. Valid tags: ${[...VALID_TAGS].join(", ")}`,
      },
      { status: 400 }
    );
  }

  revalidateTag(tag);
  return NextResponse.json({
    revalidated: true,
    tag,
    now: Date.now(),
  });
}
