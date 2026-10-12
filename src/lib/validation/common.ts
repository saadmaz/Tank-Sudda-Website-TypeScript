import { z } from "zod";

/**
 * Normalises Sri Lankan numbers (07X XXX XXXX, +94 7X…, 0094…, landlines) to
 * E.164. Other international numbers must be entered with a leading "+".
 * Returns null if the value is not a plausible phone number.
 */
export function normalisePhone(input: string): string | null {
  const compact = input.replace(/[\s().-]/g, "");
  const sriLanka = /^(?:\+94|0094|94|0)([1-9]\d{8})$/.exec(compact);
  if (sriLanka) return `+94${sriLanka[1]}`;
  if (/^\+(?!94)[1-9]\d{7,14}$/.test(compact)) return compact;
  return null;
}

export const phoneSchema = z
  .string()
  .trim()
  .min(1, "Enter a phone number")
  .max(25, "That phone number is too long")
  .refine((value) => normalisePhone(value) !== null, {
    message: "Enter a valid phone number, for example 077 123 4567",
  });

export const optionalEmailSchema = z
  .string()
  .trim()
  .max(254)
  .refine((value) => value === "" || z.email().safeParse(value).success, {
    message: "Enter a valid email address",
  });

export const nameSchema = z
  .string()
  .trim()
  .min(2, "Enter your name")
  .max(100, "Name must be 100 characters or fewer");

/** Fields added to every public form for spam protection. */
export const antiSpamSchema = z.object({
  /** Honeypot: hidden from people, often filled in by bots. Checked in checkSpamSignals. */
  website: z.string().max(500).optional().default(""),
  /** Epoch milliseconds when the form was first rendered. */
  startedAt: z.number().int().positive(),
});

export const MIN_FILL_TIME_MS = 3_000;
export const MAX_FORM_AGE_MS = 24 * 60 * 60 * 1_000;

export type SpamVerdict = "ok" | "honeypot" | "too-fast" | "expired";

export function checkSpamSignals(
  fields: { website?: string; startedAt: number },
  now: number = Date.now(),
): SpamVerdict {
  if (fields.website && fields.website.length > 0) return "honeypot";
  const elapsed = now - fields.startedAt;
  if (elapsed < MIN_FILL_TIME_MS) return "too-fast";
  if (elapsed > MAX_FORM_AGE_MS) return "expired";
  return "ok";
}

export type FieldErrors = Partial<Record<string, string>>;

/** Flattens Zod issues into a field → first message map. */
export function toFieldErrors(error: z.ZodError): FieldErrors {
  const errors: FieldErrors = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".") || "form";
    errors[key] ??= issue.message;
  }
  return errors;
}

/**
 * Runs a cross-field rule as soon as the fields it depends on are valid, even
 * if other fields still have errors (Zod skips refinements by default then).
 */
export function whenFieldsValid(fields: readonly string[]) {
  return (payload: z.core.ParsePayload): boolean =>
    !payload.issues.some((issue) => fields.includes(String(issue.path?.[0])));
}
