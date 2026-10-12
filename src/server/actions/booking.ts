"use server";

import {
  bookingSubmissionSchema,
  capacityOptions,
  contactPreferenceOptions,
  labelFor,
  propertyTypeOptions,
  serviceOptions,
  tankTypeOptions,
  timeWindowOptions,
  type BookingData,
} from "@/lib/validation/booking";
import { normalisePhone } from "@/lib/validation/common";
import { processLead } from "@/server/leads/submit";
import type { Lead, SubmissionResult } from "@/server/leads/types";
import { leadRateLimiter } from "@/server/rate-limit";
import { getClientKey } from "./client-key";

function bookingToLead(data: BookingData, meta: { reference: string; submittedAt: string }): Lead {
  const fields: Lead["fields"] = [
    { label: "Service", value: labelFor(serviceOptions, data.service) ?? data.service },
    {
      label: "Property type",
      value: labelFor(propertyTypeOptions, data.propertyType) ?? data.propertyType,
    },
    { label: "Tank type", value: labelFor(tankTypeOptions, data.tankType) ?? data.tankType },
    { label: "Capacity", value: labelFor(capacityOptions, data.capacity) ?? data.capacity },
    { label: "Number of tanks", value: String(data.tankCount) },
  ];
  if (data.organisationName) fields.push({ label: "Organisation", value: data.organisationName });
  if (data.siteNotes) fields.push({ label: "Site notes", value: data.siteNotes });
  fields.push(
    { label: "Town / area", value: data.town },
    { label: "Address", value: data.address },
    { label: "Preferred date", value: data.preferredDate },
    {
      label: "Time of day",
      value: labelFor(timeWindowOptions, data.timeWindow) ?? data.timeWindow,
    },
  );
  if (data.notes) fields.push({ label: "Notes", value: data.notes });
  const phone = normalisePhone(data.phone) ?? data.phone;
  fields.push(
    { label: "Name", value: data.name },
    { label: "Phone", value: phone },
    { label: "Email", value: data.email || "Not provided" },
    {
      label: "Preferred contact",
      value: labelFor(contactPreferenceOptions, data.contactPreference) ?? data.contactPreference,
    },
  );
  return {
    kind: "booking",
    reference: meta.reference,
    submittedAt: meta.submittedAt,
    contact: { name: data.name, phone, email: data.email || null },
    fields,
    marketingConsent: data.marketingConsent,
  };
}

/** Receives a booking request. Does not create a confirmed appointment. */
export async function submitBooking(input: unknown): Promise<SubmissionResult> {
  return processLead({
    input,
    schema: bookingSubmissionSchema,
    toLead: bookingToLead,
    allow: (key) => leadRateLimiter.check(key),
    clientKey: await getClientKey("booking"),
  });
}
