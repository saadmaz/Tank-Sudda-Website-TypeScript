/**
 * Frequently asked questions. Answers deliberately avoid prices, coverage,
 * timings and guarantees that the owner has not yet confirmed.
 */

export type FaqCategory = "general" | "booking" | "pricing" | "service";

export interface Faq {
  id: string;
  question: string;
  answer: string;
  category: FaqCategory;
  /** Show on the homepage FAQ section. */
  featured?: boolean;
}

export const faqCategories: Record<FaqCategory, string> = {
  general: "About tank cleaning",
  service: "During the service",
  booking: "Booking",
  pricing: "Pricing",
};

export const faqs: Faq[] = [
  {
    id: "how-often-clean",
    category: "general",
    featured: true,
    question: "How often should a water tank be cleaned?",
    answer:
      "There is no single interval that suits every tank. It depends on the quality of the incoming supply, how much sediment builds up, whether the tank is well covered, and how many people use the water. Regular visual inspection is the best guide; many owners plan a clean at least once a year and adjust from there. We can suggest a sensible interval after seeing your tank.",
  },
  {
    id: "vacuum-vs-deep",
    category: "service",
    featured: true,
    question: "What is the difference between deep cleaning and vacuum cleaning?",
    answer:
      "Deep cleaning empties the tank and scrubs the walls, floor and lid area as well as removing sediment. Vacuum cleaning focuses on lifting settled sediment from the tank floor with suction equipment. Deep cleaning suits first cleans and neglected tanks; vacuum cleaning suits routine maintenance. We recommend one or the other after assessment.",
  },
  {
    id: "what-tanks",
    category: "general",
    question: "What kinds of tanks do you clean?",
    answer:
      "We clean domestic and building water storage tanks and sumps. Tell us the tank type (for example plastic, concrete or steel), its approximate capacity and how it is accessed when you book, so we can plan the work.",
  },
  {
    id: "sump-and-tank-together",
    category: "service",
    question: "Should the sump and overhead tank be cleaned together?",
    answer:
      "Where a sump feeds an overhead tank, it usually makes sense to clean both on the same visit. If only the overhead tank is cleaned, sediment in the sump can be pumped straight back up.",
  },
  {
    id: "water-off-duration",
    category: "service",
    featured: true,
    question: "How long will my water be off?",
    answer:
      "It depends on the tank's size, condition and access, and on the service. We confirm the expected interruption before work begins so you can store water for essential use.",
  },
  {
    id: "prepare-for-clean",
    category: "booking",
    featured: true,
    question: "What do I need to do before the cleaning?",
    answer:
      "Make sure the tank or sump can be reached safely, know where the main valve and any pump switch are, and store some water for drinking and essential use. Our preparation guide covers this in more detail.",
  },
  {
    id: "how-to-book",
    category: "booking",
    question: "How do I book?",
    answer:
      "Use the online booking form to tell us about your property, the tanks and your preferred timing. Your request is not a confirmed appointment. Our team will contact you to confirm the details, the price and the date.",
  },
  {
    id: "how-pricing-works",
    category: "pricing",
    featured: true,
    question: "How much does tank cleaning cost?",
    answer:
      "The price depends on the service, tank capacity, number of tanks, access and the condition of the tank. Because these vary so much, we provide a quotation once we understand your tank. We usually work from the details in your booking request and arrange a site assessment for larger jobs.",
  },
  {
    id: "commercial-scheduling",
    category: "booking",
    question: "Can cleaning be scheduled around our building's occupants?",
    answer:
      "For apartment buildings, offices, schools and hotels, we agree the schedule with you in advance. Tell us about operating hours, notice periods and access arrangements when you enquire.",
  },
  {
    id: "areas-served",
    category: "booking",
    question: "Do you serve my area?",
    answer:
      "Include your town and address in the booking form and we will confirm whether we can serve your location before arranging anything.",
  },
];

export function getFaqsByIds(ids: readonly string[]): Faq[] {
  return ids.flatMap((id) => {
    const faq = faqs.find((item) => item.id === id);
    return faq ? [faq] : [];
  });
}

export const featuredFaqs: Faq[] = faqs.filter((faq) => faq.featured);
