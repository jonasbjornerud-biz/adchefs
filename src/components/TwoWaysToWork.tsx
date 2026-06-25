import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const scrollToBooking = () => {
  const el = document.getElementById("booking");
  if (el) el.scrollIntoView({ behavior: "smooth" });
};

const TwoWaysToWork = () => {
  return (
    <section className="py-16 sm:py-32 bg-background">
      <div className="mx-auto max-w-[1100px] px-6">
        <div className="max-w-2xl mb-12">
          <span className="eyebrow">TWO WAYS TO WORK</span>
          <h2 className="mt-5 font-display text-[32px] md:text-[44px] leading-[1.05] tracking-[-0.02em] text-foreground">
            One operator, <em>two</em> ways in.
          </h2>
          <p className="mt-5 text-[15px] text-muted-foreground leading-relaxed">
            Start with an editor and scale into full creative direction later, or bring me in to direct from day one. Same operator either way.
          </p>
        </div>

        {/* Ladder: flagship on top, entry below */}
        <div className="space-y-4">
          {/* Card A — Flagship */}
          <div className="group rounded-[4px] border-2 border-foreground/20 bg-card p-8 md:p-10 transition-colors hover:border-foreground/40">
            <div className="flex items-center justify-between mb-6">
              <span className="eyebrow eyebrow-accent">FLAGSHIP · PRICED ON A CALL</span>
              <span className="mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">01</span>
            </div>
            <h3 className="font-display text-[26px] md:text-[30px] leading-tight tracking-[-0.01em] text-foreground mb-4">
              Creative Direction
            </h3>
            <p className="text-[15px] text-muted-foreground leading-relaxed max-w-2xl">
              I run your creative engine end to end. Research, angles, briefs written with an editor's eye, a weekly performance review, and the videos produced and shipped. For brands that want someone owning the creative number, not just filling a queue.
            </p>
          </div>

          {/* Card B — Entry */}
          <div className="group rounded-[4px] border border-foreground/10 bg-card p-8 md:p-10 transition-colors hover:border-foreground/30">
            <div className="flex items-center justify-between mb-6">
              <span className="mono text-[11px] uppercase tracking-[0.15em] text-muted-foreground">
                ENTRY · FROM $100 PER VIDEO
              </span>
              <span className="mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">02</span>
            </div>
            <h3 className="font-display text-[22px] md:text-[24px] leading-tight tracking-tight text-foreground mb-3">
              Editor Placement
            </h3>
            <p className="text-[14px] text-muted-foreground leading-relaxed max-w-2xl">
              One vetted editor dropped inside your team. Trained on direct response, shipping cuts in 24 to 48 hours. You brief, they execute, I keep them sharp in the background.
            </p>
          </div>
        </div>

        <div className="mt-10 flex justify-start">
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