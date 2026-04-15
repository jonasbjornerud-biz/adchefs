

## Fix: Approval Count Logic

**Root cause**: The Payment Tracking CSV has 1 header row, then data rows starting at index 1. The code uses `.slice(4)` (intended to mean "row 5 in the spreadsheet"), but `Papa.parse` with `skipEmptyLines` and no headers produces different row indices than the raw spreadsheet. The actual brief/approval data starts at CSV row index 1, so `.slice(4)` skips all real data.

### Changes in `src/pages/editor/PerformanceDashboard.tsx`

1. **Fix the slice offset** — Change `.slice(4)` to `.slice(1)` in all three places it's used (approvedCount, filteredPayment, monthlyApproved) so we skip only the header row.

2. **Add a safety filter** — Only count rows where column B (index 1, Brief Name) is non-empty, to avoid counting the summary table rows (which have data in columns F/G but empty B).

### Affected lines
- Line 154: `data.paymentRaw.slice(4)` → `.slice(1)` + filter for non-empty `r[1]`
- Line 165: same fix
- Line 183: same fix

### Also fix in `src/pages/editor/ClientDashboard.tsx`
The sparkline preview card likely has the same logic — will audit and apply the same fix there.

No database or routing changes needed. Pure logic fix.

