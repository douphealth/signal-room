import { createServerFn } from "@tanstack/react-start";
import { setResponseHeader } from "@tanstack/react-start/server";
import { SOURCES, LEVEL_RANK, componentLevel, incidentUrl, parseMaintenanceWindow, type Reading, type Incident } from "./services";

let cache: { at: number; data: Record<string, Reading> } | null = null;
let pending: Promise<Record<string, Reading>> | null = null;

const clip = (t: unknown) => { const v = String(t ?? "").replace(/\s+/g, " ").trim(); return v.length > 500 ? v.slice(0, 497) + "…" : v; };

function inc(i: any, page: string): Incident {
  const updates = Array.isArray(i.incident_updates) ? i.incident_updates : [];
  const u = updates[0];
  const id = String(i.id);
  const out: Incident = {
    id,
    name: clip(i.name),
    impact: String(i.impact ?? "none"),
    status: String(i.status),
    updatedAt: String(i.updated_at ?? i.created_at ?? new Date().toISOString()),
    link: incidentUrl(page, id, i.shortlink),
    affected: (i.components ?? []).map((c: any) => String(c.name)).slice(0, 16),
  };
  if (i.created_at) out.createdAt = String(i.created_at);
  if (u?.body) out.latest = clip(u.body);
  if (i.scheduled_for) out.startsAt = String(i.scheduled_for);
  if (i.scheduled_until) out.endsAt = String(i.scheduled_until);
  if (!out.startsAt || !out.endsAt) {
    for (const update of updates) {
      const parsed = parseMaintenanceWindow(String(update?.body ?? ""), out.updatedAt);
      if (!out.startsAt && parsed.startsAt) out.startsAt = parsed.startsAt;
      if (!out.endsAt && parsed.endsAt) out.endsAt = parsed.endsAt;
      if (out.startsAt && out.endsAt) break;
    }
  }
  return out;
}

function normalizeComponents(input: any): { name: string; status: string }[] {
  const components = new Map<string, { name: string; status: string }>();
  for (const raw of Array.isArray(input) ? input : []) {
    if (raw?.group) continue;
    const component = { name: String(raw.name), status: String(raw.status) };
    const previous = components.get(component.name);
    if (!previous || LEVEL_RANK[componentLevel(component.status)] > LEVEL_RANK[componentLevel(previous.status)]) components.set(component.name, component);
  }
  return [...components.values()];
}

async function fetchOne(source: { url: string; page: string }): Promise<Reading> {
  const fetchedAt = new Date().toISOString();
  const t0 = Date.now();
  try {
    const res = await fetch(source.url, { headers: { accept: "application/json" }, signal: AbortSignal.timeout(8000) });
    if (!res.ok) return { ok: false, fetchedAt, lastAttemptAt: fetchedAt, httpStatus: res.status, components: [], incidents: [], maintenances: [], error: `HTTP ${res.status}` };
    const j: any = await res.json();
    return {
      ok: true, fetchedAt, lastAttemptAt: fetchedAt, httpStatus: res.status, updatedAt: j.page?.updated_at, indicator: j.status?.indicator, description: j.status?.description,
      components: normalizeComponents(j.components),
      incidents: (j.incidents ?? []).slice(0, 12).map((i: any) => inc(i, source.page)),
      maintenances: (j.scheduled_maintenances ?? []).slice(0, 24).map((i: any) => inc(i, source.page)),
      ms: Date.now() - t0,
    };
  } catch (e) {
    return { ok: false, fetchedAt, lastAttemptAt: fetchedAt, components: [], incidents: [], maintenances: [], error: e instanceof Error ? e.message : "Request failed" };
  }
}

async function loadReadings(): Promise<Record<string, Reading>> {
  const entries: (readonly [string, Reading])[] = [];
  const sources = Object.entries(SOURCES);
  // Six reusable slots keep fast feeds moving without waiting for the slowest in a batch.
  let next = 0;
  await Promise.all(Array.from({ length: Math.min(6, sources.length) }, async () => {
    while (next < sources.length) {
      const entry = sources[next++];
      if (!entry) return;
      const [key, source] = entry;
      entries.push([key, await fetchOne(source)]);
    }
  }));
  const data = Object.fromEntries(entries) as Record<string, Reading>;
  // Keep the last good reading (clearly flagged) if a feed blips instead of blanking its services.
  if (cache) {
    for (const key of Object.keys(data)) {
      const previous = cache.data[key];
      const failed = data[key];
      if (failed && !failed.ok && previous?.ok) {
        const stale: Reading = { ...previous, stale: true, lastAttemptAt: failed.lastAttemptAt ?? failed.fetchedAt };
        if (failed.error) stale.error = failed.error;
        if (failed.httpStatus == null) delete stale.httpStatus;
        else stale.httpStatus = failed.httpStatus;
        data[key] = stale;
      }
    }
  }
  cache = { at: Date.now(), data };
  return data;
}

export const getReadings = createServerFn({ method: "GET" }).handler(async () => {
  // Public provider data only: safe to reuse at the edge and across visitors.
  setResponseHeader("Cache-Control", "public, max-age=30, stale-while-revalidate=120");
  if (cache && Date.now() - cache.at < 45_000) return cache.data;
  if (pending) return pending;
  const request = loadReadings();
  pending = request;
  try {
    return await request;
  } finally {
    if (pending === request) pending = null;
  }
});
