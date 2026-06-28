import { cn } from "@/lib/utils";

/**
 * Premium backend metric card. Thin accent rail on top, large numeral,
 * mono micro-label, optional delta pill and sparkline slot.
 */
export function MetricCard({
  label,
  value,
  delta,
  hint,
  icon,
  spark,
  active = false,
  interactive = false,
  onClick,
  className,
}: {
  label: string;
  value: React.ReactNode;
  delta?: { value: number; positive: boolean };
  hint?: string;
  icon?: React.ReactNode;
  spark?: React.ReactNode;
  active?: boolean;
  interactive?: boolean;
  onClick?: () => void;
  className?: string;
}) {
  const Tag = (interactive || onClick ? "button" : "div") as any;
  const hasValue =
    value !== null && value !== undefined && value !== "" && value !== "—";
  return (
    <Tag
      onClick={onClick}
      className={cn(
        "group glass-card w-full text-left px-5 pt-5 pb-4 overflow-hidden",
        interactive || onClick ? "cursor-pointer glass-card-hover" : "",
        active && "ring-1 ring-[#9ED8F5]/60 shadow-[0_0_0_1px_rgba(158,216,245,0.45),0_28px_60px_-28px_rgba(40,72,110,0.32)]",
        className,
      )}
    >
      <span aria-hidden className="glass-rail" style={{ opacity: active ? 1 : 0.45 }} />
      <div className="flex items-center justify-between mb-3">
        <span className="mono text-[10px] uppercase tracking-[0.18em] text-[#75726B]">
          {label}
        </span>
        {icon && (
          <span className="w-7 h-7 glass-chip flex items-center justify-center text-[#3B86A8]">
            {icon}
          </span>
        )}
      </div>
      {hasValue ? (
        <div
          className="text-[28px] leading-none tabular-nums tracking-[-0.025em] text-[#0F0F0F]"
          style={{ fontFamily: "'Inter Tight', sans-serif", fontWeight: 600 }}
        >
          {value}
        </div>
      ) : (
        <div className="flex flex-col gap-1.5">
          <span className="glass-skeleton h-7 w-20" aria-hidden />
          <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-[#9A988F]">
            Awaiting data
          </span>
        </div>
      )}
      <div className="mt-3 flex items-end justify-between gap-3 min-h-[20px]">
        <div className="flex items-center gap-2">
          {hasValue && delta && (
            <span className={cn("glass-badge", delta.positive ? "glass-badge-up" : "glass-badge-down")}>
              {delta.positive ? "▲" : "▼"} {Math.abs(delta.value)}%
            </span>
          )}
          {hint && (
            <span className="mono text-[10px] uppercase tracking-[0.15em] text-[#9A988F]">
              {hint}
            </span>
          )}
        </div>
        {spark && <div className="h-5 w-[72px] opacity-80">{spark}</div>}
      </div>
    </Tag>
  );
}
