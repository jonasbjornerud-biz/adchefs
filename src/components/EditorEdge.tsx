import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Brain, Activity } from "lucide-react";
import { Link } from "react-router-dom";

const ACCENT = "#a855f7";

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
      {/* Top edge highlight */}
      <div
        className="absolute inset-x-8 top-0 h-px pointer-events-none"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(168,85,247,0.55), transparent)",
        }}
      />
      {/* Horizon glow */}
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

      <div className="relative h-[280px] overflow-hidden">
        {visual}
        {/* Purple-tinted grain overlay (per visual) */}
        <div className="absolute inset-0 pointer-events-none mw-grain-purple" />
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// VISUAL 1: Trained on your KPIs — Neural network "Editor Brain"
// ════════════════════════════════════════════════════════════════════════════
const BRAIN_NODES = [
  { id: "roas", label: "ROAS", x: 12, y: 24, value: "4.2x" },
  { id: "cpa",  label: "CPA",  x: 12, y: 76, value: "€19"  },
  { id: "hook", label: "Hook", x: 88, y: 18, value: "42%"  },
  { id: "hold", label: "Hold", x: 88, y: 50, value: "31%"  },
  { id: "ctr",  label: "CTR",  x: 88, y: 82, value: "3.4%" },
];

function EditorBrainVisual() {
  const W = 400, H = 280;
  const center = { x: W / 2, y: H / 2 - 6 };

  return (
    <div className="absolute inset-0">
      <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid slice">
        <defs>
          <radialGradient id="brainGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(168,85,247,0.55)" />
            <stop offset="100%" stopColor="rgba(168,85,247,0)" />
          </radialGradient>
          <linearGradient id="brainCore" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#c084fc" />
            <stop offset="100%" stopColor="#7c3aed" />
          </linearGradient>
          <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" />
          </filter>
        </defs>

        {/* Ambient glow */}
        <ellipse cx={center.x} cy={center.y} rx="160" ry="100" fill="url(#brainGlow)" />

        {/* Connection lines from each node to brain */}
        {BRAIN_NODES.map((n, i) => {
          const x = (n.x / 100) * W;
          const y = (n.y / 100) * H;
          // curved path via control point
          const cx = (x + center.x) / 2;
          const cy = (y + center.y) / 2 + (i % 2 ? 18 : -18);
          const d = `M ${x},${y} Q ${cx},${cy} ${center.x},${center.y}`;
          return (
            <g key={n.id}>
              <path d={d} fill="none" stroke="rgba(168,85,247,0.18)" strokeWidth="1" />
              {/* Pulse traveling along path */}
              <circle r="2.4" fill="#e9d5ff" style={{ filter: "drop-shadow(0 0 6px #a855f7)" }}>
                <animateMotion dur={`${2.6 + i * 0.18}s`} repeatCount="indefinite" path={d} />
                <animate attributeName="opacity" values="0;1;1;0" dur={`${2.6 + i * 0.18}s`} repeatCount="indefinite" />
              </circle>
              {/* Secondary slower pulse for depth */}
              <circle r="1.4" fill="#fff" opacity="0.7">
                <animateMotion dur={`${3.4 + i * 0.22}s`} begin={`${i * 0.4}s`} repeatCount="indefinite" path={d} />
              </circle>
            </g>
          );
        })}

        {/* Center hexagonal brain */}
        <g style={{ transformOrigin: `${center.x}px ${center.y}px` }} className="mw-breath">
          {/* Outer hex */}
          <polygon
            points={hexPoints(center.x, center.y, 44)}
            fill="none"
            stroke="rgba(168,85,247,0.45)"
            strokeWidth="1"
            style={{ filter: "drop-shadow(0 0 12px rgba(168,85,247,0.6))" }}
          />
          {/* Inner filled hex */}
          <polygon
            points={hexPoints(center.x, center.y, 32)}
            fill="url(#brainCore)"
            opacity="0.95"
            style={{ filter: "drop-shadow(0 0 18px rgba(168,85,247,0.8))" }}
          />
          {/* Inner accents */}
          <polygon
            points={hexPoints(center.x, center.y, 18)}
            fill="none"
            stroke="rgba(255,255,255,0.5)"
            strokeWidth="1"
          />
        </g>

        {/* Pulse ring */}
        <polygon
          points={hexPoints(center.x, center.y, 32)}
          fill="none"
          stroke="rgba(168,85,247,0.6)"
          strokeWidth="1.5"
        >
          <animateTransform
            attributeName="transform"
            type="scale"
            additive="sum"
            values="1;1.8"
            dur="2.6s"
            repeatCount="indefinite"
          />
          <animate attributeName="opacity" values="0.7;0" dur="2.6s" repeatCount="indefinite" />
        </polygon>
      </svg>

      {/* Center brain icon overlay */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ marginTop: -6 }}>
        <Brain className="w-7 h-7 text-white" style={{ filter: "drop-shadow(0 0 6px rgba(255,255,255,0.5))" }} />
      </div>

      {/* KPI nodes */}
      {BRAIN_NODES.map((n, i) => (
        <div
          key={n.id}
          className="absolute"
          style={{
            left: `${n.x}%`,
            top: `${n.y}%`,
            transform: "translate(-50%, -50%)",
          }}
        >
          <div
            className="mw-node-pulse flex flex-col items-center gap-0.5 px-2.5 py-1.5 rounded-lg backdrop-blur-md"
            style={{
              background: "rgba(20,16,32,0.85)",
              border: "1px solid rgba(168,85,247,0.45)",
              boxShadow: "0 0 14px rgba(168,85,247,0.35)",
              animationDelay: `${i * 0.25}s`,
            }}
          >
            <span className="text-[8px] uppercase tracking-wider font-semibold text-white/55 leading-none">{n.label}</span>
            <span className="text-[12px] font-bold text-white tabular-nums leading-none">{n.value}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function hexPoints(cx: number, cy: number, r: number): string {
  const pts: string[] = [];
  for (let i = 0; i < 6; i++) {
    const a = (Math.PI / 3) * i - Math.PI / 2;
    pts.push(`${(cx + r * Math.cos(a)).toFixed(2)},${(cy + r * Math.sin(a)).toFixed(2)}`);
  }
  return pts.join(" ");
}

// ════════════════════════════════════════════════════════════════════════════
// VISUAL 2: Editor Delivery Tracker — animated stacked bars
// Delivered vs approved videos per editor per week (6-10/week)
// ════════════════════════════════════════════════════════════════════════════
const DELIVERY_EDITORS = [
  { name: "Liam",  color: "#a855f7" },
  { name: "Sofia", color: "#c084fc" },
  { name: "Noah",  color: "#7c3aed" },
  { name: "Iris",  color: "#d8b4fe" },
];

const DELIVERY_WEEKS = 6;

function EditorDeliveryTrackerVisual() {
  const [activeEditor, setActiveEditor] = useState(0);
  const [animKey, setAnimKey] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setActiveEditor((x) => (x + 1) % DELIVERY_EDITORS.length);
      setAnimKey((k) => k + 1);
    }, 2800);
    return () => clearInterval(t);
  }, []);

  const data = useMemo(() => {
    const out: Record<string, { delivered: number; approved: number }[]> = {};
    DELIVERY_EDITORS.forEach((e) => {
      let seed = e.name.charCodeAt(0) * 11 + e.name.charCodeAt(1) * 3;
      const rand = () => {
        seed = (seed * 9301 + 49297) % 233280;
        return seed / 233280;
      };
      const arr = [];
      for (let i = 0; i < DELIVERY_WEEKS; i++) {
        const delivered = 6 + Math.floor(rand() * 5);
        const approved = Math.max(4, delivered - Math.floor(rand() * 3));
        arr.push({ delivered, approved: Math.min(approved, delivered) });
      }
      out[e.name] = arr;
    });
    return out;
  }, []);

  const W = 400, H = 280;
  const PAD_X = 28, PAD_TOP = 44, PAD_BOTTOM = 56;
  const innerW = W - PAD_X * 2;
  const innerH = H - PAD_TOP - PAD_BOTTOM;
  const groupW = innerW / DELIVERY_WEEKS;
  const barW = (groupW - 8) / 2;
  const maxVal = 12;

  const activeName = DELIVERY_EDITORS[activeEditor].name;
  const activeColor = DELIVERY_EDITORS[activeEditor].color;
  const activeData = data[activeName];
  const totalDelivered = activeData.reduce((s, d) => s + d.delivered, 0);
  const totalApproved = activeData.reduce((s, d) => s + d.approved, 0);
  const approvalRate = Math.round((totalApproved / totalDelivered) * 100);

  return (
    <div className="absolute inset-0 px-3 pt-2">
      {/* Top header */}
      <div className="absolute left-5 top-3 right-5 flex items-center justify-between z-10">
        <div className="flex items-center gap-2">
          <div
            className="w-2 h-2 rounded-full mw-blink"
            style={{ background: activeColor, boxShadow: `0 0 8px ${activeColor}` }}
          />
          <div className="text-[11px] uppercase tracking-wider font-semibold text-white">
            {activeName}
          </div>
          <div className="text-[10px] font-medium text-white/40">· last 6 weeks</div>
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-[10px] uppercase tracking-wider font-semibold text-white/40">Approval</span>
          <span
            key={`rate-${animKey}`}
            className="text-[14px] font-bold tabular-nums mw-fade-in"
            style={{ color: activeColor, textShadow: `0 0 12px ${activeColor}99` }}
          >
            {approvalRate}%
          </span>
        </div>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-full" preserveAspectRatio="none">
        <defs>
          <linearGradient id={`delGrad-${activeEditor}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={activeColor} stopOpacity="0.45" />
            <stop offset="100%" stopColor={activeColor} stopOpacity="0.08" />
          </linearGradient>
          <linearGradient id={`appGrad-${activeEditor}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={activeColor} stopOpacity="1" />
            <stop offset="100%" stopColor={activeColor} stopOpacity="0.55" />
          </linearGradient>
        </defs>

        {/* Y-axis gridlines with labels */}
        {[0, 4, 8, 12].map((v) => {
          const y = PAD_TOP + innerH - (v / maxVal) * innerH;
          return (
            <g key={v}>
              <line
                x1={PAD_X}
                x2={W - PAD_X}
                y1={y}
                y2={y}
                stroke="rgba(255,255,255,0.06)"
                strokeWidth="1"
                strokeDasharray={v === 0 ? "0" : "2 4"}
              />
              <text
                x={PAD_X - 6}
                y={y + 3}
                textAnchor="end"
                fontSize="8"
                fontFamily="ui-sans-serif, system-ui, sans-serif"
                fontWeight="600"
                fill="rgba(255,255,255,0.30)"
              >
                {v}
              </text>
            </g>
          );
        })}

        {/* Bars per week */}
        {activeData.map((d, i) => {
          const gx = PAD_X + i * groupW + 4;
          const dH = (d.delivered / maxVal) * innerH;
          const aH = (d.approved / maxVal) * innerH;
          const dY = PAD_TOP + innerH - dH;
          const aY = PAD_TOP + innerH - aH;
          return (
            <g key={`${animKey}-${i}`}>
              {/* Delivered bar (back) */}
              <rect
                x={gx}
                y={dY}
                width={barW}
                height={dH}
                rx="3"
                fill={`url(#delGrad-${activeEditor})`}
                stroke={activeColor}
                strokeOpacity="0.35"
                strokeWidth="1"
                style={{
                  transformOrigin: `${gx + barW / 2}px ${PAD_TOP + innerH}px`,
                  animation: `mw-bar-grow 0.9s cubic-bezier(.22,.9,.3,1) ${i * 0.06}s both`,
                  filter: `drop-shadow(0 0 6px ${activeColor}55)`,
                }}
              />
              {/* Approved bar (front) */}
              <rect
                x={gx + barW + 4}
                y={aY}
                width={barW}
                height={aH}
                rx="3"
                fill={`url(#appGrad-${activeEditor})`}
                style={{
                  transformOrigin: `${gx + barW + 4 + barW / 2}px ${PAD_TOP + innerH}px`,
                  animation: `mw-bar-grow 0.9s cubic-bezier(.22,.9,.3,1) ${i * 0.06 + 0.12}s both`,
                  filter: `drop-shadow(0 0 8px ${activeColor})`,
                }}
              />
              {/* Approved value label */}
              <text
                x={gx + barW + 4 + barW / 2}
                y={aY - 4}
                textAnchor="middle"
                fontSize="9"
                fontFamily="ui-sans-serif, system-ui, sans-serif"
                fontWeight="700"
                fill="#fff"
                style={{
                  opacity: 0,
                  animation: `mw-fade-in 0.6s ease ${i * 0.06 + 0.4}s forwards`,
                }}
              >
                {d.approved}
              </text>
              {/* Week label */}
              <text
                x={gx + barW + 2}
                y={H - PAD_BOTTOM + 14}
                textAnchor="middle"
                fontSize="9"
                fontFamily="ui-sans-serif, system-ui, sans-serif"
                fontWeight="600"
                fill="rgba(255,255,255,0.40)"
              >
                W{i + 1}
              </text>
            </g>
          );
        })}

        {/* Scanning beam */}
        <rect
          x={PAD_X}
          y={PAD_TOP}
          width="3"
          height={innerH}
          fill={activeColor}
          opacity="0.18"
          style={{
            filter: `blur(4px)`,
            animation: `mw-scan ${DELIVERY_WEEKS * 0.45}s linear infinite`,
          }}
        />
      </svg>

      {/* Editor pills + legend */}
      <div className="absolute left-4 right-4 bottom-3 flex items-center justify-between gap-2">
        <div className="flex gap-1.5">
          {DELIVERY_EDITORS.map((e, i) => (
            <button
              key={e.name}
              onClick={() => { setActiveEditor(i); setAnimKey((k) => k + 1); }}
              className="flex items-center gap-1 text-[9px] uppercase tracking-wider font-semibold transition-all px-2 py-1 rounded-full"
              style={{
                color: i === activeEditor ? "#fff" : "rgba(255,255,255,0.45)",
                background: i === activeEditor ? `${e.color}25` : "rgba(255,255,255,0.03)",
                border: i === activeEditor ? `1px solid ${e.color}66` : "1px solid rgba(255,255,255,0.06)",
                boxShadow: i === activeEditor ? `0 0 12px -2px ${e.color}` : "none",
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: e.color, boxShadow: i === activeEditor ? `0 0 6px ${e.color}` : "none" }}
              />
              {e.name}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 text-[8px] uppercase tracking-wider font-semibold text-white/45">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-sm" style={{ background: `${activeColor}40`, border: `1px solid ${activeColor}55` }} />
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

// ════════════════════════════════════════════════════════════════════════════
// VISUAL 3: KPI Dashboard — command center (featured ROAS + mini KPI grid)
// ════════════════════════════════════════════════════════════════════════════
const KPI_DEFS = [
  { key: "roas", label: "ROAS", unit: "x", color: "#c084fc", base: 3.4, amp: 0.28, range: [1.8, 5.2] as [number, number] },
  { key: "cpa",  label: "CPA",  unit: "€", color: "#a855f7", base: 22,  amp: 1.6,  range: [12, 38]   as [number, number] },
  { key: "ctr",  label: "CTR",  unit: "%", color: "#d8b4fe", base: 3.2, amp: 0.32, range: [1.5, 5.5] as [number, number] },
  { key: "hook", label: "Hook", unit: "%", color: "#e9d5ff", base: 38,  amp: 3.5,  range: [25, 55]   as [number, number] },
  { key: "hold", label: "Hold", unit: "%", color: "#7c3aed", base: 26,  amp: 2.6,  range: [15, 38]   as [number, number] },
];

const POINTS = 56;
const TICK_MS = 850;

function smoothStep(prev: number, target: number, k = 0.4) {
  return prev + (target - prev) * k;
}

function fmtKpi(v: number, key: string) {
  if (key === "roas") return v.toFixed(2);
  if (key === "cpa") return v.toFixed(0);
  if (key === "ctr") return v.toFixed(2);
  return v.toFixed(1);
}

// Build a smooth quadratic path from normalized values (0..1) inside a box
function buildSparkPath(values: number[], w: number, h: number, padX = 2, padY = 4): string {
  const innerW = w - padX * 2;
  const innerH = h - padY * 2;
  const pts = values.map((v, i) => {
    const x = padX + (i / (values.length - 1)) * innerW;
    const y = padY + (1 - v) * innerH;
    return [x, y] as [number, number];
  });
  let d = `M ${pts[0][0].toFixed(2)},${pts[0][1].toFixed(2)}`;
  for (let i = 1; i < pts.length; i++) {
    const [x1, y1] = pts[i - 1];
    const [x2, y2] = pts[i];
    const cx = (x1 + x2) / 2;
    const cy = (y1 + y2) / 2;
    d += ` Q ${x1.toFixed(2)},${y1.toFixed(2)} ${cx.toFixed(2)},${cy.toFixed(2)}`;
  }
  d += ` L ${pts[pts.length - 1][0].toFixed(2)},${pts[pts.length - 1][1].toFixed(2)}`;
  return d;
}

function buildSparkArea(values: number[], w: number, h: number, padX = 2, padY = 4): string {
  const line = buildSparkPath(values, w, h, padX, padY);
  return `${line} L ${(w - padX).toFixed(2)},${(h - padY).toFixed(2)} L ${padX.toFixed(2)},${(h - padY).toFixed(2)} Z`;
}

// ── Sub-component: a single mini KPI tile with sparkline + value + delta
function MiniKpiTile({
  def,
  values,
  latest,
  prev,
}: {
  def: typeof KPI_DEFS[number];
  values: number[];
  latest: number;
  prev: number;
}) {
  const w = 220, h = 64;
  // For CPA, "down is good" (green); for everything else, "up is good"
  const delta = latest - prev;
  const goodDirection = def.key === "cpa" ? delta < 0 : delta > 0;
  const deltaPct = prev !== 0 ? (delta / prev) * 100 : 0;
  const arrow = delta > 0 ? "▲" : delta < 0 ? "▼" : "·";
  const deltaColor = goodDirection ? "#a3e635" : "rgba(255,255,255,0.45)";

  return (
    <div
      className="relative rounded-xl overflow-hidden"
      style={{
        background: "rgba(20,16,32,0.6)",
        border: `1px solid ${def.color}22`,
        backdropFilter: "blur(8px)",
        boxShadow: `inset 0 0 24px ${def.color}10`,
      }}
    >
      {/* Background sparkline */}
      <svg viewBox={`0 0 ${w} ${h}`} className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
        <defs>
          <linearGradient id={`mini-${def.key}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={def.color} stopOpacity="0.45" />
            <stop offset="100%" stopColor={def.color} stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          d={buildSparkArea(values, w, h, 2, 6)}
          fill={`url(#mini-${def.key})`}
          style={{ transition: "d 0.85s linear" }}
        />
        <path
          d={buildSparkPath(values, w, h, 2, 6)}
          fill="none"
          stroke={def.color}
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            filter: `drop-shadow(0 0 4px ${def.color}cc)`,
            transition: "d 0.85s linear",
          }}
        />
      </svg>

      <div className="relative p-2.5 flex items-start justify-between h-full">
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-1 text-[9px] uppercase tracking-wider font-semibold text-white/55">
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: def.color, boxShadow: `0 0 6px ${def.color}` }}
            />
            {def.label}
          </div>
          <div className="text-[16px] font-bold text-white tabular-nums leading-none mt-0.5">
            {def.unit === "€" && <span className="text-white/45 text-[10px] mr-0.5">€</span>}
            {fmtKpi(latest, def.key)}
            {def.unit !== "€" && <span className="text-white/45 text-[10px] ml-0.5">{def.unit}</span>}
          </div>
        </div>
        <div
          className="text-[9px] font-semibold tabular-nums px-1.5 py-0.5 rounded-md"
          style={{
            color: deltaColor,
            background: goodDirection ? "rgba(163,230,53,0.10)" : "rgba(255,255,255,0.04)",
            border: `1px solid ${goodDirection ? "rgba(163,230,53,0.25)" : "rgba(255,255,255,0.06)"}`,
          }}
        >
          {arrow} {Math.abs(deltaPct).toFixed(1)}%
        </div>
      </div>
    </div>
  );
}

function KpiDashboardVisual() {
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
  const [prev, setPrev] = useState<Record<string, number>>(() => {
    const o: Record<string, number> = {};
    KPI_DEFS.forEach((m) => (o[m.key] = m.base));
    return o;
  });

  useEffect(() => {
    const t = setInterval(() => {
      setSeries((curr) => {
        const next: Record<string, number[]> = {};
        const newLatest: Record<string, number> = {};
        const newPrev: Record<string, number> = {};
        KPI_DEFS.forEach((m) => {
          const arr = curr[m.key];
          const last = arr[arr.length - 1];
          const before = arr[arr.length - 2] ?? last;
          const baseNorm = (m.base - m.range[0]) / (m.range[1] - m.range[0]);
          const drift = (baseNorm - last) * 0.08;
          const target = last + drift + (Math.random() - 0.5) * 0.18;
          const clamped = Math.max(0.04, Math.min(0.96, target));
          const smoothed = smoothStep(last, clamped, 0.6);
          next[m.key] = [...arr.slice(1), smoothed];
          newLatest[m.key] = m.range[0] + smoothed * (m.range[1] - m.range[0]);
          newPrev[m.key] = m.range[0] + before * (m.range[1] - m.range[0]);
        });
        setLatest(newLatest);
        setPrev(newPrev);
        return next;
      });
    }, TICK_MS);
    return () => clearInterval(t);
  }, []);

  const roas = KPI_DEFS[0];
  const others = KPI_DEFS.slice(1);

  // Featured ROAS chart geometry
  const FW = 460, FH = 200;
  const PAD_L = 36, PAD_R = 18, PAD_T = 14, PAD_B = 22;
  const innerW = FW - PAD_L - PAD_R;
  const innerH = FH - PAD_T - PAD_B;

  const roasValues = series[roas.key];
  const roasLatest = latest[roas.key];
  const roasMin = roas.range[0], roasMax = roas.range[1];

  function buildFeaturedLine(values: number[]): string {
    const pts = values.map((v, i) => {
      const x = PAD_L + (i / (values.length - 1)) * innerW;
      const y = PAD_T + (1 - v) * innerH;
      return [x, y] as [number, number];
    });
    let d = `M ${pts[0][0].toFixed(2)},${pts[0][1].toFixed(2)}`;
    for (let i = 1; i < pts.length; i++) {
      const [x1, y1] = pts[i - 1];
      const [x2, y2] = pts[i];
      const cx = (x1 + x2) / 2;
      const cy = (y1 + y2) / 2;
      d += ` Q ${x1.toFixed(2)},${y1.toFixed(2)} ${cx.toFixed(2)},${cy.toFixed(2)}`;
    }
    d += ` L ${pts[pts.length - 1][0].toFixed(2)},${pts[pts.length - 1][1].toFixed(2)}`;
    return d;
  }
  function buildFeaturedArea(values: number[]): string {
    return `${buildFeaturedLine(values)} L ${PAD_L + innerW},${PAD_T + innerH} L ${PAD_L},${PAD_T + innerH} Z`;
  }

  // Latest dot position
  const lastNorm = roasValues[roasValues.length - 1];
  const dotX = PAD_L + innerW;
  const dotY = PAD_T + (1 - lastNorm) * innerH;

  return (
    <div className="absolute inset-0 px-5 pt-2 pb-3 flex flex-col">
      {/* Top header */}
      <div className="flex items-center justify-between mb-2 z-10">
        <div className="flex items-center gap-2">
          <Activity className="w-3.5 h-3.5 text-white/70" />
          <span className="text-[11px] uppercase tracking-wider font-semibold text-white/85">
            Live performance feed
          </span>
          <span className="text-[10px] text-white/35">· last 24h</span>
        </div>
        <div className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider"
          style={{ color: ACCENT }}>
          <span className="relative flex w-1.5 h-1.5">
            <span className="absolute inset-0 rounded-full animate-ping bg-[#a855f7] opacity-60" />
            <span className="relative w-1.5 h-1.5 rounded-full bg-[#a855f7]"
              style={{ boxShadow: "0 0 8px #a855f7" }} />
          </span>
          Streaming
        </div>
      </div>

      {/* Main grid: featured (left) + 2x2 mini tiles (right) */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-[1.2fr_1fr] gap-3 min-h-0">
        {/* Featured ROAS panel */}
        <div
          className="relative rounded-2xl overflow-hidden"
          style={{
            background: "linear-gradient(180deg, rgba(28,20,46,0.7) 0%, rgba(14,10,26,0.7) 100%)",
            border: "1px solid rgba(168,85,247,0.22)",
            boxShadow: "inset 0 0 40px rgba(168,85,247,0.08)",
          }}
        >
          {/* Header inside featured */}
          <div className="absolute left-3 top-2.5 right-3 flex items-end justify-between z-10">
            <div className="flex flex-col gap-0.5">
              <div className="flex items-center gap-1 text-[9px] uppercase tracking-wider font-semibold text-white/55">
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: roas.color, boxShadow: `0 0 6px ${roas.color}` }} />
                {roas.label} · account avg
              </div>
              <div className="text-[26px] font-extrabold text-white tabular-nums leading-none">
                {fmtKpi(roasLatest, roas.key)}<span className="text-white/45 text-[14px] ml-0.5">x</span>
              </div>
            </div>
            <div className="flex flex-col items-end gap-0.5">
              <span className="text-[9px] uppercase tracking-wider font-semibold text-white/40">7d range</span>
              <span className="text-[10px] font-semibold text-white/70 tabular-nums">
                {roasMin.toFixed(1)}x – {roasMax.toFixed(1)}x
              </span>
            </div>
          </div>

          <svg viewBox={`0 0 ${FW} ${FH}`} className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
            <defs>
              <linearGradient id="featRoasArea" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor={roas.color} stopOpacity="0.45" />
                <stop offset="100%" stopColor={roas.color} stopOpacity="0" />
              </linearGradient>
              <linearGradient id="featRoasLine" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#a855f7" />
                <stop offset="100%" stopColor="#e9d5ff" />
              </linearGradient>
            </defs>

            {/* Y grid */}
            {[0, 0.25, 0.5, 0.75, 1].map((p, i) => {
              const y = PAD_T + p * innerH;
              const v = roasMin + (1 - p) * (roasMax - roasMin);
              return (
                <g key={i}>
                  <line
                    x1={PAD_L}
                    x2={FW - PAD_R}
                    y1={y}
                    y2={y}
                    stroke="rgba(255,255,255,0.05)"
                    strokeWidth="1"
                    strokeDasharray={p === 1 ? "0" : "2 5"}
                  />
                  <text
                    x={PAD_L - 6}
                    y={y + 3}
                    textAnchor="end"
                    fontSize="8"
                    fontFamily="ui-sans-serif, system-ui, sans-serif"
                    fontWeight="600"
                    fill="rgba(255,255,255,0.30)"
                  >
                    {v.toFixed(1)}x
                  </text>
                </g>
              );
            })}

            {/* Vertical micro grid */}
            {[0.2, 0.4, 0.6, 0.8].map((p, i) => {
              const x = PAD_L + p * innerW;
              return (
                <line
                  key={i}
                  x1={x}
                  x2={x}
                  y1={PAD_T}
                  y2={PAD_T + innerH}
                  stroke="rgba(255,255,255,0.03)"
                  strokeWidth="1"
                />
              );
            })}

            {/* Area */}
            <path
              d={buildFeaturedArea(roasValues)}
              fill="url(#featRoasArea)"
              style={{ transition: "d 0.85s linear" }}
            />
            {/* Line */}
            <path
              d={buildFeaturedLine(roasValues)}
              fill="none"
              stroke="url(#featRoasLine)"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                filter: `drop-shadow(0 0 8px ${roas.color}cc)`,
                transition: "d 0.85s linear",
              }}
            />

            {/* Leading dot with pulse */}
            <g style={{ transition: "transform 0.85s linear" }}>
              <circle cx={dotX} cy={dotY} r="10" fill={roas.color} opacity="0.18">
                <animate attributeName="r" values="6;14;6" dur="2.4s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.25;0;0.25" dur="2.4s" repeatCount="indefinite" />
              </circle>
              <circle cx={dotX} cy={dotY} r="4" fill={roas.color} opacity="0.5" />
              <circle cx={dotX} cy={dotY} r="2.4" fill="#fff"
                style={{ filter: `drop-shadow(0 0 6px ${roas.color})` }} />
            </g>

            {/* Scanning beam */}
            <rect
              x={PAD_L}
              y={PAD_T}
              width="2"
              height={innerH}
              fill="#a855f7"
              opacity="0.35"
              style={{
                filter: "blur(3px)",
                animation: "mw-scan-feat 6s linear infinite",
              }}
            />

            {/* Time labels */}
            {["−24h", "−18h", "−12h", "−6h", "now"].map((label, i) => {
              const x = PAD_L + (i / 4) * innerW;
              return (
                <text
                  key={label}
                  x={x}
                  y={FH - 6}
                  textAnchor="middle"
                  fontSize="8"
                  fontFamily="ui-sans-serif, system-ui, sans-serif"
                  fontWeight="600"
                  fill="rgba(255,255,255,0.30)"
                >
                  {label}
                </text>
              );
            })}
          </svg>
        </div>

        {/* Mini tile grid */}
        <div className="grid grid-cols-2 gap-2.5">
          {others.map((m) => (
            <MiniKpiTile
              key={m.key}
              def={m}
              values={series[m.key]}
              latest={latest[m.key]}
              prev={prev[m.key]}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

        {/* Top row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
          <FeatureCard
            delay={0}
            title="Trained on your KPIs"
            description="Every editor on your account studies your hook rates, hold curves, CPA and ROAS. They learn what your winners share, then engineer more of them."
            visual={<EditorBrainVisual />}
          />
          <FeatureCard
            delay={0.1}
            title="Editor delivery tracker"
            description="Delivered vs approved videos per editor, week by week. See exactly who is shipping and who is shipping work that lands."
            visual={<EditorDeliveryTrackerVisual />}
          />
        </div>

        {/* Bottom row: KPI Dashboard full width */}
        <div className="grid grid-cols-1 gap-5 mb-16">
          <FeatureCard
            delay={0.2}
            title="KPI Dashboard"
            description="CTR, hook rate, hold rate, ROAS and CPA. Streaming live across every editor on your account, in one shared view."
            visual={<KpiDashboardVisual />}
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
        @keyframes mw-card-in { to { opacity: 1; transform: translateY(0); } }
        .mw-card:hover {
          transform: translateY(-4px);
          border-color: rgba(168,85,247,0.30) !important;
          box-shadow:
            0 1px 0 rgba(255,255,255,0.10) inset,
            0 0 0 1px rgba(168,85,247,0.20) inset,
            0 30px 80px -20px rgba(168,85,247,0.25),
            0 0 60px -10px rgba(168,85,247,0.18) !important;
        }
        .mw-horizon { opacity: 0.55; transition: opacity 0.8s ease; }
        .mw-card:hover .mw-horizon { opacity: 0.95; }

        /* Section grain */
        .mw-grain-bg {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
          background-size: 220px 220px;
          mix-blend-mode: overlay;
          opacity: 0.05;
        }

        /* Per-visual purple-tinted grain */
        .mw-grain-purple {
          background-image:
            url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='pn'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0.66  0 0 0 0 0.33  0 0 0 0 0.97  0 0 0 0.55 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23pn)'/%3E%3C/svg%3E");
          background-size: 180px 180px;
          mix-blend-mode: soft-light;
          opacity: 0.35;
        }

        /* Animations */
        @keyframes mw-breath {
          0%, 100% { transform: scale(1); }
          50%      { transform: scale(1.06); }
        }
        .mw-breath { animation: mw-breath 3.4s ease-in-out infinite; }

        @keyframes mw-node-pulse {
          0%, 100% { box-shadow: 0 0 14px rgba(168,85,247,0.35); }
          50%      { box-shadow: 0 0 22px rgba(168,85,247,0.7); }
        }
        .mw-node-pulse { animation: mw-node-pulse 2.4s ease-in-out infinite; }

        @keyframes mw-blink {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%      { opacity: 0.5; transform: scale(0.85); }
        }
        .mw-blink { animation: mw-blink 1.4s ease-in-out infinite; }

        @keyframes mw-bar-grow {
          from { transform: scaleY(0); }
          to   { transform: scaleY(1); }
        }

        @keyframes mw-fade-in {
          from { opacity: 0; transform: translateY(4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .mw-fade-in { animation: mw-fade-in 0.5s ease forwards; }

        @keyframes mw-scan {
          0%   { transform: translateX(0); opacity: 0; }
          10%  { opacity: 0.7; }
          90%  { opacity: 0.7; }
          100% { transform: translateX(340px); opacity: 0; }
        }

        @keyframes mw-scan-kpi {
          0%   { transform: translateX(0); opacity: 0; }
          10%  { opacity: 0.5; }
          90%  { opacity: 0.5; }
          100% { transform: translateX(740px); opacity: 0; }
        }

        @media (prefers-reduced-motion: reduce) {
          .mw-card, .mw-breath, .mw-node-pulse, .mw-blink, .mw-fade-in {
            animation: none !important;
          }
        }
      `}</style>
    </section>
  );
};

export default EditorEdge;
