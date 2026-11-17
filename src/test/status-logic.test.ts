import { describe, expect, it } from "vitest";
import {
  SERVICES,
  groupMaintenances,
  incidentUrl,
  parseMaintenanceWindow,
  relevantIncidents,
  serviceLevel,
  type Incident,
  type Reading,
  type SourceIncident,
} from "@/lib/services";

const incident: Incident = {
  id: "01M7M28VB7RPQ89T93T9T1SBZ2",
  name: "‘Project not specified’ errors reported for users in ap-northeast-2",
  impact: "minor",
  status: "investigating",
  updatedAt: "2026-11-17T06:14:23Z",
  link: "",
  affected: [],
};

const reading: Reading = {
  ok: true,
  fetchedAt: "2026-11-17T06:30:00Z",
  components: [{ name: "Database", status: "operational" }],
  incidents: [incident],
  maintenances: [],
};

describe("official incident provenance", () => {
  it("constructs the exact Supabase incident URL when shortlink is absent", () => {
    expect(incidentUrl("https://status.supabase.com/", incident.id, undefined)).toBe(
      "https://status.supabase.com/incidents/01M7M28VB7RPQ89T93T9T1SBZ2",
    );
  });

  it("preserves a provider's official HTTPS shortlink", () => {
    expect(incidentUrl("https://status.supabase.com/", "abc", "https://stspg.io/example")).toBe("https://stspg.io/example");
  });
});

describe("maintenance date fallback", () => {
  it("parses Supabase's named date and UTC window using the announcement year", () => {
    expect(parseMaintenanceWindow(
      "We will perform scheduled maintenance on Monday, November 30, from 13:00 to 15:00 UTC.",
      "2026-11-13T13:36:00Z",
    )).toEqual({ startsAt: "2026-11-30T13:00:00.000Z", endsAt: "2026-11-30T15:00:00.000Z" });
  });

  it("parses an ISO date and UTC window from provider prose", () => {
    expect(parseMaintenanceWindow(
      "Maintenance in BOS on 2026-11-17 between 07:00 and 11:00 UTC.",
      "2026-11-11T17:29:11Z",
    )).toEqual({ startsAt: "2026-11-17T07:00:00.000Z", endsAt: "2026-11-17T11:00:00.000Z" });
  });
});

describe("service and incident consistency", () => {
  it("marks a whole-provider service degraded for an active minor incident", () => {
    const supabase = SERVICES.find((service) => service.id === "supabase")!;
    expect(serviceLevel(supabase, reading).level).toBe("degraded");
  });

  it("does not attach an incident without component metadata to every scoped product", () => {
    const copilot = SERVICES.find((service) => service.id === "github-copilot")!;
    expect(relevantIncidents(copilot, [incident])).toEqual([]);
  });

  it("attaches an incident only when a published affected component matches", () => {
    const copilot = SERVICES.find((service) => service.id === "github-copilot")!;
    expect(relevantIncidents(copilot, [{ ...incident, affected: ["Copilot"] }])).toHaveLength(1);
    expect(relevantIncidents(copilot, [{ ...incident, affected: ["Pages"] }])).toEqual([]);
  });
});

describe("regional maintenance grouping", () => {
  it("deduplicates identical announcements and groups a provider's same-day regions", () => {
    const base: SourceIncident = {
      ...incident,
      id: "gua-1",
      src: "Cloudflare",
      name: "GUA (Guatemala City) on 2026-11-17",
      impact: "maintenance",
      startsAt: "2026-11-17T08:00:00.000Z",
      endsAt: "2026-11-17T12:00:00.000Z",
    };
    const groups = groupMaintenances([
      base,
      { ...base, id: "gua-duplicate" },
      { ...base, id: "bos", name: "BOS (Boston) on 2026-11-17", startsAt: "2026-11-17T07:00:00.000Z" },
    ]);
    expect(groups).toHaveLength(1);
    expect(groups[0]!.items.map((item) => item.id)).toEqual(["gua-1", "bos"]);
  });
});
