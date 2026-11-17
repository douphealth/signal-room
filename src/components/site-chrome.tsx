import type { ReactNode } from "react";

export function SiteChrome({
  current,
  children,
}: {
  current?: "board" | "services";
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-5">
          <a
            href="/"
            className="flex shrink-0 items-center gap-2 text-lg font-bold tracking-tight"
            aria-label="Signalroom home"
          >
            <svg
              viewBox="0 0 38 38"
              className="h-7 w-7 text-primary"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M4 21h6l5-10 7 18 5-11h7"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            signalroom<span className="text-primary">.</span>
          </a>
          <nav
            className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground"
            aria-label="Main navigation"
          >
            <a
              href="/"
              className="hover:text-foreground"
              {...(current === "board" ? { "aria-current": "page" as const } : {})}
            >
              Board
            </a>
            <a
              href="/services"
              className="hover:text-foreground"
              {...(current === "services" ? { "aria-current": "page" as const } : {})}
            >
              Services
            </a>
            <a href="/#incidents" className="hover:text-foreground">
              Incidents
            </a>
            <a href="/#method" className="hover:text-foreground">
              Feed health
            </a>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-5">{children}</main>
      <footer className="border-t border-border py-8">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-x-4 gap-y-2 px-4 font-mono text-xs text-muted-foreground sm:px-5">
          <a href="/" className="hover:text-foreground">
            Board
          </a>
          <a href="/services" className="hover:text-foreground">
            Services
          </a>
          <span>Signalroom · independent, not affiliated with any provider</span>
        </div>
      </footer>
    </div>
  );
}

export function Breadcrumbs({ items }: { items: Array<{ label: string; href?: string }> }) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
      <ol className="flex flex-wrap items-center gap-2">
        {items.map((item, index) => (
          <li key={`${item.label}-${index}`} className="flex items-center gap-2">
            {index > 0 && <span aria-hidden="true">/</span>}
            {item.href ? (
              <a href={item.href} className="hover:text-foreground">
                {item.label}
              </a>
            ) : (
              <span aria-current="page" className="text-foreground">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
