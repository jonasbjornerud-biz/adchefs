import { Search, GraduationCap, Rocket } from "lucide-react";

const steps = [
  {
    n: "01",
    icon: Search,
    title: "Vetted through a real funnel",
    body: "I screen hundreds of editors every month through a structured evaluation: skills tests, brand-voice trials, paid trial tasks. Only editors who pass every stage work with brands. No \"matching\" based on a portfolio. Every editor proves they can ship before they ever touch your account.",
  },
  {
    n: "02",
    icon: GraduationCap,
    title: "Trained on what actually wins",
    body: "Every editor goes through my direct response masterclass: hook engineering, hold-curve retention, brand voice, sound design. They keep training while they work for you, so quality compounds over time instead of plateauing.",
  },
  {
    n: "03",
    icon: Rocket,
    title: "Embedded in your workflow",
    body: "Your editor gets added to your Slack, your Notion, your brand folder, and works only on your account. You treat them like an in-house hire. I stay in the background, managing performance, quality, and any issues before they become your problem.",
  },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-24 sm:py-32 bg-background">
      <div className="mx-auto max-w-[1200px] px-6">
        <div className="max-w-2xl mb-14">
          <span className="eyebrow">How it works</span>
          <h2 className="mt-5 font-display text-[32px] md:text-[44px] leading-[1.05] tracking-[-0.02em] text-foreground">
            An <em>in-house editor</em>, handled for you.
          </h2>
          <p className="mt-5 text-[15px] text-muted-foreground leading-relaxed">
            Your editor is yours alone. Not shared, not rotating, not freelancing on the side. I hire them, train them, and place them in your team, like a contractor you never had to recruit. They learn your brand, sit in your Slack, and grow with your account. I handle the recruiting, the mentoring, and the performance management, so you don't have to.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-4 md:gap-5">
          {steps.map((s) => (
            <div
              key={s.n}
              className="group rounded-[4px] border border-foreground/10 bg-card p-7 transition-colors hover:border-foreground/30"
            >
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