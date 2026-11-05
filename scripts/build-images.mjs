// Converts the generated art in design/source/ (gitignored, kept locally) to
// web assets in public/img/. Run: node scripts/build-images.mjs
import sharp from "sharp";
import { readdirSync } from "node:fs";

const SRC = "design/source";
const OUT = "public/img";

for (const f of readdirSync(SRC).filter((f) => f.endsWith(".png"))) {
  const name = f.replace(".png", "");
  const out = name === "hero-a" ? `${OUT}/hero-9thward.webp` : `${OUT}/banner-${name}.webp`;
  const info = await sharp(`${SRC}/${f}`).resize({ width: 2200 }).webp({ quality: 80 }).toFile(out);
  console.log(out, info.width, info.height, Math.round(info.size / 1024) + "KB");
}

// Open Graph card: 1200x630 JPEG (WebP isn't read by every social scraper).
const og = await sharp(`${SRC}/hero-a.png`)
  .resize(1200, 630, { fit: "cover", position: "centre" })
  .jpeg({ quality: 82, mozjpeg: true })
  .toFile(`${OUT}/og-9thward.jpg`);
console.log(`${OUT}/og-9thward.jpg`, og.width, og.height, Math.round(og.size / 1024) + "KB");
