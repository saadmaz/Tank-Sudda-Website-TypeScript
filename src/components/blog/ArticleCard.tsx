import Image from "next/image";
import Link from "next/link";
import { Clock } from "lucide-react";
import { ServiceIllustrationView } from "@/components/illustrations/TechnicalIllustrations";
import type { BlogCategoryKey } from "@/data/blog";
import type { ServiceIllustration } from "@/data/services";
import type { Article } from "@/lib/content/articles";
import { formatDate } from "@/lib/utils";

/** Placeholder artwork per category until article cover photos are added. */
const categoryIllustration: Record<BlogCategoryKey, ServiceIllustration> = {
  maintenance: "tank",
  "cleaning-explained": "sump",
  "choosing-a-service": "commercial",
};

export function ArticleCard({
  article,
  headingLevel = 3,
}: {
  article: Article;
  headingLevel?: 2 | 3;
}) {
  const Heading = `h${headingLevel}` as const;
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-line bg-white shadow-card transition-[border-color,box-shadow] duration-200 hover:border-water-300 hover:shadow-raised">
      <div className="aspect-[16/9] overflow-hidden border-b border-line bg-mist">
        {article.cover ? (
          <Image
            src={article.cover.src}
            alt={article.cover.alt}
            width={article.cover.width}
            height={article.cover.height}
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center p-4">
            <ServiceIllustrationView
              kind={categoryIllustration[article.category]}
              annotated={false}
              className="h-full w-auto opacity-80"
            />
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-6">
        <p className="eyebrow">{article.categoryName}</p>
        <Heading className="mt-2 text-lg leading-snug font-semibold">
          <Link
            href={`/blog/${article.slug}`}
            className="group-hover:text-water-700 after:absolute after:inset-0 after:content-['']"
          >
            {article.title}
          </Link>
        </Heading>
        <p className="mt-3 line-clamp-3 flex-1 text-[0.9375rem] leading-relaxed text-muted">
          {article.description}
        </p>
        <p className="mt-5 flex items-center gap-3 text-sm text-muted">
          <time dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time>
          <span aria-hidden="true">·</span>
          <span className="inline-flex items-center gap-1">
            <Clock aria-hidden="true" className="size-3.5" />
            {article.readingTimeMinutes} min read
          </span>
        </p>
      </div>
    </article>
  );
}

export function ArticleGrid({
  articles,
  headingLevel,
}: {
  articles: Article[];
  headingLevel?: 2 | 3;
}) {
  return (
    <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {articles.map((article) => (
        <li key={article.slug}>
          <ArticleCard article={article} headingLevel={headingLevel} />
        </li>
      ))}
    </ul>
  );
}
