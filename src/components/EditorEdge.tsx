import { useEffect, useMemo, useRef, useState } from "react";
import Lottie, { LottieRefCurrentProps } from "lottie-react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, GraduationCap, Repeat2 } from "lucide-react";
import { Link } from "react-router-dom";

const ACCENT = "#a855f7";

// Moneywise's actual Lottie animations (publicly hosted)
const LOTTIE = {
  smarterTracking:
    "https://cdn.prod.website-files.com/6916312c57d61394f5b6212c/692db3dce38346f6ce873258_smarter%20tracking.json",
};

// ────────────────────────────────────────────────────────────────────────────
// Lottie loader — recolors to brand purple AND rewrites text layers
// ────────────────────────────────────────────────────────────────────────────
function transformLottie(data: any, textMap?: Record<string, string>): any {
  const palette: [number, number, number][] = [
    [0.486, 0.227, 0.929],
    [0.659, 0.333, 0.969],
    [0.753, 0.518, 0.988],
    [0.914, 0.835, 1.0],
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
  const mapKey = textMap ? JSON.stringify(textMap) : "";
  return useMemo(() => (raw ? transformLottie(raw, textMap) : null), [raw, mapKey]);
}

// ────────────────────────────────────────────────────────────────────────────
// Card shell
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
      <div
        className="absolute inset-x-8 top-0 h-px pointer-events-none"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(168,85,247,0.55), transparent)",
        }}
      />
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
// Visual: Lottie wrapper
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
// Visual: KPI Dashboard graph (CTR, Hook, Hold, ROAS, CPA)
// ────────────────────────────────────────────────────────────────────────────
const KPI_DEFS = [
  { key: "ctr",  label: "CTR",  unit: "%",  color: "#e9d5ff", base: 3.2,  amp: 0.4, range: [1.5, 5.5] as [number, number] },
  { key: "hook", label: "Hook", unit: "%",  color: "#c084fc", base: 38,   amp: 4,   range: [25, 55]   as [number, number] },
  { key: "hold", label: "Hold", unit: "%",  color: "#a855f7", base: 26,   amp: 3,   range: [15, 38]   as [number, number] },
  { key: "roas", label: "ROAS", unit: "x",  color: "#d8b4fe", base: 3.4,  amp: 0.3, range: [1.8, 5.2] as [number, number] },
  { key: "cpa",  label: "CPA",  unit: "€",  color: "#7c3aed", base: 22,   amp: 2,   range: [12, 38]   as [number, number] },
];

const POINTS = 36;
const TICK_MS = 900;

function smoothStep(prev: number, target: number, k = 0.35) {
  return prev + (target - prev) * k;
}

