import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";
import { ArticleGrid } from "@/components/blog/ArticleCard";
import { PageHeader } from "@/components/layout/PageHeader";
import { CtaBand } from "@/components/sections/CtaBand";
import { SectionHeading } from "@/components/ui/primitives";
import { blogCategories, guidePaths, type BlogCategoryKey } from "@/data/blog";
import { services } from "@/data/services";
import { getArticlesByCategory, getArticlesBySlugs } from "@/lib/content/blog.server";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "Water Tank Care Guides",
  description:
    "Plain-language guides to water tank and sump care in Sri Lanka: cleaning frequency, sediment, preparation, and choosing a cleaning service.",
  path: "/guides",
});

export default function GuidesPage() {
  const paths = guidePaths
    .map((path) => ({ ...path, articles: getArticlesBySlugs(path.articleSlugs) }))
    .filter((path) => path.articles.length > 0);
  const categories = (Object.keys(blogCategories) as BlogCategoryKey[])
    .map((key) => ({ key, ...blogCategories[key], count: getArticlesByCategory(key).length }))
    .filter((category) => category.count > 0);

  return (
    <>
      <PageHeader
        breadcrumbs={[{ name: "Guides", path: "/guides" }]}
        eyebrow="Knowledge centre"
        title="Guides to looking after your water tank"
        intro="Start with the basics, understand what builds up inside a tank, and learn how to plan a cleaning. Written in plain language for homeowners and building managers."
      />

      {paths.map((path, index) => (
        <section
          key={path.title}
          aria-labelledby={`path-${index}`}
          className={index % 2 === 1 ? "border-y border-line bg-mist" : undefined}
        >
          <div className="container-site section-y">
            <SectionHeading
              id={`path-${index}`}
              eyebrow={`Step ${index + 1}`}
              title={path.title}
              intro={path.description}
            />
            <div className="mt-10">
              <ArticleGrid articles={path.articles} />
            </div>
          </div>
        </section>
      ))}

      <section aria-labelledby="topics-heading" className="container-site section-y">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <SectionHeading id="topics-heading" title="Browse by topic" />
            <ul className="mt-8 divide-y divide-line border-y border-line">
              {categories.map((category) => (
                <li key={category.key}>
                  <Link href={`/blog/category/${category.key}`} className="group block py-4">
                    <span className="flex items-center justify-between gap-4">
                      <span className="flex items-center gap-2 font-semibold text-navy-950 group-hover:text-water-700">
                        <BookOpen aria-hidden="true" className="size-4 shrink-0 text-water-600" />
                        {category.name}
                      </span>
                      <span className="shrink-0 rounded-sm bg-water-50 px-2 py-0.5 text-xs font-semibold text-water-800">
                        {category.count} {category.count === 1 ? "article" : "articles"}
                      </span>
                    </span>
                    <span className="mt-1.5 block pl-6 text-sm leading-relaxed text-muted">
                      {category.description}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <SectionHeading title="From guides to action" />
            <p className="mt-4 text-muted">
              When you are ready, these pages explain each service in detail.
            </p>
            <ul className="mt-6 space-y-1">
              {services.map((service) => (
                <li key={service.slug}>
                  <Link
                    href={`/services/${service.slug}`}
                    className="inline-flex min-h-11 items-center gap-2 font-medium text-water-700 underline-offset-4 hover:underline"
                  >
                    {service.name}
                    <ArrowRight aria-hidden="true" className="size-4" />
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/faq"
                  className="inline-flex min-h-11 items-center gap-2 font-medium text-water-700 underline-offset-4 hover:underline"
                >
                  Frequently asked questions
                  <ArrowRight aria-hidden="true" className="size-4" />
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
