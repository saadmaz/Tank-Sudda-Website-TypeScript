/**
 * Renders the round contact and social icons used in emails to PNG files in
 * public/email/icons. Email apps (Gmail, Outlook) do not display SVG, so the
 * emails link to these PNGs on the live site. Run after changing an icon:
 *   bun run email-icons
 */
import fs from "node:fs";
import path from "node:path";
import { renderToStaticMarkup } from "react-dom/server";
import { Globe, Mail, Phone } from "lucide-react";
import sharp from "sharp";
import { brandPaths } from "../src/components/icons/brand-paths";
import { EMAIL_ICONS } from "../src/server/leads/email-icons";

const outDir = path.join(process.cwd(), "public", "email", "icons");
fs.mkdirSync(outDir, { recursive: true });

// LinkedIn "in" letters only (the rounded square is replaced by the circle).
const linkedinPath =
  "M5.4 4.2a1.9 1.9 0 1 0 0 3.8a1.9 1.9 0 1 0 0-3.8Z" +
  "M3.8 9.3h3.2v10.5H3.8Z" +
  "M9.2 9.3h3.1v1.5c.6-1 1.8-1.8 3.6-1.8c3 0 3.9 1.9 3.9 4.9v5.9h-3.2v-5.3c0-1.4-.3-2.7-1.9-2.7c-1.6 0-2.3 1.1-2.3 2.8v5.2H9.2Z";

const lucideIcons = { phone: Phone, email: Mail, website: Globe };

/** White glyph placed in the middle of a 32×32 canvas. */
function glyph(id: string): string {
  if (id in lucideIcons) {
    const Icon = lucideIcons[id as keyof typeof lucideIcons];
    return renderToStaticMarkup(<Icon color="#ffffff" size={18} strokeWidth={2.2} x={7} y={7} />);
  }
  const d = id === "linkedin" ? linkedinPath : brandPaths[id as keyof typeof brandPaths].path;
  return `<svg x="8" y="8" width="16" height="16" viewBox="0 0 24 24" fill="#ffffff"><path d="${d}"/></svg>`;
}

for (const icon of EMAIL_ICONS) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 32 32"><circle cx="16" cy="16" r="16" fill="${icon.background}"/>${glyph(icon.id)}</svg>`;
  await sharp(Buffer.from(svg))
    .png({ compressionLevel: 9 })
    .toFile(path.join(outDir, `${icon.id}.png`));
}
console.log(`Wrote ${EMAIL_ICONS.length} email icons to public/email/icons`);
