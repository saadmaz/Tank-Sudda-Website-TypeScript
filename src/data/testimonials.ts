/**
 * Customer feedback. Only add feedback that is genuine, attributable and
 * published with the customer's permission. Do not paraphrase or combine
 * reviews. The testimonials page stays out of search results while empty.
 *
 * Example:
 *   { id: "2026-03-nuwan", quote: "…", name: "Nuwan", context: "Homeowner, Kandy",
 *     serviceSlug: "sump-cleaning", date: "2026-03-14", source: "Google review",
 *     sourceUrl: "https://…", consentToPublish: true }
 */

export interface Testimonial {
  id: string;
  quote: string;
  /** Name as the customer agreed it may be shown (e.g. first name only). */
  name: string;
  context: string | null;
  serviceSlug: string | null;
  /** ISO date the feedback was given. */
  date: string;
  source: string;
  sourceUrl: string | null;
  consentToPublish: true;
}

export const testimonials: Testimonial[] = [];

export function getPublishableTestimonials(list: Testimonial[] = testimonials): Testimonial[] {
  return list.filter((item) => item.consentToPublish === true && item.quote.trim().length > 0);
}
