import type { ReactNode } from "react";
import { AlertTriangle, CheckCircle2, Info, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export function Badge({
  children,
  tone = "neutral",
  className,
}: {
  children: ReactNode;
  tone?: "neutral" | "water" | "success" | "warning";
  className?: string;
}) {
  const tones = {
    neutral: "bg-grey-100 text-grey-700",
    water: "bg-water-50 text-water-800",
    success: "bg-success-50 text-success-700",
    warning: "bg-warning-50 text-warning-700",
  } as const;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-sm px-2 py-0.5 text-xs font-semibold",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  intro,
  as: Heading = "h2",
  align = "left",
  id,
  className,
}: {
  eyebrow?: string;
  title: ReactNode;
  intro?: ReactNode;
  as?: "h1" | "h2";
  align?: "left" | "center";
  id?: string;
  className?: string;
}) {
  return (
    <div className={cn("max-w-3xl", align === "center" && "mx-auto text-center", className)}>
      {eyebrow ? <p className="mb-3 eyebrow">{eyebrow}</p> : null}
      <Heading id={id} className={Heading === "h1" ? "text-h1" : "text-h2"}>
        {title}
      </Heading>
      {intro ? <div className="mt-4 text-lead text-muted">{intro}</div> : null}
    </div>
  );
}

const noticeStyles = {
  info: { icon: Info, className: "border-water-200 bg-water-50 text-navy-900" },
  success: {
    icon: CheckCircle2,
    className: "border-success-700/25 bg-success-50 text-success-700",
  },
  warning: {
    icon: AlertTriangle,
    className: "border-warning-700/25 bg-warning-50 text-warning-700",
  },
  danger: { icon: XCircle, className: "border-danger-700/25 bg-danger-50 text-danger-700" },
} as const;

export function Notice({
  tone = "info",
  title,
  children,
  className,
  role,
}: {
  tone?: keyof typeof noticeStyles;
  title?: string;
  children?: ReactNode;
  className?: string;
  role?: "status" | "alert";
}) {
  const { icon: Icon, className: toneClass } = noticeStyles[tone];
  return (
    <div
      role={role}
      className={cn("flex gap-3 rounded-lg border p-4 text-sm", toneClass, className)}
    >
      <Icon aria-hidden="true" className="mt-0.5 size-5 shrink-0" />
      <div className="space-y-1">
        {title ? <p className="font-semibold">{title}</p> : null}
        {children ? <div className="leading-relaxed">{children}</div> : null}
      </div>
    </div>
  );
}

/** A quiet bordered panel. Cards stay square-ish and flat by design. */
export function Panel({
  children,
  className,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "article" | "section" | "li" | "aside";
}) {
  return (
    <Tag className={cn("rounded-lg border border-line bg-white p-6 shadow-card", className)}>
      {children}
    </Tag>
  );
}

export function CheckList({ items, className }: { items: string[]; className?: string }) {
  return (
    <ul className={cn("space-y-3", className)}>
      {items.map((item) => (
        <li key={item} className="flex gap-3">
          <CheckCircle2 aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-water-600" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
