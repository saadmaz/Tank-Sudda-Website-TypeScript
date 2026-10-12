import { renderToStaticMarkup } from "react-dom/server";
import type { ServiceIllustration } from "@/data/services";
import type { IllustrationTone } from "./illustration-files";
import { ServiceIllustrationView } from "./TechnicalIllustrations";

/** Renders an illustration component to a standalone SVG document string. */
export function renderIllustrationSvg(
  kind: ServiceIllustration,
  tone: IllustrationTone,
  annotated: boolean,
): string {
  const markup = renderToStaticMarkup(
    <ServiceIllustrationView kind={kind} tone={tone} annotated={annotated} />,
  );
  return (
    markup
      // Standalone files need the SVG namespace and no page-specific attributes.
      .replace("<svg ", '<svg xmlns="http://www.w3.org/2000/svg" ')
      .replace(/ class="[^"]*"/, "")
      .replace(/ aria-hidden="true"/, "")
      .replace(/ focusable="false"/, "")
      // Images cannot use the page's web fonts; use a close system fallback.
      .replace(/font-family="inherit"/g, 'font-family="Inter, Arial, Helvetica, sans-serif"') + "\n"
  );
}
