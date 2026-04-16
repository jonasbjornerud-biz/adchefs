import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Sparkles,
  TrendingUp,
  BarChart3,
  Zap,
  FileSpreadsheet,
  Activity,
  Eye,
  DollarSign,
  Users,
  Calendar,
  CheckCircle2,
  Cable,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

const ACCENT = "#a855f7";

// ────────────────────────────────────────────────────────────────────────────
// Shared card shell
// ────────────────────────────────────────────────────────────────────────────
function FeatureCard({
  title,
  description,
  visual,
  className = "",
}: {
  title: string;
  description: string;
  visual: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`group relative overflow-hidden rounded-3xl transition-all duration-500 ${className}`}
      style={{
        background:
          "linear-gradient(180deg, rgba(28,24,42,0.85) 0%, rgba(14,12,22,0.92) 100%)",
        border: "1px solid rgba(255,255,255,0.06)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        boxShadow:
          "0 1px 0 rgba(255,255,255,0.08) inset, 0 0 0 1px rgba(255,255,255,0.02) inset, 0 20px 60px -20px rgba(0,0,0,0.6)",
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.transform = "translateY(-3px)";
        el.style.boxShadow =
          "0 1px 0 rgba(255,255,255,0.12) inset, 0 0 0 1px rgba(168,85,247,0.30) inset, 0 30px 80px -20px rgba(168,85,247,0.25), 0 0 60px -10px rgba(168,85,247,0.20)";
        el.style.borderColor = "rgba(168,85,247,0.35)";
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.transform = "translateY(0)";
        el.style.boxShadow =
          "0 1px 0 rgba(255,255,255,0.08) inset, 0 0 0 1px rgba(255,255,255,0.02) inset, 0 20px 60px -20px rgba(0,0,0,0.6)";
        el.style.borderColor = "rgba(255,255,255,0.06)";
      }}
    >
      {/* top inner highlight */}
      <div
        className="absolute inset-x-8 top-0 h-px pointer-events-none"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(168,85,247,0.6), transparent)",
          opacity: 0.5,
        }}
      />
      {/* bottom horizon glow (moneywise-style) */}
      <div
        className="absolute inset-x-0 -bottom-32 h-64 pointer-events-none opacity-60 group-hover:opacity-100 transition-opacity duration-700"
        style={{
          background:
            "radial-gradient(ellipse 60% 100% at 50% 100%, rgba(168,85,247,0.45) 0%, rgba(168,85,247,0.12) 35%, transparent 70%)",
          filter: "blur(20px)",
        }}
      />

      <div className="relative p-7 pb-0">
        <h3 className="text-[22px] font-semibold text-white tracking-tight mb-2">
          {title}
        </h3>
        <p className="text-sm text-white/45 leading-relaxed max-w-md">
          {description}
        </p>
      </div>

      <div className="relative mt-6 h-[280px]">{visual}</div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Visual #1 — KPI Dashboard (animated bar chart)
