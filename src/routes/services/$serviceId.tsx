import { createFileRoute, notFound } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowUpRight, RefreshCw } from "lucide-react";
import { ServiceIcon } from "@/components/service-icon";
import { Breadcrumbs, SiteChrome } from "@/components/site-chrome";
import { readingsQuery } from "@/lib/readings";
import {
  FEED_FORMAT,
  LEVEL_LABEL,
  SOURCES,
  componentLevel,
  relevantIncidents,
  serviceLevel,
  type Level,
} from "@/lib/services";
import {
  getService,
  providerLabel,
  relatedServices,
  serviceDescription,
  servicePageMeta,
  servicePath,
  trackedComponentNames,
  notFoundPageMeta,
} from "@/lib/site";

const TXT: Record<Level, string> = {
  operational: "text-ok",
  degraded: "text-warn",
  partial: "text-partial",
  major: "text-major",
  maintenance: "text-maint",
  unknown: "text-unknown",
};
const DOT: Record<Level, string> = {
  operational: "bg-ok",
  degraded: "bg-warn",
  partial: "bg-partial",
  major: "bg-major",
  maintenance: "bg-maint",
  unknown: "bg-unknown",
};

export const Route = createFileRoute("/services/$serviceId")({
  beforeLoad: ({ params }) => {
    if (!getService(params.serviceId)) throw notFound();
  },
  loader: ({ context }) => context.queryClient.ensureQueryData(readingsQuery),
  head: ({ params, loaderData, match }) => {
    const service = getService(params.serviceId);
    if (!service) return notFoundPageMeta(match.pathname);
    return servicePageMeta(service, loaderData?.[service.source]);
  },
  headers: ({ params }) => ({
    "X-Robots-Tag": getService(params.serviceId) ? "index, follow" : "noindex, follow",
  }),
  component: ServicePage,
});

function utc(iso: string | undefined) {
  if (!iso || !Number.isFinite(Date.parse(iso))) return "Time not published";
  return `${new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit", timeZone: "UTC" }).format(new Date(iso))} UTC`;
}

