import { createFileRoute } from "@tanstack/react-router";
import { feedSlice } from "@/lib/status.functions";

// Internal: reads one slice of the official feeds. The board splits its ~100 feeds across
// several of these requests because one Worker invocation may make at most 50 subrequests
// (Cloudflare free plan); each slice runs in its own invocation with its own budget.
export const Route = createFileRoute("/api/feeds.json")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const part = Number(url.searchParams.get("part"));
        const of = Number(url.searchParams.get("of"));
        if (!Number.isInteger(part) || !Number.isInteger(of) || of < 1 || of > 10 || part < 0 || part >= of) {
          return new Response("bad slice", { status: 400 });
        }
        return new Response(JSON.stringify(await feedSlice(part, of)), {
          headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store", "x-robots-tag": "noindex" },
        });
      },
    },
  },
});
