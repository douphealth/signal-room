import { createFileRoute } from "@tanstack/react-router";
import { queryOptions, useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useRef, useState } from "react";
import { getReadings } from "@/lib/status.functions";
import { SERVICES, SOURCES, LEVEL_LABEL, LEVEL_RANK, componentLevel, serviceLevel, type Level, type Category, type Service, type Reading } from "@/lib/services";

const REFRESH = 60_000;
const readingsQuery = queryOptions({ queryKey: ["readings"], queryFn: () => getReadings(), refetchInterval: REFRESH, staleTime: 30_000 });

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Signalroom — Live status board for AI, dev & SaaS tools" },
      { name: "description", content: "Source-first status desk: official readings for OpenAI, Claude, GitHub, Cloudflare, Vercel, Supabase and more, with a private watchlist." },
      { property: "og:title", content: "Signalroom — Live status board" },
      { property: "og:description", content: "Official provider status readings, a private watchlist and the evidence behind every signal." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(readingsQuery),
  component: Index,
});

const DOT: Record<Level, string> = { operational: "bg-ok text-ok", degraded: "bg-warn text-warn", partial: "bg-partial text-partial", major: "bg-major text-major", maintenance: "bg-maint text-maint", unknown: "bg-unknown text-unknown" };
const TXT: Record<Level, string> = { operational: "text-ok", degraded: "text-warn", partial: "text-partial", major: "text-major", maintenance: "text-maint", unknown: "text-unknown" };
const CATS: ("All" | Category)[] = ["All", "AI", "Developer", "Design", "Work", "Commerce"];

function ago(iso?: string) {
  if (!iso) return "—";
  const s = Math.max(0, (Date.now() - Date.parse(iso)) / 1000);
  return s < 60 ? "just now" : s < 3600 ? `${Math.floor(s / 60)}m ago` : s < 86400 ? `${Math.floor(s / 3600)}h ago` : `${Math.floor(s / 86400)}d ago`;
}

function Dot({ level, size = "h-2.5 w-2.5" }: { level: Level; size?: string }) {
  return <span className={`inline-block rounded-full ${size} ${DOT[level]} ${level !== "operational" && level !== "unknown" ? "pulse-dot" : ""}`} />;
}

