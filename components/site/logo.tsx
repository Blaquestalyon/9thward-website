import { cn } from "@/lib/utils";

/**
 * 9th Ward wordmark: a geometric "9W" monogram inside a rounded square,
 * paired with the label name. Uses currentColor so it adapts to theme.
 */
export function Logo({
  className,
  showWordmark = true,
}: {
  className?: string;
  showWordmark?: boolean;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <svg
        width="36"
        height="36"
        viewBox="0 0 36 36"
        fill="none"
        aria-hidden="true"
        className="shrink-0"
      >
        <rect
          x="1.5"
          y="1.5"
          width="33"
          height="33"
          rx="9"
          stroke="currentColor"
          strokeWidth="2"
          className="text-primary"
        />
        {/* stylized 9 */}
        <path
          d="M13 11.5c-2.2 0-3.8 1.5-3.8 3.6 0 2 1.5 3.4 3.6 3.4 1.1 0 2-.4 2.6-1.1v1.2c0 1.9-1 3-2.6 3-1 0-1.8-.4-2.2-1.2l-1.9 1c.7 1.5 2.2 2.3 4.1 2.3 2.9 0 4.7-1.9 4.7-5.1v-3.3c0-2.3-1.7-3.8-4.5-3.8Zm.1 2c1.1 0 1.9.7 1.9 1.7s-.8 1.6-1.9 1.6-1.9-.7-1.9-1.6.8-1.7 1.9-1.7Z"
          fill="currentColor"
          className="text-foreground"
        />
        {/* W formed by two gold strokes */}
        <path
          d="M20 12l1.7 8 1.8-5.5L25.3 20 27 12"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-gold"
        />
      </svg>
      {showWordmark && (
        <span className="flex flex-col leading-none">
          <span className="font-display text-base font-bold tracking-tight">
            9th Ward
          </span>
          <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
            Production &amp; Promotions
          </span>
        </span>
      )}
    </span>
  );
}
