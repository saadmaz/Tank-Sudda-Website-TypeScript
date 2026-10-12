import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  ILLUSTRATION_KINDS,
  ILLUSTRATION_TONES,
  illustrationFileName,
} from "@/components/illustrations/illustration-files";
import { renderIllustrationSvg } from "@/components/illustrations/render-illustration";

describe("static illustrations", () => {
  it("match their source components (run `bun run illustrations` after editing them)", () => {
    for (const kind of ILLUSTRATION_KINDS) {
      for (const tone of ILLUSTRATION_TONES) {
        for (const annotated of [true, false]) {
          const name = illustrationFileName(kind, tone, annotated);
          const file = path.join(process.cwd(), "public", "illustrations", name);
          expect(fs.existsSync(file), name).toBe(true);
          expect(fs.readFileSync(file, "utf8"), name).toBe(
            renderIllustrationSvg(kind, tone, annotated),
          );
        }
      }
    }
  });

  it("are standalone SVG documents", () => {
    const svg = renderIllustrationSvg("tank", "dark", true);
    expect(svg).toMatch(/^<svg xmlns="http:\/\/www\.w3\.org\/2000\/svg"/);
    expect(svg).not.toContain("class=");
  });
});
