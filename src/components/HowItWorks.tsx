import { Brain, Users, RefreshCw } from "lucide-react";

const HiringIllustration = () => (
  <svg viewBox="0 0 340 180" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    {/* Dotted grid background */}
    {Array.from({ length: 4 }).map((_, row) =>
      Array.from({ length: 8 }).map((_, col) => (
        <circle key={`${row}-${col}`} cx={30 + col * 42} cy={18 + row * 44} r="1.2" fill="#e5e0ff" />
      ))
    )}

    {/* Pipeline line */}
    <line x1="40" y1="70" x2="300" y2="70" stroke="#e9e5ff" strokeWidth="2" strokeDasharray="6 4" />

    {/* 5 candidate nodes */}
    {[60, 120, 170, 220, 280].map((x, i) => {
      const rejected = i < 4;
      return (
        <g key={i}>
          {/* Connector line down to pipeline */}
          <line x1={x} y1={rejected ? 44 : 42} x2={x} y2="70" stroke={rejected ? "#e9e5ff" : "#8b5cf6"} strokeWidth="1.5" strokeDasharray={rejected ? "3 3" : "0"} />

          {/* Person circle */}
          <circle cx={x} cy="32" r={rejected ? 13 : 16} fill={rejected ? "#f8f6ff" : "#ede9fe"} stroke={rejected ? "#ddd6fe" : "#8b5cf6"} strokeWidth={rejected ? 1.5 : 2}>
            {rejected && <animate attributeName="opacity" values="1;0.4;1" dur="3s" begin={`${i * 0.4}s`} repeatCount="indefinite" />}
          </circle>

          {/* Rejected X */}
          {rejected && (
            <g opacity="0.5">
              <line x1={x - 4} y1="28" x2={x + 4} y2="36" stroke="#e879a0" strokeWidth="2" strokeLinecap="round" />
              <line x1={x + 4} y1="28" x2={x - 4} y2="36" stroke="#e879a0" strokeWidth="2" strokeLinecap="round" />
            </g>
          )}

          {/* Selected checkmark */}
          {!rejected && (
            <g>
              <circle cx={x} cy="32" r="22" fill="#8b5cf6" opacity="0.06">
                <animate attributeName="r" values="20;28;20" dur="2.5s" repeatCount="indefinite" />
              </circle>
              <path d={`M${x - 5},32 L${x - 1},36 L${x + 6},28`} stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            </g>
          )}
        </g>
      );
    })}

    {/* Animated scanning pulse on pipeline */}
    <rect y="67" width="36" height="6" rx="3" fill="#8b5cf6" opacity="0.3">
      <animate attributeName="x" values="40;264;40" dur="3s" repeatCount="indefinite" />
      <animate attributeName="opacity" values="0.5;0.15;0.5" dur="3s" repeatCount="indefinite" />
    </rect>

    {/* Bottom labels */}
    <rect x="40" y="92" width="72" height="26" rx="13" fill="#f8f6ff" stroke="#ede9fe" strokeWidth="1" />
    <text x="76" y="109" textAnchor="middle" fontSize="11" fontWeight="600" fill="#a78bfa" fontFamily="system-ui">200+</text>

    <path d="M122,105 L198,105" stroke="#ddd6fe" strokeWidth="1.5" strokeDasharray="4 4">
      <animate attributeName="stroke-dashoffset" values="0;-16" dur="1.5s" repeatCount="indefinite" />
    </path>

    <rect x="208" y="92" width="86" height="26" rx="13" fill="#8b5cf6" />
    <text x="251" y="109" textAnchor="middle" fontSize="11" fontWeight="700" fill="white" fontFamily="system-ui">Top 1%</text>

    {/* Small star near selected */}
    <path d="M298,14 L300,20 L306,20 L301,24 L303,30 L298,26 L293,30 L295,24 L290,20 L296,20Z" fill="#8b5cf6" opacity="0.25">
      <animate attributeName="opacity" values="0.15;0.4;0.15" dur="2s" repeatCount="indefinite" />
    </path>
  </svg>
);

