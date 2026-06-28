import { cn } from "@/lib/utils";

export function EmptyState({
  eyebrow,
  title,
  body,
  icon,
  action,
  className,
}: {
  eyebrow?: string;
  title: string;
  body?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative rounded-[6px] border border-[#E2E0D9] bg-white px-8 py-14 text-center overflow-hidden",
        className,
      )}
    >
      <span
        aria-hidden
        className="absolute top-0 left-1/2 -translate-x-1/2 h-[2px] w-24 rounded-b"
        style={{
          background:
            "linear-gradient(90deg,transparent 0%,#9ED8F5 50%,transparent 100%)",
        }}
      />
      {icon && (
        <div className="mx-auto mb-4 w-10 h-10 rounded-[6px] border border-[#E2E0D9] bg-[#FAF8F3] flex items-center justify-center text-[#3B86A8]">
          {icon}
        </div>
      )}
      {eyebrow && (
        <p className="mono text-[10px] uppercase tracking-[0.18em] text-[#3B86A8] mb-3">
          {eyebrow}
        </p>
      )}
      <h3
        className="text-[20px] tracking-[-0.02em] text-[#1A1A1A]"
        style={{ fontFamily: "'Inter Tight', sans-serif", fontWeight: 600 }}
      >
        {title}
      </h3>
      {body && (
        <p className="mt-2 text-[13px] text-[#75726B] max-w-md mx-auto leading-relaxed">
          {body}
        </p>
      )}
      {action && <div className="mt-5 flex items-center justify-center">{action}</div>}
    </div>
  );
}
