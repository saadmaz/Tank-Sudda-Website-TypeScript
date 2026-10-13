"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight, Loader2, Pencil } from "lucide-react";
import { WhatsAppIcon } from "@/components/icons/BrandIcons";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useSyncExternalStore, useTransition } from "react";
import { useForm, useWatch, type FieldErrors } from "react-hook-form";
import type { PhoneNumber } from "@/data/business";
import {
  CheckboxField,
  HoneypotField,
  RadioCardGroup,
  SelectField,
  TextAreaField,
  TextField,
} from "@/components/forms/fields";
import { Button, buttonClasses } from "@/components/ui/Button";
import { Notice } from "@/components/ui/primitives";
import {
  bookingDateWindow,
  bookingFieldsSchema,
  bookingSchema,
  bookingSteps,
  capacityOptions,
  contactPreferenceOptions,
  labelFor,
  propertyTypeOptions,
  serviceForPageSlug,
  serviceOptions,
  type BookingData,
  type BookingField,
  type BookingInput,
  type BookingStep,
} from "@/lib/validation/booking";
import { track } from "@/lib/analytics";
import { bookingEnquiryMessage, buildWhatsAppUrl } from "@/lib/whatsapp";
import { cn, formatDate } from "@/lib/utils";
import { submitBooking } from "@/server/actions/booking";

export type DeliveryMode = "live" | "development" | "unavailable";

function isBookingField(key: string): key is BookingField {
  return Object.hasOwn(bookingFieldsSchema.shape, key);
}

function firstStepWithError(steps: BookingStep[], fields: string[]): number {
  const index = steps.findIndex((step) => step.fields.some((field) => fields.includes(field)));
  return index === -1 ? steps.length - 1 : index;
}

const noopSubscribe = () => () => {};

function getClientDateWindow(): string {
  const { min, max } = bookingDateWindow();
  return `${min}|${max}`;
}

/** Date limits from the visitor's clock; null while rendering on the server. */
function useClientDateWindow(): { min: string; max: string } | null {
  const snapshot = useSyncExternalStore(noopSubscribe, getClientDateWindow, () => null);
  if (!snapshot) return null;
  const [min = "", max = ""] = snapshot.split("|");
  return { min, max };
}

