import { getMarkdownContext, getMarkdownPages } from "@/lib/markdown/index.server";
import { renderLlmsFullTxt } from "@/lib/markdown/llms";
import { textResponse } from "@/lib/markdown/response";

/** Built once per deploy; content only changes when the site is rebuilt. */
export const dynamic = "force-static";

export async function GET() {
  const ctx = getMarkdownContext();
  if (!ctx) return textResponse("Not found\n", { contentType: "text/plain", status: 404 });
  return textResponse(renderLlmsFullTxt(getMarkdownPages(), ctx.origin), {
    contentType: "text/plain",
  });
}
