"use client";

import * as React from "react";
import { usePathname } from "next/navigation";

/**
 * Adds `.in` to every `.reveal` as it scrolls into view. Anything already on
 * screen is revealed immediately, without waiting for IntersectionObserver.
 * Re-runs on client navigation.
 */
export function RevealObserver() {
  const pathname = usePathname();

  React.useEffect(() => {
    const pending = () =>
      Array.from(document.querySelectorAll<HTMLElement>(".reveal:not(.in)"));
    const show = (el: Element) => el.classList.add("in");
    const vh = window.innerHeight;

    const rest: HTMLElement[] = [];
    for (const el of pending()) {
      const r = el.getBoundingClientRect();
      if (r.top < vh && r.bottom > 0) show(el);
      else rest.push(el);
    }
    if (!("IntersectionObserver" in window)) {
      rest.forEach(show);
      return;
    }
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            show(e.target);
            io.unobserve(e.target);
          }
        }),
      { rootMargin: "0px 0px -8% 0px" }
    );
    rest.forEach((el) => io.observe(el));
    // Client components (filters) can mount new .reveal nodes later.
    const mo = new MutationObserver(() =>
      pending().forEach((el) => io.observe(el))
    );
    mo.observe(document.body, { childList: true, subtree: true });
    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, [pathname]);

  return null;
}
