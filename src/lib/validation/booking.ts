import { z } from "zod";
import { todayInSriLanka } from "@/lib/dates";
import {
  antiSpamSchema,
  nameSchema,
  optionalEmailSchema,
  phoneSchema,
  whenFieldsValid,
} from "./common";

/** A labelled option list; the first element type keeps values literal. */
type Options<V extends string> = readonly { value: V; label: string }[];

function values<V extends string>(options: Options<V>): [V, ...V[]] {
  return options.map((option) => option.value) as [V, ...V[]];
}

export function labelFor<V extends string>(
  options: Options<V>,
  value: V | undefined,
): string | undefined {
  return options.find((option) => option.value === value)?.label;
}

export const serviceOptions = [
  { value: "water-tank", label: "Water tank cleaning" },
  { value: "sump", label: "Sump cleaning" },
  { value: "tank-and-sump", label: "Water tank and sump" },
] as const;

/** Service pages link to /book?service=<page slug>; this maps each page to a form choice. */
export const serviceForPageSlug: Record<string, (typeof serviceOptions)[number]["value"]> = {
  "water-tank-deep-cleaning": "water-tank",
  "sump-cleaning": "sump",
  "commercial-tank-cleaning": "water-tank",
};

export const propertyTypeOptions = [
  { value: "house", label: "House" },
  { value: "apartment-unit", label: "Apartment (single unit)" },
  { value: "apartment-building", label: "Apartment building" },
  { value: "office", label: "Office or commercial building" },
  { value: "institution", label: "School or institution" },
  { value: "hospitality", label: "Hotel, guest house or restaurant" },
  { value: "industrial", label: "Factory or industrial site" },
  { value: "other", label: "Other" },
] as const;

export const capacityOptions = [
  { value: "under-1000", label: "Under 1,000 litres" },
  { value: "1000-2500", label: "1,000 – 2,500 litres" },
  { value: "2500-5000", label: "2,500 – 5,000 litres" },
  { value: "5000-10000", label: "5,000 – 10,000 litres" },
  { value: "over-10000", label: "Over 10,000 litres" },
  { value: "not-sure", label: "Not sure" },
] as const;

export const contactPreferenceOptions = [
  { value: "phone", label: "Phone call" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "email", label: "Email" },
] as const;

export const MAX_BOOKING_DAYS_AHEAD = 180;

function addDays(isoDate: string, days: number): string {
  const date = new Date(`${isoDate}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

/** Earliest and latest selectable dates (Sri Lanka time): tomorrow to ~6 months ahead. */
export function bookingDateWindow(now: Date = new Date()): { min: string; max: string } {
  const today = todayInSriLanka(now);
  return { min: addDays(today, 1), max: addDays(today, MAX_BOOKING_DAYS_AHEAD) };
}

export function isDateInBookingWindow(isoDate: string, now: Date = new Date()): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(isoDate) || Number.isNaN(Date.parse(isoDate))) return false;
  const { min, max } = bookingDateWindow(now);
  return isoDate >= min && isoDate <= max;
}

const optionalText = (max: number) =>
  z.string().trim().max(max, `Must be ${max} characters or fewer`);

/** Field definitions without cross-field rules (so they can be extended). */
export const bookingFieldsSchema = z.object({
  service: z.enum(values(serviceOptions), { error: "Choose a service" }),
  propertyType: z.enum(values(propertyTypeOptions), { error: "Choose a property type" }),
  capacity: z.enum(values(capacityOptions), { error: "Choose the approximate tank size" }),
  tankCount: z
    .number({ error: "Enter the number of tanks" })
    .int("Enter a whole number")
    .min(1, "Enter at least 1")
    .max(50, "For more than 50 tanks, tell us in the notes"),
  town: z.string().trim().min(2, "Enter your town or area").max(80),
  address: optionalText(300),
  preferredDate: z
    .string()
    .min(1, "Choose a preferred date")
    .refine((value) => isDateInBookingWindow(value), {
      message: `Choose a date from tomorrow up to ${MAX_BOOKING_DAYS_AHEAD} days ahead`,
    }),
  notes: optionalText(1000),
  name: nameSchema,
  phone: phoneSchema,
  email: optionalEmailSchema,
  contactPreferences: z
    .array(z.enum(values(contactPreferenceOptions)), {
      error: "Choose at least one way to contact you",
    })
    .min(1, "Choose at least one way to contact you"),
  privacyAcknowledged: z.literal(true, {
    error: "Please confirm you have read the privacy notice",
  }),
});

const emailWhenPreferredCheck = (data: { contactPreferences: string[]; email: string }) =>
  !(data.contactPreferences.includes("email") && data.email === "");
const emailWhenPreferredParams = {
  path: ["email"],
  message: "Enter an email address so we can reply by email",
  when: whenFieldsValid(["email", "contactPreferences"]),
};

export const bookingSchema = bookingFieldsSchema.refine(
  emailWhenPreferredCheck,
  emailWhenPreferredParams,
);
export type BookingInput = z.input<typeof bookingSchema>;
export type BookingData = z.output<typeof bookingSchema>;

export const bookingSubmissionSchema = bookingFieldsSchema
  .extend(antiSpamSchema.shape)
  .refine(emailWhenPreferredCheck, emailWhenPreferredParams);
export type BookingSubmission = z.input<typeof bookingSubmissionSchema>;

export type BookingField = keyof BookingData;

export interface BookingStep {
  id: "tank" | "location" | "contact";
  title: string;
  description: string;
  fields: BookingField[];
}

/** The three steps of the booking form. The last one also shows a summary and the send button. */
export const bookingSteps: BookingStep[] = [
  {
    id: "tank",
    title: "Your tank",
    description: "Tell us what needs cleaning.",
    fields: ["service", "propertyType", "capacity", "tankCount"],
  },
  {
    id: "location",
    title: "Where & when",
    description: "Where is the property, and when would suit you?",
    fields: ["town", "address", "preferredDate", "notes"],
  },
  {
    id: "contact",
    title: "Your details",
    description: "How can we reach you to confirm?",
    fields: ["name", "phone", "email", "contactPreferences", "privacyAcknowledged"],
  },
];
