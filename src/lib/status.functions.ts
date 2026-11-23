import { createServerFn } from "@tanstack/react-start";
import { setResponseHeader } from "@tanstack/react-start/server";
import { SOURCES, LEVEL_RANK, componentLevel, incidentUrl, parseMaintenanceWindow, type Reading, type Incident } from "./services";

let cache: { at: number; data: Record<string, Reading> } | null = null;
let pending: Promise<Record<string, Reading>> | null = null;

const clip = (t: unknown) => { const v = String(t ?? "").replace(/\s+/g, " ").trim(); return v.length > 500 ? v.slice(0, 497) + "…" : v; };

function inc(i: any, page: string, groups: Map<string, string> = new Map()): Incident {
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
    affected: qualifiedNames(i.components, groups).slice(0, 32),
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

/** Statuspage group containers (e.g. "Fortnite") keyed by id. */
export function groupNames(input: any): Map<string, string> {
  const groups = new Map<string, string>();
  for (const raw of Array.isArray(input) ? input : []) if (raw?.group && raw.id) groups.set(String(raw.id), String(raw.name));
  return groups;
}

/** Plain names plus "Group > Name" so one product can be scoped when providers reuse names like "Login". */
function qualifiedNames(input: any, groups: Map<string, string>): string[] {
  const out: string[] = [];
  for (const raw of Array.isArray(input) ? input : []) {
    if (raw?.group) continue;
    out.push(String(raw.name));
    const group = raw?.group_id ? groups.get(String(raw.group_id)) : undefined;
    if (group) out.push(`${group} > ${String(raw.name)}`);
  }
  return [...new Set(out)];
}

export function normalizeComponents(input: any, groups: Map<string, string> = groupNames(input)): { name: string; status: string }[] {
  const components = new Map<string, { name: string; status: string }>();
  const keep = (component: { name: string; status: string }) => {
    const previous = components.get(component.name);
    if (!previous || LEVEL_RANK[componentLevel(component.status)] > LEVEL_RANK[componentLevel(previous.status)]) components.set(component.name, component);
  };
  for (const raw of Array.isArray(input) ? input : []) {
    if (raw?.group) continue;
    keep({ name: String(raw.name), status: String(raw.status) });
    const group = raw?.group_id ? groups.get(String(raw.group_id)) : undefined;
    if (group) keep({ name: `${group} > ${String(raw.name)}`, status: String(raw.status) });
  }
  return [...components.values()];
}

export async function fetchOne(source: { url: string; page: string }): Promise<Reading> {
  const fetchedAt = new Date().toISOString();
  const t0 = Date.now();
  try {
    const res = await fetch(source.url, { headers: { accept: "application/json" }, signal: AbortSignal.timeout(8000) });
    if (!res.ok) return { ok: false, fetchedAt, lastAttemptAt: fetchedAt, httpStatus: res.status, components: [], incidents: [], maintenances: [], error: `HTTP ${res.status}` };
    const j: any = await res.json();
    const groups = groupNames(j.components);
    return {
      ok: true, fetchedAt, lastAttemptAt: fetchedAt, httpStatus: res.status, updatedAt: j.page?.updated_at, indicator: j.status?.indicator, description: j.status?.description,
      components: normalizeComponents(j.components, groups),
      incidents: (j.incidents ?? []).slice(0, 12).map((i: any) => inc(i, source.page, groups)),
      maintenances: (j.scheduled_maintenances ?? []).slice(0, 24).map((i: any) => inc(i, source.page, groups)),
      ms: Date.now() - t0,
    };
  } catch (e) {
    return { ok: false, fetchedAt, lastAttemptAt: fetchedAt, components: [], incidents: [], maintenances: [], error: e instanceof Error ? e.message : "Request failed" };
  }
}

// One Worker invocation may make at most 50 subrequests (Cloudflare free plan) and there are ~100 feeds,
// so the board reads them in SLICES parallel requests to /api/feeds.json — each its own invocation.
const SLICES = 3;
const DIRECT_BUDGET = 40; // fallback cap when a slice request fails: stay under 50 with headroom

async function readFeeds(sources: [string, (typeof SOURCES)[string]][]): Promise<(readonly [string, Reading])[]> {
  const entries: (readonly [string, Reading])[] = [];
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
  return entries;
}

function slice(part: number, of: number): [string, (typeof SOURCES)[string]][] {
  return Object.entries(SOURCES).filter((_, i) => i % of === part);
}

/** Readings for one slice of the feeds (served by /api/feeds.json). */
export async function feedSlice(part: number, of: number): Promise<Record<string, Reading>> {
  return Object.fromEntries(await readFeeds(slice(part, of))) as Record<string, Reading>;
}

async function loadReadings(): Promise<Record<string, Reading>> {
  const origin = "https://signalroom.store";
  const parts = await Promise.all(Array.from({ length: SLICES }, async (_, part) => {
    try {
      const res = await fetch(`${origin}/api/feeds.json?part=${part}&of=${SLICES}`, { signal: AbortSignal.timeout(12_000) });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return Object.entries((await res.json()) as Record<string, Reading>);
    } catch {
      return null; // read this slice directly below, within the remaining budget
    }
  }));
  const entries: (readonly [string, Reading])[] = parts.flatMap((p) => p ?? []);
  const missing = parts.flatMap((p, part) => (p ? [] : slice(part, SLICES)));
  if (missing.length) {
    entries.push(...(await readFeeds(missing.slice(0, DIRECT_BUDGET))));
    const at = new Date().toISOString();
    for (const [key] of missing.slice(DIRECT_BUDGET)) entries.push([key, { ok: false, fetchedAt: at, components: [], incidents: [], maintenances: [], error: "Not read this cycle" }]);
  }
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

/** All feeds, shared by the board, /status pages and /api/status.json (45 s in-memory cache, one fetch in flight). */
export async function boardReadings(): Promise<Record<string, Reading>> {
  if (cache && Date.now() - cache.at < 45_000) return cache.data;
  if (pending) return pending;
  const request = loadReadings();
  pending = request;
  try {
    return await request;
  } finally {
    if (pending === request) pending = null;
  }
}

export const getReadings = createServerFn({ method: "GET" }).handler(async () => {
  // Public provider data only: safe to reuse at the edge and across visitors.
  setResponseHeader("Cache-Control", "public, max-age=30, stale-while-revalidate=120");
  return boardReadings();
});

const one = new Map<string, { at: number; data: Reading }>();
/** Single-provider reading for /status/<slug> pages; reuses the board cache when fresh. */
export const getSourceReading = createServerFn({ method: "GET" })
  .inputValidator((d: { source: string }) => {
    if (!d || typeof d.source !== "string" || !Object.hasOwn(SOURCES, d.source)) throw new Error("Unknown source");
    return d;
  })
  .handler(async ({ data }) => {
    setResponseHeader("Cache-Control", "public, max-age=30, stale-while-revalidate=120");
    if (cache && Date.now() - cache.at < 45_000 && cache.data[data.source]) return cache.data[data.source]!;
    const hit = one.get(data.source);
    if (hit && Date.now() - hit.at < 45_000) return hit.data;
    const r = await fetchOne(SOURCES[data.source]!);
    const reading: Reading = !r.ok && hit?.data.ok ? { ...hit.data, stale: true, lastAttemptAt: r.lastAttemptAt ?? r.fetchedAt } : r;
    one.set(data.source, { at: Date.now(), data: reading });
    return reading;
  });
