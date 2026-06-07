import { ReactNode, useId } from "react";

interface KpiCardProps {
  label: string;
  value: string;
  icon: ReactNode;
  trend?: { value: number; positive: boolean };
  delay?: number;
  spark?: number[];
  accent?: "purple" | "emerald" | "pink" | "blue";
}

function responsiveSize(value: string): string {
  if (value.length > 8) return "text-2xl";
  if (value.length > 6) return "text-3xl";
  return "text-4xl";
}

function Sparkline({ data, gradId }: { data: number[]; gradId: string }) {
  if (!data || data.length < 2) return null;
  const w = 120;
  const h = 36;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const step = w / (data.length - 1);
  const points = data.map((v, i) => `${i * step},${h - ((v - min) / range) * h}`).join(" ");
  const area = `0,${h} ${points} ${w},${h}`;
  const color = "#1A1A1A";
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-9 overflow-visible" preserveAspectRatio="none">
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#9ED8F5" stopOpacity={0.5} />
          <stop offset="100%" stopColor="#9ED8F5" stopOpacity={0} />
        </linearGradient>
      </defs>
      <polygon points={area} fill={`url(#${gradId})`} />
      <polyline points={points} fill="none" stroke={color} strokeWidth={1.25} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function KpiCard({ label, value, icon, trend, delay = 0, spark }: KpiCardProps) {
  const uid = useId().replace(/:/g, "");

  return (
    <div
      className="group relative rounded-[4px] p-5 flex flex-col gap-4 transition-all duration-300 cursor-default animate-card-enter min-w-[180px] flex-1 flex-shrink-0 overflow-hidden bg-white border border-[#E2E0D9] hover:border-[#1A1A1A] hover:-translate-y-0.5"
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Accent corner mark */}
      <span className="absolute top-0 left-0 h-px w-10 bg-[#9ED8F5] transition-all duration-300 group-hover:w-20" />

      <div className="flex items-start justify-between relative">
        <span className="text-[10px] uppercase tracking-[0.15em] font-mono font-medium text-[#75726B] flex items-center gap-1.5">
          {label}
        </span>
        <span className="w-7 h-7 rounded-[4px] flex items-center justify-center text-[#1A1A1A] bg-[#F7F6F3] border border-[#E2E0D9]">
          {icon}
        </span>
      </div>

      <div className="flex flex-col gap-2 relative">
        <span className={`font-semibold text-[#1A1A1A] leading-none whitespace-nowrap tracking-tight tabular-nums ${responsiveSize(value)}`}>
          {value}
        </span>
        {trend && (
          <span className={`inline-flex items-center self-start rounded-[4px] px-2 py-0.5 text-[10px] font-mono uppercase tracking-[0.1em] border ${
            trend.positive
              ? "bg-[#9ED8F5]/25 text-[#1A1A1A] border-[#9ED8F5]"
              : "bg-[#1A1A1A]/[0.04] text-[#75726B] border-[#E2E0D9]"
          }`}>
            {trend.positive ? "▲" : "▼"} {Math.abs(trend.value)}%
          </span>
        )}
      </div>

      {spark && spark.length > 1 && (
        <div className="relative -mx-1 -mb-1">
          <Sparkline data={spark} gradId={`spark-${uid}`} />
        </div>
      )}
    </div>
  );
}
