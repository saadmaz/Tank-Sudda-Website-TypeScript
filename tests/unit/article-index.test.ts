import fs from "node:fs";
import { describe, expect, it } from "vitest";
import {
  ARTICLE_INDEX_FILE,
  readArticleSources,
  renderArticleIndex,
} from "@/lib/content/article-files";
import { articleSources } from "@/content/blog/articles.generated";

describe("generated article index", () => {
  it("matches the article files (run `bun run content` after editing articles)", () => {
    expect(fs.readFileSync(ARTICLE_INDEX_FILE, "utf8")).toBe(
      renderArticleIndex(readArticleSources()),
    );
  });

  it("bundles every article", () => {
    expect(articleSources.map((source) => source.id)).toEqual(
      readArticleSources().map((source) => source.id),
    );
  });
});
