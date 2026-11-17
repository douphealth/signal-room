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
  cursor: {"label": "Cursor", "url": "https://status.cursor.com/api/v2/summary.json", "page": "https://status.cursor.com/"} ,
  deepgram: {"label": "Deepgram", "url": "https://status.deepgram.com/api/v2/summary.json", "page": "https://status.deepgram.com/"} ,
  netlify: {"label": "Netlify", "url": "https://www.netlifystatus.com/api/v2/summary.json", "page": "https://www.netlifystatus.com/"} ,
  flyio: {"label": "Fly.io", "url": "https://status.flyio.net/api/v2/summary.json", "page": "https://status.flyio.net/"} ,
  planetscale: {"label": "PlanetScale", "url": "https://www.planetscalestatus.com/api/v2/summary.json", "page": "https://www.planetscalestatus.com/"} ,
  upstash: {"label": "Upstash", "url": "https://status.upstash.com/api/v2/summary.json", "page": "https://status.upstash.com/"} ,
  clerk: {"label": "Clerk", "url": "https://status.clerk.com/api/v2/summary.json", "page": "https://status.clerk.com/"} ,
  sentry: {"label": "Sentry", "url": "https://status.sentry.io/api/v2/summary.json", "page": "https://status.sentry.io/"} ,
  npm: {"label": "npm", "url": "https://status.npmjs.org/api/v2/summary.json", "page": "https://status.npmjs.org/"} ,
  docker: {"label": "Docker", "url": "https://www.dockerstatus.com/api/v2/summary.json", "page": "https://www.dockerstatus.com/"} ,
  circleci: {"label": "CircleCI", "url": "https://status.circleci.com/api/v2/summary.json", "page": "https://status.circleci.com/"} ,
  bitbucket: {"label": "Bitbucket", "url": "https://bitbucket.status.atlassian.com/api/v2/summary.json", "page": "https://bitbucket.status.atlassian.com/"} ,
  linear: {"label": "Linear", "url": "https://linearstatus.com/api/v2/summary.json", "page": "https://linearstatus.com/"} ,
  jira: {"label": "Jira", "url": "https://jira-software.status.atlassian.com/api/v2/summary.json", "page": "https://jira-software.status.atlassian.com/"} ,
  confluence: {"label": "Confluence", "url": "https://confluence.status.atlassian.com/api/v2/summary.json", "page": "https://confluence.status.atlassian.com/"} ,
  trello: {"label": "Trello", "url": "https://trello.status.atlassian.com/api/v2/summary.json", "page": "https://trello.status.atlassian.com/"} ,
  asana: {"label": "Asana", "url": "https://status.asana.com/api/v2/summary.json", "page": "https://status.asana.com/"} ,
  zoom: {"label": "Zoom", "url": "https://www.zoomstatus.com/api/v2/summary.json", "page": "https://www.zoomstatus.com/"} ,
  dropbox: {"label": "Dropbox", "url": "https://status.dropbox.com/api/v2/summary.json", "page": "https://status.dropbox.com/"} ,
  twilio: {"label": "Twilio", "url": "https://status.twilio.com/api/v2/summary.json", "page": "https://status.twilio.com/"} ,
  resend: {"label": "Resend", "url": "https://resend-status.com/api/v2/summary.json", "page": "https://resend-status.com/"} ,
  mailgun: {"label": "Mailgun", "url": "https://status.mailgun.com/api/v2/summary.json", "page": "https://status.mailgun.com/"} ,
  cloudinary: {"label": "Cloudinary", "url": "https://status.cloudinary.com/api/v2/summary.json", "page": "https://status.cloudinary.com/"} ,
  webflow: {"label": "Webflow", "url": "https://status.webflow.com/api/v2/summary.json", "page": "https://status.webflow.com/"} ,
  zapier: {"label": "Zapier", "url": "https://status.zapier.com/api/v2/summary.json", "page": "https://status.zapier.com/"} ,
  plaid: {"label": "Plaid", "url": "https://status.plaid.com/api/v2/summary.json", "page": "https://status.plaid.com/"} ,
  mongodb: {"label": "MongoDB Atlas", "url": "https://status.mongodb.com/api/v2/summary.json", "page": "https://status.mongodb.com/"} ,
  reddit: {"label": "Reddit", "url": "https://www.redditstatus.com/api/v2/summary.json", "page": "https://www.redditstatus.com/"} ,
  pinecone: {"label": "Pinecone", "url": "https://status.pinecone.io/api/v2/summary.json", "page": "https://status.pinecone.io/"} ,
  replit: {"label": "Replit", "url": "https://status.replit.com/api/v2/summary.json", "page": "https://status.replit.com/"} ,
};

