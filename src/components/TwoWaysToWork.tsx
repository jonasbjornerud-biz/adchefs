import { Button } from "@/components/ui/button";
import { ArrowRight, Check, X } from "lucide-react";

const scrollToBooking = () => {
  const el = document.getElementById("booking");
  if (el) el.scrollIntoView({ behavior: "smooth" });
};

type Row = { feature: string; us: boolean; them: boolean };

const strategyRows: Row[] = [
  { feature: "In-house system building", us: true, them: false },
  { feature: "A+ team building", us: true, them: false },
  { feature: "High creative output (60+ concepts a month)", us: true, them: false },
  { feature: "Fast creative iterations", us: true, them: false },
  { feature: "Creative batches ready every week", us: true, them: false },
  { feature: "Lower retainer + winning bonuses", us: true, them: false },
  { feature: "Dedicated editor placement included", us: true, them: false },
  { feature: "Operator who reads your ad numbers weekly", us: true, them: false },
];

const placementRows: Row[] = [
  { feature: "Pay per delivered video, from $100", us: true, them: false },
  { feature: "Vetted editor onboarded in days", us: true, them: false },
  { feature: "24 to 48 hour turnaround", us: true, them: false },
  { feature: "Trained on direct-response, not wedding cuts", us: true, them: false },
  { feature: "Replaced fast if it isn't clicking", us: true, them: false },
  { feature: "All software covered (Premiere, Higgsfield, ElevenLabs)", us: true, them: false },
  { feature: "No retainer, no contract length", us: true, them: false },
];

const ComparisonTable = ({
  rows,
  themLabel,
}: {
  rows: Row[];
  themLabel: string;
}) => {
  return (
    <div className="relative">
      <div className="grid grid-cols-[1fr_120px_120px] md:grid-cols-[1fr_180px_180px] rounded-[6px] border border-foreground/10 bg-card overflow-hidden">
        {/* Header */}
        <div className="px-5 md:px-8 py-5 bg-foreground/[0.02] border-b border-foreground/10" />
        <div className="relative">
          {/* Tall accent column header */}
          <div className="absolute inset-x-2 top-2 -bottom-2 bg-accent rounded-t-[6px] z-0" aria-hidden />
          <div className="relative z-10 px-4 py-5 text-center">
            <span className="font-display text-[18px] md:text-[20px] tracking-tight text-accent-foreground">
              AdChefs
            </span>
          </div>
        </div>
        <div className="px-4 py-5 text-center bg-foreground/[0.02] border-b border-foreground/10">
          <span className="font-display text-[16px] md:text-[18px] tracking-tight text-muted-foreground">
            {themLabel}
          </span>
        </div>

        {/* Rows */}
        {rows.map((r, i) => {
          const isLast = i === rows.length - 1;
          return (
            <div key={r.feature} className="contents">
              <div
                className={`px-5 md:px-8 py-5 text-[14px] md:text-[15px] text-foreground ${
                  !isLast ? "border-b border-foreground/5" : ""
                }`}
              >
                {r.feature}
              </div>
              <div className="relative">
                <div
                  className={`absolute inset-x-2 inset-y-0 bg-accent z-0 ${
                    isLast ? "rounded-b-[6px]" : ""
                  }`}
                  aria-hidden
                />
                <div className="relative z-10 py-5 flex items-center justify-center">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-sm">
                    <Check className="h-4 w-4 text-accent-foreground" strokeWidth={3} />
                  </span>
                </div>
              </div>
              <div
                className={`py-5 flex items-center justify-center ${
                  !isLast ? "border-b border-foreground/5" : ""
                }`}
              >
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-foreground/10">
                  <X className="h-4 w-4 text-foreground/40" strokeWidth={3} />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const TwoWaysToWork = () => {
  return (
    <section className="py-16 sm:py-32 bg-background">
      <div className="mx-auto max-w-[1100px] px-6">
        <div className="max-w-2xl mb-14">
          <span className="eyebrow">TWO WAYS TO WORK</span>
          <h2 className="mt-5 font-display text-[32px] md:text-[44px] leading-[1.05] tracking-[-0.02em] text-foreground">
            AdChefs vs a regular <em>agency</em>.
          </h2>
          <p className="mt-5 text-[15px] text-muted-foreground leading-relaxed">
            Two ways to work with me. Same operator, same standard. Creative Strategy is the full engine, and it includes the editor placement.
          </p>
        </div>

        {/* Table 1 — Creative Strategy */}
        <div className="mb-16">
          <div className="mb-6 flex flex-wrap items-baseline gap-4">
            <span className="eyebrow eyebrow-accent">CREATIVE STRATEGY · FLAGSHIP</span>
            <span className="mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
              Includes editor placement
            </span>
          </div>
          <ComparisonTable rows={strategyRows} themLabel="Regular Agency" />
        </div>

        {/* Table 2 — Video Editor Placement */}
        <div>
          <div className="mb-6 flex flex-wrap items-baseline gap-4">
            <span className="eyebrow eyebrow-accent">VIDEO EDITOR PLACEMENT · ENTRY</span>
            <span className="mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
              From $100 / video
            </span>
          </div>
          <ComparisonTable rows={placementRows} themLabel="Freelancer" />
        </div>

        <div className="mt-12 flex justify-start">
          <Button
            size="lg"
            variant="cta"
            className="h-auto px-8 py-4 tracking-[0.01em] gap-[10px]"
            onClick={scrollToBooking}
          >
            Book a Call
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default TwoWaysToWork;