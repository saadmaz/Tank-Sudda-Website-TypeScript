import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

// Teach tailwind-merge the custom type scale in globals.css; otherwise it treats
// e.g. "text-h1" as a colour and drops it when combined with "text-white".
const twMerge = extendTailwindMerge({
  extend: { classGroups: { "font-size": [{ text: ["display", "h1", "h2", "h3", "lead"] }] } },
});

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/** Format an ISO date (YYYY-MM-DD) for display in Sri Lankan English. */
export function formatDate(isoDate: string): string {
  const date = new Date(`${isoDate}T00:00:00Z`);
  return new Intl.DateTimeFormat("en-LK", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function isValidSlug(value: string): boolean {
  return SLUG_PATTERN.test(value);
}
