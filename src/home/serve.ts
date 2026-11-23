// Serves the hand-designed homepage (built by scripts/build-home.mjs from design/home.html) at "/".
// Every other URL is rendered by the app. The design is a single page, so this adds a crawlable
// "Explore" block that links every page in seoPages(): it is the homepage's path to the rest
// of the site for both visitors and search engines.
import raw from "./home.html?raw";
import { SEO, seoPages } from "@/seo.config";
import { STATUS_PAGES } from "@/lib/status-pages";

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

function exploreBlock(): string {
  const groups = new Map<string, { path: string; title: string }[]>();
  for (const p of seoPages()) {
    if (p.path === "/") continue;
    const key = p.section ?? "More";
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(p);
  }
  const cols = [...groups]
    .map(([name, pages]) => {
      const items = pages.map((p) => `<li><a href="${esc(p.path)}">${esc(p.title)}</a></li>`).join("");
      const list = `<ul>${items}</ul>`;
      // Long groups collapse so the homepage stays short; the links stay in the HTML for crawlers.
      return pages.length > 12
        ? `<details class="sx-col"><summary><h3>${esc(name)} <span>${pages.length}</span></h3></summary>${list}</details>`
        : `<div class="sx-col"><h3>${esc(name)}</h3>${list}</div>`;
    })
    .join("");
  return `<style>
.sx-explore{background:#0b0f19;color:#cbd5e1;border-top:1px solid rgba(148,163,184,.18);padding:48px 16px;font:14px/1.5 Inter,system-ui,sans-serif}
.sx-explore .sx-in{max-width:1200px;margin:0 auto}
.sx-explore h2{color:#f8fafc;font-size:20px;font-weight:700;margin:0 0 20px}
.sx-explore .sx-grid{display:grid;gap:24px 32px;grid-template-columns:repeat(auto-fill,minmax(220px,1fr))}
.sx-explore h3{display:inline;color:#f8fafc;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:.06em}
.sx-explore .sx-col>h3{display:block;margin:0 0 8px}
.sx-explore summary{cursor:pointer;margin:0 0 8px}
.sx-explore summary span{color:#94a3b8;font-weight:500}
.sx-explore ul{list-style:none;margin:0;padding:0}
.sx-explore li{margin:0 0 6px}
.sx-explore a{color:#cbd5e1;text-decoration:none}
.sx-explore a:hover,.sx-explore a:focus-visible{color:#fff;text-decoration:underline}
</style>
<nav class="sx-explore" aria-label="All ${esc(SEO.name)} pages"><div class="sx-in"><h2>Explore ${esc(SEO.name)}</h2><div class="sx-grid">${cols}</div></div></nav>`;
}

// The design is served here (not at "/": the live board stays the server-rendered homepage).
export const PAGE_PATH = "/monitor";

let page: string | undefined;

export function homePage(): string {
  if (!page) {
    // Lets the design link each service to its "Is X down?" page.
    const ids = `<script>window.SR_STATUS_PAGES=${JSON.stringify(STATUS_PAGES.map((p) => p.id))};</script>`;
    const block = exploreBlock();
    // Before the design's own footer if it has one, otherwise at the end of the body.
    const withIds = raw.replace("</head>", `${ids}\n</head>`);
    page = withIds.includes("<footer") ? withIds.replace(/<footer\b/, `${block}\n<footer`) : withIds.replace("</body>", `${block}\n</body>`);
  }
  return page;
}

export function serveHome(request: Request): Response | null {
  if (request.method !== "GET" && request.method !== "HEAD") return null;
  if (new URL(request.url).pathname !== PAGE_PATH) return null;
  return new Response(request.method === "HEAD" ? null : homePage(), {
    headers: { "content-type": "text/html; charset=utf-8", "cache-control": "public, max-age=300" },
  });
}