const MentoringIllustration = () => (
  <svg viewBox="0 0 340 180" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    {/* Left: Course card */}
    <rect x="24" y="16" width="120" height="148" rx="12" fill="white" stroke="#e9e5ff" strokeWidth="1.5" />
    {/* Header bar */}
    <rect x="24" y="16" width="120" height="32" rx="12" fill="#f5f3ff" />
    <rect x="86" y="16" width="58" height="32" rx="0" fill="#f5f3ff" />
    <text x="84" y="37" textAnchor="middle" fontSize="9" fontWeight="700" fill="#7c3aed" fontFamily="system-ui" letterSpacing="0.5">MASTERCLASS</text>

    {/* Module rows */}
    {["Pacing & Hooks", "Color Grading", "Sound Design", "Brand Match"].map((label, i) => (
      <g key={i}>
        <rect x="36" y={58 + i * 26} width="14" height="14" rx="4" fill="white" stroke="#ddd6fe" strokeWidth="1.2" />
        <path d={`M${39},${65 + i * 26} L${41},${67 + i * 26} L${47},${62 + i * 26}`} stroke="#22c55e" strokeWidth="2" strokeLinecap="round" fill="none">
          <animate attributeName="opacity" values="0;0;1;1" dur="4s" begin={`${i * 0.7}s`} repeatCount="indefinite" />
        </path>
        <text x="58" y={69 + i * 26} fontSize="9" fontWeight="500" fill="#6b7280" fontFamily="system-ui">{label}</text>
      </g>
    ))}

    {/* Arrow connector */}
    <line x1="155" y1="90" x2="188" y2="90" stroke="#ddd6fe" strokeWidth="2" strokeLinecap="round" />
    <path d="M184,84 L194,90 L184,96" fill="#c4b5fd" />

    {/* Right: Quality gauge */}
    <circle cx="258" cy="82" r="60" fill="#faf9ff" />
    <circle cx="258" cy="82" r="48" fill="none" stroke="#f0ecff" strokeWidth="8" />
    <circle cx="258" cy="82" r="48" fill="none" stroke="#8b5cf6" strokeWidth="8"
      strokeDasharray="301" strokeDashoffset="301" strokeLinecap="round"
      transform="rotate(-90 258 82)">
      <animate attributeName="stroke-dashoffset" values="301;30;301" dur="4s" repeatCount="indefinite" />
    </circle>
    <text x="258" y="78" textAnchor="middle" fontSize="26" fontWeight="800" fill="#7c3aed" fontFamily="system-ui">A+</text>
    <text x="258" y="96" textAnchor="middle" fontSize="10" fontWeight="600" fill="#a78bfa" fontFamily="system-ui">Quality</text>

    {/* Subtle sparkle */}
    <circle cx="296" cy="42" r="3" fill="#c4b5fd" opacity="0.4">
      <animate attributeName="opacity" values="0.2;0.6;0.2" dur="2s" repeatCount="indefinite" />
    </circle>
    <circle cx="218" cy="38" r="2" fill="#ddd6fe" opacity="0.3">
      <animate attributeName="opacity" values="0.1;0.5;0.1" dur="2.5s" repeatCount="indefinite" />
    </circle>
  </svg>
);