function Index() {
  const { data: readings, dataUpdatedAt, refetch, isFetching } = useQuery({ ...readingsQuery, initialData: useSuspenseQuery(readingsQuery).data });
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<(typeof CATS)[number]>("All");
  const [onlyIssues, setOnlyIssues] = useState(false);
  const [onlyWatch, setOnlyWatch] = useState(false);
  const [watch, setWatch] = useState<string[]>([]);
  const [open, setOpen] = useState<Service | null>(null);
  const [now, setNow] = useState(Date.now());
  const search = useRef<HTMLInputElement>(null);

  useEffect(() => { try { setWatch(JSON.parse(localStorage.getItem("sr-watch") || "[]")); } catch {} }, []);
  useEffect(() => { const t = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(t); }, []);
  const toggleWatch = (id: string) => setWatch((w) => { const n = w.includes(id) ? w.filter((x) => x !== id) : [...w, id]; localStorage.setItem("sr-watch", JSON.stringify(n)); return n; });

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).tagName === "INPUT") { if (e.key === "Escape") (e.target as HTMLInputElement).blur(); return; }
      if (e.key === "/") { e.preventDefault(); search.current?.focus(); }
      else if (e.key === "r") refetch();
      else if (e.key === "w") setOnlyWatch((v) => !v);
      else if (e.key === "i") setOnlyIssues((v) => !v);
      else if (e.key === "Escape") setOpen(null);
    };
    window.addEventListener("keydown", h); return () => window.removeEventListener("keydown", h);
  }, [refetch]);

  const rows = useMemo(() => SERVICES.map((s) => ({ s, ...serviceLevel(s, readings[s.source]) })), [readings]);
  const counts = useMemo(() => { const c: Record<Level, number> = { operational: 0, degraded: 0, partial: 0, major: 0, maintenance: 0, unknown: 0 }; rows.forEach((r) => c[r.level]++); return c; }, [rows]);
  const filtered = rows
    .filter((r) => (cat === "All" || r.s.category === cat) && (!onlyIssues || r.level !== "operational") && (!onlyWatch || watch.includes(r.s.id)))
    .filter((r) => !q || (r.s.name + r.s.note + r.s.category).toLowerCase().includes(q.toLowerCase()))
    .sort((a, b) => LEVEL_RANK[b.level] - LEVEL_RANK[a.level] || +watch.includes(b.s.id) - +watch.includes(a.s.id) || a.s.name.localeCompare(b.s.name));

  const healthy = counts.operational, total = rows.length, pct = Math.round((healthy / total) * 100);
  const worst = rows.reduce<Level>((w, r) => (LEVEL_RANK[r.level] > LEVEL_RANK[w] && r.level !== "unknown" ? r.level : w), "operational");
  const incidents = Object.entries(readings).flatMap(([k, r]) => r.incidents.map((i) => ({ ...i, src: SOURCES[k].label }))).sort((a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt));
  const progress = Math.min(1, (now - dataUpdatedAt) / REFRESH);
  const sourcesOk = Object.values(readings).filter((r) => r.ok).length;

  const exportCsv = () => {
    const lines = [["service", "category", "status", "source", "fetched_at"], ...rows.map((r) => [r.s.name, r.s.category, r.level, SOURCES[r.s.source].page, readings[r.s.source]?.fetchedAt ?? ""])];
    const blob = new Blob([lines.map((l) => l.map((v) => `"${v}"`).join(",")).join("\n")], { type: "text/csv" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = `signalroom-${new Date().toISOString().slice(0, 16)}.csv`; a.click();
  };

  return (
    <div className="min-h-screen">
      <div className="h-0.5 bg-muted"><div className="h-full bg-primary transition-[width] duration-1000 ease-linear" style={{ width: `${progress * 100}%` }} /></div>
      <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-3">
          <a href="/" className="flex items-center gap-2 text-lg font-bold tracking-tight">
            <svg viewBox="0 0 38 38" className="h-7 w-7 text-primary" fill="none"><path d="M4 21h6l5-10 7 18 5-11h7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg>
            signalroom<span className="text-primary">.</span>
          </a>
          <nav className="hidden gap-6 text-sm text-muted-foreground md:flex">
            <a href="#board" className="hover:text-foreground">Board</a><a href="#incidents" className="hover:text-foreground">Incidents</a><a href="#method" className="hover:text-foreground">Method</a>
          </nav>
          <button onClick={() => refetch()} className="flex items-center gap-2 rounded-full border border-border px-3 py-1.5 font-mono text-xs text-muted-foreground hover:border-primary hover:text-foreground">
            <span className={`h-1.5 w-1.5 rounded-full bg-primary ${isFetching ? "animate-ping" : ""}`} />
            {isFetching ? "reading…" : `next in ${Math.max(0, Math.ceil((REFRESH - (now - dataUpdatedAt)) / 1000))}s`}
          </button>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-5 pb-10 pt-14">
        <div className="grid items-end gap-10 lg:grid-cols-[1.4fr_1fr]">
          <div className="rise">
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-primary">Internet status desk · official sources only</p>
            <h1 className="mt-4 text-5xl font-bold leading-[0.95] tracking-tight md:text-7xl">
              {worst === "operational" ? <>All signals <span className="text-ok">clear.</span></> : <>Signals <span className={TXT[worst]}>{LEVEL_LABEL[worst].toLowerCase()}.</span></>}
            </h1>
            <p className="mt-5 max-w-xl text-lg text-muted-foreground">Live readings from the official status feeds of {total} services across {Object.keys(SOURCES).length} providers. No synthetic probes, no guesses — just the evidence, and where it came from.</p>
          </div>
          <div className="rise grid grid-cols-3 gap-3" style={{ animationDelay: "120ms" }}>
            <div className="col-span-3 relative overflow-hidden rounded-2xl border border-border bg-card p-5 glow">
              <div className="flex items-end justify-between"><span className="font-mono text-xs text-muted-foreground">FLEET HEALTH</span><span className="font-mono text-xs text-muted-foreground">{sourcesOk}/{Object.keys(SOURCES).length} feeds live</span></div>
              <div className="mt-2 text-6xl font-bold tabular-nums">{pct}<span className="text-2xl text-muted-foreground">%</span></div>
              <div className="mt-4 flex h-2 overflow-hidden rounded-full bg-muted">
                {(["operational", "maintenance", "degraded", "partial", "major", "unknown"] as Level[]).map((l) => counts[l] > 0 && <div key={l} className={`${DOT[l]} transition-all duration-700`} style={{ width: `${(counts[l] / total) * 100}%` }} title={`${LEVEL_LABEL[l]}: ${counts[l]}`} />)}
              </div>
              <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 scan bg-gradient-to-r from-transparent via-primary/10 to-transparent" />
            </div>
            {([["operational", "Clear"], ["degraded", "Degraded"], ["major", "Outage"]] as [Level, string][]).map(([l, label]) => (
              <button key={l} onClick={() => setOnlyIssues(l !== "operational")} className="rounded-2xl border border-border bg-card p-4 text-left transition hover:-translate-y-0.5 hover:border-primary/50">
                <div className="flex items-center gap-2 text-xs text-muted-foreground"><Dot level={l} size="h-2 w-2" />{label}</div>
                <div className="mt-1 text-3xl font-bold tabular-nums">{l === "degraded" ? counts.degraded + counts.partial + counts.maintenance : counts[l]}</div>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section id="board" className="mx-auto max-w-7xl px-5">
        <div className="sticky top-[57px] z-20 -mx-5 flex flex-wrap items-center gap-2 border-b border-border bg-background/85 px-5 py-3 backdrop-blur-xl">
          <div className="relative flex-1 min-w-[200px]">
            <input ref={search} value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search services…" className="w-full rounded-full border border-input bg-card px-4 py-2 text-sm outline-none focus:border-primary" />
            <kbd className="absolute right-3 top-1/2 -translate-y-1/2 rounded border border-border px-1.5 font-mono text-[10px] text-muted-foreground">/</kbd>
          </div>
          {CATS.map((c) => <button key={c} onClick={() => setCat(c)} className={`rounded-full px-3 py-1.5 text-sm transition ${cat === c ? "bg-primary text-primary-foreground" : "border border-border text-muted-foreground hover:text-foreground"}`}>{c}</button>)}
          <button onClick={() => setOnlyIssues((v) => !v)} className={`rounded-full px-3 py-1.5 text-sm ${onlyIssues ? "bg-warn text-primary-foreground" : "border border-border text-muted-foreground"}`}>Issues only</button>
          <button onClick={() => setOnlyWatch((v) => !v)} className={`rounded-full px-3 py-1.5 text-sm ${onlyWatch ? "bg-primary text-primary-foreground" : "border border-border text-muted-foreground"}`}>★ Watchlist {watch.length > 0 && `(${watch.length})`}</button>
          <button onClick={exportCsv} className="rounded-full border border-border px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground">Export CSV</button>
        </div>

        <div className="grid gap-3 py-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map(({ s, level, matched }, i) => (
            <article key={s.id} onClick={() => setOpen(s)} className="rise group relative cursor-pointer overflow-hidden rounded-2xl border border-border bg-card p-5 transition hover:-translate-y-1 hover:border-primary/40 hover:glow" style={{ animationDelay: `${Math.min(i, 12) * 35}ms` }}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="grid h-11 w-11 place-items-center rounded-xl bg-muted font-mono text-sm font-semibold">{s.mark}</div>
                  <div><h3 className="font-semibold leading-tight">{s.name}</h3><p className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">{s.category}</p></div>
                </div>
                <button aria-label="Toggle watchlist" onClick={(e) => { e.stopPropagation(); toggleWatch(s.id); }} className={`text-lg transition hover:scale-125 ${watch.includes(s.id) ? "text-primary" : "text-muted-foreground/40"}`}>★</button>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">{s.note}</p>
              <div className="mt-4 flex items-center justify-between">
                <span className={`flex items-center gap-2 text-sm font-medium ${TXT[level]}`}><Dot level={level} />{LEVEL_LABEL[level]}</span>
                <span className="font-mono text-[11px] text-muted-foreground">{matched.length} comp · {ago(readings[s.source]?.updatedAt)}</span>
              </div>
              <div className="mt-3 flex gap-0.5">{matched.slice(0, 24).map((c) => <span key={c.name} title={c.name} className={`h-1.5 flex-1 rounded-full ${DOT[componentLevel(c.status)]}`} />)}</div>
            </article>
          ))}
          {filtered.length === 0 && <div className="col-span-full rounded-2xl border border-dashed border-border p-12 text-center text-muted-foreground">{onlyWatch && watch.length === 0 ? "Star services to build your private watchlist — it stays on this device." : "Nothing matches these filters."}</div>}
        </div>
      </section>

      <section id="incidents" className="mx-auto max-w-7xl px-5 py-12">
        <h2 className="text-3xl font-bold tracking-tight">Active incidents</h2>
        <p className="mt-1 text-muted-foreground">Unresolved incidents published by providers, newest first.</p>
        <div className="mt-6 divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
          {incidents.length === 0 && <div className="flex items-center gap-3 p-6 text-muted-foreground"><Dot level="operational" />No provider is reporting an open incident right now.</div>}
          {incidents.map((i) => (
            <a key={i.id} href={i.link || "#"} target="_blank" rel="noreferrer" className="flex flex-wrap items-center gap-4 p-5 transition hover:bg-accent">
              <span className={`rounded-full px-2 py-0.5 font-mono text-[11px] uppercase ${i.impact === "critical" || i.impact === "major" ? "bg-major/20 text-major" : i.impact === "minor" ? "bg-warn/20 text-warn" : "bg-maint/20 text-maint"}`}>{i.impact}</span>
              <span className="font-mono text-xs text-muted-foreground">{i.src}</span>
              <span className="flex-1 font-medium">{i.name}</span>
              <span className="font-mono text-xs text-muted-foreground">{i.status} · {ago(i.updatedAt)} ↗</span>
            </a>
          ))}
        </div>
      </section>

      <section id="method" className="mx-auto max-w-7xl px-5 py-12">
        <h2 className="text-3xl font-bold tracking-tight">Method & sources</h2>
        <div className="mt-6 grid gap-3 md:grid-cols-3">
          {[["Official feeds only", "Every reading comes from the provider's public status summary. We never invent uptime or run synthetic probes."], ["Component-level matching", "Services like Claude Code or GitHub Actions are scoped to their exact published components, so one product's outage doesn't paint another red."], ["Private by design", "Your watchlist lives in your browser. No accounts, no tracking. Readings are cached 45 seconds to be kind to providers."]].map(([t, d]) => (
            <div key={t} className="rounded-2xl border border-border bg-card p-6"><h3 className="font-semibold">{t}</h3><p className="mt-2 text-sm text-muted-foreground">{d}</p></div>
          ))}
        </div>
        <div className="mt-6 flex flex-wrap gap-2">
          {Object.entries(SOURCES).map(([k, s]) => (
            <a key={k} href={s.page} target="_blank" rel="noreferrer" className="flex items-center gap-2 rounded-full border border-border px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground">
              <Dot level={readings[k]?.ok ? "operational" : "unknown"} size="h-1.5 w-1.5" />{s.label} ↗
            </a>
          ))}
        </div>
      </section>

      <footer className="border-t border-border py-8">
        <div className="mx-auto flex max-w-7xl flex-wrap justify-between gap-3 px-5 font-mono text-xs text-muted-foreground">
          <span>Signalroom · independent, not affiliated with any provider</span>
          <span>Shortcuts: <kbd>/</kbd> search · <kbd>r</kbd> refresh · <kbd>i</kbd> issues · <kbd>w</kbd> watchlist</span>
        </div>
      </footer>

      {open && <Detail s={open} r={readings[open.source]} onClose={() => setOpen(null)} watched={watch.includes(open.id)} onWatch={() => toggleWatch(open.id)} />}
    </div>
  );
}

function Detail({ s, r, onClose, watched, onWatch }: { s: Service; r?: Reading; onClose: () => void; watched: boolean; onWatch: () => void }) {
  const { level, matched } = serviceLevel(s, r);
  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-background/60 backdrop-blur-sm" onClick={onClose}>
      <aside onClick={(e) => e.stopPropagation()} className="h-full w-full max-w-md overflow-y-auto border-l border-border bg-popover p-6 shadow-2xl animate-in slide-in-from-right duration-300">
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">{s.category} · {SOURCES[s.source].label}</span>
          <button onClick={onClose} className="rounded-full border border-border px-2.5 py-1 text-sm text-muted-foreground hover:text-foreground">Esc</button>
        </div>
        <h2 className="mt-4 text-3xl font-bold">{s.name}</h2>
        <div className={`mt-2 flex items-center gap-2 font-medium ${TXT[level]}`}><Dot level={level} />{LEVEL_LABEL[level]}</div>
        {r?.description && <p className="mt-1 text-sm text-muted-foreground">Provider headline: “{r.description}”</p>}
        {r?.error && <p className="mt-2 text-sm text-major">Feed unreachable: {r.error}</p>}
        <div className="mt-6 rounded-xl border border-border bg-card p-4"><p className="font-mono text-[11px] uppercase text-primary">Before you blame the provider</p><p className="mt-1 text-sm">{s.tip}</p></div>
        <h3 className="mt-6 font-semibold">Components ({matched.length})</h3>
        <ul className="mt-2 divide-y divide-border rounded-xl border border-border">
          {matched.map((c) => { const l = componentLevel(c.status); return <li key={c.name} className="flex items-center justify-between px-4 py-2.5 text-sm"><span>{c.name}</span><span className={`flex items-center gap-2 ${TXT[l]}`}><Dot level={l} size="h-2 w-2" />{LEVEL_LABEL[l]}</span></li>; })}
          {matched.length === 0 && <li className="px-4 py-3 text-sm text-muted-foreground">No matching components published.</li>}
        </ul>
        {r && r.incidents.length > 0 && <><h3 className="mt-6 font-semibold">Open incidents</h3>{r.incidents.map((i) => <a key={i.id} href={i.link} target="_blank" rel="noreferrer" className="mt-2 block rounded-xl border border-border p-3 text-sm hover:border-primary">{i.name}<span className="block font-mono text-[11px] text-muted-foreground">{i.impact} · {i.status} · {ago(i.updatedAt)}</span></a>)}</>}
        <div className="mt-6 flex gap-2">
          <button onClick={onWatch} className="flex-1 rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground">{watched ? "★ Watching" : "☆ Add to watchlist"}</button>
          <a href={SOURCES[s.source].page} target="_blank" rel="noreferrer" className="flex-1 rounded-full border border-border px-4 py-2.5 text-center text-sm">Official page ↗</a>
        </div>
        <p className="mt-4 font-mono text-[11px] text-muted-foreground">Fetched {ago(r?.fetchedAt)} · provider updated {ago(r?.updatedAt)}</p>
      </aside>
    </div>
  );
}
