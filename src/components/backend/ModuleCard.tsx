import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { StatusPill, StatusVariant } from "./StatusPill";

export function ModuleCard({
  index,
  total,
  icon,
  titlePrefix,
  emphasis,
  description,
  status,
  statusLabel,
  rangeLabel,
  stats,
  loading,
  enabled = true,
  onClick,
}: {
  index: number;
  total: number;
  icon: React.ReactNode;
  titlePrefix: string;
  emphasis: string;
  description: string;
  status: StatusVariant;
  statusLabel: string;
  rangeLabel?: string;
  stats?: { label: string; value: string }[];
  loading?: boolean;
  enabled?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={() => enabled && onClick?.()}
      disabled={!enabled}
      className={cn(
        "group text-left relative overflow-hidden rounded-[12px] p-8 transition-all duration-500 border w-full",
        enabled
          ? "cursor-pointer border-[#E5E3DC] hover:border-[#1A1A1A]/30 hover:-translate-y-[3px]"
          : "cursor-not-allowed opacity-60 border-[#E2E0D9]",
      )}
      style={{
        background: "linear-gradient(180deg,#FFFFFF 0%, #FBFAF6 100%)",
        boxShadow: enabled
          ? "0 1px 0 rgba(255,255,255,0.9) inset, 0 18px 40px -28px rgba(26,26,26,0.25)"
          : "0 1px 0 rgba(255,255,255,0.7) inset",
      }}
    >
      <span
        className="absolute top-0 left-0 h-[2px] transition-all duration-500 group-hover:w-full"
        style={{
          width: enabled ? "80px" : "24px",
          background: "linear-gradient(90deg,#9ED8F5 0%,#3B86A8 50%,transparent 100%)",
          boxShadow: enabled ? "0 0 10px rgba(158,216,245,0.5)" : "none",
        }}
      />
      {enabled && (
        <span
          aria-hidden
          className="pointer-events-none absolute -right-24 -top-24 w-72 h-72 rounded-full opacity-60 transition-opacity duration-500 group-hover:opacity-100"
          style={{ background: "radial-gradient(circle, rgba(158,216,245,0.18) 0%, transparent 65%)" }}
        />
      )}

      <div className="relative flex flex-col h-full min-h-[280px]">
        <div className="flex items-start justify-between mb-8">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center justify-center w-9 h-9 rounded-[8px] bg-white border border-[#E5E3DC] text-[#3B86A8] shadow-[0_1px_0_rgba(255,255,255,0.8)_inset]">
              {icon}
            </span>
            <span className="mono text-[10px] uppercase tracking-[0.22em] text-[#8A8780]">
              {String(index).padStart(2, "0")} / {String(total).padStart(2, "0")}
            </span>
          </div>
          <span className="w-9 h-9 rounded-full flex items-center justify-center border border-transparent group-hover:border-[#1A1A1A]/15 transition-all duration-300">
            <ArrowRight className="w-4 h-4 text-[#1A1A1A] transition-transform duration-300 group-hover:translate-x-0.5" strokeWidth={1.75} />
          </span>
        </div>

        <h3
          className="text-[30px] leading-[1.02] tracking-[-0.025em] mb-3"
          style={{ fontFamily: "'Inter Tight', sans-serif", fontWeight: 700 }}
        >
          {titlePrefix} <em>{emphasis}</em>
        </h3>
        <p className="text-[14px] text-[#75726B] leading-relaxed max-w-sm">
          {enabled
            ? description
            : "Not configured yet. Connect data to activate this dashboard."}
        </p>

        {enabled && stats && stats.length > 0 && (
          <div
            className="mt-7 mb-6 grid grid-cols-2 gap-px rounded-[10px] overflow-hidden border border-[#E5E3DC]"
            style={{ background: "#E5E3DC" }}
          >
            {stats.map((s, i) => (
              <div key={i} className="px-4 py-4" style={{ background: "linear-gradient(180deg,#FFFFFF 0%, #FBFAF6 100%)" }}>
                <div className="text-[9px] uppercase tracking-[0.22em] font-mono text-[#8A8780] mb-1.5">
                  {s.label}
                </div>
                <div
                  className="text-[22px] tracking-[-0.025em] tabular-nums text-[#0F0F0F]"
                  style={{ fontFamily: "'Inter Tight', sans-serif", fontWeight: 600 }}
                >
                  {loading ? (
                    <span className="inline-block w-14 h-6 rounded-sm bg-[#EFEEE8] animate-pulse" />
                  ) : (
                    s.value
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between pt-5 border-t border-[#E2E0D9] mt-auto">
          <StatusPill variant={status}>{statusLabel}</StatusPill>
          {enabled && rangeLabel && (
            <span className="text-[10px] font-mono uppercase tracking-[0.15em] text-[#1A1A1A]">
              {rangeLabel}
            </span>
          )}
        </div>
      </div>
    </button>
  );
}
