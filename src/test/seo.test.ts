import { readdirSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { SERVICES } from "@/lib/services";
import {
  HOME_DESCRIPTION,
  HOME_TITLE,
  NOT_FOUND_DESCRIPTION,
  NOT_FOUND_TITLE,
  SERVICES_DESCRIPTION,
  SERVICES_TITLE,
  SITE_URL,
  homeCanonical,
  homeJsonLd,
  indexableUrls,
  llmsTxt,
  robotsTxt,
  serviceDescription,
  serviceJsonLd,
  serviceTitle,
  servicesJsonLd,
  sitemapXml,
} from "@/lib/site";

describe("SEO catalogue", () => {
  it("uses the production origin by default", () => {
    expect(SITE_URL).toBe("https://signalroom.store");
  });

  it("keeps titles and descriptions within search limits and unique", () => {
    const titles = [HOME_TITLE, SERVICES_TITLE, NOT_FOUND_TITLE];
    const descriptions = [HOME_DESCRIPTION, SERVICES_DESCRIPTION, NOT_FOUND_DESCRIPTION];
    for (const service of SERVICES) {
      titles.push(serviceTitle(service));
      descriptions.push(serviceDescription(service));
    }
    for (const title of titles) expect(title.length).toBeLessThanOrEqual(60);
    for (const description of descriptions) expect(description.length).toBeLessThanOrEqual(160);
    expect(new Set(titles).size).toBe(titles.length);
    expect(new Set(descriptions).size).toBe(descriptions.length);
  });

  it("lists every indexable URL once in the sitemap and omits unknown dates", () => {
    const urls = indexableUrls();
    const xml = sitemapXml();
    expect(urls).toContain("https://signalroom.store/");
    expect(urls).toContain("https://signalroom.store/services");
    expect(urls).toContain("https://signalroom.store/services/openai-api");
    expect(urls).toHaveLength(SERVICES.length + 2);
    expect(xml.match(/<loc>/g)).toHaveLength(urls.length);
    for (const url of urls) expect(xml).toContain(`<loc>${url}</loc>`);
    expect(xml).not.toContain("watch=");
    expect(xml).not.toContain("<lastmod>");
    expect(xml.startsWith("<?xml")).toBe(true);
  });

  it("points robots.txt at the sitemap and allows answer-engine crawlers", () => {
    const robots = robotsTxt();
    expect(robots).toContain("Sitemap: https://signalroom.store/sitemap.xml");
    for (const bot of [
      "GPTBot",
      "OAI-SearchBot",
      "ChatGPT-User",
      "PerplexityBot",
      "ClaudeBot",
      "Google-Extended",
      "Applebot-Extended",
      "Bingbot",
    ]) {
      expect(robots).toContain(`User-agent: ${bot}`);
      expect(robots).toContain("Allow: /");
    }
    expect(robots).not.toMatch(/Disallow:\s+\//);
  });

  it("names real service pages in llms.txt", () => {
    const text = llmsTxt();
    expect(text.startsWith("# Signalroom")).toBe(true);
    expect(text).toContain("https://signalroom.store/services/github");
    expect(text).toContain("https://signalroom.store/services/claude-code");
    expect(text).toContain("Model endpoints and developer workflows");
    expect(text).not.toContain("?watch=");
  });

  it("noindexes filtered home URLs and keeps the clean URL indexable", () => {
    expect(homeCanonical({}).robots).toBe("index, follow");
    expect(homeCanonical({}).url).toBe("https://signalroom.store/");
    expect(homeCanonical({ watch: "" }).robots).toBe("index, follow");
    expect(homeCanonical({ watch: "" }).url).toBe("https://signalroom.store/");
    const filtered = homeCanonical({ watch: "supabase,vercel" });
    expect(filtered.robots).toBe("noindex, follow");
    expect(filtered.url).toBe("https://signalroom.store/?watch=supabase%2Cvercel");
  });

  it("keeps structured data to visible facts", () => {
    const payloads = [homeJsonLd(), servicesJsonLd(), serviceJsonLd(SERVICES[0]!, undefined)];
    for (const payload of payloads) {
      const serialized = JSON.stringify(payload);
      expect(serialized).not.toMatch(/aggregateRating|"review"|"price"|datePublished/i);
    }
    expect(JSON.stringify(homeJsonLd())).toContain("https://signalroom.store/");
    const service = SERVICES.find((item) => item.id === "openai-api");
    expect(service).toBeTruthy();
    const graph = serviceJsonLd(service!, undefined)["@graph"];
    expect(graph.some((node) => node["@type"] === "BreadcrumbList")).toBe(true);
    expect(JSON.stringify(graph)).toContain("Chat Completions");
  });

  it("publishes an IndexNow key file whose body is the filename", () => {
    const keys = readdirSync("public").filter((name) => /^[0-9a-f]{32}\.txt$/.test(name));
    expect(keys).toHaveLength(1);
    const filename = keys[0]!;
    expect(readFileSync(`public/${filename}`, "utf8")).toBe(filename.slice(0, -4));
  });
});
