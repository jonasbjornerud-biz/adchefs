## SEO audit — findings and fix plan

The scanner returned 7 failing checks. Here's what's broken, ranked by impact, and the exact fixes I'd ship.

### Findings (current state)

| # | Severity | Issue |
|---|----------|-------|
| 1 | mid | No `/sitemap.xml` — Google has nothing to crawl beyond what's linked from `/` |
| 2 | mid | Every route shares the same `<title>` and `<meta description>` (home, /about, /jobs, /jobs/:slug, /login all identical) |
| 3 | mid | Same problem for OG tags — `og:url` is hardcoded to `https://adchefs.com` on every page, so `/jobs` previews as the homepage |
| 4 | mid | Logo `alt="AdChefs"` is too thin; `/login` inputs have no `id` ↔ `htmlFor` pairing |
| 5 | mid | Google Search Console isn't connected — no indexing data, no sitemap submission |
| 6 | low | No Organization JSON-LD on `/`, no JobPosting JSON-LD on `/jobs/:slug` (no rich results) |
| 7 | low | No `/llms.txt` — AI assistants (ChatGPT, Perplexity, Claude) have to crawl the SPA shell |

Semrush has no data on `adchefs.com` yet — normal for a new domain, will populate once Google indexes it (which #1 + #5 fix).

### Fix plan

**1. Per-route head tags (fixes #2, #3, #6 in one pass)**
- Install `react-helmet-async`, wrap `<App />` with `HelmetProvider` in `src/main.tsx`.
- Remove `<link rel="canonical">` from `index.html` so each route owns its own.
- Add a small `<SEO>` helper, then drop `<Helmet>` blocks into:
  - `Index.tsx` → home title + description, Organization JSON-LD
  - `About.tsx` → "About Jonas Bjørnerud — Founder, AdChefs"
  - `JobBoard.tsx` → "Careers — Remote Video Editor Roles"
  - `JobDetail.tsx` → per-job title + description + JobPosting JSON-LD (title, description, datePosted, hiringOrganization)
  - `Login.tsx` → "Sign in — AdChefs" + `<meta name="robots" content="noindex">`
- Each route self-references `canonical` and `og:url`.

**2. Sitemap + robots (#1)**
- Add `scripts/generate-sitemap.ts` that writes `public/sitemap.xml` with: `/`, `/about`, `/jobs`, plus one entry per published job pulled from the same data source `JobBoard` uses.
- Wire `predev` + `prebuild` in `package.json` so it regenerates automatically.
- Append `Sitemap: https://adchefs.lovable.app/sitemap.xml` to `public/robots.txt`.

**3. `/llms.txt` (#7)**
- Add `public/llms.txt` listing only the public marketing surfaces (`/`, `/about`, `/jobs`). Exclude `/login`, `/dashboard`, `/admin/*`, `/mock/*`, `/submit-task*`, `/unsubscribe`.

**4. Accessibility nits (#4)**
- `src/components/Navigation.tsx` and `src/components/Footer.tsx`: change `alt="AdChefs"` → `alt="AdChefs logo"`.
- `src/pages/editor/Login.tsx`: give the username/password inputs unique `id`s and add `htmlFor` on their `<label>`s.

**5. Google Search Console (#5)**
- Trigger the GSC connector flow, verify `https://adchefs.lovable.app/` via the META token route, submit the new sitemap. This runs after the sitemap ships so there's something to submit.

### What I won't touch
- Copy, layout, design tokens, or any business logic.
- The hardcoded social image (still valid sitewide fallback).
- The `index.html` sitewide `<title>`/`<meta description>`/og tags — they stay as the fallback for non-JS social crawlers; Helmet overrides them per route for Google.

### Caveat worth knowing
Helmet runs client-side, so JS-aware crawlers (Google) see the per-route tags, but pure social-preview crawlers (LinkedIn, Slack, Facebook) only see the static `index.html` head. Truly per-page social previews would need SSR — out of scope here.