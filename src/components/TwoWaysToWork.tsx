import { Button } from "@/components/ui/button";
import { ArrowRight, Check } from "lucide-react";

const scrollToBooking = () => {
  const el = document.getElementById("booking");
  if (el) el.scrollIntoView({ behavior: "smooth" });
};

const Pod = ({
  theme,
  eyebrow,
  title,
  description,
  included,
  featured = false,
}: {
  theme: "light" | "blue";
  eyebrow: string;
  title: string;
  description: string;
  included: string[];
  featured?: boolean;
}) => {
  const isBlue = theme === "blue";

  return (
    <div
      className={`flex flex-col h-full rounded-[4px] border p-8 md:p-10 ${
        isBlue
          ? "bg-accent text-accent-foreground border-foreground/10"
          : "bg-surface text-foreground border-foreground/10"
      } ${featured ? "border-t-[2px] border-t-accent shadow-sm" : ""}`}
    >
      <span
        className={`self-start font-mono text-[10px] uppercase tracking-[0.15em] px-3 py-2 rounded-[4px] border border-current/20 text-current/70 ${
          featured ? "bg-accent/20 text-foreground/80 border-accent/30" : ""
        }`}
      >
        {eyebrow}
      </span>

      <h3 className="mt-7 font-display text-[28px] md:text-[36px] leading-[1.1] tracking-[-0.02em]">
        <em className="text-current not-italic font-serif">{title}</em>
      </h3>

      <p className="mt-4 text-[15px] leading-relaxed text-current/70">
        {description}
      </p>

      <div className="mt-8 h-px w-full bg-current opacity-10" aria-hidden />

      <span className="font-mono mt-6 text-[10px] uppercase tracking-[0.15em] text-current/50">
        Included
      </span>

      <ul className="mt-4 space-y-3">
        {included.map((item, i) => (
          <li
            key={i}
            className="flex items-start gap-3 text-[14px] md:text-[15px] leading-snug text-current/80"
          >
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-600" aria-hidden />
            <span>{item}</span>
          </li>
        ))}
      </ul>

      <div className="mt-auto pt-10">
        <Button
          variant="cta"
          size="lg"
          className={`w-full h-auto px-6 py-4 tracking-[0.01em] gap-[10px] ${
            isBlue ? "bg-ink text-paper hover:bg-ink/90" : "bg-ink text-paper hover:bg-ink/90"
          }`}
          onClick={scrollToBooking}
        >
          Book a Call
          <ArrowRight className="h-4 w-4" />
        </Button>
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
            Pick the engine you <em className="font-serif">need</em>.
          </h2>
          <p className="mt-5 text-[15px] text-muted-foreground leading-relaxed">
            Most brands start with an editor. When they are ready to scale, they loop me into the creative strategy.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          <Pod
            theme="light"
            featured
            eyebrow="FULL SERVICE"
            title="Creative Strategy"
            description="I run your creative department from concept to campaign. You get a system, an operator reading your ad numbers every week, and the videos produced and shipped. Editor placement is included, so you do not hire separately."
            included={[
              "Research, angles, and briefs built with an editing eye",
              "Weekly read on your ad numbers: hook, hold, ROAS, CPA",
              "New creative batches shipped every week",
              "Produced videos included, not just strategy decks",
              "Dedicated editor placement included",
              "Live KPI dashboard, free",
              "One operator owning the creative number end to end",
            ]}
          />

          <Pod
            theme="blue"
            eyebrow="EDITOR PLACEMENT"
            title="Editor Placement"
            description="A vetted direct response editor dropped into your workflow. Pay per delivered video. No retainer, no minimum volume, no contract length."
            included={[
              "Pay per delivered video, from $100",
              "Vetted editor onboarded in days",
              "24 to 48 hour turnaround",
              "Trained on direct response, not wedding cuts",
              "Replaced fast if it is not clicking",
              "All software covered (Premiere, Higgsfield, ElevenLabs)",
              "No retainer, no contract length",
            ]}
          />
        </div>
      </div>
    </section>
  );
};

export default TwoWaysToWork;
