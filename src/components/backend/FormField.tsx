import * as React from "react";
import { cn } from "@/lib/utils";

/** Branded input wrapper — hairline border, accent focus ring, paper bg. */
export const FormField = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "w-full h-11 rounded-[4px] border border-[#E2E0D9] bg-white px-3.5",
        "text-[14px] text-[#1A1A1A] placeholder:text-[#9A988F]",
        "focus:outline-none focus:border-[#3B86A8] focus:ring-2 focus:ring-[#9ED8F5]/40",
        "transition-colors",
        className,
      )}
      {...props}
    />
  ),
);
FormField.displayName = "FormField";

export function FormLabel({ children, hint }: { children: React.ReactNode; hint?: string }) {
  return (
    <div className="flex items-baseline justify-between mb-1.5">
      <label className="mono text-[10px] uppercase tracking-[0.18em] text-[#1A1A1A]">
        {children}
      </label>
      {hint && (
        <span className="mono text-[10px] uppercase tracking-[0.15em] text-[#9A988F]">
          {hint}
        </span>
      )}
    </div>
  );
}

export function FormHint({
  children,
  tone = "muted",
}: {
  children: React.ReactNode;
  tone?: "muted" | "ok" | "error";
}) {
  const color =
    tone === "ok"
      ? "text-[#1F5A3D]"
      : tone === "error"
      ? "text-[#7C2A2A]"
      : "text-[#75726B]";
  return (
    <p className={cn("mt-1.5 mono text-[10px] uppercase tracking-[0.15em]", color)}>
      {children}
    </p>
  );
}
