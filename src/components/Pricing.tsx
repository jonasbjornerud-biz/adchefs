import { Button } from "@/components/ui/button";
import { ArrowRight, Check, X } from "lucide-react";

const adChefsBullets = [
  "Dedicated editor matched to your brand",
  "Private performance dashboard, free",
  "Direct Slack or Notion communication",
  "Unlimited revisions until approved",
  "No retainer, no minimum, no contract lock-in",
];

const agencyBullets = [
  "Editor shared across multiple clients",
  "No performance insight or dashboard",
  "You work through their systems, not yours",
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
    <section id="pricing" className="py-28">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="text-xs uppercase tracking-[0.2em] text-accent font-medium mb-3">
            Pricing
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground leading-tight mb-4">
            Why pay for a retainer when you can pay per video?
          </h2>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
            Most agencies charge €4,000–€10,000/month whether they deliver or not.
            We charge per video delivered. Here's the difference.
          </p>
        </div>

        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          {/* Left card — Typical Creative Agency (muted) */}
          <div
            className="order-2 md:order-1 rounded-2xl p-8 md:p-10 bg-background/40 backdrop-blur-sm flex flex-col"
            style={{
              border: "1px solid hsl(var(--border))",
              filter: "saturate(0.85)",
            }}
          >
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground font-medium text-center mb-5">
              Typical Creative Agency
            </p>

            <div className="text-center mb-2">
              <span className="text-5xl md:text-6xl font-extrabold text-foreground/70 tracking-tight">
                From €4,500
              </span>
            </div>
            <p className="text-sm text-muted-foreground text-center mb-7">
              per month retainer
            </p>

            <div className="h-px w-full bg-border/60 mb-7" />

            <ul className="space-y-3 mb-8 flex-1">
              {agencyBullets.map((b) => (
                <li
                  key={b}
                  className="flex items-start gap-3 text-sm text-foreground/65"
                >
                  <X className="w-4 h-4 mt-0.5 flex-shrink-0 text-muted-foreground/70" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>

            <Button
              size="lg"
              variant="outline"
              disabled
              className="w-full text-base px-8 py-5 h-auto rounded-xl text-muted-foreground border-border cursor-not-allowed opacity-80"
            >
              No thanks
            </Button>

            <p className="text-xs text-muted-foreground text-center mt-4">
              Market average for performance creative agencies in 2026.
            </p>
          </div>

          {/* Right card — AdChefs (winner) */}
          <div
            className="order-1 md:order-2 rounded-2xl p-8 md:p-10 bg-background/60 backdrop-blur-sm flex flex-col transition-transform duration-300 hover:-translate-y-0.5"
            style={{
              border: "1px solid hsl(var(--accent) / 0.4)",
              boxShadow:
                "0 0 0 1px hsl(var(--accent) / 0.1), 0 20px 60px -20px hsl(var(--accent) / 0.35), 0 0 80px -20px hsl(var(--accent) / 0.25)",
            }}
          >
            <p className="text-xs uppercase tracking-[0.2em] text-accent font-medium text-center mb-5">
              Pay per video
            </p>

            <div className="text-center mb-2">
              <span className="text-5xl md:text-6xl font-extrabold text-foreground tracking-tight">
                From €100
              </span>
            </div>
            <p className="text-sm text-muted-foreground text-center mb-7">
              per delivered video
            </p>

            <div className="h-px w-full bg-border/60 mb-7" />

            <ul className="space-y-3 mb-8 flex-1">
              {adChefsBullets.map((b) => (
                <li
                  key={b}
                  className="flex items-start gap-3 text-sm text-foreground/85"
                >
                  <Check className="w-4 h-4 mt-0.5 flex-shrink-0 text-accent" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>

            <Button
              size="lg"
              variant="cta"
              onClick={scrollToBooking}
              className="w-full text-base px-8 py-5 h-auto group relative overflow-hidden shimmer-button rounded-xl"
            >
              <span className="relative z-10 flex items-center justify-center">
                Book a Call
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </Button>

            <p className="text-xs text-muted-foreground text-center mt-4">
              Complex edits or longer-form work priced on the call.
            </p>
          </div>
        </div>

        {/* Math callout */}
        <p className="max-w-2xl mx-auto text-center text-[15px] text-muted-foreground leading-relaxed mt-10">
          At 20 videos/month, that's{" "}
          <span className="font-bold text-accent">€2,000 with AdChefs</span> vs{" "}
          <span className="font-bold text-accent">€4,500+ with most agencies</span>.
          You save the retainer. We earn the work.
        </p>
      </div>
    </section>
  );
};

export default Pricing;