export const FEED_FORMAT = "Statuspage JSON · /api/v2/summary.json";

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
  {"id": "cursor", "name": "Cursor", "category": "AI", "mark": "CU", "source": "cursor", "note": "AI editor, CLI and cloud coding agents", "tip": "Compare the editor, CLI and cloud agents separately. Check model-provider errors and account limits too."},
  {"id": "deepgram", "name": "Deepgram", "category": "AI", "mark": "DE", "source": "deepgram", "note": "Speech recognition, text-to-speech and voice agents", "tip": "Confirm the API region and whether batch or streaming failed. Keep the request ID and audio format."},
  {"id": "netlify", "name": "Netlify", "category": "Developer", "mark": "NE", "source": "netlify", "note": "Deploys, hosting, functions and edge delivery", "tip": "Separate build failures from delivery errors. Check build logs and your site configuration before retrying."},
  {"id": "flyio", "name": "Fly.io", "category": "Developer", "mark": "FL", "source": "flyio", "note": "Machines, deployments and regional app hosting", "tip": "Check the affected region and Machine health. Inspect app logs and volume availability independently."},
  {"id": "planetscale", "name": "PlanetScale", "category": "Developer", "mark": "PL", "source": "planetscale", "note": "Managed databases across cloud regions", "tip": "Match the affected cloud and region to your database. Verify connection limits and credentials."},
  {"id": "upstash", "name": "Upstash", "category": "Developer", "mark": "UP", "source": "upstash", "note": "Serverless data and messaging infrastructure", "tip": "Check the database region, credentials and request limits. Region names can appear in multiple products."},
  {"id": "clerk", "name": "Clerk", "category": "Developer", "mark": "CL", "source": "clerk", "note": "Authentication, sessions and user management", "tip": "Separate sign-in from session or webhook failures. Check instance keys, allowed origins and redirect URLs."},
  {"id": "sentry", "name": "Sentry", "category": "Developer", "mark": "SE", "source": "sentry", "note": "Error ingestion, monitoring, alerts and dashboard", "tip": "Verify your data region and whether ingestion or the dashboard is affected. Check SDK configuration and quotas."},
  {"id": "npm", "name": "npm", "category": "Developer", "mark": "NP", "source": "npm", "note": "Package installation, publishing and audit", "tip": "Distinguish package installation from publishing. Check registry configuration, authentication and lockfiles."},
  {"id": "docker", "name": "Docker", "category": "Developer", "mark": "DO", "source": "docker", "note": "Container registry, builds and developer services", "tip": "Check image pulls versus builds and authentication. Verify the image tag, credentials and pull limits."},
  {"id": "circleci", "name": "CircleCI", "category": "Developer", "mark": "CI", "source": "circleci", "note": "CI jobs, workflows, runners and artifacts", "tip": "Inspect the job executor and workflow logs. Separate third-party source-control failures from CircleCI failures."},
  {"id": "bitbucket", "name": "Bitbucket", "category": "Developer", "mark": "BI", "source": "bitbucket", "note": "Repositories, Git, API and pipelines", "tip": "Compare Git over SSH and HTTPS. Check token scopes and pipeline logs before attributing a failure to the platform."},
  {"id": "linear", "name": "Linear", "category": "Work", "mark": "LI", "source": "linear", "note": "Issue tracking, integrations and regional APIs", "tip": "Check the workspace region and whether app sync, API calls or integrations are affected."},
  {"id": "jira", "name": "Jira", "category": "Work", "mark": "JI", "source": "jira", "note": "Cloud issue tracking, search and automation", "tip": "Verify site permissions and whether viewing, editing or automation is affected. This feed covers Jira cloud, not self-hosted installs."},
  {"id": "confluence", "name": "Confluence", "category": "Work", "mark": "CO", "source": "confluence", "note": "Cloud documentation, editing and search", "tip": "Check page permissions and whether viewing or editing fails. This feed covers cloud, not self-managed Confluence."},
  {"id": "trello", "name": "Trello", "category": "Work", "mark": "TR", "source": "trello", "note": "Boards, cards, automation and API", "tip": "Check board access and compare the website with API calls. A single integration error may be local to that integration."},
  {"id": "asana", "name": "Asana", "category": "Work", "mark": "AS", "source": "asana", "note": "Tasks, projects, automations and collaboration", "tip": "Check your workspace and whether app, API or background actions are affected. Test permissions separately."},
  {"id": "zoom", "name": "Zoom", "category": "Work", "mark": "ZO", "source": "zoom", "note": "Meetings, phone, webinars and collaboration", "tip": "Separate meeting join failures from audio, phone and recording problems. Check your connection and client version."},
  {"id": "dropbox", "name": "Dropbox", "category": "Work", "mark": "DR", "source": "dropbox", "note": "File sync, sharing, apps and API", "tip": "Compare web access with desktop sync. Check storage limits, permissions and network before duplicating uploads."},
  {"id": "twilio", "name": "Twilio", "category": "Developer", "mark": "TW", "source": "twilio", "note": "Messaging, voice, verification and regional APIs", "tip": "Check the country, carrier, product and region. Save the message or call SID and exact error code."},
  {"id": "resend", "name": "Resend", "category": "Developer", "mark": "RE", "source": "resend", "note": "Transactional email, batches, SMTP and webhooks", "tip": "Check sending-domain verification and the email ID. Accepted email does not guarantee recipient inbox delivery."},
  {"id": "mailgun", "name": "Mailgun", "category": "Developer", "mark": "MA", "source": "mailgun", "note": "Email API, SMTP, delivery and validation", "tip": "Check your sending region, DNS records and delivery logs. Recipient-provider issues may not appear here."},
  {"id": "cloudinary", "name": "Cloudinary", "category": "Developer", "mark": "CL", "source": "cloudinary", "note": "Media uploads, transformations and delivery", "tip": "Separate upload, transformation and CDN delivery failures. Verify region, signatures and asset permissions."},
  {"id": "webflow", "name": "Webflow", "category": "Design", "mark": "WE", "source": "webflow", "note": "Visual site design, publishing and hosting", "tip": "Compare designer, publishing and hosted-site issues. Check domain DNS and the last successful publish."},
  {"id": "zapier", "name": "Zapier", "category": "Work", "mark": "ZA", "source": "zapier", "note": "Automations, triggers, tables and integrations", "tip": "Inspect the failed Zap step and connected app. Replaying a task can create duplicate actions."},
  {"id": "plaid", "name": "Plaid", "category": "Commerce", "mark": "PL", "source": "plaid", "note": "Financial data API and bank connections", "tip": "Compare production with sandbox and identify the institution. A single bank issue may not be a platform outage."},
  {"id": "mongodb", "name": "MongoDB Atlas", "category": "Developer", "mark": "MO", "source": "mongodb", "note": "Atlas cloud databases, search and services", "tip": "Confirm your cluster region and inspect cluster metrics. Verify network access and connection limits."},
  {"id": "reddit", "name": "Reddit", "category": "Work", "mark": "RE", "source": "reddit", "note": "Web, mobile, media and community infrastructure", "tip": "Compare web and mobile. Check community restrictions and account permissions separately from platform health."},
  {"id": "pinecone", "name": "Pinecone", "category": "AI", "mark": "PI", "source": "pinecone", "note": "Vector database, inference and assistant services", "tip": "Check index region and whether data operations or index management fails. Verify API keys and quotas."},
  {"id": "replit", "name": "Replit", "category": "Developer", "mark": "RE", "source": "replit", "note": "Coding sandboxes, AI agents and published apps", "tip": "Distinguish development from published apps. Inspect deployment logs, database connectivity and agent limits."},
  {"id": "cursor-agents", "name": "Cursor Cloud Agents", "category": "AI", "mark": "CU", "source": "cursor", "components": ["Cloud Agents"], "note": "Remote coding agent execution", "tip": "Check agent logs, repository access and the selected model provider."},
  {"id": "deepgram-stt", "name": "Deepgram Speech-to-Text", "category": "AI", "mark": "DE", "source": "deepgram", "components": ["STT Batch API", "STT Streaming API"], "note": "Batch and streaming speech recognition", "tip": "Compare batch with streaming and check the API region and audio encoding."},
  {"id": "deepgram-tts", "name": "Deepgram Text-to-Speech", "category": "AI", "mark": "DE", "source": "deepgram", "components": ["TTS Batch API", "TTS Streaming API"], "note": "Batch and streaming speech synthesis", "tip": "Check voice selection, audio format and whether streaming or batch is affected."},
  {"id": "netlify-builds", "name": "Netlify Builds", "category": "Developer", "mark": "NE", "source": "netlify", "components": ["Build Pipeline"], "note": "Build pipeline and deployment jobs", "tip": "Inspect the failing build command, dependency install and environment variables."},
  {"id": "netlify-functions", "name": "Netlify Functions", "category": "Developer", "mark": "NE", "source": "netlify", "components": ["Netlify Functions", "Edge Functions"], "note": "Serverless and edge function execution", "tip": "Check function logs and distinguish a code exception from a published platform incident."},
  {"id": "clerk-auth", "name": "Clerk Authentication", "category": "Developer", "mark": "CL", "source": "clerk", "components": ["Authentication & User", "Session management", "Multi-tenant authentication"], "note": "User sign-in and session lifecycle", "tip": "Check allowed origins, redirect URLs and session settings alongside the official reading."},
  {"id": "npm-registry", "name": "npm Package Registry", "category": "Developer", "mark": "NP", "source": "npm", "components": ["Package installation", "Package publishing"], "note": "Package downloads and publishing", "tip": "Check registry URL and credentials. Preserve the install or publish error before retrying."},
  {"id": "docker-hub", "name": "Docker Hub", "category": "Developer", "mark": "DO", "source": "docker", "components": ["Docker Authentication", "Docker Hub Registry", "Docker Hub Web Services", "Docker Hub Automated Builds"], "note": "Container image pulls, pushes and registry", "tip": "Compare pulls and pushes, verify the image tag and inspect authentication and rate limits."},
  {"id": "bitbucket-pipelines", "name": "Bitbucket Pipelines", "category": "Developer", "mark": "BI", "source": "bitbucket", "components": ["Pipelines"], "note": "Build pipelines and CI execution", "tip": "Inspect runner and pipeline logs and verify repository permissions."},
  {"id": "linear-api", "name": "Linear API", "category": "Developer", "mark": "LI", "source": "linear", "components": ["US Region – Linear API", "EU Region – Linear API"], "note": "US and EU GraphQL API availability", "tip": "Verify workspace region, API permissions and rate-limit responses."},
  {"id": "zoom-meetings", "name": "Zoom Meetings", "category": "Work", "mark": "ZO", "source": "zoom", "components": ["Zoom Meetings"], "note": "Video meetings and conferencing", "tip": "Compare meeting join with audio and video. Verify the meeting link and network connectivity."},
  {"id": "zoom-phone", "name": "Zoom Phone", "category": "Work", "mark": "ZO", "source": "zoom", "components": ["Zoom Phone"], "note": "Cloud phone service across regions", "tip": "Record the calling region, direction and error. Carrier problems can have narrower scope."},
  {"id": "twilio-verify", "name": "Twilio Verify", "category": "Developer", "mark": "TW", "source": "twilio", "components": ["Verify"], "note": "Verification and one-time passcodes", "tip": "Check channel, destination country, verification SID and delivery errors."},
  {"id": "webflow-ecommerce", "name": "Webflow Ecommerce", "category": "Commerce", "mark": "WE", "source": "webflow", "components": ["Ecommerce"], "note": "Webflow store and ecommerce operations", "tip": "Check your site and checkout error. Payment-provider failures can be independent."},
  {"id": "pinecone-inference", "name": "Pinecone Inference", "category": "AI", "mark": "PI", "source": "pinecone", "components": ["Inference"], "note": "Hosted embedding and reranking inference", "tip": "Record the model, API response and rate limits; index health is a separate signal."},
  {"id": "replit-agent", "name": "Replit Agent", "category": "AI", "mark": "RE", "source": "replit", "components": ["Replit Agent"], "note": "AI-assisted coding and app generation", "tip": "Check the agent task log and account limits separately from published-app health."},
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

