# Visual rebuild — Admin & Dashboards

Goal: turn every authenticated/admin surface into a single branded experience that matches the landing page's soft-blue, minimalist tone. No business logic or schema changes — only visuals, layout primitives, navigation chrome, and one metric correction.

---

## 1. New shared admin shell

Create `src/components/admin/AdminShell.tsx` — a collapsible sidebar layout used by every `/admin*` route.

```text
┌──────────┬────────────────────────────────────────┐
│  ✦ AdC   │  Page header (breadcrumb · actions)    │
│ ──────── ├────────────────────────────────────────┤
│ ◉ Pipe   │                                        │
│ ★ Short  │            page content                │
│ ▢ Jobs   │      (soft-blue gradient bg)           │
│ ◐ Clients│                                        │
│ ─────    │                                        │
│ ⤿ Logout │                                        │
└──────────┴────────────────────────────────────────┘
```

- Built on shadcn `Sidebar` with `collapsible="icon"`, default expanded on desktop, auto-collapse on `<lg`.
- Brand mark (existing `adchefs-logo`) + tiny wordmark at top; collapses to mark only.
- Nav items: Pipeline (`/admin`), Shortlist (`/admin?tab=shortlist`), Job Postings (`/admin?tab=jobs`), Clients (`/admin/clients`), divider, Logout.
- Active item: hairline left rail in brand blue `#3B86A8`, no heavy fill.
- Background: page wrapper uses the same soft-blue radial gradient from the landing page (extracted into `--gradient-admin-bg` token in `index.css`), with a paper-white card surface for content blocks.
- Wrap routes in `src/App.tsx` so `/admin`, `/admin/clients/*`, `/editor/*` dashboards all share the shell. (Login page excluded.)

## 2. Branded primitives

New file `src/components/brand/BrandStar.tsx` — outlined 6-point geometric star SVG, hairline stroke `#1A1A1A`, fills to `#9ED8F5` when `active`. Sizes `sm|md|lg`. Replace every `lucide-react` `Star` import across:
- `RecruitmentPanel.tsx`
- `ShortlistedEditors.tsx`
- anywhere else stars appear (search-driven).

New file `src/components/brand/BrandBadge.tsx` — small pill used for stage chips, role tags, etc., so styling is consistent.

## 3. Recruitment rebuild

### Pipeline (`RecruitmentPanel.tsx`)
- Replace top `Tabs` bar with shell sidebar; keep internal sub-tabs only if needed.
- New KPI strip: equal-width cards, hairline border, mono micro-labels, large `Inter Tight` numerals, soft-blue accent bar under the active filter (instead of the current black filled card).
- Search + role filter become a single sticky toolbar with a subtle blue focus ring.
- Applicant table: lighter row dividers (`#EEEDE8`), zebra removed, hover row gets the soft-blue gradient wash, branded star in the leading column, stage chips redrawn with the brand gradient family (blue tones for qualified→submitted, neutral for new, muted rose only for rejected).
- Stage detail sheet: refresh header, use new BrandBadge + spacing tokens.

### Qualified count fix
- Current: `qualified` count = applicants currently sitting in stage `qualified` only.
- New: count anyone whose `qualifies === true` (i.e. ever passed qualification), regardless of current stage including rejected/sent/submitted/shortlist. Implementation: in the stat-card aggregator, `qualified` bucket = `apps.filter(a => a.qualifies).length`. Other stage counts unchanged.

### Shortlist (`ShortlistedEditors.tsx`)
- Reuse new card frame + BrandStar; tighten typography; keep current photo logic untouched.

### Job Postings
- Card grid: hairline borders, brand-blue accent on active toggle, consistent header treatment.

## 4. Dashboards (parity preserved)

Per `mem://preferences/dashboard-parity`, mirror every change across all six:
`ClientDashboard`, `MetaAdsDashboard`, `PerformanceDashboard`, `MockClientDashboard`, `MockAdsDashboard`, `MockPerformanceDashboard`.

Changes — all done by editing the shared components in `src/components/dashboard/` so they propagate:
- `KpiCard`: new shell (paper white, hairline border, mono micro-label, large numeral, sparkline tucked bottom-right, optional soft-blue delta pill).
- `OverviewChart`: replace dark gradient fill with the brand soft-blue gradient; thinner axis lines; lighter grid.
- `AdTable`: lighter dividers, hover gradient, branded star for "favourite" if present.
- `AdDetailPanel`: refined header, brand chips.
- Page-level: each of the six pages gets the same gradient background wrapper + new section header pattern (small mono eyebrow + `Inter Tight` / `Instrument Serif` title pair, matching landing page).

## 5. Admin overview + Client detail/edit

- `pages/admin/Dashboard.tsx`: drop the bespoke top bar (shell handles nav + logout). Clients section becomes a card grid with brand styling; "Add client" button becomes the brand primary.
- `pages/admin/ClientDetail.tsx` + `ClientForm.tsx` + `components/admin/ClientEditDialog.tsx`: apply new typography, hairline borders, brand-blue focus states. No field changes.

## 6. Tokens

Add to `src/index.css`:
```css
--gradient-admin-bg: radial-gradient(... soft blue/cream blend matching landing ...);
--surface-paper: #FAF8F3;
--brand-blue: #3B86A8;
--brand-blue-soft: #9ED8F5;
--brand-blue-wash: linear-gradient(90deg,#BFE3F5 0%,#ECF7FD 100%);
--hairline: #E2E0D9;
```
All new components use these tokens; no hardcoded hexes scattered across files.

---

## Files touched

New:
- `src/components/admin/AdminShell.tsx`
- `src/components/admin/AdminSidebar.tsx`
- `src/components/brand/BrandStar.tsx`
- `src/components/brand/BrandBadge.tsx`

Edited:
- `src/App.tsx` (route wrapping)
- `src/index.css` (tokens)
- `src/pages/admin/Dashboard.tsx`, `ClientDetail.tsx`, `ClientForm.tsx`
- `src/components/admin/ClientEditDialog.tsx`
- `src/components/recruitment/RecruitmentPanel.tsx` (visuals + qualified count)
- `src/components/recruitment/ShortlistedEditors.tsx`
- `src/components/dashboard/*` (KpiCard, OverviewChart, AdTable, AdDetailPanel, WtdStats)
- `src/pages/editor/{ClientDashboard,MetaAdsDashboard,PerformanceDashboard}.tsx`
- `src/pages/mock/{MockClientDashboard,MockAdsDashboard,MockPerformanceDashboard}.tsx`

## Explicit non-goals

- No DB / RLS / edge function changes.
- No changes to auth or routing logic beyond wrapping admin routes in the shell.
- Landing page is untouched.
- No new dependencies.
