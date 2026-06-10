# Fix Mobile Layout Across the Landing Page

Mobile preview shows several layout breakages causing horizontal overflow and overlapping text. Fixes are CSS/JSX-only — no copy, structure, or business logic changes.

## Issues found

1. **Hero headline overflows the screen** — `<h1>` uses `whitespace-nowrap`, so the long line "Your dedicated video editor" scrolls off-screen.
2. **Hero content shifted left off-screen** — inner wrapper uses `-ml-4`, exposing horizontal scroll.
3. **Hero eyebrow chip** ("BUILT FOR E-COM BRANDS · PAY PER VIDEO") overflows the viewport at 390px.
4. **Marquee header row** ("RECENT WORK" + "LIVE CUTS SHIPPING FOR CLIENTS") uses `justify-between` and collides on mobile.
5. **Navigation logo** is `h-28` (112px) — eats half the mobile viewport and forces a tall fixed nav.
6. **EditorEdge h2** ("Editors who understand why ads work.") has `whitespace-nowrap` → overflow.
7. **FAQ h2** ("Things people actually ask.") has `whitespace-nowrap` → overflow.
8. **Footer logo** is `h-36` (144px) — oversized on mobile.
9. **Section vertical padding** `py-24` is heavy on small screens; tighten the mobile base.

## Changes

### `src/components/Navigation.tsx`
- Nav height: `h-28` → `h-16 md:h-28`.
- Logo: `h-28` → `h-12 md:h-28`.

### `src/components/Hero.tsx`
- Top padding: `pt-32` → `pt-24 sm:pt-40` (matches shorter mobile nav).
- Inner wrapper: remove `-ml-4` (kept on `md:` only if needed — drop it entirely; it was a desktop nudge that breaks mobile).
- Eyebrow: wrap in a container that allows wrapping, or shrink with `text-[10px]` on mobile via a wrapping span (apply `whitespace-normal` and let it sit naturally; the `.eyebrow` class is `inline-block` so it just needs the parent to allow flow).
- H1: drop `whitespace-nowrap`, keep responsive sizes; reduce mobile size `text-[34px] sm:text-[56px] md:text-[68px]` and keep `<br/>` only on `sm:` and up by using a `hidden sm:inline` wrapper for the line break.
- Marquee header row: `flex items-end justify-between` → stack on mobile: `flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2`.

### `src/components/EditorEdge.tsx`
- H2: remove `whitespace-nowrap`.

### `src/components/FAQ.tsx`
- H2: remove `whitespace-nowrap`.
- Grid `gap-12` → `gap-8 md:gap-12` to tighten mobile spacing between the heading block and accordion.

### `src/components/Footer.tsx`
- Logo: `h-36` → `h-16 md:h-36`.
- Grid gap: `gap-12` → `gap-10 md:gap-12`.

### Section padding (global tightening)
For each of `WhyAdChefs`, `HowItWorks`, `EditorEdge`, `Pricing`, `CalendlyBooking`, `FAQ`, `Footer`:
- `py-24 sm:py-32` → `py-16 sm:py-32` (Footer keeps its own pt/pb but trim mobile top to `pt-12`).

## Out of scope
- No copy edits.
- No new components, no design redirection.
- Desktop layout untouched — every change is mobile-only via responsive prefixes.

## Verification
After edits, reload the preview at 390×844 and confirm:
- No horizontal scroll on any section.
- Hero headline wraps and fits.
- Marquee header labels stack cleanly.
- Nav + logo sit at a reasonable height.
- Footer logo is proportional.
