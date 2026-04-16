import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Sparkles,
  TrendingUp,
  BarChart3,
  Zap,
  FileSpreadsheet,
  Activity,
  DollarSign,
  Users,
  Calendar,
  CheckCircle2,
  Cable,
  Brain,
} from "lucide-react";
import { useEffect, useRef } from "react";

const ACCENT = "#a855f7";

// ────────────────────────────────────────────────────────────────────────────
// Card shell — animated gradient sweep, grain shimmer, organic hover
// ────────────────────────────────────────────────────────────────────────────
function FeatureCard({
  title,
  description,
  visual,
  className = "",
  delay = 0,
}: {
  title: string;
  description: string;
  visual: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <div
      className={`mw-card group relative overflow-hidden rounded-3xl ${className}`}
      style={{
        animationDelay: `${delay}s`,
      }}
    >
      {/* Animated conic gradient border sweep */}
      <div className="mw-card-border" aria-hidden />

      {/* Inner surface */}
      <div className="mw-card-surface relative">
        {/* Top inner highlight */}
        <div className="absolute inset-x-8 top-0 h-px pointer-events-none mw-top-line" />

        {/* Continuously breathing horizon glow at the bottom */}
        <div className="absolute inset-x-0 -bottom-32 h-64 pointer-events-none mw-horizon" />

        {/* Drifting grain shimmer overlay */}
        <div className="absolute inset-0 pointer-events-none mw-grain" />

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
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Visual #1 — KPI bars that breathe + a pill that floats
// ────────────────────────────────────────────────────────────────────────────
function KpiVisual() {
  const bars = [38, 62, 48, 78, 92, 70, 55, 84];
  return (
    <div className="absolute inset-0 flex items-end justify-center px-8 pb-10 pt-6">
      {/* Floating pill that drifts */}
      <div
        className="absolute top-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-medium text-white/85 z-10 mw-drift"
        style={{
          background: "rgba(168,85,247,0.15)",
          border: "1px solid rgba(168,85,247,0.35)",
          boxShadow: "0 0 24px -6px rgba(168,85,247,0.6)",
          backdropFilter: "blur(12px)",
        }}
      >
        <Activity className="w-3 h-3 mw-pulse-icon" style={{ color: ACCENT }} />
        Spend Trends · Live
      </div>

      <div className="relative w-full h-full flex items-end justify-between gap-2">
        {bars.map((h, i) => (
          <div
            key={i}
            className="flex-1 rounded-t-md relative overflow-hidden mw-bar"
            style={
              {
                "--h": `${h}%`,
                "--delay": `${i * 0.18}s`,
              } as React.CSSProperties
            }
          >
            {/* Inner wet-glass highlight */}
            <div
              className="absolute inset-x-0 top-0 h-1/3 pointer-events-none"
              style={{
                background:
                  "linear-gradient(180deg, rgba(255,255,255,0.20), transparent)",
              }}
            />
            {/* Vertical sheen sweep */}
            <div
              className="absolute inset-0 mw-bar-sheen pointer-events-none"
              style={{ animationDelay: `${i * 0.25}s` }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Visual #2 — Drifting chips with breathing glow
// ────────────────────────────────────────────────────────────────────────────
function ConnectedVisual() {
  const chips = [
    { icon: DollarSign, label: "Ad Spend Sync", x: 0 },
    { icon: Users, label: "Editor Tracking", x: -18 },
    { icon: BarChart3, label: "ROAS Monitoring", x: 12 },
    { icon: CheckCircle2, label: "Approval Flow", x: -6 },
  ];
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2.5 px-8 py-8">
      {chips.map(({ icon: Icon, label, x }, i) => (
        <div
          key={i}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-[13px] font-medium text-white/90 mw-chip"
          style={
            {
              background: "rgba(168,85,247,0.10)",
              border: "1px solid rgba(168,85,247,0.28)",
              boxShadow:
                "0 0 24px -6px rgba(168,85,247,0.4), inset 0 1px 0 rgba(255,255,255,0.06)",
              backdropFilter: "blur(10px)",
              "--x": `${x}px`,
              "--delay": `${i * 0.6}s`,
            } as React.CSSProperties
          }
        >
          <Icon className="w-3.5 h-3.5" style={{ color: ACCENT }} />
          {label}
        </div>
      ))}
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Visual #3 — Integrations cluster with rotating central glow + floating icons
// ────────────────────────────────────────────────────────────────────────────
function IntegrationsVisual() {
  const items = [
    { Icon: Zap, x: "8%", y: "20%", size: 56, delay: 0 },
    { Icon: FileSpreadsheet, x: "78%", y: "18%", size: 56, delay: 0.5 },
    { Icon: Brain, x: "12%", y: "62%", size: 64, delay: 1 },
    { Icon: Calendar, x: "70%", y: "60%", size: 56, delay: 1.5 },
    { Icon: Cable, x: "44%", y: "38%", size: 80, delay: 0.25 },
  ];
  return (
    <div className="absolute inset-0">
      {/* Slowly rotating central glow */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] h-[220px] pointer-events-none mw-rotor" />

      {items.map(({ Icon, x, y, size, delay }, i) => (
        <div
          key={i}
          className="absolute rounded-2xl flex items-center justify-center mw-icon-tile"
          style={
            {
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
              "--delay": `${delay}s`,
            } as React.CSSProperties
          }
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
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Visual #4 — KPI brain: continuously rolling stat tiles
// ────────────────────────────────────────────────────────────────────────────
function EditorBrainVisual() {
  return (
    <div className="absolute inset-0 px-8 py-6">
      {/* Wave backdrop */}
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
            patternTransform="translate(0 0)"
          >
            <path
              d="M0 20 Q 10 10, 20 20 T 40 20"
              stroke="rgba(168,85,247,0.35)"
              fill="none"
              strokeWidth="0.8"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#editor-wave)" className="mw-wave-shift" />
      </svg>

      {/* Stat card 1 — drifts up/down */}
      <div
        className="absolute left-6 top-12 w-[62%] rounded-2xl p-3.5 flex items-center justify-between mw-stat"
        style={{
          background:
            "linear-gradient(135deg, rgba(168,85,247,0.22), rgba(124,58,237,0.10))",
          border: "1px solid rgba(168,85,247,0.35)",
          boxShadow:
            "0 12px 32px -8px rgba(168,85,247,0.35), inset 0 1px 0 rgba(255,255,255,0.10)",
          backdropFilter: "blur(10px)",
        }}
      >
        <div>
          <div className="text-[10px] uppercase tracking-wider text-white/55 font-semibold">
            Hook rate · this week
          </div>
          <div className="text-lg font-bold text-white tabular-nums mt-0.5">
            38% <span className="text-[#a855f7] text-sm">↑ 9%</span>
          </div>
        </div>
        <div
          className="text-[10px] font-semibold px-2 py-1 rounded-md"
          style={{ background: "rgba(255,255,255,0.10)", color: "#fff" }}
        >
          Live
        </div>
      </div>

      {/* Stat card 2 — opposite phase drift */}
      <div
        className="absolute right-6 bottom-10 w-[62%] rounded-2xl p-3.5 flex items-center justify-between mw-stat mw-stat-alt"
        style={{
          background:
            "linear-gradient(135deg, rgba(168,85,247,0.18), rgba(124,58,237,0.08))",
          border: "1px solid rgba(168,85,247,0.30)",
          boxShadow:
            "0 12px 32px -8px rgba(168,85,247,0.30), inset 0 1px 0 rgba(255,255,255,0.08)",
          backdropFilter: "blur(10px)",
        }}
      >
        <div>
          <div className="text-[10px] uppercase tracking-wider text-white/55 font-semibold">
            ROAS · 7d avg
          </div>
          <div className="text-lg font-bold text-white tabular-nums mt-0.5">
            4.62x <span className="text-[#a855f7] text-sm">↑ 0.4</span>
          </div>
        </div>
        <div
          className="text-[10px] font-semibold px-2 py-1 rounded-md"
          style={{ background: "rgba(255,255,255,0.10)", color: "#fff" }}
        >
          Live
        </div>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Visual #5 — Continuously redrawing ROAS line + tracking dot
// ────────────────────────────────────────────────────────────────────────────
function RoasChartVisual() {
  const ref = useRef<SVGPathElement | null>(null);

  useEffect(() => {
    if (!ref.current) return;
    const len = ref.current.getTotalLength();
    ref.current.style.strokeDasharray = `${len}`;
    ref.current.style.strokeDashoffset = `${len}`;
    ref.current.style.animation = "mw-draw 4.5s ease-in-out infinite";
    (ref.current.style as any).setProperty("--len", `${len}`);
  }, []);

  return (
    <div className="absolute inset-0 px-6 pt-2 pb-6">
      <svg
        viewBox="0 0 400 200"
        className="w-full h-full"
        preserveAspectRatio="none"
      >
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

        <path
          d="M0,150 C50,140 80,120 120,110 S 200,80 240,70 300,50 340,40 380,28 400,22 L400,200 L0,200 Z"
          fill="url(#roas-fill)"
          opacity="0.7"
          className="mw-fill-pulse"
        />
        <path
          ref={ref}
          d="M0,150 C50,140 80,120 120,110 S 200,80 240,70 300,50 340,40 380,28 400,22"
          fill="none"
          stroke="url(#roas-line)"
          strokeWidth="2.5"
          strokeLinecap="round"
          style={{ filter: "drop-shadow(0 0 8px rgba(168,85,247,0.6))" }}
        />

        {/* Tracking dot that travels along the path */}
        <circle r="4" fill="#fff" className="mw-trace-dot">
          <animateMotion
            dur="4.5s"
            repeatCount="indefinite"
            path="M0,150 C50,140 80,120 120,110 S 200,80 240,70 300,50 340,40 380,28 400,22"
          />
        </circle>
      </svg>

      {/* Floating tooltip */}
      <div
        className="absolute rounded-xl px-3 py-2 mw-drift"
        style={{
          left: "62%",
          top: "16%",
          background: "rgba(20,16,32,0.92)",
          border: "1px solid rgba(168,85,247,0.4)",
          boxShadow:
            "0 8px 24px -4px rgba(0,0,0,0.6), 0 0 20px -4px rgba(168,85,247,0.4)",
          backdropFilter: "blur(10px)",
          minWidth: "120px",
        }}
      >
        <div className="text-[10px] font-medium text-white/55 mb-1">
          Apr 14, 2026
        </div>
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
      {/* Continuously drifting purple ambient glow */}
      <div className="absolute inset-0 pointer-events-none mw-ambient" />

      {/* Animated grain overlay (drifts, like moneywise) */}
      <div className="absolute inset-0 pointer-events-none mw-grain-bg" />

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
              why ads work
            </span>
          </h2>
          <p className="text-white/50 max-w-2xl mx-auto text-base leading-relaxed">
            Most agencies hand you editors who push pixels. Ours are trained on
            hook rates, hold curves, CPA and ROAS — they know which 3 seconds
            make a winner, and why. That&apos;s how cuts go from &quot;nice&quot;
            to printing money.
          </p>
        </div>

        {/* 3 + 2 grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
          <FeatureCard
            delay={0}
            title="KPI Dashboard"
            description="Real-time spend, ROAS and creative performance — synced live from Meta Ads."
            visual={<KpiVisual />}
          />
          <FeatureCard
            delay={0.1}
            title="Connected Back-End"
            description="Every data source unified in one portal you log into 24/7."
            visual={<ConnectedVisual />}
          />
          <FeatureCard
            delay={0.2}
            title="Seamless Integrations"
            description="Meta Ads, Google Sheets, Calendly — wired in from day one."
            visual={<IntegrationsVisual />}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-16">
          <FeatureCard
            delay={0.3}
            title="Editors trained on your KPIs"
            description="Hook rate. Hold rate. CPA. ROAS. Our team studies what your winners share — then engineers more of them."
            visual={<EditorBrainVisual />}
          />
          <FeatureCard
            delay={0.4}
            title="Live ROAS Tracking"
            description="Every dollar spent against revenue earned — visualised, day by day, in real time."
            visual={<RoasChartVisual />}
          />
        </div>

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

      {/* ──────────────────────────────────────────────────────────────────
          All animations live here — continuous, fluid, moneywise-style
         ────────────────────────────────────────────────────────────────── */}
      <style>{`
        /* Background ambient glow that drifts */
        .mw-ambient {
          background:
            radial-gradient(ellipse 70% 50% at 50% 0%, rgba(124,58,237,0.14) 0%, transparent 70%),
            radial-gradient(ellipse 50% 35% at 20% 30%, rgba(168,85,247,0.08) 0%, transparent 70%),
            radial-gradient(ellipse 50% 35% at 80% 70%, rgba(168,85,247,0.10) 0%, transparent 70%);
          animation: mw-ambient-drift 18s ease-in-out infinite alternate;
        }
        @keyframes mw-ambient-drift {
          0%   { transform: translate3d(0, 0, 0) scale(1); }
          50%  { transform: translate3d(-1.5%, 1%, 0) scale(1.03); }
          100% { transform: translate3d(1.5%, -1%, 0) scale(1.02); }
        }

        /* Drifting grain across the section */
        .mw-grain-bg {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
          background-size: 220px 220px;
          mix-blend-mode: overlay;
          opacity: 0.06;
          animation: mw-grain-shift 8s steps(8) infinite;
        }
        @keyframes mw-grain-shift {
          0%   { background-position: 0 0; }
          25%  { background-position: -40px 30px; }
          50%  { background-position: 40px -20px; }
          75%  { background-position: -30px -40px; }
          100% { background-position: 0 0; }
        }

        /* Card entrance + perpetual subtle breathing */
        .mw-card {
          opacity: 0;
          transform: translateY(20px);
          animation: mw-card-in 1s cubic-bezier(.2,.7,.2,1) forwards;
          transition: transform .6s cubic-bezier(.2,.7,.2,1);
        }
        @keyframes mw-card-in {
          to { opacity: 1; transform: translateY(0); }
        }
        .mw-card:hover { transform: translateY(-4px); }

        /* Conic gradient border that slowly rotates */
        .mw-card-border {
          position: absolute;
          inset: -1px;
          border-radius: 24px;
          padding: 1px;
          background:
            conic-gradient(from 0deg,
              rgba(168,85,247,0.0) 0deg,
              rgba(168,85,247,0.45) 60deg,
              rgba(168,85,247,0.0) 140deg,
              rgba(168,85,247,0.0) 220deg,
              rgba(168,85,247,0.35) 280deg,
              rgba(168,85,247,0.0) 360deg);
          -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
          -webkit-mask-composite: xor;
                  mask-composite: exclude;
          opacity: 0.55;
          animation: mw-spin 14s linear infinite;
          pointer-events: none;
        }
        @keyframes mw-spin { to { transform: rotate(360deg); } }

        /* Card surface */
        .mw-card-surface {
          background: linear-gradient(180deg, rgba(28,24,42,0.85) 0%, rgba(14,12,22,0.92) 100%);
          border-radius: 24px;
          height: 100%;
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          box-shadow:
            0 1px 0 rgba(255,255,255,0.08) inset,
            0 0 0 1px rgba(255,255,255,0.04) inset,
            0 20px 60px -20px rgba(0,0,0,0.6);
        }

        /* Top inner highlight that breathes */
        .mw-top-line {
          background: linear-gradient(90deg, transparent, rgba(168,85,247,0.65), transparent);
          opacity: 0.5;
          animation: mw-line-pulse 5s ease-in-out infinite;
        }
        @keyframes mw-line-pulse {
          0%, 100% { opacity: 0.35; transform: scaleX(0.85); }
          50%      { opacity: 0.85; transform: scaleX(1); }
        }

        /* Continuously breathing horizon glow */
        .mw-horizon {
          background: radial-gradient(ellipse 60% 100% at 50% 100%,
            rgba(168,85,247,0.50) 0%,
            rgba(168,85,247,0.12) 35%,
            transparent 70%);
          filter: blur(20px);
          animation: mw-horizon-breath 6s ease-in-out infinite;
        }
        @keyframes mw-horizon-breath {
          0%, 100% { opacity: 0.5;  transform: translateY(0)    scaleX(1); }
          50%      { opacity: 0.85; transform: translateY(-6px) scaleX(1.05); }
        }

        /* Per-card grain shimmer (sweeps slowly) */
        .mw-grain {
          background-image:
            url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
          background-size: 180px 180px;
          mix-blend-mode: overlay;
          opacity: 0.07;
          animation: mw-grain-shift 6s steps(6) infinite reverse;
        }

        /* KPI bars: grow once, then breathe forever */
        .mw-bar {
          height: var(--h);
          background: linear-gradient(180deg, rgba(168,85,247,0.95) 0%, rgba(124,58,237,0.45) 100%);
          box-shadow: 0 0 20px rgba(168,85,247,0.5), inset 0 1px 0 rgba(255,255,255,0.25);
          transform-origin: bottom;
          animation:
            mw-bar-in 1.2s var(--delay) ease-out backwards,
            mw-bar-breathe 3.6s var(--delay) ease-in-out infinite;
        }
        @keyframes mw-bar-in {
          from { transform: scaleY(0); opacity: 0; }
          to   { transform: scaleY(1); opacity: 1; }
        }
        @keyframes mw-bar-breathe {
          0%, 100% { transform: scaleY(1);    filter: brightness(1); }
          50%      { transform: scaleY(0.94); filter: brightness(1.15); }
        }
        .mw-bar-sheen {
          background: linear-gradient(180deg, transparent, rgba(255,255,255,0.18), transparent);
          transform: translateY(-100%);
          animation: mw-sheen 4.2s ease-in-out infinite;
        }
        @keyframes mw-sheen {
          0%   { transform: translateY(-100%); }
          50%  { transform: translateY(100%); }
          100% { transform: translateY(100%); }
        }

        /* Drifting pill / tooltip */
        .mw-drift { animation: mw-drift 6s ease-in-out infinite; }
        @keyframes mw-drift {
          0%, 100% { transform: translate(-50%, 0) translateY(0); }
          50%      { transform: translate(-50%, 0) translateY(-5px); }
        }
        /* tooltip override (no -50% center) */
        .mw-card .mw-drift:not(.text-white\\/85) {}
        .mw-pulse-icon { animation: mw-icon-pulse 2.4s ease-in-out infinite; }
        @keyframes mw-icon-pulse {
          0%, 100% { transform: scale(1);    opacity: 1; }
          50%      { transform: scale(1.18); opacity: 0.85; }
        }

        /* Chips drift on different phases */
        .mw-chip {
          transform: translateX(var(--x));
          animation: mw-chip-float 5.5s var(--delay) ease-in-out infinite;
        }
        @keyframes mw-chip-float {
          0%, 100% { transform: translateX(var(--x)) translateY(0); box-shadow: 0 0 24px -6px rgba(168,85,247,0.40), inset 0 1px 0 rgba(255,255,255,0.06); }
          50%      { transform: translateX(var(--x)) translateY(-6px); box-shadow: 0 0 32px -4px rgba(168,85,247,0.55), inset 0 1px 0 rgba(255,255,255,0.10); }
        }

        /* Integration tiles float continuously */
        .mw-icon-tile {
          animation: mw-tile-float 5s var(--delay) ease-in-out infinite;
        }
        @keyframes mw-tile-float {
          0%, 100% { transform: translateY(0)   rotate(-1deg); }
          50%      { transform: translateY(-8px) rotate(1deg); }
        }
        .mw-rotor {
          background: radial-gradient(circle, rgba(168,85,247,0.40) 0%, transparent 65%);
          filter: blur(28px);
          animation: mw-rotor-spin 16s linear infinite, mw-rotor-pulse 5s ease-in-out infinite;
        }
        @keyframes mw-rotor-spin  { to { transform: translate(-50%,-50%) rotate(360deg); } }
        @keyframes mw-rotor-pulse {
          0%, 100% { opacity: 0.7; }
          50%      { opacity: 1;   }
        }

        /* Editor stats drift on opposite phases */
        .mw-stat     { animation: mw-stat-float 5.5s ease-in-out infinite; }
        .mw-stat-alt { animation: mw-stat-float 5.5s ease-in-out infinite; animation-delay: -2.75s; }
        @keyframes mw-stat-float {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(-6px); }
        }
        .mw-wave-shift {
          animation: mw-wave-pan 12s linear infinite;
        }
        @keyframes mw-wave-pan {
          from { transform: translateX(0); }
          to   { transform: translateX(-40px); }
        }

        /* ROAS line: continuously redraws */
        @keyframes mw-draw {
          0%   { stroke-dashoffset: var(--len); }
          50%  { stroke-dashoffset: 0; }
          100% { stroke-dashoffset: 0; }
        }
        .mw-fill-pulse { animation: mw-fill-pulse 4.5s ease-in-out infinite; }
        @keyframes mw-fill-pulse {
          0%, 100% { opacity: 0.55; }
          50%      { opacity: 0.85; }
        }
        .mw-trace-dot { filter: drop-shadow(0 0 8px rgba(168,85,247,0.95)); }

        /* Respect reduced motion */
        @media (prefers-reduced-motion: reduce) {
          .mw-card,
          .mw-card-border,
          .mw-top-line,
          .mw-horizon,
          .mw-grain,
          .mw-grain-bg,
          .mw-ambient,
          .mw-bar,
          .mw-bar-sheen,
          .mw-drift,
          .mw-pulse-icon,
          .mw-chip,
          .mw-icon-tile,
          .mw-rotor,
          .mw-stat,
          .mw-stat-alt,
          .mw-wave-shift,
          .mw-fill-pulse {
            animation: none !important;
          }
        }
      `}</style>
    </section>
  );
};

export default EditorEdge;
