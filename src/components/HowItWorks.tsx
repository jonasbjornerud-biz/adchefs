const FunnelMotif = () => (
  <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10" aria-hidden="true">
    <path
      d="M8 10L18 24V34L30 40V24L40 10H8Z"
      fill="rgba(158, 216, 245, 0.12)"
      stroke="hsl(var(--accent-deep))"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    <path
      d="M14 14H34L27 24H21L14 14Z"
      fill="rgba(158, 216, 245, 0.25)"
      stroke="hsl(var(--accent-deep))"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
  </svg>
);

const LevelUpMotif = () => (
  <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10" aria-hidden="true">
    <path
      d="M8 38L18 38L18 30L8 30Z"
      fill="rgba(158, 216, 245, 0.12)"
      stroke="hsl(var(--accent-deep))"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    <path
      d="M20 38L30 38L30 22L20 22Z"
      fill="rgba(158, 216, 245, 0.20)"
      stroke="hsl(var(--accent-deep))"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    <path
      d="M32 38L42 38L42 14L32 14Z"
      fill="rgba(158, 216, 245, 0.32)"
      stroke="hsl(var(--accent-deep))"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    <path
      d="M36 8L42 14L36 14"
      stroke="hsl(var(--accent-deep))"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const EmbedMotif = () => (
  <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10" aria-hidden="true">
    <rect x="6" y="6" width="36" height="36" rx="4" fill="rgba(158, 216, 245, 0.10)" stroke="hsl(var(--accent-deep))" strokeWidth="1.5" />
    <path d="M6 18H42" stroke="hsl(var(--accent-deep))" strokeWidth="1.5" />
    <path d="M6 30H42" stroke="hsl(var(--accent-deep))" strokeWidth="1.5" />
    <path d="M18 18V42" stroke="hsl(var(--accent-deep))" strokeWidth="1.5" />
    <path d="M30 18V42" stroke="hsl(var(--accent-deep))" strokeWidth="1.5" />
    <rect x="20" y="32" width="8" height="8" rx="2" fill="hsl(var(--accent))" stroke="hsl(var(--accent-deep))" strokeWidth="1.5" />
  </svg>
);

const steps = [
  {
    n: "01",
    label: "Vetted",
    Motif: FunnelMotif,
    title: "Hundreds in. One out.",
    body: "I run a real recruiting funnel. Skills tests, brand voice trials, paid trial edits. Only editors who can ship make it to your account.",
  },
  {
    n: "02",
    label: "Trained",
    Motif: LevelUpMotif,
    title: "Skill compounding",
    body: "Every editor goes through direct response training. Hook engineering, hold curves, sound design. The work gets sharper the longer they are with you.",
  },
  {
    n: "03",
    label: "Embedded",
    Motif: EmbedMotif,
    title: "Slots into your team",
    body: "Your editor joins your Slack, your Notion, your brand folder. They work only on your account. I manage quality and performance behind the scenes.",
  },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-16 sm:py-32 bg-background">
      <div className="mx-auto max-w-[1200px] px-6">
        <div className="max-w-2xl mb-16">
          <span className="eyebrow">EDITOR PLACEMENT · HOW IT WORKS</span>
          <h2 className="mt-5 font-display text-[32px] md:text-[44px] leading-[1.05] tracking-[-0.02em] text-foreground">
            Your editor, <em>handled</em> for you.
          </h2>
          <p className="mt-5 text-[15px] text-muted-foreground leading-relaxed">
            Your editor is yours alone. Not shared, not rotating, not freelancing on the side. I hire them, train them, and place them in your team like a contractor you never had to recruit. They sit in your Slack, learn your brand, and grow with your account. The recruiting, the mentoring, and the performance management stay with me.
          </p>
        </div>

        <div className="relative">
          {/* Desktop horizontal connector */}
          <div
            className="hidden md:block absolute top-[52px] left-[calc(16.666%+24px)] right-[calc(16.666%+24px)] h-px"
            aria-hidden="true"
          >
            <div className="absolute inset-0 bg-foreground/10" />
            <div className="absolute right-0 top-1/2 -translate-y-1/2">
              <svg width="14" height="10" viewBox="0 0 14 10" fill="none">
                <path d="M0 5H12M12 5L8 1M12 5L8 9" stroke="hsl(var(--accent-deep))" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>

          {/* Mobile vertical connector */}
          <div
            className="md:hidden absolute left-[31px] top-[48px] bottom-[48px] w-px"
            aria-hidden="true"
          >
            <div className="absolute inset-0 bg-foreground/10" />
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2">
              <svg width="10" height="14" viewBox="0 0 10 14" fill="none">
                <path d="M5 0V12M5 12L1 8M5 12L9 8" stroke="hsl(var(--accent-deep))" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-10 md:gap-6">
            {steps.map((s) => (
              <div key={s.n} className="relative">
                {/* Accent node at the connection point */}
                <div className="absolute top-[48px] left-0 md:left-1/2 md:-translate-x-1/2 w-3 h-3 rounded-full bg-accent border border-accent-deep z-10" aria-hidden="true" />

                <div className="rounded-[4px] border border-foreground/10 bg-paper p-7 md:pt-8 h-full">
                  <div className="flex md:flex-col items-start md:items-center gap-5 md:gap-0">
                    <div className="md:mb-5">
                      <s.Motif />
                    </div>
                    <div className="md:text-center">
                      <span className="mono text-[11px] uppercase tracking-[0.15em] text-accent-deep">
                        STAGE {s.n} · {s.label}
                      </span>
                      <h3 className="mt-2 font-display text-[20px] leading-tight tracking-tight text-foreground">
                        {s.title}
                      </h3>
                    </div>
                  </div>
                  <p className="mt-4 md:text-center text-[14px] text-muted-foreground leading-relaxed">
                    {s.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
