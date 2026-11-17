import { SERVICES, SOURCES, serviceLevel, type Reading, type Service } from "./services";

// Build-time override: SITE_URL or VITE_SITE_URL. Defaults to the production origin.
function configuredOrigin(): string {
  const candidates = [import.meta.env.SITE_URL, import.meta.env.VITE_SITE_URL];
  for (const candidate of candidates) {
    if (typeof candidate !== "string") continue;
    const trimmed = candidate.trim().replace(/\/+$/, "");
    if (/^https?:\/\/[^/\s]+$/i.test(trimmed)) return trimmed;
  }
  return "https://signalroom.store";
}

export const SITE_URL = configuredOrigin();

export const HOME_TITLE = "Signalroom — Live status board for AI, dev & SaaS tools";
export const HOME_DESCRIPTION =
  "Source-first status desk: official readings for OpenAI, Claude, GitHub, Cloudflare, Vercel, Supabase and more, with a private watchlist.";
export const SERVICES_TITLE = "Services — Signalroom";
export const SERVICES_DESCRIPTION =
  "Status pages for every service Signalroom tracks, each read from that provider's official status feed.";
export const NOT_FOUND_TITLE = "Page not found — Signalroom";
export const NOT_FOUND_DESCRIPTION = "This address is not a Signalroom page.";

const ANSWER_ENGINE_BOTS = [
  "Googlebot",
  "Bingbot",
  "Twitterbot",
  "facebookexternalhit",
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "PerplexityBot",
  "ClaudeBot",
  "Google-Extended",
  "Applebot-Extended",
] as const;

const servicesById = new Map(SERVICES.map((service) => [service.id, service]));

export function getService(id: string): Service | undefined {
  return servicesById.get(id);
}

export function absoluteUrl(path: string): string {
  if (path === "/" || path === "") return `${SITE_URL}/`;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${normalized}`;
}

export function servicePath(id: string): string {
  return `/services/${id}`;
}

export function serviceUrl(id: string): string {
  return absoluteUrl(servicePath(id));
}

export function providerLabel(service: Service): string {
  return SOURCES[service.source]?.label ?? service.source;
}

export function serviceTitle(service: Service): string {
  return `${service.name} status — Signalroom`;
}

export function serviceDescription(service: Service): string {
  return `${service.name} status from the official ${providerLabel(service)} feed. ${service.note}.`;
}

export function relatedServices(service: Service): Service[] {
  return SERVICES.filter((item) => item.source === service.source && item.id !== service.id).sort(
    (a, b) => a.name.localeCompare(b.name),
  );
}

export function trackedComponentNames(service: Service, reading: Reading | undefined): string[] {
  if (service.components?.length) return [...service.components];
  if (!reading) return [];
  return serviceLevel(service, reading).matched.map((component) => component.name);
}

export function indexablePaths(): string[] {
  return ["/", "/services", ...SERVICES.map((service) => servicePath(service.id))];
}

export function indexableUrls(): string[] {
  return indexablePaths().map((path) => absoluteUrl(path));
}

function xmlEscape(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export function sitemapXml(): string {
  const urls = indexableUrls()
    .map((url) => `  <url><loc>${xmlEscape(url)}</loc></url>`)
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

export function robotsTxt(): string {
  const lines = ["User-agent: *", "Allow: /", ""];
  for (const bot of ANSWER_ENGINE_BOTS) {
    lines.push(`User-agent: ${bot}`, "Allow: /", "");
  }
  lines.push(`Sitemap: ${absoluteUrl("/sitemap.xml")}`, "");
  return lines.join("\n");
}

export function llmsTxt(): string {
  const lines = [
    "# Signalroom",
    "",
    `> ${HOME_DESCRIPTION} Independent, not affiliated with any provider.`,
    "",
    "Signalroom reads each provider's public Statuspage summary. It does not publish synthetic uptime percentages. Watchlist stars stay in the browser unless a stack link is copied.",
    "",
    "## Pages",
    "",
    `- [Live status board](${absoluteUrl("/")}): Official readings, active incidents, scheduled maintenance, and feed health.`,
    `- [Services](${absoluteUrl("/services")}): Catalogue of tracked services, each with its own status page.`,
    "",
    "## Services",
    "",
  ];
  for (const service of SERVICES) {
    const source = SOURCES[service.source];
    const feed = source ? `${source.label} (${source.page})` : service.source;
    lines.push(
      `- [${service.name}](${serviceUrl(service.id)}): ${service.note}. Official feed: ${feed}.`,
    );
  }
  lines.push("");
  return lines.join("\n");
}

function searchRecord(search: unknown): Record<string, unknown> {
  if (!search || typeof search !== "object") return {};
  return Object.fromEntries(Object.entries(search));
}

export function isEmptyWatch(search: unknown): boolean {
  return searchRecord(search)["watch"] === "";
}

export function homeCanonical(search: unknown): { url: string; robots: string } {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(searchRecord(search))) {
    if (typeof value === "string" && value.length > 0) params.append(key, value);
    else if (typeof value === "number" || typeof value === "boolean")
      params.append(key, String(value));
  }
  const query = params.toString();
  if (!query) return { url: absoluteUrl("/"), robots: "index, follow" };
  return { url: `${absoluteUrl("/")}?${query}`, robots: "noindex, follow" };
}

type JsonLd = {
  "@context": "https://schema.org";
  "@graph": Array<Record<string, unknown>>;
};

export function homeJsonLd(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: "Signalroom",
        url: absoluteUrl("/"),
        logo: `${SITE_URL}/favicon.svg`,
        description: "Independent, not affiliated with any provider.",
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        name: "Signalroom",
        url: absoluteUrl("/"),
        description: HOME_DESCRIPTION,
        publisher: { "@id": `${SITE_URL}/#organization` },
      },
      {
        "@type": "WebApplication",
        "@id": `${SITE_URL}/#app`,
        name: "Signalroom",
        url: absoluteUrl("/"),
        description: HOME_DESCRIPTION,
        publisher: { "@id": `${SITE_URL}/#organization` },
      },
    ],
  };
}

