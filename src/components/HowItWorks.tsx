import { Brain, Users, RefreshCw } from "lucide-react";

/* ── Animated SVG illustrations for each card ── */

const HiringIllustration = () => (
  <svg viewBox="0 0 280 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    {/* Animated network/routing line */}
    <line x1="30" y1="60" x2="250" y2="60" stroke="hsl(var(--border))" strokeWidth="1.5" strokeDasharray="4 4" />
    
    {/* Animated dots traveling along the line */}
    <circle r="3" fill="hsl(var(--accent))">
      <animateMotion dur="3s" repeatCount="indefinite" path="M30,60 L250,60" />
    </circle>
    <circle r="2.5" fill="hsl(var(--accent))" opacity="0.5">
      <animateMotion dur="3s" repeatCount="indefinite" path="M30,60 L250,60" begin="1s" />
    </circle>
    <circle r="2" fill="hsl(var(--accent))" opacity="0.3">
      <animateMotion dur="3s" repeatCount="indefinite" path="M30,60 L250,60" begin="2s" />
    </circle>

    {/* Candidate nodes */}
    {[50, 100, 150, 200].map((x, i) => (
      <g key={i}>
        <circle cx={x} cy={35} r="8" fill="hsl(var(--accent) / 0.08)" stroke="hsl(var(--accent) / 0.2)" strokeWidth="1">
          <animate attributeName="r" values="8;10;8" dur={`${2 + i * 0.3}s`} repeatCount="indefinite" />
        </circle>
        <line x1={x} y1="43" x2={x} y2="60" stroke="hsl(var(--border))" strokeWidth="1" strokeDasharray="2 2" />
      </g>
    ))}

    {/* AI brain icon at end */}
    <circle cx="250" cy="60" r="14" fill="hsl(var(--accent) / 0.12)" stroke="hsl(var(--accent))" strokeWidth="1.5">
      <animate attributeName="r" values="14;16;14" dur="2.5s" repeatCount="indefinite" />
    </circle>
    <text x="250" y="64" textAnchor="middle" fontSize="12" fill="hsl(var(--accent))">🧠</text>

    {/* Checkmark appearing */}
    <g transform="translate(245, 42)">
      <circle r="6" fill="hsl(var(--accent))" opacity="0.9">
        <animate attributeName="opacity" values="0;0.9;0.9;0" dur="3s" repeatCount="indefinite" />
      </circle>
      <path d="M-2.5,0 L-0.5,2 L3,-2" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round">
        <animate attributeName="opacity" values="0;1;1;0" dur="3s" repeatCount="indefinite" />
      </path>
    </g>
  </svg>
);

const MentoringIllustration = () => (
  <svg viewBox="0 0 280 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    {/* SOP document stack */}
    <rect x="30" y="25" width="60" height="75" rx="6" fill="hsl(var(--accent) / 0.06)" stroke="hsl(var(--border))" strokeWidth="1" />
    <rect x="38" y="38" width="35" height="3" rx="1.5" fill="hsl(var(--accent) / 0.2)">
      <animate attributeName="width" values="20;35;20" dur="2s" repeatCount="indefinite" />
    </rect>
    <rect x="38" y="46" width="28" height="3" rx="1.5" fill="hsl(var(--accent) / 0.15)">
      <animate attributeName="width" values="28;15;28" dur="2.5s" repeatCount="indefinite" />
    </rect>
    <rect x="38" y="54" width="40" height="3" rx="1.5" fill="hsl(var(--accent) / 0.1)">
      <animate attributeName="width" values="35;40;35" dur="3s" repeatCount="indefinite" />
    </rect>

    {/* Arrow connector */}
    <line x1="100" y1="60" x2="145" y2="60" stroke="hsl(var(--accent) / 0.3)" strokeWidth="1.5" strokeDasharray="4 3">
      <animate attributeName="stroke-dashoffset" values="0;-14" dur="1.5s" repeatCount="indefinite" />
    </line>
    <polygon points="143,56 150,60 143,64" fill="hsl(var(--accent) / 0.4)" />

    {/* QA progress bar */}
    <rect x="155" y="35" width="95" height="50" rx="8" fill="hsl(var(--accent) / 0.04)" stroke="hsl(var(--border))" strokeWidth="1" />
    <text x="175" y="50" fontSize="8" fill="hsl(var(--muted-foreground))" fontFamily="monospace">QA Score</text>
    <rect x="170" y="58" width="65" height="6" rx="3" fill="hsl(var(--border))" />
    <rect x="170" y="58" rx="3" height="6" fill="hsl(var(--accent))">
      <animate attributeName="width" values="15;55;15" dur="4s" repeatCount="indefinite" />
    </rect>

    {/* Checkmarks appearing */}
    <g>
      <circle cx="175" cy="78" r="5" fill="hsl(var(--accent) / 0.15)">
        <animate attributeName="fill-opacity" values="0.1;0.3;0.1" dur="2s" repeatCount="indefinite" />
      </circle>
      <path d="M173,78 L174.5,79.5 L177.5,76" stroke="hsl(var(--accent))" strokeWidth="1.2" fill="none" strokeLinecap="round">
        <animate attributeName="opacity" values="0.3;1;0.3" dur="2s" repeatCount="indefinite" />
      </path>
    </g>
    <g>
      <circle cx="195" cy="78" r="5" fill="hsl(var(--accent) / 0.15)">
        <animate attributeName="fill-opacity" values="0.1;0.3;0.1" dur="2s" repeatCount="indefinite" begin="0.5s" />
      </circle>
      <path d="M193,78 L194.5,79.5 L197.5,76" stroke="hsl(var(--accent))" strokeWidth="1.2" fill="none" strokeLinecap="round">
        <animate attributeName="opacity" values="0.3;1;0.3" dur="2s" repeatCount="indefinite" begin="0.5s" />
      </path>
    </g>
    <g>
      <circle cx="215" cy="78" r="5" fill="hsl(var(--accent) / 0.15)">
        <animate attributeName="fill-opacity" values="0.1;0.3;0.1" dur="2s" repeatCount="indefinite" begin="1s" />
      </circle>
      <path d="M213,78 L214.5,79.5 L217.5,76" stroke="hsl(var(--accent))" strokeWidth="1.2" fill="none" strokeLinecap="round">
        <animate attributeName="opacity" values="0.3;1;0.3" dur="2s" repeatCount="indefinite" begin="1s" />
      </path>
    </g>
  </svg>
);

