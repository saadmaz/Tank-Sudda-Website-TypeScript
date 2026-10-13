/**
 * Builds every logo file the site needs from the original artwork in
 * public/logo/Tank Sudda Logo.png. Run after replacing the logo:
 *   bun run brand
 *
 * "mark"  = the logo on a transparent background (for light surfaces)
 * "badge" = the logo on a white circle (for navy surfaces, favicons, email)
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const source = path.join(root, "public", "logo", "Tank Sudda Logo.png");
const brandDir = path.join(root, "public", "brand");
const appDir = path.join(root, "src", "app");
fs.mkdirSync(brandDir, { recursive: true });

/** The artwork trimmed to its edges and centred on a transparent square. */
async function squareMark(): Promise<Buffer> {
  const trimmed = await sharp(source).trim().png().toBuffer();
  const { width = 0, height = 0 } = await sharp(trimmed).metadata();
  const side = Math.max(width, height);
  return sharp(trimmed)
    .extend({
      top: Math.floor((side - height) / 2),
      bottom: Math.ceil((side - height) / 2),
      left: Math.floor((side - width) / 2),
      right: Math.ceil((side - width) / 2),
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toBuffer();
}

async function mark(size: number, square: Buffer): Promise<Buffer> {
  return sharp(square)
    .resize(size, size)
    .png({ compressionLevel: 9, palette: true, quality: 90 })
    .toBuffer();
}

/** Logo centred on a white circle (or white square for Apple touch icons). */
async function onWhite(
  size: number,
  square: Buffer,
  shape: "circle" | "square",
  scale: number,
): Promise<Buffer> {
  const inner = Math.round(size * scale);
  const logo = await sharp(square).resize(inner, inner).png().toBuffer();
  const background =
    shape === "circle"
      ? `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}"><circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}" fill="#ffffff"/></svg>`
      : `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}"><rect width="${size}" height="${size}" fill="#ffffff"/></svg>`;
  const offset = Math.round((size - inner) / 2);
  return sharp(Buffer.from(background))
    .composite([{ input: logo, top: offset, left: offset }])
    .png({ compressionLevel: 9, palette: true, quality: 90 })
    .toBuffer();
}

/** A .ico file holding PNG images (supported by every current browser). */
function ico(images: { size: number; png: Buffer }[]): Buffer {
  const header = Buffer.alloc(6 + images.length * 16);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(images.length, 4);
  let offset = header.length;
  images.forEach(({ size, png }, index) => {
    const entry = 6 + index * 16;
    header.writeUInt8(size >= 256 ? 0 : size, entry);
    header.writeUInt8(size >= 256 ? 0 : size, entry + 1);
    header.writeUInt8(0, entry + 2);
    header.writeUInt8(0, entry + 3);
    header.writeUInt16LE(1, entry + 4);
    header.writeUInt16LE(32, entry + 6);
    header.writeUInt32LE(png.length, entry + 8);
    header.writeUInt32LE(offset, entry + 12);
    offset += png.length;
  });
  return Buffer.concat([header, ...images.map((image) => image.png)]);
}

const square = await squareMark();
const write = (file: string, data: Buffer) => fs.writeFileSync(file, data);

// Website header/footer and structured data.
write(path.join(brandDir, "logo-mark-128.png"), await mark(128, square));
write(path.join(brandDir, "logo-badge-128.png"), await onWhite(128, square, "circle", 0.82));
write(path.join(brandDir, "logo-512.png"), await mark(512, square));
write(path.join(brandDir, "logo-badge-512.png"), await onWhite(512, square, "circle", 0.82));

// Email header (navy background).
write(path.join(root, "public", "email", "logo.png"), await onWhite(96, square, "circle", 0.82));

// Browser and search favicons (Google wants a square that is a multiple of 48px).
write(path.join(appDir, "icon.png"), await onWhite(192, square, "circle", 0.84));
write(path.join(appDir, "apple-icon.png"), await onWhite(180, square, "square", 0.8));
const icoSizes = [16, 32, 48];
const icoImages = await Promise.all(
  icoSizes.map(async (size) => ({ size, png: await onWhite(size, square, "circle", 0.86) })),
);
write(path.join(appDir, "favicon.ico"), ico(icoImages));

console.log("Brand assets written to public/brand, public/email and src/app");
