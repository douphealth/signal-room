#!/usr/bin/env node
// Builds the homepage from the hand-made design in design/home.html.
//
//   node scripts/build-home.mjs
//
// Why this exists: an index.html at the repo root makes Nitro use it as the page
// template for EVERY route (sitemap.xml, privacy, all deep pages) — never put one there.
// Edit design/home.html instead, run this script, commit the outputs:
//   src/home/home.html      the optimised page, served at "/" by src/server.ts
//   public/img/home-*.webp  photos pulled out of inline base64 (cached, lazy-loaded)
//   public/home-<hash>.css  precompiled Tailwind (replaces the slow in-browser CDN script)
// Needs: python with Pillow (image conversion) and bun (runs the Tailwind v3 CLI).
import { createHash } from "node:crypto";
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { tmpdir } from "node:os";

const root = resolve(import.meta.dirname, "..");
const src = join(root, "design", "home.html");
const cfgPath = join(root, "design", "home.config.json");
const cfg = existsSync(cfgPath) ? JSON.parse(readFileSync(cfgPath, "utf8")) : {};
let html = readFileSync(src, "utf8");
const sha = (s) => createHash("sha256").update(s).digest("hex").slice(0, 10);
const work = join(tmpdir(), `build-home-${process.pid}`);
mkdirSync(work, { recursive: true });

// 1. Inline base64 photos -> WebP files with explicit dimensions (no layout shift).
const imgDir = join(root, "public", "img");
mkdirSync(imgDir, { recursive: true });
for (const f of readdirSync(imgDir)) if (f.startsWith("home-")) rmSync(join(imgDir, f));
let imgCount = 0;
html = html.replace(/data:image\/(jpeg|png|webp);base64,([A-Za-z0-9+/=]{2000,})/g, (_m, ext, b64) => {
  const buf = Buffer.from(b64, "base64");
  const name = `home-${sha(buf)}`;
  const tmp = join(work, `${name}.${ext}`);
  writeFileSync(tmp, buf);
  const py = [
    "import sys; from PIL import Image",
    "im = Image.open(sys.argv[1]); im = im.convert('RGBA' if im.mode in ('RGBA','LA','P') else 'RGB')",
    "w = int(sys.argv[3])",
    "im = im.resize((w, round(im.height * w / im.width)), Image.LANCZOS) if im.width > w else im",
    "im.save(sys.argv[2], 'WEBP', quality=78, method=6); print(im.width, im.height)",
  ].join("\n");
  const r = spawnSync("python", ["-c", py, tmp, join(imgDir, `${name}.webp`), String(cfg.maxImageWidth ?? 1600)], { encoding: "utf8" });
  if (r.status !== 0) throw new Error(`image conversion failed: ${r.stderr}`);
  const [w, h] = r.stdout.trim().split(" ");
  imgCount++;
  return `/img/${name}.webp" data-w="${w}" data-h="${h}`;
});
// Move the measured size onto the <img> tag as width/height; lazy-load all but the first photo.
let seen = 0;
html = html.replace(/<img\b([^>]*?)src="(\/img\/home-[^"]+)" data-w="(\d+)" data-h="(\d+)"([^>]*)>/g, (_m, a, s, w, h, b) => {
  const attrs = `${a}${b}`.replace(/\s(width|height|loading|decoding|fetchpriority)="[^"]*"/g, "");
  const load = seen++ === 0 ? ` fetchpriority="high" decoding="async"` : ` loading="lazy" decoding="async"`;
  return `<img${attrs.replace(/\/$/, "")} src="${s}" width="${w}" height="${h}"${load}>`;
});
html = html.replace(/" data-w="\d+" data-h="\d+/g, ""); // images used outside <img> (CSS, og)

// 2. Precompile Tailwind from the inline config, then drop the CDN script.
const confMatch = html.match(/<script>\s*tailwind\.config\s*=\s*([\s\S]*?);?\s*<\/script>/);
if (!confMatch) throw new Error("no inline tailwind.config found");
const designCopy = join(work, "content.html");
writeFileSync(designCopy, html);
writeFileSync(join(work, "tw.config.cjs"), `module.exports = Object.assign(${confMatch[1]}, { content: [${JSON.stringify(designCopy)}] });`);
writeFileSync(join(work, "in.css"), "@tailwind base;\n@tailwind components;\n@tailwind utilities;\n");
const tw = spawnSync("bunx", ["tailwindcss@3.4.17", "-c", join(work, "tw.config.cjs"), "-i", join(work, "in.css"), "-o", join(work, "out.css"), "--minify"], { encoding: "utf8", shell: process.platform === "win32" });
if (tw.status !== 0) throw new Error(`tailwind failed: ${tw.stderr}`);
const css = readFileSync(join(work, "out.css"), "utf8");
const cssName = `home-${sha(css)}.css`;
for (const f of readdirSync(join(root, "public"))) if (/^home-[0-9a-f]{10}\.css$/.test(f)) rmSync(join(root, "public", f));
writeFileSync(join(root, "public", cssName), css);
html = html.replace(/<script\s+src="https:\/\/cdn\.tailwindcss\.com[^"]*"[^>]*><\/script>\s*/, "");
html = html.replace(confMatch[0], `<link rel="stylesheet" href="/${cssName}">`);

// 3. Amazon links earn only with the site's tracking tag.
if (cfg.amazonTag) {
  html = html.replace(/href="(https:\/\/www\.amazon\.[a-z.]+\/[^"]*)"/g, (_m, u) => {
    const url = new URL(u.replace(/&amp;/g, "&"));
    url.searchParams.set("tag", cfg.amazonTag);
    return `href="${url.toString().replace(/&/g, "&amp;")}"`;
  });
  html = html.replace(/<a\b(?=[^>]*href="https:\/\/www\.amazon\.)([^>]*)>/g, (m, attrs) =>
    /rel="/.test(attrs) ? m.replace(/rel="[^"]*"/, 'rel="sponsored nofollow noopener"') : `<a${attrs} rel="sponsored nofollow noopener">`);
}

mkdirSync(join(root, "src", "home"), { recursive: true });
writeFileSync(join(root, "src", "home", "home.html"), html);
rmSync(work, { recursive: true, force: true });
console.log(`home.html ${Math.round(html.length / 1024)} KB · ${imgCount} images -> public/img · ${cssName} ${Math.round(css.length / 1024)} KB`);
