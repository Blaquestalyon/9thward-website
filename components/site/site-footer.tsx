"use client";

import { usePathname } from "next/navigation";
import { Footer } from "./footer";

/**
 * Chooses the footer variant based on the current route.
 *
 * The Home 2 preview page (`/home-2`) gets the centered-newsletter footer;
 * every other page keeps the standard footer. Scoping it here means the live
 * pages are untouched until the preview is approved.
 */
export function SiteFooter() {
  const pathname = usePathname();
  const centered = pathname?.startsWith("/home-2") ?? false;
  return <Footer newsletterCentered={centered} />;
}
