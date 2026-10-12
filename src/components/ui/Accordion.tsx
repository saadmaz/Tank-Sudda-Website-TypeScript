import { ChevronDown } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface AccordionItem {
  id: string;
  title: string;
  content: ReactNode;
}

/**
 * Disclosure list built on native <details>/<summary>: keyboard accessible,
 * announced correctly by screen readers, and works without JavaScript.
 */
export function Accordion({
  items,
  headingLevel = 3,
  className,
}: {
  items: AccordionItem[];
  headingLevel?: 2 | 3 | 4;
  className?: string;
}) {
  const Heading = `h${headingLevel}` as const;
  return (
    <div className={cn("divide-y divide-line border-y border-line", className)}>
      {items.map((item) => (
        <details key={item.id} id={item.id} className="group">
          <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-4 text-left [&::-webkit-details-marker]:hidden">
            <Heading className="font-sans text-base font-semibold text-navy-950">
              {item.title}
            </Heading>
            <ChevronDown
              aria-hidden="true"
              className="size-5 shrink-0 text-water-600 transition-transform group-open:rotate-180"
            />
          </summary>
          <div className="pr-8 pb-5 leading-relaxed text-muted">{item.content}</div>
        </details>
      ))}
    </div>
  );
}
