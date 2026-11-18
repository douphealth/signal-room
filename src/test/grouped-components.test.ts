import { describe, expect, it } from "vitest";
import { normalizeComponents } from "@/lib/status.functions";
import { SERVICES, serviceLevel, componentLabel, displayAffected, type Reading } from "@/lib/services";

const raw = [
  { id: "g1", name: "Fortnite", group: true, status: "partial_outage" },
  { id: "g2", name: "Rocket League", group: true, status: "operational" },
  { id: "a", name: "Login", group: false, group_id: "g1", status: "major_outage" },
  { id: "b", name: "Login", group: false, group_id: "g2", status: "operational" },
];

describe("group-scoped components", () => {
  it("adds Group > Name entries without losing plain names", () => {
    const names = normalizeComponents(raw).map((c) => c.name);
    expect(names).toEqual(expect.arrayContaining(["Login", "Fortnite > Login", "Rocket League > Login"]));
  });
  it("keeps a Fortnite outage out of Rocket League", () => {
    const reading: Reading = { ok: true, fetchedAt: "2026-11-18T00:00:00Z", components: normalizeComponents(raw), incidents: [], maintenances: [] };
    const fortnite = SERVICES.find((s) => s.id === "fortnite")!;
    const rocket = SERVICES.find((s) => s.id === "rocket-league")!;
    expect(serviceLevel(fortnite, reading).level).toBe("major");
    expect(serviceLevel(rocket, reading).level).toBe("operational");
  });
  it("lists only plain names for unscoped providers and labels nicely", () => {
    const reading: Reading = { ok: true, fetchedAt: "2026-11-18T00:00:00Z", components: normalizeComponents(raw), incidents: [], maintenances: [] };
    const twitch = { ...SERVICES.find((s) => s.id === "twitch")! };
    expect(serviceLevel(twitch, reading).matched.every((c) => !c.name.includes(" > "))).toBe(true);
    expect(componentLabel("Canvas > Canvas LMS")).toBe("Canvas LMS");
    expect(displayAffected(["Login", "Fortnite > Login", "Website"])).toEqual(["Fortnite > Login", "Website"]);
  });
});
