import { ReactNode, useId } from "react";
import { useCountUp } from "@/lib/useCountUp";

interface KpiCardProps {
  label: string;
  value: string | number | null | undefined;
  icon: ReactNode;
  trend?: { value: number; positive: boolean };
  delay?: number;
  spark?: number[];
  accent?: "purple" | "emerald" | "pink" | "blue";
  /** Optional horizontal threshold drawn over the sparkline (e.g. BEROAS). */
  threshold?: { value: number; label?: string };
}

function responsiveSize(value: string): string {
  // Clean sans headline — readable, tightens for long numbers.
  if (value.length > 8) return "text-[28px]";
  if (value.length > 6) return "text-[32px]";
  return "text-[36px]";
}

function Sparkline({ data, gradId, threshold }: { data: number[]; gradId: string; threshold?: { value: number; label?: string } }) {
  if (!data || data.length < 2) return null;
  const w = 120;
  const h = 28;
  const thresholdVal = threshold?.value;
  const min = Math.min(...data, ...(thresholdVal !== undefined ? [thresholdVal] : []));
  const max = Math.max(...data, ...(thresholdVal !== undefined ? [thresholdVal] : []));
  const range = max - min || 1;
  const step = w / (data.length - 1);
  const points = data.map((v, i) => `${i * step},${h - ((v - min) / range) * h}`).join(" ");
  const area = `0,${h} ${points} ${w},${h}`;
  const thY = thresholdVal !== undefined ? h - ((thresholdVal - min) / range) * h : 0;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-7 overflow-visible" preserveAspectRatio="none">
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#111111" stopOpacity={0.10} />
          <stop offset="100%" stopColor="#111111" stopOpacity={0} />
        </linearGradient>
      </defs>
      <polygon points={area} fill={`url(#${gradId})`} />
      <polyline points={points} fill="none" stroke="#111111" strokeWidth={1.25} strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
      {thresholdVal !== undefined && (
        <g>
          <line x1={0} x2={w} y1={thY} y2={thY} stroke="#A8A59E" strokeWidth={0.75} strokeDasharray="1 3" vectorEffect="non-scaling-stroke" />
          {threshold?.label && (
            <text x={w - 2} y={Math.max(7, thY - 2)} textAnchor="end" fontSize="6.5" fontFamily="'JetBrains Mono', monospace" fill="#8B887F">{threshold.label}</text>
          )}
        </g>
      )}
    </svg>
  );
}

export function KpiCard({ label, value, icon, trend, delay = 0, spark, threshold }: KpiCardProps) {
  const uid = useId().replace(/:/g, "");
  // "Awaiting data" branch — null/undefined or unwired sentinel ("—") render a
  // skeleton shimmer + mono caption instead of a stark zero.
  const hasValue =
    value !== null && value !== undefined && value !== "" && value !== "—";
  const isNumeric = typeof value === "number" && Number.isFinite(value);
  const animated = useCountUp(isNumeric ? (value as number) : null);
  const display = hasValue
    ? (isNumeric
        ? Math.round(animated as number).toLocaleString()
        : String(value))
    : "";

  return (
    <div
      className="group bg-white border border-[#E5E3DC] rounded-[8px] p-5 flex flex-col gap-4 cursor-default animate-card-enter min-w-[200px] flex-1 flex-shrink-0 relative transition-colors hover:border-[#1A1A1A]/25"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between">
        <span className="text-[11px] uppercase tracking-[0.1em] font-medium text-[#75726B]">
          {label}
        </span>
        <span className="w-5 h-5 flex items-center justify-center text-[#A8A59E]">
          {icon}
        </span>
      </div>

      <div className="flex items-baseline gap-3">
        {hasValue ? (
          <span
            className={`whitespace-nowrap font-semibold tracking-tight tabular-nums text-[#0F0F0F] ${responsiveSize(display)}`}
            style={{ fontFamily: "'Inter Tight', sans-serif" }}
          >
            {display}
          </span>
        ) : (
          <span className="text-[32px] font-semibold text-[#D8D5CC] leading-none" style={{ fontFamily: "'Inter Tight', sans-serif" }}>—</span>
        )}
        {hasValue && trend && (
          <span
            className={`text-[11px] font-medium tabular-nums ${trend.positive ? "text-[#1F8A4C]" : "text-[#C0463A]"}`}
          >
            {trend.positive ? "▲" : "▼"} {Math.abs(trend.value)}%
          </span>
        )}
      </div>

      {spark && spark.length > 1 && (
        <div className="relative mt-auto pt-3 border-t border-[#F0EEE7]">
          <Sparkline data={spark} gradId={`spark-${uid}`} threshold={threshold} />
        </div>
      )}
    </div>
  );
}
