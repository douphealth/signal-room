// Site-wide SEO settings used by src/lib/seo-edge.ts, /sitemap.xml and /llms.txt.
export type SeoPage = { path: string; title: string; section?: string; desc?: string; lastmod?: string };

export const SEO = {
  origin: "https://signalroom.store",
  pagesDevHost: "signalroom-185.pages.dev",
  name: "Signalroom",
  description: "Live, source-first status board for AI, developer and SaaS tools (OpenAI, Claude, GitHub, Cloudflare, Vercel, Supabase and more) with a private watchlist.",
  lang: "en",
  logo: "/favicon.svg" as string | undefined,
  sameAs: [] as string[],
  sectionNames: {} as Record<string, string>,
  keepTrailingSlash: false,
};

export const LLMS_NOTES: string[] = [
  "Status readings come from each provider's official status page; Signalroom links to the original incident."
];

export function seoPages(): SeoPage[] {
  return [
    { path: "/", title: "Signalroom — Live status board for AI, dev & SaaS tools", section: "Start here" },
  ];
}
