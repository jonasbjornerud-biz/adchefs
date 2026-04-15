import { Brain, Users, RefreshCw } from "lucide-react";

const HiringIllustration = () => (
  <svg viewBox="0 0 320 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    {/* 5 candidate circles at top */}
    {[60, 110, 160, 210, 260].map((x, i) => (
      <g key={i}>
        <circle cx={x} cy="50" r="20" fill="#e9e5ff" stroke="#c4b5fd" strokeWidth="1.5">
          <animate attributeName="opacity" values={i < 4 ? "1;0.3;0.3" : "1;1;1"} dur="3s" repeatCount="indefinite" />
        </circle>
        <circle cx={x} cy="44" r="6" fill="#a78bfa">
          <animate attributeName="opacity" values={i < 4 ? "1;0.3;0.3" : "1;1;1"} dur="3s" repeatCount="indefinite" />
        </circle>
        <path d={`M${x - 8},${56} Q${x},${64} ${x + 8},${56}`} stroke="#a78bfa" strokeWidth="2" fill="none">
          <animate attributeName="opacity" values={i < 4 ? "1;0.3;0.3" : "1;1;1"} dur="3s" repeatCount="indefinite" />
        </path>
      </g>
    ))}

    {/* Funnel */}
    <path d="M40,90 L280,90 L200,140 L120,140 Z" fill="#f3f0ff" stroke="#c4b5fd" strokeWidth="1.5" />
    
    {/* Animated dots falling through funnel */}
    <circle r="4" fill="#8b5cf6">
      <animateMotion dur="2.5s" repeatCount="indefinite" path="M160,90 L160,140 L160,170" />
      <animate attributeName="opacity" values="1;1;0" dur="2.5s" repeatCount="indefinite" />
    </circle>

    {/* Result: single star candidate */}
    <circle cx="160" cy="175" r="16" fill="#8b5cf6" opacity="0.15">
      <animate attributeName="r" values="14;20;14" dur="2s" repeatCount="indefinite" />
    </circle>
    <circle cx="160" cy="175" r="10" fill="#8b5cf6" />
    <path d="M156,175 L158,178 L165,172" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </svg>
);

const MentoringIllustration = () => (
  <svg viewBox="0 0 320 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    {/* Clipboard / SOP */}
    <rect x="40" y="20" width="100" height="160" rx="12" fill="#f3f0ff" stroke="#c4b5fd" strokeWidth="1.5" />
    <rect x="70" y="12" width="40" height="16" rx="8" fill="#c4b5fd" />
    
    {/* Checklist items with sequential animation */}
    {[50, 78, 106, 134].map((y, i) => (
      <g key={i}>
        <rect x="58" y={y} width="16" height="16" rx="4" fill="white" stroke="#c4b5fd" strokeWidth="1.5" />
        <path d={`M${62},${y + 8} L${65},${y + 11} L${71},${y + 5}`} stroke="#8b5cf6" strokeWidth="2.5" strokeLinecap="round" fill="none">
          <animate attributeName="opacity" values="0;0;1;1" dur="3s" begin={`${i * 0.6}s`} repeatCount="indefinite" />
        </path>
        <rect x="82" y={y + 4} width="48" height="8" rx="4" fill="#e9e5ff" />
      </g>
    ))}

    {/* Arrow */}
    <path d="M155,100 L185,100" stroke="#c4b5fd" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M180,94 L190,100 L180,106" fill="#c4b5fd" />

    {/* Quality meter / gauge */}
    <circle cx="240" cy="95" r="55" fill="#f3f0ff" stroke="#e9e5ff" strokeWidth="1.5" />
    <circle cx="240" cy="95" r="42" fill="none" stroke="#e9e5ff" strokeWidth="8" />
    <circle cx="240" cy="95" r="42" fill="none" stroke="#8b5cf6" strokeWidth="8" 
      strokeDasharray="264" strokeDashoffset="264" strokeLinecap="round"
      transform="rotate(-90 240 95)">
      <animate attributeName="stroke-dashoffset" values="264;40;264" dur="4s" repeatCount="indefinite" />
    </circle>
    <text x="240" y="90" textAnchor="middle" fontSize="22" fontWeight="800" fill="#7c3aed" fontFamily="system-ui">A+</text>
    <text x="240" y="108" textAnchor="middle" fontSize="10" fontWeight="500" fill="#a78bfa" fontFamily="system-ui">Quality</text>
  </svg>
);

