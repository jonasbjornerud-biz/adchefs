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

  return (
    <div
      className="group relative rounded-[10px] p-5 flex flex-col gap-4 transition-all duration-300 cursor-default animate-card-enter min-w-[180px] flex-1 flex-shrink-0 overflow-hidden border border-[#E5E3DC] hover:border-[#1A1A1A]/30 hover:-translate-y-[2px]"
      style={{
        animationDelay: `${delay}ms`,
        background: 'linear-gradient(180deg, #FFFFFF 0%, #FBFAF6 100%)',
        boxShadow: '0 1px 0 rgba(255,255,255,0.9) inset, 0 12px 32px -24px rgba(26,26,26,0.18)',
      }}
    >
      {/* Top accent rail */}
      <span
        className="absolute top-0 left-0 h-[2px] w-12 transition-all duration-500 group-hover:w-full opacity-90"
        style={{
          background: 'linear-gradient(90deg, #9ED8F5 0%, #3B86A8 50%, transparent 100%)',
          boxShadow: '0 0 8px rgba(158,216,245,0.45)',
        }}
      />
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
        <span className="w-7 h-7 rounded-[8px] flex items-center justify-center text-[#3B86A8] bg-white border border-[#E5E3DC] shadow-[0_1px_0_rgba(255,255,255,0.8)_inset]">
          {icon}
        </span>
      </div>

      <div className="flex flex-col gap-2 relative">
        <span
          className={`font-semibold text-[#0F0F0F] leading-none whitespace-nowrap tracking-[-0.03em] tabular-nums ${responsiveSize(value)}`}
          style={{ fontFamily: "'Inter Tight', sans-serif", fontWeight: 600 }}
        >
          {value}
        </span>
        {trend && (
          <span className={`inline-flex items-center gap-1 self-start rounded-full px-2 py-0.5 text-[10px] font-mono uppercase tracking-[0.12em] ${
            trend.positive
              ? "bg-[#ECF7FD] text-[#1A4A6B] ring-1 ring-[#9ED8F5]/40"
              : "bg-[#F5EDED] text-[#6B1A1A] ring-1 ring-[#E8C5C5]/60"
          }`}>
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
