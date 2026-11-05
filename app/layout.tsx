import type { Metadata } from "next";
import "./globals.css";
import { fontSans, fontDisplay } from "@/lib/fonts";
import { SITE } from "@/lib/site";
import { absoluteUrl } from "@/lib/utils";
import { Nav } from "@/components/site/nav";
import { Footer } from "@/components/site/footer";
import { Analytics } from "@/components/site/analytics";
import { JsonLd } from "@/components/site/json-ld";
import { RevealObserver } from "@/components/site/reveal-observer";
import { organizationLd, labelMusicGroupLd } from "@/lib/jsonld";
import { Toaster } from "sonner";

const OG_IMAGE = {
  url: "/img/og-9thward.jpg",
  width: 1200,
  height: 630,
  alt: "9th Ward Production & Promotions: born to protect independent artists",
};

export const metadata: Metadata = {
  // Same origin logic as absoluteUrl() (falls back to the production domain
  // in production), so og:image is always an absolute https URL.
  metadataBase: new URL(absoluteUrl("/")),
  title: {
    default: `${SITE.name} — Houston Indie Music Label`,
    template: `%s · ${SITE.shortName}`,
  },
  description: SITE.description,
  keywords: [
    "indie music label",
    "Houston music",
    "Houston indie label",
    "New Orleans",
    "artist management",
    "music production",
    "music promotion",
    "9th Ward",
    "9th Ward Productions",
  ],
  openGraph: {
    type: "website",
    siteName: SITE.name,
    title: SITE.name,
    description: SITE.description,
    url: absoluteUrl("/"),
    images: [OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE.name,
    description: SITE.description,
    images: [OG_IMAGE.url],
  },
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
  robots: { index: true, follow: true },
  alternates: { canonical: absoluteUrl("/") },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`dark ${fontSans.variable} ${fontDisplay.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Reveal-on-scroll only hides content once JS is known to run. */}
        <script
          dangerouslySetInnerHTML={{
            __html: "document.documentElement.classList.add('js')",
          }}
        />
      </head>
      <body className="min-h-screen bg-background font-sans">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
        >
          Skip to content
        </a>
        <Nav />
        <main id="main">{children}</main>
        <Footer newsletterCentered />
        <Toaster
          theme="dark"
          position="bottom-center"
          toastOptions={{
            style: {
              background: "hsl(30 10% 7% / 0.92)",
              border: "1px solid hsl(42 78% 63% / 0.45)",
              color: "hsl(40 33% 94%)",
              letterSpacing: "0.04em",
              backdropFilter: "blur(8px)",
            },
          }}
        />
        <RevealObserver />
        <Analytics />
        <JsonLd data={[organizationLd(), labelMusicGroupLd()]} />
      </body>
    </html>
  );
}
