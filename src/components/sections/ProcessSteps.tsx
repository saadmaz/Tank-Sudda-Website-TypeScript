import type { ServiceStep } from "@/data/services";
import { cn } from "@/lib/utils";

/**
 * Numbered process. "row" renders a connected timeline on wide screens and a
 * vertical timeline on small ones; "column" is always vertical.
 */
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
        "relative grid gap-x-6 gap-y-8",
        row && (steps.length >= 5 ? "lg:grid-cols-5" : "lg:grid-cols-4"),
      )}
    >
      {steps.map((step, index) => (
        <li key={step.title} className={cn("relative flex gap-5", row && "lg:flex-col lg:gap-0")}>
          {/* Connector between markers */}
          {index < steps.length - 1 ? (
            <span
              aria-hidden="true"
              className={cn(
                "absolute top-11 bottom-[-2rem] left-[1.3125rem] w-px bg-water-200",
                row &&
                  "lg:top-[1.3125rem] lg:right-[-1.5rem] lg:bottom-auto lg:left-11 lg:h-px lg:w-auto",
              )}
            />
          ) : null}
          <span className="relative z-10 grid size-11 shrink-0 place-items-center rounded-full border border-water-200 bg-white font-display text-sm font-bold text-water-700 tabular-nums shadow-card">
            {String(index + 1).padStart(2, "0")}
          </span>
          <div className={cn(row && "lg:mt-5")}>
            <Heading className="font-sans text-base font-semibold text-navy-950">
              {step.title}
            </Heading>
            <p className="mt-1.5 text-[0.9375rem] leading-relaxed text-muted">{step.description}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
