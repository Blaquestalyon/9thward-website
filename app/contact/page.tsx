import type { Metadata } from "next";
import { CalendarDays, Clock, Mail, MapPin, Newspaper, Send } from "lucide-react";
import { listArtists } from "@/lib/airtable/read";
import { SITE, SOCIAL_LINKS } from "@/lib/site";
import { PageHeader } from "@/components/site/page-header";
import { Section } from "@/components/site/section";
import { ContactForm } from "@/components/site/contact-form";
import { BookingForm } from "@/components/site/booking-form";
import { SocialIcon } from "@/components/site/social-icons";
import { FadeUp } from "@/components/site/motion";
import { JsonLd } from "@/components/site/json-ld";
import { breadcrumbLd } from "@/lib/jsonld";
import { Separator } from "@/components/ui/separator";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with 9th Ward Production & Promotions — general inquiries, booking requests, and services.",
};

const ROUTES = [
  {
    icon: Send,
    title: "Submit your music",
    body: "For artists who want to join the roster.",
    href: "/submit",
    external: false,
  },
  {
    icon: CalendarDays,
    title: "Book an artist",
    body: "For events, venues, and promoters.",
    href: "#booking",
    external: false,
  },
  {
    icon: Newspaper,
    title: "Press & partners",
    body: "Interviews, features, and collaborations.",
    href: `mailto:${SITE.contactEmail}`,
    external: true,
  },
];

export default async function ContactPage() {
  const artists = await listArtists();
  const artistOptions = artists.map((a) => a.stageName || a.name);

  return (
    <>
      <JsonLd
        data={breadcrumbLd([
          { name: "Home", path: "/" },
          { name: "Contact", path: "/contact" },
        ])}
      />
      <PageHeader
        eyebrow="Say hello"
        title="Contact"
        description="Questions, collaborations, press, or booking — we're all ears."
      />

      {/* Routing tiles */}
      <Section className="pb-0">
        <div className="grid gap-4 sm:grid-cols-3">
          {ROUTES.map((r) => (
            <FadeUp key={r.title}>
              <a
                href={r.href}
                className="group flex h-full flex-col rounded-xl border border-border bg-card p-6 transition-colors hover:border-primary/60"
              >
                <span className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <r.icon className="h-5 w-5" />
                </span>
                <span className="font-display text-lg font-semibold group-hover:text-primary">
                  {r.title}
                </span>
                <span className="mt-1 text-sm text-muted-foreground">
                  {r.body}
                </span>
              </a>
            </FadeUp>
          ))}
        </div>
      </Section>

      <Section>
        <div className="grid gap-12 lg:grid-cols-[1fr_320px]">
          <div className="space-y-14">
            {/* General contact */}
            <div>
              <h2 className="font-display text-2xl font-semibold">
                Send a message
              </h2>
              <p className="mt-2 text-muted-foreground">
                Tell us why you&apos;re reaching out and we&apos;ll route it to
                the right person.
              </p>
              <div className="mt-6">
                <ContactForm />
              </div>
            </div>

            <Separator />

            {/* Booking */}
            <div id="booking" className="scroll-mt-24">
              <h2 className="font-display text-2xl font-semibold">
                Book an artist
              </h2>
              <p className="mt-2 text-muted-foreground">
                Planning a show? Tell us about your event and we&apos;ll follow
                up.
              </p>
              <div className="mt-6">
                <BookingForm artistOptions={artistOptions} />
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            <div className="rounded-lg border border-border bg-card p-6">
              <h3 className="font-display text-lg font-semibold">Reach us</h3>
              <ul className="mt-4 space-y-3 text-sm">
                <li className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="h-4 w-4 shrink-0 text-primary" />
                  <a
                    href={`mailto:${SITE.contactEmail}`}
                    className="hover:text-foreground"
                  >
                    {SITE.contactEmail}
                  </a>
                </li>
                <li className="flex items-start gap-2 text-muted-foreground">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <span>
                    2800 Post Oak Blvd, Suite 5600
                    <br />
                    Houston, TX 77056
                  </span>
                </li>
                <li className="flex items-start gap-2 text-muted-foreground">
                  <Clock className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <span>We reply within 2 business days.</span>
                </li>
              </ul>
            </div>

            <div className="rounded-lg border border-border bg-card p-6">
              <h3 className="font-display text-lg font-semibold">Follow</h3>
              <div className="mt-4 flex flex-wrap gap-2">
                {SOCIAL_LINKS.filter((s) => s.href).map((s) => (
                  <a
                    key={s.key}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:border-primary hover:text-foreground"
                  >
                    <SocialIcon keyName={s.key} />
                  </a>
                ))}
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                More platforms coming soon.
              </p>
            </div>
          </aside>
        </div>
      </Section>
    </>
  );
}
