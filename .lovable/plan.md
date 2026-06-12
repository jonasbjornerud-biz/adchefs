## Goal

Turn the AdChefs backend (admin + client portal + all dashboards) into one cohesive premium operating system. Pure visual/structural rebuild on top of a new shared design system. Zero changes to routing, auth, RLS, schema, or data flow.

## 1. New shared backend design system

New folder `src/components/backend/` — single source of truth, imported by every admin and portal page.

```text
backend/
  PageShell.tsx        page wrapper (max-w, grain, gradient, padding scale)
  PageHeader.tsx       eyebrow + title (Inter Tight + optional <em>) + description + actions slot
  SectionDivider.tsx   hairline + optional eyebrow label
  Eyebrow.tsx          mono uppercase chip (already exists as class — formalize as component)
  StatusPill.tsx       semantic variants: new, qualified, sent, submitted, rejected, shortlisted, connected, not-configured, coming-soon, demo
  MetricCard.tsx       premium kpi card (thin blue top accent, big numeral, mono label, sparkline, delta pill)
  DataTable.tsx        consistent table chrome (row height 56px, hairline dividers, hover wash, sticky header)
  FilterBar.tsx        search + selects + segmented filter chips in one sticky toolbar
  EmptyState.tsx       icon, eyebrow, title, body, optional CTA
  LoadingSkeleton.tsx  card/table/chart skeletons sharing the paper grain
  ChartCard.tsx        chart container w/ title, subtitle, legend, demo-data tag
  ClientCard.tsx       brand account card (logo, name, handle, status pill, quick actions)
  ModuleCard.tsx       portal feature card (icon, title, status, "updated" line, hover lift)
  DarkHero.tsx         ink-band hero with dotted/grid bg, used by admin client preview + client portal home
  ActionButton.tsx     thin wrapper around Button with arrow-shift hover
```

Token additions to `src/index.css`:
```css
--bg-paper: #F7F6F3;
--bg-paper-elev: #FBFAF6;
--surface-card: #FFFFFF;
--hairline: #E2E0D9;
--ink: #1A1A1A;
--muted: #75726B;
--accent: #9ED8F5;
--accent-strong: #3B86A8;
--accent-wash: linear-gradient(90deg,#ECF7FD 0%,#FFFFFF 100%);
--shadow-soft: 0 1px 2px rgba(26,26,26,.04), 0 8px 24px -12px rgba(26,26,26,.08);
--grid-dark: radial-gradient(rgba(255,255,255,.06) 1px, transparent 1px) 0 0/24px 24px;
```

Card pattern: white surface, 1px `--hairline`, 4px radius, 2px `--accent` top bar on key cards, `--shadow-soft` on hover with `-1px` translateY.

## 2. Admin shell

Rewrite `src/components/admin/AdminShell.tsx` to consume `PageShell` and refine the sidebar:

```text
┌──── AdChefs Studio ────┐
│  ✦  AdChefs            │
│     Studio · v1        │
├────────────────────────┤
│  ◐  Clients            │
│  ◉  Pipeline           │
│  ▢  Job Postings       │
│  ★  Shortlist          │
│  ⚙  Settings           │
├────────────────────────┤
│  ◇  Mock demo          │
│  ⤿  Sign out           │
└────────────────────────┘
```

- Dark ink sidebar (`#0E0E0E`) with subtle dotted grid, hairline rail in accent on active item.
- Top bar in main column: breadcrumb + page actions slot (provided by `PageHeader`).
- Collapsible to icon rail on `<lg`.

## 3. Admin pages — apply the system

`pages/admin/Dashboard.tsx` (Clients roster + Pipeline tabs)
- Split into tabbed routes already handled; rebuild each tab using new primitives.
- Clients tab: `MetricCard` "Total clients" + grid of `ClientCard`s with logo, name, handle, status, Open portal / Edit actions; premium `EmptyState` when none.
- Add prominent "New client" `ActionButton` in `PageHeader`.

`components/recruitment/RecruitmentPanel.tsx` (Pipeline)
- Replace bespoke stat row with `MetricCard` strip (All / New / Qualified / Sent / Submitted / Rejected / Shortlist) — clickable, active gets accent top bar.
- Search + role filter → `FilterBar`.
- Applicant table → `DataTable`: avatar+name / email column, software tags as `StatusPill variant="tag"`, applied date, stage pill, row actions; rejected rows muted.
- Keep existing qualified-count logic and stage sheet untouched.

`components/recruitment/ShortlistedEditors.tsx`
- Rebuild cards using `ClientCard` styling adapted for editors.

