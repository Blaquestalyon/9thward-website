import Script from "next/script";

/**
 * Optional Plausible analytics — mounted only if NEXT_PUBLIC_ANALYTICS_ID is
 * set. Plausible is cookieless, so no consent banner is required. (We do not
 * default to GA4; if you switch to GA4 you must add a consent banner.)
 */
export function Analytics() {
  const domain = process.env.NEXT_PUBLIC_ANALYTICS_ID;
  if (!domain) return null;
  return (
    <Script
      defer
      data-domain={domain}
      src="https://plausible.io/js/script.js"
      strategy="afterInteractive"
    />
  );
}
