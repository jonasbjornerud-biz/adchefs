import { Brain, Users, RefreshCw } from "lucide-react";

const HiringIllustration = () => (
  <svg viewBox="0 0 300 220" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    {/* Row of 5 people silhouettes */}
    {[50, 100, 150, 200, 250].map((x, i) => {
      const isSelected = i === 4;
      return (
        <g key={i}>
          {/* Head */}
          <circle cx={x} cy="38" r={isSelected ? 14 : 12} fill={isSelected ? "#8b5cf6" : "#ddd6fe"} stroke={isSelected ? "#7c3aed" : "#c4b5fd"} strokeWidth="2">
            {!isSelected && <animate attributeName="opacity" values="1;0.35;1" dur="3s" begin={`${i * 0.3}s`} repeatCount="indefinite" />}
          </circle>
          {/* Body */}
          <rect x={x - (isSelected ? 10 : 8)} y="56" width={isSelected ? 20 : 16} height={isSelected ? 24 : 20} rx="8" fill={isSelected ? "#8b5cf6" : "#ddd6fe"} stroke={isSelected ? "#7c3aed" : "#c4b5fd"} strokeWidth="2">
            {!isSelected && <animate attributeName="opacity" values="1;0.35;1" dur="3s" begin={`${i * 0.3}s`} repeatCount="indefinite" />}
          </rect>
          {/* X mark on rejected */}
          {!isSelected && (
            <g>
              <line x1={x - 6} y1="32" x2={x + 6} y2="44" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round">
                <animate attributeName="opacity" values="0;0;1;1" dur="3s" begin={`${i * 0.3}s`} repeatCount="indefinite" />
              </line>
              <line x1={x + 6} y1="32" x2={x - 6} y2="44" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round">
                <animate attributeName="opacity" values="0;0;1;1" dur="3s" begin={`${i * 0.3}s`} repeatCount="indefinite" />
              </line>
            </g>
          )}
          {/* Checkmark on selected */}
          {isSelected && (
            <g>
              <circle cx={x} cy="38" r="20" fill="#8b5cf6" opacity="0.12">
                <animate attributeName="r" values="18;26;18" dur="2s" repeatCount="indefinite" />
              </circle>
              <path d={`M${x - 5},${38} L${x - 1},${42} L${x + 7},${33}`} stroke="#22c55e" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none">
                <animate attributeName="opacity" values="0;1;1" dur="2s" repeatCount="indefinite" />
              </path>
            </g>
          )}
        </g>
      );
    })}

    {/* Large funnel below */}
    <path d="M30,105 L270,105 L180,165 L120,165 Z" fill="#f5f3ff" stroke="#c4b5fd" strokeWidth="2" />
    <text x="150" y="130" textAnchor="middle" fontSize="13" fontWeight="700" fill="#7c3aed" fontFamily="system-ui">200+ Screened</text>

    {/* Arrow down */}
    <line x1="150" y1="168" x2="150" y2="188" stroke="#8b5cf6" strokeWidth="2.5" />
    <path d="M143,184 L150,194 L157,184" fill="#8b5cf6" />

    {/* Result badge */}
    <rect x="105" y="196" width="90" height="24" rx="12" fill="#8b5cf6" />
    <text x="150" y="212" textAnchor="middle" fontSize="12" fontWeight="700" fill="white" fontFamily="system-ui">Top 1%</text>
  </svg>
);

