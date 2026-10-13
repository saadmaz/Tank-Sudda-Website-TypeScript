"use server";

import { formatLongDate } from "@/lib/dates";
import {
  bookingSubmissionSchema,
  capacityOptions,
  contactPreferenceOptions,
  labelFor,
  propertyTypeOptions,
  serviceOptions,
  type BookingData,
} from "@/lib/validation/booking";
import { normalisePhone } from "@/lib/validation/common";
import { processLead } from "@/server/leads/submit";
import type { Lead, SubmissionResult } from "@/server/leads/types";
import { leadRateLimiter } from "@/server/rate-limit";
import { getClientKey } from "./client-key";

function bookingToLead(data: BookingData, meta: { reference: string; submittedAt: string }): Lead {
  const phone = normalisePhone(data.phone) ?? data.phone;
  const contactBy = data.contactPreferences
    .map((value) => labelFor(contactPreferenceOptions, value) ?? value)
    .join(", ");
  const fields: Lead["fields"] = [
    {
      label: "Service",
      value: labelFor(serviceOptions, data.service) ?? data.service,
      shared: true,
    },
    {
      label: "Property type",
      value: labelFor(propertyTypeOptions, data.propertyType) ?? data.propertyType,
      shared: true,
    },
    {
      label: "Tank size",
      value: labelFor(capacityOptions, data.capacity) ?? data.capacity,
      shared: true,
    },
    { label: "Number of tanks", value: String(data.tankCount), shared: true },
    { label: "Town / area", value: data.town, shared: true },
    { label: "Address", value: data.address || "Not provided" },
    { label: "Preferred date", value: formatLongDate(data.preferredDate), shared: true },
  ];
  if (data.notes) fields.push({ label: "Notes", value: data.notes });
  fields.push(
    { label: "Name", value: data.name },
    { label: "Phone", value: phone },
    { label: "Email", value: data.email || "Not provided" },
    { label: "Contact by", value: contactBy, shared: true },
  );
  return {
    kind: "booking",
    reference: meta.reference,
    submittedAt: meta.submittedAt,
    contact: { name: data.name, phone, email: data.email || null },
    fields,
    marketingConsent: false,
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
