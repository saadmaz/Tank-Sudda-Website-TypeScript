/**
 * Verified business information: the single source of truth for contact
 * details shown on the site and in structured data.
 *
 * RULE: Only enter facts the owner has confirmed. Leave a value as `null`
 * (or an empty array) until it is verified. Components hide anything that is
 * missing; nothing here is ever replaced with a placeholder in production.
 */

export interface PhoneNumber {
  /** Human-readable form, e.g. "077 123 4567". */
  display: string;
  /** E.164 form, e.g. "+94771234567". */
  e164: string;
}

export interface PostalAddress {
  streetAddress: string;
  locality: string;
  region: string;
  postalCode: string | null;
  country: "LK";
}

export interface OpeningHours {
  /** schema.org day names, e.g. ["Monday", "Tuesday"]. */
  days: string[];
  opens: string; // "08:00"
  closes: string; // "17:00"
}

export type SocialPlatform =
  "facebook" | "instagram" | "tiktok" | "youtube" | "x" | "threads" | "linkedin";

/** Display order for social icons. */
export const socialPlatforms: { id: SocialPlatform; label: string }[] = [
  { id: "facebook", label: "Facebook" },
  { id: "instagram", label: "Instagram" },
  { id: "tiktok", label: "TikTok" },
  { id: "youtube", label: "YouTube" },
  { id: "x", label: "X" },
  { id: "threads", label: "Threads" },
  { id: "linkedin", label: "LinkedIn" },
];

export interface GoogleBusinessProfile {
  /** Public Google Maps / Business Profile URL, where people read reviews. */
  profileUrl: string | null;
  /** "Ask for reviews" link from Google Business Profile (opens the review form). */
  reviewUrl: string | null;
}

export interface Business {
  name: string;
  legalName: string | null;
  description: string;
  countryName: string;
  phone: PhoneNumber | null;
  /** WhatsApp number in E.164 form. */
  whatsapp: PhoneNumber | null;
  email: string | null;
  address: PostalAddress | null;
  openingHours: OpeningHours[];
  /** Official social profile URLs. Leave a platform out until the URL is confirmed. */
  social: Partial<Record<SocialPlatform, string>>;
  google: GoogleBusinessProfile;
  foundingYear: number | null;
}

export const business: Business = {
  name: "Tank Sudda",
  legalName: null,
  description:
    "Tank Sudda provides water tank and sump cleaning for homes, apartments and organisations in Sri Lanka.",
  countryName: "Sri Lanka",
  // Confirmed by the owner on 2026-10-12.
  phone: { display: "+94 74 100 4296", e164: "+94741004296" },
  // Confirmed by the owner on 2026-10-12 (same number as phone).
  whatsapp: { display: "+94 74 100 4296", e164: "+94741004296" },
  email: "tanksuddaglobal@gmail.com",
  address: null,
  openingHours: [],
  // Official profiles confirmed by the owner on 2026-10-12. Add LinkedIn here once it exists.
  social: {
    facebook: "https://www.facebook.com/TankSuddaa",
    instagram: "https://www.instagram.com/tanksudda",
    tiktok: "https://www.tiktok.com/@tanksudda",
    youtube: "https://www.youtube.com/@TankSudda",
    x: "https://x.com/TankSudda",
    threads: "https://www.threads.net/@tanksudda",
  },
  google: { profileUrl: null, reviewUrl: null },
  foundingYear: null,
};

export function hasDirectContact(b: Business = business): boolean {
  return Boolean(b.phone || b.whatsapp || b.email);
}

/** Configured social profiles, in display order. */
export function getSocialProfiles(
  b: Business = business,
): { id: SocialPlatform; label: string; url: string }[] {
  return socialPlatforms.flatMap(({ id, label }) => {
    const url = b.social[id];
    return url ? [{ id, label, url }] : [];
  });
}

/** Official profile URLs for structured data (schema.org sameAs). */
export function getProfileUrls(b: Business = business): string[] {
  const urls = getSocialProfiles(b).map((profile) => profile.url);
  if (b.google.profileUrl) urls.push(b.google.profileUrl);
  return urls;
}
