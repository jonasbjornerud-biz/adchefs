// Helpers for week-to-date (WTD) summaries on dashboard cards.
// Week starts Monday. If today is Monday, range = today only.

export interface WtdRange {
  start: Date;
  end: Date; // today, end of day
  label: string; // e.g. "Mon – Thu" or "Today"
  daysCount: number;
}

export function getWeekToDateRange(now: Date = new Date()): WtdRange {
  const today = new Date(now);
  today.setHours(23, 59, 59, 999);

  // JS: Sunday=0, Monday=1, ... Saturday=6. Week starts Monday.
  const day = today.getDay();
  const daysSinceMonday = day === 0 ? 6 : day - 1;

  const start = new Date(today);
  start.setDate(today.getDate() - daysSinceMonday);
  start.setHours(0, 0, 0, 0);

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const label =
    daysSinceMonday === 0
      ? "Today"
      : `${dayNames[start.getDay()]} – ${dayNames[today.getDay()]}`;

  return { start, end: today, label, daysCount: daysSinceMonday + 1 };
}

export function formatCurrency(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(1)}k`;
  return `$${Math.round(n).toLocaleString()}`;
}

export function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`;
  return String(Math.round(n));
}
