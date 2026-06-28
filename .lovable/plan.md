# Backend visual overhaul — Linear / Vercel editorial

A complete restyle of every authenticated surface. Light-mode, off-white canvas, hairline rules, restrained color, big numerical headlines with quiet sparklines. No more frosted glass, no more radial blooms, no more dark slate — that direction is retired for the backend.

Scope locked to backend only. The marketing site (`/`, `/about`, `/creative-strategy`, `/editor-placement`) is untouched.

## Design system (the new look)

**Canvas**
- Background: `#FAFAF7` (off-white paper)
- Card / panel: pure `#FFFFFF` with a 1px hairline border `#E8E6E0` and **no shadow**
- Inner sub-panel: `#F5F4F0`
- Section divider: 1px hairline `#E8E6E0`, never a shadow
- Selection / hover wash: `rgba(26,26,26,0.04)`

**Type**
- Display numbers: Instrument Serif, 56–72px, tracking -0.02em (the hero of every KPI card)
- UI / body: Inter, 13–14px, tracking -0.01em
- Eyebrows / meta / axes: JetBrains Mono, 10–11px, uppercase, tracking 0.08em, color `#8B887F`
- Primary text: `#111111`. Muted: `#6B6862`. Faint: `#A8A59E`.

**Accent (used sparingly, one per card max)**
- Signal blue `#2E6BE6` for deltas-up, primary lines, focus rings
- Warning amber `#B8841C` for deltas-down
- Everything else stays mono. No gradients on surfaces. No glow.

**Charts**
- Background: transparent on white card
- Gridlines: 1px dotted `rgba(17,17,17,0.06)`
- Axes: JetBrains Mono 10px, `#8B887F`
- Primary series: Ink `#111111`, 1.5px line
- Secondary series: Signal blue `#2E6BE6`, 1.5px line
- Area fills: 6% opacity of the line color, no gradient stops
- Bars: solid Ink with 4px rounded top caps, hover state lifts to `#2E6BE6`
- Threshold lines: 1px dotted `#A8A59E`

**Motion**
- 180ms ease-out on hover, 240ms ease-out on mount
- Count-up on KPI numbers (already wired) — keep
- No shimmer, no specular, no rotating glow

## What changes, file by file

**Global tokens**
- Replace the "Liquid Glass" CSS block in `src/index.css` (`.admin-bloom`, `.glass-card`, `.glass-panel`, `.glass-badge`, `.glass-dark`, recharts overrides) with the new editorial recipe. Keep the class names so consuming components don't need to be rewritten — they just get a new look. The `.admin-bloom` background becomes a flat `#FAFAF7` with a single hairline top border on scroll.

**Shell**
- `AdminShell.tsx`: thin left rail, mono section labels, current route as a 1px left accent bar (not a filled pill). Top bar collapses to a hairline.
- `Login.tsx`: centered card, big serif "Sign in", mono field labels.

**KPI dashboard (`/dashboard`, `/ads`)**
- `KpiCard.tsx`: serif headline number, mono eyebrow, sparkline below at 24px height, delta pill in mono with up/down chevron. Threshold rendered as a dotted hairline through the sparkline.
- `OverviewChart.tsx`: Revenue as bold Ink line, Spend as Signal-blue line + 6% area, BEROAS as dotted muted threshold. Legend as mono chips, top-right.
- `MetaAdsDashboard.tsx` + `AdTable.tsx`: rows on white, alternating wash `#FAFAF7`, status pills as 1px-bordered mono chips, hook/hold as 4px Ink-to-Signal gradient bars on a `#F5F4F0` track.
- `DateRangePicker.tsx`: white card, mono caption, single Ink accent on the active range.

**Editor performance (`/performance`)**
- Hero strip: 4 KPI cards in the new style.
- "Daily deliveries by week": bars in Ink with mono week chips below, dotted gridlines, no gradient.
- "Weekly output": single Ink line with 6% fill.
- "Editor leaderboard": horizontal bars on white, name in Inter, count in serif at the row end, approval-rate badge as mono chip.
- "Editor breakdown" table: hairline rows, mono headers, share-% drawn as a 2px Ink underline beneath the row.
- "Awaiting data" state: serif "—" with a single mono caption underneath.

**/admin landing + Client list**
- Clients shown as a hairline table (not cards), columns: brand, owner, spend last 30d, last sync, status. Status as mono pill. Row click → client detail.
- Top: one big serif KPI strip — total brands, total spend MTD, active editors, deliveries this week.

**Client home (when a client logs in at `/dashboard`)**
- Same KPI strip + Overview chart on top, ad table below — all in the new editorial style. Identical to the admin view, just scoped to their data.

**Mock dashboards**
- `MockPerformanceDashboard.tsx` and `MockAdsDashboard.tsx` mirror the real ones so the demo stays visually consistent.

## What I will NOT touch

- Marketing routes (`/`, `/about`, `/creative-strategy`, `/editor-placement`, all their components)
- Supabase schema, RLS, edge functions, queries
- Auth, routing, data fetching logic
- The Payment Tracking / `_Helpers` fix I just shipped — already done in this turn

## Out of scope for this pass (call out so you can decide later)

- New chart types (e.g. cohort grids, funnel)
- Adding new KPIs or data sources
- Mobile-specific layouts for the backend (it stays desktop-first)

## Technical notes

- All color, radius, and shadow values land as semantic tokens in `src/index.css`. Components keep using `glass-card`, `glass-panel`, `glass-badge`, `glass-dark` — those class names get redefined to the editorial recipe so the change propagates without touching every component.
- Recharts overrides go in one place in `src/index.css` under `.recharts-*` selectors.
- Count-up hook (`src/lib/useCountUp.ts`) stays as-is.
- One commit, presentational only.
