/**
 * Lead model shared by notification channels and (in future) persistence.
 * A lead is a booking request or a contact enquiry submitted on the website.
 */
export type LeadKind = "booking" | "contact";

export interface Lead {
  kind: LeadKind;
  /** Human-friendly reference shown to the customer, e.g. TS-20261012-7K2QD. */
  reference: string;
  submittedAt: string;
  /** Customer contact details used for replies. */
  contact: { name: string; phone: string | null; email: string | null };
  /** Ordered label/value pairs describing the request. */
  fields: { label: string; value: string }[];
  /** Customer agreed to receive news and offers. */
  marketingConsent: boolean;
}

/**
 * Persistence boundary. No database is configured yet, so no implementation
 * exists; see docs/BACKEND.md for the planned PostgreSQL + Drizzle adapter.
 */
export interface LeadRepository {
  save(lead: Lead): Promise<void>;
}

export type SubmissionResult =
  | { ok: true; reference: string }
  | {
      ok: false;
      error: "validation" | "rate_limited" | "not_configured" | "delivery_failed" | "expired";
      message: string;
      fieldErrors?: Partial<Record<string, string>>;
    };
