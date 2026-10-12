import Link from "next/link";
import type { Route } from "next";
import { ChevronRight } from "lucide-react";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema, type BreadcrumbItem } from "@/lib/seo/schema";
import { cn } from "@/lib/utils";

/** Visible breadcrumb trail plus BreadcrumbList structured data. Home is implied. */
export function Breadcrumbs({
  items,
  tone = "light",
  className,
}: {
  items: BreadcrumbItem[];
  tone?: "light" | "dark";
  className?: string;
}) {
  const trail: BreadcrumbItem[] = [{ name: "Home", path: "/" }, ...items];
  const dark = tone === "dark";
  return (
    <>
      <nav aria-label="Breadcrumb" className={cn("text-sm", className)}>
        <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-1">
          {trail.map((item, index) => {
            const isLast = index === trail.length - 1;
            return (
              <li key={item.path} className="flex items-center gap-1.5">
                {index > 0 ? (
                  <ChevronRight
                    aria-hidden="true"
                    className={cn("size-3.5", dark ? "text-white/50" : "text-grey-400")}
                  />
                ) : null}
                {isLast ? (
                  <span aria-current="page" className={dark ? "text-white" : "text-navy-950"}>
                    {item.name}
                  </span>
                ) : (
                  <Link
                    href={item.path as Route}
                    className={cn(
                      "inline-flex min-h-8 items-center underline-offset-4 hover:underline",
                      dark ? "text-water-200" : "text-water-700",
                    )}
                  >
                    {item.name}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
      <JsonLd data={breadcrumbSchema(trail)} />
    </>
  );
}
