import type { ComponentPropsWithRef, ReactNode, Ref } from "react";
import { cn } from "@/lib/utils";

const controlBase =
  "block w-full rounded-md border bg-white px-3.5 text-base text-navy-950 shadow-[inset_0_1px_1px_rgb(6_28_54/0.04)] placeholder:text-grey-500 focus-visible:border-water-600 focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-water-600 disabled:bg-grey-100";

function controlClass(invalid: boolean, extra?: string) {
  return cn(controlBase, invalid ? "border-danger-700" : "border-grey-300", extra);
}

function describedBy(id: string, hint?: ReactNode, error?: string) {
  return (
    [hint ? `${id}-hint` : null, error ? `${id}-error` : null].filter(Boolean).join(" ") ||
    undefined
  );
}

function FieldMessages({ id, hint, error }: { id: string; hint?: ReactNode; error?: string }) {
  return (
    <>
      {hint ? (
        <p id={`${id}-hint`} className="mt-1.5 text-sm text-muted">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={`${id}-error`} className="mt-1.5 text-sm font-medium text-danger-700">
          {error}
        </p>
      ) : null}
    </>
  );
}

function FieldLabel({ id, label, optional }: { id: string; label: string; optional?: boolean }) {
  return (
    <label htmlFor={id} className="mb-1.5 block font-medium text-navy-950">
      {label}
      {optional ? <span className="ml-1.5 text-sm font-normal text-muted">(optional)</span> : null}
    </label>
  );
}

interface BaseProps {
  id: string;
  label: string;
  hint?: ReactNode;
  error?: string;
  optional?: boolean;
  className?: string;
}

export function TextField({
  id,
  label,
  hint,
  error,
  optional,
  className,
  ...inputProps
}: BaseProps & Omit<ComponentPropsWithRef<"input">, "id" | "className">) {
  return (
    <div className={className}>
      <FieldLabel id={id} label={label} optional={optional} />
      <input
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, hint, error)}
        className={controlClass(Boolean(error), "min-h-12")}
        {...inputProps}
      />
      <FieldMessages id={id} hint={hint} error={error} />
    </div>
  );
}

export function TextAreaField({
  id,
  label,
  hint,
  error,
  optional,
  className,
  ...textareaProps
}: BaseProps & Omit<ComponentPropsWithRef<"textarea">, "id" | "className">) {
  return (
    <div className={className}>
      <FieldLabel id={id} label={label} optional={optional} />
      <textarea
        id={id}
        rows={4}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, hint, error)}
        className={controlClass(Boolean(error), "py-3")}
        {...textareaProps}
      />
      <FieldMessages id={id} hint={hint} error={error} />
    </div>
  );
}

export function SelectField({
  id,
  label,
  hint,
  error,
  optional,
  className,
  options,
  placeholder = "Select…",
  ...selectProps
}: BaseProps &
  Omit<ComponentPropsWithRef<"select">, "id" | "className"> & {
    options: readonly { value: string; label: string }[];
    placeholder?: string;
  }) {
  return (
    <div className={className}>
      <FieldLabel id={id} label={label} optional={optional} />
      <select
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, hint, error)}
        className={controlClass(Boolean(error), "min-h-12 pr-8")}
        {...selectProps}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <FieldMessages id={id} hint={hint} error={error} />
    </div>
  );
}

/** Radio options rendered as large, touch-friendly cards inside a fieldset. */
export function RadioCardGroup({
  name,
  legend,
  hint,
  error,
  options,
  inputProps,
  columns = 2,
}: {
  name: string;
  legend: string;
  hint?: ReactNode;
  error?: string;
  options: readonly { value: string; label: string; description?: string }[];
  /** Props from react-hook-form's register(); shared by every radio. */
  inputProps: Omit<ComponentPropsWithRef<"input">, "type" | "value" | "id">;
  columns?: 1 | 2 | 3;
}) {
  const id = `field-${name}`;
  return (
    <fieldset
      aria-describedby={describedBy(id, hint, error)}
      aria-invalid={error ? true : undefined}
    >
      <legend className="mb-1.5 font-medium text-navy-950">{legend}</legend>
      {hint ? (
        <p id={`${id}-hint`} className="mb-3 text-sm text-muted">
          {hint}
        </p>
      ) : null}
      <div
        className={cn(
          "grid gap-3",
          columns === 2 && "sm:grid-cols-2",
          columns === 3 && "sm:grid-cols-2 lg:grid-cols-3",
          !hint && "mt-2",
        )}
      >
        {options.map((option) => {
          const optionId = `${id}-${option.value}`;
          return (
            <label
              key={option.value}
              htmlFor={optionId}
              className={cn(
                "flex min-h-14 cursor-pointer items-start gap-3 rounded-md border bg-white p-4 transition-colors hover:border-water-500",
                "has-[:checked]:border-water-600 has-[:checked]:bg-water-50 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-water-600",
                error ? "border-danger-700" : "border-grey-300",
              )}
            >
              <input
                id={optionId}
                type="radio"
                value={option.value}
                className="mt-0.5 size-5 shrink-0 accent-water-600 focus-visible:outline-none"
                {...inputProps}
              />
              <span>
                <span className="block font-medium text-navy-950">{option.label}</span>
                {option.description ? (
                  <span className="mt-0.5 block text-sm text-muted">{option.description}</span>
                ) : null}
              </span>
            </label>
          );
        })}
      </div>
      {error ? (
        <p id={`${id}-error`} className="mt-2 text-sm font-medium text-danger-700">
          {error}
        </p>
      ) : null}
    </fieldset>
  );
}

export function CheckboxField({
  id,
  label,
  error,
  className,
  ...inputProps
}: {
  id: string;
  label: ReactNode;
  error?: string;
  className?: string;
} & Omit<ComponentPropsWithRef<"input">, "id" | "type" | "className">) {
  return (
    <div className={className}>
      <div className="flex items-start gap-3">
        <input
          id={id}
          type="checkbox"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          className="mt-0.5 size-5 shrink-0 accent-water-600"
          {...inputProps}
        />
        <label htmlFor={id} className="leading-snug">
          {label}
        </label>
      </div>
      {error ? (
        <p id={`${id}-error`} className="mt-1.5 pl-8 text-sm font-medium text-danger-700">
          {error}
        </p>
      ) : null}
    </div>
  );
}

/** Visually hidden honeypot. Real visitors never see or fill it. */
export function HoneypotField({ inputRef }: { inputRef: Ref<HTMLInputElement> }) {
  return (
    <div aria-hidden="true" className="absolute -left-[10000px] h-px w-px overflow-hidden">
      <label htmlFor="website-field">Leave this field empty</label>
      <input
        ref={inputRef}
        id="website-field"
        name="website"
        type="text"
        tabIndex={-1}
        autoComplete="off"
      />
    </div>
  );
}