const DeliveryIllustration = () => (
  <svg viewBox="0 0 320 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    {/* Timeline bar */}
    <rect x="40" y="90" width="240" height="6" rx="3" fill="#e9e5ff" />
    
    {/* Animated progress fill */}
    <rect x="40" y="90" height="6" rx="3" fill="#8b5cf6">
      <animate attributeName="width" values="0;240;240;0" dur="4s" repeatCount="indefinite" />
    </rect>

    {/* Milestone nodes */}
    {[
      { x: 100, label: "Draft", icon: "M94,55 L106,55 L106,72 L100,68 L94,72Z" },
      { x: 160, label: "Review", icon: "M154,55 L166,55 L166,67 A6,6 0 0,1 154,67Z" },
      { x: 220, label: "Ship", icon: "M214,55 L226,55 L226,67 L220,72 L214,67Z" },
    ].map((m, i) => (
      <g key={i}>
        <circle cx={m.x} cy="93" r="12" fill="white" stroke="#8b5cf6" strokeWidth="2.5" />
        <circle cx={m.x} cy="93" r="5" fill="#8b5cf6">
          <animate attributeName="opacity" values="0.3;1;0.3" dur="3s" begin={`${i * 0.5}s`} repeatCount="indefinite" />
        </circle>
        <text x={m.x} y="125" textAnchor="middle" fontSize="12" fontWeight="600" fill="#6d28d9" fontFamily="system-ui">{m.label}</text>
      </g>
    ))}

    {/* Traveling dot */}
    <circle r="6" fill="#8b5cf6">
      <animate attributeName="cx" values="40;280;40" dur="4s" repeatCount="indefinite" />
      <animate attributeName="cy" values="93;93;93" dur="4s" repeatCount="indefinite" />
    </circle>
    <circle r="16" fill="#8b5cf6" opacity="0.12">
      <animate attributeName="cx" values="40;280;40" dur="4s" repeatCount="indefinite" />
      <animate attributeName="cy" values="93;93;93" dur="4s" repeatCount="indefinite" />
      <animate attributeName="r" values="12;20;12" dur="2s" repeatCount="indefinite" />
    </circle>

    {/* Infinite revisions badge */}
    <rect x="110" y="148" width="100" height="32" rx="16" fill="#f3f0ff" stroke="#e9e5ff" strokeWidth="1.5" />
    <text x="160" y="169" textAnchor="middle" fontSize="12" fontWeight="700" fill="#7c3aed" fontFamily="system-ui">∞ Revisions</text>
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
        <div className="text-center mb-14">
          <p className="text-xs uppercase tracking-[0.2em] text-[#7c3aed] mb-3 font-medium">Process</p>
          <h2 className="text-3xl md:text-4xl font-bold text-[#1a1a2e] mb-3">How It Works</h2>
          <p className="text-[#6b7280] max-w-md mx-auto text-sm">
            Three steps to transform your creative production
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <div
              key={index}
              className="group rounded-2xl border border-[#e9e5ff] bg-white p-5 hover:shadow-lg hover:shadow-purple-100/50 transition-all duration-300"
            >
              <div className="h-[220px] mb-5 rounded-xl bg-white flex items-center justify-center">
                <step.illustration />
              </div>
              <div className="flex items-center gap-2.5 mb-2">
                <div className="w-8 h-8 rounded-lg bg-[#f3f0ff] flex items-center justify-center">
                  <step.icon className="w-4 h-4 text-[#7c3aed]" />
                </div>
                <h3 className="text-base font-semibold text-[#1a1a2e]">{step.title}</h3>
              </div>
              <p className="text-sm text-[#6b7280] leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
