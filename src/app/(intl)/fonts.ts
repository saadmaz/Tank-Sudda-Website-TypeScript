import { Noto_Sans_Sinhala, Noto_Sans_Tamil } from "next/font/google";

// Sinhala and Tamil scripts are not in Inter or Schibsted Grotesk. Only the /si and
// /ta layout imports this module, so English pages never download these fonts.
// Both are declared here but each page uses one, so neither is preloaded (a preload
// would also fetch the other script's font); display: swap covers the short delay.
export const notoSinhala = Noto_Sans_Sinhala({
  subsets: ["sinhala"],
  variable: "--font-noto-sinhala",
  display: "swap",
  preload: false,
});
export const notoTamil = Noto_Sans_Tamil({
  subsets: ["tamil"],
  variable: "--font-noto-tamil",
  display: "swap",
  preload: false,
});
