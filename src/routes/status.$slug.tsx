import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { getSourceReading, getSourceHistory } from "@/lib/status.functions";
import { LEVEL_LABEL, SOURCES, relevantIncidents, serviceLevel, componentLevel, componentLabel, historyFor, historyStats, incidentMinutes, fmtDuration, type Level, type Service, type PastIncident } from "@/lib/services";
import { STATUS_PAGES, statusPage } from "@/lib/status-pages";
import { OfferSlot } from "@/components/OfferSlot";
import { PASSWORD_MANAGER_PAGES } from "@/monetize.config";

const readingQuery = (source: string) => queryOptions({ queryKey: ["reading", source], queryFn: () => getSourceReading({ data: { source } }), refetchInterval: 60_000, staleTime: 30_000 });
const historyQuery = (source: string) => queryOptions({ queryKey: ["history", source], queryFn: () => getSourceHistory({ data: { source } }), staleTime: 600_000 });
const day = (iso?: string) => (iso ? new Date(iso).toLocaleDateString("en-GB", { timeZone: "UTC", day: "numeric", month: "short", year: "numeric" }) : "—");

/** Per-page history summary, shared by head() and the page so both say the same thing. */
function summarize(svc: Service, h: { ok: boolean; fetchedAt: string; items: PastIncident[] }) {
  const { items, unscoped } = historyFor(svc, h.ok ? h.items : []);
  return { ok: h.ok, unscoped, items, stats: historyStats(items, Date.parse(h.fetchedAt)) };
}

export const Route = createFileRoute("/status/$slug")({
  loader: async ({ params, context }) => {
    const svc = statusPage(params.slug);
    if (!svc) throw notFound();
    const [, h] = await Promise.all([context.queryClient.ensureQueryData(readingQuery(svc.source)), context.queryClient.ensureQueryData(historyQuery(svc.source))]);
    const { ok, stats } = summarize(svc, h);
    const last = ok && stats.last ? { date: day(stats.last.startedAt), last90: stats.last90 } : null;
    return { slug: svc.id, last };
  },
  head: ({ loaderData }) => {
    const svc = loaderData ? statusPage(loaderData.slug) : undefined;
    if (!svc) return { meta: [{ title: "Service not found | Signalroom" }, { name: "robots", content: "noindex" }] };
    const src = SOURCES[svc.source]!;
    const last = loaderData?.last;
    const t = `Is ${svc.name} down? Live status & outage history | Signalroom`;
    const d = last
      ? `Is ${svc.name} down right now? Live from ${src.label}'s official status feed, refreshed every minute. Last incident ${last.date}; ${last.last90} in the past 90 days, with durations.`
      : `Is ${svc.name} down right now? Live reading from ${src.label}'s official status feed, refreshed every minute, with active incidents, affected components and what to try next.`;
    return { meta: [{ title: t }, { name: "description", content: d }, { property: "og:title", content: `Is ${svc.name} down?` }, { property: "og:description", content: d }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] };
  },
  notFoundComponent: () => <main className="mx-auto max-w-xl px-5 py-32 text-center"><h1 className="text-4xl font-bold">Service not tracked</h1><Link to="/" className="mt-6 inline-block text-primary">← Back to the status board</Link></main>,
  component: StatusPage,
});

const TONE: Record<Level, string> = { operational: "text-ok", degraded: "text-warn", partial: "text-partial", major: "text-major", maintenance: "text-maint", unknown: "text-unknown" };
const fmt = (iso?: string) => (iso ? new Date(iso).toUTCString().replace(" GMT", " UTC") : "—");

function verdict(svc: Service, level: Level, label: string): string {
  if (level === "operational") return `No. ${svc.name} is operational according to ${label}'s official status page, with no active incident affecting it.`;
  if (level === "maintenance") return `${svc.name} is under scheduled maintenance according to ${label}'s official status page. Some features may be briefly unavailable.`;
  if (level === "unknown") return `We could not get a current reading for ${svc.name} from ${label}'s official status feed. Check the official page linked below.`;
  return `Yes, ${label} reports a problem: ${LEVEL_LABEL[level].toLowerCase()} affecting ${svc.name}. Details of the incident are below.`;
}

