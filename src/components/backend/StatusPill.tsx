import { cn } from "@/lib/utils";

export type StatusVariant =
  | "new"
  | "qualified"
  | "sent"
  | "submitted"
  | "rejected"
  | "shortlisted"
  | "connected"
  | "not-configured"
  | "coming-soon"
  | "demo"
  | "neutral";

const STYLES: Record<StatusVariant, { bg: string; fg: string; dot?: string }> = {
  new:             { bg: "#EDECE6", fg: "#75726B", dot: "#9A988F" },
  qualified:       { bg: "linear-gradient(90deg,#BFE3F5,#ECF7FD)", fg: "#1A4A6B", dot: "#3B86A8" },
  sent:            { bg: "linear-gradient(90deg,#BFE3F5,#ECF7FD)", fg: "#1A4A6B", dot: "#3B86A8" },
  submitted:       { bg: "linear-gradient(90deg,#BFEFD0,#ECFDF3)", fg: "#1F5A3D", dot: "#2E8B57" },
  rejected:        { bg: "#EEEDE8", fg: "#75726B", dot: "#B7B5AC" },
  shortlisted:     { bg: "#1A1A1A", fg: "#F7F6F3", dot: "#9ED8F5" },
  connected:       { bg: "#ECF7FD", fg: "#1A4A6B", dot: "#3B86A8" },
  "not-configured":{ bg: "#FAF8F3", fg: "#75726B", dot: "#B7B5AC" },
  "coming-soon":   { bg: "#FAF8F3", fg: "#75726B", dot: "#75726B" },
  demo:            { bg: "#FBF4E5", fg: "#7C5A1B", dot: "#C99A2A" },
  neutral:         { bg: "#EEEDE8", fg: "#1A1A1A" },
};

export function StatusPill({
  variant,
  children,
  showDot = true,
  className,
}: {
  variant: StatusVariant;
  children: React.ReactNode;
  showDot?: boolean;
  className?: string;
}) {
  const s = STYLES[variant];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 whitespace-nowrap rounded-[3px] mono text-[10px] uppercase tracking-[0.15em] px-2 py-[5px]",
        className,
      )}
      style={{ background: s.bg, color: s.fg }}
    >
      {showDot && s.dot && (
        <span className="w-1.5 h-1.5 rounded-full" style={{ background: s.dot }} />
      )}
      {children}
    </span>
  );
}
