import { cn } from "@/lib/utils";

/**
 * Ink-band hero used by client portal home + admin client preview.
 * Subtle accent dot grid + blue glow corner.
 */
export function DarkHero({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "relative z-10 bg-foreground text-background overflow-hidden",
        className,
      )}
    >
      <div
        className="absolute inset-0 opacity-[0.07] pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(hsl(var(--accent)) 1px, transparent 1.5px)",
          backgroundSize: "24px 24px",
        }}
      />
      <div
        className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, hsl(var(--accent) / 0.25) 0%, transparent 65%)",
          filter: "blur(40px)",
        }}
      />
      <div className="relative max-w-6xl mx-auto px-6 pt-20 pb-20">
        {children}
      </div>
    </section>
  );
}
