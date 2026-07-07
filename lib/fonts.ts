import { Inter, Space_Grotesk } from "next/font/google";

/** Body font — clean, highly legible variable sans. */
export const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

/** Display font — strong, characterful headings. */
export const fontDisplay = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});
