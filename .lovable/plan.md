
Scope: landing page (`/`) only. Visual + copy. No backend changes.

### 1. `src/components/WhyAdChefs.tsx` — restyle "How it started"
- Wrap section in the same airy white-with-blue-wash background used by `TwoWaysToWork` / `MeVsAgency` (white→#F8F9FA gradient + soft `rgba(158,216,245,0.10)` radial wash). Remove the current `bg-secondary border-y` slab.
- Replace the bare 2‑column layout with a single rounded `32px` glass card (`bg-white/70`, `backdrop-blur-[40px]`, white inner highlight + soft blue shadow) matching the Comparison card treatment, so the section reads as part of the same family.
- Inside the card: portrait (slightly larger, soft blue ring instead of solid #3B86A8), eyebrow "HOW IT STARTED", same headline, same body copy, signature row preserved.
- Keep all existing copy untouched.

### 2. `src/components/ResultsMarquee.tsx` — case work level-up
- Add eyebrow above the heading already there ("CASE WORK" — keep) and confirm the heading styling matches other sections.
- Reframe the cards as ad-stat screenshots placeholders (not phone video cards):
  - Change aspect to `4/5` (a touch wider) so screenshots fit naturally.
  - Replace the play glyph with a subtle "Screenshot placeholder" mono label + a tiny faux KPI strip (ROAS / CTR placeholders) so when Jonas drops in real ad-stat images they sit naturally. Keep cards as `<div>` with a `bg-cover` style hook so a future `image` prop swaps the placeholder for real screenshots.
  - Tighten the swerve (reduce rotation range to ±1.5°, vertical offsets to ±18px) — feels more premium, less crooked.
  - Card chrome: thinner white ring, slightly deeper soft shadow, rounded `[18px]`.
- Below the marquee, add a centered disclaimer in muted mono/italic 12–13px:  
  *"Some case work includes editor placement services with a separate strategist."*

### 3. `src/components/MeVsAgency.tsx` — comparison refinements
- Reduce shimmer intensity: drop sweep opacity peak from `0.35` white band to ~`0.18`, slow the animation from 6s → 10s, and remove the conic-glow spin (or drop opacity to 0.25) so the pedestal feels calmer.
- Update the eyebrow above the heading from `"The comparison"` to `"OPERATOR VS AGENCY"` (correct, in line with the section's actual framing).
- Replace the bottom disclaimer with:  
  *"Some agencies are great, but most aren't built for brands that value an in-house experience."*

### 4. `src/components/TwoWaysToWork.tsx` — add missing eyebrow
- Above the heading add `<span className="eyebrow">SERVICES</span>` (or `"HOW I WORK"` — `SERVICES` is shortest and matches the section `id="services"`).

### 5. `src/components/Footer.tsx` — copy swap
- Replace the tagline paragraph with:  
  *"In-house creative strategy from A to Z with dedicated video editors matched to your brand."*
- Remove the FAQ link from the footer Navigate list (since FAQ section is being removed).

### 6. `src/pages/Index.tsx` — remove FAQ
- Remove `import FAQ` and the `<ScrollReveal><FAQ /></ScrollReveal>` line. Leave the `FAQPage` JSON‑LD in place for SEO (still accurate Q&A about the service) — confirm with user only if you'd rather strip it too; default is to keep it.
- Final flow: Hero → WhyAdChefs → TwoWaysToWork → ResultsMarquee → MeVsAgency → CalendlyBooking → Footer.

### Eyebrow audit summary (final state)
- Hero: existing eyebrow `BUILT FOR DTC BRANDS` — unchanged.
- WhyAdChefs: `HOW IT STARTED` — unchanged.
- TwoWaysToWork: **add** `SERVICES`.
- ResultsMarquee: `CASE WORK` — unchanged.
- MeVsAgency: change to `OPERATOR VS AGENCY`.
- CalendlyBooking: leave as-is.

### Out of scope
- No FAQ component deletion (file stays; only removed from `/`). Service pages still link nowhere to FAQ.
- No changes to backend, navigation, or service subpages.
