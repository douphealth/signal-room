export type Category = "AI" | "Developer" | "Design" | "Work" | "Commerce";
export interface Service { id: string; name: string; category: Category; mark: string; source: string; components?: string[]; note: string; tip: string; }

export const SOURCES: Record<string, { url: string; page: string; label: string }> = {
  openai: { label: "OpenAI", url: "https://status.openai.com/api/v2/summary.json", page: "https://status.openai.com/" },
  claude: { label: "Anthropic", url: "https://status.claude.com/api/v2/summary.json", page: "https://status.claude.com/" },
  cloudflare: { label: "Cloudflare", url: "https://www.cloudflarestatus.com/api/v2/summary.json", page: "https://www.cloudflarestatus.com/" },
  notion: { label: "Notion", url: "https://www.notion-status.com/api/v2/summary.json", page: "https://www.notion-status.com/" },
  figma: { label: "Figma", url: "https://status.figma.com/api/v2/summary.json", page: "https://status.figma.com/" },
  canva: { label: "Canva", url: "https://www.canvastatus.com/api/v2/summary.json", page: "https://www.canvastatus.com/" },
  shopify: { label: "Shopify", url: "https://www.shopifystatus.com/api/v2/summary.json", page: "https://www.shopifystatus.com/" },
  github: { label: "GitHub", url: "https://www.githubstatus.com/api/v2/summary.json", page: "https://www.githubstatus.com/" },
  vercel: { label: "Vercel", url: "https://www.vercel-status.com/api/v2/summary.json", page: "https://www.vercel-status.com/" },
  supabase: { label: "Supabase", url: "https://status.supabase.com/api/v2/summary.json", page: "https://status.supabase.com/" },
  discord: { label: "Discord", url: "https://discordstatus.com/api/v2/summary.json", page: "https://discordstatus.com/" },
  render: { label: "Render", url: "https://status.render.com/api/v2/summary.json", page: "https://status.render.com/" },
  digitalocean: { label: "DigitalOcean", url: "https://status.digitalocean.com/api/v2/summary.json", page: "https://status.digitalocean.com/" },
};

