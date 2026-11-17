import { createFileRoute } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useRef, useState } from "react";
import { Command } from "cmdk";
import {
  Activity, AlertTriangle, ArrowUpRight, Bell, Check, ChevronDown, Clock3,
  Command as CommandIcon, Copy, Download, FileJson, FileSpreadsheet, LayoutGrid,
  List, Radio, RefreshCw, Search, Share2, ShieldCheck, Star, X,
} from "lucide-react";
import {
  siAnthropic, siCanva, siCloudflare, siDigitalocean, siDiscord, siFigma,
  siGithub, siNotion, siOpenai, siRender, siShopify, siSupabase, siVercel,
} from "simple-icons";
import { toast } from "sonner";
import { getReadings } from "@/lib/status.functions";
import {
  SERVICES, SOURCES, LEVEL_LABEL, LEVEL_RANK, FEED_FORMAT, componentLevel,
  serviceLevel, relevantIncidents, groupMaintenances, type Level, type Category,
  type Service, type Reading, type SourceIncident,
} from "@/lib/services";

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
const PILL: Record<Level, string> = { operational: "border-ok/20 bg-ok/10", degraded: "border-warn/25 bg-warn/10", partial: "border-partial/25 bg-partial/10", major: "border-major/25 bg-major/10", maintenance: "border-maint/25 bg-maint/10", unknown: "border-border bg-muted" };
const CATS: ("All" | Category)[] = ["All", "AI", "Developer", "Design", "Work", "Commerce"];
const ICONS: Record<string, { path: string }> = {
  openai: siOpenai, claude: siAnthropic, cloudflare: siCloudflare, notion: siNotion,
  figma: siFigma, canva: siCanva, shopify: siShopify, github: siGithub,
  vercel: siVercel, supabase: siSupabase, discord: siDiscord, render: siRender,
  digitalocean: siDigitalocean,
};

function ServiceIcon({ source, className = "h-5 w-5" }: { source: string; className?: string }) {
  const icon = ICONS[source];
  return icon
    ? <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}><path d={icon.path} /></svg>
    : <Activity aria-hidden="true" className={className} />;
}

function total0(rows: { level: Level }[]) { return rows.filter((r) => r.level !== "operational" && r.level !== "unknown").length; }
function fmt(iso: string | undefined, local = true) {
  if (!iso || !Number.isFinite(Date.parse(iso))) return "Time not published";
  return new Intl.DateTimeFormat(local ? undefined : "en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit", timeZone: local ? undefined : "UTC" }).format(new Date(iso));
}
function fmtDay(day: string) {
  return new Intl.DateTimeFormat("en-US", { weekday: "short", month: "short", day: "numeric", timeZone: "UTC" }).format(new Date(`${day}T00:00:00Z`));
}
function ago(iso: string | undefined, at = Date.now()) {
  if (!iso || !Number.isFinite(Date.parse(iso))) return "time unavailable";
  const s = Math.max(0, (at - Date.parse(iso)) / 1000);
  return s < 10 ? "just now" : s < 60 ? `${Math.floor(s)}s ago` : s < 3600 ? `${Math.floor(s / 60)}m ago` : s < 86400 ? `${Math.floor(s / 3600)}h ago` : `${Math.floor(s / 86400)}d ago`;
}

function Dot({ level, size = "h-2.5 w-2.5" }: { level: Level; size?: string }) {
  return <span className={`inline-block shrink-0 rounded-full ${size} ${DOT[level]} ${level !== "operational" && level !== "unknown" ? "pulse-dot" : ""}`} />;
}

function StatusPill({ level }: { level: Level }) {
  return <span className={`inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-xs font-semibold ${PILL[level]} ${TXT[level]}`}><Dot level={level} size="h-1.5 w-1.5" />{LEVEL_LABEL[level]}</span>;
}

async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const area = document.createElement("textarea");
    area.value = text;
    area.style.position = "fixed";
    area.style.opacity = "0";
    document.body.appendChild(area);
    area.select();
    const copied = document.execCommand("copy");
    area.remove();
    return copied;
  }
}