function KpiDashboardGraphVisual() {
  const [series, setSeries] = useState<Record<string, number[]>>(() => {
    const init: Record<string, number[]> = {};
    KPI_DEFS.forEach((m) => {
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
    KPI_DEFS.forEach((m) => (o[m.key] = m.base));
    return o;
  });

  useEffect(() => {
    const t = setInterval(() => {
      setSeries((prev) => {
        const next: Record<string, number[]> = {};
        const newLatest: Record<string, number> = {};
        KPI_DEFS.forEach((m) => {
          const arr = prev[m.key];
          const lastNorm = arr[arr.length - 1];
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

  const W = 400, H = 200, PAD_X = 18, PAD_Y = 22;
  const innerW = W - PAD_X * 2;
  const innerH = H - PAD_Y * 2;

  function buildPath(values: number[]): string {
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
    return d;
  }

  function fmt(v: number, m: typeof KPI_DEFS[number]) {
    if (m.key === "roas") return v.toFixed(2);
    if (m.key === "cpa") return v.toFixed(0);
    if (m.key === "ctr") return v.toFixed(2);
    return v.toFixed(1);
  }

  return (
    <div className="absolute inset-0 px-2 pt-1">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-full" preserveAspectRatio="none">
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

        {KPI_DEFS.map((m) => (
          <path
            key={m.key}
            d={buildPath(series[m.key])}
            fill="none"
            stroke={m.color}
            strokeWidth={m.key === "roas" ? 2.4 : 1.7}
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              filter: `drop-shadow(0 0 6px ${m.color}aa)`,
              transition: "d 0.9s linear",
              opacity: m.key === "cpa" ? 0.85 : 1,
            }}
          />
        ))}

        {KPI_DEFS.map((m) => {
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

      <div className="absolute left-3 right-3 bottom-3 grid grid-cols-5 gap-1.5">
        {KPI_DEFS.map((m) => (
          <div key={m.key} className="flex flex-col">
            <div className="flex items-center gap-1 text-[8px] uppercase tracking-wider font-semibold text-white/45">
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: m.color, boxShadow: `0 0 6px ${m.color}` }}
              />
              {m.label}
            </div>
            <div className="text-[12px] font-semibold text-white tabular-nums leading-tight mt-0.5">
              {m.unit === "€" && <span className="text-white/40 text-[9px] mr-0.5">€</span>}
              {fmt(latest[m.key], m)}
              {m.unit !== "€" && <span className="text-white/40 text-[9px] ml-0.5">{m.unit}</span>}
            </div>
          </div>
        ))}
      </div>

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
// Visual: Editor Delivery Tracker — delivered vs approved per editor per week
// ────────────────────────────────────────────────────────────────────────────
const DELIVERY_EDITORS = [
  { name: "Liam",  color: "#a855f7" },
  { name: "Sofia", color: "#c084fc" },
  { name: "Noah",  color: "#7c3aed" },
  { name: "Iris",  color: "#e9d5ff" },
];

const DELIVERY_WEEKS = 6;

function EditorDeliveryTrendVisual() {
  const [activeEditor, setActiveEditor] = useState(0);

  // cycle highlighted editor every 2.4s
  useEffect(() => {
    const t = setInterval(() => {
      setActiveEditor((x) => (x + 1) % DELIVERY_EDITORS.length);
    }, 2400);
    return () => clearInterval(t);
  }, []);

  // seeded delivered + approved per editor per week (delivered 6-10, approved <= delivered)
  const data = useMemo(() => {
    const out: Record<string, { delivered: number; approved: number }[]> = {};
    DELIVERY_EDITORS.forEach((e) => {
      let seed = e.name.charCodeAt(0) * 7 + e.name.charCodeAt(1);
      const rand = () => {
        seed = (seed * 9301 + 49297) % 233280;
        return seed / 233280;
      };
      const arr = [];
      for (let i = 0; i < DELIVERY_WEEKS; i++) {
        const delivered = 6 + Math.floor(rand() * 5); // 6-10
        const approved = Math.max(4, delivered - Math.floor(rand() * 3)); // approved within 0-2 less
        arr.push({ delivered, approved: Math.min(approved, delivered) });
      }
      out[e.name] = arr;
    });
    return out;
  }, []);

  const W = 400, H = 200;
  const PAD_X = 24, PAD_TOP = 32, PAD_BOTTOM = 36;
  const innerW = W - PAD_X * 2;
  const innerH = H - PAD_TOP - PAD_BOTTOM;
  const groupW = innerW / DELIVERY_WEEKS;
  const barW = (groupW - 6) / 2;
  const maxVal = 12;

  const activeName = DELIVERY_EDITORS[activeEditor].name;
  const activeColor = DELIVERY_EDITORS[activeEditor].color;
  const activeData = data[activeName];
  const totalDelivered = activeData.reduce((s, d) => s + d.delivered, 0);
  const totalApproved = activeData.reduce((s, d) => s + d.approved, 0);
  const approvalRate = Math.round((totalApproved / totalDelivered) * 100);

  return (
    <div className="absolute inset-0 px-2 pt-1">
      {/* Top: editor pills */}
      <div className="absolute left-4 top-2 right-4 flex items-center justify-between z-10">
        <div className="text-[10px] uppercase tracking-wider font-semibold text-white/55">
          {activeName} · last 6 weeks
        </div>
        <div className="text-[10px] font-semibold text-white tabular-nums">
          <span className="text-white/45 mr-1">Approved</span>
          {totalApproved}/{totalDelivered}
          <span className="ml-1.5 text-[#a855f7]">{approvalRate}%</span>
        </div>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-full" preserveAspectRatio="none">
        <defs>
          <linearGradient id="deliveredGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={activeColor} stopOpacity="0.55" />
            <stop offset="100%" stopColor={activeColor} stopOpacity="0.15" />
          </linearGradient>
          <linearGradient id="approvedGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={activeColor} stopOpacity="1" />
            <stop offset="100%" stopColor={activeColor} stopOpacity="0.6" />
          </linearGradient>
        </defs>

        {[0.25, 0.5, 0.75].map((p, i) => (
          <line
            key={i}
            x1={PAD_X}
            x2={W - PAD_X}
            y1={PAD_TOP + p * innerH}
            y2={PAD_TOP + p * innerH}
            stroke="rgba(255,255,255,0.05)"
            strokeWidth="1"
          />
        ))}

        {activeData.map((d, i) => {
          const gx = PAD_X + i * groupW + 3;
          const dH = (d.delivered / maxVal) * innerH;
          const aH = (d.approved / maxVal) * innerH;
          const dY = PAD_TOP + innerH - dH;
          const aY = PAD_TOP + innerH - aH;
          return (
            <g key={i} style={{ transition: "all 0.6s cubic-bezier(.4,0,.2,1)" }}>
              {/* delivered bar */}
              <rect
                x={gx}
                y={dY}
                width={barW}
                height={dH}
                rx="2"
                fill="url(#deliveredGrad)"
                stroke={activeColor}
                strokeOpacity="0.4"
                strokeWidth="1"
                style={{
                  transition: "all 0.6s cubic-bezier(.4,0,.2,1)",
                  filter: `drop-shadow(0 0 4px ${activeColor}55)`,
                }}
              />
              {/* approved bar */}
              <rect
                x={gx + barW + 4}
                y={aY}
                width={barW}
                height={aH}
                rx="2"
                fill="url(#approvedGrad)"
                style={{
                  transition: "all 0.6s cubic-bezier(.4,0,.2,1)",
                  filter: `drop-shadow(0 0 6px ${activeColor})`,
                }}
              />
              {/* week label */}
              <text
                x={gx + barW + 2}
                y={H - PAD_BOTTOM + 14}
                textAnchor="middle"
                fontSize="8"
                fontFamily="ui-sans-serif, system-ui, sans-serif"
                fontWeight="600"
                fill="rgba(255,255,255,0.45)"
              >
                W{i + 1}
              </text>
              {/* approved value on top */}
              <text
                x={gx + barW + 4 + barW / 2}
                y={aY - 3}
                textAnchor="middle"
                fontSize="8"
                fontFamily="ui-sans-serif, system-ui, sans-serif"
                fontWeight="700"
                fill="#fff"
                style={{ transition: "y 0.6s cubic-bezier(.4,0,.2,1)" }}
              >
                {d.approved}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Editor pill row */}
      <div className="absolute left-3 right-3 bottom-2 flex items-center justify-between gap-1.5">
        <div className="flex gap-1.5">
          {DELIVERY_EDITORS.map((e, i) => (
            <button
              key={e.name}
              onClick={() => setActiveEditor(i)}
              className="flex items-center gap-1 text-[9px] uppercase tracking-wider font-semibold transition-all px-1.5 py-0.5 rounded-full"
              style={{
                color: i === activeEditor ? "#fff" : "rgba(255,255,255,0.45)",
                background: i === activeEditor ? `${e.color}25` : "transparent",
                border: i === activeEditor ? `1px solid ${e.color}55` : "1px solid transparent",
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{
                  background: e.color,
                  boxShadow: i === activeEditor ? `0 0 6px ${e.color}` : "none",
                }}
              />
              {e.name}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 text-[8px] uppercase tracking-wider font-semibold text-white/45">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-sm" style={{ background: `${activeColor}55`, border: `1px solid ${activeColor}55` }} />
            Delivered
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-sm" style={{ background: activeColor }} />
            Approved
          </span>
        </div>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Visual: Trained on your KPIs — animated learning concept
// Floating concept chips (Hook Rate, Hold Curve, CPA, ROAS, Thumbstop, Pattern Interrupt)
// orbiting/rising into a central "Editor brain" node.
// ────────────────────────────────────────────────────────────────────────────
const LEARN_CHIPS = [
  "Hook Rate",
  "Hold Curve",
  "CPA",
  "ROAS",
  "Thumbstop",
  "Pattern Interrupt",
  "CTR",
  "Retention",
];

function LearningVisual() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Rising chips */}
      <div className="absolute inset-0">
        {LEARN_CHIPS.map((c, i) => (
          <div
            key={c}
            className="absolute mw-rise text-[10px] font-medium px-2 py-1 rounded-full text-white/85 whitespace-nowrap"
            style={{
              left: `${8 + (i * 12) % 80}%`,
              bottom: "-30px",
              background: "rgba(168,85,247,0.10)",
              border: "1px solid rgba(168,85,247,0.30)",
              backdropFilter: "blur(6px)",
              animationDelay: `${(i * 0.7) % 5.5}s`,
              animationDuration: `${6 + (i % 3)}s`,
            }}
          >
            {c}
          </div>
        ))}
      </div>

      {/* Central brain / target node */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative">
          <div
            className="absolute inset-0 rounded-full mw-pulse-soft"
            style={{
              width: 110,
              height: 110,
              left: -55,
              top: -55,
              background:
                "radial-gradient(circle, rgba(168,85,247,0.45) 0%, rgba(168,85,247,0.10) 50%, transparent 75%)",
              filter: "blur(8px)",
            }}
          />
          <div
            className="relative flex items-center justify-center rounded-2xl"
            style={{
              width: 76,
              height: 76,
              background:
                "linear-gradient(135deg, rgba(168,85,247,0.25), rgba(124,58,237,0.10))",
              border: "1px solid rgba(168,85,247,0.45)",
              boxShadow:
                "0 0 30px rgba(168,85,247,0.45), inset 0 1px 0 rgba(255,255,255,0.15)",
              backdropFilter: "blur(10px)",
            }}
          >
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
        </div>
      </div>

      {/* Bottom progress bar that fills + resets */}
      <div className="absolute left-6 right-6 bottom-4">
        <div className="flex items-center justify-between text-[9px] uppercase tracking-wider font-semibold text-white/45 mb-1.5">
          <span>Training in progress</span>
          <span className="text-[#a855f7]">Live</span>
        </div>
        <div className="h-1 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
          <div
            className="h-full mw-progress"
            style={{
              background:
                "linear-gradient(90deg, #7c3aed, #a855f7, #c084fc)",
              boxShadow: "0 0 8px #a855f7",
            }}
          />
        </div>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Visual: Iteration Engine — winning ad → variants spawn out
// Replaces "Built for Meta"
// ────────────────────────────────────────────────────────────────────────────
function IterationEngineVisual() {
  return (
    <div className="absolute inset-0">
      <svg viewBox="0 0 400 260" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id="winnerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#c084fc" />
            <stop offset="100%" stopColor="#7c3aed" />
          </linearGradient>
          <radialGradient id="iterGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(168,85,247,0.40)" />
            <stop offset="100%" stopColor="rgba(168,85,247,0)" />
          </radialGradient>
        </defs>

        {/* Glow */}
        <ellipse cx="200" cy="130" rx="160" ry="90" fill="url(#iterGlow)" />

        {/* Connection lines from winner to variants */}
        {[
          { x: 80,  y: 70  },
          { x: 80,  y: 190 },
          { x: 320, y: 70  },
          { x: 320, y: 190 },
        ].map((p, i) => (
          <line
            key={i}
            x1="200" y1="130"
            x2={p.x} y2={p.y}
            stroke="rgba(168,85,247,0.35)"
            strokeWidth="1"
            strokeDasharray="3 4"
          >
            <animate
              attributeName="stroke-dashoffset"
              values="0;-14"
              dur="1.6s"
              repeatCount="indefinite"
            />
          </line>
        ))}

        {/* Variant tiles */}
        {[
          { x: 80,  y: 70,  delay: 0.0 },
          { x: 80,  y: 190, delay: 0.3 },
          { x: 320, y: 70,  delay: 0.6 },
          { x: 320, y: 190, delay: 0.9 },
        ].map((p, i) => (
          <g key={i} className="mw-variant-float" style={{ animationDelay: `${p.delay}s`, transformOrigin: `${p.x}px ${p.y}px` }}>
            <rect
              x={p.x - 28} y={p.y - 18}
              width="56" height="36"
              rx="8"
              fill="rgba(20,16,32,0.85)"
              stroke="rgba(168,85,247,0.45)"
              strokeWidth="1"
            />
            {/* mini bars inside variant */}
            {[0, 1, 2].map((b) => (
              <rect
                key={b}
                x={p.x - 22 + b * 12}
                y={p.y - 10 + (b % 2) * 4}
                width="8"
                height={10 + b * 3}
                rx="1"
                fill="#c084fc"
                opacity={0.5 + b * 0.15}
              />
            ))}
            <text
              x={p.x} y={p.y + 14}
              textAnchor="middle"
              fontSize="7"
              fontFamily="ui-sans-serif, system-ui, sans-serif"
              fontWeight="600"
              fill="rgba(255,255,255,0.55)"
            >
              V{i + 1}
            </text>
          </g>
        ))}

        {/* Center: winning ad */}
        <g className="mw-winner-breath" style={{ transformOrigin: "200px 130px" }}>
          <rect
            x="160" y="100"
            width="80" height="60"
            rx="10"
            fill="url(#winnerGrad)"
            style={{ filter: "drop-shadow(0 0 16px rgba(168,85,247,0.7))" }}
          />
          <text
            x="200" y="125"
            textAnchor="middle"
            fontSize="9"
            fontFamily="ui-sans-serif, system-ui, sans-serif"
            fontWeight="700"
            fill="#fff"
          >
            WINNER
          </text>
          <text
            x="200" y="142"
            textAnchor="middle"
            fontSize="11"
            fontFamily="ui-sans-serif, system-ui, sans-serif"
            fontWeight="800"
            fill="#fff"
          >
            4.2x
          </text>
          <text
            x="200" y="154"
            textAnchor="middle"
            fontSize="6"
            fontFamily="ui-sans-serif, system-ui, sans-serif"
            fill="rgba(255,255,255,0.75)"
          >
            ROAS
          </text>
        </g>

        {/* Pulse ring */}
        <circle cx="200" cy="130" r="0" fill="none" stroke="rgba(168,85,247,0.55)" strokeWidth="1.2">
          <animate attributeName="r" values="40;120" dur="3s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.6;0" dur="3s" repeatCount="indefinite" />
        </circle>
      </svg>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-medium text-white/85"
        style={{
          background: "rgba(168,85,247,0.12)",
          border: "1px solid rgba(168,85,247,0.30)",
          backdropFilter: "blur(10px)",
        }}
      >
        <Repeat2 className="w-3 h-3" style={{ color: ACCENT }} />
        Winners cloned, scaled, iterated
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Section
// ────────────────────────────────────────────────────────────────────────────
const EditorEdge = () => {
  return (
    <section
      className="relative py-28 overflow-hidden"
      style={{ background: "#09090f" }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(124,58,237,0.14) 0%, transparent 70%)",
        }}
      />
      <div className="absolute inset-0 pointer-events-none mw-grain-bg" />

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
            hook rates, hold curves, CPA and ROAS. They know which 3 seconds
            make a winner, and why. That&apos;s how cuts go from nice
            to printing money.
          </p>
        </div>

        {/* 3 + 2 grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
          <FeatureCard
            delay={0}
            title="KPI Dashboard"
            description="CTR, hook rate, hold rate, ROAS and CPA. Streaming live across every editor on your account."
            visual={<KpiDashboardGraphVisual />}
          />
          <FeatureCard
            delay={0.1}
            title="Trained on your KPIs"
            description="Every editor on your account studies your hook rates, hold curves, CPA and ROAS. They learn what your winners share, then engineer more of them."
            visual={<LearningVisual />}
          />
          <FeatureCard
            delay={0.2}
            title="Iteration engine"
            description="Winners get cloned, varied and tested at speed. New angles, new hooks, new patterns. Every week your top ad gets sharper."
            visual={<IterationEngineVisual />}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-16">
          <FeatureCard
            delay={0.3}
            title="Editor delivery tracker"
            description="Trendlines per editor across 12 weeks. Average weekly delivery, CTR, CPA and ROAS, all side by side. See who is actually moving the needle."
            visual={<EditorDeliveryTrendVisual />}
          />
          <FeatureCard
            delay={0.4}
            title="Smarter creative tracking"
            description="Spend, ROAS and creative performance synced live from Meta Ads. Every angle, hook and edit, scored and ranked automatically."
            visual={
              <LottieVisual
                url={LOTTIE.smarterTracking}
                textMap={{
                  "Smarter Tracking": "Smarter Tracking",
                  "Automate expense and income records in real time.":
                    "Spend, ROAS and creative performance, live.",
                }}
              />
            }
          />
        </div>

        <div className="text-center">
          <div className="mb-3 inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider text-white/70"
            style={{
              background: "rgba(168,85,247,0.10)",
              border: "1px solid rgba(168,85,247,0.25)",
            }}
          >
            <span className="relative flex w-1.5 h-1.5">
              <span className="absolute inset-0 rounded-full animate-ping bg-[#a855f7] opacity-60" />
              <span className="relative w-1.5 h-1.5 rounded-full bg-[#a855f7]"
                style={{ boxShadow: "0 0 8px #a855f7" }} />
            </span>
            Interactive demo
          </div>
          <div>
            <Button
              asChild
              variant="cta"
              size="lg"
              className="text-base px-8 py-5 h-auto group relative overflow-hidden shimmer-button rounded-xl"
            >
              <Link to="/mock">
                <span className="relative z-10 flex items-center">
                  Explore the live demo
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </Link>
            </Button>
          </div>
          <p className="mt-3 text-xs text-white/45 max-w-md mx-auto">
            This is a sample dashboard with mock data. The real version is fully tailored to your brand, your editors and your campaigns.
          </p>
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

        @keyframes mw-rise {
          0%   { transform: translateY(0) scale(0.95); opacity: 0; }
          10%  { opacity: 0.9; }
          70%  { opacity: 0.9; }
          100% { transform: translateY(-260px) scale(0.85); opacity: 0; }
        }
        .mw-rise {
          animation-name: mw-rise;
          animation-iteration-count: infinite;
          animation-timing-function: cubic-bezier(.4,0,.2,1);
        }

        @keyframes mw-pulse-soft {
          0%, 100% { transform: scale(1); opacity: 0.85; }
          50%      { transform: scale(1.12); opacity: 1; }
        }
        .mw-pulse-soft { animation: mw-pulse-soft 3.6s ease-in-out infinite; }

        @keyframes mw-progress {
          0%   { width: 0%; }
          90%  { width: 100%; }
          100% { width: 100%; }
        }
        .mw-progress {
          animation: mw-progress 4s cubic-bezier(.4,0,.2,1) infinite;
        }

        @keyframes mw-variant-float {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(-4px); }
        }
        .mw-variant-float { animation: mw-variant-float 3.2s ease-in-out infinite; }

        @keyframes mw-winner-breath {
          0%, 100% { transform: scale(1); }
          50%      { transform: scale(1.04); }
        }
        .mw-winner-breath { animation: mw-winner-breath 3.4s ease-in-out infinite; }

        @media (prefers-reduced-motion: reduce) {
          .mw-card, .mw-skeleton, .mw-rise, .mw-pulse-soft, .mw-progress,
          .mw-variant-float, .mw-winner-breath {
            animation: none !important;
          }
        }
      `}</style>
    </section>
  );
};

export default EditorEdge;
