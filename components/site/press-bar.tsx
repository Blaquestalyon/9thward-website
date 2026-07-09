import { PRESS } from "@/lib/site";

/**
 * Slim "Featured in" trust bar under the homepage hero — the highest-trust
 * real estate, so a partner or journalist sees the press credibility right
 * away. The linked outlets come from PRESS (they also feed the fuller press
 * section lower on the page); EXTRA_OUTLETS are additional "featured in"
 * mentions shown as wordmarks. Give one an href here to make it clickable.
 */
const EXTRA_OUTLETS = ["The AI Journal", "Monthly Mixing"];

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
        {EXTRA_OUTLETS.map((name) => (
          <span
            key={name}
            className="font-display text-sm font-semibold text-foreground/85"
          >
            {name}
          </span>
        ))}
        <span className="font-display text-sm font-semibold text-gold">
          144K Collective
        </span>
      </div>
    </div>
  );
}
