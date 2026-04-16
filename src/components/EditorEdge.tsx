import { useEffect, useMemo, useRef, useState } from "react";
import Lottie, { LottieRefCurrentProps } from "lottie-react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

const ACCENT = "#a855f7";

// Moneywise's actual Lottie animations (publicly hosted, render perfectly)
const LOTTIE = {
  smarterTracking:
    "https://cdn.prod.website-files.com/6916312c57d61394f5b6212c/692db3dce38346f6ce873258_smarter%20tracking.json",
  automate:
    "https://cdn.prod.website-files.com/6916312c57d61394f5b6212c/692db3ef1044fca43e45ed23_automated%20finances.json",
  cashflow:
    "https://cdn.prod.website-files.com/6916312c57d61394f5b6212c/692db3ef9e2ca754aea8c353_cashflow%20snapshot%20(2).json",
};

// ────────────────────────────────────────────────────────────────────────────
// Lottie loader — recolors to brand purple AND rewrites text layers so the
// animation actually says what the card itself says.
// ────────────────────────────────────────────────────────────────────────────
function transformLottie(data: any, textMap?: Record<string, string>): any {
  const palette: [number, number, number][] = [
    [0.486, 0.227, 0.929], // #7c3aed
    [0.659, 0.333, 0.969], // #a855f7
    [0.753, 0.518, 0.988], // #c084fc
    [0.914, 0.835, 1.0],   // #e9d5ff
  ];
  let idx = 0;
  const pickColor = () => palette[idx++ % palette.length];

  const visit = (node: any): void => {
    if (!node || typeof node !== "object") return;

    if (node.ty === "fl" || node.ty === "st") {
      if (node.c && Array.isArray(node.c.k)) {
        const k = node.c.k;
        if (typeof k[0] === "number") {
          const [r, g, b] = pickColor();
          node.c.k = [r, g, b, k[3] ?? 1];
        }
      }
    }
    if (node.ty === "gf" || node.ty === "gs") {
      if (node.g && Array.isArray(node.g.k?.k)) {
        const stops = node.g.k.k;
        for (let i = 0; i + 3 < stops.length; i += 4) {
          const [r, g, b] = pickColor();
          stops[i + 1] = r;
          stops[i + 2] = g;
          stops[i + 3] = b;
        }
      }
    }
    // Lottie text layer rewrite: ty === 5
    if (node.ty === 5 && node.t?.d?.k) {
      for (const k of node.t.d.k) {
        const cur = k?.s?.t;
        if (typeof cur === "string" && textMap && textMap[cur] !== undefined) {
          k.s.t = textMap[cur];
        }
      }
    }

    for (const key of Object.keys(node)) {
      const v = node[key];
      if (Array.isArray(v)) v.forEach(visit);
      else if (typeof v === "object") visit(v);
    }
  };
  const cloned = JSON.parse(JSON.stringify(data));
  visit(cloned);
  return cloned;
}

function useLottieJson(url: string, textMap?: Record<string, string>) {
  const [raw, setRaw] = useState<any | null>(null);
  useEffect(() => {
    let alive = true;
    fetch(url)
      .then((r) => r.json())
      .then((j) => { if (alive) setRaw(j); })
      .catch(() => {});
    return () => { alive = false; };
  }, [url]);
  // re-transform if textMap changes
  const mapKey = textMap ? JSON.stringify(textMap) : "";
  return useMemo(() => (raw ? transformLottie(raw, textMap) : null), [raw, mapKey]);
}

// ────────────────────────────────────────────────────────────────────────────
// Card shell (smaller, refined motion — no spinning borders, no cheap pulses)
// ────────────────────────────────────────────────────────────────────────────
function FeatureCard({
  title,
  description,
  visual,
  delay = 0,
  className = "",
}: {
  title: string;
  description: string;
  visual: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <div
      className={`mw-card group relative overflow-hidden rounded-3xl ${className}`}
      style={{
        animationDelay: `${delay}s`,
        background:
          "linear-gradient(180deg, rgba(28,24,42,0.85) 0%, rgba(14,12,22,0.92) 100%)",
        border: "1px solid rgba(255,255,255,0.06)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        boxShadow:
          "0 1px 0 rgba(255,255,255,0.08) inset, 0 0 0 1px rgba(255,255,255,0.02) inset, 0 20px 60px -20px rgba(0,0,0,0.6)",
      }}
    >
      {/* Top inner highlight */}
      <div
        className="absolute inset-x-8 top-0 h-px pointer-events-none"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(168,85,247,0.55), transparent)",
        }}
      />
      {/* Subtle, slow horizon glow — no obvious pulse */}
      <div
        className="absolute inset-x-0 -bottom-32 h-64 pointer-events-none mw-horizon"
        style={{
          background:
            "radial-gradient(ellipse 60% 100% at 50% 100%, rgba(168,85,247,0.40) 0%, rgba(168,85,247,0.10) 35%, transparent 70%)",
          filter: "blur(20px)",
        }}
      />

      <div className="relative p-7 pb-2">
        <h3 className="text-[22px] font-semibold text-white tracking-tight mb-2">
          {title}
        </h3>
        <p className="text-sm text-white/45 leading-relaxed max-w-md">
          {description}
        </p>
      </div>

      <div className="relative h-[260px]">{visual}</div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Visual #1 — KPI Dashboard (moneywise smarter-tracking Lottie, recoloured)