function saveFile(name: string, content: string, type: string) {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = name;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function slackMessage(incident: SourceIncident) {
  const severity = incident.impact === "critical" || incident.impact === "major" ? "🔴" : incident.impact === "minor" ? "🟡" : "🔵";
  return [
    `${severity} *${incident.src}: ${incident.name}*`,
    `Severity: ${incident.impact} · Provider status: ${incident.status.replaceAll("_", " ")}`,
    `Affected: ${incident.affected.length ? incident.affected.join(", ") : "See the provider incident for current scope"}`,
    incident.latest ? `Latest official update: ${incident.latest}` : "",
    `Official incident: ${incident.link}`,
  ].filter(Boolean).join("\n");
}

function Index() {
  const { data: readings, dataUpdatedAt, refetch, isFetching } = useSuspenseQuery(readingsQuery);
  const [cat, setCat] = useState<(typeof CATS)[number]>("All");
  const [onlyIssues, setOnlyIssues] = useState(false);
  const [onlyWatch, setOnlyWatch] = useState(false);
  const [watch, setWatch] = useState<string[]>([]);
  const [watchReady, setWatchReady] = useState(false);
  const [open, setOpen] = useState<Service | null>(null);
  const [commandOpen, setCommandOpen] = useState(false);
  const [view, setView] = useState<"cards" | "noc">("cards");
  const [now, setNow] = useState(0);
  const [notify, setNotify] = useState(false);
  const prevLevels = useRef<Record<string, Level>>({});
  const clock = now || dataUpdatedAt;
  const hydrated = now > 0;

  useEffect(() => {
    try {
      const shared = new URL(window.location.href).searchParams.get("watch");
      const valid = new Set(SERVICES.map((service) => service.id));
      const initial = shared !== null ? shared.split(",").filter((id) => valid.has(id)) : JSON.parse(localStorage.getItem("sr-watch") || "[]");
      setWatch(Array.isArray(initial) ? initial.filter((id) => valid.has(id)) : []);
      if (localStorage.getItem("sr-view") === "noc") setView("noc");
    } catch { /* Keep an empty watchlist when storage or a shared URL is malformed. */ }
    setWatchReady(true);
    setNow(Date.now());
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!watchReady) return;
    const ordered = SERVICES.map((service) => service.id).filter((id) => watch.includes(id));
    localStorage.setItem("sr-watch", JSON.stringify(ordered));
    const url = new URL(window.location.href);
    if (ordered.length) url.searchParams.set("watch", ordered.join(","));
    else url.searchParams.delete("watch");
    window.history.replaceState(window.history.state, "", url);
  }, [watch, watchReady]);

  useEffect(() => {
    if (!watchReady) return;
    localStorage.setItem("sr-view", view);
  }, [view, watchReady]);

  const toggleWatch = (id: string) => setWatch((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      const editing = ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName) || target.isContentEditable;
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setCommandOpen((value) => !value);
        return;
      }
      if (editing) return;
      if (event.key === "/") { event.preventDefault(); setCommandOpen(true); }
      else if (event.key.toLowerCase() === "r") void refetch();
      else if (event.key.toLowerCase() === "w") setOnlyWatch((value) => !value);
      else if (event.key.toLowerCase() === "i") setOnlyIssues((value) => !value);
      else if (event.key.toLowerCase() === "n") setView((value) => value === "cards" ? "noc" : "cards");
      else if (event.key === "Escape") { setOpen(null); setCommandOpen(false); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [refetch]);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previous; };
  }, [open]);

  const rows = useMemo(() => SERVICES.map((service) => ({ s: service, ...serviceLevel(service, readings[service.source]) })), [readings]);
  const counts = useMemo(() => {
    const result: Record<Level, number> = { operational: 0, degraded: 0, partial: 0, major: 0, maintenance: 0, unknown: 0 };
    rows.forEach((row) => result[row.level]++);
    return result;
  }, [rows]);
  const filtered = rows
    .filter((row) => (cat === "All" || row.s.category === cat) && (!onlyIssues || (row.level !== "operational" && row.level !== "unknown")) && (!onlyWatch || watch.includes(row.s.id)))
    .sort((a, b) => LEVEL_RANK[b.level] - LEVEL_RANK[a.level] || +watch.includes(b.s.id) - +watch.includes(a.s.id) || a.s.name.localeCompare(b.s.name));

  const incidents = useMemo(() => Object.entries(readings).flatMap(([key, reading]) => reading.incidents.map((item) => ({ ...item, src: SOURCES[key]!.label }))).sort((a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt)), [readings]);
  const maintenanceGroups = useMemo(() => {
    const list = Object.entries(readings).flatMap(([key, reading]) => reading.maintenances.map((item) => ({ ...item, src: SOURCES[key]!.label })));
    return groupMaintenances(list).sort((a, b) => Date.parse(a.items[0]?.startsAt ?? a.day) - Date.parse(b.items[0]?.startsAt ?? b.day));
  }, [readings]);

  const issues = total0(rows);
  useEffect(() => { document.title = issues ? `(${issues}) Signalroom — ${issues} service${issues > 1 ? "s" : ""} affected` : "Signalroom — all signals clear"; }, [issues]);

  useEffect(() => {
    for (const row of rows) {
      const before = prevLevels.current[row.s.id];
      if (notify && before && before !== row.level && watch.includes(row.s.id) && typeof Notification !== "undefined" && Notification.permission === "granted") {
        new Notification(`${row.s.name}: ${LEVEL_LABEL[row.level]}`, { body: `Was ${LEVEL_LABEL[before]} · source ${SOURCES[row.s.source]?.label}` });
      }
      prevLevels.current[row.s.id] = row.level;
    }
  }, [rows, notify, watch]);

  const healthy = counts.operational;
  const total = rows.length;
  const pct = Math.round((healthy / total) * 100);
  const worst = rows.reduce<Level>((current, row) => (LEVEL_RANK[row.level] > LEVEL_RANK[current] && row.level !== "unknown" ? row.level : current), "operational");
  const progress = Math.min(1, Math.max(0, (clock - dataUpdatedAt) / REFRESH));
  const sourcesCurrent = Object.values(readings).filter((reading) => reading.ok && !reading.stale).length;
  const staleCount = Object.values(readings).filter((reading) => reading.stale).length;

  const enableNotify = async () => {
    if (typeof Notification === "undefined") { toast.error("This browser does not support notifications."); return; }
    if (!watch.length) { toast("Star a service first, then enable alerts for your watchlist."); return; }
    const permission = await Notification.requestPermission();
    setNotify(permission === "granted");
    if (permission === "granted") toast.success("Watchlist alerts are on while this tab is open.");
    else toast.error("Notifications were not enabled. Check your browser permission.");
  };

  const shareWatch = async () => {
    if (!watch.length) { toast("Star services to create a shareable stack link."); return; }
    const url = new URL(window.location.href);
    url.searchParams.set("watch", SERVICES.map((service) => service.id).filter((id) => watch.includes(id)).join(","));
    if (await copyText(url.toString())) toast.success(`Copied a live stack link with ${watch.length} service${watch.length === 1 ? "" : "s"}.`);
    else toast.error("Could not copy the link. Your browser may block clipboard access.");
  };

  const copyIncident = async (incident: SourceIncident) => {
    if (await copyText(slackMessage(incident))) toast.success("Copied a Slack-ready incident update with the official link.");
    else toast.error("Could not copy the incident update.");
  };

  const exportCsv = () => {
    const cell = (value: unknown) => `"${String(value ?? "").replaceAll('"', '""')}"`;
    const lines = [["service", "category", "status", "active_incidents", "reading", "source", "last_good_sync", "provider_updated"], ...rows.map((row) => [
      row.s.name, row.s.category, LEVEL_LABEL[row.level], relevantIncidents(row.s, readings[row.s.source]?.incidents ?? []).length,
      readings[row.s.source]?.stale ? "cached" : readings[row.s.source]?.ok ? "current" : "unavailable",
      SOURCES[row.s.source]?.page, readings[row.s.source]?.fetchedAt, readings[row.s.source]?.updatedAt,
    ])];
    saveFile(`signalroom-${new Date().toISOString().slice(0, 16)}.csv`, lines.map((line) => line.map(cell).join(",")).join("\n"), "text/csv;charset=utf-8");
    toast.success("CSV exported with status, incident counts and source timestamps.");
  };

  const exportJson = () => {
    const payload = {
      generatedAt: new Date().toISOString(),
      methodology: "Official provider Statuspage summary feeds; no synthetic uptime claims.",
      watchlist: watch,
      services: rows.map((row) => ({ id: row.s.id, name: row.s.name, category: row.s.category, status: row.level, matchedComponents: row.matched, source: SOURCES[row.s.source]?.page, reading: readings[row.s.source] })),
      incidents,
      maintenance: maintenanceGroups.flatMap((group) => group.items),
    };
    saveFile(`signalroom-${new Date().toISOString().slice(0, 16)}.json`, JSON.stringify(payload, null, 2), "application/json");
    toast.success("JSON exported with full source readings and incident evidence.");
  };

  const runCommand = (action: () => void) => { setCommandOpen(false); action(); };

  return (
    <div className="min-h-screen overflow-x-clip">
      <div className="fixed inset-x-0 top-0 z-50 h-0.5 bg-muted"><div className="h-full bg-primary transition-[width] duration-1000 ease-linear" style={{ width: `${progress * 100}%` }} /></div>
      <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[90rem] items-center justify-between gap-3 px-4 py-3 sm:px-5">
          <a href="/" className="flex shrink-0 items-center gap-2 text-lg font-bold tracking-tight" aria-label="Signalroom home">
            <svg viewBox="0 0 38 38" className="h-7 w-7 text-primary" fill="none" aria-hidden="true"><path d="M4 21h6l5-10 7 18 5-11h7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg>
            <span className="hidden sm:inline">signalroom<span className="text-primary">.</span></span>
          </a>
          <nav className="hidden items-center gap-5 text-sm text-muted-foreground lg:flex" aria-label="Main navigation">
            <a href="#board" className="transition hover:text-foreground">Board</a>
            <a href="#incidents" className="transition hover:text-foreground">Incidents{incidents.length ? ` (${incidents.length})` : ""}</a>
            <a href="#maintenance" className="transition hover:text-foreground">Maintenance</a>
            <a href="#method" className="transition hover:text-foreground">Feed health</a>
          </nav>
          <div className="flex items-center gap-2">
            <button onClick={() => setCommandOpen(true)} className="hidden items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs text-muted-foreground transition hover:border-primary/50 hover:text-foreground sm:flex" aria-label="Open command menu">
              <Search className="h-3.5 w-3.5" /> Command <kbd className="rounded border border-border px-1 font-mono text-[10px]">⌘K</kbd>
            </button>
            <button onClick={() => void refetch()} className="flex items-center gap-2 rounded-full border border-border px-3 py-1.5 font-mono text-xs text-muted-foreground transition hover:border-primary hover:text-foreground" aria-label="Refresh all official status feeds">
              <RefreshCw className={`h-3.5 w-3.5 ${isFetching ? "animate-spin" : ""}`} />
              <span className="hidden md:inline">{isFetching ? "reading…" : `next in ${Math.max(0, Math.ceil((REFRESH - (clock - dataUpdatedAt)) / 1000))}s`}</span>
            </button>
          </div>
        </div>
      </header>

      <main>
        <section className="relative mx-auto max-w-[90rem] px-4 pb-10 pt-10 sm:px-5 md:pt-16">
          <div className="pointer-events-none absolute -top-20 left-1/4 -z-10 h-80 w-[36rem] max-w-full rounded-full bg-primary/15 blur-3xl" />
          <div className="pointer-events-none absolute right-0 top-12 -z-10 h-56 w-56 rounded-full bg-maint/10 blur-3xl" />
          <div className="grid items-end gap-10 lg:grid-cols-[1.4fr_1fr]">
            <div className="rise">
              <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-primary sm:text-xs sm:tracking-[0.25em]"><Radio className="h-3.5 w-3.5" /> Internet status desk · official sources only</div>
              <h1 className="mt-4 text-4xl font-bold leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl">
                {worst === "operational" ? <>All signals <span className="text-ok">clear.</span></> : <>Signals <span className={TXT[worst]}>{LEVEL_LABEL[worst].toLowerCase()}.</span></>}
              </h1>
              <p className="mt-5 max-w-xl text-base text-muted-foreground md:text-lg">Live readings from the official status feeds of {total} services across {Object.keys(SOURCES).length} providers. No synthetic probes, no guesses — just the evidence, and where it came from.</p>
              <div className="mt-6 flex flex-wrap gap-2">
                <button onClick={() => setCommandOpen(true)} className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:-translate-y-0.5 hover:glow"><CommandIcon className="h-4 w-4" /> Find a service <kbd className="font-mono text-[10px] opacity-70">/</kbd></button>
                <button onClick={shareWatch} className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm text-muted-foreground transition hover:border-primary/50 hover:text-foreground"><Share2 className="h-4 w-4" /> Copy stack link</button>
              </div>
            </div>
            <div className="rise grid grid-cols-3 gap-3" style={{ animationDelay: "120ms" }}>
              <div className="glow relative col-span-3 overflow-hidden rounded-2xl border border-border bg-card p-5">
                <div className="flex items-end justify-between gap-3"><span className="font-mono text-xs text-muted-foreground">FLEET HEALTH</span><span className="text-right font-mono text-[11px] text-muted-foreground">{sourcesCurrent}/{Object.keys(SOURCES).length} feeds current{staleCount ? ` · ${staleCount} cached` : ""}</span></div>
                <div className="mt-2 flex items-end justify-between"><div className="text-6xl font-bold tabular-nums">{pct}<span className="text-2xl text-muted-foreground">%</span></div><span className="pb-2 text-xs text-muted-foreground">services operational</span></div>
                <div className="mt-4 flex h-2 overflow-hidden rounded-full bg-muted">
                  {(["operational", "maintenance", "degraded", "partial", "major", "unknown"] as Level[]).map((level) => counts[level] > 0 && <div key={level} className={`${DOT[level]} transition-all duration-700`} style={{ width: `${(counts[level] / total) * 100}%` }} title={`${LEVEL_LABEL[level]}: ${counts[level]}`} />)}
                </div>
                <div className="scan pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-transparent via-primary/10 to-transparent" />
              </div>
              {([["operational", "Clear"], ["degraded", "Attention"], ["major", "Major"]] as [Level, string][]).map(([level, label]) => (
                <button key={level} onClick={() => setOnlyIssues(level !== "operational")} className="rounded-2xl border border-border bg-card p-4 text-left transition hover:-translate-y-0.5 hover:border-primary/50">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground"><Dot level={level} size="h-2 w-2" />{label}</div>
                  <div className="mt-1 text-3xl font-bold tabular-nums">{level === "degraded" ? counts.degraded + counts.partial + counts.maintenance : counts[level]}</div>
                </button>
              ))}
            </div>
          </div>
        </section>

        <section id="board" className="mx-auto max-w-[90rem] scroll-mt-32 px-4 sm:px-5">
          <div className="sticky top-[57px] z-20 -mx-4 flex flex-col gap-2 border-b border-border bg-background/85 px-4 py-3 backdrop-blur-xl sm:-mx-5 sm:px-5 xl:flex-row xl:items-center">
            <button onClick={() => setCommandOpen(true)} className="flex w-full items-center gap-3 rounded-full border border-input bg-card px-4 py-2 text-left text-sm text-muted-foreground outline-none transition hover:border-primary/60 xl:max-w-sm">
              <Search className="h-4 w-4" /><span className="flex-1">Search services or run a command…</span><kbd className="rounded border border-border px-1.5 font-mono text-[10px]">/</kbd>
            </button>
            <div className="-mx-4 flex flex-1 gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:-mx-5 sm:px-5 xl:mx-0 xl:px-0 xl:pb-0">
              {CATS.map((category) => <button key={category} onClick={() => setCat(category)} className={`shrink-0 whitespace-nowrap rounded-full px-3 py-1.5 text-sm transition ${cat === category ? "bg-primary text-primary-foreground" : "border border-border text-muted-foreground hover:text-foreground"}`}>{category}</button>)}
              <button onClick={() => setOnlyIssues((value) => !value)} className={`shrink-0 whitespace-nowrap rounded-full px-3 py-1.5 text-sm transition ${onlyIssues ? "bg-warn text-primary-foreground" : "border border-border text-muted-foreground hover:text-foreground"}`}>Issues only</button>
              <button onClick={() => setOnlyWatch((value) => !value)} className={`shrink-0 whitespace-nowrap rounded-full px-3 py-1.5 text-sm transition ${onlyWatch ? "bg-primary text-primary-foreground" : "border border-border text-muted-foreground hover:text-foreground"}`}><Star className={`mr-1 inline h-3.5 w-3.5 ${onlyWatch ? "fill-current" : ""}`} />Watchlist {watch.length > 0 && `(${watch.length})`}</button>
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-1 [scrollbar-width:none] xl:pb-0">
              <div className="flex shrink-0 rounded-full border border-border p-0.5" aria-label="Board density">
                <button onClick={() => setView("cards")} className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs transition ${view === "cards" ? "bg-secondary text-foreground" : "text-muted-foreground"}`} aria-pressed={view === "cards"}><LayoutGrid className="h-3.5 w-3.5" />Cards</button>
                <button onClick={() => setView("noc")} className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs transition ${view === "noc" ? "bg-secondary text-foreground" : "text-muted-foreground"}`} aria-pressed={view === "noc"}><List className="h-3.5 w-3.5" />NOC</button>
              </div>
              <button onClick={exportCsv} className="flex shrink-0 items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs text-muted-foreground transition hover:text-foreground"><Download className="h-3.5 w-3.5" />CSV</button>
              <button onClick={enableNotify} className={`flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1.5 text-xs transition ${notify ? "bg-primary text-primary-foreground" : "border border-border text-muted-foreground hover:text-foreground"}`}><Bell className="h-3.5 w-3.5" />{notify ? "Alerts on" : "Alert me"}</button>
            </div>
          </div>

          {view === "cards" ? <div className="grid gap-3 py-6 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
            {filtered.map(({ s, level, matched }, index) => {
              const reading = readings[s.source];
              const incident = relevantIncidents(s, reading?.incidents ?? [])[0];
              return <article key={s.id} className={`rise group ${level !== "operational" && level !== "unknown" ? "border-l-4 " + (level === "major" ? "border-l-major" : level === "partial" ? "border-l-partial" : level === "maintenance" ? "border-l-maint" : "border-l-warn") : ""} relative overflow-hidden rounded-2xl border border-border bg-card p-5 transition duration-300 hover:-translate-y-1 hover:border-primary/40 hover:glow`} style={{ animationDelay: `${Math.min(index, 12) * 35}ms` }}>
                <div className="flex items-start justify-between gap-3">
                  <button onClick={() => setOpen(s)} className="flex min-w-0 items-center gap-3 text-left" aria-label={`Open ${s.name} details`}>
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-border bg-muted text-muted-foreground transition duration-300 group-hover:border-primary/30 group-hover:text-primary"><ServiceIcon source={s.source} /></span>
                    <span className="min-w-0"><span className="block truncate font-semibold leading-tight">{s.name}</span><span className="mt-1 block font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{s.category} · {SOURCES[s.source]?.label}</span></span>
                  </button>
                  <button aria-label={`${watch.includes(s.id) ? "Remove" : "Add"} ${s.name} ${watch.includes(s.id) ? "from" : "to"} watchlist`} aria-pressed={watch.includes(s.id)} onClick={() => toggleWatch(s.id)} className={`rounded-full p-1 transition hover:scale-110 ${watch.includes(s.id) ? "text-primary" : "text-muted-foreground/40 hover:text-foreground"}`}><Star className={`h-5 w-5 ${watch.includes(s.id) ? "fill-current" : ""}`} /></button>
                </div>
                <button onClick={() => setOpen(s)} className="mt-4 block min-h-10 w-full text-left text-sm text-muted-foreground">
                  {incident ? <span className={incident.impact === "none" ? "text-muted-foreground" : "text-foreground"}>{incident.impact !== "none" && <AlertTriangle className="mr-1 inline h-3.5 w-3.5 text-warn" />}{incident.impact === "none" ? "Provider update: " : ""}{incident.name}</span> : s.note}
                </button>
                <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
                  <StatusPill level={level} />
                  {reading?.stale && <span className="rounded-full border border-warn/25 bg-warn/10 px-2 py-0.5 font-mono text-[10px] text-warn">CACHED READING</span>}
                </div>
                <div className="mt-4 flex gap-0.5" aria-label={`${matched.length} published components`}>{matched.slice(0, 24).map((component) => <span key={component.name} title={`${component.name}: ${LEVEL_LABEL[componentLevel(component.status)]}`} className={`h-1.5 flex-1 rounded-full ${DOT[componentLevel(component.status)]}`} />)}</div>
                <div className="mt-3 flex items-center justify-between gap-3 font-mono text-[10px] text-muted-foreground">
                  <span>Synced {ago(reading?.fetchedAt, clock)}</span>
                  <span className="truncate" title={reading?.updatedAt ? `Provider page last changed ${fmt(reading.updatedAt, hydrated)}` : undefined}>{incident ? `Incident ${ago(incident.updatedAt, clock)}` : `${matched.length} comp · Provider ${ago(reading?.updatedAt, clock)}`}</span>
                </div>
              </article>;
            })}
          </div> : <div className="my-6 overflow-hidden rounded-2xl border border-border bg-card">
            <div className="hidden grid-cols-[minmax(220px,1.4fr)_100px_150px_100px_150px_40px] gap-4 border-b border-border bg-muted/40 px-4 py-2 font-mono text-[10px] uppercase tracking-wider text-muted-foreground md:grid"><span>Service</span><span>Category</span><span>Status</span><span>Parts</span><span>Last good sync</span><span /></div>
            <div className="divide-y divide-border">
              {filtered.map(({ s, level, matched }) => {
                const reading = readings[s.source];
                const incident = relevantIncidents(s, reading?.incidents ?? [])[0];
                return <div key={s.id} className="grid grid-cols-[1fr_auto] items-center gap-3 px-4 py-3 transition hover:bg-accent/50 md:grid-cols-[minmax(220px,1.4fr)_100px_150px_100px_150px_40px] md:gap-4">
                  <button onClick={() => setOpen(s)} className="flex min-w-0 items-center gap-3 text-left"><ServiceIcon source={s.source} className="h-4 w-4 shrink-0 text-muted-foreground" /><span className="min-w-0"><span className="block truncate text-sm font-medium">{s.name}</span>{incident && <span className="block truncate text-xs text-warn">{incident.name}</span>}</span></button>
                  <span className="hidden font-mono text-[10px] uppercase text-muted-foreground md:block">{s.category}</span>
                  <span className="hidden md:block"><StatusPill level={level} /></span>
                  <span className="hidden font-mono text-xs text-muted-foreground md:block">{matched.length} matched</span>
                  <span className="hidden font-mono text-xs text-muted-foreground md:block">{ago(reading?.fetchedAt, clock)}{reading?.stale ? " · cached" : ""}</span>
                  <div className="flex items-center gap-2 md:justify-end"><span className="md:hidden"><Dot level={level} /></span><button onClick={() => toggleWatch(s.id)} aria-label={`Toggle ${s.name} watchlist`} className={watch.includes(s.id) ? "text-primary" : "text-muted-foreground/40"}><Star className={`h-4 w-4 ${watch.includes(s.id) ? "fill-current" : ""}`} /></button></div>
                </div>;
              })}
            </div>
          </div>}
          {filtered.length === 0 && <div className="col-span-full my-6 rounded-2xl border border-dashed border-border p-12 text-center text-muted-foreground">{onlyWatch && watch.length === 0 ? "Star services to build your watchlist — it stays on this device unless you share its link." : "Nothing matches these filters."}</div>}
        </section>

        <section id="incidents" className="mx-auto max-w-[90rem] scroll-mt-24 px-4 py-12 sm:px-5">
          <div className="flex flex-wrap items-end justify-between gap-4"><div><div className="mb-2 flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-warn"><AlertTriangle className="h-3.5 w-3.5" /> Provider-published evidence</div><h2 className="text-3xl font-bold tracking-tight">Active incidents</h2><p className="mt-1 text-muted-foreground">Unresolved incidents published by providers, newest first.</p></div><span className="font-mono text-xs text-muted-foreground">{incidents.length} open across {Object.keys(SOURCES).length} feeds</span></div>
          <div className="mt-6 divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
            {incidents.length === 0 && <div className="flex items-center gap-3 p-6 text-muted-foreground"><Dot level="operational" />No provider is reporting an open incident right now.</div>}
            {incidents.map((incident) => <article key={`${incident.src}-${incident.id}`} className="p-5 transition hover:bg-accent/40">
              <div className="flex flex-wrap items-start gap-3">
                <a href={incident.link} target="_blank" rel="noreferrer" className="min-w-0 flex-1 rounded-md focus-visible:outline-2 focus-visible:outline-primary">
                  <span className="flex flex-wrap items-center gap-2"><span className={`rounded-full px-2 py-0.5 font-mono text-[10px] uppercase ${incident.impact === "critical" || incident.impact === "major" ? "bg-major/20 text-major" : incident.impact === "minor" ? "bg-warn/20 text-warn" : "bg-maint/20 text-maint"}`}>{incident.impact}</span><span className="font-mono text-xs text-muted-foreground">{incident.src}</span><span className="font-mono text-[11px] text-muted-foreground">{incident.status.replaceAll("_", " ")} · updated {ago(incident.updatedAt, clock)}</span></span>
                  <span className="mt-2 block font-medium hover:text-primary">{incident.name} <ArrowUpRight className="inline h-3.5 w-3.5" /></span>
                  {incident.latest && <span className="mt-1.5 block max-w-5xl text-sm leading-relaxed text-muted-foreground">{incident.latest}</span>}
                  {incident.affected.length > 0 && <span className="mt-2 flex flex-wrap gap-1">{incident.affected.map((part) => <span key={part} className="rounded bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">{part}</span>)}</span>}
                </a>
                <button onClick={() => void copyIncident(incident)} className="flex shrink-0 items-center gap-2 rounded-full border border-border px-3 py-1.5 text-xs text-muted-foreground transition hover:border-primary/50 hover:text-foreground"><Copy className="h-3.5 w-3.5" />Copy for Slack</button>
              </div>
            </article>)}
          </div>
        </section>

        {maintenanceGroups.length > 0 && <section id="maintenance" className="mx-auto max-w-[90rem] scroll-mt-24 px-4 pb-4 sm:px-5">
          <div className="mb-2 flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-maint"><Clock3 className="h-3.5 w-3.5" /> Plan around provider work</div>
          <h2 className="text-3xl font-bold tracking-tight">Scheduled maintenance</h2>
          <p className="mt-1 text-muted-foreground">Same-day regional notices are grouped. Times are shown in {hydrated ? Intl.DateTimeFormat().resolvedOptions().timeZone : "your local timezone"}; open a row for every exact source.</p>
          <div className="mt-6 space-y-3">
            {maintenanceGroups.map((group) => <details key={group.key} className="group overflow-hidden rounded-2xl border border-border bg-card transition open:border-maint/40">
              <summary className="flex cursor-pointer list-none flex-wrap items-center gap-3 p-5 transition hover:bg-accent/40 [&::-webkit-details-marker]:hidden">
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-maint/10 text-maint"><Clock3 className="h-4 w-4" /></span>
                <span className="min-w-0 flex-1"><span className="block font-semibold">{group.src}</span><span className="mt-0.5 block text-sm text-muted-foreground">{group.items.length} maintenance window{group.items.length === 1 ? "" : "s"} · {fmtDay(group.day)} UTC</span></span>
                <span className="font-mono text-xs text-maint">{group.items.length === 1 ? "VIEW WINDOW" : "GROUPED REGIONS"}</span><ChevronDown className="h-4 w-4 text-muted-foreground transition group-open:rotate-180" />
              </summary>
              <div className="divide-y divide-border border-t border-border">
                {group.items.map((maintenance) => <article key={maintenance.id} className="p-5 pl-6 sm:pl-[4.25rem]">
                  <div className="flex flex-wrap items-start justify-between gap-3"><a href={maintenance.link} target="_blank" rel="noreferrer" className="min-w-0 flex-1 font-medium hover:text-maint">{maintenance.name} <ArrowUpRight className="inline h-3.5 w-3.5" /></a><span className="font-mono text-xs text-muted-foreground">{maintenance.startsAt && maintenance.endsAt ? `${fmt(maintenance.startsAt, hydrated)} → ${fmt(maintenance.endsAt, hydrated)}` : "Window not structured · read official notice"}</span></div>
                  {maintenance.latest && <p className="mt-2 max-w-5xl text-sm leading-relaxed text-muted-foreground">{maintenance.latest}</p>}
                </article>)}
              </div>
            </details>)}
          </div>
        </section>}

        <section id="method" className="mx-auto max-w-[90rem] scroll-mt-24 px-4 py-12 sm:px-5">
          <div className="mb-2 flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-primary"><ShieldCheck className="h-3.5 w-3.5" /> Verify the signal, not just the color</div>
          <h2 className="text-3xl font-bold tracking-tight">Method, sources & feed health</h2>
          <div className="mt-6 grid gap-3 md:grid-cols-3">
            {[["Official feeds only", "Every reading comes from the provider's public Statuspage summary. Green means the published components are operational — not a synthetic uptime guarantee."], ["Component-level matching", "Scoped products inherit only incidents with matching published components. Ambiguous incidents stay in the global feed instead of painting every product red."], ["Private by default", "Stars stay in your browser until you copy a stack link. No account or tracking. Shared links contain service IDs only, never personal data."]].map(([title, description]) => <div key={title} className="rounded-2xl border border-border bg-card p-6"><h3 className="font-semibold">{title}</h3><p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p></div>)}
          </div>
          <div className="mt-6 overflow-hidden rounded-2xl border border-border bg-card">
            <div className="hidden grid-cols-[170px_1fr_150px_140px_90px] gap-4 border-b border-border bg-muted/40 px-5 py-3 font-mono text-[10px] uppercase tracking-wider text-muted-foreground md:grid"><span>Provider</span><span>Exact feed type</span><span>Last sync attempt</span><span>Last good reading</span><span>Latency</span></div>
            <div className="divide-y divide-border">
              {Object.entries(SOURCES).map(([key, source]) => {
                const reading = readings[key];
                const current = reading?.ok && !reading.stale;
                return <div key={key} className="grid gap-3 px-5 py-4 text-sm md:grid-cols-[170px_1fr_150px_140px_90px] md:items-center md:gap-4">
                  <a href={source.page} target="_blank" rel="noreferrer" className="flex items-center gap-2 font-medium hover:text-primary"><ServiceIcon source={key} className="h-4 w-4" />{source.label}<ArrowUpRight className="h-3 w-3 text-muted-foreground" /></a>
                  <a href={source.url} target="_blank" rel="noreferrer" className="font-mono text-[11px] text-muted-foreground hover:text-foreground">{FEED_FORMAT}</a>
                  <span className={`flex items-center gap-2 font-mono text-[11px] ${current ? "text-ok" : "text-warn"}`}><Dot level={current ? "operational" : "degraded"} size="h-1.5 w-1.5" />{reading?.httpStatus ? `HTTP ${reading.httpStatus}` : current ? "HTTP 200" : "Request failed"} · {ago(reading?.lastAttemptAt ?? reading?.fetchedAt, clock)}{reading?.stale ? " · cached" : ""}</span>
                  <span className="font-mono text-[11px] text-muted-foreground">{ago(reading?.fetchedAt, clock)}{reading?.error ? ` · ${reading.error}` : ""}</span>
                  <span className="font-mono text-[11px] text-muted-foreground">{reading?.ms != null ? `${reading.ms}ms` : "—"}</span>
                </div>;
              })}
            </div>
            <p className="border-t border-border px-5 py-3 text-xs leading-relaxed text-muted-foreground">HTTP status describes Signalroom’s feed fetch, not the provider’s product health. A cached reading always keeps its last successful sync time and is labeled wherever it appears.</p>
          </div>
        </section>
      </main>

      <footer className="border-t border-border py-8">
        <div className="mx-auto flex max-w-[90rem] flex-wrap justify-between gap-3 px-4 font-mono text-xs text-muted-foreground sm:px-5">
          <span>Signalroom · independent, not affiliated with any provider</span>
          <span>Shortcuts: <kbd>/</kbd> or <kbd>⌘K</kbd> command · <kbd>r</kbd> refresh · <kbd>i</kbd> issues · <kbd>w</kbd> watchlist · <kbd>n</kbd> NOC</span>
        </div>
      </footer>

      {open && <Detail s={open} r={readings[open.source]} now={clock} hydrated={hydrated} onClose={() => setOpen(null)} watched={watch.includes(open.id)} onWatch={() => toggleWatch(open.id)} onCopy={copyIncident} />}

      {commandOpen && <div className="fixed inset-0 z-50 flex items-start justify-center bg-background/75 px-4 pt-[12vh] backdrop-blur-md" onClick={() => setCommandOpen(false)}>
        <div role="dialog" aria-modal="true" aria-label="Signalroom command menu" className="command-shell w-full max-w-2xl overflow-hidden rounded-3xl border border-border bg-popover shadow-2xl" onClick={(event) => event.stopPropagation()}>
          <Command loop label="Search services and commands">
            <div className="flex items-center gap-3 border-b border-border px-5"><Search className="h-5 w-5 text-muted-foreground" /><Command.Input autoFocus placeholder="Find a service, export data, change view…" className="h-16 flex-1 bg-transparent text-base outline-none placeholder:text-muted-foreground" /><button onClick={() => setCommandOpen(false)} aria-label="Close command menu" className="rounded-full border border-border p-1.5 text-muted-foreground hover:text-foreground"><X className="h-4 w-4" /></button></div>
            <Command.List className="max-h-[58vh] overflow-y-auto p-2">
              <Command.Empty className="px-4 py-10 text-center text-sm text-muted-foreground">No matching service or command.</Command.Empty>
              <Command.Group heading="Actions">
                <Command.Item value="copy share watchlist stack link" onSelect={() => runCommand(() => void shareWatch())}><Share2 />Copy watchlist stack link<kbd>↵</kbd></Command.Item>
                <Command.Item value="export download csv spreadsheet" onSelect={() => runCommand(exportCsv)}><FileSpreadsheet />Export readings as CSV<kbd>CSV</kbd></Command.Item>
                <Command.Item value="export download json data" onSelect={() => runCommand(exportJson)}><FileJson />Export full evidence as JSON<kbd>JSON</kbd></Command.Item>
                <Command.Item value="toggle compact noc cards density view" onSelect={() => runCommand(() => setView((value) => value === "cards" ? "noc" : "cards"))}>{view === "cards" ? <List /> : <LayoutGrid />}{view === "cards" ? "Switch to compact NOC view" : "Switch to card view"}<kbd>N</kbd></Command.Item>
                <Command.Item value="show filter issues incidents only" onSelect={() => runCommand(() => setOnlyIssues((value) => !value))}><AlertTriangle />{onlyIssues ? "Show all services" : "Show issues only"}<kbd>I</kbd></Command.Item>
                <Command.Item value="enable browser watchlist notifications alerts" onSelect={() => runCommand(() => void enableNotify())}><Bell />Enable watchlist browser alerts<kbd>TAB</kbd></Command.Item>
              </Command.Group>
              <Command.Group heading="Services · select to inspect · star to watch">
                {rows.map(({ s, level }) => <Command.Item key={s.id} value={`${s.name} ${s.category} ${SOURCES[s.source]?.label} ${s.id}`} onSelect={() => runCommand(() => setOpen(s))}>
                  <ServiceIcon source={s.source} className="h-4 w-4" /><span className="min-w-0 flex-1 truncate">{s.name}</span><span className={`mr-2 flex items-center gap-1.5 text-[11px] ${TXT[level]}`}><Dot level={level} size="h-1.5 w-1.5" />{LEVEL_LABEL[level]}</span>
                  <button tabIndex={-1} aria-label={`Toggle ${s.name} watchlist`} onClick={(event) => { event.stopPropagation(); toggleWatch(s.id); }} className={`rounded p-1 ${watch.includes(s.id) ? "text-primary" : "text-muted-foreground/40"}`}><Star className={`h-4 w-4 ${watch.includes(s.id) ? "fill-current" : ""}`} /></button>
                </Command.Item>)}
              </Command.Group>
            </Command.List>
            <div className="flex items-center justify-between border-t border-border px-5 py-3 font-mono text-[10px] text-muted-foreground"><span>↑↓ navigate · ↵ select · esc close</span><span>{watch.length} starred · {sourcesCurrent}/{Object.keys(SOURCES).length} feeds current</span></div>
          </Command>
        </div>
      </div>}
    </div>
  );
}

