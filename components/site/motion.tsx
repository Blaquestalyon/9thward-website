/**
 * Reveal-on-scroll + hover helpers, CSS-driven (see globals.css).
 *
 * FadeUp / StaggerItem render a `.reveal` element. It is only hidden while
 * `html.js` is set and `.in` hasn't been added by RevealObserver, so content
 * is never lost without JS, under reduced motion, or in print.
 */

import * as React from "react";
import { cn } from "@/lib/utils";

type DivProps = React.HTMLAttributes<HTMLDivElement>;

export function FadeUp({
  children,
  delay = 0,
  className,
  style,
  ...rest
}: { delay?: number } & DivProps) {
  return (
    <div
      className={cn("reveal", className)}
      style={delay ? { transitionDelay: `${delay}s`, ...style } : style}
      {...rest}
    >
      {children}
    </div>
  );
}

export function StaggerGrid({ className, ...rest }: DivProps) {
  return <div className={cn("stagger", className)} {...rest} />;
}

export function StaggerItem({ className, ...rest }: DivProps) {
  return <div className={cn("reveal", className)} {...rest} />;
}
