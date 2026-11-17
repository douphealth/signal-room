# Signalroom

A source-first status desk for the tools you depend on — OpenAI, Claude, GitHub, Cloudflare, Vercel, Supabase, Notion, Figma, Shopify and more.

## Features
- **Official evidence only** — readings come from each provider's public `summary.json` status feed. No synthetic probes or invented uptime percentages.
- **Component-level scoping** — products such as *Claude Code* and *GitHub Actions* track only their own published components. Incidents without component metadata never cascade onto every scoped product.
- **Live board** — auto-refresh every 60 seconds with a countdown, fleet-health meter, severity-sorted cards, and clearly labeled cached readings.
- **Active incidents** — exact official incident URLs, affected components, the latest provider update, and one-click Slack-ready copies.
- **Maintenance planner** — UTC fallback parsing for missing structured dates, local-time display, deduplication, and collapsible same-day regional groups.
- **Shareable watchlists** — stars stay in local storage by default; `?watch=supabase,vercel` URLs recreate a team's stack without accounts.
- **Command menu** — press `/` or `Ctrl/Cmd+K` to inspect services, toggle view, filter issues, copy a stack link, or export data.
- **Compact NOC view** — all 22 services in a dense operations list for secondary monitors.
- **JSON and CSV exports** — include source timestamps, incident evidence, matched components, and feed health.
- **Provider provenance** — exact feed type, last HTTP attempt, last good sync, and latency for every provider.
- **Detail drawer** — component breakdown, incident evidence, distinct sync/provider timestamps, and practical triage tips.

## Keyboard shortcuts

| Key | Action |
| --- | --- |
| `/` or `Ctrl/Cmd+K` | Open the command menu |
| `R` | Refresh official readings |
| `I` | Toggle issues only |
| `W` | Toggle watchlist filter |
| `N` | Switch Cards/NOC density |
| `Esc` | Close the menu or detail drawer |

Browser notifications are optional and only fire for watched services while the tab is open. Durable 30/90-day history and closed-tab email/chat alerts are intentionally not simulated.

## Stack
TanStack Start (React 19, SSR) · Tailwind CSS v4 · TanStack Query · cmdk · Simple Icons · Cloudflare Workers.

Server-side fetching (`src/lib/status.functions.ts`) avoids CORS, limits outbound concurrency to six, deduplicates concurrent reloads, and caches public readings for 45 seconds. A failed refresh retains the last good reading with a visible cached-data label.

## Adding a service
Add the provider to `SOURCES` and an entry to `SERVICES` in `src/lib/services.ts`. Use `components` to scope to exact component names from the provider's feed. Run `src/test/status-logic.test.ts` when changing matching, incident, maintenance, or grouping rules.

## Develop
```bash
bun install
bun run dev
```

## Test
```bash
bunx vitest run
```

_Independent project, not affiliated with any listed provider. Provider icons remain the property of their respective owners._
