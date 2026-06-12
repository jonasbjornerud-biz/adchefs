import { cn } from "@/lib/utils";

type Variant = "default" | "accent" | "ink" | "muted";
const VARIANT: Record<Variant, string> = {
  default: "text-[#3B86A8] border-[#3B86A8]/40 bg-white/50",
  accent: "text-[#1A1A1A] border-[#9ED8F5] bg-[#ECF7FD]",
  ink: "text-[#F5F4EE] border-white/15 bg-white/[0.04]",
  muted: "text-[#75726B] border-[#E2E0D9] bg-transparent",
};

export function Eyebrow({
  children,
  variant = "default",
  className,
}: {
  children: React.ReactNode;
  variant?: Variant;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-block mono text-[10px] uppercase tracking-[0.18em] rounded-[4px] border px-[10px] py-[5px] backdrop-blur-sm",
        VARIANT[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
