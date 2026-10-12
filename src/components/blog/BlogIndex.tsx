import { PageHeader } from "@/components/layout/PageHeader";
import { ARTICLES_PER_PAGE } from "@/data/blog";
import { paginate, type Article } from "@/lib/content/articles";
import { ArticleGrid } from "./ArticleCard";
import { BlogSearchForm, CategoryNav, Pagination } from "./BlogChrome";

export const blogIntro =
  "Practical guidance on water tanks and sumps — maintenance, sediment, cleaning schedules and how to prepare for a clean.";

/** Shared body of /blog and /blog/page/[page]. */
export function BlogIndex({ articles, page }: { articles: Article[]; page: number }) {
  const result = paginate(articles, page, ARTICLES_PER_PAGE);
  const breadcrumbs = [{ name: "Blog", path: "/blog" }];
  if (page > 1) breadcrumbs.push({ name: `Page ${page}`, path: `/blog/page/${page}` });
  return (
    <>
      <PageHeader
        breadcrumbs={breadcrumbs}
        eyebrow="Blog"
        title={page > 1 ? `Blog — page ${page}` : "Tank care blog"}
        intro={blogIntro}
        actions={<BlogSearchForm />}
      />
      <section aria-label="Articles" className="container-site section-y">
        <CategoryNav active="all" />
        <div className="mt-10">
          {result && result.items.length > 0 ? (
            <ArticleGrid articles={result.items} headingLevel={2} />
          ) : (
            <p className="text-muted">No articles have been published yet.</p>
          )}
        </div>
        {result ? <Pagination page={result.page} totalPages={result.totalPages} /> : null}
      </section>
    </>
  );
}
