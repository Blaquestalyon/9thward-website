import { PRESS } from "@/lib/site";

/**
 * Slim "Featured in" trust bar under the homepage hero — the highest-trust
 * real estate, so a partner or journalist sees the press credibility right
 * away. The linked outlets come from PRESS (they also feed the fuller press
 * section lower on the page); EXTRA_OUTLETS are additional "featured in"
 * mentions. Both link to their iMused.ai coverage.
 */
const EXTRA_OUTLETS = [
  {
    name: "The AI Journal",
    href: "https://aijourn.com/imused-marks-first-official-platform-song-release-with-the-bag-written-by-cleo-p-using-arya-starrs-musical-dna-as-the-muse-source/",
  },
  {
    name: "Monthly Mixing",
    href: "https://mixing.co.kr/en/38610",
  },
];

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
        {EXTRA_OUTLETS.map((o) => (
          <a
            key={o.name}
            href={o.href}
            target="_blank"
            rel="noopener noreferrer"
            className="font-display text-sm font-semibold text-foreground/85 transition-colors hover:text-primary"
          >
            {o.name}
          </a>
        ))}
        <span className="font-display text-sm font-semibold text-gold">
          144K Collective
        </span>
      </div>
    </div>
  );
}
