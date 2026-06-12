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
  return (
    <Tag
      onClick={onClick}
      className={cn(
        "group relative w-full text-left rounded-[6px] border bg-white px-5 pt-5 pb-4 overflow-hidden",
        "transition-[transform,box-shadow,border-color] duration-200",
        interactive || onClick ? "cursor-pointer hover:-translate-y-px" : "",
        active
          ? "border-[#1A1A1A] shadow-[0_1px_2px_rgba(26,26,26,0.04),0_12px_28px_-16px_rgba(26,26,26,0.18)]"
          : "border-[#E2E0D9] hover:border-[#1A1A1A]/40 hover:shadow-[0_1px_2px_rgba(26,26,26,0.04),0_8px_24px_-14px_rgba(26,26,26,0.12)]",
        className,
      )}
    >
      <span
        aria-hidden
        className="absolute top-0 left-0 right-0 h-[2px] transition-opacity duration-200"
        style={{
          background:
            "linear-gradient(90deg,#9ED8F5 0%,#3B86A8 50%,transparent 100%)",
          opacity: active ? 1 : 0.35,
        }}
      />
      <div className="flex items-center justify-between mb-3">
        <span className="mono text-[10px] uppercase tracking-[0.18em] text-[#75726B]">
          {label}
        </span>
        {icon && (
          <span className="text-[#75726B] group-hover:text-[#3B86A8] transition-colors">
            {icon}
          </span>
        )}
      </div>
      <div
        className="text-[28px] leading-none tabular-nums tracking-[-0.025em] text-[#0F0F0F]"
        style={{ fontFamily: "'Inter Tight', sans-serif", fontWeight: 600 }}
      >
        {value}
      </div>
      <div className="mt-3 flex items-end justify-between gap-3 min-h-[20px]">
        <div className="flex items-center gap-2">
          {delta && (
            <span
              className={cn(
                "mono text-[10px] uppercase tracking-[0.15em] px-1.5 py-0.5 rounded-[3px]",
                delta.positive
                  ? "text-[#1F5A3D] bg-[#ECFDF3]"
                  : "text-[#7C2A2A] bg-[#FCEDED]",
              )}
            >
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
