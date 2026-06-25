import { Search, GraduationCap, Rocket } from "lucide-react";
import AnimationPlaceholder from "./AnimationPlaceholder";

const steps = [
  {
    n: "01",
    icon: Search,
    title: "Vetted through a real funnel",
    body: "I screen hundreds of editors every month through skills tests, brand voice trials, and paid trial tasks. No matching based on a portfolio. Every editor proves they can ship before they touch your account.",
  },
  {
    n: "02",
    icon: GraduationCap,
    title: "Trained on what wins",
    body: "Every editor goes through my direct response masterclass. Hook engineering, hold curve retention, brand voice, sound design. Training continues while they work for you, so quality compounds instead of plateauing.",
  },
  {
    n: "03",
    icon: Rocket,
    title: "Embedded in your workflow",
    body: "Your editor joins your Slack, your Notion, your brand folder, and works only on your account. Standard turnaround is 24 to 48 hours per video. I stay in the background handling quality and performance before anything becomes your problem.",
  },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-16 sm:py-32 bg-background">
      <div className="mx-auto max-w-[1200px] px-6">
        <div className="max-w-2xl mb-14">
          <span className="eyebrow">HOW IT WORKS</span>
          <h2 className="mt-5 font-display text-[32px] md:text-[44px] leading-[1.05] tracking-[-0.02em] text-foreground">
            Your editor, <em>handled</em> for you.
          </h2>
          <p className="mt-5 text-[15px] text-muted-foreground leading-relaxed">
            Your editor is yours alone. Not shared, not rotating, not freelancing on the side. I hire them, train them, and place them in your team like a contractor you never had to recruit. They sit in your Slack, learn your brand, and grow with your account. The recruiting, the mentoring, and the performance management stay with me.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-4 md:gap-5">
          {steps.map((s, idx) => (
            <div
              key={s.n}
              className="group rounded-[4px] border border-foreground/10 bg-card p-7 transition-colors hover:border-foreground/30"
            >
              <AnimationPlaceholder label={`ANIMATION 0${idx + 1}`} className="mb-6" />
              <div className="flex items-center justify-between mb-8">
                <span className="mono text-[11px] uppercase tracking-[0.15em] text-muted-foreground">
                  Step {s.n}
                </span>
                <s.icon className="w-4 h-4 text-foreground/40 group-hover:text-foreground transition-colors" />
              </div>
              <h3 className="font-display text-[22px] leading-tight tracking-tight text-foreground mb-3">
                {s.title}
              </h3>
              <p className="text-[14px] text-muted-foreground leading-relaxed">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;