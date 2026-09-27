# Project Memory

## Core
- AdChefs Brand v1.0 (2026). Premium muted editorial. Light-only on marketing.
- Palette: Ink #1A1A1A, Paper #F7F6F3, Accent #9ED8F5 (light blue), Surface #EEEDE8, Muted text #75726B. All radii rounded-[4px].
- Fonts: Inter Tight (headings, 500-700), Instrument Serif Italic (one emphasis word per headline, wrap in `<em>`), Inter (body), JetBrains Mono (eyebrows + KPIs, uppercase, tracking 0.15em).
- Eyebrow pattern: `<span className="eyebrow">LABEL</span>` (mono chip, 4px border). Accent variant: `eyebrow eyebrow-accent`.
- Voice: operator, not copywriter. Lead with the metric then the claim. Never "we help you / solution / amazing results". Use "we build / we ship / per delivered video".
- Pay-per-video model. No retainers. Target: e-com with >€5k/mo ad spend. Max 2-3 brands/month.
- Landing flow: Hero → WhyAdChefs (founder) → TwoWaysToWork → ResultsMarquee → MeVsAgency → FAQ → Footer (dark Ink). Never add Results or Case Studies.
- Contact lives on its own page at /contact (not on the home page): Fulcio-style two-column, direct email + phone (+47 942 58 751), circular profile photo under the phone number (no name/Founder text next to it), form with labels inside as placeholders. Footer uses variant="dark" on /contact; hero blue gradient (HeroBackground) is the page background there. First-call copy at top (audit of creative situation + goals); no "What happens next" section. CTAs say "Contact me" (never "us") and all point to /contact; submissions email jonas@adchefs.com via contact-notification template.
- Logo wordmark: `AdChefs<span class="text-accent">.</span>` — the period is part of the mark.
- All dashboards (editor/* and mock/*) must stay in sync — mirror every style/layout change across all six files in the same turn; prefer editing shared components in src/components/dashboard/.

## Memories
- [Booking Qualification Rules](mem://constraints/booking-qualification) — Target audience constraints for Calendly booking
- [FAQ Content](mem://features/faq-content) — The 3 core FAQ topics and their answers
- [Dashboard parity](mem://preferences/dashboard-parity) — Keep editor and mock dashboards visually identical
- [Backend design system](mem://architecture/backend-design-system) — Shared primitives in src/components/backend/ + default portal template for every new client
