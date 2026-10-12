import Link from "next/link";
import { business } from "@/data/business";
import { cn } from "@/lib/utils";

/**
 * Typographic wordmark. No official Tank Sudda logo was found in the
 * repository; replace the mark below with the real logo file when supplied
 * (e.g. an SVG in /public/brand) — this is the only place it needs changing.
 */
export function Logo({
  tone = "dark",
  className,
}: {
  tone?: "dark" | "light";
  className?: string;
}) {
  const light = tone === "light";
  return (
    <Link
      href="/"
      className={cn("inline-flex min-h-11 items-center gap-2.5", className)}
      aria-label={`${business.name} — home`}
    >
      <svg viewBox="0 0 32 32" className="size-8 shrink-0" aria-hidden="true" focusable="false">
        <rect x="2" y="2" width="28" height="28" rx="6" fill={light ? "#ffffff" : "#061c36"} />
        <path
          d="M7 17 q 3 -2.4 6 0 t 6 0 t 6 0"
          fill="none"
          stroke="#1a89ca"
          strokeWidth="2.4"
          strokeLinecap="round"
        />
        <path
          d="M7 23 H25"
          stroke={light ? "#8d9299" : "#8d9299"}
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
      <span
        className={cn(
          "font-display text-lg font-bold tracking-tight",
          light ? "text-white" : "text-navy-950",
        )}
      >
        Tank<span className={light ? "text-water-300" : "text-water-600"}> Sudda</span>
      </span>
    </Link>
  );
}
