import { Button } from "@/components/ui/button";
import { ArrowRight, Check } from "lucide-react";

const scrollToBooking = () => {
  const el = document.getElementById("booking");
  if (el) el.scrollIntoView({ behavior: "smooth" });
};

const AccentCheck = () => (
  <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent text-ink">
    <Check className="h-3 w-3" strokeWidth={2.5} />
  </span>
);

const DarkCheck = () => (
  <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" strokeWidth={2.5} aria-hidden />
);

const EntryCard = () => {
  return (
    <div className="group relative flex flex-col h-full rounded-[4px] border border-accent bg-surface text-foreground overflow-hidden transition-transform duration-300 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(26,26,26,0.12)]">
      <div className="h-1 w-full bg-accent" aria-hidden />
      <div className="flex flex-col h-full p-8 md:p-10">
        <span className="self-start font-mono text-[10px] uppercase tracking-[0.15em] px-3 py-2 rounded-[4px] border border-foreground/15 text-foreground/70">
          ENTRY · START HERE
        </span>

        <h3 className="mt-7 font-display text-[28px] md:text-[36px] leading-[1.1] tracking-[-0.02em]">
          <em className="font-serif italic">Editor Placement</em>
        </h3>

        <p className="mt-2 font-mono text-[13px] md:text-[14px] uppercase tracking-[0.12em] text-foreground/60">
          FROM $100 / VIDEO
        </p>

        <div className="mt-8 h-px w-full bg-foreground/10" aria-hidden />

        <span className="font-mono mt-6 text-[10px] uppercase tracking-[0.15em] text-foreground/50">
          Included
        </span>

        <ul className="mt-4 space-y-3">
          {[
            "Vetted direct response editor matched to your workflow",
            "Pay per delivered video, no retainer or minimum volume",
            "24 to 48 hour turnaround standard",
            "All editing software covered by AdChefs",
            "Replaced fast if it is not clicking",
            "Trained on direct response, not wedding cuts",
          ].map((item, i) => (
            <li
              key={i}
              className="flex items-start gap-3 text-[14px] md:text-[15px] leading-snug text-foreground/80"
            >
              <AccentCheck />
              <span>{item}</span>
            </li>
          ))}
        </ul>

        <div className="mt-auto pt-10">
          <Button
            variant="cta"
            size="lg"
            className="w-full h-auto px-6 py-4 tracking-[0.01em] gap-[10px] bg-ink text-paper hover:bg-ink/90"
            onClick={scrollToBooking}
          >
            Book a Call
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

const ScaleCard = () => {
  return (
    <div className="relative flex flex-col h-full rounded-[4px] bg-ink text-paper overflow-hidden shadow-[inset_0_1px_0_rgba(247,246,243,0.08),0_0_60px_rgba(158,216,245,0.06)]">
      <div className="flex flex-col h-full p-8 md:p-10">
        <span className="self-start font-mono text-[10px] uppercase tracking-[0.15em] px-3 py-2 rounded-[4px] border border-accent/40 text-accent">
          SCALE · FULL CREATIVE DEPARTMENT
        </span>

        <h3 className="mt-7 font-display text-[28px] md:text-[36px] leading-[1.1] tracking-[-0.02em]">
          <em className="font-serif italic text-paper">Creative Strategy</em>
        </h3>

        <p className="mt-2 font-mono text-[13px] md:text-[14px] uppercase tracking-[0.12em] text-paper/60">
          PRICED ON THE CALL
        </p>

        <div className="mt-8 h-px w-full bg-paper/10" aria-hidden />

        <span className="font-mono mt-6 text-[10px] uppercase tracking-[0.15em] text-paper/50">
          Included
        </span>

        <ul className="mt-4 space-y-3">
          {[
            "Research, angles, and briefs built with an editing eye",
            "Weekly read on your ad numbers: hook, hold, ROAS, CPA",
            "New creative batches shipped every week",
            "Produced videos included, not just strategy decks",
            "Dedicated editor placement included",
            "Live KPI dashboard, free",
            "One operator owning the creative number end to end",
          ].map((item, i) => (
            <li
              key={i}
              className="flex items-start gap-3 text-[14px] md:text-[15px] leading-snug text-paper/80"
            >
              <DarkCheck />
              <span>{item}</span>
            </li>
          ))}
        </ul>

        <div className="mt-auto pt-10">
          <Button
            variant="cta"
            size="lg"
            className="w-full h-auto px-6 py-4 tracking-[0.01em] gap-[10px] bg-ink text-paper hover:bg-ink/90 ring-1 ring-paper/15"
            onClick={scrollToBooking}
          >
            Book a Call
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

const Connector = () => (
  <div className="flex flex-col items-center justify-center gap-2 py-2 md:py-0">
    <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
      READY TO SCALE
    </span>
    <ArrowRight className="h-4 w-4 text-muted-foreground rotate-90 md:rotate-0" strokeWidth={2} />
  </div>
);

const TwoWaysToWork = () => {
  return (
    <section className="py-16 sm:py-32 bg-background">
      <div className="mx-auto max-w-[1100px] px-6">
        <div className="max-w-2xl mb-14">
          <span className="eyebrow">TWO WAYS TO WORK</span>
          <h2 className="mt-5 font-display text-[32px] md:text-[44px] leading-[1.05] tracking-[-0.02em] text-foreground">
            Pick the engine you <em className="font-serif">need</em>.
          </h2>
          <p className="mt-5 text-[15px] text-muted-foreground leading-relaxed">
            Most brands start with an editor. When they are ready to scale, they loop me into the creative strategy.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-6 items-stretch">
          <div className="flex-1">
            <EntryCard />
          </div>
          <Connector />
          <div className="flex-1">
            <ScaleCard />
          </div>
        </div>
      </div>
    </section>
  );
};

export default TwoWaysToWork;