function Detail({ s, r, now, hydrated, onClose, watched, onWatch, onCopy }: { s: Service; r: Reading | undefined; now: number; hydrated: boolean; onClose: () => void; watched: boolean; onWatch: () => void; onCopy: (incident: SourceIncident) => Promise<void> }) {
  const { level, matched } = serviceLevel(s, r);
  const incidents = r ? relevantIncidents(s, r.incidents) : [];
  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-background/70 backdrop-blur-sm" onClick={onClose}>
      <aside role="dialog" aria-modal="true" aria-labelledby="service-detail-title" onClick={(event) => event.stopPropagation()} className="h-full w-full max-w-md overflow-y-auto border-l border-border bg-popover p-6 shadow-2xl animate-in slide-in-from-right duration-300">
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">{s.category} · {SOURCES[s.source]!.label}</span>
          <button autoFocus onClick={onClose} aria-label="Close service details" className="rounded-full border border-border p-2 text-muted-foreground transition hover:text-foreground"><X className="h-4 w-4" /></button>
        </div>
        <div className="mt-6 flex items-center gap-4"><span className="grid h-14 w-14 place-items-center rounded-2xl border border-border bg-muted text-primary"><ServiceIcon source={s.source} className="h-7 w-7" /></span><h2 id="service-detail-title" className="text-3xl font-bold">{s.name}</h2></div>
        <div className="mt-4 flex flex-wrap items-center gap-2"><StatusPill level={level} />{r?.stale && <span className="rounded-full border border-warn/25 bg-warn/10 px-2 py-1 text-xs text-warn">Last good reading</span>}</div>
        {r?.description && <p className="mt-3 text-sm leading-relaxed text-muted-foreground">Provider headline: “{r.description}”</p>}
        {r?.error && <p className="mt-2 text-sm text-warn">Latest feed attempt: {r.error}. The displayed health data is from the last successful sync.</p>}
        <div className="mt-6 grid grid-cols-2 gap-2 text-xs">
          <div className="rounded-xl border border-border bg-card p-3"><span className="block font-mono text-[10px] uppercase text-muted-foreground">Last good sync</span><span className="mt-1 block">{ago(r?.fetchedAt, now)}</span><span className="mt-1 block text-muted-foreground">{fmt(r?.fetchedAt, hydrated)}</span></div>
          <div className="rounded-xl border border-border bg-card p-3"><span className="block font-mono text-[10px] uppercase text-muted-foreground">Provider page changed</span><span className="mt-1 block">{ago(r?.updatedAt, now)}</span><span className="mt-1 block text-muted-foreground">{r?.updatedAt ? fmt(r.updatedAt, hydrated) : "Not published"}</span></div>
        </div>
        <div className="mt-4 rounded-xl border border-border bg-card p-4"><p className="font-mono text-[11px] uppercase text-primary">Before you blame the provider</p><p className="mt-1 text-sm leading-relaxed">{s.tip}</p></div>
        <h3 className="mt-6 font-semibold">Matched components ({matched.length})</h3>
        <p className="mt-1 text-xs text-muted-foreground">Only these published parts determine this service’s component reading.</p>
        <ul className="mt-3 divide-y divide-border rounded-xl border border-border">
          {matched.map((component) => { const componentStatus = componentLevel(component.status); return <li key={component.name} className="flex items-center justify-between gap-3 px-4 py-2.5 text-sm"><span>{component.name}</span><span className={`flex shrink-0 items-center gap-2 ${TXT[componentStatus]}`}><Dot level={componentStatus} size="h-2 w-2" />{LEVEL_LABEL[componentStatus]}</span></li>; })}
          {matched.length === 0 && <li className="px-4 py-3 text-sm text-muted-foreground">No matching components published.</li>}
        </ul>
        {incidents.length > 0 && <><h3 className="mt-6 font-semibold">Open incidents affecting {s.name}</h3>{incidents.map((incident) => <article key={incident.id} className="mt-2 rounded-xl border border-border p-4 text-sm"><a href={incident.link} target="_blank" rel="noreferrer" className="font-medium hover:text-primary">{incident.name} <ArrowUpRight className="inline h-3.5 w-3.5" /></a>{incident.latest && <p className="mt-2 leading-relaxed text-muted-foreground">{incident.latest}</p>}<p className="mt-2 font-mono text-[11px] text-muted-foreground">{incident.impact} · {incident.status.replaceAll("_", " ")} · updated {ago(incident.updatedAt, now)}</p><button onClick={() => void onCopy({ ...incident, src: SOURCES[s.source]!.label })} className="mt-3 flex items-center gap-2 rounded-full border border-border px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground"><Copy className="h-3.5 w-3.5" />Copy for Slack</button></article>)}</>}
        <div className="mt-6 flex gap-2">
          <button onClick={onWatch} className="flex flex-1 items-center justify-center gap-2 rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground"><Star className={`h-4 w-4 ${watched ? "fill-current" : ""}`} />{watched ? "Watching" : "Add to watchlist"}</button>
          <a href={SOURCES[s.source]!.page} target="_blank" rel="noreferrer" className="flex flex-1 items-center justify-center gap-2 rounded-full border border-border px-4 py-2.5 text-center text-sm transition hover:border-primary/50">Official page<ArrowUpRight className="h-4 w-4" /></a>
        </div>
        <div className="mt-4 flex items-start gap-2 font-mono text-[11px] leading-relaxed text-muted-foreground"><Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-ok" /><span>Synced {ago(r?.fetchedAt, now)}{r?.ms != null ? ` in ${r.ms}ms` : ""}. Provider page last changed {ago(r?.updatedAt, now)}.{r?.stale ? " Cached data is shown because the latest attempt failed." : ""}</span></div>
      </aside>
    </div>
  );
}