// ────────────────────────────────────────────────────────────────────────────
function KpiVisual() {
  const bars = [38, 62, 48, 78, 92, 70, 55];
  return (
    <div className="absolute inset-0 flex items-end justify-center px-8 pb-10 pt-6">
      {/* Floating pill */}
      <div
        className="absolute top-2 left-1/2 -translate-x-1/2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-medium text-white/85 z-10"
        style={{
          background: "rgba(168,85,247,0.15)",
          border: "1px solid rgba(168,85,247,0.35)",
          boxShadow: "0 0 24px -6px rgba(168,85,247,0.6)",
          backdropFilter: "blur(12px)",
        }}
      >
        <Activity className="w-3 h-3" style={{ color: ACCENT }} />
        Spend Trends
      </div>

      <div className="relative w-full h-full flex items-end justify-between gap-2.5">
        {bars.map((h, i) => (
          <div
            key={i}
            className="flex-1 rounded-t-md relative overflow-hidden"
            style={{
              height: `${h}%`,
              background:
                "linear-gradient(180deg, rgba(168,85,247,0.95) 0%, rgba(124,58,237,0.45) 100%)",
              boxShadow:
                "0 0 20px rgba(168,85,247,0.5), inset 0 1px 0 rgba(255,255,255,0.25)",
              animation: `barGrow 1.2s ${i * 0.08}s ease-out backwards`,
            }}
          >
            <div
              className="absolute inset-x-0 top-0 h-1/3"
              style={{
                background:
                  "linear-gradient(180deg, rgba(255,255,255,0.18), transparent)",
              }}
            />
          </div>
        ))}
      </div>
      <style>{`
        @keyframes barGrow {
          from { transform: scaleY(0); transform-origin: bottom; opacity: 0; }
          to   { transform: scaleY(1); transform-origin: bottom; opacity: 1; }
        }
      `}</style>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Visual #2 — Connected sources (floating chips)
// ────────────────────────────────────────────────────────────────────────────
function ConnectedVisual() {
  const chips = [
    { icon: DollarSign, label: "Ad Spend Sync" },
    { icon: Users, label: "Editor Tracking" },
    { icon: BarChart3, label: "ROAS Monitoring" },
    { icon: CheckCircle2, label: "Approval Flow" },
  ];
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2.5 px-8 py-8">
      {chips.map(({ icon: Icon, label }, i) => (
        <div
          key={i}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-[13px] font-medium text-white/90"
          style={{
            background: "rgba(168,85,247,0.10)",
            border: "1px solid rgba(168,85,247,0.28)",
            boxShadow:
              "0 0 24px -6px rgba(168,85,247,0.4), inset 0 1px 0 rgba(255,255,255,0.06)",
            backdropFilter: "blur(10px)",
            transform: `translateX(${[0, -18, 12, -6][i]}px)`,
            animation: `chipFloat 4s ${i * 0.4}s ease-in-out infinite`,
          }}
        >
          <Icon className="w-3.5 h-3.5" style={{ color: ACCENT }} />
          {label}
        </div>
      ))}
      <style>{`
        @keyframes chipFloat {
          0%, 100% { transform: translateY(0) translateX(var(--x, 0)); }
          50%      { transform: translateY(-4px) translateX(var(--x, 0)); }
        }
      `}</style>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Visual #3 — Integrations (Meta, Sheets, Calendly, Slack icons)
// ────────────────────────────────────────────────────────────────────────────
function IntegrationsVisual() {
  const items = [
    { Icon: Zap, x: "8%", y: "20%", size: 56, delay: 0 },
    { Icon: FileSpreadsheet, x: "78%", y: "18%", size: 56, delay: 0.3 },
    { Icon: Sparkles, x: "12%", y: "62%", size: 64, delay: 0.6 },
    { Icon: Calendar, x: "70%", y: "60%", size: 56, delay: 0.9 },
    { Icon: Cable, x: "44%", y: "38%", size: 80, delay: 1.2 },
  ];
  return (
    <div className="absolute inset-0">
      {/* Soft central glow */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] h-[180px] pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(168,85,247,0.35) 0%, transparent 65%)",
          filter: "blur(28px)",
        }}
      />
      {items.map(({ Icon, x, y, size, delay }, i) => (
        <div
          key={i}
          className="absolute rounded-2xl flex items-center justify-center"
          style={{
            left: x,
            top: y,
            width: size,
            height: size,
            background:
              "linear-gradient(135deg, rgba(168,85,247,0.30), rgba(124,58,237,0.10))",
            border: "1px solid rgba(168,85,247,0.35)",
            boxShadow:
              "0 0 24px -4px rgba(168,85,247,0.45), inset 0 1px 0 rgba(255,255,255,0.12)",
            backdropFilter: "blur(8px)",
            animation: `iconFloat 5s ${delay}s ease-in-out infinite`,
          }}
        >
          <Icon
            className="text-white"
            style={{
              width: size * 0.42,
              height: size * 0.42,
              filter: "drop-shadow(0 0 8px rgba(168,85,247,0.6))",
            }}
          />
        </div>
      ))}
      <style>{`
        @keyframes iconFloat {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(-6px); }
        }
      `}</style>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Visual #4 — Editor delivery snapshot (floating stat cards)
// ────────────────────────────────────────────────────────────────────────────
function EditorSnapshotVisual() {
  return (
    <div className="absolute inset-0 px-8 py-6">
      {/* Faint grid backdrop */}
      <svg
        className="absolute inset-0 w-full h-full opacity-30"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id="editor-wave"
            width="40"
            height="40"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M0 20 Q 10 10, 20 20 T 40 20"
              stroke="rgba(168,85,247,0.35)"
              fill="none"
              strokeWidth="0.8"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#editor-wave)" />
      </svg>

      {/* Stat card 1 */}
      <div
        className="absolute left-6 top-12 w-[62%] rounded-2xl p-3.5 flex items-center justify-between"
        style={{
          background:
            "linear-gradient(135deg, rgba(168,85,247,0.22), rgba(124,58,237,0.10))",
          border: "1px solid rgba(168,85,247,0.35)",
          boxShadow:
            "0 12px 32px -8px rgba(168,85,247,0.35), inset 0 1px 0 rgba(255,255,255,0.10)",
          backdropFilter: "blur(10px)",
          animation: "statFloat 5s 0s ease-in-out infinite",
        }}
      >
        <div>
          <div className="text-[10px] uppercase tracking-wider text-white/55 font-semibold">
            Videos delivered
          </div>
          <div className="text-lg font-bold text-white tabular-nums mt-0.5">
            48 this week
          </div>
        </div>
        <div
          className="text-[10px] font-semibold px-2 py-1 rounded-md"
          style={{
            background: "rgba(255,255,255,0.10)",
            color: "#fff",
          }}
        >
          Open
        </div>
      </div>

      {/* Stat card 2 */}
      <div
        className="absolute right-6 bottom-10 w-[62%] rounded-2xl p-3.5 flex items-center justify-between"
        style={{
          background:
            "linear-gradient(135deg, rgba(168,85,247,0.18), rgba(124,58,237,0.08))",
          border: "1px solid rgba(168,85,247,0.30)",
          boxShadow:
            "0 12px 32px -8px rgba(168,85,247,0.30), inset 0 1px 0 rgba(255,255,255,0.08)",
          backdropFilter: "blur(10px)",
          animation: "statFloat 5s 0.6s ease-in-out infinite",
        }}
      >
        <div>
          <div className="text-[10px] uppercase tracking-wider text-white/55 font-semibold">
            Approval rate
          </div>
          <div className="text-lg font-bold text-white tabular-nums mt-0.5">
            94%
          </div>
        </div>
        <div
          className="text-[10px] font-semibold px-2 py-1 rounded-md"
          style={{
            background: "rgba(255,255,255,0.10)",
            color: "#fff",
          }}
        >
          Open
        </div>
      </div>

      <style>{`
        @keyframes statFloat {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(-5px); }
        }
      `}</style>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Visual #5 — Live ROAS line chart (animated draw)
// ────────────────────────────────────────────────────────────────────────────
function RoasChartVisual() {
  const ref = useRef<SVGPathElement | null>(null);
  const [hover, setHover] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    const len = ref.current.getTotalLength();
    ref.current.style.strokeDasharray = `${len}`;
    ref.current.style.strokeDashoffset = `${len}`;
    requestAnimationFrame(() => {
      if (ref.current) {
        ref.current.style.transition = "stroke-dashoffset 2.4s ease-out";
        ref.current.style.strokeDashoffset = "0";
      }
    });
  }, []);

  return (
    <div
      className="absolute inset-0 px-6 pt-2 pb-6"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <svg viewBox="0 0 400 200" className="w-full h-full" preserveAspectRatio="none">
        <defs>
          <linearGradient id="roas-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(168,85,247,0.45)" />
            <stop offset="100%" stopColor="rgba(168,85,247,0)" />
          </linearGradient>
          <linearGradient id="roas-line" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#c084fc" />
            <stop offset="100%" stopColor="#a855f7" />
          </linearGradient>
        </defs>

        {/* horizontal grid */}
        {[40, 90, 140].map((y, i) => (
          <line
            key={i}
            x1="0"
            x2="400"
            y1={y}
            y2={y}
            stroke="rgba(255,255,255,0.05)"
            strokeWidth="1"
          />
        ))}

        {/* fill */}
        <path
          d="M0,150 C50,140 80,120 120,110 S 200,80 240,70 300,50 340,40 380,28 400,22 L400,200 L0,200 Z"
          fill="url(#roas-fill)"
          opacity="0.7"
        />
        {/* line */}
        <path
          ref={ref}
          d="M0,150 C50,140 80,120 120,110 S 200,80 240,70 300,50 340,40 380,28 400,22"
          fill="none"
          stroke="url(#roas-line)"
          strokeWidth="2.5"
          strokeLinecap="round"
          style={{ filter: "drop-shadow(0 0 8px rgba(168,85,247,0.6))" }}
        />

        {/* hover dot */}
        <circle
          cx="280"
          cy="60"
          r={hover ? 5 : 4}
          fill="#fff"
          style={{
            filter: "drop-shadow(0 0 8px rgba(168,85,247,0.9))",
            transition: "r 0.2s",
          }}
        />
      </svg>

      {/* Floating tooltip */}
      <div
        className="absolute rounded-xl px-3 py-2"
        style={{
          left: "62%",
          top: "18%",
          background: "rgba(20,16,32,0.92)",
          border: "1px solid rgba(168,85,247,0.4)",
          boxShadow: "0 8px 24px -4px rgba(0,0,0,0.6), 0 0 20px -4px rgba(168,85,247,0.4)",
          backdropFilter: "blur(10px)",
          minWidth: "120px",
        }}
      >
        <div className="text-[10px] font-medium text-white/55 mb-1">Apr 14, 2026</div>
        <div className="flex items-center gap-1.5 text-[11px] text-white/85">
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: ACCENT, boxShadow: `0 0 6px ${ACCENT}` }}
          />
          ROAS · 4.62x
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-white/55 mt-0.5">
          <span className="w-1.5 h-1.5 rounded-full bg-white/35" />
          Spend · $3,840
        </div>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Section
// ────────────────────────────────────────────────────────────────────────────
const EditorEdge = () => {
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      className="relative py-28 overflow-hidden"
      style={{ background: "#09090f" }}
    >
      {/* Subtle purple top glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(124,58,237,0.12) 0%, transparent 70%)",
        }}
      />
      {/* Grain overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")",
          backgroundSize: "200px 200px",
          mixBlendMode: "overlay",
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        {/* Section header */}
        <div className="text-center mb-16">
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6 text-[11px] font-medium text-white/85"
            style={{
              background: "rgba(168,85,247,0.12)",
              border: "1px solid rgba(168,85,247,0.30)",
              boxShadow: "0 0 24px -6px rgba(168,85,247,0.5)",
            }}
          >
            <Sparkles className="w-3 h-3" style={{ color: ACCENT }} />
            What sets us apart
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold text-white leading-tight mb-5">
            Editors who understand{" "}
            <span
              style={{
                background:
                  "linear-gradient(135deg, #a855f7, #c084fc, #e9d5ff)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              performance
            </span>
          </h2>
          <p className="text-white/45 max-w-xl mx-auto text-base leading-relaxed">
            From real-time KPI dashboards to editor delivery tracking — every part
            of your back-end, built in.
          </p>
        </div>

        {/* Visual feature grid: 3 + 2 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
          <FeatureCard
            title="KPI Dashboard"
            description="Real-time spend, ROAS, and creative performance — synced live from Meta Ads."
            visual={<KpiVisual />}
          />
          <FeatureCard
            title="Connected Back-End"
            description="Every data source unified in one portal you log into 24/7."
            visual={<ConnectedVisual />}
          />
          <FeatureCard
            title="Seamless Integrations"
            description="Meta Ads, Google Sheets, Calendly — wired in from day one."
            visual={<IntegrationsVisual />}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-16">
          <FeatureCard
            title="Editor Performance"
            description="See deliveries, approval rates, and weekly trends across every editor on your account."
            visual={<EditorSnapshotVisual />}
          />
          <FeatureCard
            title="Live ROAS Tracking"
            description="Track every dollar spent against revenue earned — visualized day by day."
            visual={<RoasChartVisual />}
          />
        </div>

        {/* CTA */}
        <div className="text-center">
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
