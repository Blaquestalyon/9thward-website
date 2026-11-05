"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { NAV_LINKS } from "@/lib/site";
import { Button } from "@/components/ui/button";
import { Logo } from "./logo";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export function Nav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (href: string) =>
    pathname === href || (href !== "/" && pathname.startsWith(href));

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full transition-colors duration-300",
        scrolled
          ? "bg-background/85 shadow-[0_10px_30px_-12px_rgb(0_0_0/0.9)] backdrop-blur-md"
          : "bg-background/50 backdrop-blur-sm"
      )}
    >
      <nav
        className="container flex h-16 items-center justify-between gap-4"
        aria-label="Main navigation"
      >
        <Link href="/" aria-label="9th Ward home" className="shrink-0 rounded-md">
          <Logo />
        </Link>

        {/* Desktop links */}
        <ul className="hidden items-center gap-0.5 xl:flex">
          <li>
            <Link
              href="/"
              aria-current={isActive("/") ? "page" : undefined}
              className={cn(
                "relative whitespace-nowrap rounded-md px-3 py-2 text-[13px] font-medium uppercase tracking-[0.16em] transition-colors hover:text-gold after:absolute after:inset-x-3 after:-bottom-0.5 after:h-px after:origin-left after:bg-gold after:transition-transform after:duration-300 hover:after:scale-x-100",
                isActive("/") ? "text-gold after:scale-x-100" : "text-muted-foreground after:scale-x-0"
              )}
            >
              Home
            </Link>
          </li>
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                aria-current={isActive(link.href) ? "page" : undefined}
                className={cn(
                  "relative whitespace-nowrap rounded-md px-3 py-2 text-[13px] font-medium uppercase tracking-[0.16em] transition-colors hover:text-gold after:absolute after:inset-x-3 after:-bottom-0.5 after:h-px after:origin-left after:bg-gold after:transition-transform after:duration-300 hover:after:scale-x-100",
                  isActive(link.href)
                    ? "text-gold after:scale-x-100"
                    : "text-muted-foreground after:scale-x-0"
                )}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex shrink-0 items-center gap-3">
          <span className="hidden items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.28em] text-muted-foreground md:inline-flex" aria-hidden>
            <span className="on-air" />
            <span className="eq"><i /><i /><i /><i /><i /></span>
          </span>
          <Button asChild size="sm" className="hidden sm:inline-flex">
            <Link href="/submit">Submit Music</Link>
          </Button>

          {/* Mobile menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="xl:hidden"
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetTitle className="mb-6">
                <Logo />
              </SheetTitle>
              <ul className="flex flex-col gap-1">
                <li>
                  <SheetClose asChild>
                    <Link
                      href="/"
                      aria-current={isActive("/") ? "page" : undefined}
                      className={cn(
                        "block rounded-md px-3 py-3 text-base font-medium transition-colors",
                        isActive("/")
                          ? "bg-secondary text-foreground"
                          : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                      )}
                    >
                      Home
                    </Link>
                  </SheetClose>
                </li>
                {NAV_LINKS.map((link) => (
                  <li key={link.href}>
                    <SheetClose asChild>
                      <Link
                        href={link.href}
                        aria-current={isActive(link.href) ? "page" : undefined}
                        className={cn(
                          "block rounded-md px-3 py-3 text-base font-medium transition-colors",
                          isActive(link.href)
                            ? "bg-secondary text-foreground"
                            : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                        )}
                      >
                        {link.label}
                      </Link>
                    </SheetClose>
                  </li>
                ))}
              </ul>
              <SheetClose asChild>
                <Button asChild className="mt-6 w-full">
                  <Link href="/submit">Submit Music</Link>
                </Button>
              </SheetClose>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
      <div className="rule-gold" aria-hidden />
    </header>
  );
}
