# Project Memory

## Core
- AdChefs Brand v1.0 (2026). Premium muted editorial. Light-only on marketing.
- Palette: Ink #1A1A1A, Paper #F7F6F3, Accent #9ED8F5 (light blue), Surface #EEEDE8, Muted text #75726B. All radii rounded-[4px].
- Fonts: Inter Tight (headings, 500-700), Instrument Serif Italic (one emphasis word per headline, wrap in `<em>`), Inter (body), JetBrains Mono (eyebrows + KPIs, uppercase, tracking 0.15em).
- Eyebrow pattern: `<span className="eyebrow">LABEL</span>` (mono chip, 4px border). Accent variant: `eyebrow eyebrow-accent`.
- Voice: operator, not copywriter. Lead with the metric then the claim. Never "we help you / solution / amazing results". Use "we build / we ship / per delivered video".
- Pay-per-video model. No retainers. Target: e-com with >€5k/mo ad spend. Max 2-3 brands/month.
- Landing flow: Hero → WhyAdChefs (founder) → HowItWorks → EditorEdge (dark Ink band) → Pricing → Booking (Accent band) → FAQ → Footer (dark Ink). Never add Results or Case Studies.
- Logo wordmark: `AdChefs<span class="text-accent">.</span>` — the period is part of the mark.
- All dashboards (editor/* and mock/*) must stay in sync — mirror every style/layout change across all six files in the same turn; prefer editing shared components in src/components/dashboard/.

## Memories
- [Booking Qualification Rules](mem://constraints/booking-qualification) — Target audience constraints for Calendly booking
- [FAQ Content](mem://features/faq-content) — The 3 core FAQ topics and their answers
- [Dashboard parity](mem://preferences/dashboard-parity) — Keep editor and mock dashboards visually identical
