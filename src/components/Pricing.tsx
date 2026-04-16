import { Button } from "@/components/ui/button";
import { ArrowRight, Check } from "lucide-react";

const bullets = [
  "Dedicated editor matched to your brand",
  "Private performance dashboard, free",
  "Direct Slack or Notion communication",
  "Unlimited revisions until approved",
  "No retainer, no minimum, no contract lock-in",
  "Scale up or pause anytime",
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
            Simple pricing. Pay per video.
          </h2>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
            No retainers. No minimums. No long contracts. You pay for videos delivered, nothing else.
          </p>
        </div>

        <div
          className="max-w-[500px] mx-auto rounded-2xl p-8 md:p-10 bg-background/60 backdrop-blur-sm"
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

          <ul className="space-y-3 mb-8">
            {bullets.map((b) => (
              <li key={b} className="flex items-start gap-3 text-sm text-foreground/85">
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
    </section>
  );
};

export default Pricing;
