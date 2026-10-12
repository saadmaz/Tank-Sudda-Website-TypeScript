import { CircleDashed } from "lucide-react";

/**
 * Development-only marker showing where verified business information is still
 * needed. Renders nothing in production builds, so no placeholder ever ships.
 */
export function MissingInfo({ what, className }: { what: string; className?: string }) {
  if (process.env.NODE_ENV !== "development") return null;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-sm border border-dashed border-warning-700/50 bg-warning-50 px-2 py-1 text-xs font-medium text-warning-700 ${className ?? ""}`}
    >
      <CircleDashed aria-hidden="true" className="size-3.5" />
      Owner to confirm: {what}
    </span>
  );
}
