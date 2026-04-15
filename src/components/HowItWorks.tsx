import { Brain, Users, RefreshCw } from "lucide-react";

/* ── Premium animated SVG illustrations ── */

const HiringIllustration = () => (
  <svg viewBox="0 0 320 140" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full p-4">
    {/* Horizontal pipeline */}
    <line x1="40" y1="70" x2="280" y2="70" className="stroke-border" strokeWidth="1" />

    {/* Candidate nodes filtering down */}
    {[70, 120, 170, 220].map((x, i) => (
      <g key={i}>
        <circle cx={x} cy="38" r="12" className="fill-accent/[0.06] stroke-accent/20" strokeWidth="1">
          <animate attributeName="opacity" values="0.4;1;0.4" dur={`${2.2 + i * 0.4}s`} repeatCount="indefinite" />
        </circle>
        <circle cx={x} cy="38" r="4" className="fill-accent/30">
          <animate attributeName="r" values="3;5;3" dur={`${2 + i * 0.3}s`} repeatCount="indefinite" />
        </circle>
        <line x1={x} y1="50" x2={x} y2="70" className="stroke-accent/15" strokeWidth="1" strokeDasharray="3 3">
          <animate attributeName="stroke-dashoffset" values="0;-6" dur="1.5s" repeatCount="indefinite" />
        </line>
      </g>
    ))}

    {/* Animated pulse traveling the pipeline */}
    <circle r="4" className="fill-accent">
      <animateMotion dur="2.5s" repeatCount="indefinite" path="M40,70 L280,70" />
      <animate attributeName="opacity" values="1;0.4;1" dur="2.5s" repeatCount="indefinite" />
    </circle>
    <circle r="8" className="fill-accent/20">
      <animateMotion dur="2.5s" repeatCount="indefinite" path="M40,70 L280,70" />
      <animate attributeName="r" values="6;12;6" dur="2.5s" repeatCount="indefinite" />
      <animate attributeName="opacity" values="0.3;0;0.3" dur="2.5s" repeatCount="indefinite" />
    </circle>

    {/* Selected badge at end */}
    <rect x="248" y="85" width="48" height="22" rx="11" className="fill-accent/10 stroke-accent/25" strokeWidth="1">
      <animate attributeName="opacity" values="0.5;1;0.5" dur="3s" repeatCount="indefinite" />
    </rect>
    <text x="260" y="100" fontSize="8" className="fill-accent" fontWeight="600" fontFamily="system-ui">Top 1%</text>
  </svg>
);

const MentoringIllustration = () => (
  <svg viewBox="0 0 320 140" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full p-4">
    {/* SOP Document */}
    <rect x="30" y="20" width="80" height="100" rx="8" className="fill-accent/[0.04] stroke-border" strokeWidth="1" />
    <rect x="42" y="36" width="56" height="4" rx="2" className="fill-accent/15">
      <animate attributeName="width" values="30;56;30" dur="3s" repeatCount="indefinite" />
    </rect>
    <rect x="42" y="46" width="44" height="4" rx="2" className="fill-accent/10">
      <animate attributeName="width" values="44;25;44" dur="3.5s" repeatCount="indefinite" />
    </rect>
    <rect x="42" y="56" width="50" height="4" rx="2" className="fill-accent/[0.07]">
      <animate attributeName="width" values="40;50;40" dur="4s" repeatCount="indefinite" />
    </rect>
    <rect x="42" y="66" width="36" height="4" rx="2" className="fill-accent/[0.05]" />

    {/* Animated connector arrow */}
    <path d="M118,70 L158,70" className="stroke-accent/20" strokeWidth="1.5" strokeDasharray="4 4">
      <animate attributeName="stroke-dashoffset" values="0;-16" dur="1.5s" repeatCount="indefinite" />
    </path>
    <path d="M154,66 L162,70 L154,74" className="fill-accent/25" />

    {/* QA Dashboard */}
    <rect x="170" y="24" width="120" height="92" rx="10" className="fill-accent/[0.03] stroke-border" strokeWidth="1" />
    <text x="185" y="44" fontSize="9" className="fill-muted-foreground/70" fontFamily="system-ui" fontWeight="500">Quality Score</text>

    {/* Animated bar chart */}
    <rect x="185" y="90" width="16" height="0" rx="3" className="fill-accent/20">
      <animate attributeName="height" values="0;34;34" dur="2s" fill="freeze" repeatCount="indefinite" />
      <animate attributeName="y" values="90;56;56" dur="2s" fill="freeze" repeatCount="indefinite" />
    </rect>
    <rect x="207" y="90" width="16" height="0" rx="3" className="fill-accent/30">
      <animate attributeName="height" values="0;44;44" dur="2s" begin="0.3s" fill="freeze" repeatCount="indefinite" />
      <animate attributeName="y" values="90;46;46" dur="2s" begin="0.3s" fill="freeze" repeatCount="indefinite" />
    </rect>
    <rect x="229" y="90" width="16" height="0" rx="3" className="fill-accent/50">
      <animate attributeName="height" values="0;52;52" dur="2s" begin="0.6s" fill="freeze" repeatCount="indefinite" />
      <animate attributeName="y" values="90;38;38" dur="2s" begin="0.6s" fill="freeze" repeatCount="indefinite" />
    </rect>
    <rect x="251" y="90" width="16" height="0" rx="3" className="fill-accent">
      <animate attributeName="height" values="0;56;56" dur="2s" begin="0.9s" fill="freeze" repeatCount="indefinite" />
      <animate attributeName="y" values="90;34;34" dur="2s" begin="0.9s" fill="freeze" repeatCount="indefinite" />
    </rect>

    {/* Baseline */}
    <line x1="182" y1="92" x2="272" y2="92" className="stroke-border" strokeWidth="1" />
  </svg>
);

