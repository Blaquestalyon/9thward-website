import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * 9th Ward logo: the real turntable-crosshair mark (public/logo.png,
 * transparent background) plus the label name in the site's display font.
 * Per client direction, the nav uses the mark alongside the wordmark; the
 * wordmark can be hidden with showWordmark={false} for tighter placements.
 */
export function Logo({
  className,
  showWordmark = true,
  size = 40,
}: {
  className?: string;
  showWordmark?: boolean;
  size?: number;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <Image
        src="/logo.png"
        alt="9th Ward Production & Promotions logo"
        width={size * 2}
        height={size * 2}
        style={{ width: size, height: size }}
        className="shrink-0 object-contain"
        priority
      />
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
