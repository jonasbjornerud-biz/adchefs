import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

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
}: {
  theme: "dark" | "light";
  eyebrow: string;
  title: React.ReactNode;
  description: string;
  included: string[];
}) => {
  const isDark = theme === "dark";

  return (
    <div
      className={`flex flex-col h-full rounded-[4px] border p-8 md:p-10 ${
        isDark
          ? "bg-ink text-paper border-paper/10"
          : "bg-surface text-foreground border-foreground/10"
      }`}
    >
      <span
        className="self-start font-mono text-[10px] uppercase tracking-[0.15em] px-3 py-2 rounded-[4px] border border-current/20 text-current/70"
      >
        {eyebrow}
      </span>

      <h3 className="mt-7 font-display text-[28px] md:text-[36px] leading-[1.1] tracking-[-0.02em]">
        <em className="text-current not-italic">{title}</em>
      </h3>

      <p className="mt-4 text-[15px] leading-relaxed text-current/70">
        {description}
      </p>

      <div className="mt-8 h-px w-full bg-current opacity-10" aria-hidden />

      <span className="mono mt-6 text-[10px] uppercase tracking-[0.15em] text-current/50">
        Included
      </span>

      <ul className="mt-4 space-y-3">
        {included.map((item, i) => (
          <li
            key={i}
            className="text-[14px] md:text-[15px] leading-snug text-current/80"
          >
            {item}
          </li>
        ))}
      </ul>

      <div className="mt-auto pt-10">
        <Button
          variant="cta"
          size="lg"
          className={`w-full h-auto px-6 py-4 tracking-[0.01em] gap-[10px] ${
            isDark ? "bg-paper text-ink hover:bg-paper/90" : ""
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
            Pick the engine you <em>need</em>.
          </h2>
          <p className="mt-5 text-[15px] text-muted-foreground leading-relaxed">
            Most brands start with an editor. When you are ready to scale, I can run the whole creative department.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          <Pod
            theme="dark"
            eyebrow="FULL SERVICE"
            title="Creative Strategy"
            description="I run your creative department from concept to campaign. You get a system, a team, and a weekly operator reading your ad numbers. Editor placement is included, so you do not need to hire separately."
            included={[
              "In-house system building",
              "A+ team building",
              "60+ creative concepts a month",
              "Fast creative iterations",
              "New creative batches every week",
              "Lower retainer + winning bonuses",
              "Dedicated editor placement included",
              "Operator who reads your ad numbers weekly",
            ]}
          />

          <Pod
            theme="light"
            eyebrow="EDITOR PLACEMENT"
            title="Editor Placement"
            description="A vetted direct-response editor dropped into your workflow. Pay per delivered video. No retainer, no minimum volume, no contract length."
            included={[
              "Pay per delivered video, from $100",
              "Vetted editor onboarded in days",
              "24 to 48 hour turnaround",
              "Trained on direct-response, not wedding cuts",
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
