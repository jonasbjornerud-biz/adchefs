---
name: Backend design system
description: Shared backend primitives in src/components/backend/ — use these for every admin and client-portal surface instead of building ad-hoc card/pill/empty-state markup.
type: feature
---
The shared backend design system lives in `src/components/backend/` and is the single source of truth for admin and client-portal surfaces. Import via `@/components/backend`.

Available primitives:
- `Eyebrow` — mono uppercase chip (variants: default, accent, ink, muted)
- `StatusPill` — semantic status chip (new, qualified, sent, submitted, rejected, shortlisted, connected, not-configured, coming-soon, demo, neutral). Includes optional dot.
- `MetricCard` — premium KPI card with 2px accent top rail, big numeral, mono micro-label, optional delta pill + sparkline slot, hover lift. Use for every dashboard KPI strip going forward.
- `EmptyState` — centered card with accent top tick, icon, eyebrow, title, body, action. Use for every "no data" / "not configured" state.
- `ChartCard` — chart container with title, eyebrow, subtitle, demo-data pill, accent top rail. Wrap all dashboard charts in this.
- `ClientCard` — brand account card (logo, name, handle, status pill, Edit + Open portal actions). Used on the admin clients roster.
- `ModuleCard` — portal feature card with stats strip and status footer. Used by client portal home (ClientDashboard + MockClientDashboard).
- `PageHeader` — eyebrow + title (with `<em>` emphasis) + subtitle + actions slot.
- `DarkHero` — ink-band hero with accent dot grid + blue glow. Used by client portal home + admin client preview.
- `FormField`, `FormLabel`, `FormHint` — branded form controls (hairline border, accent focus ring, mono uppercase label).

Card pattern: white surface, 1px `#E2E0D9` border, 4–6px radius, 2px accent gradient top rail (`#9ED8F5 → #3B86A8 → transparent`), hover `-translate-y-px` + soft shadow.

Default portal template lives at `src/lib/clientDefaults.ts` (`DEFAULT_PORTAL_TEMPLATE` + `portalTemplateFor()`). Every new client inherits it — never hardcode per-client portal config.

**How to apply:** Whenever adding or refactoring a backend surface (admin page, client portal section, dashboard widget), reach for these primitives first. Only build a new ad-hoc component if no primitive fits, and then add it to `src/components/backend/` so future surfaces reuse it.