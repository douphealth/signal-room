import { createServerFn } from "@tanstack/react-start";
import { SOURCES, type Reading } from "./services";

let cache: { at: number; data: Record<string, Reading> } | null = null;

async function fetchOne(url: string): Promise<Reading> {
  const fetchedAt = new Date().toISOString();
  try {
    const res = await fetch(url, { headers: { accept: "application/json" }, signal: AbortSignal.timeout(8000) });
    if (!res.ok) return { ok: false, fetchedAt, components: [], incidents: [], error: `HTTP ${res.status}` };
    const j: any = await res.json();
    return {
      ok: true, fetchedAt, updatedAt: j.page?.updated_at, indicator: j.status?.indicator, description: j.status?.description,
      components: (j.components ?? []).filter((c: any) => !c.group).map((c: any) => ({ name: String(c.name), status: String(c.status) })),
      incidents: (j.incidents ?? []).slice(0, 5).map((i: any) => ({ id: String(i.id), name: String(i.name), impact: String(i.impact), status: String(i.status), updatedAt: String(i.updated_at), link: String(i.shortlink ?? "") })),
    };
  } catch (e) {
    return { ok: false, fetchedAt, components: [], incidents: [], error: e instanceof Error ? e.message : "Request failed" };
  }
}

export const getReadings = createServerFn({ method: "GET" }).handler(async () => {
  if (cache && Date.now() - cache.at < 45_000) return cache.data;
  const entries = await Promise.all(Object.entries(SOURCES).map(async ([k, s]) => [k, await fetchOne(s.url)] as const));
  const data = Object.fromEntries(entries) as Record<string, Reading>;
  cache = { at: Date.now(), data };
  return data;
});
