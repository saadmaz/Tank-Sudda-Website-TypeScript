import Link from "next/link";
import type { Route } from "next";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
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
        className="min-h-11 rounded-md bg-navy-950 px-4 text-sm font-semibold text-white hover:bg-navy-800"
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
      "inline-flex min-h-10 items-center rounded-md border px-3.5 text-sm font-medium",
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

export function TableOfContents({ headings }: { headings: TocHeading[] }) {
  if (headings.length < 3) return null;
  return (
    <nav aria-labelledby="toc-heading" className="rounded-lg border border-line bg-mist p-5">
      <h2
        id="toc-heading"
        className="font-sans text-sm font-semibold tracking-[0.12em] text-muted uppercase"
      >
        On this page
      </h2>
      <ol className="mt-3 space-y-1.5 text-[0.9375rem]">
        {headings.map((heading) => (
          <li key={heading.id} className={heading.depth === 3 ? "pl-4" : undefined}>
            <a
              href={`#${heading.id}`}
              className="text-navy-900 underline-offset-4 hover:text-water-700 hover:underline"
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ol>
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
          className="inline-flex min-h-9 items-center rounded-md border border-line px-3 hover:border-water-500 hover:text-water-700"
        >
          {link.label}
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
      ))}
    </div>
  );
}
