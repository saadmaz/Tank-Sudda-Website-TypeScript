import {
  findMarkdownPage,
  getMarkdownContext,
  getMarkdownPages,
} from "@/lib/markdown/index.server";
import { htmlPathFromSegments, markdownPath, renderMarkdownDocument } from "@/lib/markdown/pages";
import { textResponse } from "@/lib/markdown/response";
import { absoluteUrl } from "@/lib/site";

/**
 * Markdown versions of public pages. `/pricing.md` is rewritten here
 * (next.config.ts); the home page is `/index.md`. Known pages are generated at
 * build time; anything else gets a Markdown 404. See src/lib/markdown.
 */

export function generateStaticParams() {
  return getMarkdownPages().map((page) => ({
    path: page.path === "/" ? ["index"] : page.path.slice(1).split("/"),
  }));
}

export async function GET(_request: Request, { params }: RouteContext<"/api/md/[...path]">) {
  const { path } = await params;
  const ctx = getMarkdownContext();
  const page = findMarkdownPage(htmlPathFromSegments(path));
  if (!ctx || !page) {
    const index = ctx ? absoluteUrl("/llms.txt", ctx.origin) : null;
    return textResponse(
      `# Page not found\n\nThere is no Markdown version of this page.${
        index ? ` The pages that have one are listed at ${index}.` : ""
      }\n`,
      { contentType: "text/markdown", status: 404 },
    );
  }
  return textResponse(renderMarkdownDocument(page, ctx.origin), {
    contentType: "text/markdown",
    canonicalUrl: absoluteUrl(page.path, ctx.origin)!,
    contentLocation: absoluteUrl(markdownPath(page.path), ctx.origin)!,
  });
}
