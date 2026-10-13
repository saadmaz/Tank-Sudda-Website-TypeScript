import type { MetadataRoute } from "next";
import { business } from "@/data/business";

/** Lets phones show the Tank Sudda logo when the site is added to the home screen. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${business.name}: water tank & sump cleaning`,
    short_name: business.name,
    description: business.description,
    start_url: "/",
    display: "browser",
    background_color: "#ffffff",
    theme_color: "#061c36",
    icons: [
      { src: "/brand/logo-badge-128.png", sizes: "128x128", type: "image/png" },
      { src: "/brand/logo-badge-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
