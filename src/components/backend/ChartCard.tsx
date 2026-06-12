import { cn } from "@/lib/utils";
import { StatusPill } from "./StatusPill";

export function ChartCard({
  title,
  subtitle,
  eyebrow,
  actions,
  demo = false,
  children,
  className,
}: {
  title?: string;
  subtitle?: string;
  eyebrow?: string;
  actions?: React.ReactNode;
  demo?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "relative rounded-[6px] border border-[#E2E0D9] bg-white overflow-hidden",
        "shadow-[0_1px_2px_rgba(26,26,26,0.04)]",
        className,
      )}
    >
      <span
        aria-hidden
        className="absolute top-0 left-0 right-0 h-[2px]"
        style={{
          background:
            "linear-gradient(90deg,#9ED8F5 0%,#3B86A8 35%,transparent 100%)",
          opacity: 0.6,
        }}
      />
      {(title || eyebrow || actions) && (
        <header className="flex items-end justify-between gap-4 px-6 pt-6 pb-4 border-b border-[#EEEDE8]">
          <div className="min-w-0">
            {eyebrow && (
              <p className="mono text-[10px] uppercase tracking-[0.18em] text-[#75726B] mb-1.5">
                {eyebrow}
              </p>
            )}
            {title && (
              <h3
                className="text-[18px] tracking-[-0.015em] text-[#1A1A1A]"
                style={{ fontFamily: "'Inter Tight', sans-serif", fontWeight: 600 }}
              >
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="mt-1 text-[12px] text-[#75726B]">{subtitle}</p>
            )}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {demo && <StatusPill variant="demo">Sample data</StatusPill>}
            {actions}
          </div>
        </header>
      )}
      <div className="p-6">{children}</div>
    </section>
  );
}
