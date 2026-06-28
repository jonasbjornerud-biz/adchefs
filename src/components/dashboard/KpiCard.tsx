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
  // Editorial serif headline — large, confident, but tightens for long numbers.
  if (value.length > 8) return "text-[44px]";
  if (value.length > 6) return "text-[52px]";
  return "text-[64px]";
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
      className="group glass-card glass-card-hover p-6 flex flex-col gap-5 cursor-default animate-card-enter min-w-[200px] flex-1 flex-shrink-0 relative"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between">
        <span className="text-[10px] uppercase tracking-[0.14em] font-mono font-medium text-[#8B887F]">
          {label}
        </span>
        <span className="w-6 h-6 flex items-center justify-center text-[#A8A59E]">
          {icon}
        </span>
      </div>

      <div className="flex flex-col gap-3">
        {hasValue ? (
          <span
            className={`ed-numeral whitespace-nowrap ${responsiveSize(display)}`}
          >
            {display}
          </span>
        ) : (
          <>
            <span className="ed-numeral text-[56px] text-[#D8D5CC] leading-none">—</span>
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#A8A59E]">
              Awaiting data
            </span>
          </>
        )}
        {hasValue && trend && (
          <span
            className={`glass-badge self-start ${trend.positive ? "glass-badge-up" : "glass-badge-down"}`}
          >
            {trend.positive ? "▲" : "▼"} {Math.abs(trend.value)}%
          </span>
        )}
      </div>

      {spark && spark.length > 1 && (
        <div className="relative mt-auto pt-2 border-t border-[#F0EEE7]">
          <Sparkline data={spark} gradId={`spark-${uid}`} threshold={threshold} />
        </div>
      )}
    </div>
  );
}
