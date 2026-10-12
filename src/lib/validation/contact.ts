import { z } from "zod";
import {
  antiSpamSchema,
  nameSchema,
  normalisePhone,
  optionalEmailSchema,
  whenFieldsValid,
} from "./common";

export const contactTopicOptions = [
  { value: "general", label: "General question" },
  { value: "quotation", label: "Quotation" },
  { value: "existing-request", label: "About a request I have already sent" },
  { value: "other", label: "Something else" },
] as const;

export const contactFieldsSchema = z.object({
  name: nameSchema,
  phone: z
    .string()
    .trim()
    .max(25)
    .refine((value) => value === "" || normalisePhone(value) !== null, {
      message: "Enter a valid phone number, for example 077 123 4567",
    }),
  email: optionalEmailSchema,
  topic: z.enum(["general", "quotation", "existing-request", "other"], { error: "Choose a topic" }),
  message: z
    .string()
    .trim()
    .min(10, "Please write a little more (at least 10 characters)")
    .max(2000, "Message must be 2,000 characters or fewer"),
  privacyAcknowledged: z.literal(true, {
    error: "Please confirm you have read the privacy notice",
  }),
});

const phoneOrEmailCheck = (data: { phone: string; email: string }) =>
  data.phone !== "" || data.email !== "";
const phoneOrEmailParams = {
  path: ["phone"],
  message: "Give us a phone number or an email address",
  when: whenFieldsValid(["phone", "email"]),
};

export const contactSchema = contactFieldsSchema.refine(phoneOrEmailCheck, phoneOrEmailParams);
export type ContactInput = z.input<typeof contactSchema>;
export type ContactData = z.output<typeof contactSchema>;

export const contactSubmissionSchema = contactFieldsSchema
  .extend(antiSpamSchema.shape)
  .refine(phoneOrEmailCheck, phoneOrEmailParams);
export type ContactSubmission = z.input<typeof contactSubmissionSchema>;