// ────────────────────────────────────────────────────────────────────────────
function LottieVisual({
  url,
  textMap,
}: {
  url: string;
  textMap?: Record<string, string>;
}) {
  const data = useLottieJson(url, textMap);
  const ref = useRef<LottieRefCurrentProps>(null);
  if (!data) {
    return <div className="absolute inset-0 mw-skeleton" />;
  }
  return (
    <div className="absolute inset-0 flex items-end justify-center">
      <Lottie
        lottieRef={ref}
        animationData={data}
        loop
        autoplay
        rendererSettings={{ preserveAspectRatio: "xMidYMax slice" }}
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Visual #2 — Editors trained on KPIs (moneywise automate Lottie, recoloured)
// ────────────────────────────────────────────────────────────────────────────
// (uses LottieVisual)

// ────────────────────────────────────────────────────────────────────────────
// Visual #3 — Meta-focused integrations (custom, Meta logo + orbit)
// ────────────────────────────────────────────────────────────────────────────
function MetaIntegrationVisual() {
  return (
    <div className="absolute inset-0">
      {/* Slow concentric rings */}
      <svg
        viewBox="0 0 400 280"
        className="absolute inset-0 w-full h-full"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <radialGradient id="metaGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(168,85,247,0.55)" />
            <stop offset="60%" stopColor="rgba(168,85,247,0.10)" />
            <stop offset="100%" stopColor="rgba(168,85,247,0)" />
          </radialGradient>
          <linearGradient id="metaLogoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#c084fc" />
            <stop offset="100%" stopColor="#7c3aed" />
          </linearGradient>
        </defs>

        {/* Central glow */}
        <ellipse cx="200" cy="140" rx="120" ry="80" fill="url(#metaGlow)" />

        {/* Three rotating rings, different speeds */}
        <g className="mw-orbit-slow" style={{ transformOrigin: "200px 140px" }}>
          <ellipse
            cx="200"
            cy="140"
            rx="135"
            ry="72"
            fill="none"
            stroke="rgba(168,85,247,0.20)"
            strokeWidth="1"
            strokeDasharray="2 6"
          />
        </g>
        <g
          className="mw-orbit-mid"
          style={{ transformOrigin: "200px 140px" }}
        >
          <ellipse
            cx="200"
            cy="140"
            rx="100"
            ry="54"
            fill="none"
            stroke="rgba(168,85,247,0.30)"
            strokeWidth="1"
          />
          {/* Travelling particle on ring */}
          <circle cx="300" cy="140" r="3" fill="#fff">
            <animateMotion
              dur="6s"
              repeatCount="indefinite"
              path="M 100,0 a 100,54 0 1,1 -200,0 a 100,54 0 1,1 200,0"
            />
          </circle>
        </g>
        <g className="mw-orbit-fast" style={{ transformOrigin: "200px 140px" }}>
          <ellipse
            cx="200"
            cy="140"
            rx="65"
            ry="36"
            fill="none"
            stroke="rgba(168,85,247,0.40)"
            strokeWidth="1.2"
          />
        </g>

        {/* Central Meta logo (infinity-style ∞ from official Meta mark) */}
        <g
          transform="translate(160 110)"
          className="mw-meta-breath"
          style={{ transformOrigin: "40px 30px" }}
        >
          <path
            d="M0,30 C0,12 12,0 26,0 C36,0 44,6 52,18 L60,30 L68,18 C76,6 84,0 94,0 C108,0 120,12 120,30 C120,48 108,60 94,60 C84,60 76,54 68,42 L60,30 L52,42 C44,54 36,60 26,60 C12,60 0,48 0,30 Z M14,30 C14,40 20,46 26,46 C32,46 38,40 44,30 C38,20 32,14 26,14 C20,14 14,20 14,30 Z M76,30 C82,40 88,46 94,46 C100,46 106,40 106,30 C106,20 100,14 94,14 C88,14 82,20 76,30 Z"
            fill="url(#metaLogoGrad)"
            style={{ filter: "drop-shadow(0 0 16px rgba(168,85,247,0.7))" }}
            transform="scale(0.7)"
          />
        </g>

        {/* Floating signal pulses outward from logo */}
        <circle
          cx="200"
          cy="140"
          r="0"
          fill="none"
          stroke="rgba(168,85,247,0.6)"
          strokeWidth="1.5"
        >
          <animate attributeName="r" values="0;90" dur="3.5s" repeatCount="indefinite" />
          <animate
            attributeName="opacity"
            values="0.7;0"
            dur="3.5s"
            repeatCount="indefinite"
          />
        </circle>
        <circle
          cx="200"
          cy="140"
          r="0"
          fill="none"
          stroke="rgba(168,85,247,0.5)"
          strokeWidth="1.5"
        >
          <animate
            attributeName="r"
            values="0;90"
            dur="3.5s"
            begin="1.75s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            values="0.7;0"
            dur="3.5s"
            begin="1.75s"
            repeatCount="indefinite"
          />
        </circle>
      </svg>

      {/* Bottom label */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-medium text-white/85"
        style={{
          background: "rgba(168,85,247,0.12)",
          border: "1px solid rgba(168,85,247,0.30)",
          backdropFilter: "blur(10px)",
        }}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-[#a855f7]" style={{ boxShadow: "0 0 8px #a855f7" }} />
        Meta Marketing API · Connected
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Visual #4 — Live Metric Tracking by Editor (custom dynamic leaderboard)
// ────────────────────────────────────────────────────────────────────────────
// ────────────────────────────────────────────────────────────────────────────
// Visual #5 — Live Editor Metrics Graph (multi-line, continuously streaming)
// CTR · Hook Rate · Hold Rate · Thumbstop — all four metrics evolving in real time
// ────────────────────────────────────────────────────────────────────────────
const METRIC_DEFS = [
  { key: "ctr",   label: "CTR",       color: "#e9d5ff", base: 3.2,  amp: 0.4, range: [1.5, 5.5] as [number, number] },
  { key: "hook",  label: "Hook Rate", color: "#c084fc", base: 38,   amp: 4,   range: [25, 55]   as [number, number] },
  { key: "hold",  label: "Hold Rate", color: "#a855f7", base: 26,   amp: 3,   range: [15, 38]   as [number, number] },
  { key: "stop",  label: "Thumbstop", color: "#7c3aed", base: 18,   amp: 2.5, range: [8, 28]    as [number, number] },
];

const POINTS = 36;     // points across the chart
const TICK_MS = 900;   // how often a new sample arrives

function smoothStep(prev: number, target: number, k = 0.35) {
  return prev + (target - prev) * k;
}

function EditorMetricsGraphVisual() {
  // Each metric: an array of normalised values (0–1) sized POINTS
  const [series, setSeries] = useState<Record<string, number[]>>(() => {
    const init: Record<string, number[]> = {};
    METRIC_DEFS.forEach((m) => {
      const arr: number[] = [];
      let v = m.base;
      for (let i = 0; i < POINTS; i++) {
        v += (Math.random() - 0.5) * m.amp;
        v = Math.max(m.range[0], Math.min(m.range[1], v));
        arr.push((v - m.range[0]) / (m.range[1] - m.range[0]));
      }
      init[m.key] = arr;
    });
    return init;
  });

  const [latest, setLatest] = useState<Record<string, number>>(() => {
    const o: Record<string, number> = {};
    METRIC_DEFS.forEach((m) => (o[m.key] = m.base));
    return o;
  });

  useEffect(() => {
    const t = setInterval(() => {
      setSeries((prev) => {
        const next: Record<string, number[]> = {};
        const newLatest: Record<string, number> = {};
        METRIC_DEFS.forEach((m) => {
          const arr = prev[m.key];
          const lastNorm = arr[arr.length - 1];
          // bias slightly toward base to keep things bounded
          const baseNorm = (m.base - m.range[0]) / (m.range[1] - m.range[0]);
          const drift = (baseNorm - lastNorm) * 0.08;
          const target = lastNorm + drift + (Math.random() - 0.5) * 0.18;
          const clamped = Math.max(0.04, Math.min(0.96, target));
          const smoothed = smoothStep(lastNorm, clamped, 0.6);
          const newArr = [...arr.slice(1), smoothed];
          next[m.key] = newArr;
          newLatest[m.key] = m.range[0] + smoothed * (m.range[1] - m.range[0]);
        });
        setLatest(newLatest);
        return next;
      });
    }, TICK_MS);
    return () => clearInterval(t);
  }, []);

  // Build a smooth (catmull-rom-ish) path
  const W = 400;
  const H = 200;
  const PAD_X = 18;
  const PAD_Y = 22;
  const innerW = W - PAD_X * 2;
  const innerH = H - PAD_Y * 2;

  function buildPath(values: number[], close = false): string {
    const pts = values.map((v, i) => {
      const x = PAD_X + (i / (POINTS - 1)) * innerW;
      const y = PAD_Y + (1 - v) * innerH;
      return [x, y] as [number, number];
    });
    let d = `M ${pts[0][0]},${pts[0][1]}`;
    for (let i = 1; i < pts.length; i++) {
      const [x1, y1] = pts[i - 1];
      const [x2, y2] = pts[i];
      const cx = (x1 + x2) / 2;
      d += ` Q ${x1},${y1} ${cx},${(y1 + y2) / 2}`;
    }
    d += ` L ${pts[pts.length - 1][0]},${pts[pts.length - 1][1]}`;
    if (close) {
      d += ` L ${PAD_X + innerW},${PAD_Y + innerH} L ${PAD_X},${PAD_Y + innerH} Z`;
    }
    return d;
  }

  return (
    <div className="absolute inset-0 px-2 pt-1">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-full" preserveAspectRatio="none">
        <defs>
          {METRIC_DEFS.map((m) => (
            <linearGradient key={m.key} id={`grad-${m.key}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={m.color} stopOpacity="0.32" />
              <stop offset="100%" stopColor={m.color} stopOpacity="0" />
            </linearGradient>
          ))}
        </defs>

        {/* horizontal grid lines */}
        {[0.25, 0.5, 0.75].map((p, i) => (
          <line
            key={i}
            x1={PAD_X}
            x2={W - PAD_X}
            y1={PAD_Y + p * innerH}
            y2={PAD_Y + p * innerH}
            stroke="rgba(255,255,255,0.05)"
            strokeWidth="1"
          />
        ))}

        {/* fills (lightest metric only — keeps it readable) */}
        <path
          d={buildPath(series.hook, true)}
          fill={`url(#grad-hook)`}
          style={{ transition: "d 0.9s linear" }}
        />

        {/* lines */}
        {METRIC_DEFS.map((m) => (
          <path
            key={m.key}
            d={buildPath(series[m.key])}
            fill="none"
            stroke={m.color}
            strokeWidth={m.key === "ctr" ? 2.4 : 1.8}
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              filter: `drop-shadow(0 0 6px ${m.color}aa)`,
              transition: "d 0.9s linear",
              opacity: m.key === "stop" ? 0.85 : 1,
            }}
          />
        ))}

        {/* leading dots on rightmost point */}
        {METRIC_DEFS.map((m) => {
          const v = series[m.key][POINTS - 1];
          const x = PAD_X + innerW;
          const y = PAD_Y + (1 - v) * innerH;
          return (
            <g key={m.key} style={{ transition: "transform 0.9s linear" }}>
              <circle cx={x} cy={y} r="4" fill={m.color} opacity="0.25" />
              <circle cx={x} cy={y} r="2.2" fill="#fff"
                style={{ filter: `drop-shadow(0 0 6px ${m.color})` }} />
            </g>
          );
        })}
      </svg>

      {/* Legend with live values */}
      <div className="absolute left-4 right-4 bottom-3 grid grid-cols-4 gap-2">
        {METRIC_DEFS.map((m) => (
          <div key={m.key} className="flex flex-col">
            <div className="flex items-center gap-1.5 text-[9px] uppercase tracking-wider font-semibold text-white/45">
              <span
                className="w-2 h-2 rounded-full"
                style={{ background: m.color, boxShadow: `0 0 6px ${m.color}` }}
              />
              {m.label}
            </div>
            <div className="text-[13px] font-semibold text-white tabular-nums leading-tight mt-0.5">
              {m.key === "ctr" ? latest[m.key].toFixed(2) : latest[m.key].toFixed(1)}
              <span className="text-white/40 text-[10px] ml-0.5">%</span>
            </div>
          </div>
        ))}
      </div>

      {/* Live indicator */}
      <div className="absolute right-3 top-2 inline-flex items-center gap-1.5 text-[9px] font-semibold uppercase tracking-wider text-[#a855f7]">
        <span className="relative flex w-1.5 h-1.5">
          <span className="absolute inset-0 rounded-full animate-ping bg-[#a855f7] opacity-60" />
          <span className="relative w-1.5 h-1.5 rounded-full bg-[#a855f7]"
            style={{ boxShadow: "0 0 8px #a855f7" }} />
        </span>
        Live
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
      {/* Ambient glow + grain */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(124,58,237,0.14) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none mw-grain-bg"
      />

      <div className="relative z-10 max-w-6xl mx-auto px-6">
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
            visual={
              <LottieVisual
                url={LOTTIE.smarterTracking}
                textMap={{
                  "Smarter Tracking": "KPI Dashboard",
                  "Automate expense and income records in real time.":
                    "Spend, ROAS & creative performance — live.",
                }}
              />
            }
          />
          <FeatureCard
            delay={0.1}
            title="Editors trained on your KPIs"
            description="Hook rate. Hold rate. CPA. ROAS. Our team studies what your winners share — then engineers more of them."
            visual={<LottieVisual url={LOTTIE.automate} />}
          />
          <FeatureCard
            delay={0.2}
            title="Built for Meta"
            description="Direct Meta Marketing API integration. Spend, ROAS and creative metrics piped in live — no exports, no lag."
            visual={<MetaIntegrationVisual />}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-16">
          <FeatureCard
            delay={0.3}
            title="Editor Delivery Tracker"
            description="Every video logged, every approval timestamped — full visibility on output across your editor roster."
            visual={<LottieVisual url={LOTTIE.cashflow} />}
          />
          <FeatureCard
            delay={0.4}
            title="Live editor metrics"
            description="CTR, hook rate, hold rate and thumbstop — streaming live across every editor on your account."
            visual={<EditorMetricsGraphVisual />}
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

      <style>{`
        .mw-card {
          opacity: 0;
          transform: translateY(20px);
          animation: mw-card-in 1s cubic-bezier(.2,.7,.2,1) forwards;
          transition: transform .5s cubic-bezier(.2,.7,.2,1), border-color .5s ease, box-shadow .5s ease;
        }
        @keyframes mw-card-in {
          to { opacity: 1; transform: translateY(0); }
        }
        .mw-card:hover {
          transform: translateY(-4px);
          border-color: rgba(168,85,247,0.30) !important;
          box-shadow:
            0 1px 0 rgba(255,255,255,0.10) inset,
            0 0 0 1px rgba(168,85,247,0.20) inset,
            0 30px 80px -20px rgba(168,85,247,0.25),
            0 0 60px -10px rgba(168,85,247,0.18) !important;
        }

        .mw-horizon {
          opacity: 0.55;
          transition: opacity 0.8s ease;
        }
        .mw-card:hover .mw-horizon { opacity: 0.95; }

        .mw-grain-bg {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
          background-size: 220px 220px;
          mix-blend-mode: overlay;
          opacity: 0.05;
        }

        .mw-skeleton {
          background:
            linear-gradient(90deg, transparent, rgba(168,85,247,0.06), transparent);
          background-size: 200% 100%;
          animation: mw-shimmer 1.6s infinite;
        }
        @keyframes mw-shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }

        .mw-orbit-slow { animation: mw-spin 28s linear infinite; }
        .mw-orbit-mid  { animation: mw-spin 18s linear infinite reverse; }
        .mw-orbit-fast { animation: mw-spin 12s linear infinite; }
        @keyframes mw-spin { to { transform: rotate(360deg); } }

        .mw-meta-breath { animation: mw-breath 4.5s ease-in-out infinite; }
        @keyframes mw-breath {
          0%, 100% { transform: translate(160px, 110px) scale(1); }
          50%      { transform: translate(160px, 110px) scale(1.06); }
        }

        @media (prefers-reduced-motion: reduce) {
          .mw-card, .mw-orbit-slow, .mw-orbit-mid, .mw-orbit-fast, .mw-meta-breath, .mw-skeleton {
            animation: none !important;
          }
        }
      `}</style>
    </section>
  );
};

export default EditorEdge;
