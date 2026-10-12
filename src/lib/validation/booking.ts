import { z } from "zod";
import { services } from "@/data/services";
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
  ...services.map((service) => ({ value: service.slug, label: service.name })),
  { value: "not-sure", label: "Not sure — please advise" },
] as const satisfies Options<string>;

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

const COMMERCIAL_PROPERTY_TYPES: readonly string[] = [
  "apartment-building",
  "office",
  "institution",
  "hospitality",
  "industrial",
];

export const tankTypeOptions = [
  { value: "overhead-plastic", label: "Overhead tank — plastic" },
  { value: "overhead-concrete", label: "Overhead tank — concrete" },
  { value: "steel", label: "Steel tank" },
  { value: "sump", label: "Underground sump" },
  { value: "ground-level", label: "Ground-level tank" },
  { value: "mixed", label: "More than one type" },
  { value: "not-sure", label: "Not sure" },
] as const;

export const capacityOptions = [
  { value: "under-1000", label: "Under 1,000 litres" },
  { value: "1000-2500", label: "1,000 – 2,500 litres" },
  { value: "2500-5000", label: "2,500 – 5,000 litres" },
  { value: "5000-10000", label: "5,000 – 10,000 litres" },
  { value: "over-10000", label: "Over 10,000 litres" },
  { value: "not-sure", label: "Not sure" },
] as const;

export const timeWindowOptions = [
  { value: "morning", label: "Morning" },
  { value: "afternoon", label: "Afternoon" },
  { value: "flexible", label: "Flexible" },
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

export function isCommercialProperty(propertyType: string | undefined): boolean {
  return propertyType !== undefined && COMMERCIAL_PROPERTY_TYPES.includes(propertyType);
}

const optionalText = (max: number) =>
  z.string().trim().max(max, `Must be ${max} characters or fewer`);

/** Field definitions without cross-field rules (so they can be extended). */
export const bookingFieldsSchema = z.object({
  service: z.enum(values(serviceOptions), { error: "Choose a service" }),
  propertyType: z.enum(values(propertyTypeOptions), { error: "Choose a property type" }),
  tankType: z.enum(values(tankTypeOptions), { error: "Choose a tank type" }),
  capacity: z.enum(values(capacityOptions), { error: "Choose an approximate capacity" }),
  tankCount: z
    .number({ error: "Enter the number of tanks" })
    .int("Enter a whole number")
    .min(1, "Enter at least 1")
    .max(50, "For more than 50 tanks, tell us in the notes"),
  organisationName: optionalText(120),
  siteNotes: optionalText(1000),
  town: z.string().trim().min(2, "Enter your town or area").max(80),
  address: z.string().trim().min(5, "Enter the property address").max(300),
  preferredDate: z
    .string()
    .min(1, "Choose a preferred date")
    .refine((value) => isDateInBookingWindow(value), {
      message: `Choose a date from tomorrow up to ${MAX_BOOKING_DAYS_AHEAD} days ahead`,
    }),
  timeWindow: z.enum(values(timeWindowOptions), { error: "Choose a time of day" }),
  notes: optionalText(1000),
  name: nameSchema,
  phone: phoneSchema,
  email: optionalEmailSchema,
  contactPreference: z.enum(values(contactPreferenceOptions), {
    error: "Choose how we should contact you",
  }),
  marketingConsent: z.boolean(),
  privacyAcknowledged: z.literal(true, {
    error: "Please confirm you have read the privacy notice",
  }),
});

const emailWhenPreferredCheck = (data: { contactPreference: string; email: string }) =>
  !(data.contactPreference === "email" && data.email === "");
const emailWhenPreferredParams = {
  path: ["email"],
  message: "Enter an email address so we can reply by email",
  when: whenFieldsValid(["email", "contactPreference"]),
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
  id: "service" | "tank" | "site" | "location" | "contact" | "review";
  title: string;
  description: string;
  fields: BookingField[];
}

const allSteps: BookingStep[] = [
  {
    id: "service",
    title: "Service",
    description: "What do you need, and where?",
    fields: ["service", "propertyType"],
  },
  {
    id: "tank",
    title: "Tanks",
    description: "Tell us about the tanks to be cleaned.",
    fields: ["tankType", "capacity", "tankCount"],
  },
  {
    id: "site",
    title: "Site",
    description: "A few details to help us plan work at a larger site.",
    fields: ["organisationName", "siteNotes"],
  },
  {
    id: "location",
    title: "Location & timing",
    description: "Where is the property, and when would suit you?",
    fields: ["town", "address", "preferredDate", "timeWindow", "notes"],
  },
  {
    id: "contact",
    title: "Your details",
    description: "How can we reach you to confirm?",
    fields: [
      "name",
      "phone",
      "email",
      "contactPreference",
      "marketingConsent",
      "privacyAcknowledged",
    ],
  },
  { id: "review", title: "Review", description: "Check your request before sending.", fields: [] },
];

/** Steps shown for the current answers. The site step appears only for larger properties. */
export function getActiveSteps(values: { propertyType?: string }): BookingStep[] {
  return allSteps.filter((step) => step.id !== "site" || isCommercialProperty(values.propertyType));
}
