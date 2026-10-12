/**
 * Image slots used by page sections. Set a slot to a photo object to replace
 * the built-in technical illustration — no component changes required.
 *
 * Put files in /public/images/photos and use real Tank Sudda photographs of
 * tanks, equipment and work in progress. Avoid identifiable people unless they
 * have consented.
 *
 * Example:
 *   homeHero: { src: "/images/photos/rooftop-tank.jpg", width: 1600, height: 1200,
 *               alt: "Cleaned overhead water tank on a residential rooftop" },
 */

export interface SitePhoto {
  src: string;
  alt: string;
  width: number;
  height: number;
}

export type ImageSlot = "homeHero" | "aboutStory" | "servicesOverview" | "bookingAside";

export const siteImages: Record<ImageSlot, SitePhoto | null> = {
  homeHero: null,
  aboutStory: null,
  servicesOverview: null,
  bookingAside: null,
};
