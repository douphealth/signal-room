import { SERVICES, SOURCES, type Category, type Service } from "@/lib/services";

/** One indexable "Is X down?" page per tracked service, plus one per provider feed that has no service entry. */
const CAT: Record<string, Category> = {
  cursor: "AI", deepgram: "AI", pinecone: "AI", replit: "AI",
  linear: "Work", jira: "Work", confluence: "Work", trello: "Work", asana: "Work", zoom: "Work", dropbox: "Work", zapier: "Work", reddit: "Work", webflow: "Design",
  plaid: "Commerce",
};
const used = new Set(SERVICES.map((s) => s.source));
const extra: Service[] = Object.entries(SOURCES).filter(([k]) => !used.has(k)).map(([k, s]) => ({
  id: k, name: s.label, category: CAT[k] ?? "Developer", mark: s.label.slice(0, 2).toUpperCase(), source: k,
  note: `${s.label} platform status as published on its official status page`,
  tip: `Check whether the problem is limited to your account, region or network before assuming a ${s.label} outage, and compare with the official component list below.`,
}));
export const STATUS_PAGES: Service[] = [...SERVICES, ...extra];
export const statusPage = (slug: string) => STATUS_PAGES.find((s) => s.id === slug);
