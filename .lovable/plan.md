

# Complete Website Rebuild — Apple-Level Premium Design

## Vision
A site that feels like Apple designed it for a video production agency. Alternating section backgrounds (dark → white → dark → white) create visual rhythm. Subtle, animated background elements evoke video editing (film strips, timeline markers, play buttons) for depth without distraction.

## Design System

**Typography**: Inter (already loaded), massive hero text (clamp-based fluid sizing), generous letter-spacing on labels, tight leading on headings.

**Color Strategy — Alternating Sections**:
- **Hero + How It Works**: Current dark theme (`--background` dark mode)
- **Booking**: Clean white/light section with dark text
- **FAQ**: Back to dark
- **Footer**: Dark, minimal

Each section explicitly sets its own background rather than relying on global theme, creating the Apple-style alternating contrast.

**Accent**: Keep purple (`262 83% 58%`) but use it sparingly — only for CTAs and micro-highlights.

## Animated Background Elements (Video-Editing Theme)

Subtle SVG/CSS decorative elements that float and drift:
- **Film frame corners** — thin L-shaped brackets that slowly rotate/drift
- **Timeline ticks** — horizontal dashed lines with soft glow that pulse
- **Play triangle** — a faint outlined play icon that slowly rotates
- All elements at `opacity: 0.04–0.08`, using CSS `@keyframes` for slow float/rotate animations
- Rendered as a `BackgroundElements` component with absolute-positioned SVGs
- Only visible on dark sections; hidden on white sections

## File Changes

### 1. `src/index.css` — Design System Overhaul
- Remove current `site-gradient-bg` system
- Add alternating section classes: `.section-dark`, `.section-light`
- Add `@keyframes` for background element animations (float, drift, rotate, pulse)
- Refined typography scale, Apple-like spacing utilities
- Updated glass-card for light sections (subtle shadow instead of blur)

### 2. `src/components/BackgroundElements.tsx` — NEW
- SVG-based decorative elements: film corners, timeline bars, play icon outlines
- Absolutely positioned, pointer-events-none
- Each element has its own animation delay/duration for organic movement
- Accepts a `variant="dark" | "light"` prop to adjust opacity

### 3. `src/components/Hero.tsx` — Apple-Level Hero
- Dark background section with BackgroundElements
- Larger, bolder typography (fluid `clamp()` sizing)
- Simplified layout: headline → one-liner subtitle → CTA
- Keep the marquee but refine card styling
- Keep "Pay per video" checkmark callout

### 4. `src/components/HowItWorks.tsx` — Dark Section
- Same dark bg as hero (seamless flow)
- Cards redesigned: clean white text on dark cards, subtle border
- Numbered steps with thin accent line connecting them
- BackgroundElements in background

### 5. `src/components/CalendlyBooking.tsx` — White Section
- Flip to clean white/light background
- Dark text, refined card with subtle shadow for the Calendly embed
- Apple-style generous whitespace

### 6. `src/components/FAQ.tsx` — Dark Section
- Back to dark background
- Clean accordion with minimal borders
- BackgroundElements behind

### 7. `src/components/Footer.tsx` — Dark, Minimal
- Stays dark, ultra-minimal
- Thin top border, centered content

### 8. `src/components/Navigation.tsx` — Refined
- Transparent on hero, transitions to frosted glass on scroll
- Thinner, more refined sizing

### 9. `src/pages/Index.tsx` — Simplified Layout
- Remove floating orbs and `site-gradient-bg` div
- Each section handles its own background
- Clean wrapper, no extra containers

### 10. `tailwind.config.ts` — Add custom animations
- Add `float-slow`, `drift`, `rotate-slow`, `pulse-soft` keyframes
- Add film-editing-related animation utilities

## Technical Notes
- All background animations are pure CSS (`@keyframes` + `transform`/`opacity`), no JS libraries
- `will-change: transform` on animated elements for GPU acceleration
- Alternating backgrounds use explicit classes per section, not theme toggling
- Responsive: all animations hidden on mobile for performance
- The ThemeToggle is removed since we're using explicit section coloring

