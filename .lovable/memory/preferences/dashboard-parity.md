---
name: Dashboard parity
description: All dashboards (mock, client, editor — ClientDashboard, MetaAdsDashboard, PerformanceDashboard, MockClientDashboard, MockAdsDashboard, MockPerformanceDashboard) must stay visually and structurally in sync. Any style/layout change to one must be mirrored across all.
type: preference
---
When changing any dashboard page or shared dashboard component (KpiCard, AdTable, OverviewChart, AdDetailPanel, etc.), apply the same change across every dashboard variant in the same turn:

- src/pages/editor/ClientDashboard.tsx
- src/pages/editor/MetaAdsDashboard.tsx
- src/pages/editor/PerformanceDashboard.tsx
- src/pages/mock/MockClientDashboard.tsx
- src/pages/mock/MockAdsDashboard.tsx
- src/pages/mock/MockPerformanceDashboard.tsx

**Why:** The /mock routes are the public sales demo of the real client portal — they must look identical to the live dashboards at all times.

**How to apply:** Prefer editing shared components in src/components/dashboard/ so changes propagate automatically. When a page-level edit is needed (background, header, hero, card shells), mirror it across all six files in the same response.