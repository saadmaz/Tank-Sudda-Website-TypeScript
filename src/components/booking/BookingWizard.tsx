"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight, Loader2, MessageCircle, Pencil } from "lucide-react";
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
  capacityOptions,
  contactPreferenceOptions,
  getActiveSteps,
  labelFor,
  propertyTypeOptions,
  serviceOptions,
  tankTypeOptions,
  timeWindowOptions,
  type BookingData,
  type BookingField,
  type BookingInput,
  type BookingStep,
} from "@/lib/validation/booking";
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
      organisationName: "",
      siteNotes: "",
      town: "",
      address: "",
      preferredDate: "",
      notes: "",
      name: "",
      phone: "",
      email: "",
      marketingConsent: false,
    },
  });

  const values = useWatch({ control });
  const steps = getActiveSteps(values);
  const step = steps[Math.min(stepIndex, steps.length - 1)]!;
  const isReview = step.id === "review";

  // Preselect a service chosen on a service page (/book?service=…).
  useEffect(() => {
    const requested = new URLSearchParams(window.location.search).get("service");
    const match = serviceOptions.find((option) => option.value === requested);
    if (match) setValue("service", match.value);
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
      tankTypeLabel: labelFor(tankTypeOptions, values.tankType),
      capacityLabel: labelFor(capacityOptions, values.capacity),
      tankCount: Number.isFinite(values.tankCount) ? values.tankCount : undefined,
      town: values.town,
      preferredDate: values.preferredDate || undefined,
      timeWindowLabel: labelFor(timeWindowOptions, values.timeWindow),
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
          Fill in the steps below. At the end, WhatsApp opens with your details ready to send.
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
          if (!isReview) {
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
          {step.id === "service" ? (
            <>
              <RadioCardGroup
                name="service"
                legend="Which service do you need?"
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
            </>
          ) : null}

          {step.id === "tank" ? (
            <>
              <SelectField
                id="field-tankType"
                label="Tank type"
                hint="If you have several different tanks, choose “More than one type” and describe them in the notes."
                options={tankTypeOptions}
                error={err("tankType")}
                {...field("tankType")}
              />
              <SelectField
                id="field-capacity"
                label="Approximate capacity (per tank)"
                hint="Plastic tanks often show their capacity on the side, e.g. 1000 L."
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

          {step.id === "site" ? (
            <>
              <TextField
                id="field-organisationName"
                label="Organisation or building name"
                optional
                autoComplete="organization"
                error={err("organisationName")}
                {...field("organisationName")}
              />
              <TextAreaField
                id="field-siteNotes"
                label="Access and scheduling notes"
                optional
                hint="For example operating hours, times water must stay on, or who authorises roof access."
                error={err("siteNotes")}
                {...field("siteNotes")}
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
                rows={3}
                autoComplete="street-address"
                hint="We use this to confirm we can serve your location and to plan the visit."
                error={err("address")}
                {...field("address")}
              />
              <TextField
                id="field-preferredDate"
                label="Preferred date"
                type="date"
                min={dateWindow?.min}
                max={dateWindow?.max}
                hint="This is a preference. We will confirm the actual date with you."
                className="max-w-xs"
                error={err("preferredDate")}
                {...field("preferredDate")}
              />
              <RadioCardGroup
                name="timeWindow"
                legend="Preferred time of day"
                columns={3}
                options={timeWindowOptions}
                error={err("timeWindow")}
                inputProps={field("timeWindow")}
              />
              <TextAreaField
                id="field-notes"
                label="Anything else we should know?"
                optional
                hint="For example access details, the tank’s condition, or when it was last cleaned."
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
                label="Phone number"
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
                optional={values.contactPreference !== "email"}
                error={err("email")}
                {...field("email")}
              />
              <RadioCardGroup
                name="contactPreference"
                legend="How should we contact you?"
                columns={3}
                options={contactPreferenceOptions}
                error={err("contactPreference")}
                inputProps={field("contactPreference")}
              />
              <div className="space-y-4 rounded-md border border-line bg-mist p-4">
                <p className="text-sm leading-relaxed text-muted">
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
                <CheckboxField
                  id="field-marketingConsent"
                  label="Optional: send me occasional reminders and news from Tank Sudda. I can opt out at any time."
                  {...field("marketingConsent")}
                />
              </div>
            </>
          ) : null}

          {isReview ? (
            <div className="space-y-6">
              {steps
                .filter((item) => item.id !== "review")
                .map((item) => (
                  <section
                    key={item.id}
                    className="rounded-md border border-line p-5"
                    aria-label={item.title}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <h3 className="font-sans text-base font-semibold text-navy-950">
                        {item.title}
                      </h3>
                      <button
                        type="button"
                        onClick={() => goTo(steps.indexOf(item))}
                        className="inline-flex min-h-10 items-center gap-1.5 rounded-md px-2 text-sm font-semibold text-water-700 hover:bg-water-50"
                      >
                        <Pencil aria-hidden="true" className="size-4" />
                        Edit<span className="sr-only"> {item.title}</span>
                      </button>
                    </div>
                    <dl className="mt-3 grid gap-x-6 gap-y-2 text-[0.9375rem] sm:grid-cols-[12rem_1fr]">
                      {reviewRows(item, values).map(([label, value]) => (
                        <div key={label} className="contents">
                          <dt className="text-muted">{label}</dt>
                          <dd className="font-medium break-words text-navy-950">{value}</dd>
                        </div>
                      ))}
                    </dl>
                  </section>
                ))}
              <Notice title="What happens next">
                Sending this form does not confirm an appointment. Our team will contact you to
                confirm the details, give you a quotation and agree a date.
              </Notice>
            </div>
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
          ) : (
            <span />
          )}
          {isReview ? (
            <div className="flex flex-wrap items-center gap-3">
              {viaWhatsApp ? (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={buttonClasses("whatsapp", "lg")}
                >
                  <MessageCircle aria-hidden="true" />
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
                      <MessageCircle aria-hidden="true" />
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
            <Button onClick={next} size="lg">
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

function reviewRows(step: BookingStep, values: Partial<BookingInput>): [string, string][] {
  const show = (value: string | undefined | null) =>
    value && value.trim() !== "" ? value : "Not provided";
  switch (step.id) {
    case "service":
      return [
        ["Service", show(labelFor(serviceOptions, values.service))],
        ["Property type", show(labelFor(propertyTypeOptions, values.propertyType))],
      ];
    case "tank":
      return [
        ["Tank type", show(labelFor(tankTypeOptions, values.tankType))],
        ["Capacity", show(labelFor(capacityOptions, values.capacity))],
        [
          "Number of tanks",
          show(Number.isFinite(values.tankCount) ? String(values.tankCount) : ""),
        ],
      ];
    case "site":
      return [
        ["Organisation", show(values.organisationName)],
        ["Notes", show(values.siteNotes)],
      ];
    case "location":
      return [
        ["Town or area", show(values.town)],
        ["Address", show(values.address)],
        ["Preferred date", show(values.preferredDate ? formatDate(values.preferredDate) : "")],
        ["Time of day", show(labelFor(timeWindowOptions, values.timeWindow))],
        ["Notes", show(values.notes)],
      ];
    case "contact":
      return [
        ["Name", show(values.name)],
        ["Phone", show(values.phone)],
        ["Email", show(values.email)],
        ["Contact by", show(labelFor(contactPreferenceOptions, values.contactPreference))],
        ["Reminders and news", values.marketingConsent ? "Yes" : "No"],
      ];
    case "review":
      return [];
  }
}
