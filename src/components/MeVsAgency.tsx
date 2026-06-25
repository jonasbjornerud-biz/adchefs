import { Check, X } from "lucide-react";

const rows = [
  "An operator who reads your ad numbers weekly",
  "Briefs written by someone who can actually edit",
  "Shot by shot direction, not just a script",
  "Live KPI dashboard, included free",
  "New creative batches shipped every week",
  "Fast creative iterations, no month long wait to launch",
  "One person who owns the result end to end",
];

const MeVsAgency = () => {
  return (
    <section className="py-16 sm:py-32 bg-background">
      <div className="mx-auto max-w-[1000px] px-6">
        <div className="max-w-2xl mb-12">
          <span className="eyebrow">THE COMPARISON</span>
          <h2 className="mt-5 font-display text-[32px] md:text-[44px] leading-[1.05] tracking-[-0.02em] text-foreground">
            <em className="font-serif">Me</em> vs a regular agency.
          </h2>
          <p className="mt-5 text-[15px] text-muted-foreground leading-relaxed">
            Same deliverable on paper. A very different person doing the actual work.
          </p>
        </div>

        {/* Desktop: 3-column layout with solid ME column */}
        <div className="hidden md:flex gap-0 rounded-[4px] border border-foreground/10 bg-card overflow-hidden">
          {/* Labels column */}
          <div className="flex-1 flex flex-col">
            <div className="px-6 py-4 border-b border-foreground/10 bg-foreground/[0.02]">
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                What you get
              </span>
            </div>
            {rows.map((label, i) => (
              <div
                key={label}
                className={`flex items-center px-6 py-5 ${
                  i !== rows.length - 1 ? "border-b border-foreground/5" : ""
                } ${i % 2 === 1 ? "bg-surface/40" : ""}`}
              >
                <span className="text-[15px] text-foreground leading-snug">{label}</span>
              </div>
            ))}
          </div>

          {/* ME column: solid Ink block */}
          <div className="w-[180px] flex flex-col bg-ink rounded-[4px] my-[-1px] mx-[-1px] z-10 shadow-sm">
            <div className="px-4 py-4 border-b border-paper/10">
              <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-paper font-semibold block text-center">
                ME
              </span>
            </div>
            {rows.map((label, i) => (
              <div
                key={label}
                className={`flex flex-col items-center justify-center px-4 py-5 ${
                  i !== rows.length - 1 ? "border-b border-paper/10" : ""
                }`}
              >
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-accent text-ink">
                  <Check className="h-4 w-4" strokeWidth={2.5} />
                </span>
              </div>
            ))}
          </div>

          {/* Agency column */}
          <div className="w-[140px] flex flex-col">
            <div className="px-4 py-4 border-b border-foreground/10 bg-foreground/[0.02]">
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground block text-center">
                CREATIVE AGENCY
              </span>
            </div>
            {rows.map((label, i) => (
              <div
                key={label}
                className={`flex flex-col items-center justify-center px-4 py-5 ${
                  i !== rows.length - 1 ? "border-b border-foreground/5" : ""
                }`}
              >
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-muted text-muted">
                  <X className="h-4 w-4" strokeWidth={2} />
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile: stacked cards */}
        <div className="md:hidden space-y-3">
          {rows.map((label, i) => (
            <div
              key={label}
              className={`rounded-[4px] border border-foreground/10 p-5 ${
                i % 2 === 1 ? "bg-surface/40" : "bg-card"
              }`}
            >
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground block mb-4">
                {label}
              </span>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col items-center gap-2 rounded-[4px] bg-ink p-4">
                  <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-paper/70">ME</span>
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-accent text-ink">
                    <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
                  </span>
                </div>
                <div className="flex flex-col items-center gap-2 rounded-[4px] border border-foreground/10 p-4">
                  <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Agency</span>
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-muted text-muted">
                    <X className="h-3.5 w-3.5" strokeWidth={2} />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <p className="mt-6 text-[13px] text-muted-foreground italic max-w-xl">
          Some agencies are excellent. Most are not built for brands that just want video that ships and works.
        </p>
      </div>
    </section>
  );
};

export default MeVsAgency;
