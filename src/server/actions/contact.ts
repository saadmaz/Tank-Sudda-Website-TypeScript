"use server";

import { labelFor } from "@/lib/validation/booking";
import { normalisePhone } from "@/lib/validation/common";
import {
  contactSubmissionSchema,
  contactTopicOptions,
  type ContactData,
} from "@/lib/validation/contact";
import { processLead } from "@/server/leads/submit";
import type { Lead, SubmissionResult } from "@/server/leads/types";
import { leadRateLimiter } from "@/server/rate-limit";
import { getClientKey } from "./client-key";

function contactToLead(data: ContactData, meta: { reference: string; submittedAt: string }): Lead {
  const phone = data.phone ? (normalisePhone(data.phone) ?? data.phone) : null;
  return {
    kind: "contact",
    reference: meta.reference,
    submittedAt: meta.submittedAt,
    contact: { name: data.name, phone, email: data.email || null },
    fields: [
      {
        label: "Topic",
        value: labelFor(contactTopicOptions, data.topic) ?? data.topic,
        shared: true,
      },
      { label: "Name", value: data.name },
      { label: "Phone", value: phone ?? "Not provided" },
      { label: "Email", value: data.email || "Not provided" },
      { label: "Message", value: data.message },
    ],
    marketingConsent: false,
  };
}

export async function submitContact(input: unknown): Promise<SubmissionResult> {
  return processLead({
    input,
    schema: contactSubmissionSchema,
    toLead: contactToLead,
    allow: (key) => leadRateLimiter.check(key),
    clientKey: await getClientKey("contact"),
  });
}
