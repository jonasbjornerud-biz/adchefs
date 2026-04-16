import { ReactNode } from "react";

interface KpiCardProps {
  label: string;
  value: string;
  icon: ReactNode;
  trend?: { value: number; positive: boolean };
  delay?: number;
}

export function KpiCard({ label, value, icon, trend, delay = 0 }: KpiCardProps) {
  return (
    <div
      className="group bg-[#111118] rounded-2xl p-6 flex flex-col gap-3 transition-all duration-200 cursor-default animate-card-enter"
      style={{
        boxShadow: '0 0 0 1px rgba(255,255,255,0.06) inset, 0 4px 24px rgba(0,0,0,0.4)',
        animationDelay: `${delay}ms`,
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.boxShadow = '0 0 0 1px rgba(168,85,247,0.2) inset, 0 0 0 1px rgba(99,102,241,0.1) inset, 0 4px 24px rgba(0,0,0,0.4)';
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.boxShadow = '0 0 0 1px rgba(255,255,255,0.06) inset, 0 4px 24px rgba(0,0,0,0.4)';
      }}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs uppercase tracking-[0.15em] font-medium text-white/60">
          {label}
        </span>
        <span className="text-white/30">{icon}</span>
      </div>
      <div className="flex items-end gap-3">
        <span className="font-black text-4xl text-white leading-none">{value}</span>
        {trend && (
          <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
            trend.positive
              ? "bg-emerald-500/10 text-emerald-400"
              : "bg-red-500/10 text-red-400"
          }`}>
            {trend.positive ? "▲" : "▼"} {Math.abs(trend.value)}%
          </span>
        )}
      </div>
    </div>
  );
}
