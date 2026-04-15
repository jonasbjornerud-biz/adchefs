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
      className="bg-card-surface border border-purple rounded-[16px] shadow-card p-5 md:p-7 flex flex-col gap-3 transition-all duration-300 hover:border-purple-hover hover:scale-[1.005] animate-card-enter"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs uppercase tracking-[0.15em] font-medium text-muted-readable">
          {label}
        </span>
        <div className="w-12 h-12 rounded-full flex items-center justify-center border border-purple-hover"
          style={{
            background: "linear-gradient(135deg, rgba(139, 92, 246, 0.15), rgba(99, 102, 241, 0.1))",
            boxShadow: "0 0 16px rgba(139, 92, 246, 0.1)",
          }}
        >
          <span className="text-[#8B5CF6]">{icon}</span>
        </div>
      </div>
      <div className="flex items-end gap-3">
        <span className="font-mono text-2xl md:text-3xl font-bold text-primary-readable">{value}</span>
        {trend && (
          <span className={`text-xs font-medium mb-1 ${trend.positive ? "text-[#10B981]" : "text-[#EF4444]"}`}>
            {trend.positive ? "▲" : "▼"} {Math.abs(trend.value)}%
          </span>
        )}
      </div>
    </div>
  );
}