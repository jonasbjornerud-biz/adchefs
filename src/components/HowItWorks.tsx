import { Brain, Users, RefreshCw } from "lucide-react";

/* ── Premium animated SVG illustrations ── */

const HiringIllustration = () => (
  <svg viewBox="0 0 360 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    {/* Background grid dots */}
    {Array.from({ length: 5 }).map((_, row) =>
      Array.from({ length: 9 }).map((_, col) => (
        <circle key={`${row}-${col}`} cx={40 + col * 35} cy={20 + row * 30} r="1" className="fill-accent/[0.08]" />
      ))
    )}

    {/* Main horizontal pipeline */}
    <line x1="50" y1="80" x2="310" y2="80" className="stroke-accent/[0.12]" strokeWidth="2" />

    {/* Candidate circles along top — screening funnel */}
    {[80, 130, 180, 230, 280].map((x, i) => (
      <g key={i}>
        <circle cx={x} cy="42" r="14" className="stroke-accent/20" strokeWidth="1" fill="none">
          <animate attributeName="stroke-opacity" values="0.1;0.3;0.1" dur={`${2.5 + i * 0.2}s`} repeatCount="indefinite" />
        </circle>
        <circle cx={x} cy="42" r="6" className="fill-accent/[0.12]">
          <animate attributeName="r" values="5;7;5" dur={`${2 + i * 0.3}s`} repeatCount="indefinite" />
        </circle>
        {/* Connector to pipeline */}
        <line x1={x} y1="56" x2={x} y2="80" className="stroke-accent/[0.08]" strokeWidth="1" />
      </g>
    ))}

    {/* Animated scanning pulse */}
    <rect x="50" y="76" width="40" height="8" rx="4" className="fill-accent/30">
      <animate attributeName="x" values="50;270;50" dur="4s" repeatCount="indefinite" />
      <animate attributeName="opacity" values="0.6;0.2;0.6" dur="4s" repeatCount="indefinite" />
    </rect>

    {/* Selected talent glow at end */}
    <circle cx="310" cy="80" r="18" className="fill-accent/[0.06]">
      <animate attributeName="r" values="16;22;16" dur="3s" repeatCount="indefinite" />
    </circle>
    <circle cx="310" cy="80" r="10" className="fill-accent/20 stroke-accent/40" strokeWidth="1.5" />
    <path d="M305,80 L308,83 L316,76" className="stroke-accent" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none">
      <animate attributeName="opacity" values="0;1;1;0" dur="4s" repeatCount="indefinite" />
    </path>

    {/* Bottom label */}
    <rect x="60" y="108" width="52" height="20" rx="10" className="fill-accent/[0.08]" />
    <text x="86" y="122" textAnchor="middle" fontSize="8" className="fill-accent/60" fontFamily="system-ui" fontWeight="500">200+</text>
    <rect x="260" y="108" width="52" height="20" rx="10" className="fill-accent/[0.15]" />
    <text x="286" y="122" textAnchor="middle" fontSize="8" className="fill-accent" fontFamily="system-ui" fontWeight="600">Top 1%</text>
    {/* Arrow between labels */}
    <line x1="118" y1="118" x2="254" y2="118" className="stroke-accent/15" strokeWidth="1" strokeDasharray="4 4">
      <animate attributeName="stroke-dashoffset" values="0;-16" dur="2s" repeatCount="indefinite" />
    </line>
  </svg>
);

