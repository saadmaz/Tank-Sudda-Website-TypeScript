import type { ServiceStep } from "@/data/services";
import { cn } from "@/lib/utils";

/** Numbered process presented as a vertical gauge on mobile and a row on wide screens. */
export function ProcessSteps({
  steps,
  layout = "row",
  headingLevel = 3,
}: {
  steps: ServiceStep[];
  layout?: "row" | "column";
  headingLevel?: 3 | 4;
}) {
  const Heading = `h${headingLevel}` as const;
  const row = layout === "row";
  return (
    <ol
      className={cn(
        "grid gap-x-6 gap-y-8",
        row && (steps.length >= 5 ? "lg:grid-cols-5" : "lg:grid-cols-4"),
        row && "sm:grid-cols-2",
      )}
    >
      {steps.map((step, index) => (
        <li
          key={step.title}
          className="relative border-l-2 border-water-200 pl-5 lg:border-t-2 lg:border-l-0 lg:pt-5 lg:pl-0"
        >
          <span className="font-display text-sm font-semibold text-water-600 tabular-nums">
            {String(index + 1).padStart(2, "0")}
          </span>
          <Heading className="mt-1 font-sans text-base font-semibold text-navy-950">
            {step.title}
          </Heading>
          <p className="mt-2 text-[0.9375rem] leading-relaxed text-muted">{step.description}</p>
        </li>
      ))}
    </ol>
  );
}
