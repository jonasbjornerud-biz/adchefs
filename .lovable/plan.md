# Recent Work Strip — Cloudinary Video Upgrade

Scope is strictly the "Recent work" marquee inside `src/components/Hero.tsx`. The hero background, headline, CTAs, navigation, and every other section stay untouched. Layout, thumbnail size (170×240 / 220×310), 16px gap, 4px radius, edge fade gradients, and the existing `marquee-track` infinite-scroll animation remain exactly as-is — only the media element and its interactions change.

## 1. Media source list

Replace the current `mediaSources` array with 10 Cloudinary clips in this order: `AC1_r0bbjh`, `AC2_xllvey`, `AC3_wa3d0v`, `AC4_l0cp6d`, `AC5_v65ofr`, `AC6_pqpagf`, `AC7_kwkbqq`, `AC8_bvkrvb`, `AC9_uwa9z6`, `AC10_obarrz`.

For each clip we derive 3 URLs via a helper. Assets 6 and 7 are `.mov` sources, so `f_auto` is omitted to force MP4 delivery; the other 8 use `f_auto`.

```text
preview  → so_0,eo_3,w_400,q_auto[,f_auto],ac_none/{id}.mp4
poster   → so_1,w_400,q_auto[,f_auto]/{id}.jpg
full     → q_auto[,f_auto]/{id}.mp4
```

The doubled array used by the marquee keeps the same `[...items, ...items]` pattern so each clip + clone shares the same descriptor.

## 2. New `RecentWorkCard` component (same file or sibling, frontend only)

Each tile renders:

- A `<video muted autoplay loop playsinline preload="metadata" poster={poster}>` with the preview URL as `<source>`. Tiles outside the initial viewport start at `preload="none"` and upgrade to `metadata` when they approach (via IntersectionObserver `rootMargin: 200px`).
- An `onError` handler that hides the `<video>` and swaps in an `<img src={poster}>` covering the tile, with the play indicator permanently visible. Never an empty/grey tile.
- The play indicator: a 40px Ink (#1A1A1A @ 85%) circle with a white play triangle, absolutely centered, opacity 0 by default.
- A 1px inset ring (`box-shadow: inset 0 0 0 1px #9ED8F5`) at opacity 0 by default.

Clones produced by the `[...items, ...items]` doubling are the same component instance, so observer + error-fallback + autoplay rules apply identically to originals and clones.

## 3. Hover interactions (desktop only, via `@media (hover: hover) and (pointer: fine)`)

On hover:

- Card `transform: scale(1.03)` with `box-shadow: 0 8px 24px rgba(26,26,26,0.10)`, 250ms ease-out
- Inset #9ED8F5 ring fades to opacity 1 over 250ms
- Play indicator fades to opacity 1 over 250ms

All three reverse smoothly on mouse leave. Touch devices get none of these (the media-query gate handles that automatically).

## 4. IntersectionObserver — playback gating

One shared observer per mount watches every card. When a tile leaves the viewport its preview video is paused; when it re-enters it resumes (`.play().catch(() => {})` to swallow autoplay rejections). Same observer also flips `preload` from `none` → `metadata` for off-screen tiles approaching the viewport. Applies to originals and clones identically.

## 5. Lightbox on click / tap

A single lightbox lives at the Hero section level, opened by clicking any tile (originals or clones — both pass the same `full` URL).

- Overlay: `position: fixed inset-0`, Ink #1A1A1A @ 90%, 200ms fade-in
- Centered `<video controls autoplay preload="none">` using the asset's full video URL, audio on
- Sized `max-width: 90vw; max-height: 85vh; width/height: auto` so 9:16 verticals are constrained by height and never stretched
- Close affordances: X button top-right styled in Paper #F7F6F3, click on overlay backdrop, Escape key
- On close: pause the video, clear `src`, and call `.load()` so the element unloads; remove the keydown listener

## 6. Reduced motion

Inside the component, read `window.matchMedia('(prefers-reduced-motion: reduce)')`. When reduced:

- Previews do not autoplay; they render their poster frame (set `autoplay={false}`, keep `poster`)
- Clicking the tile starts playback inline OR opens the lightbox per the standard click handler (we keep the click-to-lightbox behavior — that's the "play only on click" path)
- Hover `scale(1.03)` is dropped; the ring and play indicator still fade in on hover

## 7. Files touched

- `src/components/Hero.tsx` — replace the `mediaSources` array and the inline tile JSX with the new `RecentWorkCard` + `Lightbox` components, plus shared observer/lightbox state. Marquee wrapper, `.marquee-track`, gap, padding, edge gradients, and "Recent work" eyebrow row are unchanged.

No CSS changes outside this component are needed; hover/transition styles can live inline or as a small `<style>` block scoped to the new classes. No new dependencies.

## 8. Verification before finishing

In preview at 100% zoom:

1. All 10 originals + 10 clones show moving preview clips (or poster fallbacks on error) — zero blank/grey tiles.
2. Hover on any desktop tile: lift to 1.03, blue inset ring, centered play indicator all fade in; reverse cleanly on leave.
3. Click any tile (original or clone): lightbox opens with full-res video, audio on, controls visible; verticals respect 85vh without stretching.
4. Close via X, overlay click, and Escape — all stop playback.
5. Toggle `prefers-reduced-motion` (DevTools rendering panel): previews are static poster frames, hover scale is gone, click still opens the lightbox.
