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
        className="shrink-0 object-contain drop-shadow-[0_0_10px_rgba(233,196,111,0.35)]"
        priority
      />
      {showWordmark && (
        <span className="flex flex-col leading-none">
          <span className="text-metal font-display text-lg font-bold tracking-wide">
            9th Ward
          </span>
          <span className="whitespace-nowrap text-[9px] font-medium uppercase tracking-[0.24em] text-gold/80">
            Production &amp; Promotions
          </span>
        </span>
      )}
    </span>
  );
}
