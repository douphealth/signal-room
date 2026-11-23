export type Category = "AI" | "Developer" | "Design" | "Work" | "Commerce" | "Consumer";
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
  perplexity: {"label": "Perplexity", "url": "https://status.perplexity.com/api/v2/summary.json", "page": "https://status.perplexity.com/"} ,
  mistral: {"label": "Mistral AI", "url": "https://status.mistral.ai/api/v2/summary.json", "page": "https://status.mistral.ai/"} ,
  groq: {"label": "Groq", "url": "https://groqstatus.com/api/v2/summary.json", "page": "https://groqstatus.com/"} ,
  cohere: {"label": "Cohere", "url": "https://status.cohere.com/api/v2/summary.json", "page": "https://status.cohere.com/"} ,
  elevenlabs: {"label": "ElevenLabs", "url": "https://status.elevenlabs.io/api/v2/summary.json", "page": "https://status.elevenlabs.io/"} ,
  runway: {"label": "Runway", "url": "https://status.runwayml.com/api/v2/summary.json", "page": "https://status.runwayml.com/"} ,
  lovable: {"label": "Lovable", "url": "https://status.lovable.dev/api/v2/summary.json", "page": "https://status.lovable.dev/"} ,
  bolt: {"label": "Bolt.new", "url": "https://status.bolt.new/api/v2/summary.json", "page": "https://status.bolt.new/"} ,
  windsurf: {"label": "Windsurf", "url": "https://status.windsurf.com/api/v2/summary.json", "page": "https://status.windsurf.com/"} ,
  grammarly: {"label": "Grammarly", "url": "https://status.grammarly.com/api/v2/summary.json", "page": "https://status.grammarly.com/"} ,
  postman: {"label": "Postman", "url": "https://status.postman.com/api/v2/summary.json", "page": "https://status.postman.com/"} ,
  newrelic: {"label": "New Relic", "url": "https://status.newrelic.com/api/v2/summary.json", "page": "https://status.newrelic.com/"} ,
  linode: {"label": "Linode (Akamai)", "url": "https://status.linode.com/api/v2/summary.json", "page": "https://status.linode.com/"} ,
  godaddy: {"label": "GoDaddy", "url": "https://status.godaddy.com/api/v2/summary.json", "page": "https://status.godaddy.com/"} ,
  miro: {"label": "Miro", "url": "https://status.miro.com/api/v2/summary.json", "page": "https://status.miro.com/"} ,
  airtable: {"label": "Airtable", "url": "https://status.airtable.com/api/v2/summary.json", "page": "https://status.airtable.com/"} ,
  box: {"label": "Box", "url": "https://status.box.com/api/v2/summary.json", "page": "https://status.box.com/"} ,
  hubspot: {"label": "HubSpot", "url": "https://status.hubspot.com/api/v2/summary.json", "page": "https://status.hubspot.com/"} ,
  typeform: {"label": "Typeform", "url": "https://status.typeform.com/api/v2/summary.json", "page": "https://status.typeform.com/"} ,
  instructure: {"label": "Instructure", "url": "https://status.instructure.com/api/v2/summary.json", "page": "https://status.instructure.com/"} ,
  mailerlite: {"label": "MailerLite", "url": "https://status.mailerlite.com/api/v2/summary.json", "page": "https://status.mailerlite.com/"} ,
  klaviyo: {"label": "Klaviyo", "url": "https://status.klaviyo.com/api/v2/summary.json", "page": "https://status.klaviyo.com/"} ,
  coinbase: {"label": "Coinbase", "url": "https://status.coinbase.com/api/v2/summary.json", "page": "https://status.coinbase.com/"} ,
  kraken: {"label": "Kraken", "url": "https://status.kraken.com/api/v2/summary.json", "page": "https://status.kraken.com/"} ,
  robinhood: {"label": "Robinhood", "url": "https://status.robinhood.com/api/v2/summary.json", "page": "https://status.robinhood.com/"} ,
  square: {"label": "Square", "url": "https://www.issquareup.com/api/v2/summary.json", "page": "https://www.issquareup.com/"} ,
  squarespace: {"label": "Squarespace", "url": "https://status.squarespace.com/api/v2/summary.json", "page": "https://status.squarespace.com/"} ,
  bigcommerce: {"label": "BigCommerce", "url": "https://status.bigcommerce.com/api/v2/summary.json", "page": "https://status.bigcommerce.com/"} ,
  patreon: {"label": "Patreon", "url": "https://status.patreon.com/api/v2/summary.json", "page": "https://status.patreon.com/"} ,
  epicgames: {"label": "Epic Games", "url": "https://status.epicgames.com/api/v2/summary.json", "page": "https://status.epicgames.com/"} ,
  twitch: {"label": "Twitch", "url": "https://status.twitch.com/api/v2/summary.json", "page": "https://status.twitch.com/"} ,
  duolingo: {"label": "Duolingo", "url": "https://status.duolingo.com/api/v2/summary.json", "page": "https://status.duolingo.com/"} ,
  vimeo: {"label": "Vimeo", "url": "https://www.vimeostatus.com/api/v2/summary.json", "page": "https://www.vimeostatus.com/"} ,
  medium: {"label": "Medium", "url": "https://status.medium.com/api/v2/summary.json", "page": "https://status.medium.com/"} ,
  lastpass: {"label": "LastPass", "url": "https://status.lastpass.com/api/v2/summary.json", "page": "https://status.lastpass.com/"},
  smartsheet: {"label": "Smartsheet", "url": "https://status.smartsheet.com/api/v2/summary.json", "page": "https://status.smartsheet.com/"},
  snowflake: {"label": "Snowflake", "url": "https://status.snowflake.com/api/v2/summary.json", "page": "https://status.snowflake.com/"},
  monday: {"label": "monday.com", "url": "https://status.monday.com/api/v2/summary.json", "page": "https://status.monday.com/"},
  wix: {"label": "Wix", "url": "https://status.wix.com/api/v2/summary.json", "page": "https://status.wix.com/"},
  onepassword: {"label": "1Password", "url": "https://status.1password.com/api/v2/summary.json", "page": "https://status.1password.com/"},
  clickup: {"label": "ClickUp", "url": "https://status.clickup.com/api/v2/summary.json", "page": "https://status.clickup.com/"},
  kahoot: {"label": "Kahoot!", "url": "https://status.kahoot.com/api/v2/summary.json", "page": "https://status.kahoot.com/"},
  tailscale: {"label": "Tailscale", "url": "https://status.tailscale.com/api/v2/summary.json", "page": "https://status.tailscale.com/"},
  ngrok: {"label": "ngrok", "url": "https://status.ngrok.com/api/v2/summary.json", "page": "https://status.ngrok.com/"},
  segment: {"label": "Segment", "url": "https://status.segment.com/api/v2/summary.json", "page": "https://status.segment.com/"},
  kajabi: {"label": "Kajabi", "url": "https://status.kajabi.com/api/v2/summary.json", "page": "https://status.kajabi.com/"},
  chime: {"label": "Chime", "url": "https://status.chime.com/api/v2/summary.json", "page": "https://status.chime.com/"},
  cashapp: {"label": "Cash App", "url": "https://status.cash.app/api/v2/summary.json", "page": "https://status.cash.app/"},
  constantcontact: {"label": "Constant Contact", "url": "https://status.constantcontact.com/api/v2/summary.json", "page": "https://status.constantcontact.com/"},
  udemy: {"label": "Udemy", "url": "https://status.udemy.com/api/v2/summary.json", "page": "https://status.udemy.com/"},
  proton: {"label": "Proton", "url": "https://status.proton.me/api/v2/summary.json", "page": "https://status.proton.me/"},
  activecampaign: {"label": "ActiveCampaign", "url": "https://status.activecampaign.com/api/v2/summary.json", "page": "https://status.activecampaign.com/"},
  khanacademy: {"label": "Khan Academy", "url": "https://status.khanacademy.org/api/v2/summary.json", "page": "https://status.khanacademy.org/"},
  hootsuite: {"label": "Hootsuite", "url": "https://status.hootsuite.com/api/v2/summary.json", "page": "https://status.hootsuite.com/"},
  cryptocom: {"label": "Crypto.com", "url": "https://status.crypto.com/api/v2/summary.json", "page": "https://status.crypto.com/"},
  descript: {"label": "Descript", "url": "https://status.descript.com/api/v2/summary.json", "page": "https://status.descript.com/"},
  buildkite: {"label": "Buildkite", "url": "https://www.buildkitestatus.com/api/v2/summary.json", "page": "https://www.buildkitestatus.com/"} ,
  hashicorp: {"label": "HashiCorp Cloud", "url": "https://status.hashicorp.com/api/v2/summary.json", "page": "https://status.hashicorp.com/"} ,
  launchdarkly: {"label": "LaunchDarkly", "url": "https://status.launchdarkly.com/api/v2/summary.json", "page": "https://status.launchdarkly.com/"} ,
  cockroachdb: {"label": "CockroachDB Cloud", "url": "https://status.cockroachlabs.cloud/api/v2/summary.json", "page": "https://status.cockroachlabs.cloud/"} ,
  grafana: {"label": "Grafana Cloud", "url": "https://status.grafana.com/api/v2/summary.json", "page": "https://status.grafana.com/"} ,
  honeycomb: {"label": "Honeycomb", "url": "https://status.honeycomb.io/api/v2/summary.json", "page": "https://status.honeycomb.io/"} ,
  opsgenie: {"label": "Opsgenie", "url": "https://opsgenie.status.atlassian.com/api/v2/summary.json", "page": "https://opsgenie.status.atlassian.com/"} ,
  workos: {"label": "WorkOS", "url": "https://status.workos.com/api/v2/summary.json", "page": "https://status.workos.com/"} ,
  snyk: {"label": "Snyk", "url": "https://status.snyk.io/api/v2/summary.json", "page": "https://status.snyk.io/"} ,
  sendgrid: {"label": "SendGrid", "url": "https://status.sendgrid.com/api/v2/summary.json", "page": "https://status.sendgrid.com/"} ,
  pusher: {"label": "Pusher", "url": "https://status.pusher.com/api/v2/summary.json", "page": "https://status.pusher.com/"} ,
  ably: {"label": "Ably", "url": "https://status.ably.com/api/v2/summary.json", "page": "https://status.ably.com/"} ,
  mixpanel: {"label": "Mixpanel", "url": "https://status.mixpanel.com/api/v2/summary.json", "page": "https://status.mixpanel.com/"} ,
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
  {"id": "perplexity", "name": "Perplexity", "category": "AI", "mark": "PX", "source": "perplexity", "note": "AI answer engine, search and API", "tip": "Compare the web app, mobile app and API separately. Note whether answers fail or only sources are missing."},
  {"id": "mistral", "name": "Mistral AI", "category": "AI", "mark": "MI", "source": "mistral", "note": "Le Chat and the Mistral model API", "tip": "Separate Le Chat issues from API errors. Record the model name, HTTP status and request time."},
  {"id": "groq", "name": "Groq", "category": "AI", "mark": "GQ", "source": "groq", "note": "GroqCloud inference API and console", "tip": "Check the model you call and its rate limits. A 429 is a quota limit, not an outage."},
  {"id": "cohere", "name": "Cohere", "category": "AI", "mark": "CO", "source": "cohere", "note": "Cohere model API, embeddings and rerank", "tip": "Note which endpoint failed (chat, embed or rerank) and keep the request ID."},
  {"id": "elevenlabs", "name": "ElevenLabs", "category": "AI", "mark": "EL", "source": "elevenlabs", "note": "Text-to-speech, voice and dubbing API", "tip": "Check character quota and the voice or model ID before assuming an outage. Compare web app and API."},
  {"id": "runway", "name": "Runway", "category": "AI", "mark": "RW", "source": "runway", "note": "AI video generation app and API", "tip": "Separate queue delays from failed generations. Check your plan's credits and concurrency."},
  {"id": "lovable", "name": "Lovable", "category": "AI", "mark": "LV", "source": "lovable", "note": "AI app builder, editor and hosted previews", "tip": "Distinguish editor or AI generation problems from your app's own build errors and hosting."},
  {"id": "bolt", "name": "Bolt.new", "category": "AI", "mark": "BO", "source": "bolt", "note": "AI app builder in the browser", "tip": "Try a new project and a hard refresh. Browser extensions and blocked WebContainers can look like outages."},
  {"id": "windsurf", "name": "Windsurf", "category": "AI", "mark": "WS", "source": "windsurf", "note": "AI code editor, agent and completions", "tip": "Compare completions, chat and agent features. Check sign-in and the editor version."},
  {"id": "grammarly", "name": "Grammarly", "category": "Work", "mark": "GR", "source": "grammarly", "note": "Writing suggestions in the app, browser extension and add-ins", "tip": "Test grammarly.com directly. If only one site or app fails, the extension or add-in is the likely cause."},
  {"id": "postman", "name": "Postman", "category": "Developer", "mark": "PM", "source": "postman", "note": "API client, workspaces, monitors and mocks", "tip": "Separate sync and workspace problems from the API you are calling. Check monitor regions."},
  {"id": "new-relic", "name": "New Relic", "category": "Developer", "mark": "NR", "source": "newrelic", "note": "Observability ingest, alerts and dashboards", "tip": "Check your data region (US or EU). Delayed data and failed alerts are reported separately."},
  {"id": "linode", "name": "Linode (Akamai Cloud)", "category": "Developer", "mark": "LI", "source": "linode", "note": "Compute instances, storage and networking by region", "tip": "Match the affected data center to your instances. One region's incident does not affect the others."},
  {"id": "godaddy", "name": "GoDaddy", "category": "Commerce", "mark": "GD", "source": "godaddy", "note": "Domains, DNS, hosting and Websites + Marketing", "tip": "DNS changes can take time to propagate. Check whether the domain, DNS or hosting product is affected."},
  {"id": "miro", "name": "Miro", "category": "Design", "mark": "MR", "source": "miro", "note": "Online whiteboards and collaboration", "tip": "Try another board and a private window. Large boards can be slow without an outage."},
  {"id": "airtable", "name": "Airtable", "category": "Work", "mark": "AT", "source": "airtable", "note": "Bases, interfaces, automations and API", "tip": "Separate automation or API failures from the web app. Check API rate limits (429)."},
  {"id": "box", "name": "Box", "category": "Work", "mark": "BX", "source": "box", "note": "Cloud file storage, sharing and Box apps", "tip": "Check whether web, sync (Box Drive) or integrations fail. Permissions can look like an outage."},
  {"id": "hubspot", "name": "HubSpot", "category": "Work", "mark": "HS", "source": "hubspot", "note": "CRM, marketing, sales and service hubs", "tip": "Note which hub and region are affected. Integrations can fail while the CRM is up."},
  {"id": "typeform", "name": "Typeform", "category": "Work", "mark": "TF", "source": "typeform", "note": "Forms, responses and integrations", "tip": "Test the public form link separately from the builder and the response integrations."},
  {"id": "canvas", "name": "Canvas LMS", "category": "Work", "mark": "CV", "source": "instructure", "components": ["Canvas > Canvas LMS", "Canvas > Canvas Mobile", "Canvas > Canvas Studio", "Canvas > Canvas Commons", "Canvas > Canvas Catalog", "Canvas > Canvas Credentials", "Canvas > Canvas Data 2", "Canvas > Canvas Portfolio", "Canvas > Student ePortfolios", "Canvas > Student Pathways", "Canvas > Canvas Career"], "note": "Instructure's learning platform used by schools and universities", "tip": "Your school's own Canvas setup, SSO login or a third-party tool can fail while Canvas itself is up. Ask your school's help desk too."},
  {"id": "mailerlite", "name": "MailerLite", "category": "Commerce", "mark": "ML", "source": "mailerlite", "note": "Email marketing, automations and sending", "tip": "Check campaign sending and automation queues separately from the dashboard."},
  {"id": "klaviyo", "name": "Klaviyo", "category": "Commerce", "mark": "KL", "source": "klaviyo", "note": "Email and SMS marketing for online stores", "tip": "Separate sending delays from integration sync (e.g. Shopify) and dashboard issues."},
  {"id": "coinbase", "name": "Coinbase", "category": "Commerce", "mark": "CB", "source": "coinbase", "note": "Crypto exchange, wallets, payments and API", "tip": "Check which part is affected: website, mobile app, a specific asset, or a payment method. Never share recovery phrases with anyone claiming to be support."},
  {"id": "kraken", "name": "Kraken", "category": "Commerce", "mark": "KR", "source": "kraken", "note": "Crypto exchange, funding and trading", "tip": "Funding (deposits and withdrawals) is listed per asset and method. Check yours specifically."},
  {"id": "robinhood", "name": "Robinhood", "category": "Commerce", "mark": "RH", "source": "robinhood", "note": "Trading app, crypto and account services", "tip": "Check whether trading, market data or transfers are affected. Market hours also matter."},
  {"id": "square", "name": "Square", "category": "Commerce", "mark": "SQ", "source": "square", "note": "Point of sale, payments and Square Online", "tip": "Note whether card processing, the POS app or the dashboard is affected. Keep offline-mode limits in mind."},
  {"id": "squarespace", "name": "Squarespace", "category": "Commerce", "mark": "SS", "source": "squarespace", "note": "Websites, commerce, domains and email campaigns", "tip": "Check if only the editor or also live sites are affected. Domain DNS issues can look like site outages."},
  {"id": "bigcommerce", "name": "BigCommerce", "category": "Commerce", "mark": "BC", "source": "bigcommerce", "note": "Online store platform, checkout and APIs", "tip": "Separate storefront, checkout and control panel problems. Third-party apps can break checkout."},
  {"id": "patreon", "name": "Patreon", "category": "Consumer", "mark": "PT", "source": "patreon", "note": "Creator memberships, posts and payments", "tip": "Separate payment or payout issues from posts and the app. Payment declines are often bank-side."},
  {"id": "fortnite", "name": "Fortnite", "category": "Consumer", "mark": "FN", "source": "epicgames", "components": ["Fortnite > Website", "Fortnite > Game Services", "Fortnite > Login", "Fortnite > Parties, Friends, and Messaging", "Fortnite > Voice Chat", "Fortnite > Matchmaking", "Fortnite > Stats and Leaderboards", "Fortnite > Item Shop", "Fortnite > Fortnite Crew"], "note": "Fortnite login, matchmaking, game services and Item Shop", "tip": "Check whether login, matchmaking or parties fail. Platform networks (PlayStation, Xbox, Nintendo) have their own outages."},
  {"id": "epic-games-store", "name": "Epic Games Store", "category": "Consumer", "mark": "EG", "source": "epicgames", "components": ["Epic Games Store > Login", "Epic Games Store > Download/Installation", "Epic Games Store > Purchasing/Refunding", "Epic Games Store > Epic Wallet", "Epic Games Store > Store Browsing", "Epic Games Store > Publishing Tools", "Epic Games Store > Achievements", "Epic Games Store > Game Details"], "note": "Epic Games Store login, downloads and purchases", "tip": "Separate launcher login from downloads and purchases. Restart the launcher before reinstalling games."},
  {"id": "rocket-league", "name": "Rocket League", "category": "Consumer", "mark": "RL", "source": "epicgames", "components": ["Rocket League > Login", "Rocket League > Website", "Rocket League > Game Services", "Rocket League > Matchmaking", "Rocket League > Stats and Leaderboards", "Rocket League > Item Shop", "Rocket League > Parties, Friends, and Messaging", "Rocket League > Voice Chat"], "note": "Rocket League login, matchmaking and game services", "tip": "Check matchmaking and login separately. Your platform's online service can also be the cause."},
  {"id": "fall-guys", "name": "Fall Guys", "category": "Consumer", "mark": "FG", "source": "epicgames", "components": ["Fall Guys > Login", "Fall Guys > Matchmaking", "Fall Guys > Voice Chat", "Fall Guys > Parties, Friends, and Messaging", "Fall Guys > Item Shop", "Fall Guys > Website", "Fall Guys > Game Services"], "note": "Fall Guys login, matchmaking and game services", "tip": "Check login, matchmaking and parties separately, and your console network's status."},
  {"id": "twitch", "name": "Twitch", "category": "Consumer", "mark": "TW", "source": "twitch", "note": "Live streaming: watching, broadcasting, chat and purchases", "tip": "Separate watching, broadcasting and chat. For streamers, also check your encoder and ingest server."},
  {"id": "duolingo", "name": "Duolingo", "category": "Consumer", "mark": "DL", "source": "duolingo", "note": "Language-learning app and website", "tip": "Compare the app and website. Streak issues during an outage are usually handled by Duolingo support."},
  {"id": "vimeo", "name": "Vimeo", "category": "Consumer", "mark": "VM", "source": "vimeo", "note": "Video hosting, playback, uploads and live", "tip": "Separate playback, upload and live streaming. Embeds can fail because of the host site."},
  {"id": "medium", "name": "Medium", "category": "Consumer", "mark": "MD", "source": "medium", "note": "Reading, writing and publishing on Medium", "tip": "Compare reading and the editor. Custom-domain publications can fail on DNS alone."},
  {"id": "lastpass", "name": "LastPass", "category": "Work", "mark": "LP", "source": "lastpass", "note": "Password manager: vault access, sign-in, browser extension and admin console", "tip": "Try the LastPass web vault and the browser extension separately. The status page lists regions (US, Europe, Australia), so check yours."},
  {"id": "onepassword", "name": "1Password", "category": "Work", "mark": "1P", "source": "onepassword", "note": "Password manager: 1Password.com accounts, sign-in, sync and admin tools", "tip": "If unlock works but sync fails, your saved items are still available offline in the app. Check the region your account is hosted in."},
  {"id": "smartsheet", "name": "Smartsheet", "category": "Work", "mark": "SM", "source": "smartsheet", "note": "Work management: sheets, notifications, forms and the REST API", "tip": "Separate the web app from email notifications and API integrations; they are listed as different components."},
  {"id": "monday", "name": "monday.com", "category": "Work", "mark": "MO", "source": "monday", "note": "Work OS: boards, dashboards, automations and integrations", "tip": "If boards load but automations or integrations stall, check those components specifically before assuming a full outage."},
  {"id": "clickup", "name": "ClickUp", "category": "Work", "mark": "CU", "source": "clickup", "note": "Project management: tasks, docs, automations and ClickUp Brain AI", "tip": "Compare the platform itself with automations and Brain AI, which ClickUp reports as separate components."},
  {"id": "snowflake", "name": "Snowflake", "category": "Developer", "mark": "SF", "source": "snowflake", "note": "Cloud data platform: warehouses, queries, data loading and Snowsight", "tip": "Snowflake publishes status per cloud provider and region. Match your account's region before assuming an outage."},
  {"id": "segment", "name": "Segment", "category": "Developer", "mark": "SE", "source": "segment", "note": "Customer data platform: tracking API, Analytics.js CDN and destinations", "tip": "Events can be accepted but delayed downstream. Check ingestion and destination components separately."},
  {"id": "tailscale", "name": "Tailscale", "category": "Developer", "mark": "TS", "source": "tailscale", "note": "Mesh VPN: coordination service, DERP relays, admin console and API", "tip": "Existing connections can keep working during a coordination-service incident; new logins and key changes are usually affected first."},
  {"id": "ngrok", "name": "ngrok", "category": "Developer", "mark": "NG", "source": "ngrok", "note": "Tunnels and API gateway: regional edges, dashboard and API", "tip": "ngrok reports each region separately. Try another region flag if only one region is degraded."},
  {"id": "wix", "name": "Wix", "category": "Commerce", "mark": "WX", "source": "wix", "note": "Website builder: editor, published sites, stores and bookings", "tip": "Check whether visitors can reach your live site or only the editor and dashboard are affected; Wix lists them separately."},
  {"id": "kajabi", "name": "Kajabi", "category": "Commerce", "mark": "KJ", "source": "kajabi", "note": "Creator platform: courses, checkout, site emails and webhooks", "tip": "Check Offer Checkout first if sales stop. Course access and automated emails are separate components."},
  {"id": "kahoot", "name": "Kahoot!", "category": "Consumer", "mark": "KA", "source": "kahoot", "note": "Game-based learning: hosting, joining games, login and search", "tip": "If players cannot join, check whether hosting or the join page is affected, and try a different network for school firewalls."},
  {"id": "chime", "name": "Chime", "category": "Commerce", "mark": "CH", "source": "chime", "note": "Mobile banking: card purchases, direct deposit, transfers and support", "tip": "Chime lists card purchases, direct deposit and in-app support separately. If only your card is declined, check Card Purchases."},
  {"id": "cashapp", "name": "Cash App", "category": "Commerce", "mark": "CA", "source": "cashapp", "note": "Payments: send and receive money, Cash App Card, Cash App Pay and direct deposit", "tip": "If a payment is pending, check Send & Receive Money before resending: a second attempt can go through twice once service recovers."},
  {"id": "constantcontact", "name": "Constant Contact", "category": "Commerce", "mark": "CC", "source": "constantcontact", "note": "Email marketing: campaigns, contacts, SMS and sign-up forms", "tip": "Check whether sending, contact management or the editor is affected; Constant Contact reports them as separate components."},
  {"id": "activecampaign", "name": "ActiveCampaign", "category": "Commerce", "mark": "AC", "source": "activecampaign", "note": "Marketing automation: email sending, automations, published pages and API", "tip": "Automations can be delayed while the app still loads. Check Email and API Availability separately."},
  {"id": "hootsuite", "name": "Hootsuite", "category": "Work", "mark": "HS", "source": "hootsuite", "note": "Social media management: web and mobile apps, scheduling and inbox", "tip": "Scheduled posts depend on each social network too. If only one network fails, check that network's own status."},
  {"id": "descript", "name": "Descript", "category": "AI", "mark": "DE", "source": "descript", "note": "AI audio and video editing: desktop and web apps, transcription and project sync", "tip": "If edits don't sync between devices, check Live Collaboration/Project Sync before re-exporting."},
  {"id": "proton", "name": "Proton Mail", "category": "Work", "mark": "PM", "source": "proton", "note": "Proton services: Mail, VPN, Drive, Calendar and Pass on one shared status page", "tip": "Proton reports web, mobile and VPN servers separately. If only the VPN fails, try another server before assuming a wider outage."},
  {"id": "udemy", "name": "Udemy", "category": "Consumer", "mark": "UD", "source": "udemy", "note": "Online courses: the Udemy marketplace and Udemy Business", "tip": "Udemy publishes two components: Udemy.com and Udemy Business. Check the one you use."},
  {"id": "khanacademy", "name": "Khan Academy", "category": "Consumer", "mark": "KH", "source": "khanacademy", "note": "Free learning platform: lessons, assignments, discussions and mobile apps", "tip": "For classroom assignments, check Assignments specifically; school network filters can also block the site."},
  {"id": "cryptocom", "name": "Crypto.com", "category": "Commerce", "mark": "CR", "source": "cryptocom", "note": "Crypto exchange and app: buying, trading, API and NFT", "tip": "Check whether buying, the API or login is affected; Crypto.com reports them as separate components."},
  {"id": "buildkite", "name": "Buildkite", "category": "Developer", "mark": "BK", "source": "buildkite", "note": "CI/CD pipelines, agents and the Buildkite web app", "tip": "If builds sit in 'scheduled', check that your self-hosted agents are connected before assuming a Buildkite outage."},
  {"id": "hashicorp", "name": "HashiCorp Cloud", "category": "Developer", "mark": "HC", "source": "hashicorp", "note": "HCP Terraform, Vault, Packer and other HashiCorp cloud services", "tip": "Terraform runs can fail on provider APIs too: compare the error with your cloud provider's status before retrying."},
  {"id": "launchdarkly", "name": "LaunchDarkly", "category": "Developer", "mark": "LD", "source": "launchdarkly", "note": "Feature flags: flag delivery, streaming updates and the dashboard", "tip": "SDKs keep serving cached flag values during an outage; check whether only dashboard changes are delayed."},
  {"id": "cockroachdb", "name": "CockroachDB Cloud", "category": "Developer", "mark": "CR", "source": "cockroachdb", "note": "Managed CockroachDB clusters, console and cloud API", "tip": "Check the region of your cluster in the component list: incidents are often limited to one cloud region."},
  {"id": "grafana", "name": "Grafana Cloud", "category": "Developer", "mark": "GR", "source": "grafana", "note": "Grafana Cloud dashboards, metrics, logs, traces and alerting", "tip": "If dashboards load but panels are empty, check the Metrics, Logs or Traces components for your region."},
  {"id": "honeycomb", "name": "Honeycomb", "category": "Developer", "mark": "HY", "source": "honeycomb", "note": "Observability: event ingest, queries and triggers", "tip": "Missing recent events can be ingest delay: compare ingest and query components before changing instrumentation."},
  {"id": "opsgenie", "name": "Opsgenie", "category": "Developer", "mark": "OG", "source": "opsgenie", "note": "On-call alerting, notifications and schedules", "tip": "If alerts are not arriving, check the notification channel component (SMS, voice, push, email) that you rely on."},
  {"id": "workos", "name": "WorkOS", "category": "Developer", "mark": "WO", "source": "workos", "note": "Enterprise SSO, directory sync and user management APIs", "tip": "SSO failures can come from the customer's identity provider: check its status as well as WorkOS."},
  {"id": "snyk", "name": "Snyk", "category": "Developer", "mark": "SN", "source": "snyk", "note": "Security scanning: CLI, IDE, SCM integrations and the web app", "tip": "If CLI scans fail, retry with --debug to see whether the API or your network proxy is the cause."},
  {"id": "sendgrid", "name": "SendGrid", "category": "Developer", "mark": "SG", "source": "sendgrid", "note": "Email API, SMTP relay, delivery and event webhooks", "tip": "Delayed emails are not always an outage: check the Mail Sending and Event Webhook components and your activity feed."},
  {"id": "pusher", "name": "Pusher", "category": "Developer", "mark": "PU", "source": "pusher", "note": "Realtime Channels and Beams push notifications", "tip": "Check the cluster your app uses (for example mt1 or eu) in the component list."},
  {"id": "ably", "name": "Ably", "category": "Developer", "mark": "AB", "source": "ably", "note": "Realtime messaging: pub/sub, presence and push", "tip": "Ably fails over between regions automatically; check whether only one region is affected."},
  {"id": "mixpanel", "name": "Mixpanel", "category": "Developer", "mark": "MX", "source": "mixpanel", "note": "Product analytics: event ingestion, reports and exports", "tip": "Events may arrive late during ingestion delays and appear later without being lost; check the ingestion component first."}
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
  // Unscoped services list plain component names only; "Group > Name" entries exist for scoped products.
  const matched = svc.components ? r.components.filter((c) => svc.components!.includes(c.name)) : r.components.filter((c) => !c.name.includes(" > "));
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
/** "Fortnite > Login" -> "Login" for display under a product that is already named. */
export function componentLabel(name: string): string { return name.split(" > ").pop() ?? name; }

/** Affected list for display: prefer "Group > Name" and drop the duplicate plain name. */
export function displayAffected(list: string[]): string[] {
  return list.filter((a) => a.includes(" > ") || !list.some((b) => b.endsWith(` > ${a}`)));
}

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
