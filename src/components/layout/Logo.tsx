import Image from "next/image";
import Link from "next/link";
import type { Route } from "next";
import { business } from "@/data/business";
import { cn } from "@/lib/utils";

/**
 * Tank Sudda logo (the mark from public/logo, processed by `bun run brand`)
 * with the name beside it. On dark backgrounds the mark sits on a white
 * circle so the navy artwork stays visible.
 */
export function Logo({
  tone = "dark",
  className,
  href = "/",
  label = `${business.name} home`,
}: {
  tone?: "dark" | "light";
  className?: string;
  /** Home page of the current language. */
  href?: Route;
  label?: string;
}) {
  const light = tone === "light";
  return (
    <Link
      href={href}
      className={cn("inline-flex min-h-11 items-center gap-2.5", className)}
      aria-label={label}
    >
      <Image
        src={light ? "/brand/logo-badge-128.png" : "/brand/logo-mark-128.png"}
        alt=""
        width={128}
        height={128}
        loading="eager"
        className="size-10 shrink-0"
      />
      <span
        className={cn(
          "font-display text-lg font-bold tracking-tight whitespace-nowrap",
          light ? "text-white" : "text-navy-950",
        )}
      >
        Tank<span className={light ? "text-water-300" : "text-water-600"}> Sudda</span>
      </span>
    </Link>
  );
}
