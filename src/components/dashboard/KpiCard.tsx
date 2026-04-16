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

const accentMap = {
  purple: { stroke: "#a855f7", glow: "rgba(168,85,247,0.35)", iconBg: "rgba(168,85,247,0.12)", iconRing: "rgba(168,85,247,0.25)" },
  emerald: { stroke: "#34d399", glow: "rgba(52,211,153,0.30)", iconBg: "rgba(52,211,153,0.10)", iconRing: "rgba(52,211,153,0.22)" },
  pink: { stroke: "#ec4899", glow: "rgba(236,72,153,0.30)", iconBg: "rgba(236,72,153,0.10)", iconRing: "rgba(236,72,153,0.22)" },
  blue: { stroke: "#60a5fa", glow: "rgba(96,165,250,0.30)", iconBg: "rgba(96,165,250,0.10)", iconRing: "rgba(96,165,250,0.22)" },
};

function responsiveSize(value: string): string {
  if (value.length > 8) return "text-2xl";
  if (value.length > 6) return "text-3xl";
  return "text-4xl";
}

function Sparkline({ data, color, gradId }: { data: number[]; color: string; gradId: string }) {
  if (!data || data.length < 2) return null;
  const w = 120;
  const h = 36;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const step = w / (data.length - 1);
  const points = data.map((v, i) => `${i * step},${h - ((v - min) / range) * h}`).join(" ");
  const area = `0,${h} ${points} ${w},${h}`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-9 overflow-visible" preserveAspectRatio="none">
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.35} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
      <polygon points={area} fill={`url(#${gradId})`} />
      <polyline points={points} fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function KpiCard({ label, value, icon, trend, delay = 0, spark, accent = "purple" }: KpiCardProps) {
  const a = accentMap[accent];
  const uid = useId().replace(/:/g, "");

  return (
    <div
      className="group relative rounded-2xl p-5 flex flex-col gap-4 transition-all duration-300 cursor-default animate-card-enter min-w-[180px] flex-1 flex-shrink-0 overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.015) 100%)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.07)',
        boxShadow: '0 1px 0 rgba(255,255,255,0.05) inset, 0 20px 40px -20px rgba(0,0,0,0.6)',
        animationDelay: `${delay}ms`,
      }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLElement;
        el.style.borderColor = a.iconRing;
        el.style.boxShadow = `0 1px 0 rgba(255,255,255,0.06) inset, 0 20px 40px -20px rgba(0,0,0,0.6), 0 0 30px -5px ${a.glow}`;
        el.style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLElement;
        el.style.borderColor = 'rgba(255,255,255,0.07)';
        el.style.boxShadow = '0 1px 0 rgba(255,255,255,0.05) inset, 0 20px 40px -20px rgba(0,0,0,0.6)';
        el.style.transform = 'translateY(0)';
      }}
    >
      {/* Top sheen */}
      <div className="absolute inset-x-0 top-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${a.glow}, transparent)` }} />

      <div className="flex items-start justify-between relative">
        <span className="text-[10px] uppercase tracking-[0.18em] font-semibold text-white/50 flex items-center gap-1.5">
          <span className="w-1 h-1 rounded-full" style={{ background: a.stroke, boxShadow: `0 0 6px ${a.glow}` }} />
          {label}
        </span>
        <span
          className="w-7 h-7 rounded-lg flex items-center justify-center text-white/80"
          style={{ background: a.iconBg, border: `1px solid ${a.iconRing}` }}
        >
          {icon}
        </span>
      </div>

      <div className="flex flex-col gap-2 relative">
        <span className={`font-black text-white leading-none whitespace-nowrap tracking-tight ${responsiveSize(value)}`}>
          {value}
        </span>
        {trend && (
          <span className={`inline-flex items-center self-start rounded-full px-2 py-0.5 text-[11px] font-semibold ${
            trend.positive
              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
              : "bg-red-500/10 text-red-400 border border-red-500/20"
          }`}>
            {trend.positive ? "▲" : "▼"} {Math.abs(trend.value)}%
          </span>
        )}
      </div>

      {spark && spark.length > 1 && (
        <div className="relative -mx-1 -mb-1">
          <Sparkline data={spark} color={a.stroke} gradId={`spark-${uid}`} />
        </div>
      )}
    </div>
  );
}
