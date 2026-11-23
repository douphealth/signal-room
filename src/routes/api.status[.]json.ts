import { createFileRoute } from "@tanstack/react-router";
import { SOURCES } from "@/lib/services";
import { boardReadings } from "@/lib/status.functions";

// One JSON document with every official feed Signalroom polls, for the /monitor workspace
// (its "worker endpoint"): one cached request per visitor instead of ~70 browser fetches.
// Keyed by Signalroom source id AND by the feed's summary.json URL, so other dashboards can match either.
type Status = "operational" | "degraded" | "outage" | "maintenance";

const overall = (indicator?: string): Status =>
  indicator === "minor" ? "degraded" : indicator === "major" || indicator === "critical" ? "outage" : indicator === "maintenance" ? "maintenance" : "operational";

const component = (s: string): Status =>
  s === "degraded_performance" || s === "partial_outage" ? "degraded" : s === "major_outage" ? "outage" : s === "under_maintenance" ? "maintenance" : "operational";

export const Route = createFileRoute("/api/status.json")({
  server: {
    handlers: {
      GET: async () => {
        const readings = await boardReadings();
        const services: Record<string, unknown> = {};
        for (const [id, r] of Object.entries(readings)) {
          if (!r.ok) continue; // no fresh reading: clients fall back to the official page
          const item = {
            status: overall(r.indicator),
            description: r.description ?? "",
            checkedAt: r.fetchedAt,
            components: r.components.slice(0, 8).map((c) => ({ name: c.name.split(" > ").pop() ?? c.name, status: component(c.status) })),
            incidents: r.incidents.slice(0, 5).map((i) => ({ name: i.name, status: i.status, impact: i.impact, shortlink: i.link })),
            page: SOURCES[id]?.page,
          };
          services[id] = item;
          if (SOURCES[id]) services[SOURCES[id]!.url] = item;
        }
        return new Response(JSON.stringify({ generatedAt: new Date().toISOString(), services }), {
          headers: {
            "content-type": "application/json; charset=utf-8",
            "cache-control": "public, max-age=30, stale-while-revalidate=120",
            "access-control-allow-origin": "*",
            "x-robots-tag": "noindex",
          },
        });
      },
    },
  },
});
