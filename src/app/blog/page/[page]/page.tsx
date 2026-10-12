import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogIndex, blogIntro } from "@/components/blog/BlogIndex";
import { ARTICLES_PER_PAGE } from "@/data/blog";
import { paginate } from "@/lib/content/articles";
import { getPublishedArticles } from "@/lib/content/blog.server";
import { buildMetadata } from "@/lib/seo/metadata";

export const dynamicParams = false;

/** Page 1 lives at /blog; this route serves pages 2 and up. */
export function generateStaticParams() {
  const totalPages = Math.ceil(getPublishedArticles().length / ARTICLES_PER_PAGE);
  return Array.from({ length: Math.max(0, totalPages - 1) }, (_, i) => ({ page: String(i + 2) }));
}

function parsePage(value: string): number | null {
  if (!/^[2-9]\d*$|^1\d+$/.test(value)) return null;
  return Number(value);
}

export async function generateMetadata({
  params,
}: PageProps<"/blog/page/[page]">): Promise<Metadata> {
  const page = parsePage((await params).page);
  if (!page) return {};
  return buildMetadata({
    title: `Tank Care Blog: Page ${page}`,
    description: blogIntro,
    path: `/blog/page/${page}`,
  });
}

export default async function BlogPaginatedPage({ params }: PageProps<"/blog/page/[page]">) {
  const page = parsePage((await params).page);
  const articles = getPublishedArticles();
  if (!page || !paginate(articles, page, ARTICLES_PER_PAGE)) notFound();
  return <BlogIndex articles={articles} page={page} />;
}
