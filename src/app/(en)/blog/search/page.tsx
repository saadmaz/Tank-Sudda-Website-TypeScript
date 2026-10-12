import type { Metadata } from "next";
import { ArticleGrid } from "@/components/blog/ArticleCard";
import { BlogSearchForm } from "@/components/blog/BlogChrome";
import { PageHeader } from "@/components/layout/PageHeader";
import { searchArticles } from "@/lib/content/articles";
import { getPublishedArticles } from "@/lib/content/blog.server";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Search Articles",
  description: "Search Tank Sudda articles and guides.",
  path: "/blog/search",
  noIndex: true,
});

function readQuery(value: string | string[] | undefined): string {
  const raw = Array.isArray(value) ? value[0] : value;
  return (raw ?? "").trim().slice(0, 100);
}

/** Server-rendered search so it works without client-side JavaScript. */
export default async function BlogSearchPage({ searchParams }: PageProps<"/blog/search">) {
  const query = readQuery((await searchParams).q);
  const results = query ? searchArticles(getPublishedArticles(), query) : [];
  return (
    <>
      <PageHeader
        breadcrumbs={[
          { name: "Blog", path: "/blog" },
          { name: "Search", path: "/blog/search" },
        ]}
        eyebrow="Search"
        title={query ? `Results for “${query}”` : "Search articles"}
        actions={<BlogSearchForm defaultValue={query} />}
      />
      <section aria-label="Search results" className="container-site section-y">
        {query ? (
          <p role="status" className="mb-8 text-muted">
            {results.length === 0
              ? "No articles matched your search. Try a different word, such as “sediment” or “sump”."
              : `${results.length} ${results.length === 1 ? "article" : "articles"} found.`}
          </p>
        ) : (
          <p className="text-muted">
            Enter a word or phrase to search article titles and descriptions.
          </p>
        )}
        {results.length > 0 ? <ArticleGrid articles={results} headingLevel={2} /> : null}
      </section>
    </>
  );
}