export function BookingWizard({
  deliveryMode,
  whatsapp,
}: {
  deliveryMode: DeliveryMode;
  whatsapp: PhoneNumber | null;
}) {
  const router = useRouter();
  const [startedAt] = useState(() => Date.now());
  const [stepIndex, setStepIndex] = useState(0);
  const [serverError, setServerError] = useState<string | null>(null);
  const [stepErrorCount, setStepErrorCount] = useState(0);
  const dateWindow = useClientDateWindow();
  const [isPending, startTransition] = useTransition();
  const honeypotRef = useRef<HTMLInputElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const hasNavigated = useRef(false);

  const {
    register,
    handleSubmit,
    trigger,
    control,
    setValue,
    setError,
    formState: { errors },
  } = useForm<BookingInput, unknown, BookingData>({
    resolver: zodResolver(bookingSchema),
    // Validate when Continue is pressed (not on blur, which shifts the layout under taps);
    // fields with errors then re-validate on change via field().
    mode: "onSubmit",
    defaultValues: {
      tankCount: 1,
      town: "",
      address: "",
      preferredDate: "",
      notes: "",
      name: "",
      phone: "",
      email: "",
      contactPreferences: [],
    },
  });

  const values = useWatch({ control });
  const steps = bookingSteps;
  const step = steps[Math.min(stepIndex, steps.length - 1)]!;
  // The last step shows a summary and the send button (there is no separate review step).
  const isLast = stepIndex === steps.length - 1;

  // Preselect a service chosen on a service page (/book?service=…).
  useEffect(() => {
    const requested = new URLSearchParams(window.location.search).get("service") ?? "";
    const match =
      serviceForPageSlug[requested] ??
      serviceOptions.find((option) => option.value === requested)?.value;
    if (match) setValue("service", match);
  }, [setValue]);

  // Move focus to the step heading after navigating between steps.
  useEffect(() => {
    if (!hasNavigated.current) return;
    headingRef.current?.focus();
  }, [stepIndex]);

  const goTo = (index: number) => {
    hasNavigated.current = true;
    setStepErrorCount(0);
    setStepIndex(index);
  };

  const next = async () => {
    const valid = await trigger(step.fields, { shouldFocus: true });
    if (!valid) {
      setStepErrorCount((count) => count + 1);
      return;
    }
    if (stepIndex === 0) track("booking_started", { service: values.service ?? "not-set" });
    track("booking_step", { step: steps[stepIndex + 1]?.id ?? "contact" });
    goTo(stepIndex + 1);
  };

  const onInvalid = (formErrors: FieldErrors<BookingInput>) => {
    goTo(firstStepWithError(steps, Object.keys(formErrors)));
  };

  const onValid = (data: BookingData) => {
    setServerError(null);
    startTransition(async () => {
      const result = await submitBooking({
        ...data,
        website: honeypotRef.current?.value ?? "",
        startedAt,
      });
      if (result.ok) {
        track("booking_sent", { service: data.service, property: data.propertyType });
        router.push(`/book/thank-you?ref=${encodeURIComponent(result.reference)}`);
        return;
      }
      setServerError(result.message);
      const fieldKeys = Object.keys(result.fieldErrors ?? {}).filter(isBookingField);
      for (const key of fieldKeys) {
        setError(key, { type: "server", message: result.fieldErrors?.[key] });
      }
      if (fieldKeys.length > 0) goTo(firstStepWithError(steps, fieldKeys));
    });
  };

  const whatsappUrl = buildWhatsAppUrl(
    whatsapp,
    bookingEnquiryMessage({
      serviceName: labelFor(serviceOptions, values.service),
      propertyTypeLabel: labelFor(propertyTypeOptions, values.propertyType),
      capacityLabel: labelFor(capacityOptions, values.capacity),
      tankCount: Number.isFinite(values.tankCount) ? values.tankCount : undefined,
      town: values.town,
      preferredDate: values.preferredDate ? formatDate(values.preferredDate) : undefined,
      name: values.name,
    }),
  );

  // Without online delivery, the completed request is handed over on WhatsApp.
  const viaWhatsApp = deliveryMode === "unavailable" && whatsappUrl !== null;

  const err = (name: BookingField) => errors[name]?.message;

  // Re-validate a field on change while it shows an error, so the message clears
  // as soon as it is fixed (not on blur, where the layout shift can swallow a click).
  const field = <N extends BookingField>(name: N, options?: { valueAsNumber: true }) =>
    register(name, {
      ...options,
      onChange: () => {
        if (errors[name]) void trigger(name);
      },
    });

  return (
    <div>
      {viaWhatsApp ? (
        <Notice className="mb-8" title="Your request is sent to us on WhatsApp">
          Fill in the three steps below. At the end, WhatsApp opens with your details ready to send.
        </Notice>
      ) : deliveryMode === "unavailable" ? (
        <Notice tone="warning" className="mb-8" title="Online requests are temporarily unavailable">
          Please call or email us instead, using the contact details on this page.
        </Notice>
      ) : null}
      {deliveryMode === "development" ? (
        <Notice tone="warning" className="mb-8" title="Development mode">
          No notification channel is configured. Submissions are printed to the server console only
          and are not delivered or saved.
        </Notice>
      ) : null}

      <nav aria-label="Booking progress" className="mb-8">
        <p className="mb-3 text-sm font-medium text-muted">
          Step {stepIndex + 1} of {steps.length}
        </p>
        <ol className="flex gap-1.5">
          {steps.map((item, index) => (
            <li key={item.id} className="flex-1">
              <span
                aria-current={index === stepIndex ? "step" : undefined}
                className={cn(
                  "block h-1.5 rounded-full",
                  index < stepIndex
                    ? "bg-water-600"
                    : index === stepIndex
                      ? "bg-navy-950"
                      : "bg-grey-200",
                )}
              />
              <span
                className={cn(
                  "mt-2 hidden text-xs sm:block",
                  index === stepIndex ? "font-semibold text-navy-950" : "text-muted",
                )}
              >
                {item.title}
                <span className="sr-only">
                  {index < stepIndex ? " (completed)" : index === stepIndex ? " (current)" : ""}
                </span>
              </span>
            </li>
          ))}
        </ol>
      </nav>

      <form
        noValidate
        className="relative"
        onSubmit={(event) => {
          // Enter on an intermediate step advances the wizard instead of submitting.
          if (!isLast) {
            event.preventDefault();
            void next();
            return;
          }
          void handleSubmit(onValid, onInvalid)(event);
        }}
      >
        <HoneypotField inputRef={honeypotRef} />
        <div className="mb-6">
          <h2 ref={headingRef} tabIndex={-1} className="text-h2 focus:outline-none">
            {step.title}
          </h2>
          <p className="mt-2 text-muted">{step.description}</p>
        </div>

        <div aria-live="polite" className="sr-only">
          {/* The trailing period toggles so repeated failures are announced again. */}
          {stepErrorCount > 0
            ? `Please correct the highlighted fields before continuing${stepErrorCount % 2 ? "." : ""}`
            : ""}
        </div>

        <div className="space-y-6">
          {step.id === "tank" ? (
            <>
              <RadioCardGroup
                name="service"
                legend="What needs cleaning?"
                columns={3}
                options={serviceOptions}
                error={err("service")}
                inputProps={field("service")}
              />
              <SelectField
                id="field-propertyType"
                label="Property type"
                options={propertyTypeOptions}
                error={err("propertyType")}
                {...field("propertyType")}
              />
              <SelectField
                id="field-capacity"
                label="Tank size (approximate, per tank)"
                hint="Plastic tanks often show their size on the side, e.g. 1000 L."
                options={capacityOptions}
                error={err("capacity")}
                {...field("capacity")}
              />
              <TextField
                id="field-tankCount"
                label="Number of tanks and sumps"
                type="number"
                inputMode="numeric"
                min={1}
                max={50}
                className="max-w-40"
                error={err("tankCount")}
                {...field("tankCount", { valueAsNumber: true })}
              />
            </>
          ) : null}

          {step.id === "location" ? (
            <>
              <TextField
                id="field-town"
                label="Town or area"
                autoComplete="address-level2"
                error={err("town")}
                {...field("town")}
              />
              <TextAreaField
                id="field-address"
                label="Property address"
                optional
                rows={2}
                autoComplete="street-address"
                hint="We will confirm the exact address when we contact you."
                error={err("address")}
                {...field("address")}
              />
              <TextField
                id="field-preferredDate"
                label="Preferred date"
                type="date"
                min={dateWindow?.min}
                max={dateWindow?.max}
                hint="The actual date can vary depending on availability. We will confirm it with you."
                className="max-w-xs"
                error={err("preferredDate")}
                {...field("preferredDate")}
              />
              <TextAreaField
                id="field-notes"
                label="Anything we should know?"
                optional
                rows={3}
                hint="For example access to the tank, its condition, or when it was last cleaned."
                error={err("notes")}
                {...field("notes")}
              />
            </>
          ) : null}

          {step.id === "contact" ? (
            <>
              <TextField
                id="field-name"
                label="Your name"
                autoComplete="name"
                error={err("name")}
                {...field("name")}
              />
              <TextField
                id="field-phone"
                label="Mobile number"
                type="tel"
                autoComplete="tel"
                inputMode="tel"
                hint="For example 077 123 4567. Include the country code if outside Sri Lanka."
                error={err("phone")}
                {...field("phone")}
              />
              <TextField
                id="field-email"
                label="Email address"
                type="email"
                autoComplete="email"
                optional={!(values.contactPreferences ?? []).includes("email")}
                error={err("email")}
                {...field("email")}
              />
              <RadioCardGroup
                name="contactPreferences"
                legend="How can we contact you?"
                hint="Choose one or more."
                columns={3}
                multiple
                options={contactPreferenceOptions}
                error={err("contactPreferences")}
                inputProps={field("contactPreferences")}
              />
              <div className="rounded-md border border-line bg-mist p-4">
                <p className="mb-4 text-sm leading-relaxed text-muted">
                  We use these details only to respond to this request, prepare a quotation and
                  arrange the cleaning. See our{" "}
                  <Link
                    href="/privacy"
                    className="text-water-700 underline underline-offset-4"
                    target="_blank"
                  >
                    privacy policy
                    <span className="sr-only"> (opens in a new tab)</span>
                  </Link>
                  .
                </p>
                <CheckboxField
                  id="field-privacyAcknowledged"
                  label="I have read the privacy notice and agree to be contacted about this request."
                  error={err("privacyAcknowledged")}
                  {...field("privacyAcknowledged")}
                />
              </div>

              <section
                aria-labelledby="booking-summary-heading"
                className="rounded-md border border-line p-5"
              >
                <h3 id="booking-summary-heading" className="font-sans text-base font-semibold">
                  Your request
                </h3>
                <div className="mt-3 divide-y divide-line">
                  {steps
                    .filter((item) => item.id !== "contact")
                    .map((item) => (
                      <div key={item.id} className="py-3 first:pt-0 last:pb-0">
                        <div className="flex items-center justify-between gap-4">
                          <p className="text-sm font-semibold text-muted">{item.title}</p>
                          <button
                            type="button"
                            onClick={() => goTo(steps.indexOf(item))}
                            className="inline-flex min-h-11 items-center gap-1.5 rounded-md px-2 text-sm font-semibold text-water-700 hover:bg-water-50"
                          >
                            <Pencil aria-hidden="true" className="size-4" />
                            Edit<span className="sr-only"> {item.title}</span>
                          </button>
                        </div>
                        <dl className="mt-1 grid gap-x-6 gap-y-1.5 text-[0.9375rem] sm:grid-cols-[11rem_1fr]">
                          {summaryRows(item, values).map(([label, value]) => (
                            <div key={label} className="contents">
                              <dt className="text-muted">{label}</dt>
                              <dd className="font-medium break-words text-navy-950">{value}</dd>
                            </div>
                          ))}
                        </dl>
                      </div>
                    ))}
                </div>
              </section>
              <Notice title="What happens next">
                Sending this form does not confirm an appointment. Our team will contact you to
                confirm the details, give you a quotation and agree a date.
              </Notice>
            </>
          ) : null}
        </div>

        {serverError ? (
          <Notice tone="danger" role="alert" className="mt-8" title="Your request was not sent">
            {serverError}
          </Notice>
        ) : null}

        <div className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-6">
          {stepIndex > 0 ? (
            <Button variant="secondary" onClick={() => goTo(stepIndex - 1)} disabled={isPending}>
              <ArrowLeft aria-hidden="true" />
              Back
            </Button>
          ) : null}
          {isLast ? (
            <div className="flex flex-1 flex-wrap items-center justify-end gap-3 sm:ml-auto sm:flex-none">
              {viaWhatsApp ? (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={buttonClasses("whatsapp", "lg", "w-full sm:w-auto")}
                  onClick={() =>
                    track("booking_whatsapp_handoff", { service: values.service ?? "not-set" })
                  }
                >
                  <WhatsAppIcon className="text-current" />
                  Send request on WhatsApp
                  <span className="sr-only"> (opens WhatsApp)</span>
                </a>
              ) : (
                <>
                  {whatsappUrl && serverError ? (
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={buttonClasses("whatsapp", "md")}
                    >
                      <WhatsAppIcon className="text-current" />
                      Send on WhatsApp instead
                      <span className="sr-only"> (opens WhatsApp)</span>
                    </a>
                  ) : null}
                  <Button
                    type="submit"
                    size="lg"
                    disabled={isPending || deliveryMode === "unavailable"}
                    aria-disabled={isPending}
                  >
                    {isPending ? <Loader2 aria-hidden="true" className="animate-spin" /> : null}
                    {isPending ? "Sending…" : "Send booking request"}
                  </Button>
                </>
              )}
            </div>
          ) : (
            <Button onClick={next} size="lg" className="flex-1 sm:ml-auto sm:flex-none">
              Continue
              <ArrowRight aria-hidden="true" />
            </Button>
          )}
        </div>
        {isPending ? (
          <p role="status" className="sr-only">
            Sending your request
          </p>
        ) : null}
      </form>
    </div>
  );
}

function summaryRows(step: BookingStep, values: Partial<BookingInput>): [string, string][] {
  const show = (value: string | undefined | null) =>
    value && value.trim() !== "" ? value : "Not provided";
  switch (step.id) {
    case "tank":
      return [
        ["Service", show(labelFor(serviceOptions, values.service))],
        ["Property type", show(labelFor(propertyTypeOptions, values.propertyType))],
        ["Tank size", show(labelFor(capacityOptions, values.capacity))],
        [
          "Number of tanks",
          show(Number.isFinite(values.tankCount) ? String(values.tankCount) : ""),
        ],
      ];
    case "location":
      return [
        ["Town or area", show(values.town)],
        ["Address", show(values.address)],
        ["Preferred date", show(values.preferredDate ? formatDate(values.preferredDate) : "")],
        ["Notes", show(values.notes)],
      ];
    case "contact":
      return [];
  }
}
