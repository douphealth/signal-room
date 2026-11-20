import { describe, expect, it } from "vitest";
import { SERVICES, SOURCES, relevantIncidents, serviceLevel, type Reading, type Incident } from "@/lib/services";
import publishedComponents from "./provider-components.fixture.json";

const newProviders = ["cursor", "deepgram", "netlify", "flyio", "planetscale", "upstash", "clerk", "sentry", "npm", "docker", "circleci", "bitbucket", "linear", "jira", "confluence", "trello", "asana", "zoom", "dropbox", "twilio", "resend", "mailgun", "cloudinary", "webflow", "zapier", "plaid", "mongodb", "reddit", "pinecone", "replit"];

describe("expanded verified provider catalogue", () => {
  it.each(newProviders)("offers %s with its official HTTPS summary feed", (key) => {
    const source = SOURCES[key];
    expect(source).toBeDefined();
    expect(source?.page).toMatch(/^https:\/\//);
    expect(source?.url).toBe(`${source?.page}api/v2/summary.json`);
    expect(SERVICES.some((service) => service.source === key)).toBe(true);
  });

  it("preserves unique shareable service IDs and valid provider references", () => {
    expect(new Set(SERVICES.map((service) => service.id)).size).toBe(SERVICES.length);
    for (const service of SERVICES) expect(SOURCES[service.source]).toBeDefined();
    expect(SERVICES).toHaveLength(117);
    expect(Object.keys(SOURCES)).toHaveLength(89);
  });

  const fixtures: Record<string, string[]> = publishedComponents;
  const scoped = SERVICES.filter((service) => fixtures[service.source] && service.components);
  it.each(scoped)("uses exact published components for $name", (service) => {
    const names = fixtures[service.source] ?? [];
    for (const component of service.components ?? []) expect(names).toContain(component);
    const reading: Reading = {
      ok: true, fetchedAt: "2026-11-17T07:58:00Z",
      components: names.map((name) => ({ name, status: "operational" })),
      incidents: [], maintenances: [],
    };
    expect(serviceLevel(service, reading).matched.length).toBeGreaterThan(0);
    expect(serviceLevel(service, reading).level).toBe("operational");
    expect(serviceLevel(service, { ...reading, components: [] }).level).toBe("unknown");
  });

  it("does not attribute Zoom Phone incidents to Zoom Meetings", () => {
    const meetings = SERVICES.find((service) => service.id === "zoom-meetings");
    if (!meetings) throw new Error("Zoom Meetings is missing");
    const incident: Incident = { id: "phone", name: "Phone unavailable", impact: "major", status: "investigating", updatedAt: "2026-11-17T07:58:00Z", link: "https://www.zoomstatus.com/incidents/phone", affected: ["Zoom Phone"] };
    expect(relevantIncidents(meetings, [incident])).toEqual([]);
    expect(relevantIncidents(meetings, [{ ...incident, affected: ["Zoom Meetings"] }])).toHaveLength(1);
  });
});