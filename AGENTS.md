<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.

## What Lovable manages

Rules outside this block are the project's own. Change the pieces below in
Lovable, not by hand. With the [Lovable MCP](https://mcp.lovable.dev)
connected, `send_message` asks Lovable to do it; otherwise ask the user to
use the editor.

- **Database.** Do not add or edit `supabase/migrations/` or `drizzle/`.
  Ask Lovable to change the schema.
- **Generated files.** Do not edit a file whose header says it is automatically
  generated.
- **AI gateway.** Keep model calls on Lovable's gateway, and keep
  `LOVABLE_API_KEY` out of browser code.
- **Connectors.** Lovable provides native connectors. `list_connectors` shows
  which are enabled; `add_connector` only returns the dashboard link. When a
  connector is enabled, calls go through the connector gateway and need
  `LOVABLE_API_KEY`. When Lovable does not provide one, users can bring their
  own key and store it in Secrets.
- **Secrets.** Lovable manages them. Do not put secret values in the repo.
<!-- LOVABLE:END -->

- Service catalogue and status-level logic live in src/lib/services.ts; status feeds are fetched only server-side via src/lib/status.functions.ts (avoids CORS, enables caching).
- Verify new provider summary feeds and exact scoped component names before listing them; catalogue tests retain published component fixtures to catch unsupported mappings.
- Aggregate provider feeds through six reusable fetch slots so growing coverage does not stall behind batch boundaries or exceed the runtime connection budget.

## /monitor (hand-made design)
The stack-monitor workspace at /monitor is a hand-made single-page design: edit `design/home.html`,
run `node scripts/build-home.mjs`, commit. It is served by `src/home/serve.ts` (PAGE_PATH), reads
live data from `/api/status.json` (all official feeds, cached) and links services to /status/<id>.
Never put an index.html in the repo root: Nitro would serve it for every route. Never show estimated
or generated uptime history — Signalroom only shows live readings and links the vendor's own history.
