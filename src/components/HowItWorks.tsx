import aiHiring from "@/assets/hiring.gif";
import editorDevelopment from "@/assets/mentoring.gif";
import creativeIntelligence from "@/assets/creative.gif";
import BackgroundElements from "./BackgroundElements";

const steps = [
  {
    image: aiHiring,
    title: "AI-Powered Hiring",
    description: "Screens 200+ video editors weekly to recruit the top 1% talent.",
  },
  {
    image: editorDevelopment,
    title: "Editor Development System",
    description: "Custom SOPs and QA processes built around your creative workflow to ensure consistent output.",
  },
  {
    image: creativeIntelligence,
    title: "Deliver & Iterate",
    description: "Finished videos delivered within days. Request revisions, approve finals, and keep your pipeline moving.",
  },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="section-steel py-32 border-t" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
      <BackgroundElements />

      <div className="max-w-[1440px] mx-auto px-8 relative z-10">
        <div className="text-center mb-6">
          <div className="inline-block px-3 py-1 border mb-6" style={{ borderColor: "hsl(263 70% 50% / 0.3)", background: "hsl(263 70% 50% / 0.05)" }}>
            <span className="mono-label" style={{ color: "hsl(263 70% 50%)" }}>
              Operations Protocol // 002
            </span>
          </div>
          <h2
            className="font-extrabold text-white uppercase mb-3"
            style={{ fontSize: "clamp(2rem, 5vw, 4rem)", lineHeight: 0.9 }}
          >
            How It <span className="text-stroke">Works</span>
          </h2>
          <p className="text-white/30 max-w-md mx-auto text-sm mt-4">
            Three steps to transform your creative production
          </p>
        </div>

        <div className="section-divider mb-16" />

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <div
              key={index}
              className="group hud-card overflow-hidden animate-slide-up"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              <div className="relative h-56 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[hsl(240_6%_4%)] z-10" />
                {/* Step number with HUD style */}
                <div className="absolute top-3 left-3 z-20 flex items-center gap-2">
                  <div className="w-8 h-8 flex items-center justify-center" style={{ background: "hsl(263 70% 50% / 0.9)" }}>
                    <span className="text-xs font-bold text-white">{String(index + 1).padStart(2, '0')}</span>
                  </div>
                </div>
                {/* Film metadata */}
                <div className="absolute top-3 right-3 z-20 mono-label text-white/30">
                  REC ●
                </div>
                <img
                  src={step.image}
                  alt={step.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 grayscale-[30%] group-hover:grayscale-0"
                />
              </div>
              <div className="p-6">
                <h3 className="text-lg font-extrabold mb-2 text-white uppercase tracking-tight">{step.title}</h3>
                <p className="text-sm text-white/35 leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Metrics bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20 max-w-5xl mx-auto border-t pt-12" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
          {[
            { label: "Throughput", value: "500+", sub: "Videos Delivered" },
            { label: "Efficiency", value: "Top 1%", sub: "Editor Talent" },
            { label: "Velocity", value: "48h", sub: "Avg Turnaround" },
            { label: "Output", value: "∞", sub: "Revisions Included" },
          ].map((metric, i) => (
            <div key={i} className="space-y-1">
              <div className="mono-label" style={{ color: "hsl(263 70% 50%)" }}>{metric.label}</div>
              <div className="text-3xl font-extrabold tracking-tighter text-white tabular-nums">{metric.value}</div>
              <div className="mono-label text-white/25">{metric.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
