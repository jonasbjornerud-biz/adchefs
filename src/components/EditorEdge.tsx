import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Link } from "react-router-dom";

// ─────────────────────────────────────────────────────────────────────────────
// Design tokens (restrained palette)
// ─────────────────────────────────────────────────────────────────────────────
const BG = "#0D0B1A";
const CARD_BG = "#13111F";
const BORDER = "#2A2740";
const ACCENT = "#7C3AED";
const TEXT_MUTED = "#A0A0B0";

// ─────────────────────────────────────────────────────────────────────────────
// Card shell — flat panels, thin border, subtle shadow, no purple bg/glow
// ─────────────────────────────────────────────────────────────────────────────
function Panel({
  children,
  className = "",
  padded = true,
}: {
  children: React.ReactNode;
  className?: string;
  padded?: boolean;
}) {
  return (
    <div
      className={`relative rounded-2xl ${padded ? "p-7 md:p-8" : ""} ${className}`}
      style={{
        background: CARD_BG,
        border: `1px solid ${BORDER}`,
        boxShadow:
          "0 1px 0 rgba(255,255,255,0.03) inset, 0 24px 60px -32px rgba(0,0,0,0.6)",
      }}
    >
      {children}
    </div>
  );
}

function CardHeading({ eyebrow, title, description }: { eyebrow?: string; title: string; description: string }) {
  return (
    <div className="mb-6">
      {eyebrow && (
        <div className="text-[10px] uppercase tracking-[0.18em] font-semibold mb-3" style={{ color: ACCENT }}>
          {eyebrow}
        </div>
      )}
      <h3 className="text-[20px] md:text-[22px] font-semibold text-white tracking-tight mb-2">
        {title}
      </h3>
      <p className="text-sm leading-relaxed max-w-md" style={{ color: TEXT_MUTED }}>
        {description}
      </p>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// CARD 1: Trained on your KPIs — clean 2x2 KPI pill grid
// ════════════════════════════════════════════════════════════════════════════
const KPI_PILLS = [
  { label: "ROAS",      value: "4.2x",  delta: "+12%", up: true },
  { label: "Hook Rate", value: "42%",   delta: "+8%",  up: true },
  { label: "Hold Curve",value: "31%",   delta: "−3%",  up: false },
  { label: "CPA",       value: "€19",   delta: "−14%", up: true }, // CPA down = good
];

function KpiPillGrid() {
  return (
    <div className="grid grid-cols-2 gap-3">
      {KPI_PILLS.map((k, i) => {
        // First pill gets the single accent treatment per card
        const isAccent = i === 0;
        return (
          <div
            key={k.label}
            className="rounded-xl p-4"
            style={{
              background: "#0F0D1A",
              border: `1px solid ${BORDER}`,
            }}
          >
            <div
              className="text-[10px] uppercase tracking-[0.14em] font-medium mb-2"
              style={{ color: TEXT_MUTED }}
            >
              {k.label}
            </div>
            <div className="flex items-end justify-between gap-2">
              <div
                className="text-[26px] font-semibold text-white tabular-nums leading-none"
                style={isAccent ? { color: "#fff" } : undefined}
              >
                {k.value}
              </div>
              <div
                className="flex items-center gap-0.5 text-[11px] font-medium tabular-nums"
                style={{ color: k.up ? "#10B981" : "#EF4444" }}
              >
                {k.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {k.delta.replace(/[+−-]/, "")}
              </div>
            </div>
            {isAccent && (
              <div
                className="mt-3 h-0.5 rounded-full"
                style={{ background: `linear-gradient(90deg, ${ACCENT}, transparent)` }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// CARD 2: Delivery you can track — Stripe-quality bar chart
// ════════════════════════════════════════════════════════════════════════════
const EDITORS = ["Liam", "Sofia", "Noah", "Iris"];
const WEEKS = 6;

function DeliveryChart() {
  const [active, setActive] = useState(0);

  const data = useMemo(() => {
    const out: Record<string, number[]> = {};
    EDITORS.forEach((name) => {
      let seed = name.charCodeAt(0) * 13 + name.charCodeAt(1) * 7;
      const rand = () => {
        seed = (seed * 9301 + 49297) % 233280;
        return seed / 233280;
      };
      out[name] = Array.from({ length: WEEKS }, () => 5 + Math.floor(rand() * 6));
    });
    return out;
  }, []);

  const values = data[EDITORS[active]];
  const maxIdx = values.indexOf(Math.max(...values));
  const max = 12;
  const approval = Math.round(85 + (active * 3) % 10);

  // Chart geometry
  const W = 420, H = 180;
  const PAD_L = 28, PAD_R = 12, PAD_T = 16, PAD_B = 28;
  const innerW = W - PAD_L - PAD_R;
  const innerH = H - PAD_T - PAD_B;
  const groupW = innerW / WEEKS;
  const barW = Math.min(28, groupW * 0.55);

  return (
    <div>
      {/* Top row: name + approval badge */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <div className="text-[10px] uppercase tracking-[0.14em] font-medium" style={{ color: TEXT_MUTED }}>
            Editor
          </div>
          <div className="text-[15px] font-semibold text-white mt-0.5">{EDITORS[active]}</div>
        </div>
        <div
          className="flex items-baseline gap-1.5 px-2.5 py-1 rounded-md"
          style={{ background: "#0F0D1A", border: `1px solid ${BORDER}` }}
        >
          <span className="text-[10px] uppercase tracking-[0.12em]" style={{ color: TEXT_MUTED }}>
            Approval
          </span>
          <span className="text-[13px] font-semibold text-white tabular-nums">{approval}%</span>
        </div>
      </div>

      {/* Chart */}
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-[180px]" preserveAspectRatio="none">
        {/* Y gridlines */}
        {[0, 4, 8, 12].map((v) => {
          const y = PAD_T + innerH - (v / max) * innerH;
          return (
            <g key={v}>
              <line
                x1={PAD_L}
                x2={W - PAD_R}
                y1={y}
                y2={y}
                stroke="#2A2740"
                strokeWidth="1"
                strokeDasharray={v === 0 ? "0" : "2 4"}
                opacity={v === 0 ? 1 : 0.5}
              />
              <text
                x={PAD_L - 8}
                y={y + 3}
                textAnchor="end"
                fontSize="9"
                fontFamily="ui-sans-serif, system-ui, sans-serif"
                fontWeight="500"
                fill="#6B6B7B"
              >
                {v}
              </text>
            </g>
          );
        })}

        {/* Bars */}
        {values.map((v, i) => {
          const h = (v / max) * innerH;
          const x = PAD_L + i * groupW + (groupW - barW) / 2;
          const y = PAD_T + innerH - h;
          const isHighlight = i === maxIdx;
          return (
            <g key={`${active}-${i}`}>
              <rect
                x={x}
                y={y}
                width={barW}
                height={h}
                rx="3"
                fill={isHighlight ? ACCENT : "#3A3650"}
                style={{
                  transformOrigin: `${x + barW / 2}px ${PAD_T + innerH}px`,
                  animation: `bar-rise 0.7s cubic-bezier(.22,.9,.3,1) ${i * 0.05}s both`,
                }}
              />
              <text
                x={PAD_L + i * groupW + groupW / 2}
                y={H - PAD_B + 16}
                textAnchor="middle"
                fontSize="9"
                fontFamily="ui-sans-serif, system-ui, sans-serif"
                fontWeight="500"
                fill="#6B6B7B"
              >
                W{i + 1}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Editor toggle tabs */}
      <div className="flex gap-1.5 mt-4">
        {EDITORS.map((name, i) => (
          <button
            key={name}
            onClick={() => setActive(i)}
            className="text-[11px] font-medium px-2.5 py-1 rounded-md transition-colors"
            style={{
              color: i === active ? "#fff" : TEXT_MUTED,
              background: i === active ? "#1F1B30" : "transparent",
              border: `1px solid ${i === active ? BORDER : "transparent"}`,
            }}
          >
            {name}
          </button>
        ))}
      </div>

      <style>{`
        @keyframes bar-rise {
          from { transform: scaleY(0); }
          to   { transform: scaleY(1); }
        }
      `}</style>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// CARD 3: Live KPI Dashboard — hero visual, real product feel
// ════════════════════════════════════════════════════════════════════════════
const SPARK_LEN = 28;
const TICK = 1100;

function genSpark(seed: number, trend: "up" | "down" | "flat" = "flat"): number[] {
  let s = seed;
  const rand = () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
  const arr: number[] = [];
  let v = 0.5;
  for (let i = 0; i < SPARK_LEN; i++) {
    const drift = trend === "up" ? 0.012 : trend === "down" ? -0.012 : 0;
    v += (rand() - 0.5) * 0.12 + drift;
    v = Math.max(0.08, Math.min(0.92, v));
    arr.push(v);
  }
  return arr;
}

function sparkPath(values: number[], w: number, h: number, padY = 4): string {
  const innerH = h - padY * 2;
  const pts = values.map((v, i) => {
    const x = (i / (values.length - 1)) * w;
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

const SECONDARY_KPIS = [
  { key: "cpa",  label: "CPA",  unit: "€", base: 19,  fmt: (v: number) => `€${v.toFixed(0)}`,  trend: "down" as const, up: true,  delta: "−8%" },
  { key: "ctr",  label: "CTR",  unit: "%", base: 3.4, fmt: (v: number) => `${v.toFixed(2)}%`,  trend: "up"   as const, up: true,  delta: "+5%" },
  { key: "hook", label: "Hook", unit: "%", base: 42,  fmt: (v: number) => `${v.toFixed(0)}%`,  trend: "up"   as const, up: true,  delta: "+12%" },
  { key: "hold", label: "Hold", unit: "%", base: 28,  fmt: (v: number) => `${v.toFixed(0)}%`,  trend: "flat" as const, up: false, delta: "−2%" },
];

function LiveDashboard() {
  const [roasSpark, setRoasSpark] = useState(() => genSpark(42, "up"));
  const [secondary, setSecondary] = useState(() =>
    SECONDARY_KPIS.map((k, i) => genSpark(i * 17 + 3, k.trend))
  );

  useEffect(() => {
    const t = setInterval(() => {
      setRoasSpark((prev) => {
        const last = prev[prev.length - 1];
        const next = Math.max(0.1, Math.min(0.9, last + (Math.random() - 0.45) * 0.1));
        return [...prev.slice(1), next];
      });
      setSecondary((prevAll) =>
        prevAll.map((arr) => {
          const last = arr[arr.length - 1];
          const next = Math.max(0.1, Math.min(0.9, last + (Math.random() - 0.5) * 0.12));
          return [...arr.slice(1), next];
        })
      );
    }, TICK);
    return () => clearInterval(t);
  }, []);

  const roasValue = (3.2 + roasSpark[roasSpark.length - 1] * 1.6).toFixed(2);

  return (
    <div>
      {/* Top header */}
      <div className="flex items-center justify-between mb-7">
        <div className="flex items-center gap-2.5">
          <span className="relative flex w-2 h-2">
            <span className="absolute inset-0 rounded-full animate-ping" style={{ background: "#10B981", opacity: 0.6 }} />
            <span className="relative w-2 h-2 rounded-full" style={{ background: "#10B981", boxShadow: "0 0 6px #10B981" }} />
          </span>
          <span className="text-[10px] uppercase tracking-[0.18em] font-semibold text-white">
            Live Performance Feed
          </span>
        </div>
        <div
          className="text-[9px] uppercase tracking-[0.16em] font-semibold px-2 py-1 rounded-md"
          style={{ color: TEXT_MUTED, background: "#0F0D1A", border: `1px solid ${BORDER}` }}
        >
          Streaming
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1.15fr_1fr] gap-6">
        {/* LEFT: Big ROAS + sparkline */}
        <div
          className="rounded-xl p-5"
          style={{ background: "#0F0D1A", border: `1px solid ${BORDER}` }}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="text-[10px] uppercase tracking-[0.14em] font-medium" style={{ color: TEXT_MUTED }}>
              ROAS · Account avg
            </div>
            <div
              className="flex items-center gap-0.5 text-[11px] font-medium tabular-nums"
              style={{ color: "#10B981" }}
            >
              <ArrowUpRight className="w-3 h-3" />
              18%
            </div>
          </div>
          <div className="flex items-baseline gap-1 mb-4">
            <span className="text-[44px] font-semibold text-white tabular-nums leading-none tracking-tight">
              {roasValue}
            </span>
            <span className="text-[20px] font-medium" style={{ color: TEXT_MUTED }}>x</span>
          </div>
          <svg viewBox="0 0 400 80" className="w-full h-[80px]" preserveAspectRatio="none">
            <path
              d={sparkPath(roasSpark, 400, 80, 6)}
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ transition: "d 1.1s linear" }}
            />
          </svg>
        </div>

        {/* RIGHT: 2x2 secondary KPIs */}
        <div className="grid grid-cols-2 gap-3">
          {SECONDARY_KPIS.map((k, i) => {
            const sp = secondary[i];
            const v = k.base + (sp[sp.length - 1] - 0.5) * (k.base * 0.3);
            return (
              <div
                key={k.key}
                className="rounded-xl p-3.5 flex flex-col justify-between"
                style={{ background: "#0F0D1A", border: `1px solid ${BORDER}` }}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="text-[10px] uppercase tracking-[0.12em] font-medium" style={{ color: TEXT_MUTED }}>
                    {k.label}
                  </div>
                  <div
                    className="flex items-center gap-0.5 text-[10px] font-medium tabular-nums"
                    style={{ color: k.up ? "#10B981" : "#EF4444" }}
                  >
                    {k.up ? <ArrowUpRight className="w-2.5 h-2.5" /> : <ArrowDownRight className="w-2.5 h-2.5" />}
                    {k.delta.replace(/[+−-]/, "")}
                  </div>
                </div>
                <div className="text-[18px] font-semibold text-white tabular-nums leading-none mb-2">
                  {k.fmt(v)}
                </div>
                <svg viewBox="0 0 100 24" className="w-full h-[24px]" preserveAspectRatio="none">
                  <path
                    d={sparkPath(sp, 100, 24, 2)}
                    fill="none"
                    stroke={k.up ? "#FFFFFF" : "#6B6B7B"}
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ transition: "d 1.1s linear" }}
                    vectorEffect="non-scaling-stroke"
                  />
                </svg>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// SECTION
// ════════════════════════════════════════════════════════════════════════════
const EditorEdge = () => {
  return (
    <section className="relative py-28" style={{ background: BG }}>
      <div className="relative z-10 max-w-6xl mx-auto px-6">
        {/* Headline */}
        <div className="text-center mb-16">
          <div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-6 text-[10px] uppercase tracking-[0.16em] font-semibold"
            style={{ background: "#13111F", border: `1px solid ${BORDER}`, color: TEXT_MUTED }}
          >
            What sets us apart
          </div>
          <h2 className="text-3xl md:text-5xl font-semibold text-white leading-[1.1] tracking-tight mb-5">
            Editors who understand{" "}
            <span style={{ color: ACCENT }}>why ads work</span>.
          </h2>
          <p className="max-w-2xl mx-auto text-base leading-relaxed" style={{ color: TEXT_MUTED }}>
            Every brand gets a private performance dashboard. Hook rate, hold curve, ROAS, CPA and delivery — all in one place, updated in real time. Your editor sees the same numbers you do.
          </p>
        </div>

        {/* Top row: two equal-width cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
          <Panel>
            <CardHeading
              title="Trained on your KPIs"
              description="Your editor studies your hook rates, hold curves, CPA and ROAS every week. Creative informed by data, not taste."
            />
            <KpiPillGrid />
          </Panel>
          <Panel>
            <CardHeading
              title="Delivery you can track"
              description="See exactly how many videos were delivered and approved per editor, week by week. No chasing status updates."
            />
            <DeliveryChart />
          </Panel>
        </div>

        {/* Bottom: full-width hero panel */}
        <div className="mb-16">
          <Panel>
            <CardHeading
              title="Live KPI Dashboard"
              description="ROAS front and centre. CPA, CTR, hook rate and hold rate streaming alongside. One live view of what every editor on your account is moving."
            />
            <LiveDashboard />
          </Panel>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Button
            asChild
            variant="cta"
            size="lg"
            className="text-base px-8 py-5 h-auto group rounded-xl"
          >
            <Link to="/mock">
              <span className="flex items-center">
                Explore the live demo
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </Link>
          </Button>
          <p className="mt-3 text-xs max-w-md mx-auto" style={{ color: TEXT_MUTED }}>
            Sample dashboard with mock data. Your real version is fully tailored to your account.
          </p>
        </div>
      </div>
    </section>
  );
};

export default EditorEdge;