export interface Incident { id: string; name: string; impact: string; status: string; updatedAt: string; createdAt?: string; startsAt?: string; endsAt?: string; link: string; latest?: string; affected: string[] }
export interface Reading { ok: boolean; fetchedAt: string; lastAttemptAt?: string; updatedAt?: string; indicator?: string; description?: string; httpStatus?: number; components: { name: string; status: string }[]; incidents: Incident[]; maintenances: Incident[]; ms?: number; stale?: boolean; error?: string; }
export interface SourceIncident extends Incident { src: string }
export interface MaintenanceGroup { key: string; src: string; day: string; items: SourceIncident[] }

export function incidentUrl(page: string, id: string, shortlink?: unknown): string {
  if (typeof shortlink === "string" && /^https:\/\//i.test(shortlink)) return shortlink;
  return `${page.replace(/\/+$/, "")}/incidents/${encodeURIComponent(id)}`;
}

export function incidentLevel(impact: string): Level {
  if (impact === "critical" || impact === "major") return "major";
  if (impact === "minor") return "degraded";
  if (impact === "maintenance") return "maintenance";
  return "operational";
}

export function serviceLevel(svc: Service, r?: Reading): { level: Level; matched: { name: string; status: string }[] } {
  if (!r || !r.ok) return { level: "unknown", matched: [] };
  const matched = svc.components ? r.components.filter((c) => svc.components!.includes(c.name)) : r.components;
  if (svc.components && matched.length === 0) return { level: "unknown", matched };
  let level: Level = "operational";
  for (const c of matched) { const l = componentLevel(c.status); if (LEVEL_RANK[l] > LEVEL_RANK[level]) level = l; }
  if (!svc.components && r.indicator === "major" && LEVEL_RANK[level] < 5) level = "major";
  for (const incident of relevantIncidents(svc, r.incidents)) {
    const l = incidentLevel(incident.impact);
    if (LEVEL_RANK[l] > LEVEL_RANK[level]) level = l;
  }
  return { level, matched };
}

/** Incidents whose published affected components overlap this service.
 * Scoped services never inherit an incident with missing component metadata:
 * an ambiguous provider incident remains visible in the global incident feed.
 */
export function relevantIncidents(svc: Service, list: Incident[]): Incident[] {
  if (!svc.components) return list;
  return list.filter((i) => i.affected.some((a) => svc.components!.includes(a)));
}

const MONTHS: Record<string, number> = { january: 0, february: 1, march: 2, april: 3, may: 4, june: 5, july: 6, august: 7, september: 8, october: 9, november: 10, december: 11 };

/** Parse a UTC maintenance window from provider prose when structured fields are absent. */
export function parseMaintenanceWindow(text: string, referenceIso: string): { startsAt?: string; endsAt?: string } {
  const isoDate = text.match(/\b(\d{4})-(\d{2})-(\d{2})\b/);
  const namedDate = text.match(/\b(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{1,2})(?:,\s*(\d{4}))?\b/i);
  const time = text.match(/\b(?:from|between)\s+([01]?\d|2[0-3]):([0-5]\d)(?:\s*UTC)?\s*(?:to|and|[-–—])\s*([01]?\d|2[0-3]):([0-5]\d)\s*UTC\b/i);
  if ((!isoDate && !namedDate) || !time) return {};

  const reference = Date.parse(referenceIso);
  if (!Number.isFinite(reference)) return {};
  let year = Number(isoDate?.[1] ?? namedDate?.[3] ?? new Date(reference).getUTCFullYear());
  const month = isoDate ? Number(isoDate[2]) - 1 : MONTHS[namedDate![1]!.toLowerCase()]!;
  const day = Number(isoDate?.[3] ?? namedDate![2]);
  const explicitYear = Boolean(isoDate || namedDate?.[3]);
  const makeStart = (y: number) => Date.UTC(y, month, day, Number(time[1]), Number(time[2]));
  let startMs = makeStart(year);
  const valid = new Date(startMs).getUTCMonth() === month && new Date(startMs).getUTCDate() === day;
  if (!valid) return {};
  if (!explicitYear && startMs < reference - 2 * 86_400_000) startMs = makeStart(++year);
  let endMs = Date.UTC(year, month, day, Number(time[3]), Number(time[4]));
  if (endMs <= startMs) endMs += 86_400_000;
  return { startsAt: new Date(startMs).toISOString(), endsAt: new Date(endMs).toISOString() };
}

/** Remove duplicate regional announcements and group the rest by provider and UTC day. */
export function groupMaintenances(list: SourceIncident[]): MaintenanceGroup[] {
  const groups = new Map<string, MaintenanceGroup>();
  const seen = new Set<string>();
  for (const item of list) {
    const signature = `${item.src}|${item.name.trim().toLowerCase()}|${item.startsAt ?? ""}|${item.endsAt ?? ""}`;
    if (seen.has(signature)) continue;
    seen.add(signature);
    const day = (item.startsAt ?? item.updatedAt).slice(0, 10);
    const key = `${item.src}|${day}`;
    const group = groups.get(key) ?? { key, src: item.src, day, items: [] };
    group.items.push(item);
    groups.set(key, group);
  }
  return [...groups.values()];
}