const DeliveryIllustration = () => (
  <svg viewBox="0 0 340 180" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    {/* Timeline track */}
    <rect x="30" y="74" width="280" height="6" rx="3" fill="#f0ecff" />

    {/* Animated progress fill */}
    <rect x="30" y="74" height="6" rx="3" fill="#8b5cf6">
      <animate attributeName="width" values="0;280;280;0" dur="5s" repeatCount="indefinite" />
    </rect>

    {/* Milestone 1: Draft */}
    <circle cx="90" cy="77" r="18" fill="white" stroke="#ddd6fe" strokeWidth="2" />
    <rect x="78" y="67" width="24" height="18" rx="3" fill="none" stroke="#8b5cf6" strokeWidth="1.5" />
    <line x1="82" y1="72" x2="94" y2="72" stroke="#c4b5fd" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="82" y1="76" x2="90" y2="76" stroke="#c4b5fd" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="82" y1="80" x2="92" y2="80" stroke="#c4b5fd" strokeWidth="1.5" strokeLinecap="round" />
    <text x="90" y="112" textAnchor="middle" fontSize="11" fontWeight="600" fill="#6d28d9" fontFamily="system-ui">Draft</text>
    <circle cx="90" cy="77" r="18" fill="none" stroke="#8b5cf6" strokeWidth="1.5" opacity="0">
      <animate attributeName="r" values="18;28;28" dur="5s" begin="0.5s" repeatCount="indefinite" />
      <animate attributeName="opacity" values="0.5;0;0" dur="5s" begin="0.5s" repeatCount="indefinite" />
    </circle>

    {/* Milestone 2: Review */}
    <circle cx="170" cy="77" r="18" fill="white" stroke="#ddd6fe" strokeWidth="2" />
    <circle cx="170" cy="73" r="7" fill="none" stroke="#8b5cf6" strokeWidth="1.5" />
    <line x1="175" y1="78" x2="180" y2="84" stroke="#8b5cf6" strokeWidth="1.5" strokeLinecap="round" />
    <text x="170" y="112" textAnchor="middle" fontSize="11" fontWeight="600" fill="#6d28d9" fontFamily="system-ui">Review</text>
    <circle cx="170" cy="77" r="18" fill="none" stroke="#8b5cf6" strokeWidth="1.5" opacity="0">
      <animate attributeName="r" values="18;28;28" dur="5s" begin="1.5s" repeatCount="indefinite" />
      <animate attributeName="opacity" values="0.5;0;0" dur="5s" begin="1.5s" repeatCount="indefinite" />
    </circle>

    {/* Milestone 3: Ship */}
    <circle cx="250" cy="77" r="18" fill="white" stroke="#ddd6fe" strokeWidth="2" />
    <path d="M244,82 L250,72 L256,82 Z" fill="none" stroke="#8b5cf6" strokeWidth="1.5" strokeLinejoin="round" />
    <line x1="250" y1="72" x2="250" y2="66" stroke="#8b5cf6" strokeWidth="1.5" strokeLinecap="round" />
    <text x="250" y="112" textAnchor="middle" fontSize="11" fontWeight="600" fill="#6d28d9" fontFamily="system-ui">Ship</text>
    <circle cx="250" cy="77" r="18" fill="none" stroke="#8b5cf6" strokeWidth="1.5" opacity="0">
      <animate attributeName="r" values="18;28;28" dur="5s" begin="2.5s" repeatCount="indefinite" />
      <animate attributeName="opacity" values="0.5;0;0" dur="5s" begin="2.5s" repeatCount="indefinite" />
    </circle>

    {/* Traveling dot */}
    <circle r="5" fill="#8b5cf6">
      <animate attributeName="cx" values="30;310;310;30" dur="5s" repeatCount="indefinite" />
      <animate attributeName="cy" values="77;77;77;77" dur="5s" repeatCount="indefinite" />
      <animate attributeName="opacity" values="1;1;0;0" dur="5s" repeatCount="indefinite" />
    </circle>
    <circle r="12" fill="#8b5cf6" opacity="0.1">
      <animate attributeName="cx" values="30;310;310;30" dur="5s" repeatCount="indefinite" />
      <animate attributeName="cy" values="77;77;77;77" dur="5s" repeatCount="indefinite" />
      <animate attributeName="opacity" values="0.15;0.15;0;0" dur="5s" repeatCount="indefinite" />
    </circle>

    {/* Bottom badge */}
    <rect x="115" y="132" width="110" height="30" rx="15" fill="#f8f6ff" stroke="#ede9fe" strokeWidth="1.5" />
    <text x="170" y="151" textAnchor="middle" fontSize="12" fontWeight="700" fill="#7c3aed" fontFamily="system-ui">∞ Revisions</text>
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
              className="group rounded-2xl border border-[#f0ecff] bg-white p-6 transition-all duration-300"
              style={{
                boxShadow: '0 1px 3px rgba(139,92,246,0.04), 0 8px 24px rgba(139,92,246,0.06)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(139,92,246,0.08), 0 16px 40px rgba(139,92,246,0.12)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 1px 3px rgba(139,92,246,0.04), 0 8px 24px rgba(139,92,246,0.06)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div className="h-[200px] mb-5 rounded-xl bg-[#fdfcff] border border-[#f5f3ff] flex items-center justify-center overflow-hidden">
                <step.illustration />
              </div>
              <div className="flex items-center gap-2.5 mb-2">
                <div className="w-8 h-8 rounded-lg bg-[#f5f3ff] flex items-center justify-center">
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
