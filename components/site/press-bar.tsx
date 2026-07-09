import { PRESS } from "@/lib/site";

/**
 * Slim "Featured in" trust bar for the Home 2 (preview) page.
 *
 * Sits directly under the hero — the highest-trust real estate — so a partner
 * or journalist sees the press credibility immediately. Reuses the PRESS data
 * that already feeds the fuller press section lower on the page.
 */
export function PressBar() {
  return (
    <div className="border-b border-border bg-card/40">
      <div className="container flex flex-wrap items-center justify-center gap-x-7 gap-y-2 py-5 text-center">
        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          Featured in
        </span>
        {PRESS.map((p) => (
          <a
            key={p.href}
            href={p.href}
            target="_blank"
            rel="noopener noreferrer"
            className="font-display text-sm font-semibold text-foreground/85 transition-colors hover:text-primary"
          >
            {p.outlet}
          </a>
        ))}
        <span className="font-display text-sm font-semibold text-gold">
          144K Collective
        </span>
      </div>
    </div>
  );
}
