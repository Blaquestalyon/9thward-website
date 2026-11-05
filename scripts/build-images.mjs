// Converts the generated art in design/source/ (gitignored, kept locally) to
// web assets in public/img/. Run: node scripts/build-images.mjs
//
// The hero is the intro clip's last frame (hero-lastframe.png, 1920x1080), so
// the video hands off to it with no visible change. hero-a.png is the older
// 4K still, kept only for reference.
import sharp from "sharp";
import { readdirSync } from "node:fs";

const SRC = "design/source";
const OUT = "public/img";
const HERO = "hero-lastframe";

for (const f of readdirSync(SRC).filter((f) => f.endsWith(".png") && f !== "hero-a.png")) {
  const name = f.replace(".png", "");
  const out = name === HERO ? `${OUT}/hero-9thward.webp` : `${OUT}/banner-${name}.webp`;
  const info = await sharp(`${SRC}/${f}`)
    .resize({ width: 2200, withoutEnlargement: true })
    .webp({ quality: 80 })
    .toFile(out);
  console.log(out, info.width, info.height, Math.round(info.size / 1024) + "KB");
}

// Open Graph card: 1200x630 JPEG (WebP isn't read by every social scraper).
const og = await sharp(`${SRC}/${HERO}.png`)
  .resize(1200, 630, { fit: "cover", position: "centre" })
  .jpeg({ quality: 82, mozjpeg: true })
  .toFile(`${OUT}/og-9thward.jpg`);
console.log(`${OUT}/og-9thward.jpg`, og.width, og.height, Math.round(og.size / 1024) + "KB");
