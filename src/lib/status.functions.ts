import { createServerFn } from "@tanstack/react-start";
import { SOURCES, type Reading, type Incident } from "./services";

let cache: { at: number; data: Record<string, Reading> } | null = null;

const clip = (t: unknown) => { const v = String(t ?? "").replace(/\s+/g, " ").trim(); return v.length > 320 ? v.slice(0, 317) + "…" : v; };
function inc(i: any): Incident {
  const u = (i.incident_updates ?? [])[0];
  const out: Incident = { id: String(i.id), name: String(i.name), impact: String(i.impact ?? "none"), status: String(i.status), updatedAt: String(i.updated_at), link: String(i.shortlink ?? ""), affected: (i.components ?? []).map((c: any) => String(c.name)).slice(0, 8) };
  if (u?.body) out.latest = clip(u.body);
  if (i.scheduled_for) out.startsAt = String(i.scheduled_for);
  if (i.scheduled_until) out.endsAt = String(i.scheduled_until);
  return out;
}

async function fetchOne(url: string): Promise<Reading> {
  const fetchedAt = new Date().toISOString();
  const t0 = Date.now();
  try {
    const res = await fetch(url, { headers: { accept: "application/json" }, signal: AbortSignal.timeout(8000) });
    if (!res.ok) return { ok: false, fetchedAt, components: [], incidents: [], maintenances: [], error: `HTTP ${res.status}` };
    const j: any = await res.json();
    return {
      ok: true, fetchedAt, updatedAt: j.page?.updated_at, indicator: j.status?.indicator, description: j.status?.description,
      components: (j.components ?? []).filter((c: any) => !c.group).map((c: any) => ({ name: String(c.name), status: String(c.status) })),
      incidents: (j.incidents ?? []).slice(0, 8).map(inc),
      maintenances: (j.scheduled_maintenances ?? []).slice(0, 6).map(inc),
      ms: Date.now() - t0,
    };
  } catch (e) {
    return { ok: false, fetchedAt, components: [], incidents: [], maintenances: [], error: e instanceof Error ? e.message : "Request failed" };
  }
}

export const getReadings = createServerFn({ method: "GET" }).handler(async () => {
  if (cache && Date.now() - cache.at < 45_000) return cache.data;
  const entries = await Promise.all(Object.entries(SOURCES).map(async ([k, s]) => [k, await fetchOne(s.url)] as const));
  const data = Object.fromEntries(entries) as Record<string, Reading>;
  cache = { at: Date.now(), data };
  return data;
});