`pages/admin/ClientDetail.tsx` (admin preview of client portal)
- Use `DarkHero` for the dark band, then `ModuleCard` grid identical to client portal home.
- Add "Admin preview" pill + edit affordance in hero corner.

`pages/admin/ClientForm.tsx` + `components/admin/ClientEditDialog.tsx`
- Restyle fields with new tokens, hairline borders, accent focus. No new fields.
- On successful create, navigate to the new client's detail page (already the behavior — confirm).

## 4. Client portal + dashboards

All six dashboard files stay in lockstep per `mem://preferences/dashboard-parity`. Heavy lifting goes into the shared `dashboard/` components so changes propagate.

`components/dashboard/KpiCard.tsx` → thin wrapper around new `MetricCard`.
`components/dashboard/AdTable.tsx` → thin wrapper around `DataTable` with ad-specific columns + Library/Watch action buttons.
`components/dashboard/AdDetailPanel.tsx` → refreshed sheet using new tokens.
`components/dashboard/OverviewChart.tsx` → wrap in `ChartCard`, switch to single ink line + soft accent area, lighter grid, clean axis.
`components/dashboard/WtdStats.tsx` → mirror MetricCard styling.

Page-level edits (same diff applied to all six):
- Replace ad-hoc page chrome with `PageShell` + `PageHeader`.
- Hero section uses `PageHeader` (no `DarkHero` here — portal home owns that).
- Client portal home (`ClientDashboard` + `MockClientDashboard`): `DarkHero` with client logo + "Welcome back, {name}", then `ModuleCard` grid (Editor Performance, KPI Dashboard) with status states `connected / not-configured / coming-soon / updated {timeago}`. Never renders broken charts — falls back to `EmptyState` if module disabled.

Demo dashboards keep the existing "demo" data tag rendered by `ChartCard`.

## 5. Default portal template for new clients

No schema change. Defaults applied in code:

- `pages/admin/ClientForm.tsx` create path already inserts a `clients` row. After insert, set portal defaults via a small local helper `lib/clientDefaults.ts` that returns:
  ```ts
  { client_portal_enabled: true, editor_performance_enabled: true,
    kpi_dashboard_enabled: true, ad_performance_enabled: true,
    show_demo_data: false, portal_theme: 'adchefs-premium' }
  ```
- Client portal home reads these (or falls back to the defaults) when rendering `ModuleCard`s. If a column doesn't exist on `clients`, defaults are returned and the card renders the `not-configured` state. No DB migration required for v1 — purely a code-side template.

This means every existing client immediately renders with the new portal layout and premium empty states without any data migration.

## 6. Microcopy + motion

- Centralize portal copy strings in `lib/backendCopy.ts` so the lines specified in the brief are reused.
- Motion: tailwind transitions only — `transition-[transform,box-shadow] duration-200`, `hover:-translate-y-px`, button arrow `translate-x-0.5` on hover. No new deps. Respect `prefers-reduced-motion`.

## 7. Files touched

New
- `src/components/backend/{PageShell,PageHeader,SectionDivider,Eyebrow,StatusPill,MetricCard,DataTable,FilterBar,EmptyState,LoadingSkeleton,ChartCard,ClientCard,ModuleCard,DarkHero,ActionButton}.tsx`
- `src/lib/clientDefaults.ts`
- `src/lib/backendCopy.ts`

Edited
- `src/index.css` (tokens only — no semantic changes that break landing)
- `src/components/admin/AdminShell.tsx`, `ClientEditDialog.tsx`
- `src/components/recruitment/RecruitmentPanel.tsx`, `ShortlistedEditors.tsx`
- `src/components/dashboard/{KpiCard,AdTable,AdDetailPanel,OverviewChart,WtdStats}.tsx`
- `src/pages/admin/{Dashboard,ClientDetail,ClientForm}.tsx`
- `src/pages/editor/{ClientDashboard,MetaAdsDashboard,PerformanceDashboard}.tsx`
- `src/pages/mock/{MockClientDashboard,MockAdsDashboard,MockPerformanceDashboard}.tsx`

## 8. Explicit non-goals

- No changes to landing page, auth, routing, RLS, edge functions, or DB schema.
- No new dependencies (Tailwind + existing shadcn + lucide only).
- No client-specific hardcoding — every page reads name/logo/handle from `clients` row.
- No demo data leaking into real client portals.

## 9. Acceptance check before handoff

After implementation I will:
1. Verify build output is clean.
2. Spot-check each route in preview: `/admin`, `/admin/clients/:id`, `/admin/clients/new`, `/editor/dashboard`, `/editor/performance`, `/editor/meta-ads`, and the three `/mock` mirrors.
3. Confirm dashboard parity (mock ≡ live) per the project memory rule.
