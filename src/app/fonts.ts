import { Inter, Noto_Sans_Sinhala, Noto_Sans_Tamil, Schibsted_Grotesk } from "next/font/google";

export const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
export const schibsted = Schibsted_Grotesk({
  subsets: ["latin"],
  variable: "--font-schibsted",
  display: "swap",
});

// Sinhala and Tamil scripts are not in Inter or Schibsted Grotesk. These are only
// referenced by the /si and /ta layouts, so English pages never download them.
export const notoSinhala = Noto_Sans_Sinhala({
  subsets: ["sinhala"],
  variable: "--font-noto-sinhala",
  display: "swap",
});
export const notoTamil = Noto_Sans_Tamil({
  subsets: ["tamil"],
  variable: "--font-noto-tamil",
  display: "swap",
});
