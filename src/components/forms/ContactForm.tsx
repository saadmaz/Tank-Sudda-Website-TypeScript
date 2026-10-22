"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRef, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { WhatsAppIcon } from "@/components/icons/BrandIcons";
import { Button, buttonClasses } from "@/components/ui/Button";
import { Notice } from "@/components/ui/primitives";
import type { PhoneNumber } from "@/data/business";
import {
  contactFieldsSchema,
  contactSchema,
  contactTopicOptions,
  type ContactData,
  type ContactInput,
} from "@/lib/validation/contact";
import { track } from "@/lib/analytics";
import { buildWhatsAppUrl, contactEnquiryMessage } from "@/lib/whatsapp";
import { submitContact } from "@/server/actions/contact";
import { CheckboxField, HoneypotField, SelectField, TextAreaField, TextField } from "./fields";

type ContactField = keyof ContactData;

function isContactField(key: string): key is ContactField {
  return Object.hasOwn(contactFieldsSchema.shape, key);
}

export function ContactForm({
  available,
  whatsapp,
}: {
  available: boolean;
  whatsapp: PhoneNumber | null;
}) {
  const [startedAt] = useState(() => Date.now());
  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null>(null);
  // When sending fails, the message is offered on WhatsApp so it is not lost.
  const [fallbackUrl, setFallbackUrl] = useState<string | null>(null);
  const [reference, setReference] = useState<string | null>(null);
  const honeypotRef = useRef<HTMLInputElement>(null);
  const successRef = useRef<HTMLDivElement>(null);

  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors },
  } = useForm<ContactInput, unknown, ContactData>({
    resolver: zodResolver(contactSchema),
    mode: "onTouched",
    defaultValues: { name: "", phone: "", email: "", message: "" },
  });

  const onValid = (data: ContactData) => {
    setServerError(null);
    setFallbackUrl(null);
    startTransition(async () => {
      const result = await submitContact({
        ...data,
        website: honeypotRef.current?.value ?? "",
        startedAt,
      });
      if (result.ok) {
        track("contact_form_sent", { topic: data.topic });
        setReference(result.reference);
        reset();
        requestAnimationFrame(() => successRef.current?.focus());
        return;
      }
      setServerError(result.message);
      if (result.error === "delivery_failed" || result.error === "not_configured") {
        setFallbackUrl(
          buildWhatsAppUrl(
            whatsapp,
            contactEnquiryMessage({
              name: data.name,
              topicLabel: contactTopicOptions.find((option) => option.value === data.topic)?.label,
              message: data.message,
            }),
          ),
        );
      }
      for (const [key, message] of Object.entries(result.fieldErrors ?? {})) {
        if (isContactField(key)) setError(key, { type: "server", message });
      }
    });
  };

  if (reference) {
    return (
      <div
        ref={successRef}
        tabIndex={-1}
        role="status"
        className="rounded-lg border border-success-700/30 bg-success-50 p-6 focus:outline-none"
      >
        <CheckCircle2 aria-hidden="true" className="size-8 text-success-700" />
        <h2 className="mt-4 text-h3">Message received</h2>
        <p className="mt-2 leading-relaxed text-body">
          Thank you. We will reply as soon as we can. Your reference is{" "}
          <strong className="text-navy-950">{reference}</strong>.
        </p>
        <Button variant="secondary" className="mt-6" onClick={() => setReference(null)}>
          Send another message
        </Button>
      </div>
    );
  }

  const err = (field: ContactField) => errors[field]?.message;

  return (
    <form
      noValidate
      className="relative space-y-6"
      onSubmit={(event) => void handleSubmit(onValid)(event)}
    >
      {!available ? (
        <Notice tone="warning" title="The contact form is temporarily unavailable">
          Please call or email us instead, using the contact details on this page.
        </Notice>
      ) : null}
      <HoneypotField inputRef={honeypotRef} />
      <TextField
        id="contact-name"
        label="Your name"
        autoComplete="name"
        error={err("name")}
        {...register("name")}
      />
      <div className="grid gap-6 sm:grid-cols-2">
        <TextField
          id="contact-phone"
          label="Phone number"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          optional
          error={err("phone")}
          {...register("phone")}
        />
        <TextField
          id="contact-email"
          label="Email address"
          type="email"
          autoComplete="email"
          optional
          error={err("email")}
          {...register("email")}
        />
      </div>
      <p className="-mt-3 text-sm text-muted">Please give at least one way for us to reply.</p>
      <SelectField
        id="contact-topic"
        label="Topic"
        options={contactTopicOptions}
        error={err("topic")}
        {...register("topic")}
      />
      <TextAreaField
        id="contact-message"
        label="Message"
        rows={6}
        error={err("message")}
        {...register("message")}
      />
      <CheckboxField
        id="contact-privacy"
        label={
          <>
            I have read the{" "}
            <Link href="/privacy" className="text-water-700 underline underline-offset-4">
              privacy notice
            </Link>{" "}
            and agree to be contacted about my message.
          </>
        }
        error={err("privacyAcknowledged")}
        {...register("privacyAcknowledged")}
      />
      {serverError ? (
        <Notice tone="danger" role="alert" title="Your message was not sent">
          {serverError}
          {fallbackUrl ? " You can also send the same message to us on WhatsApp now." : null}
        </Notice>
      ) : null}
      <div className="flex flex-wrap items-center gap-3">
        <Button type="submit" size="lg" disabled={isPending || !available}>
          {isPending ? <Loader2 aria-hidden="true" className="animate-spin" /> : null}
          {isPending ? "Sending…" : "Send message"}
        </Button>
        {fallbackUrl && serverError ? (
          <a
            href={fallbackUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonClasses("whatsapp", "md")}
            onClick={() => track("contact_whatsapp_fallback")}
          >
            <WhatsAppIcon className="text-current" />
            Send on WhatsApp instead
            <span className="sr-only"> (opens WhatsApp)</span>
          </a>
        ) : null}
      </div>
    </form>
  );
}