const MentoringIllustration = () => (
  <svg viewBox="0 0 360 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    {/* Left: SOP Document */}
    <rect x="30" y="20" width="100" height="120" rx="10" className="fill-accent/[0.04] stroke-accent/[0.12]" strokeWidth="1" />
    {/* Document header bar */}
    <rect x="40" y="30" width="80" height="6" rx="3" className="fill-accent/[0.12]" />
    {/* Animated text lines */}
    <rect x="40" y="46" rx="2" height="4" className="fill-accent/[0.08]">
      <animate attributeName="width" values="50;70;50" dur="3s" repeatCount="indefinite" />
    </rect>
    <rect x="40" y="56" rx="2" height="4" className="fill-accent/[0.06]">
      <animate attributeName="width" values="60;40;60" dur="3.5s" repeatCount="indefinite" />
    </rect>
    <rect x="40" y="66" rx="2" height="4" className="fill-accent/[0.05]">
      <animate attributeName="width" values="45;65;45" dur="4s" repeatCount="indefinite" />
    </rect>
    {/* Checklist items */}
    {[82, 96, 110].map((y, i) => (
      <g key={i}>
        <rect x="40" y={y} width="10" height="10" rx="3" className="stroke-accent/20" strokeWidth="1" fill="none" />
        <path d={`M${42},${y + 5} L${44},${y + 7} L${48},${y + 3}`} className="stroke-accent" strokeWidth="1.5" strokeLinecap="round" fill="none">
          <animate attributeName="opacity" values="0;1;1" dur="2s" begin={`${i * 0.8}s`} repeatCount="indefinite" />
        </path>
        <rect x="56" y={y + 2} width="50" height="4" rx="2" className="fill-accent/[0.06]" />
      </g>
    ))}

    {/* Arrow connector */}
    <g>
      <line x1="140" y1="80" x2="185" y2="80" className="stroke-accent/20" strokeWidth="1.5" strokeDasharray="6 4">
        <animate attributeName="stroke-dashoffset" values="0;-20" dur="1.5s" repeatCount="indefinite" />
      </line>
      <path d="M182,75 L192,80 L182,85" className="fill-accent/25" />
    </g>

    {/* Right: QA Score Chart */}
    <rect x="200" y="20" width="130" height="120" rx="10" className="fill-accent/[0.04] stroke-accent/[0.12]" strokeWidth="1" />
    <text x="220" y="42" fontSize="10" className="fill-accent/50" fontFamily="system-ui" fontWeight="600">Quality Score</text>

    {/* Animated rising bars */}
    {[{x: 220, h: 30, delay: "0s"}, {x: 242, h: 42, delay: "0.2s"}, {x: 264, h: 50, delay: "0.4s"}, {x: 286, h: 62, delay: "0.6s"}].map((bar, i) => (
      <g key={i}>
        <rect x={bar.x} y={120 - bar.h} width="14" height={bar.h} rx="4"
          className={i === 3 ? "fill-accent/60" : "fill-accent/20"}>
          <animate attributeName="height" values={`0;${bar.h}`} dur="1.5s" begin={bar.delay} fill="freeze" repeatCount="indefinite" />
          <animate attributeName="y" values={`120;${120 - bar.h}`} dur="1.5s" begin={bar.delay} fill="freeze" repeatCount="indefinite" />
        </rect>
      </g>
    ))}

    {/* Bottom line */}
    <line x1="215" y1="122" x2="308" y2="122" className="stroke-accent/10" strokeWidth="1" />
  </svg>
);

const DeliveryIllustration = () => (
  <svg viewBox="0 0 360 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    {/* Smooth upward curve */}
    <path d="M30,120 C80,120 100,90 160,75 C220,60 240,40 330,30" className="stroke-accent/[0.12]" strokeWidth="2" fill="none" />
    
    {/* Animated drawing curve on top */}
    <path d="M30,120 C80,120 100,90 160,75 C220,60 240,40 330,30" 
      className="stroke-accent" strokeWidth="2.5" fill="none" strokeLinecap="round"
      strokeDasharray="500" strokeDashoffset="500">
      <animate attributeName="stroke-dashoffset" values="500;0" dur="4s" repeatCount="indefinite" />
    </path>

    {/* Glowing traveling dot */}
    <circle r="5" className="fill-accent">
      <animateMotion dur="4s" repeatCount="indefinite" path="M30,120 C80,120 100,90 160,75 C220,60 240,40 330,30" />
    </circle>
    <circle r="14" className="fill-accent/10">
      <animateMotion dur="4s" repeatCount="indefinite" path="M30,120 C80,120 100,90 160,75 C220,60 240,40 330,30" />
      <animate attributeName="r" values="10;18;10" dur="2s" repeatCount="indefinite" />
    </circle>

    {/* Milestone dots on curve */}
    {[
      {x: 95, y: 105, label: "Draft"},
      {x: 160, y: 75, label: "Review"},
      {x: 250, y: 48, label: "Ship"}
    ].map((m, i) => (
      <g key={i}>
        <circle cx={m.x} cy={m.y} r="4" className="fill-accent/30 stroke-accent/50" strokeWidth="1" />
        <text x={m.x} y={m.y - 12} textAnchor="middle" fontSize="9" className="fill-accent/40" fontFamily="system-ui" fontWeight="500">{m.label}</text>
      </g>
    ))}

    {/* Stats card */}
    <rect x="250" y="80" width="80" height="50" rx="10" className="fill-accent/[0.06] stroke-accent/[0.12]" strokeWidth="1" />
    <text x="265" y="98" fontSize="8" className="fill-accent/40" fontFamily="system-ui">Revisions</text>
    <text x="265" y="118" fontSize="20" className="fill-accent" fontFamily="system-ui" fontWeight="700">∞</text>
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