function ServicePage() {
  const { serviceId } = Route.useParams();
  const service = getService(serviceId);
  const { data: readings, refetch, isFetching } = useSuspenseQuery(readingsQuery);
  if (!service) return null;
  const reading = readings[service.source];
  const source = SOURCES[service.source];
  const { level, matched } = serviceLevel(service, reading);
  const names = trackedComponentNames(service, reading);
  const statusByName = new Map(matched.map((component) => [component.name, component.status]));
  const incidents = reading ? relevantIncidents(service, reading.incidents) : [];
  const maintenance = reading ? relevantIncidents(service, reading.maintenances) : [];
  const related = relatedServices(service);

  return (
    <SiteChrome current="services">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Services", href: "/services" },
          { label: service.name },
        ]}
      />
      <div className="mt-6 flex flex-wrap items-start justify-between gap-4">
        <div className="flex min-w-0 items-center gap-4">
          <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl border border-border bg-muted text-primary">
            <ServiceIcon source={service.source} className="h-7 w-7" />
          </span>
          <div>
            <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
              {service.category} · {providerLabel(service)}
            </p>
            <h1 className="mt-1 text-4xl font-bold tracking-tight">{service.name} status</h1>
          </div>
        </div>
        <button
          onClick={() => void refetch()}
          className="flex items-center gap-2 rounded-full border border-border px-3 py-1.5 font-mono text-xs text-muted-foreground transition hover:border-primary hover:text-foreground"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${isFetching ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>
      <p className="mt-5 max-w-3xl text-base leading-relaxed text-muted-foreground md:text-lg">
        {serviceDescription(service)} The current reading is the provider's published status, not a
        synthetic uptime percentage.
      </p>
      <p className="mt-4">
        <StatusLabel level={level} />
        {reading?.stale && (
          <span className="ml-2 rounded-full border border-warn/25 bg-warn/10 px-2 py-1 text-xs text-warn">
            Last good reading
          </span>
        )}
      </p>

      <section className="mt-8 rounded-2xl border border-border bg-card p-5">
        <h2 className="text-xl font-semibold">Current reading</h2>
        <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
          <div>
            <dt className="font-mono text-[10px] uppercase text-muted-foreground">Status</dt>
            <dd className="mt-1">{LEVEL_LABEL[level]}</dd>
          </div>
          <div>
            <dt className="font-mono text-[10px] uppercase text-muted-foreground">
              Last good sync
            </dt>
            <dd className="mt-1">{utc(reading?.fetchedAt)}</dd>
          </div>
          <div>
            <dt className="font-mono text-[10px] uppercase text-muted-foreground">
              Provider page changed
            </dt>
            <dd className="mt-1">
              {reading?.updatedAt ? utc(reading.updatedAt) : "Not published"}
            </dd>
          </div>
          <div>
            <dt className="font-mono text-[10px] uppercase text-muted-foreground">Feed</dt>
            <dd className="mt-1">{source ? FEED_FORMAT : "Not published"}</dd>
          </div>
        </dl>
        {reading?.description && (
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            Provider headline: “{reading.description}”
          </p>
        )}
        {reading?.error && (
          <p className="mt-3 text-sm text-warn">
            Latest feed attempt: {reading.error}. The displayed health data is from the last
            successful sync.
          </p>
        )}
        {!reading?.ok && !reading?.stale && (
          <p className="mt-3 text-sm text-muted-foreground">
            No reading is available from the latest feed attempt.
          </p>
        )}
        {source && (
          <p className="mt-4 flex flex-wrap gap-4 text-sm">
            <a
              href={source.page}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 hover:text-primary"
            >
              {source.label} status page <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
            <a
              href={source.url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 font-mono text-xs text-muted-foreground hover:text-foreground"
            >
              {FEED_FORMAT} <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          </p>
        )}
      </section>

      <section className="mt-6">
        <h2 className="text-xl font-semibold">
          {service.components?.length
            ? "Components that determine this reading"
            : "Published components"}
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          {service.components?.length
            ? "Only these published parts determine this service’s component reading."
            : `This service follows every component published on the ${providerLabel(service)} status feed.`}
        </p>
        {names.length > 0 ? (
          <ul className="mt-4 divide-y divide-border rounded-2xl border border-border">
            {names.map((name) => {
              const status = statusByName.get(name);
              const componentStatus = status ? componentLevel(status) : "unknown";
              return (
                <li
                  key={name}
                  className="flex items-center justify-between gap-3 px-4 py-2.5 text-sm"
                >
                  <span>{name}</span>
                  <span className={`flex shrink-0 items-center gap-2 ${TXT[componentStatus]}`}>
                    <span className={`inline-block h-2 w-2 rounded-full ${DOT[componentStatus]}`} />
                    {LEVEL_LABEL[componentStatus]}
                  </span>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="mt-4 text-sm text-muted-foreground">
            No matching components are published in the latest reading.
          </p>
        )}
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-semibold">Open incidents affecting {service.name}</h2>
        {incidents.length === 0 ? (
          <p className="mt-3 text-sm text-muted-foreground">
            No open incident on this feed matches {service.name}.
          </p>
        ) : (
          <div className="mt-4 space-y-3">
            {incidents.map((incident) => (
              <article
                key={incident.id}
                className="rounded-2xl border border-border bg-card p-4 text-sm"
              >
                <a
                  href={incident.link}
                  target="_blank"
                  rel="noreferrer"
                  className="font-medium hover:text-primary"
                >
                  {incident.name} <ArrowUpRight className="inline h-3.5 w-3.5" />
                </a>
                {incident.latest && (
                  <p className="mt-2 leading-relaxed text-muted-foreground">{incident.latest}</p>
                )}
                <p className="mt-2 font-mono text-[11px] text-muted-foreground">
                  {incident.impact} · {incident.status.replaceAll("_", " ")} · updated{" "}
                  {utc(incident.updatedAt)}
                </p>
              </article>
            ))}
          </div>
        )}
        <p className="mt-3 text-sm">
          <a
            href="/#incidents"
            className="text-muted-foreground underline decoration-border underline-offset-4 hover:text-foreground"
          >
            All active incidents on the board
          </a>
        </p>
      </section>

      {maintenance.length > 0 && (
        <section className="mt-8">
          <h2 className="text-xl font-semibold">Scheduled maintenance</h2>
          <div className="mt-4 space-y-3">
            {maintenance.map((item) => (
              <article
                key={item.id}
                className="rounded-2xl border border-border bg-card p-4 text-sm"
              >
                <a
                  href={item.link}
                  target="_blank"
                  rel="noreferrer"
                  className="font-medium hover:text-maint"
                >
                  {item.name} <ArrowUpRight className="inline h-3.5 w-3.5" />
                </a>
                <p className="mt-2 font-mono text-[11px] text-muted-foreground">
                  {item.startsAt && item.endsAt
                    ? `${utc(item.startsAt)} → ${utc(item.endsAt)}`
                    : "Window not structured · read official notice"}
                </p>
              </article>
            ))}
          </div>
        </section>
      )}

      <section className="mt-8 rounded-2xl border border-border bg-card p-5">
        <h2 className="text-xl font-semibold">Before you blame the provider</h2>
        <p className="mt-2 text-sm leading-relaxed">{service.tip}</p>
      </section>

      {related.length > 0 && (
        <section className="mt-8">
          <h2 className="text-xl font-semibold">
            Other services on the {providerLabel(service)} feed
          </h2>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {related.map((item) => (
              <li key={item.id}>
                <a
                  href={servicePath(item.id)}
                  className="block rounded-xl border border-border px-4 py-3 text-sm hover:border-primary/40"
                >
                  <span className="font-medium">{item.name}</span>
                  <span className="mt-1 block text-muted-foreground">{item.note}</span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}
    </SiteChrome>
  );
}

function StatusLabel({ level }: { level: Level }) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border border-border px-2.5 py-1 text-xs font-semibold ${TXT[level]}`}
    >
      <span className={`inline-block h-1.5 w-1.5 rounded-full ${DOT[level]}`} />
      {LEVEL_LABEL[level]}
    </span>
  );
}
