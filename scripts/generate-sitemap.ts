// Runs before `vite dev` and `vite build` (predev/prebuild hooks).
// Writes public/sitemap.xml from static routes + active job postings.

import { writeFileSync } from "fs";
import { resolve } from "path";

const BASE_URL = "https://adchefs.com";
const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

interface SitemapEntry {
  path: string;
  lastmod?: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: string;
}

const today = new Date().toISOString().slice(0, 10);

const staticEntries: SitemapEntry[] = [
  { path: "/", changefreq: "weekly", priority: "1.0", lastmod: today },
  { path: "/about", changefreq: "monthly", priority: "0.8", lastmod: today },
  { path: "/jobs", changefreq: "weekly", priority: "0.7", lastmod: today },
];

async function fetchJobSlugs(): Promise<string[]> {
  if (!SUPABASE_URL || !SUPABASE_KEY) return [];
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/list_active_job_postings`, {
      method: "POST",
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        "Content-Type": "application/json",
      },
      body: "{}",
    });
    if (!res.ok) return [];
    const rows = (await res.json()) as Array<{ slug?: string }>;
    return rows.map((r) => r.slug).filter((s): s is string => Boolean(s));
  } catch {
    return [];
  }
}

function generateSitemap(entries: SitemapEntry[]) {
  const urls = entries.map((e) =>
    [
      `  <url>`,
      `    <loc>${BASE_URL}${e.path}</loc>`,
      e.lastmod ? `    <lastmod>${e.lastmod}</lastmod>` : null,
      e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
      e.priority ? `    <priority>${e.priority}</priority>` : null,
      `  </url>`,
    ]
      .filter(Boolean)
      .join("\n"),
  );

  return [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
    ...urls,
    `</urlset>`,
  ].join("\n");
}

(async () => {
  const slugs = await fetchJobSlugs();
  const jobEntries: SitemapEntry[] = slugs.map((slug) => ({
    path: `/jobs/${slug}`,
    changefreq: "weekly",
    priority: "0.6",
    lastmod: today,
  }));
  const entries = [...staticEntries, ...jobEntries];
  writeFileSync(resolve("public/sitemap.xml"), generateSitemap(entries));
  console.log(`sitemap.xml written (${entries.length} entries)`);
})();