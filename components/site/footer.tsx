import Link from "next/link";
import { SITE, NAV_LINKS, SOCIAL_LINKS } from "@/lib/site";
import { Logo } from "./logo";
import { SocialIcon } from "./social-icons";
import { NewsletterForm } from "./newsletter-form";
import { Separator } from "@/components/ui/separator";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-card/40">
      <div className="container py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Logo />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
              {SITE.description}
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-2">
              {SOCIAL_LINKS.map((social) =>
                social.href ? (
                  <a
                    key={social.key}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:border-primary hover:text-foreground"
                  >
                    <SocialIcon keyName={social.key} />
                  </a>
                ) : (
                  <span
                    key={social.key}
                    aria-label={`${social.label} (coming soon)`}
                    title={`${social.label} — coming soon`}
                    className="inline-flex h-11 w-11 cursor-default items-center justify-center rounded-md border border-dashed border-border/60 text-muted-foreground/40"
                  >
                    <SocialIcon keyName={social.key} />
                  </span>
                )
              )}
            </div>
          </div>

          {/* Explore */}
          <nav aria-label="Footer navigation">
            <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-foreground">
              Explore
            </h3>
            <ul className="mt-4 space-y-2.5">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/submit"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  Submit Music
                </Link>
              </li>
            </ul>
          </nav>

          {/* Newsletter */}
          <div>
            <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-foreground">
              Newsletter
            </h3>
            <p className="mt-4 text-sm text-muted-foreground">
              New releases, shows, and roster news. No spam.
            </p>
            <div className="mt-4">
              <NewsletterForm />
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col items-center justify-between gap-3 text-center sm:flex-row sm:text-left">
          <p className="text-xs text-muted-foreground">
            &copy; {year} {SITE.legalName}. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            {SITE.address.formatted} &middot; Independent since{" "}
            {SITE.foundingYear}
          </p>
        </div>
      </div>
    </footer>
  );
}
