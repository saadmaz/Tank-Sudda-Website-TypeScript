/**
 * Bundles the articles in src/content/blog into articles.generated.ts so the
 * site never reads files at runtime (Cloudflare Workers have no file system).
 * Runs automatically before `dev` and `build`; run it by hand with:
 *   bun run content
 */
import fs from "node:fs";
import {
  ARTICLE_INDEX_FILE,
  readArticleSources,
  renderArticleIndex,
} from "../src/lib/content/article-files";

const sources = readArticleSources();
const next = renderArticleIndex(sources);
const current = fs.existsSync(ARTICLE_INDEX_FILE)
  ? fs.readFileSync(ARTICLE_INDEX_FILE, "utf8")
  : "";
if (current !== next) fs.writeFileSync(ARTICLE_INDEX_FILE, next);
console.log(`Article index: ${sources.length} articles${current === next ? " (unchanged)" : ""}`);
