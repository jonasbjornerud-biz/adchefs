import { Check, X } from "lucide-react";

const rows: { feature: string; me: boolean; agency: boolean; meNote?: string; agencyNote?: string }[] = [
  { feature: "Pay only for videos that ship", me: true, agency: false, meNote: "From $100 / video", agencyNote: "$4,500+ retainer" },
  { feature: "Operator who reads your ad numbers weekly", me: true, agency: false, agencyNote: "Account manager" },
  { feature: "Briefs written by someone who can actually edit", me: true, agency: false, agencyNote: "Briefs by PM" },
  { feature: "Live KPI dashboard, included", me: true, agency: false, agencyNote: "Monthly PDF" },
  { feature: "Editor onboarded to your brand in days", me: true, agency: false, agencyNote: "Rotating freelancers" },
  { feature: "Cancel anytime, no contract length", me: true, agency: false, agencyNote: "6 to 12 month lock-in" },
];

const Cell = ({ on, note }: { on: boolean; note?: string }) => (
  <div className="flex flex-col items-center text-center gap-1">
    <span
      className={`inline-flex h-7 w-7 items-center justify-center rounded-full ${
        on ? "bg-foreground text-background" : "bg-foreground/5 text-foreground/40"
      }`}
    >
      {on ? <Check className="h-4 w-4" strokeWidth={2.5} /> : <X className="h-4 w-4" strokeWidth={2.5} />}
    </span>
    {note && (
      <span className="mono text-[9.5px] uppercase tracking-[0.14em] text-muted-foreground">
        {note}
      </span>
    )}
  </div>
);

const MeVsAgency = () => {
  return (
    <section className="py-16 sm:py-32 bg-background">
      <div className="mx-auto max-w-[1100px] px-6">
        <div className="max-w-2xl mb-12">
          <span className="eyebrow">THE COMPARISON</span>
          <h2 className="mt-5 font-display text-[32px] md:text-[44px] leading-[1.05] tracking-[-0.02em] text-foreground">
            Me vs a regular <em>agency</em>.
          </h2>
          <p className="mt-5 text-[15px] text-muted-foreground leading-relaxed">
            Same deliverable on paper. Very different bill, very different person doing the work.
          </p>
        </div>

        <div className="rounded-[4px] border border-foreground/10 bg-card overflow-hidden">
          {/* Header */}
          <div className="grid grid-cols-[1fr_120px_120px] md:grid-cols-[1fr_160px_160px] items-center border-b border-foreground/10 bg-foreground/[0.02] px-5 md:px-8 py-4">
            <span className="mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              What you get
            </span>
            <span className="mono text-[11px] uppercase tracking-[0.18em] text-foreground text-center font-semibold">
              AdChefs
            </span>
            <span className="mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground text-center">
              Agency
            </span>
          </div>

          {/* Rows */}
          {rows.map((r, i) => (
            <div
              key={r.feature}
              className={`grid grid-cols-[1fr_120px_120px] md:grid-cols-[1fr_160px_160px] items-center px-5 md:px-8 py-5 ${
                i !== rows.length - 1 ? "border-b border-foreground/5" : ""
              }`}
            >
              <span className="text-[14px] md:text-[15px] text-foreground pr-4">
                {r.feature}
              </span>
              <Cell on={r.me} note={r.meNote} />
              <Cell on={r.agency} note={r.agencyNote} />
            </div>
          ))}
        </div>

        <p className="mt-6 text-[13px] text-muted-foreground italic max-w-xl">
          Some agencies are great. Most are not built for brands that just want videos that ship and work.
        </p>
      </div>
    </section>
  );
};

export default MeVsAgency;