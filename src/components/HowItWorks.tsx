import { Search, GraduationCap, Rocket } from "lucide-react";

const steps = [
  {
    n: "01",
    icon: Search,
    title: "We find the editor",
    body: "247 applicants. AI-screened on past work, hook quality and turnaround. Top 1% reaches a paid trial. You meet finalists who already match your category.",
  },
  {
    n: "02",
    icon: GraduationCap,
    title: "We train them on your brand",
    body: "Your winners, your voice, your offer, your dashboard data. By video three, output looks like you cut it in-house — because the editor learns from your numbers, not a brief.",
  },
  {
    n: "03",
    icon: Rocket,
    title: "They ship — you pay per video",
    body: "6–10 cuts a week, 48–72h turnaround, unlimited revisions. Flat rate per delivered video. No retainer, no minimum, no lock-in.",
  },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-24 sm:py-32 bg-background">
      <div className="mx-auto max-w-[1200px] px-6">
        <div className="max-w-2xl mb-14">
          <span className="eyebrow">How it works</span>
          <h2 className="mt-5 font-display text-[32px] md:text-[44px] leading-[1.05] tracking-[-0.02em] text-foreground">
            One editor. <em>Every</em> video.
          </h2>
          <p className="mt-5 text-[15px] text-muted-foreground leading-relaxed">
            Three steps from the first call to a dedicated editor shipping cuts on your account.
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