const DeliveryIllustration = () => (
  <svg viewBox="0 0 320 140" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full p-4">
    {/* Smooth delivery curve */}
    <path d="M30,95 C80,95 80,35 140,35 C200,35 200,75 260,45 L290,35" className="stroke-accent/20" strokeWidth="1.5" fill="none" />
    <path d="M30,95 C80,95 80,35 140,35 C200,35 200,75 260,45 L290,35" className="stroke-accent" strokeWidth="2" fill="none" strokeDasharray="400" strokeDashoffset="400" strokeLinecap="round">
      <animate attributeName="stroke-dashoffset" values="400;0" dur="3s" repeatCount="indefinite" />
    </path>

    {/* Glowing dot on curve */}
    <circle r="5" className="fill-accent">
      <animateMotion dur="3s" repeatCount="indefinite" path="M30,95 C80,95 80,35 140,35 C200,35 200,75 260,45 L290,35" />
    </circle>
    <circle r="12" className="fill-accent/15">
      <animateMotion dur="3s" repeatCount="indefinite" path="M30,95 C80,95 80,35 140,35 C200,35 200,75 260,45 L290,35" />
      <animate attributeName="r" values="8;14;8" dur="1.5s" repeatCount="indefinite" />
    </circle>

    {/* Milestone markers */}
    {[{x: 80, y: 65, label: "Draft"}, {x: 170, y: 50, label: "Review"}, {x: 260, y: 45, label: "Final"}].map((m, i) => (
      <g key={i}>
        <circle cx={m.x} cy={m.y} r="3" className="fill-accent/40 stroke-accent/60" strokeWidth="1">
          <animate attributeName="r" values="3;5;3" dur="2s" begin={`${i * 0.5}s`} repeatCount="indefinite" />
        </circle>
        <text x={m.x} y={m.y - 10} textAnchor="middle" fontSize="8" className="fill-muted-foreground/60" fontFamily="system-ui" fontWeight="500">{m.label}</text>
      </g>
    ))}

    {/* Stats badge */}
    <rect x="220" y="75" width="72" height="36" rx="8" className="fill-accent/[0.06] stroke-accent/15" strokeWidth="1" />
    <text x="232" y="90" fontSize="8" className="fill-muted-foreground/50" fontFamily="system-ui">Iterations</text>
    <text x="232" y="104" fontSize="14" className="fill-accent" fontFamily="system-ui" fontWeight="700">∞</text>
  </svg>
);

const steps = [
  {
    icon: Brain,
    illustration: HiringIllustration,
    title: "AI-Powered Hiring",
    description: "Screens 200+ video editors weekly to recruit the top 1% talent for your brand.",
  },
  {
    icon: Users,
    illustration: MentoringIllustration,
    title: "Editor Mentoring System",
    description: "Custom SOPs and QA processes built around your creative workflow for consistent output.",
  },
  {
    icon: RefreshCw,
    illustration: DeliveryIllustration,
    title: "Delivery & Iterations",
    description: "Finished videos delivered within days. Request revisions, approve finals, repeat.",
  },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-24">
      <div className="container mx-auto px-6">
        <div className="text-center mb-6">
          <p className="text-xs uppercase tracking-[0.2em] text-accent mb-3 font-medium">Process</p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">How It Works</h2>
          <p className="text-muted-foreground max-w-md mx-auto text-sm">
            Three steps to transform your creative production
          </p>
        </div>

        <div className="section-divider mb-14" />

        <div className="grid md:grid-cols-3 gap-5 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <div
              key={index}
              className="group feature-card animate-slide-up"
              style={{ animationDelay: `${index * 0.12}s` }}
            >
              {/* Animated illustration area */}
              <div className="feature-card-illustration mb-4 relative overflow-hidden">
                <step.illustration />
                {/* Icon badge */}
                <div className="absolute bottom-2.5 right-2.5 w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center border border-accent/15 group-hover:bg-accent/20 transition-all duration-300 group-hover:scale-110">
                  <step.icon className="w-4 h-4 text-accent" />
                </div>
              </div>

              <h3 className="text-base font-semibold mb-1.5 text-foreground">{step.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
