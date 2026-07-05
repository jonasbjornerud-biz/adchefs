
# The Edit Suite — Landing Page Redesign

Full visual redesign of the home route (`/`) with a new design system inspired by video editing suites and Meta Ads Manager. Backend, routes, Calendly wiring, and automations stay untouched. Shared components (nav, footer, buttons) get restyled so subpages inherit the system, but subpage content is not restructured in this pass.

## Design system (added to `src/index.css` + `tailwind.config.ts`)

- **Colors**: Studio White `#F5F5F4`, Ink `#111110`, Graphite `#52514D`, Frame `#E4E3DF`, Playhead Red `#E5484D`, Signal Green `#1F9D55`. All wired as HSL semantic tokens (`--background`, `--foreground`, `--muted-foreground`, `--border`, `--accent`, `--success`).
- **Type**: Archivo (with Expanded width axis, weights 400/700/900) for display + body, IBM Plex Mono (400/500) for data/labels. Loaded via Google Fonts in `index.html`. No serif, no italic accent.
- **Radius**: 2px everywhere (`--radius: 0.125rem`).
- **Buttons**: Primary = Ink fill / Studio White text, hover shows leading red `▸`. Secondary = 1px Ink border, transparent. No gradients.
- **Eyebrows**: `.timecode-label` utility — mono, uppercase, Graphite, red 16px tick prefix (`01 · HOW IT WORKS`).
- **Metric chips**: mono tabular, Frame bg default, Signal Green bg when a win.
- **Focus ring**: 2px Playhead Red, 2px offset.
- **Motion**: single `reveal` (fade up 12px, 250ms, 50ms stagger), playhead scroll link, weekly-loop sweep, hover states. All gated on `prefers-reduced-motion`.

## New / rewritten components

- `TimelineBar.tsx` — fixed 32px full-width bar under nav. Renders section clip segments (HERO, PROOF, METHOD, SERVICES, WORK, COMPARE, BOOK, FAQ), 2px red playhead line driven by scroll, running timecode (`00:00:14:03`, IBM Plex Mono, right-aligned). Clicking a segment scrolls to that section. Mobile: timecode-only.
- `Navigation.tsx` — restyled: Studio White, 64px tall, no bottom border (timeline bar is the border). Logo left; Services, FAQ, `Book a call` right.
- `Hero.tsx` — two-column program monitor. Left: `00 · BUILT FOR DTC BRANDS` label, Archivo Expanded Black H1 "Creative strategy for 7 to 9 figure DTC brands", Graphite subline, primary CTA with mono microcopy `1 TO 2 NEW BRANDS PER MONTH`, founder row. Right: existing `HeroWall` grid reframed inside 1px Ink border with header strip (pulsing red REC dot, `CUTS GOING LIVE FOR CLIENTS`, live timecode). Capped height so hero fits one viewport.
- `ProofRow.tsx` — full-width Ink band. Large Ads Manager row: SPEND `$17K`, ROAS `2.52`, CTR `4.20%`, PURCHASES `848`. Mono headers, Archivo Expanded numerals, ROAS + CTR wear Signal Green chips. Left mono label `RITUEL · SE.80 · VERIFIED CAMPAIGN DATA`. Hairline column dividers.
- `OperatorStory.tsx` — Ink-bordered "session notes" panel on Studio White, mono header `SESSION NOTES · HOW IT STARTED`, small Jonas photo, existing three paragraphs preserved verbatim, signature block, mono file footer `JONAS BJØRNERUD · OPERATOR · TRONDHEIM NO`. Max 680px.
- `WeeklyLoop.tsx` — dark Ink section, H2 "How a week looks when I run creative.", four clips on a horizontal timeline (MON/TUE/WED/THU-FRI in-points), red playhead sweeps across once on scroll-in, end cap `LOOPS BACK TO 01 · NEXT WEEK`. Mobile stacks with left-rail track.
- `Services.tsx` (replaces current `TwoWaysToWork` styling) — two panels: Editor Placement (light) + Creative Strategy (Ink, featured, red chip `MOST BRANDS END UP HERE`). Preserve existing feature lists and route links `/editor-placement`, `/creative-strategy`.
- `CaseWork.tsx` — horizontal scroll strip restyled as clip cards: thumbnail with mono timecode chip overlay, compact metric table under (SPEND / ROAS / PURCHASE VALUE / CTR), winning values in Signal Green chips. Draggable, slow auto-scroll, pause on hover, disabled under reduced motion. Keep strategist disclaimer in 10px mono. Sourced from existing `ResultsMarquee` data.
- `Comparison.tsx` — restyled `MeVsAgency` as a clean spec table on Studio White. ME column header: red 2px top border + `THE PICK` mono label. Red `▸` for wins, Graphite `✕` for agency misses. Hairline row dividers, no fills. Preserve seven current capability rows and footnote.
- `Booking.tsx` — restyled `CalendlyBooking`. Left: `07 · GET STARTED` label, H2, scarcity line, two mono-headed lists (BOOK A CALL IF / WHAT HAPPENS ON THE CALL), "No pitch deck" footnote. Right: existing Calendly embed untouched inside 1px Ink border with mono header strip `15 MINUTE DISCOVERY · LIVE SLOTS`.
- `FAQ.tsx` — accordion with hairline dividers, no boxes. Active item: red 2px left rail, `+` rotates to `–`. Preserve all current Q&A verbatim.
- `FinalCTA.tsx` — full-width Ink band. Archivo Expanded H2 "Ready to hand creative to one operator?", Graphite-tone subline, primary-inverted CTA, right-aligned mono `2 TO 3 BRANDS MAX AT A TIME`.
- `Footer.tsx` — Ink, three columns (brand blurb, NAVIGATE, CONTACT). Bottom row: mono copyright + `END OF REEL · 00:00:58:12`. 1px top border white/10%.

