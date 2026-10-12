import Link from "next/link";
import type { Route } from "next";
import { ChevronDown, ChevronLeft, ChevronRight, Search } from "lucide-react";
import { blogCategories, type BlogCategoryKey } from "@/data/blog";
import type { TocHeading } from "@/lib/content/articles";
import { absoluteUrl } from "@/lib/site";
import { cn } from "@/lib/utils";

export function BlogSearchForm({
  defaultValue = "",
  className,
}: {
  defaultValue?: string;
  className?: string;
}) {
  return (
    <form
      action="/blog/search"
      method="get"
      role="search"
      className={cn("flex w-full max-w-md gap-2", className)}
    >
      <label htmlFor="blog-search" className="sr-only">
        Search articles
      </label>
      <div className="relative flex-1">
        <Search
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-grey-500"
        />
        <input
          id="blog-search"
          name="q"
          type="search"
          defaultValue={defaultValue}
          placeholder="Search articles"
          maxLength={100}
          className="min-h-11 w-full rounded-md border border-grey-300 bg-white pr-3 pl-9 text-[0.9375rem] text-navy-950 placeholder:text-grey-500"
        />
      </div>
      <button
        type="submit"
        className="min-h-11 rounded-md bg-water-600 px-4 text-sm font-semibold text-white hover:bg-water-700"
      >
        Search
      </button>
    </form>
  );
}

export function CategoryNav({ active }: { active?: BlogCategoryKey | "all" }) {
  const entries = Object.entries(blogCategories) as [
    BlogCategoryKey,
    (typeof blogCategories)[BlogCategoryKey],
  ][];
  const linkClass = (isActive: boolean) =>
    cn(
      "inline-flex min-h-11 items-center rounded-md border px-3.5 text-sm font-medium",
      isActive
        ? "border-navy-950 bg-navy-950 text-white"
        : "border-line bg-white text-navy-950 hover:border-water-500 hover:text-water-700",
    );
  return (
    <nav aria-label="Blog categories">
      <ul className="flex flex-wrap gap-2">
        <li>
          <Link
            href="/blog"
            className={linkClass(active === "all")}
            aria-current={active === "all" ? "page" : undefined}
          >
            All articles
          </Link>
        </li>
        {entries.map(([key, category]) => (
          <li key={key}>
            <Link
              href={`/blog/category/${key}`}
              className={linkClass(active === key)}
              aria-current={active === key ? "page" : undefined}
            >
              {category.name}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/** Pagination for /blog (page 1) and /blog/page/[n]. */
export function Pagination({ page, totalPages }: { page: number; totalPages: number }) {
  if (totalPages <= 1) return null;
  const hrefFor = (n: number): Route => (n === 1 ? "/blog" : (`/blog/page/${n}` as Route));
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const control =
    "inline-flex min-h-11 min-w-11 items-center justify-center gap-1 rounded-md border border-line px-3 text-sm font-medium";
  return (
    <nav aria-label="Pagination" className="mt-12 flex flex-wrap items-center justify-center gap-2">
      {page > 1 ? (
        <Link href={hrefFor(page - 1)} rel="prev" className={cn(control, "hover:border-water-500")}>
          <ChevronLeft aria-hidden="true" className="size-4" /> Previous
        </Link>
      ) : null}
      <ul className="flex gap-2">
        {pages.map((n) => (
          <li key={n}>
            <Link
              href={hrefFor(n)}
              aria-current={n === page ? "page" : undefined}
              aria-label={`Page ${n}`}
              className={cn(
                control,
                n === page ? "border-navy-950 bg-navy-950 text-white" : "hover:border-water-500",
              )}
            >
              {n}
            </Link>
          </li>
        ))}
      </ul>
      {page < totalPages ? (
        <Link href={hrefFor(page + 1)} rel="next" className={cn(control, "hover:border-water-500")}>
          Next <ChevronRight aria-hidden="true" className="size-4" />
        </Link>
      ) : null}
    </nav>
  );
}

/**
 * Article table of contents. The collapsible variant (used on small screens)
 * starts closed so readers reach the article without scrolling past the list.
 */
export function TableOfContents({
  headings,
  collapsible = false,
}: {
  headings: TocHeading[];
  collapsible?: boolean;
}) {
  if (headings.length < 3) return null;
  const list = (
    <ol className="space-y-0.5 text-[0.9375rem]">
      {headings.map((heading) => (
        <li key={heading.id} className={heading.depth === 3 ? "pl-4" : undefined}>
          <a
            href={`#${heading.id}`}
            className="inline-block py-1.5 text-navy-900 underline-offset-4 hover:text-water-700 hover:underline"
          >
            {heading.text}
          </a>
        </li>
      ))}
    </ol>
  );
  const label = "font-sans text-sm font-semibold tracking-[0.12em] text-muted uppercase";
  if (collapsible) {
    return (
      <details className="group rounded-lg border border-line bg-mist">
        <summary
          className={cn(
            label,
            "flex min-h-12 cursor-pointer list-none items-center justify-between gap-4 px-5 [&::-webkit-details-marker]:hidden",
          )}
        >
          On this page
          <ChevronDown
            aria-hidden="true"
            className="size-4 text-water-600 transition-transform group-open:rotate-180"
          />
        </summary>
        <nav aria-label="On this page" className="px-5 pb-4">
          {list}
        </nav>
      </details>
    );
  }
  return (
    <nav aria-label="On this page" className="rounded-lg border border-line bg-mist p-5">
      <p className={label} aria-hidden="true">
        On this page
      </p>
      <div className="mt-2">{list}</div>
    </nav>
  );
}

/** Script-free share links; shown only when the canonical origin is configured. */
export function ShareLinks({ path, title }: { path: string; title: string }) {
  const url = absoluteUrl(path);
  if (!url) return null;
  const links = [
    { label: "WhatsApp", href: `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}` },
    {
      label: "Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    },
    {
      label: "LinkedIn",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    },
  ];
  return (
    <div className="flex flex-wrap items-center gap-2 text-sm">
      <span className="font-semibold text-navy-950">Share:</span>
      {links.map((link) => (
        <a
          key={link.label}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-11 items-center rounded-md border border-line px-3 hover:border-water-500 hover:text-water-700"
        >
          {link.label}
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
      ))}
    </div>
  );
}
