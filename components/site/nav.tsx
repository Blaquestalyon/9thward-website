"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { NAV_LINKS } from "@/lib/site";
import { Button } from "@/components/ui/button";
import { Logo } from "./logo";
import { ThemeToggle } from "./theme-toggle";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

/**
 * Home is a cascading menu so the Home 2 preview can be viewed live without
 * replacing the real homepage. Once a final homepage is chosen, delete the
 * HOME_LINKS "Home 2" entry (and the /home-2 route) to remove it.
 */
const HOME_LINKS = [
  { href: "/", label: "Home" },
  { href: "/home-2", label: "Home 2", note: "preview" },
];

export function Nav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = React.useState(false);
  const [homeOpen, setHomeOpen] = React.useState(false);
  const homeRef = React.useRef<HTMLLIElement>(null);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the Home dropdown on outside click or Escape.
  React.useEffect(() => {
    if (!homeOpen) return;
    const onDown = (e: MouseEvent) => {
      if (homeRef.current && !homeRef.current.contains(e.target as Node)) {
        setHomeOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setHomeOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [homeOpen]);

  // Close the dropdown whenever the route changes.
  React.useEffect(() => {
    setHomeOpen(false);
  }, [pathname]);

  const isActive = (href: string) =>
    pathname === href || (href !== "/" && pathname.startsWith(href));
  const homeActive = pathname === "/" || pathname.startsWith("/home-2");

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full border-b transition-colors duration-300",
        scrolled
          ? "border-border bg-background/85 backdrop-blur-md"
          : "border-transparent bg-background/40 backdrop-blur-sm"
      )}
    >
      <nav
        className="container flex h-16 items-center justify-between gap-4"
        aria-label="Main navigation"
      >
        <Link href="/" aria-label="9th Ward home" className="rounded-md">
          <Logo />
        </Link>

        {/* Desktop links */}
        <ul className="hidden items-center gap-1 lg:flex">
          {/* Home — cascading menu */}
          <li ref={homeRef} className="relative">
            <button
              type="button"
              onClick={() => setHomeOpen((o) => !o)}
              aria-haspopup="menu"
              aria-expanded={homeOpen}
              className={cn(
                "flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:text-foreground",
                homeActive ? "text-foreground" : "text-muted-foreground"
              )}
            >
              Home
              <ChevronDown
                className={cn(
                  "h-3.5 w-3.5 transition-transform",
                  homeOpen && "rotate-180"
                )}
              />
            </button>
            {homeOpen && (
              <div
                role="menu"
                className="absolute left-0 top-full z-50 mt-1 min-w-[11rem] rounded-lg border border-border bg-popover p-1 shadow-xl"
              >
                {HOME_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    role="menuitem"
                    aria-current={pathname === link.href ? "page" : undefined}
                    className={cn(
                      "flex items-center justify-between gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                      pathname === link.href
                        ? "bg-secondary text-foreground"
                        : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                    )}
                  >
                    {link.label}
                    {link.note && (
                      <span className="rounded bg-gold/15 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-gold">
                        {link.note}
                      </span>
                    )}
                  </Link>
                ))}
              </div>
            )}
          </li>

          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                aria-current={isActive(link.href) ? "page" : undefined}
                className={cn(
                  "rounded-md px-3 py-2 text-sm font-medium transition-colors hover:text-foreground",
                  isActive(link.href)
                    ? "text-foreground"
                    : "text-muted-foreground"
                )}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-1.5">
          <Button asChild size="sm" className="hidden sm:inline-flex">
            <Link href="/submit">Submit Music</Link>
          </Button>
          <ThemeToggle />

          {/* Mobile menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
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
                {HOME_LINKS.map((link) => (
                  <li key={link.href}>
                    <SheetClose asChild>
                      <Link
                        href={link.href}
                        aria-current={
                          pathname === link.href ? "page" : undefined
                        }
                        className={cn(
                          "flex items-center justify-between gap-2 rounded-md px-3 py-3 text-base font-medium transition-colors",
                          pathname === link.href
                            ? "bg-secondary text-foreground"
                            : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                        )}
                      >
                        {link.label}
                        {link.note && (
                          <span className="rounded bg-gold/15 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-gold">
                            {link.note}
                          </span>
                        )}
                      </Link>
                    </SheetClose>
                  </li>
                ))}
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
    </header>
  );
}
