import type { Metadata } from "next";
import { Mail, MapPin } from "lucide-react";
import { listArtists } from "@/lib/airtable/read";
import { SITE, SOCIAL_LINKS } from "@/lib/site";
import { PageHeader } from "@/components/site/page-header";
import { Section } from "@/components/site/section";
import { ContactForm } from "@/components/site/contact-form";
import { BookingForm } from "@/components/site/booking-form";
import { SocialIcon } from "@/components/site/social-icons";
import { JsonLd } from "@/components/site/json-ld";
import { breadcrumbLd } from "@/lib/jsonld";
import { Separator } from "@/components/ui/separator";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with 9th Ward Production & Promotions — general inquiries, booking requests, and services.",
};

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

      <Section>
        <div className="grid gap-12 lg:grid-cols-[1fr_320px]">
          <div className="space-y-14">
            {/* General contact */}
            <div>
              <h2 className="font-display text-2xl font-semibold">
                Send a message
              </h2>
              <p className="mt-2 text-muted-foreground">
                For general inquiries, press, and everything else.
              </p>
              <div className="mt-6">
                <ContactForm />
              </div>
            </div>

            <Separator />

            {/* Booking */}
            <div id="booking">
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
