import { describe, expect, it } from "vitest";
import { SERVICES, fmtDuration, historyFor, historyStats, incidentMinutes, type PastIncident } from "@/lib/services";

const p = (id: string, startedAt: string, resolvedAt: string | undefined, affected: string[], impact = "minor"): PastIncident =>
  ({ id, name: id, impact, status: resolvedAt ? "resolved" : "investigating", startedAt, resolvedAt, link: "", affected });
const copilot = SERVICES.find((s) => s.id === "github-copilot")!;
const chatgpt = SERVICES.find((s) => s.id === "chatgpt")!;
const now = Date.parse("2026-11-25T12:00:00Z");

describe("outage history", () => {
  it("keeps only incidents naming the service's components when the feed tags components", () => {
    const list = [p("a", "2026-11-20T10:00:00Z", "2026-11-20T11:12:00Z", ["Copilot"]), p("b", "2026-11-21T10:00:00Z", "2026-11-21T10:30:00Z", ["Actions"])];
    const h = historyFor(copilot, list);
    expect(h.items.map((i) => i.id)).toEqual(["a"]);
    expect(h.unscoped).toBe(false);
  });
  it("keeps every incident but flags it when the feed never tags components", () => {
    const h = historyFor(chatgpt, [p("a", "2026-11-20T10:00:00Z", undefined, [])]);
    expect(h.items).toHaveLength(1);
    expect(h.unscoped).toBe(true);
  });
  it("computes durations, windows and the median fix time", () => {
    const list = [
      p("old", "2026-07-01T00:00:00Z", "2026-07-01T02:00:00Z", [], "major"),
      p("mid", "2026-10-10T00:00:00Z", "2026-10-10T00:30:00Z", []),
      p("new", "2026-11-24T00:00:00Z", undefined, [], "critical"),
    ];
    const s = historyStats(list, now);
    expect(s.last?.id).toBe("new");
    expect([s.total, s.last30, s.last90, s.major]).toEqual([3, 1, 2, 2]);
    expect(s.medianMinutes).toBe(75);
    expect(s.since).toBe("2026-07-01T00:00:00Z");
    expect(incidentMinutes(list[2]!)).toBeUndefined();
  });
  it("formats durations", () => {
    expect([fmtDuration(0), fmtDuration(45), fmtDuration(72), fmtDuration(120), fmtDuration(3000)]).toEqual(["under 1m", "45m", "1h 12m", "2h", "2d 2h"]);
  });
});
