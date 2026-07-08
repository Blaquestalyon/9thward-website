import { ArrowUpRight, Newspaper } from "lucide-react";
import { PRESS } from "@/lib/site";
import { FadeUp } from "./motion";

/** Compact "As seen in" style press mentions strip. */
export function PressStrip() {
  return (
    <FadeUp>
      <p className="mb-5 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        <Newspaper className="h-4 w-4 text-gold" />
        In the press
      </p>
      <ul className="grid gap-3 md:grid-cols-2">
        {PRESS.map((item) => (
          <li key={item.href}>
            <a
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex h-full flex-col justify-between gap-4 rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary/60"
            >
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold">
                  {item.kicker}
                </p>
                <p className="mt-2 font-display text-base font-semibold leading-snug group-hover:text-primary sm:text-lg">
                  {item.title}
                </p>
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="font-semibold text-foreground/80">
                  {item.outlet}
                </span>
                <span className="inline-flex items-center gap-1">
                  Read
                  <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </span>
              </div>
            </a>
          </li>
        ))}
      </ul>
    </FadeUp>
  );
}