export const SERVICES: Service[] = [
  { id: "openai-api", name: "OpenAI API", category: "AI", mark: "OA", source: "openai", components: ["Chat Completions","Responses","Agents","Fine-tuning","Embeddings","Images","Batch","Audio","Moderations","Realtime","Files"], note: "Model endpoints and developer workflows", tip: "Check which endpoint and model returned the error. Compare status codes and request IDs before retrying." },
  { id: "chatgpt", name: "ChatGPT", category: "AI", mark: "CG", source: "openai", components: ["Conversations","GPTs","Voice mode","Deep Research","Image Generation","Search","File uploads"], note: "Conversations, files, search and features", tip: "Check whether the problem affects one conversation, one device, or the whole app. Avoid re-sending delayed requests." },
  { id: "claude-api", name: "Claude API", category: "AI", mark: "CL", source: "claude", components: ["Claude API (api.anthropic.com)"], note: "Claude model calls via api.anthropic.com", tip: "Record the HTTP status and request ID. Use exponential backoff for 429 and 529 responses." },
  { id: "claude-ai", name: "Claude.ai", category: "AI", mark: "CA", source: "claude", components: ["claude.ai"], note: "Claude web application", tip: "Try an existing and a new conversation separately. Extensions and workspace permissions can interfere." },
  { id: "claude-code", name: "Claude Code", category: "AI", mark: "CC", source: "claude", components: ["Claude Code"], note: "Anthropic coding agent", tip: "Capture the CLI error. Check local auth, account limits and network independently of platform health." },
  { id: "github-copilot", name: "GitHub Copilot", category: "AI", mark: "GC", source: "github", components: ["Copilot"], note: "AI completions and chat", tip: "Check entitlement, editor plugin version and authentication alongside official status." },
  { id: "github", name: "GitHub", category: "Developer", mark: "GH", source: "github", note: "Git, Actions, API and pull requests", tip: "Distinguish git push/pull errors from Actions queue delays and API rate limits." },
  { id: "github-actions", name: "GitHub Actions", category: "Developer", mark: "GA", source: "github", components: ["Actions"], note: "CI builds, jobs and workflow queues", tip: "Check run and runner logs. An expired token or failing workflow is not a platform outage." },
  { id: "github-api", name: "GitHub API", category: "Developer", mark: "AP", source: "github", components: ["API Requests"], note: "REST and GraphQL requests", tip: "Check rate-limit headers, token scopes and HTTP codes first." },
  { id: "cloudflare-workers", name: "Cloudflare Workers", category: "Developer", mark: "CW", source: "cloudflare", components: ["Workers","Workers Builds","Workers Preview"], note: "Workers runtime and builds", tip: "Check recent deployments and error logs; a script exception is not a platform incident." },
  { id: "cloudflare-pages", name: "Cloudflare Pages", category: "Developer", mark: "CP", source: "cloudflare", components: ["Pages"], note: "Pages builds and hosting", tip: "Confirm whether failure is at build time or when serving assets. Check DNS separately." },
  { id: "vercel", name: "Vercel", category: "Developer", mark: "V", source: "vercel", note: "Builds, deployments and edge delivery", tip: "Compare production with the last known-good deployment. Is it build or runtime?" },
  { id: "supabase", name: "Supabase", category: "Developer", mark: "SB", source: "supabase", note: "Databases, auth, storage across regions", tip: "Verify your project region. A degraded dashboard does not mean the database is down." },
  { id: "render", name: "Render", category: "Developer", mark: "R", source: "render", note: "Hosting, databases and cron jobs", tip: "Check service region, deploy logs and health checks — they can be app-specific." },
  { id: "digitalocean", name: "DigitalOcean", category: "Developer", mark: "DO", source: "digitalocean", note: "Compute, managed databases, platform", tip: "Check the specific datacenter region and service metrics first." },
  { id: "notion-api", name: "Notion API", category: "Developer", mark: "NA", source: "notion", components: ["Notion API"], note: "Integrations and developer API", tip: "Check token permissions and rate limits. Capture the exact API error." },
  { id: "notion", name: "Notion", category: "Work", mark: "N", source: "notion", note: "Pages, databases, search and apps", tip: "Sharing permissions can look like a service failure — test another workspace." },
  { id: "discord", name: "Discord", category: "Work", mark: "D", source: "discord", note: "Messaging, voice and API", tip: "Separate text, gateway and voice issues. Compare desktop and mobile." },
  { id: "figma", name: "Figma", category: "Design", mark: "F", source: "figma", note: "Files, FigJam and plugins", tip: "Check sync, libraries or sign-in. Avoid duplicate edits during sync problems." },
  { id: "canva", name: "Canva", category: "Design", mark: "C", source: "canva", note: "Editor, exports and publishing", tip: "If exports fail but editing works, try a smaller design." },
  { id: "shopify", name: "Shopify", category: "Commerce", mark: "S", source: "shopify", note: "Admin, storefront and merchant flows", tip: "Test checkout in a private window. Single-shop issues often come from themes or apps." },
  { id: "shopify-checkout", name: "Shopify Checkout", category: "Commerce", mark: "SC", source: "shopify", components: ["Checkout"], note: "Hosted checkout and purchase flows", tip: "Inspect the exact checkout error; payment providers can fail while Shopify is fine." },
];

export type Level = "operational" | "degraded" | "partial" | "major" | "maintenance" | "unknown";
export const LEVEL_RANK: Record<Level, number> = { major: 5, partial: 4, degraded: 3, maintenance: 2, unknown: 1, operational: 0 };
export const LEVEL_LABEL: Record<Level, string> = { operational: "Operational", degraded: "Degraded", partial: "Partial outage", major: "Major outage", maintenance: "Maintenance", unknown: "No reading" };

export function componentLevel(s: string): Level {
  switch (s) {
    case "operational": return "operational";
    case "degraded_performance": return "degraded";
    case "partial_outage": return "partial";
    case "major_outage": return "major";
    case "under_maintenance": return "maintenance";
    default: return "unknown";
  }
}

export interface Incident { id: string; name: string; impact: string; status: string; updatedAt: string; startsAt?: string; endsAt?: string; link: string; latest?: string; affected: string[] }
export interface Reading { ok: boolean; fetchedAt: string; updatedAt?: string; indicator?: string; description?: string; components: { name: string; status: string }[]; incidents: Incident[]; maintenances: Incident[]; ms?: number; error?: string; }

export function serviceLevel(svc: Service, r?: Reading): { level: Level; matched: { name: string; status: string }[] } {
  if (!r || !r.ok) return { level: "unknown", matched: [] };
  const matched = svc.components ? r.components.filter((c) => svc.components!.includes(c.name)) : r.components;
  if (svc.components && matched.length === 0) return { level: "unknown", matched };
  let level: Level = "operational";
  for (const c of matched) { const l = componentLevel(c.status); if (LEVEL_RANK[l] > LEVEL_RANK[level]) level = l; }
  if (!svc.components && r.indicator === "major" && LEVEL_RANK[level] < 5) level = "major";
  return { level, matched };
}
