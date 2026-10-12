/**
 * Regenerates /public/illustrations from the SVG components.
 * Run after editing src/components/illustrations/TechnicalIllustrations.tsx:
 *   bun run illustrations
 */
import fs from "node:fs";
import path from "node:path";
import {
  ILLUSTRATION_KINDS,
  ILLUSTRATION_TONES,
  illustrationFileName,
} from "../src/components/illustrations/illustration-files";
import { renderIllustrationSvg } from "../src/components/illustrations/render-illustration";

const outDir = path.join(process.cwd(), "public", "illustrations");
fs.mkdirSync(outDir, { recursive: true });

let count = 0;
for (const kind of ILLUSTRATION_KINDS) {
  for (const tone of ILLUSTRATION_TONES) {
    for (const annotated of [true, false]) {
      const file = path.join(outDir, illustrationFileName(kind, tone, annotated));
      fs.writeFileSync(file, renderIllustrationSvg(kind, tone, annotated));
      count++;
    }
  }
}
console.log(`Wrote ${count} illustrations to public/illustrations`);