const DeliveryIllustration = () => (
  <svg viewBox="0 0 280 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    {/* Timeline/iteration loop */}
    <path d="M40,60 Q90,20 140,60 Q190,100 240,60" stroke="hsl(var(--accent) / 0.25)" strokeWidth="1.5" fill="none" strokeDasharray="4 3">
      <animate attributeName="stroke-dashoffset" values="0;-14" dur="2s" repeatCount="indefinite" />
    </path>

    {/* Dot traveling the path */}
    <circle r="4" fill="hsl(var(--accent))">
      <animateMotion dur="3s" repeatCount="indefinite" path="M40,60 Q90,20 140,60 Q190,100 240,60" />
    </circle>

    {/* Version markers */}
    {[{x: 70, label: "v1"}, {x: 140, label: "v2"}, {x: 210, label: "v3"}].map((item, i) => (
      <g key={i}>
        <circle cx={item.x} cy={60} r="10" fill="hsl(var(--accent) / 0.08)" stroke="hsl(var(--accent) / 0.2)" strokeWidth="1">
          <animate attributeName="fill-opacity" values="0.05;0.15;0.05" dur="2s" repeatCount="indefinite" begin={`${i * 0.6}s`} />
        </circle>
        <text x={item.x} y={63} textAnchor="middle" fontSize="7" fill="hsl(var(--accent))" fontFamily="monospace" fontWeight="600">{item.label}</text>
      </g>
    ))}

    {/* Stats panel */}
    <rect x="175" y="18" width="75" height="32" rx="6" fill="hsl(var(--accent) / 0.05)" stroke="hsl(var(--border))" strokeWidth="1" />
    <text x="185" y="30" fontSize="7" fill="hsl(var(--muted-foreground))" fontFamily="monospace">Delivered</text>
    <text x="185" y="42" fontSize="11" fill="hsl(var(--accent))" fontFamily="monospace" fontWeight="700">
      <animate attributeName="textContent" values="24;25;26;27;28" dur="5s" repeatCount="indefinite" fill="freeze" />
      28
    </text>

    {/* Refresh/loop arrow */}
    <path d="M232,85 A20,20 0 1,1 248,70" stroke="hsl(var(--accent) / 0.3)" strokeWidth="1.5" fill="none">
      <animate attributeName="stroke-dasharray" values="0,100;80,100" dur="2s" repeatCount="indefinite" />
    </path>
    <polygon points="248,66 252,71 247,72" fill="hsl(var(--accent) / 0.4)">
      <animate attributeName="opacity" values="0;1;1;0" dur="2s" repeatCount="indefinite" />
    </polygon>
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
    <section id="how-it-works" className="py-28">
      <div className="container mx-auto px-6">
        <div className="text-center mb-6">
          <p className="text-xs uppercase tracking-[0.2em] text-accent mb-3 font-medium">Process</p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">How It Works</h2>
          <p className="text-muted-foreground max-w-md mx-auto text-sm">
            Three steps to transform your creative production
          </p>
        </div>

        <div className="section-divider mb-16" />

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <div
              key={index}
              className="group feature-card animate-slide-up"
              style={{ animationDelay: `${index * 0.12}s` }}
            >
              {/* Animated illustration area */}
              <div className="feature-card-illustration mb-5 relative">
                <step.illustration />
                {/* Icon badge */}
                <div className="absolute bottom-3 right-3 w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center border border-accent/20 group-hover:bg-accent/15 transition-colors duration-300">
                  <step.icon className="w-5 h-5 text-accent" />
                </div>
              </div>

              <h3 className="text-lg font-semibold mb-2 text-foreground">{step.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
