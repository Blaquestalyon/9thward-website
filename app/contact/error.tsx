"use client";

/**
 * Route-level error boundary for /contact.
 *
 * Catches any thrown error (server actions, rendering, etc.) so users never
 * see the raw "Application error: a server-side exception has occurred" page
 * with only a digest and no context.
 */

import { useEffect } from "react";
import Link from "next/link";

export default function ContactError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Surface to Railway logs so the actual message + digest can be correlated.
    console.error("[contact] boundary caught:", error);
  }, [error]);

  return (
    <div className="mx-auto max-w-2xl px-6 py-24 text-center">
      <h1 className="text-3xl font-semibold mb-4">
        Something went wrong on our end.
      </h1>
      <p className="text-muted-foreground mb-6">
        Please try again in a moment, or email us directly at{" "}
        <a
          href="mailto:info@9thwardrecording.com"
          className="underline underline-offset-4"
        >
          info@9thwardrecording.com
        </a>
        .
      </p>
      {error.digest ? (
        <p className="text-xs text-muted-foreground mb-6">
          Reference: <code>{error.digest}</code>
        </p>
      ) : null}
      <div className="flex justify-center gap-3">
        <button
          onClick={() => reset()}
          className="rounded-full border px-5 py-2 text-sm hover:bg-accent transition"
        >
          Try again
        </button>
        <Link
          href="/"
          className="rounded-full border px-5 py-2 text-sm hover:bg-accent transition"
        >
          Back home
        </Link>
      </div>
    </div>
  );
}
