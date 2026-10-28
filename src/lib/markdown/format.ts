/**
 * Markdown building blocks for the plain-text versions of public pages.
 * Text from src/data is escaped so it can never change the document
 * structure, and links only accept absolute http(s), mailto: and tel: URLs.
 */
import { stringify as stringifyYaml } from "yaml";

/** Escapes inline text so Markdown syntax in data values is shown literally. */
export function escapeText(value: string): string {
  return (
    value
      .replace(/\s+/g, " ")
      .trim()
      .replace(/[\\`*_[\]<>|]/g, "\\$&")
      // Characters that only have meaning at the start of a line.
      .replace(/^([#+=-]|>)/, "\\$1")
      .replace(/^(\d+)([.)])/, "$1\\$2")
  );
}

const SAFE_URL = /^(https?:\/\/|mailto:|tel:)/i;

/** A Markdown link. Unsafe or relative URLs are rejected rather than emitted. */
export function link(text: string, url: string): string {
  if (!SAFE_URL.test(url)) throw new Error(`Refusing to link to "${url}"`);
  // encodeURIComponent leaves ( and ) alone, so encode them by hand.
  const target = url.replace(
    /[\s()<>]/g,
    (char) => `%${char.charCodeAt(0).toString(16).toUpperCase().padStart(2, "0")}`,
  );
  return `[${escapeText(text)}](${target})`;
}

export function heading(level: 1 | 2 | 3, text: string): string {
  return `${"#".repeat(level)} ${escapeText(text)}`;
}

export function paragraph(text: string): string {
  return escapeText(text);
}

/** Bullet list of already formatted items. */
export function bullets(items: readonly string[]): string {
  return items.map((item) => `- ${item}`).join("\n");
}

/** Numbered list of already formatted items. */
export function numbered(items: readonly string[]): string {
  return items.map((item, index) => `${index + 1}. ${item}`).join("\n");
}

/** "**Title**: description", the form used for titled list items. */
export function titled(title: string, description: string): string {
  return `**${escapeText(title)}**: ${escapeText(description)}`;
}

/** A table whose cells are already formatted inline Markdown. */
export function table(header: readonly string[], rows: readonly (readonly string[])[]): string {
  const line = (cells: readonly string[]) => `| ${cells.join(" | ")} |`;
  return [line(header), line(header.map(() => "---")), ...rows.map(line)].join("\n");
}

/** Joins blocks with blank lines, dropping empty ones. */
export function blocks(...parts: (string | null | undefined | false)[]): string {
  return parts.filter((part): part is string => Boolean(part && part.trim())).join("\n\n");
}

/** YAML front matter; values are quoted by the YAML serialiser. */
export function frontMatter(fields: Record<string, string | undefined>): string {
  const defined = Object.fromEntries(
    Object.entries(fields).filter((entry): entry is [string, string] => entry[1] !== undefined),
  );
  return `---\n${stringifyYaml(defined, { lineWidth: 0 }).trimEnd()}\n---`;
}

/**
 * Makes root-relative links in trusted article Markdown absolute, leaving
 * fenced code blocks untouched.
 */
export function absolutizeLinks(markdown: string, origin: URL): string {
  let inFence = false;
  return markdown
    .split("\n")
    .map((line) => {
      if (/^\s*(```|~~~)/.test(line)) {
        inFence = !inFence;
        return line;
      }
      if (inFence) return line;
      return line.replace(
        /(\]\()(\/(?!\/)[^)\s]*)(\))/g,
        (_, open: string, path: string, close: string) =>
          `${open}${new URL(path, origin).toString()}${close}`,
      );
    })
    .join("\n");
}
