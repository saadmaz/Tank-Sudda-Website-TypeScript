import type { PhoneNumber } from "@/data/business";

const MAX_MESSAGE_LENGTH = 1500;

/** Digits-only WhatsApp ID from an E.164 number, or null if malformed. */
export function toWhatsAppId(phone: PhoneNumber | null): string | null {
  if (!phone) return null;
  const digits = phone.e164.replace(/\D/g, "");
  return digits.length >= 8 && digits.length <= 15 ? digits : null;
}

/** Builds a wa.me click-to-chat link, or null when no WhatsApp number is verified. */
export function buildWhatsAppUrl(phone: PhoneNumber | null, message?: string): string | null {
  const id = toWhatsAppId(phone);
  if (!id) return null;
  const url = new URL(`https://wa.me/${id}`);
  const text = message?.trim();
  if (text) url.searchParams.set("text", text.slice(0, MAX_MESSAGE_LENGTH));
  return url.toString();
}

export function serviceEnquiryMessage(serviceName?: string): string {
  return serviceName
    ? `Hello Tank Sudda, I would like to ask about ${serviceName}.`
    : "Hello Tank Sudda, I would like to ask about tank cleaning.";
}

export interface BookingMessageFields {
  serviceName?: string;
  propertyTypeLabel?: string;
  tankTypeLabel?: string;
  capacityLabel?: string;
  tankCount?: number;
  town?: string;
  preferredDate?: string;
  timeWindowLabel?: string;
  name?: string;
}

/** A WhatsApp message summarising a (possibly partial) booking request. */
export function bookingEnquiryMessage(fields: BookingMessageFields): string {
  const lines = ["Hello Tank Sudda, I would like to request a tank cleaning."];
  const add = (label: string, value: string | number | undefined) => {
    if (value === undefined || value === "") return;
    lines.push(`${label}: ${value}`);
  };
  add("Service", fields.serviceName);
  add("Property", fields.propertyTypeLabel);
  add("Tank", fields.tankTypeLabel);
  add("Capacity", fields.capacityLabel);
  add("Number of tanks", fields.tankCount);
  add("Town / area", fields.town);
  add("Preferred date", fields.preferredDate);
  add("Time", fields.timeWindowLabel);
  add("Name", fields.name);
  return lines.join("\n");
}