## `Index.tsx` composition

```
<Navigation />
<TimelineBar />
<Hero />               id="hero"
<ProofRow />           id="proof"
<OperatorStory />      id="method-story"
<WeeklyLoop />         id="method"
<Services />           id="services"
<CaseWork />           id="work"
<Comparison />         id="compare"
<Booking />            id="booking"
<FAQ />                id="faq"
<FinalCTA />
<Footer />
```

Anchor IDs match existing scroll targets (`booking`, `faq`, `services`) so nav links keep working. Section ordering follows the spec.

## Copy rules enforced across all rewritten copy

- First person singular. No "we" / "our team".
- No em/en dashes anywhere. Existing copy is audited and rewritten with commas or restructured sentences where those dashes appear.
- Metric-first phrasing preserved in Proof and Case Work.

## Rhythm

- Section padding: 120px desktop / 64px mobile.
- Max content width: 1200px; story panel: 680px.
- Background alternation: White → Ink (Proof) → White → Ink (Weekly Loop) → White → White → White → White → White → Ink (Final CTA) → Ink (Footer). No two Ink sections adjacent except CTA→Footer.
- Responsive down to 360px: hero stacks, monitor grid → 2 cols, tables scroll horizontally, timeline bar collapses to timecode.

## Out of scope (explicitly not changing)

- Supabase, edge functions, auth, dashboards, admin, editor pages.
- Route structure and page files other than the landing composition.
- Calendly embed component internals — only its surrounding frame.
- Subpage content (`/editor-placement`, `/creative-strategy`, `/about`, jobs, etc.) — they will inherit new button/nav/footer styles automatically but layout stays as-is.

## Technical notes

- Fonts loaded in `index.html` via Google Fonts with `display=swap`, weights limited to Archivo 400/700/900 + width axis + IBM Plex Mono 400/500.
- Tailwind config extended with `fontFamily.display`, `fontFamily.mono`, `colors.ink`, `colors.frame`, `colors.playhead`, `colors.signal` (all HSL tokens).
- All colors used via semantic tokens — no hardcoded hex in components.
- Timeline bar uses `IntersectionObserver` for active-clip tracking and `requestAnimationFrame` for playhead position; timecode format `HH:MM:SS:FF` derived from `scrollY / scrollHeight`.
- Reveal animation via a small `useReveal` hook + `IntersectionObserver`, honoring `prefers-reduced-motion`.

At the end I will list every changed/added file.
