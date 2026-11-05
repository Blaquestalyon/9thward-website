import { Inter, Playfair_Display } from "next/font/google";

/** Body font — clean, highly legible variable sans. */
export const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

/** Display font — high-contrast serif matching the hero art's "9TH WARD" lettering. */
export const fontDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});