function StatusPage() {
  const { slug } = Route.useLoaderData();
  const svc = statusPage(slug)!;
  const src = SOURCES[svc.source]!;
  const { data: r } = useSuspenseQuery(readingQuery(svc.source));
  const { data: h } = useSuspenseQuery(historyQuery(svc.source));
  const hist = summarize(svc, h);
  const st = hist.stats;
  const who = hist.unscoped ? src.label : svc.name;
  const { level, matched } = serviceLevel(svc, r);
  const incidents = r.ok ? relevantIncidents(svc, r.incidents) : [];
  const maint = r.ok ? relevantIncidents(svc, r.maintenances).slice(0, 5) : [];
  const answer = verdict(svc, level, src.label);
  const siblings = STATUS_PAGES.filter((s) => s.id !== svc.id && (s.source === svc.source || s.category === svc.category)).slice(0, 12);
  const faq = [
    { q: `Is ${svc.name} down right now?`, a: `This page shows a live reading from ${src.label}'s official status feed (${src.page}), refreshed every minute. If it says operational but ${svc.name} fails for you, the problem is likely local to your account, network or region.` },
    { q: `Why is ${svc.name} not working for me if the status is operational?`, a: svc.tip },
    { q: `Where is the official ${svc.name} status page?`, a: `${src.label} publishes status at ${src.page}. Signalroom reads its public Statuspage feed and links every incident back to the original.` },
    { q: `What does ${svc.name} cover on this page?`, a: svc.components?.length ? `${svc.note}. Signalroom tracks these official components: ${svc.components.map(componentLabel).join(", ")}.` : `${svc.note}. All components on ${src.label}'s status page are included.` },
    ...(hist.ok && st.last ? [
      { q: `When was the last ${svc.name} outage?`, a: `The most recent ${who} incident on ${src.label}'s status page started ${day(st.last.startedAt)}: "${st.last.name}" (impact: ${st.last.impact}${incidentMinutes(st.last) !== undefined ? `, resolved after ${fmtDuration(incidentMinutes(st.last)!)}` : st.last.resolvedAt ? "" : ", not yet resolved"}).${hist.unscoped ? ` ${src.label}'s feed does not say which products each incident affected, so this may not have involved ${svc.name}.` : ""}` },
      { q: `How often does ${svc.name} go down?`, a: `${src.label} published ${st.last90} ${who} incident${st.last90 === 1 ? "" : "s"} in the past 90 days and ${st.last30} in the past 30. Across the ${st.total} most recent (since ${day(st.since)}), ${st.major} had major or critical impact${st.medianMinutes !== undefined ? ` and the median time to resolution was ${fmtDuration(st.medianMinutes)}` : ""}. Most incidents are partial, affecting one feature or region rather than the whole service.` },
    ] : []),
    { q: `Does Signalroom test ${svc.name} itself?`, a: `No. Signalroom does not run synthetic probes or collect user reports. It only shows what ${src.label} publishes, so an outage appears here once the provider acknowledges it.` },
  ];
  const ld = JSON.stringify({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faq.map((x) => ({ "@type": "Question", name: x.q, acceptedAnswer: { "@type": "Answer", text: x.a } })) }).replace(/</g, "\\u003c");
  return (
    <main className="mx-auto max-w-4xl px-5 py-10">
      <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4" />All services</Link>
      <p className="mt-8 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">{svc.category} · live status</p>
      <h1 className="mt-2 text-4xl font-bold tracking-tight md:text-6xl">Is {svc.name} down?</h1>
      <section className="mt-8 rounded-2xl border border-border bg-card p-6" aria-live="polite">
        <p className={`font-mono text-sm font-semibold uppercase ${TONE[level]}`}>{LEVEL_LABEL[level]}{r.stale ? " · cached reading" : ""}</p>
        <p className="mt-3 text-xl leading-relaxed">{answer}</p>
        <p className="mt-4 font-mono text-xs text-muted-foreground">Checked {fmt(r.lastAttemptAt ?? r.fetchedAt)} · provider updated {fmt(r.updatedAt)} · source <a href={src.page} target="_blank" rel="noreferrer" className="underline-offset-4 hover:underline">{src.label} status <ArrowUpRight className="inline h-3 w-3" /></a></p>
      </section>

      <section className="mt-10"><h2 className="text-2xl font-bold">Active {svc.name} incidents</h2>
        {incidents.length ? <ul className="mt-4 space-y-3">{incidents.map((i) => <li key={i.id} className="rounded-xl border border-border p-4"><a href={i.link} target="_blank" rel="noreferrer" className="font-semibold hover:text-primary">{i.name} <ArrowUpRight className="inline h-3 w-3" /></a><p className="mt-1 font-mono text-[11px] text-muted-foreground">{i.status} · impact {i.impact} · updated {fmt(i.updatedAt)}</p>{i.latest && <p className="mt-2 text-sm text-muted-foreground">{i.latest}</p>}</li>)}</ul>
          : <p className="mt-3 text-muted-foreground">No unresolved incidents affecting {svc.name} are published right now.</p>}
      </section>

      {matched.length > 0 && <section className="mt-10"><h2 className="text-2xl font-bold">{svc.name} components</h2>
        <div className="mt-4 overflow-x-auto rounded-xl border border-border"><table className="w-full text-sm"><thead><tr className="text-left font-mono text-[11px] uppercase text-muted-foreground"><th className="p-3">Component</th><th className="p-3">Status</th></tr></thead>
          <tbody>{matched.slice(0, 40).map((c) => { const l = componentLevel(c.status); return <tr key={c.name} className="border-t border-border"><td className="p-3">{componentLabel(c.name)}</td><td className={`p-3 font-medium ${TONE[l]}`}>{LEVEL_LABEL[l]}</td></tr>; })}</tbody></table></div></section>}

      {maint.length > 0 && <section className="mt-10"><h2 className="text-2xl font-bold">Scheduled maintenance</h2><ul className="mt-4 space-y-2 text-sm">{maint.map((m) => <li key={m.id}><a href={m.link} target="_blank" rel="noreferrer" className="hover:text-primary">{m.name}</a> <span className="font-mono text-[11px] text-muted-foreground">{fmt(m.startsAt)} → {fmt(m.endsAt)}</span></li>)}</ul></section>}

      {hist.ok && <section className="mt-10"><h2 className="text-2xl font-bold">{svc.name} outage history</h2>
        {st.total ? <>
          <p className="mt-2 text-sm text-muted-foreground">From {src.label}'s published incident history: the {st.total} most recent {who} incidents, back to {day(st.since)}.{hist.unscoped ? ` ${src.label}'s feed does not say which products each incident affected, so these cover all of ${src.label}, not only ${svc.name}.` : ""}</p>
          <dl className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
            <div className="rounded-xl border border-border p-4"><dt className="font-mono text-[11px] uppercase text-muted-foreground">Last incident</dt><dd className="mt-1 text-lg font-semibold">{day(st.last?.startedAt)}</dd></div>
            <div className="rounded-xl border border-border p-4"><dt className="font-mono text-[11px] uppercase text-muted-foreground">Past 30 days</dt><dd className="mt-1 text-lg font-semibold">{st.last30}</dd></div>
            <div className="rounded-xl border border-border p-4"><dt className="font-mono text-[11px] uppercase text-muted-foreground">Past 90 days</dt><dd className="mt-1 text-lg font-semibold">{st.last90}</dd></div>
            <div className="rounded-xl border border-border p-4"><dt className="font-mono text-[11px] uppercase text-muted-foreground">Median fix time</dt><dd className="mt-1 text-lg font-semibold">{st.medianMinutes !== undefined ? fmtDuration(st.medianMinutes) : "—"}</dd></div>
          </dl>
          <div className="mt-4 overflow-x-auto rounded-xl border border-border"><table className="w-full text-sm"><thead><tr className="text-left font-mono text-[11px] uppercase text-muted-foreground"><th className="p-3">Started (UTC)</th><th className="p-3">Incident</th><th className="p-3">Impact</th><th className="p-3">Duration</th></tr></thead>
            <tbody>{hist.items.slice(0, 15).map((i) => { const m = incidentMinutes(i); return <tr key={i.id} className="border-t border-border align-top"><td className="whitespace-nowrap p-3 font-mono text-xs">{day(i.startedAt)}</td><td className="p-3"><a href={i.link} target="_blank" rel="noreferrer" className="hover:text-primary">{i.name}</a></td><td className="p-3 capitalize">{i.impact}</td><td className="whitespace-nowrap p-3">{m !== undefined ? fmtDuration(m) : i.resolvedAt ? "—" : "ongoing"}</td></tr>; })}</tbody></table></div>
        </> : <p className="mt-3 text-muted-foreground">{src.label}'s published history (its {h.items.length} most recent incidents) contains none that affected {svc.name}.</p>}
      </section>}

      <section className="mt-10"><h2 className="text-2xl font-bold">{svc.name} not working? What to try</h2>
        <ol className="mt-4 list-decimal space-y-2 pl-5 text-muted-foreground"><li>{svc.tip}</li><li>Open the official <a href={src.page} target="_blank" rel="noreferrer" className="text-primary">{src.label} status page</a> for the full incident history.</li><li>Try another network or device to rule out a local connection or DNS issue.</li><li>Sign out and back in, or clear the app cache, if only your account is affected.</li></ol>
      </section>

      {PASSWORD_MANAGER_PAGES.has(svc.id) && <OfferSlot id="password-manager" context={svc.name} />}

      <section className="mt-10"><h2 className="text-2xl font-bold">Frequently asked questions</h2>
        <div className="mt-4 divide-y divide-border rounded-xl border border-border">{faq.map((x) => <div key={x.q} className="p-5"><h3 className="font-semibold">{x.q}</h3><p className="mt-2 leading-relaxed text-muted-foreground">{x.a}</p></div>)}</div>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: ld }} />
      </section>

      {siblings.length > 0 && <section className="mt-10"><h2 className="text-2xl font-bold">Related status pages</h2>
        <div className="mt-4 flex flex-wrap gap-2">{siblings.map((s) => <Link key={s.id} to="/status/$slug" params={{ slug: s.id }} className="rounded-full border border-border px-3 py-1.5 text-sm hover:border-primary">Is {s.name} down?</Link>)}</div></section>}
    </main>
  );
}
