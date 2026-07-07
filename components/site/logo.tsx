import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * 9th Ward logo: the real turntable-crosshair mark (public/logo.jpg) plus the
 * label name in the site's display font. Per client direction, the nav uses
 * the mark only — clean and iconic — while the wordmark next to it is optional.
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
      <span className="relative inline-flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-md">
        <Image
          src="/logo.jpg"
          alt="9th Ward Production & Promotions logo"
          width="80"
          height="80"
          className="h-full w-full object-cover"
          priority
        />
      </span>
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
