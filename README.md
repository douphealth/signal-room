# Signalroom

A source-first status desk for the tools you depend on — OpenAI, Claude, GitHub, Cloudflare, Vercel, Supabase, Notion, Figma, Shopify and more.

## Features
- **Official evidence only** — readings come from each provider's public `summary.json` status feed. No synthetic probes.
- **Component-level scoping** — e.g. *Claude Code* and *GitHub Actions* track only their own published components.
- **Live board** — auto-refresh every 60s with a countdown, fleet-health meter, severity-sorted cards.
- **Active incidents feed** linking straight to provider postmortems.
- **Private watchlist** stored in your browser; **CSV export**; keyboard shortcuts (`/` `r` `i` `w` `Esc`).
- **Detail drawer** with component breakdown and practical "before you blame the provider" triage tips.

## Stack
TanStack Start (React 19, SSR) · Tailwind CSS v4 · TanStack Query · runs on Cloudflare Workers.

Server-side fetching (`src/lib/status.functions.ts`) avoids CORS and caches readings for 45s.

## Adding a service
Add the provider to `SOURCES` and an entry to `SERVICES` in `src/lib/services.ts`. Use `components` to scope to exact component names from the provider's feed.

## Develop
```bash
bun install
bun run dev
```

_Independent project, not affiliated with any listed provider._
