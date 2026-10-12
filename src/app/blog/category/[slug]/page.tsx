import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleGrid } from "@/components/blog/ArticleCard";
import { BlogSearchForm, CategoryNav } from "@/components/blog/BlogChrome";
import { PageHeader } from "@/components/layout/PageHeader";
import {
  blogCategories,
  blogCategoryKeys,
  isBlogCategory,
  type BlogCategoryKey,
} from "@/data/blog";
import { getArticlesByCategory } from "@/lib/content/blog.server";
import { buildMetadata } from "@/lib/seo/metadata";

export const dynamicParams = false;

export function generateStaticParams() {
  return blogCategoryKeys.map((slug) => ({ slug }));
}

function toCategory(slug: string): BlogCategoryKey | null {
  return isBlogCategory(slug) ? slug : null;
}

export async function generateMetadata({
  params,
}: PageProps<"/blog/category/[slug]">): Promise<Metadata> {
  const key = toCategory((await params).slug);
  if (!key) return {};
  const category = blogCategories[key];
  return buildMetadata({
    title: `${category.name}: Articles`,
    description: category.description,
    path: `/blog/category/${key}`,
    noIndex: getArticlesByCategory(key).length === 0,
  });
}

export default async function CategoryPage({ params }: PageProps<"/blog/category/[slug]">) {
  const key = toCategory((await params).slug);
  if (!key) notFound();
  const category = blogCategories[key];
  const articles = getArticlesByCategory(key);
  return (
    <>
      <PageHeader
        breadcrumbs={[
          { name: "Blog", path: "/blog" },
          { name: category.name, path: `/blog/category/${key}` },
        ]}
        eyebrow="Category"
        title={category.name}
        intro={category.description}
        actions={<BlogSearchForm />}
      />
      <section aria-label={`${category.name} articles`} className="container-site section-y">
        <CategoryNav active={key} />
        <div className="mt-10">
          {articles.length > 0 ? (
            <ArticleGrid articles={articles} headingLevel={2} />
          ) : (
            <p className="text-muted">There are no articles in this category yet.</p>
          )}
        </div>
      </section>
    </>
  );
}
