import type { ReactNode } from "react";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import type { BreadcrumbItem } from "@/lib/seo/schema";
import { cn } from "@/lib/utils";

/** Standard header for inner pages: breadcrumbs, H1, intro and optional actions/aside. */
export function PageHeader({
  title,
  intro,
  breadcrumbs,
  eyebrow,
  actions,
  aside,
  tone = "mist",
}: {
  title: ReactNode;
  intro?: ReactNode;
  breadcrumbs: BreadcrumbItem[];
  eyebrow?: string;
  actions?: ReactNode;
  aside?: ReactNode;
  tone?: "mist" | "navy";
}) {
  const navy = tone === "navy";
  return (
    <section
      className={cn(
        "border-b",
        navy ? "on-dark border-navy-800 bg-navy-950 text-grey-200" : "border-line bg-mist",
      )}
    >
      <div
        className={cn(
          "container-site grid gap-10 py-10 lg:py-16",
          aside && "lg:grid-cols-[1.2fr_1fr] lg:items-center",
        )}
      >
        <div>
          <Breadcrumbs items={breadcrumbs} tone={navy ? "dark" : "light"} className="mb-8" />
          {eyebrow ? (
            <p className={cn("mb-3 eyebrow", navy && "text-water-300")}>{eyebrow}</p>
          ) : null}
          <h1 className={cn("max-w-3xl text-h1", navy && "text-white")}>{title}</h1>
          {intro ? (
            <div className={cn("mt-5 max-w-2xl text-lead", navy ? "text-grey-200" : "text-muted")}>
              {intro}
            </div>
          ) : null}
          {actions ? <div className="mt-8 flex flex-wrap items-center gap-3">{actions}</div> : null}
        </div>
        {aside ? <div className="hidden lg:block">{aside}</div> : null}
      </div>
    </section>
  );
}
