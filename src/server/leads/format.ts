import { randomInt } from "node:crypto";
import type { Lead } from "./types";

const REFERENCE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

/** e.g. TS-20261012-7K2QD (date in Sri Lanka time + 5 unambiguous characters). */
export function createReference(today: string): string {
  let suffix = "";
  for (let i = 0; i < 5; i++) suffix += REFERENCE_ALPHABET[randomInt(REFERENCE_ALPHABET.length)];
  return `TS-${today.replace(/-/g, "")}-${suffix}`;
}

export const REFERENCE_PATTERN = /^TS-\d{8}-[A-HJ-NP-Z2-9]{5}$/;

export function leadSubject(lead: Lead): string {
  const kind = lead.kind === "booking" ? "Booking request" : "Website enquiry";
  return `${kind} ${lead.reference}: ${lead.contact.name}`;
}

/** Plain-text summary used for email and logs (no HTML, so nothing to inject). */
export function leadToText(lead: Lead): string {
  const lines = [
    leadSubject(lead),
    `Submitted: ${lead.submittedAt}`,
    "",
    ...lead.fields.map((field) => `${field.label}: ${field.value}`),
  ];
  if (lead.marketingConsent) lines.push("", "Marketing consent: Yes");
  if (lead.kind === "booking") {
    lines.push("", "This is a request only. Contact the customer to confirm the appointment.");
  }
  return lines.join("\n");
}
