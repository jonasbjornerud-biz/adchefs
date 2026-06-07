import { Button } from "@/components/ui/button";
import { ArrowRight, Check, X } from "lucide-react";

const usBullets = [
  "Dedicated editor matched to your brand",
  "Private performance dashboard, free",
  "Direct Slack or Notion line — no PM layer",
  "Unlimited revisions until approved",
  "No retainer, no minimum, no contract",
];

const themBullets = [
  "Editor shared across multiple clients",
  "No performance dashboard or numbers",
  "Brief through their PM, not the editor",
  "Revision cap (typically 1–2 per video)",
  "Locked-in monthly retainer",
  "Long-term contracts",
];

const Pricing = () => {
  const scrollToBooking = () => {
    const el = document.getElementById("booking");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="pricing" className="py-24 sm:py-32 bg-background">
      <div className="mx-auto max-w-[1200px] px-6">
        <div className="max-w-2xl mb-14">
          <span className="eyebrow">Pricing</span>
          <h2 className="mt-5 font-display text-[32px] md:text-[44px] leading-[1.05] tracking-[-0.02em] text-foreground">
            Pay per video. <em>Not</em> per retainer.
          </h2>
          <p className="mt-5 text-[15px] text-muted-foreground leading-relaxed">
            Most agencies charge €4,000–€10,000/month whether they deliver or not. We charge per cut that ships. Here's the math.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-4 max-w-5xl">
          {/* Agency card */}
          <div className="order-2 md:order-1 rounded-[4px] border border-foreground/10 bg-secondary/60 p-8 md:p-10 flex flex-col">
            <span className="mono text-[11px] uppercase tracking-[0.15em] text-muted-foreground mb-6">
              Typical creative agency
            </span>
            <div className="mb-6">
              <div className="font-display text-[52px] leading-none tracking-tight text-foreground/70">€4,500</div>
              <p className="mt-2 mono text-[11px] uppercase tracking-[0.15em] text-muted-foreground">/ month retainer</p>
            </div>
            <div className="h-px w-full bg-foreground/10 mb-6" />
            <ul className="space-y-3 mb-8 flex-1">
              {themBullets.map((b) => (
                <li key={b} className="flex items-start gap-3 text-[14px] text-muted-foreground">
                  <X className="w-4 h-4 mt-0.5 flex-shrink-0 text-muted-foreground/60" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
            <Button variant="outline" disabled className="w-full opacity-60 cursor-not-allowed">
              No thanks
            </Button>
          </div>

          {/* AdChefs card */}
          <div className="order-1 md:order-2 rounded-[4px] border-2 border-foreground bg-card p-8 md:p-10 flex flex-col relative">
            <div className="absolute -top-3 left-8 px-2.5 py-1 bg-accent text-accent-foreground mono text-[10px] uppercase tracking-[0.15em] rounded-[4px]">
              Pay per video
            </div>
            <span className="mono text-[11px] uppercase tracking-[0.15em] text-foreground mb-6">
              AdChefs
            </span>
            <div className="mb-6">
              <div className="font-display text-[52px] leading-none tracking-tight text-foreground">
                From €100
              </div>
              <p className="mt-2 mono text-[11px] uppercase tracking-[0.15em] text-muted-foreground">/ delivered video</p>
            </div>
            <div className="h-px w-full bg-foreground/10 mb-6" />
            <ul className="space-y-3 mb-8 flex-1">
              {usBullets.map((b) => (
                <li key={b} className="flex items-start gap-3 text-[14px] text-foreground/85">
                  <Check className="w-4 h-4 mt-0.5 flex-shrink-0 text-foreground" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
            <Button size="lg" variant="cta" onClick={scrollToBooking} className="w-full">
              Book a call
              <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </div>

        <p className="max-w-2xl text-[14px] text-muted-foreground leading-relaxed mt-10">
          At 20 videos you pay <span className="text-foreground font-medium">€2,000</span> — not <span className="text-foreground font-medium">€4,500+</span>. We earn it per cut, not per month. Complex edits and longer-form priced on the call.
        </p>
      </div>
    </section>
  );
};

export default Pricing;