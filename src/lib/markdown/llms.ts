/**
 * /llms.txt (an index of the site for language models, following
 * https://llmstxt.org) and /llms-full.txt (every Markdown page in one file).
 * Both are built from the same page list as the Markdown versions.
 */
import { business } from "@/data/business";
import { absoluteUrl } from "@/lib/site";
import { blocks, bullets, escapeText, link } from "./format";
import {
  markdownPath,
  renderMarkdownDocument,
  type MarkdownGroup,
  type MarkdownPage,
} from "./pages";

const GROUP_TITLES: Record<MarkdownGroup, string> = {
  main: "Main pages",
  services: "Services",
  articles: "Articles",
  blog: "Blog listings",
  areas: "Service areas",
  translations: "Sinhala and Tamil pages",
};

/** Public pages that are only available as HTML (forms and legal text). */
const HTML_ONLY_PAGES = [
  { path: "/book", title: "Book a Tank Cleaning", description: "Booking request form." },
  {
    path: "/privacy",
    title: "Privacy Policy",
    description: "How personal information is handled.",
  },
  { path: "/terms", title: "Terms and Conditions", description: "Terms for using this website." },
  {
    path: "/cookies",
    title: "Cookie Information",
    description: "Cookies and similar technologies used on this website.",
  },
];

export function renderLlmsTxt(pages: readonly MarkdownPage[], origin: URL): string {
  const u = (path: string) => absoluteUrl(path, origin)!;
  const groups = (Object.keys(GROUP_TITLES) as MarkdownGroup[]).flatMap((group) => {
    const items = pages.filter((page) => page.group === group);
    if (items.length === 0) return [];
    return [
      blocks(
        `## ${GROUP_TITLES[group]}`,
        bullets(
          items.map(
            (page) =>
              `${link(page.title, u(markdownPath(page.path)))}: ${escapeText(page.description)}`,
          ),
        ),
      ),
    ];
  });
  return `${blocks(
    `# ${escapeText(business.name)}`,
    `> ${escapeText(business.description)}`,
    escapeText(
      "Every page below links to its Markdown version. The same page without the .md suffix is the canonical HTML page.",
    ),
    ...groups,
    "## Optional",
    bullets([
      `${link("Full content", u("/llms-full.txt"))}: ${escapeText("All pages above in one Markdown file.")}`,
      `${link("Sitemap", u("/sitemap.xml"))}: ${escapeText("Every indexable HTML page.")}`,
      ...HTML_ONLY_PAGES.map(
        (page) =>
          `${link(page.title, u(page.path))}: ${escapeText(`${page.description} HTML only.`)}`,
      ),
    ]),
  )}\n`;
}

export interface LlmsFullLimits {
  /** Maximum number of pages included in full. */
  maxPages: number;
  /** Maximum size in bytes of the included page content (UTF-8). */
  maxBytes: number;
}

/** Comfortably above the current site (about 30 pages, well under 200 KB). */
export const LLMS_FULL_LIMITS: LlmsFullLimits = { maxPages: 200, maxBytes: 1_000_000 };

/**
 * Concatenates the Markdown documents, each starting with its own front
 * matter (which carries the source URL). Pages beyond the limits are listed
 * by URL at the end instead of being included.
 */
export function renderLlmsFullTxt(
  pages: readonly MarkdownPage[],
  origin: URL,
  limits: LlmsFullLimits = LLMS_FULL_LIMITS,
): string {
  const encoder = new TextEncoder();
  const header = `${blocks(
    `# ${escapeText(business.name)}: full site content`,
    `> ${escapeText(business.description)}`,
    escapeText(
      "Each page below begins with front matter giving its title, description and canonical URL.",
    ),
  )}\n`;
  let used = encoder.encode(header).length;
  const included: string[] = [];
  const omitted: MarkdownPage[] = [];
  for (const page of pages) {
    const document = renderMarkdownDocument(page, origin);
    const size = encoder.encode(document).length + 1;
    if (
      omitted.length === 0 &&
      included.length < limits.maxPages &&
      used + size <= limits.maxBytes
    ) {
      included.push(document);
      used += size;
    } else {
      omitted.push(page);
    }
  }
  const footer =
    omitted.length > 0
      ? `\n${blocks(
          "# Pages not included",
          escapeText(
            `This file is limited in size. The remaining ${omitted.length} pages are available individually:`,
          ),
          bullets(
            omitted.map((page) => link(page.title, absoluteUrl(markdownPath(page.path), origin)!)),
          ),
        )}\n`
      : "";
  return [header, ...included].join("\n") + footer;
}
