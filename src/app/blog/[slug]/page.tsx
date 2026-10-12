import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Clock } from "lucide-react";
import { ArticleGrid } from "@/components/blog/ArticleCard";
import { ShareLinks, TableOfContents } from "@/components/blog/BlogChrome";
import { CtaBand } from "@/components/sections/CtaBand";
import { JsonLd } from "@/components/seo/JsonLd";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ButtonLink } from "@/components/ui/Button";
import { Badge, Notice } from "@/components/ui/primitives";
import { getServicesBySlugs } from "@/data/services";
import { relatedArticles, tagLabel } from "@/lib/content/articles";
import { getArticleBySlug, getPublishedArticles } from "@/lib/content/blog.server";
import { renderMdx } from "@/lib/content/mdx";
import { buildMetadata } from "@/lib/seo/metadata";
import { articleSchema } from "@/lib/seo/schema";
import { formatDate } from "@/lib/utils";

export const dynamicParams = false;

export function generateStaticParams() {
  return getPublishedArticles().map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return {};
  return buildMetadata({
    title: article.seoTitle ?? article.title,
    description: article.seoDescription ?? article.description,
    path: `/blog/${article.slug}`,
    canonicalUrl: article.canonicalUrl,
    noIndex: article.noindex || article.draft,
    ogType: "article",
    image: article.cover,
    article: {
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt,
      tags: article.tags,
      authors: [article.authorName],
    },
  });
}

export default async function ArticlePage({ params }: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) notFound();

  const content = await renderMdx(article.body);
  const related = relatedArticles(article, getPublishedArticles());
  const services = getServicesBySlugs(article.relatedServices);
  const path = `/blog/${article.slug}`;

  return (
    <>
      <article>
        <header className="border-b border-line bg-mist">
          <div className="container-site py-10 lg:py-14">
            <Breadcrumbs
              className="mb-8"
              items={[
                { name: "Blog", path: "/blog" },
                { name: article.categoryName, path: `/blog/category/${article.category}` },
                { name: article.title, path },
              ]}
            />
            <div className="max-w-3xl">
              {article.draft ? (
                <Notice tone="warning" className="mb-6" title="Draft preview">
                  This article is a draft and is only visible in development.
                </Notice>
              ) : null}
              <Link
                href={`/blog/category/${article.category}`}
                className="inline-flex min-h-11 items-center eyebrow hover:underline"
              >
                {article.categoryName}
              </Link>
              <h1 className="mt-3 text-h1">{article.title}</h1>
              <p className="mt-5 text-lead text-muted">{article.description}</p>
              <p className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted">
                <span>{article.authorName}</span>
                <span aria-hidden="true" className="hidden sm:inline">
                  ·
                </span>
                <span>
                  Published{" "}
                  <time dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time>
                </span>
                {article.updatedAt && article.updatedAt !== article.publishedAt ? (
                  <>
                    <span aria-hidden="true" className="hidden sm:inline">
                      ·
                    </span>
                    <span>
                      Updated{" "}
                      <time dateTime={article.updatedAt}>{formatDate(article.updatedAt)}</time>
                    </span>
                  </>
                ) : null}
                <span aria-hidden="true" className="hidden sm:inline">
                  ·
                </span>
                <span className="inline-flex items-center gap-1">
                  <Clock aria-hidden="true" className="size-3.5" />
                  {article.readingTimeMinutes} min read
                </span>
              </p>
            </div>
          </div>
        </header>

        {article.cover ? (
          <div className="container-site pt-10">
            <Image
              src={article.cover.src}
              alt={article.cover.alt}
              width={article.cover.width}
              height={article.cover.height}
              sizes="(min-width: 1216px) 1152px, 100vw"
              priority
              className="h-auto w-full rounded-lg"
            />
          </div>
        ) : null}

        <div className="container-site grid gap-12 section-y lg:grid-cols-[1fr_18rem] lg:gap-16">
          <div className="min-w-0">
            <div className="lg:hidden">
              <TableOfContents headings={article.headings} collapsible />
            </div>
            <div className="prose-article prose mt-8 max-w-[44rem] lg:prose-lg lg:mt-0">
              {content}
            </div>

            {article.tags.length > 0 ? (
              <div className="mt-12 flex flex-wrap items-center gap-2 border-t border-line pt-6">
                <span className="text-sm font-semibold text-navy-950">Tags:</span>
                {article.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/blog/tag/${tag}`}
                    className="inline-flex min-h-11 items-center hover:opacity-80"
                  >
                    <Badge tone="water">{tagLabel(tag)}</Badge>
                  </Link>
                ))}
              </div>
            ) : null}
            <div className="mt-6">
              <ShareLinks path={path} title={article.title} />
            </div>
          </div>

          <aside aria-label="Article tools" className="space-y-6 lg:sticky lg:top-24 lg:self-start">
            <div className="hidden lg:block">
              <TableOfContents headings={article.headings} />
            </div>
            {services.length > 0 ? (
              <div className="rounded-lg border border-line p-5">
                <h2 className="font-sans text-sm font-semibold tracking-[0.12em] text-muted uppercase">
                  Related services
                </h2>
                <ul className="mt-3 space-y-1">
                  {services.map((service) => (
                    <li key={service.slug}>
                      <Link
                        href={`/services/${service.slug}`}
                        className="inline-flex min-h-11 items-center font-medium text-water-700 underline-offset-4 hover:underline"
                      >
                        {service.name}
                      </Link>
                    </li>
                  ))}
                </ul>
                <ButtonLink href="/book" size="sm" className="mt-4 w-full">
                  Request a booking
                </ButtonLink>
              </div>
            ) : null}
          </aside>
        </div>
      </article>

      {related.length > 0 ? (
        <section aria-labelledby="related-heading" className="border-t border-line bg-mist">
          <div className="container-site section-y">
            <h2 id="related-heading" className="text-h2">
              Related articles
            </h2>
            <div className="mt-10">
              <ArticleGrid articles={related} />
            </div>
          </div>
        </section>
      ) : null}

      <CtaBand />
      <JsonLd data={articleSchema(article)} />
    </>
  );
}