export function servicesJsonLd(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@graph": [
      breadcrumbLd([
        { name: "Home", url: absoluteUrl("/") },
        { name: "Services", url: absoluteUrl("/services") },
      ]),
      {
        "@type": "ItemList",
        name: "Services",
        itemListElement: SERVICES.map((service, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: service.name,
          url: serviceUrl(service.id),
        })),
      },
    ],
  };
}

export function serviceJsonLd(service: Service, reading: Reading | undefined): JsonLd {
  const graph: Array<Record<string, unknown>> = [
    breadcrumbLd([
      { name: "Home", url: absoluteUrl("/") },
      { name: "Services", url: absoluteUrl("/services") },
      { name: service.name, url: serviceUrl(service.id) },
    ]),
  ];
  const components = trackedComponentNames(service, reading);
  if (components.length > 0) {
    graph.push({
      "@type": "ItemList",
      name: service.components?.length
        ? `Components that determine ${service.name}`
        : `Published components for ${service.name}`,
      itemListElement: components.map((name, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name,
      })),
    });
  }
  const related = relatedServices(service);
  if (related.length > 0) {
    graph.push({
      "@type": "ItemList",
      name: `Other services on the ${providerLabel(service)} feed`,
      itemListElement: related.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.name,
        url: serviceUrl(item.id),
      })),
    });
  }
  return { "@context": "https://schema.org", "@graph": graph };
}

function breadcrumbLd(items: Array<{ name: string; url: string }>): Record<string, unknown> {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

type HeadMeta =
  { title: string } | { name: string; content: string } | { property: string; content: string };

export function pageMeta(input: {
  title: string;
  description: string;
  url: string;
  robots: string;
  jsonLd?: JsonLd;
}): {
  meta: HeadMeta[];
  links: Array<{ rel: "canonical"; href: string }>;
  scripts?: Array<{ type: "application/ld+json"; children: string }>;
} {
  const meta: HeadMeta[] = [
    { title: input.title },
    { name: "description", content: input.description },
    { name: "robots", content: input.robots },
    { property: "og:title", content: input.title },
    { property: "og:description", content: input.description },
    { property: "og:type", content: "website" },
    { property: "og:url", content: input.url },
    { property: "og:image", content: `${SITE_URL}/og.png` },
    { property: "og:image:alt", content: "Signalroom" },
    { property: "og:image:width", content: "1200" },
    { property: "og:image:height", content: "630" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: input.title },
    { name: "twitter:description", content: input.description },
    { name: "twitter:image", content: `${SITE_URL}/og.png` },
  ];
  if (!input.jsonLd) return { meta, links: [{ rel: "canonical", href: input.url }] };
  return {
    meta,
    links: [{ rel: "canonical", href: input.url }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(input.jsonLd).replace(/</g, "\\u003c"),
      },
    ],
  };
}

export function homePageMeta(search: unknown) {
  const { url, robots } = homeCanonical(search);
  return pageMeta({
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    url,
    robots,
    ...(robots.startsWith("noindex") ? {} : { jsonLd: homeJsonLd() }),
  });
}

export function servicesPageMeta() {
  return pageMeta({
    title: SERVICES_TITLE,
    description: SERVICES_DESCRIPTION,
    url: absoluteUrl("/services"),
    robots: "index, follow",
    jsonLd: servicesJsonLd(),
  });
}

export function servicePageMeta(service: Service, reading: Reading | undefined) {
  return pageMeta({
    title: serviceTitle(service),
    description: serviceDescription(service),
    url: serviceUrl(service.id),
    robots: "index, follow",
    jsonLd: serviceJsonLd(service, reading),
  });
}

export function notFoundPageMeta(pathname: string) {
  return pageMeta({
    title: NOT_FOUND_TITLE,
    description: NOT_FOUND_DESCRIPTION,
    url: absoluteUrl(pathname || "/"),
    robots: "noindex, follow",
  });
}
