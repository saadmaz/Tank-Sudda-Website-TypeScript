import { Inter, Schibsted_Grotesk } from "next/font/google";

// Next.js preloads every font declared in a module the layout imports, so the
// Sinhala and Tamil fonts live in their own module (app/(intl)/fonts.ts).
export const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
export const schibsted = Schibsted_Grotesk({
  subsets: ["latin"],
  variable: "--font-schibsted",
  display: "swap",
});
