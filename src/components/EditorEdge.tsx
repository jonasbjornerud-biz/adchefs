import { Button } from "@/components/ui/button";
import { ArrowRight, BarChart3, TrendingUp, ShieldCheck, RefreshCw } from "lucide-react";

const features = [
  {
    icon: TrendingUp,
    title: "KPI-Trained Editors",
    description:
      "Our editors don't just edit. They understand CTR, hook rate, hold rate, and what drives revenue. Every cut is made with performance in mind.",
  },
  {
    icon: BarChart3,
    title: "Custom KPI Dashboards",
    description:
      "Real-time dashboards tracking ad spend, ROAS, CPA, and creative performance. Know exactly which videos are printing money.",
  },
  {
    icon: ShieldCheck,
    title: "Editor Performance Tracking",
    description:
      "Monitor every editor's output, delivery speed, and approval rate over time. Full transparency on who's delivering results.",
  },
  {
    icon: RefreshCw,
    title: "Free Replacements",
    description:
      "If an editor underperforms, request a free replacement. No questions asked, no extra cost.",
  },
];

const EditorEdge = () => {
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative py-28 overflow-hidden" style={{ background: '#09090f' }}>
      {/* Subtle purple glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(124,58,237,0.12) 0%, transparent 70%)',
        }}
      />
      {/* Grain overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")",
          backgroundSize: '200px 200px',
          mixBlendMode: 'overlay',
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        {/* Section header */}
        <div className="text-center mb-20">
          <p className="text-xs uppercase tracking-[0.25em] text-[#a855f7] mb-4 font-semibold">
            What sets us apart
          </p>
          <h2 className="text-3xl md:text-5xl font-extrabold text-white leading-tight mb-5">
            Editors who understand{" "}
            <span
              style={{
                background: 'linear-gradient(135deg, #a855f7, #c084fc, #e9d5ff)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              performance
            </span>
          </h2>
          <p className="text-white/40 max-w-xl mx-auto text-base leading-relaxed">
            We don't just assign editors. We train them on your KPIs.
          </p>
        </div>

        {/* Feature grid */}
        <div className="grid md:grid-cols-2 gap-5 mb-20">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <div
                key={i}
                className="group rounded-2xl p-7 transition-all duration-300 cursor-default"
                style={{
                  background: '#111118',
                  boxShadow:
                    '0 0 0 1px rgba(255,255,255,0.06) inset, 0 4px 24px rgba(0,0,0,0.4)',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow =
                    '0 0 0 1px rgba(168,85,247,0.25) inset, 0 0 40px rgba(168,85,247,0.08), 0 4px 24px rgba(0,0,0,0.4)';
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow =
                    '0 0 0 1px rgba(255,255,255,0.06) inset, 0 4px 24px rgba(0,0,0,0.4)';
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                }}
              >
                <div className="flex items-start gap-4">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{
                      background: 'rgba(168,85,247,0.08)',
                      boxShadow: '0 0 0 1px rgba(168,85,247,0.15) inset',
                    }}
                  >
                    <Icon className="w-5 h-5 text-[#a855f7]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1.5">{feature.title}</h3>
                    <p className="text-sm text-white/40 leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Dashboard previews */}
        <div className="space-y-12">
          {/* KPI Dashboard preview */}
          <div className="rounded-2xl overflow-hidden" style={{
            background: '#111118',
            boxShadow: '0 0 0 1px rgba(255,255,255,0.06) inset, 0 8px 40px rgba(0,0,0,0.5)',
          }}>
            <div className="p-6 border-b border-white/[0.06]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{
                  background: 'linear-gradient(135deg, #34d399, #10b981)',
                }}>
                  <TrendingUp className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-white">KPI Dashboard</h3>
                  <p className="text-xs text-white/30">Real-time Meta Ads performance</p>
                </div>
              </div>
            </div>
            <div className="relative aspect-[16/9] max-h-[500px] flex items-center justify-center bg-[#0c0c14]">
              {/* Placeholder for screenshot */}
              <div className="text-center">
                <TrendingUp className="w-12 h-12 text-white/10 mx-auto mb-3" />
                <p className="text-sm text-white/20">KPI Dashboard Preview</p>
                <p className="text-xs text-white/10 mt-1">Screenshot coming soon</p>
              </div>
            </div>
          </div>

          {/* Editor Performance preview */}
          <div className="rounded-2xl overflow-hidden" style={{
            background: '#111118',
            boxShadow: '0 0 0 1px rgba(255,255,255,0.06) inset, 0 8px 40px rgba(0,0,0,0.5)',
          }}>
            <div className="p-6 border-b border-white/[0.06]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{
                  background: 'linear-gradient(135deg, #a855f7, #7c3aed)',
                }}>
                  <BarChart3 className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-white">Editor Performance</h3>
                  <p className="text-xs text-white/30">Track output, speed & approval rates</p>
                </div>
              </div>
            </div>
            <div className="relative aspect-[16/9] max-h-[500px] flex items-center justify-center bg-[#0c0c14]">
              {/* Placeholder for screenshot */}
              <div className="text-center">
                <BarChart3 className="w-12 h-12 text-white/10 mx-auto mb-3" />
                <p className="text-sm text-white/20">Editor Performance Preview</p>
                <p className="text-xs text-white/10 mt-1">Screenshot coming soon</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <Button
            variant="cta"
            size="lg"
            onClick={() => scrollToSection("booking")}
            className="text-base px-8 py-5 h-auto group relative overflow-hidden shimmer-button rounded-xl"
          >
            <span className="relative z-10 flex items-center">
              See it in action
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
            </span>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default EditorEdge;
