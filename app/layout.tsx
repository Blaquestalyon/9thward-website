import type { Metadata } from "next";
import "./globals.css";
import { fontSans, fontDisplay } from "@/lib/fonts";
import { SITE } from "@/lib/site";
import { absoluteUrl } from "@/lib/utils";
import { ThemeProvider } from "@/components/site/theme-provider";
import { Nav } from "@/components/site/nav";
import { Footer } from "@/components/site/footer";
import { Analytics } from "@/components/site/analytics";
import { JsonLd } from "@/components/site/json-ld";
import { organizationLd, labelMusicGroupLd } from "@/lib/jsonld";
import { Toaster } from "sonner";

function safeMetadataBase(): URL {
  const raw = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  // Tolerate values like "www.9thwardrecording.com" (missing scheme) so a
  // misconfigured env var never crashes rendering.
  const normalized = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
  try {
    return new URL(normalized);
  } catch {
    return new URL("http://localhost:3000");
  }
}

export const metadata: Metadata = {
  metadataBase: safeMetadataBase(),
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
    images: [
      {
        url: "/logo.png",
        width: 300,
        height: 300,
        alt: "9th Ward Production & Promotions",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE.name,
    description: SITE.description,
    images: ["/logo.png"],
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
      suppressHydrationWarning
      className={`${fontSans.variable} ${fontDisplay.variable}`}
    >
      <body className="min-h-screen bg-background font-sans">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
          >
            Skip to content
          </a>
          <Nav />
          <main id="main">{children}</main>
          <Footer />
          <Toaster richColors position="top-center" />
        </ThemeProvider>
        <Analytics />
        <JsonLd data={[organizationLd(), labelMusicGroupLd()]} />
      </body>
    </html>
  );
}
