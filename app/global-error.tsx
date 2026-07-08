"use client";

/**
 * Root-level error boundary. Catches any uncaught error anywhere in the app
 * that wasn't caught by a nested error.tsx. Must render its own <html>/<body>.
 */

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[global] boundary caught:", error);
  }, [error]);

  return (
    <html>
      <body
        style={{
          fontFamily:
            "system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,sans-serif",
          padding: "4rem 1.5rem",
          textAlign: "center",
          background: "#0a0a0a",
          color: "#fafafa",
          minHeight: "100vh",
          margin: 0,
        }}
      >
        <h1 style={{ fontSize: "1.75rem", marginBottom: "1rem" }}>
          Something went wrong.
        </h1>
        <p style={{ opacity: 0.75, maxWidth: 520, margin: "0 auto 1.5rem" }}>
          We hit an unexpected error. Please try again, or email us at{" "}
          <a
            href="mailto:info@9thwardrecording.com"
            style={{ color: "inherit" }}
          >
            info@9thwardrecording.com
          </a>
          .
        </p>
        {error.digest ? (
          <p style={{ opacity: 0.5, fontSize: 12, marginBottom: 24 }}>
            Reference: <code>{error.digest}</code>
          </p>
        ) : null}
        <button
          onClick={() => reset()}
          style={{
            padding: "0.6rem 1.4rem",
            borderRadius: 9999,
            border: "1px solid #444",
            background: "transparent",
            color: "inherit",
            cursor: "pointer",
          }}
        >
          Try again
        </button>
      </body>
    </html>
  );
}
