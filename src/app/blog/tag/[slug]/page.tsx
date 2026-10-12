import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleGrid } from "@/components/blog/ArticleCard";
import { CategoryNav } from "@/components/blog/BlogChrome";
import { PageHeader } from "@/components/layout/PageHeader";
import { tagLabel } from "@/lib/content/articles";
import { getAllTags, getArticlesByTag } from "@/lib/content/blog.server";
import { buildMetadata } from "@/lib/seo/metadata";

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllTags().map(({ tag }) => ({ slug: tag }));
}

export async function generateMetadata({
  params,
}: PageProps<"/blog/tag/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  if (getArticlesByTag(slug).length === 0) return {};
  return buildMetadata({
    title: `Articles tagged “${tagLabel(slug)}”`,
    description: `Tank Sudda articles about ${tagLabel(slug).toLowerCase()}.`,
    path: `/blog/tag/${slug}`,
    // Tag archives overlap heavily with categories, so they are not indexed.
    noIndex: true,
  });
}

export default async function TagPage({ params }: PageProps<"/blog/tag/[slug]">) {
  const { slug } = await params;
  const articles = getArticlesByTag(slug);
  if (articles.length === 0) notFound();
  const label = tagLabel(slug);
  return (
    <>
      <PageHeader
        breadcrumbs={[
          { name: "Blog", path: "/blog" },
          { name: `Tag: ${label}`, path: `/blog/tag/${slug}` },
        ]}
        eyebrow="Tag"
        title={label}
        intro={`${articles.length} ${articles.length === 1 ? "article" : "articles"} tagged “${label}”.`}
      />
      <section aria-label={`Articles tagged ${label}`} className="container-site section-y">
        <CategoryNav />
        <div className="mt-10">
          <ArticleGrid articles={articles} headingLevel={2} />
        </div>
      </section>
    </>
  );
}
