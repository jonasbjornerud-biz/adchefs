Add `onClick={e => e.stopPropagation()}` to every `target="_blank"` anchor in `src/components/recruitment/RecruitmentPanel.tsx` that doesn't already have it. No other changes.

## Anchors to update

1. **Line ~188** — Drive "Open" button in `EmbeddedSubmission` (Drive branch)
2. **Line ~218** — "Open" overlay anchor on top of the iframe preview
3. **Line ~240** — Generic "Open" button in the fallback link card
4. **Line ~855** — Portfolio URL link in the applicant detail panel (`selected.portfolio_url`)
5. **Line ~937** — "Open on {host}" link below `EmbeddedSubmission` in the trial submission section

## Already has it (skip)

- Line ~778 — shortlist table Play-button anchor already has `onClick={e => e.stopPropagation()}`

## Out of scope

- `<Button asChild>` wrapping `mailto:` anchors (not `target="_blank"`)
- All non-anchor click handlers
