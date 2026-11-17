import { createFileRoute } from "@tanstack/react-router";
import { ServiceIcon } from "@/components/service-icon";
import { Breadcrumbs, SiteChrome } from "@/components/site-chrome";
import { SERVICES, SOURCES, type Category } from "@/lib/services";
import { SERVICES_DESCRIPTION, providerLabel, servicePath, servicesPageMeta } from "@/lib/site";

const CATEGORIES: Category[] = ["AI", "Developer", "Design", "Work", "Commerce"];

export const Route = createFileRoute("/services/")({
  head: () => servicesPageMeta(),
  headers: () => ({ "X-Robots-Tag": "index, follow" }),
  component: ServicesPage,
});

function ServicesPage() {
  const providers = Object.keys(SOURCES).length;
  return (
    <SiteChrome current="services">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Services" }]} />
      <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl">Services</h1>
      <p className="mt-4 max-w-3xl text-base text-muted-foreground md:text-lg">
        {SERVICES_DESCRIPTION} The catalogue currently lists {SERVICES.length} services from{" "}
        {providers} official feeds.
      </p>
      <div className="mt-10 space-y-10">
        {CATEGORIES.map((category) => {
          const services = SERVICES.filter((service) => service.category === category).sort(
            (a, b) => a.name.localeCompare(b.name),
          );
          if (services.length === 0) return null;
          return (
            <section key={category} aria-labelledby={`category-${category}`}>
              <h2 id={`category-${category}`} className="text-2xl font-bold tracking-tight">
                {category}
              </h2>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {services.map((service) => (
                  <li key={service.id}>
                    <a
                      href={servicePath(service.id)}
                      className="flex h-full gap-3 rounded-2xl border border-border bg-card p-4 transition hover:border-primary/40"
                    >
                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-border bg-muted text-muted-foreground">
                        <ServiceIcon source={service.source} />
                      </span>
                      <span className="min-w-0">
                        <span className="block font-semibold">{service.name}</span>
                        <span className="mt-1 block text-sm text-muted-foreground">
                          {service.note}
                        </span>
                        <span className="mt-2 block font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                          {providerLabel(service)}
                        </span>
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </SiteChrome>
  );
}
