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
  /** Public profile URLs (Facebook, Instagram, Google Business Profile, …). */
  sameAs: string[];
  foundingYear: number | null;
}

export const business: Business = {
  name: "Tank Sudda",
  legalName: null,
  description:
    "Tank Sudda provides water tank cleaning, vacuum cleaning and sump cleaning for homes, apartments and organisations in Sri Lanka.",
  countryName: "Sri Lanka",
  // Confirmed by the owner on 2026-10-12.
  phone: { display: "+94 74 100 4296", e164: "+94741004296" },
  // Confirmed by the owner on 2026-10-12 (same number as phone).
  whatsapp: { display: "+94 74 100 4296", e164: "+94741004296" },
  email: "tanksuddaglobal@gmail.com",
  address: null,
  openingHours: [],
  sameAs: [],
  foundingYear: null,
};

export function hasDirectContact(b: Business = business): boolean {
  return Boolean(b.phone || b.whatsapp || b.email);
}
