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
}

function responsiveSize(value: string): string {
  if (value.length > 8) return "text-[26px]";
  if (value.length > 6) return "text-[32px]";
  return "text-[40px]";
}

function Sparkline({ data, gradId }: { data: number[]; gradId: string }) {
  if (!data || data.length < 2) return null;
  const w = 120;
  const h = 42;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const step = w / (data.length - 1);
  const points = data.map((v, i) => `${i * step},${h - ((v - min) / range) * h}`).join(" ");
  const area = `0,${h} ${points} ${w},${h}`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-10 overflow-visible" preserveAspectRatio="none">
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#9ED8F5" stopOpacity={0.55} />
          <stop offset="100%" stopColor="#9ED8F5" stopOpacity={0} />
        </linearGradient>
        <linearGradient id={`${gradId}-line`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#3B86A8" />
          <stop offset="100%" stopColor="#1A1A1A" />
        </linearGradient>
      </defs>
      <polygon points={area} fill={`url(#${gradId})`} />
      <polyline points={points} fill="none" stroke={`url(#${gradId}-line)`} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function KpiCard({ label, value, icon, trend, delay = 0, spark }: KpiCardProps) {
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
      className="group glass-card glass-card-hover p-5 flex flex-col gap-4 cursor-default animate-card-enter min-w-[180px] flex-1 flex-shrink-0 overflow-hidden"
      style={{ animationDelay: `${delay}ms` }}
    >
      <span aria-hidden className="glass-rail" />
      {/* Subtle wash bottom-right */}
      <span
        aria-hidden
        className="pointer-events-none absolute -right-12 -bottom-12 w-40 h-40 rounded-full opacity-50"
        style={{ background: 'radial-gradient(circle, rgba(158,216,245,0.18) 0%, transparent 65%)' }}
      />

      <div className="flex items-start justify-between relative">
        <span className="text-[10px] uppercase tracking-[0.2em] font-mono font-medium text-[#75726B]">
          {label}
        </span>
        <span className="w-7 h-7 glass-chip flex items-center justify-center text-[#3B86A8]">
          {icon}
        </span>
      </div>

      <div className="flex flex-col gap-2 relative">
        {hasValue ? (
          <span
            className={`font-semibold text-[#0F0F0F] leading-none whitespace-nowrap tracking-[-0.03em] tabular-nums ${responsiveSize(display)}`}
            style={{ fontFamily: "'Inter Tight', sans-serif", fontWeight: 600 }}
          >
            {display}
          </span>
        ) : (
          <>
            <span className="glass-skeleton h-9 w-24" aria-hidden />
            <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-[#9A988F]">
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
        <div className="relative -mx-1 -mb-1 mt-auto">
          <Sparkline data={spark} gradId={`spark-${uid}`} />
        </div>
      )}
    </div>
  );
}