const MentoringIllustration = () => (
  <svg viewBox="0 0 300 220" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    {/* Left side: Course/Book icon */}
    <rect x="30" y="30" width="110" height="150" rx="10" fill="#f5f3ff" stroke="#c4b5fd" strokeWidth="2" />
    {/* Book spine */}
    <rect x="30" y="30" width="14" height="150" rx="4" fill="#ddd6fe" />
    {/* Title bar */}
    <rect x="52" y="44" width="76" height="10" rx="5" fill="#c4b5fd" />
    <text x="90" y="52" textAnchor="middle" fontSize="7" fontWeight="700" fill="white" fontFamily="system-ui">MASTERCLASS</text>
    
    {/* Chapter items with sequential check animation */}
    {["Module 1", "Module 2", "Module 3", "Module 4"].map((label, i) => (
      <g key={i}>
        <rect x="52" y={68 + i * 28} width="18" height="18" rx="5" fill="white" stroke="#c4b5fd" strokeWidth="1.5" />
        <path d={`M${56},${77 + i * 28} L${59},${80 + i * 28} L${66},${74 + i * 28}`} stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" fill="none">
          <animate attributeName="opacity" values="0;0;1;1" dur="4s" begin={`${i * 0.8}s`} repeatCount="indefinite" />
        </path>
        <text x="78" y={81 + i * 28} fontSize="10" fontWeight="500" fill="#6d28d9" fontFamily="system-ui">{label}</text>
      </g>
    ))}

    {/* Arrow */}
    <line x1="150" y1="105" x2="175" y2="105" stroke="#c4b5fd" strokeWidth="3" strokeLinecap="round" />
    <path d="M172,98 L182,105 L172,112" fill="#c4b5fd" />

    {/* Right side: Quality score ring */}
    <circle cx="230" cy="105" r="60" fill="#f5f3ff" />
    <circle cx="230" cy="105" r="48" fill="none" stroke="#ede9fe" strokeWidth="10" />
    <circle cx="230" cy="105" r="48" fill="none" stroke="#8b5cf6" strokeWidth="10"
      strokeDasharray="301" strokeDashoffset="301" strokeLinecap="round"
      transform="rotate(-90 230 105)">
      <animate attributeName="stroke-dashoffset" values="301;30;301" dur="4s" repeatCount="indefinite" />
    </circle>
    <text x="230" y="100" textAnchor="middle" fontSize="28" fontWeight="800" fill="#7c3aed" fontFamily="system-ui">98</text>
    <text x="230" y="118" textAnchor="middle" fontSize="11" fontWeight="600" fill="#a78bfa" fontFamily="system-ui">QA Score</text>
  </svg>
);

const DeliveryIllustration = () => (
  <svg viewBox="0 0 300 220" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    {/* Timeline track */}
    <rect x="30" y="95" width="240" height="8" rx="4" fill="#ede9fe" />
    
    {/* Animated fill */}
    <rect x="30" y="95" height="8" rx="4" fill="#8b5cf6">
      <animate attributeName="width" values="0;240;240;0" dur="5s" repeatCount="indefinite" />
    </rect>

    {/* 3 milestone nodes */}
    {[
      { x: 70, label: "Draft", emoji: "📝" },
      { x: 150, label: "Review", emoji: "🔍" },
      { x: 230, label: "Ship", emoji: "🚀" },
    ].map((m, i) => (
      <g key={i}>
        <circle cx={m.x} cy="99" r="18" fill="white" stroke="#8b5cf6" strokeWidth="3" />
        <text x={m.x} y="105" textAnchor="middle" fontSize="16">{m.emoji}</text>
        <text x={m.x} y="135" textAnchor="middle" fontSize="13" fontWeight="700" fill="#6d28d9" fontFamily="system-ui">{m.label}</text>
        {/* Animated pulse on active */}
        <circle cx={m.x} cy="99" r="18" fill="none" stroke="#8b5cf6" strokeWidth="2" opacity="0">
          <animate attributeName="r" values="18;30;30" dur="5s" begin={`${i * 1.5}s`} repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.6;0;0" dur="5s" begin={`${i * 1.5}s`} repeatCount="indefinite" />
        </circle>
      </g>
    ))}

    {/* Traveling dot */}
    <circle r="8" fill="#8b5cf6">
      <animate attributeName="cx" values="30;270;270;30" dur="5s" repeatCount="indefinite" />
      <animate attributeName="cy" values="99;99;99;99" dur="5s" repeatCount="indefinite" />
      <animate attributeName="opacity" values="1;1;0;0" dur="5s" repeatCount="indefinite" />
    </circle>

    {/* Bottom badge */}
    <rect x="95" y="158" width="110" height="36" rx="18" fill="#f5f3ff" stroke="#ddd6fe" strokeWidth="2" />
    <text x="150" y="181" textAnchor="middle" fontSize="14" fontWeight="700" fill="#7c3aed" fontFamily="system-ui">∞ Revisions</text>
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
    description: "Full masterclasses and courses built for your editors, with custom SOPs and QA to ensure consistent, on-brand output.",
  },
  {
    icon: RefreshCw,
    illustration: DeliveryIllustration,
    title: "Delivery & Iterations",
    description: "Finished videos delivered within days. Request unlimited revisions, approve finals, repeat.",
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
              <div className="h-[240px] mb-5 rounded-xl bg-white flex items-center justify-center">
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
