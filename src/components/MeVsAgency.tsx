import { Check, X } from "lucide-react";

const rows = [
  {
    feature: "The person doing the work",
    adchefs: "An operator who reads your numbers",
    agency: "A junior behind a project manager",
  },
  {
    feature: "Briefs",
    adchefs: "Written by someone who can actually edit",
    agency: "Handed down from a PM who cannot",
  },
  {
    feature: "Performance",
    adchefs: "Live KPI dashboard, included",
    agency: "A monthly PDF, if any",
  },
  {
    feature: "Creative decisions",
    adchefs: "Driven by hook, hold, ROAS, CPA",
    agency: "Driven by taste and guesswork",
  },
  {
    feature: "Onboarding",
    adchefs: "Editor inside your brand in days",
    agency: "Rotating freelancers relearning from zero",
  },
  {
    feature: "When an ad fails",
    adchefs: "I know why, and we fix it",
    agency: "Nobody owns the number",
  },
];

const MeVsAgency = () => {
  return (
    <section className="py-16 sm:py-32 bg-background">
      <div className="mx-auto max-w-[1100px] px-6">
        <div className="max-w-2xl mb-12">
          <span className="eyebrow">THE COMPARISON</span>
          <h2 className="mt-5 font-display text-[32px] md:text-[44px] leading-[1.05] tracking-[-0.02em] text-foreground">
            Why an operator beats an <em className="font-serif">agency</em>.
          </h2>
          <p className="mt-5 text-[15px] text-muted-foreground leading-relaxed">
            Same deliverable on paper. A very different person doing the actual work.
          </p>
        </div>

        {/* Desktop table */}
        <div className="hidden md:rounded-[4px] md:border md:border-foreground/10 md:bg-card md:overflow-hidden md:block">
          {/* Header */}
          <div className="grid grid-cols-[1fr_200px_200px] items-center border-b border-foreground/10 bg-foreground/[0.02] px-8 py-4">
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              What you get
            </span>
            <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-foreground text-center font-semibold">
              AdChefs
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground text-center">
              Typical agency
            </span>
          </div>

          {rows.map((r, i) => (
            <div
              key={r.feature}
              className={`grid grid-cols-[1fr_200px_200px] items-stretch px-8 ${
                i !== rows.length - 1 ? "border-b border-foreground/5" : ""
              } ${i % 2 === 1 ? "bg-surface/40" : "bg-card"}`}
            >
              <div className="flex items-center py-5 pr-6 border-r border-foreground/5">
                <span className="text-[15px] text-foreground">{r.feature}</span>
              </div>
              <div className="relative flex flex-col items-center justify-center gap-2 py-5 px-4 bg-accent/5 border-r border-accent/10">
                <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-accent" aria-hidden />
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-ink text-paper">
                  <Check className="h-4 w-4" strokeWidth={2.5} />
                </span>
                <span className="text-[13px] text-center text-foreground font-medium">{r.adchefs}</span>
              </div>
              <div className="flex flex-col items-center justify-center gap-2 py-5 px-4">
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-muted text-muted">
                  <X className="h-4 w-4" strokeWidth={2} />
                </span>
                <span className="text-[13px] text-center text-muted-foreground">{r.agency}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile stacked cards */}
        <div className="md:hidden space-y-3">
          {rows.map((r, i) => (
            <div
              key={r.feature}
              className={`rounded-[4px] border border-foreground/10 p-5 ${
                i % 2 === 1 ? "bg-surface/40" : "bg-card"
              }`}
            >
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground block mb-4">
                {r.feature}
              </span>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-ink text-paper mt-0.5">
                    <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
                  </span>
                  <div>
                    <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-foreground block mb-0.5">
                      AdChefs
                    </span>
                    <span className="text-[14px] text-foreground">{r.adchefs}</span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-muted text-muted mt-0.5">
                    <X className="h-3.5 w-3.5" strokeWidth={2} />
                  </span>
                  <div>
                    <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground block mb-0.5">
                      Agency
                    </span>
                    <span className="text-[14px] text-muted-foreground">{r.agency}</span>
                  </div>
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
