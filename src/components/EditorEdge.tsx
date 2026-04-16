import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Brain, Activity } from "lucide-react";
import { Link } from "react-router-dom";
import {
  motion,
  useInView,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
  AnimatePresence,
} from "framer-motion";

const ACCENT = "#a855f7";

// Spring presets
const SPRING_SOFT = { type: "spring" as const, stiffness: 90, damping: 18, mass: 0.9 };
const SPRING_TIGHT = { type: "spring" as const, stiffness: 220, damping: 22, mass: 0.6 };
const SPRING_OVERSHOOT = { type: "spring" as const, stiffness: 260, damping: 14, mass: 0.7 };

// Hook: count-up driven by framer's animate (manual interpolation)
function useCountUp(target: number, active: boolean, duration = 1.1, decimals = 0) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!active) return;
    let raf = 0;
    const start = performance.now();
    const from = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / (duration * 1000));
      // easeOutCubic
      const eased = 1 - Math.pow(1 - t, 3);
      setVal(from + (target - from) * eased);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, active, duration]);
  return Number(val.toFixed(decimals));
}

// ────────────────────────────────────────────────────────────────────────────
// Card shell with parallax tilt on hover + sequenced entry
// ────────────────────────────────────────────────────────────────────────────
function FeatureCard({
  title,
  description,
  visual,
  variant = "left",
  delay = 0,
  className = "",
  onSettled,
}: {
  title: string;
  description: string;
  visual: (settled: boolean) => React.ReactNode;
  variant?: "left" | "right" | "bottom";
  delay?: number;
  className?: string;
  onSettled?: () => void;
}) {
  const reduce = useReducedMotion();
  const cardRef = useRef<HTMLDivElement>(null);
  const inView = useInView(cardRef, { once: true, margin: "-15% 0% -15% 0%" });
  const [settled, setSettled] = useState(false);

  // Tilt
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rx = useSpring(useTransform(my, [0, 1], [4, -4]), { stiffness: 200, damping: 20 });
  const ry = useSpring(useTransform(mx, [0, 1], [-4, 4]), { stiffness: 200, damping: 20 });
  const glowX = useTransform(mx, [0, 1], ["0%", "100%"]);
  const glowY = useTransform(my, [0, 1], ["0%", "100%"]);

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    if (reduce) return;
    const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
    mx.set((e.clientX - rect.left) / rect.width);
    my.set((e.clientY - rect.top) / rect.height);
  }
  function onLeave() {
    mx.set(0.5);
    my.set(0.5);
  }

  const initial =
    variant === "left"
      ? { opacity: 0, x: -36, y: 8, scale: 0.96 }
      : variant === "right"
      ? { opacity: 0, x: 36, y: 8, scale: 0.96 }
      : { opacity: 0, y: 36, scale: 0.96 };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      initial={initial}
      animate={inView ? { opacity: 1, x: 0, y: 0, scale: 1 } : initial}
      transition={{ ...SPRING_SOFT, delay }}
      onAnimationComplete={() => {
        if (!settled) {
          setSettled(true);
          onSettled?.();
        }
      }}
      style={{
        rotateX: reduce ? 0 : rx,
        rotateY: reduce ? 0 : ry,
        transformPerspective: 1200,
        transformStyle: "preserve-3d",
        background:
          "linear-gradient(180deg, rgba(28,24,42,0.85) 0%, rgba(14,12,22,0.92) 100%)",
        border: "1px solid rgba(255,255,255,0.06)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        boxShadow:
          "0 1px 0 rgba(255,255,255,0.08) inset, 0 0 0 1px rgba(255,255,255,0.02) inset, 0 20px 60px -20px rgba(0,0,0,0.6)",
      }}
      whileHover={
        reduce
          ? undefined
          : {
              y: -4,
              boxShadow:
                "0 1px 0 rgba(255,255,255,0.10) inset, 0 0 0 1px rgba(168,85,247,0.20) inset, 0 30px 80px -20px rgba(168,85,247,0.30), 0 0 60px -10px rgba(168,85,247,0.20)",
            }
      }
      className={`mw-card group relative overflow-hidden rounded-3xl ${className}`}
    >
      {/* Cursor-follow glow */}
      <motion.div
        className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: useTransform(
            [glowX, glowY] as never,
            ([x, y]: any) =>
              `radial-gradient(420px circle at ${x} ${y}, rgba(168,85,247,0.18), transparent 60%)`
          ),
        }}
      />

      {/* Top edge highlight */}
      <div
        className="absolute inset-x-8 top-0 h-px pointer-events-none"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(168,85,247,0.55), transparent)",
        }}
      />
      {/* Horizon glow */}
      <motion.div
        className="absolute inset-x-0 -bottom-32 h-64 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 0.55 } : { opacity: 0 }}
        transition={{ duration: 1.2, delay: delay + 0.2 }}
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
        {visual(settled)}
        {/* Purple-tinted grain overlay (per visual) */}
        <div className="absolute inset-0 pointer-events-none mw-grain-purple" />
      </div>
    </motion.div>
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

function EditorBrainVisual({ active }: { active: boolean }) {
  const reduce = useReducedMotion();
  const W = 400, H = 280;
  const center = { x: W / 2, y: H / 2 - 6 };
  const [hovered, setHovered] = useState<string | null>(null);

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
        </defs>

        {/* Ambient glow — fade in */}
        <motion.ellipse
          cx={center.x}
          cy={center.y}
          rx="160"
          ry="100"
          fill="url(#brainGlow)"
          initial={{ opacity: 0, scale: 0.85 }}
          animate={active ? { opacity: 1, scale: 1 } : { opacity: 0 }}
          transition={{ duration: 1.4, ease: "easeOut" }}
          style={{ transformOrigin: `${center.x}px ${center.y}px` }}
        />

        {/* Connection lines DRAW outward from center */}
        {BRAIN_NODES.map((n, i) => {
          const x = (n.x / 100) * W;
          const y = (n.y / 100) * H;
          const cx = (x + center.x) / 2;
          const cy = (y + center.y) / 2 + (i % 2 ? 18 : -18);
          const d = `M ${center.x},${center.y} Q ${cx},${cy} ${x},${y}`;
          const isHover = hovered === n.id;
          const dim = hovered && !isHover;
          return (
            <g key={n.id}>
              <motion.path
                d={d}
                fill="none"
                stroke={isHover ? "rgba(232,213,255,0.85)" : "rgba(168,85,247,0.22)"}
                strokeWidth={isHover ? 1.4 : 1}
                style={{ opacity: dim ? 0.25 : 1, transition: "stroke 0.3s, stroke-width 0.3s, opacity 0.3s" }}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={active ? { pathLength: 1, opacity: dim ? 0.25 : 1 } : { pathLength: 0, opacity: 0 }}
                transition={{ duration: 0.9, delay: 0.15 + i * 0.12, ease: [0.22, 0.9, 0.3, 1] }}
              />
              {/* Particles travel along line — start after line draws */}
              {active && !reduce && (
                <>
                  <circle r="2.4" fill="#e9d5ff" style={{ filter: "drop-shadow(0 0 6px #a855f7)" }}>
                    <animateMotion dur={`${2.6 + i * 0.18}s`} begin={`${1.0 + i * 0.12}s`} repeatCount="indefinite" path={d} />
                    <animate attributeName="opacity" values="0;1;1;0" dur={`${2.6 + i * 0.18}s`} begin={`${1.0 + i * 0.12}s`} repeatCount="indefinite" />
                  </circle>
                  <circle r="1.4" fill="#fff" opacity="0.7">
                    <animateMotion dur={`${3.4 + i * 0.22}s`} begin={`${1.3 + i * 0.12}s`} repeatCount="indefinite" path={d} />
                  </circle>
                </>
              )}
            </g>
          );
        })}

        {/* Center hex — soft pulse */}
        <motion.g
          style={{ transformOrigin: `${center.x}px ${center.y}px` }}
          initial={{ scale: 0, opacity: 0 }}
          animate={active ? { scale: [0, 1.08, 1], opacity: 1 } : { scale: 0, opacity: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 0.9, 0.3, 1] }}
        >
          <motion.g
            animate={reduce ? undefined : { scale: [1, 1.04, 1] }}
            transition={{ duration: 3.4, ease: "easeInOut", repeat: Infinity }}
            style={{ transformOrigin: `${center.x}px ${center.y}px` }}
          >
            <polygon
              points={hexPoints(center.x, center.y, 44)}
              fill="none"
              stroke="rgba(168,85,247,0.45)"
              strokeWidth="1"
              style={{ filter: "drop-shadow(0 0 12px rgba(168,85,247,0.6))" }}
            />
            <polygon
              points={hexPoints(center.x, center.y, 32)}
              fill="url(#brainCore)"
              opacity="0.95"
              style={{ filter: "drop-shadow(0 0 18px rgba(168,85,247,0.8))" }}
            />
            <polygon
              points={hexPoints(center.x, center.y, 18)}
              fill="none"
              stroke="rgba(255,255,255,0.5)"
              strokeWidth="1"
            />
          </motion.g>
        </motion.g>

        {/* Pulse ring (only after settle) */}
        {active && !reduce && (
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
              begin="0.8s"
              repeatCount="indefinite"
            />
            <animate attributeName="opacity" values="0.7;0" dur="2.6s" begin="0.8s" repeatCount="indefinite" />
          </polygon>
        )}
      </svg>

      {/* Center brain icon */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        style={{ marginTop: -6 }}
        initial={{ opacity: 0, scale: 0.6 }}
        animate={active ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.6 }}
        transition={{ ...SPRING_OVERSHOOT, delay: 0.25 }}
      >
        <Brain className="w-7 h-7 text-white" style={{ filter: "drop-shadow(0 0 6px rgba(255,255,255,0.5))" }} />
      </motion.div>

      {/* KPI bubbles — staggered in, idle float, lift on hover */}
      {BRAIN_NODES.map((n, i) => {
        const isHover = hovered === n.id;
        const dim = hovered && !isHover;
        return (
          <motion.div
            key={n.id}
            className="absolute"
            style={{
              left: `${n.x}%`,
              top: `${n.y}%`,
              transform: "translate(-50%, -50%)",
            }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={
              active
                ? {
                    opacity: dim ? 0.55 : 1,
                    scale: 1,
                    y: reduce ? 0 : [0, -3, 0, 3, 0],
                  }
                : { opacity: 0, scale: 0.8 }
            }
            transition={{
              opacity: { duration: 0.4, delay: 0.6 + i * 0.12 },
              scale: { ...SPRING_OVERSHOOT, delay: 0.6 + i * 0.12 },
              y: { duration: 5 + i * 0.4, repeat: Infinity, ease: "easeInOut", delay: 1.2 + i * 0.2 },
            }}
            onMouseEnter={() => setHovered(n.id)}
            onMouseLeave={() => setHovered(null)}
            whileHover={reduce ? undefined : { y: -4, scale: 1.06 }}
          >
            <div
              className="flex flex-col items-center gap-0.5 px-2.5 py-1.5 rounded-lg backdrop-blur-md cursor-default"
              style={{
                background: "rgba(20,16,32,0.85)",
                border: `1px solid ${isHover ? "rgba(232,213,255,0.7)" : "rgba(168,85,247,0.45)"}`,
                boxShadow: isHover
                  ? "0 0 22px rgba(232,213,255,0.55)"
                  : "0 0 14px rgba(168,85,247,0.35)",
                transition: "box-shadow 0.3s, border-color 0.3s",
              }}
            >
              <span className="text-[8px] uppercase tracking-wider font-semibold text-white/55 leading-none">{n.label}</span>
              <span className="text-[12px] font-bold text-white tabular-nums leading-none">{n.value}</span>
            </div>
          </motion.div>
        );
      })}
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
// VISUAL 2: Editor Delivery Tracker — bars grow with stagger + count-up
// ════════════════════════════════════════════════════════════════════════════
const DELIVERY_EDITORS = [
  { name: "Liam",  color: "#a855f7" },
  { name: "Sofia", color: "#c084fc" },
  { name: "Noah",  color: "#7c3aed" },
  { name: "Iris",  color: "#d8b4fe" },
];

const DELIVERY_WEEKS = 6;

function EditorDeliveryTrackerVisual({ active }: { active: boolean }) {
  const reduce = useReducedMotion();
  const [activeEditor, setActiveEditor] = useState(0);
  const [animKey, setAnimKey] = useState(0);
  const [hoverBar, setHoverBar] = useState<number | null>(null);

  useEffect(() => {
    if (!active) return;
    const t = setInterval(() => {
      setActiveEditor((x) => (x + 1) % DELIVERY_EDITORS.length);
      setAnimKey((k) => k + 1);
    }, 3200);
    return () => clearInterval(t);
  }, [active]);

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

  // Count-up approval %
  const approvalDisplay = useCountUp(approvalRate, active, 1.0, 0);

  return (
    <div className="absolute inset-0 px-3 pt-2">
      {/* Top header */}
      <div className="absolute left-5 top-3 right-5 flex items-center justify-between z-10">
        <div className="flex items-center gap-2">
          <motion.div
            className="w-2 h-2 rounded-full"
            style={{ background: activeColor, boxShadow: `0 0 8px ${activeColor}` }}
            animate={reduce ? undefined : { opacity: [1, 0.4, 1], scale: [1, 0.85, 1] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          />
          <AnimatePresence mode="wait">
            <motion.div
              key={activeName}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.3 }}
              className="text-[11px] uppercase tracking-wider font-semibold text-white"
            >
              {activeName}
            </motion.div>
          </AnimatePresence>
          <div className="text-[10px] font-medium text-white/40">· last 6 weeks</div>
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-[10px] uppercase tracking-wider font-semibold text-white/40">Approval</span>
          <span
            className="text-[14px] font-bold tabular-nums"
            style={{ color: activeColor, textShadow: `0 0 12px ${activeColor}99` }}
          >
            {approvalDisplay}%
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

        {/* Y-axis gridlines */}
        {[0, 4, 8, 12].map((v, gi) => {
          const y = PAD_TOP + innerH - (v / maxVal) * innerH;
          return (
            <motion.g
              key={v}
              initial={{ opacity: 0 }}
              animate={active ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.5, delay: 0.1 + gi * 0.04 }}
            >
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
            </motion.g>
          );
        })}

        {/* Bars per week — spring overshoot, stagger left → right */}
        {activeData.map((d, i) => {
          const gx = PAD_X + i * groupW + 4;
          const dH = (d.delivered / maxVal) * innerH;
          const aH = (d.approved / maxVal) * innerH;
          const dY = PAD_TOP + innerH - dH;
          const aY = PAD_TOP + innerH - aH;
          const isHover = hoverBar === i;
          const hoverScale = isHover ? 1.06 : 1;
          return (
            <g
              key={`${animKey}-${i}`}
              onMouseEnter={() => setHoverBar(i)}
              onMouseLeave={() => setHoverBar(null)}
              style={{ cursor: "pointer" }}
            >
              {/* Delivered (back) */}
              <motion.rect
                x={gx}
                y={dY}
                width={barW}
                height={dH}
                rx="3"
                fill={`url(#delGrad-${activeEditor})`}
                stroke={activeColor}
                strokeOpacity="0.35"
                strokeWidth="1"
                initial={{ scaleY: 0, opacity: 0.4 }}
                animate={active ? { scaleY: hoverScale, opacity: 1 } : { scaleY: 0, opacity: 0.4 }}
                transition={{ ...SPRING_OVERSHOOT, delay: 0.25 + i * 0.08 }}
                style={{
                  transformOrigin: `${gx + barW / 2}px ${PAD_TOP + innerH}px`,
                  filter: `drop-shadow(0 0 ${isHover ? 12 : 6}px ${activeColor}${isHover ? "aa" : "55"})`,
                }}
              />
              {/* Approved (front) */}
              <motion.rect
                x={gx + barW + 4}
                y={aY}
                width={barW}
                height={aH}
                rx="3"
                fill={`url(#appGrad-${activeEditor})`}
                initial={{ scaleY: 0 }}
                animate={active ? { scaleY: hoverScale } : { scaleY: 0 }}
                transition={{ ...SPRING_OVERSHOOT, delay: 0.32 + i * 0.08 }}
                style={{
                  transformOrigin: `${gx + barW + 4 + barW / 2}px ${PAD_TOP + innerH}px`,
                  filter: `drop-shadow(0 0 ${isHover ? 14 : 8}px ${activeColor})`,
                }}
              />
              {/* Approved value label — appears AFTER bars */}
              <motion.text
                x={gx + barW + 4 + barW / 2}
                y={aY - 4}
                textAnchor="middle"
                fontSize="9"
                fontFamily="ui-sans-serif, system-ui, sans-serif"
                fontWeight="700"
                fill="#fff"
                initial={{ opacity: 0, y: aY }}
                animate={active ? { opacity: 1, y: aY - 4 } : { opacity: 0 }}
                transition={{ duration: 0.4, delay: 0.85 + i * 0.06 }}
              >
                {d.approved}
              </motion.text>
              {/* Week label */}
              <text
                x={gx + barW + 2}
                y={H - PAD_BOTTOM + 14}
                textAnchor="middle"
                fontSize="9"
                fontFamily="ui-sans-serif, system-ui, sans-serif"
                fontWeight="600"
                fill={isHover ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.40)"}
                style={{ transition: "fill 0.2s" }}
              >
                W{i + 1}
              </text>
            </g>
          );
        })}

        {/* Vertical light sweep — single pass after bars */}
        {active && !reduce && (
          <motion.rect
            key={`sweep-${animKey}`}
            x={PAD_X}
            y={PAD_TOP}
            width="60"
            height={innerH}
            fill="url(#sweepGrad)"
            initial={{ x: PAD_X - 80, opacity: 0 }}
            animate={{ x: W - PAD_X, opacity: [0, 0.5, 0] }}
            transition={{ duration: 1.4, delay: 1.0, ease: "easeInOut" }}
            style={{ mixBlendMode: "screen" }}
          />
        )}
        <defs>
          <linearGradient id="sweepGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={activeColor} stopOpacity="0" />
            <stop offset="50%" stopColor="#fff" stopOpacity="0.45" />
            <stop offset="100%" stopColor={activeColor} stopOpacity="0" />
          </linearGradient>
        </defs>
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
              <motion.span
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: e.color, boxShadow: i === activeEditor ? `0 0 6px ${e.color}` : "none" }}
                animate={i === activeEditor && !reduce ? { scale: [1, 1.3, 1] } : { scale: 1 }}
                transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
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
// VISUAL 3: KPI Dashboard — line draws, area fades after, dot travels, count-ups
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

// Mini KPI tile with count-up + delta + sparkline
function MiniKpiTile({
  def,
  values,
  latest,
  prev,
  active,
  index,
}: {
  def: typeof KPI_DEFS[number];
  values: number[];
  latest: number;
  prev: number;
  active: boolean;
  index: number;
}) {
  const w = 220, h = 64;
  const delta = latest - prev;
  const goodDirection = def.key === "cpa" ? delta < 0 : delta > 0;
  const deltaPct = prev !== 0 ? (delta / prev) * 100 : 0;
  const arrow = delta > 0 ? "▲" : delta < 0 ? "▼" : "·";
  const deltaColor = goodDirection ? "#a3e635" : "rgba(255,255,255,0.45)";

  // Count-up to current latest (one-shot on first activate)
  const [hasInit, setHasInit] = useState(false);
  useEffect(() => {
    if (active) setHasInit(true);
  }, [active]);
  const decimals = def.key === "cpa" ? 0 : def.key === "roas" || def.key === "ctr" ? 2 : 1;
  const display = useCountUp(latest, active && !hasInit ? false : active, 1.1, decimals);
  const showDelta = hasInit;

  return (
    <motion.div
      className="relative rounded-xl overflow-hidden"
      initial={{ opacity: 0, y: 12, scale: 0.96 }}
      animate={active ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 12, scale: 0.96 }}
      transition={{ ...SPRING_SOFT, delay: 0.55 + index * 0.1 }}
      style={{
        background: "rgba(20,16,32,0.6)",
        border: `1px solid ${def.color}22`,
        backdropFilter: "blur(8px)",
        boxShadow: `inset 0 0 24px ${def.color}10`,
      }}
    >
      <svg viewBox={`0 0 ${w} ${h}`} className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
        <defs>
          <linearGradient id={`mini-${def.key}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={def.color} stopOpacity="0.45" />
            <stop offset="100%" stopColor={def.color} stopOpacity="0" />
          </linearGradient>
        </defs>
        <motion.path
          d={buildSparkArea(values, w, h, 2, 6)}
          fill={`url(#mini-${def.key})`}
          initial={{ opacity: 0 }}
          animate={active ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6, delay: 1.2 + index * 0.1 }}
          style={{ transition: "d 0.85s linear" }}
        />
        <motion.path
          d={buildSparkPath(values, w, h, 2, 6)}
          fill="none"
          stroke={def.color}
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={active ? { pathLength: 1 } : { pathLength: 0 }}
          transition={{ duration: 1.0, delay: 0.8 + index * 0.1, ease: [0.22, 0.9, 0.3, 1] }}
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
            {fmtKpi(display, def.key)}
            {def.unit !== "€" && <span className="text-white/45 text-[10px] ml-0.5">{def.unit}</span>}
          </div>
        </div>
        <AnimatePresence>
          {showDelta && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35, delay: 0.1 }}
              className="text-[9px] font-semibold tabular-nums px-1.5 py-0.5 rounded-md"
              style={{
                color: deltaColor,
                background: goodDirection ? "rgba(163,230,53,0.10)" : "rgba(255,255,255,0.04)",
                border: `1px solid ${goodDirection ? "rgba(163,230,53,0.25)" : "rgba(255,255,255,0.06)"}`,
              }}
            >
              {arrow} {Math.abs(deltaPct).toFixed(1)}%
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

function KpiDashboardVisual({ active }: { active: boolean }) {
  const reduce = useReducedMotion();
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
    if (!active) return;
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
  }, [active]);

  const roas = KPI_DEFS[0];
  const others = KPI_DEFS.slice(1);

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

  const lastNorm = roasValues[roasValues.length - 1];
  const dotX = PAD_L + innerW;
  const dotY = PAD_T + (1 - lastNorm) * innerH;

  // Count-up for ROAS headline
  const roasDisplay = useCountUp(roasLatest, active, 1.4, 2);

  return (
    <div className="absolute inset-0 px-5 pt-2 pb-3 flex flex-col">
      {/* Top header */}
      <motion.div
        className="flex items-center justify-between mb-2 z-10"
        initial={{ opacity: 0, y: -6 }}
        animate={active ? { opacity: 1, y: 0 } : { opacity: 0, y: -6 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
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
      </motion.div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-[1.2fr_1fr] gap-3 min-h-0">
        {/* Featured ROAS */}
        <motion.div
          className="relative rounded-2xl overflow-hidden"
          initial={{ opacity: 0, x: -16, scale: 0.97 }}
          animate={active ? { opacity: 1, x: 0, scale: 1 } : { opacity: 0, x: -16, scale: 0.97 }}
          transition={{ ...SPRING_SOFT, delay: 0.25 }}
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
                {roasDisplay.toFixed(2)}<span className="text-white/45 text-[14px] ml-0.5">x</span>
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
                <motion.g
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={active ? { opacity: 1 } : { opacity: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 + i * 0.04 }}
                >
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
                </motion.g>
              );
            })}

            {/* Area — fades in AFTER line draws */}
            <motion.path
              d={buildFeaturedArea(roasValues)}
              fill="url(#featRoasArea)"
              initial={{ opacity: 0 }}
              animate={active ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.7, delay: 1.7 }}
              style={{ transition: "d 0.85s linear" }}
            />
            {/* Line — DRAWS left to right */}
            <motion.path
              d={buildFeaturedLine(roasValues)}
              fill="none"
              stroke="url(#featRoasLine)"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={active ? { pathLength: 1 } : { pathLength: 0 }}
              transition={{ duration: 1.5, delay: 0.55, ease: [0.22, 0.9, 0.3, 1] }}
              style={{
                filter: `drop-shadow(0 0 8px ${roas.color}cc)`,
                transition: "d 0.85s linear",
              }}
            />

            {/* Leading dot — appears after line draws */}
            <motion.g
              initial={{ opacity: 0, scale: 0.4 }}
              animate={active ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.4 }}
              transition={{ ...SPRING_OVERSHOOT, delay: 2.0 }}
              style={{ transition: "transform 0.85s linear", transformOrigin: `${dotX}px ${dotY}px` }}
            >
              <circle cx={dotX} cy={dotY} r="10" fill={roas.color} opacity="0.18">
                <animate attributeName="r" values="6;14;6" dur="2.4s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.25;0;0.25" dur="2.4s" repeatCount="indefinite" />
              </circle>
              <circle cx={dotX} cy={dotY} r="4" fill={roas.color} opacity="0.5" />
              <circle cx={dotX} cy={dotY} r="2.4" fill="#fff"
                style={{ filter: `drop-shadow(0 0 6px ${roas.color})` }} />
            </motion.g>

            {/* Time labels */}
            {["−24h", "−18h", "−12h", "−6h", "now"].map((label, i) => {
              const x = PAD_L + (i / 4) * innerW;
              return (
                <motion.text
                  key={label}
                  x={x}
                  y={FH - 6}
                  textAnchor="middle"
                  fontSize="8"
                  fontFamily="ui-sans-serif, system-ui, sans-serif"
                  fontWeight="600"
                  fill="rgba(255,255,255,0.30)"
                  initial={{ opacity: 0 }}
                  animate={active ? { opacity: 1 } : { opacity: 0 }}
                  transition={{ duration: 0.5, delay: 1.9 + i * 0.05 }}
                >
                  {label}
                </motion.text>
              );
            })}
          </svg>
        </motion.div>

        {/* Mini tile grid */}
        <div className="grid grid-cols-2 gap-2.5">
          {others.map((m, idx) => (
            <MiniKpiTile
              key={m.key}
              def={m}
              values={series[m.key]}
              latest={latest[m.key]}
              prev={prev[m.key]}
              active={active}
              index={idx}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// Section
// ════════════════════════════════════════════════════════════════════════════
const EditorEdge = () => {
  const reduce = useReducedMotion();
  const sectionRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const headerInView = useInView(headerRef, { once: true, margin: "-20% 0%" });

  const headline = ["Editors", "who", "understand"];
  const headlineAccent = ["why", "ads", "work"];

  return (
    <section
      ref={sectionRef}
      className="relative py-28 overflow-hidden"
      style={{ background: "#09090f" }}
    >
      {/* Drifting radial glows behind cards */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2.4, ease: "easeOut" }}
      >
        <motion.div
          className="absolute -top-20 left-[10%] w-[520px] h-[520px] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(168,85,247,0.18) 0%, transparent 65%)",
            filter: "blur(40px)",
          }}
          animate={reduce ? undefined : { x: [0, 60, -20, 0], y: [0, 30, -10, 0] }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-[40%] right-[5%] w-[480px] h-[480px] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(124,58,237,0.16) 0%, transparent 65%)",
            filter: "blur(40px)",
          }}
          animate={reduce ? undefined : { x: [0, -50, 30, 0], y: [0, -20, 40, 0] }}
          transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(124,58,237,0.10) 0%, transparent 70%)",
          }}
        />
      </motion.div>
      <div className="absolute inset-0 pointer-events-none mw-grain-bg" />

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <div ref={headerRef} className="text-center mb-16">
          {/* Eyebrow chip — scale in with bloom */}
          <motion.div
            initial={{ opacity: 0, scale: 0.7 }}
            animate={headerInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ ...SPRING_OVERSHOOT, delay: 0.1 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6 text-[11px] font-medium text-white/85"
            style={{
              background: "rgba(168,85,247,0.12)",
              border: "1px solid rgba(168,85,247,0.30)",
              boxShadow: "0 0 24px -6px rgba(168,85,247,0.5)",
            }}
          >
            <Sparkles className="w-3 h-3" style={{ color: ACCENT }} />
            What sets us apart
          </motion.div>

          {/* Staggered headline */}
          <h2 className="text-3xl md:text-5xl font-extrabold text-white leading-tight mb-5">
            {headline.map((w, i) => (
              <motion.span
                key={`h-${i}`}
                className="inline-block mr-[0.25em]"
                initial={{ opacity: 0, y: 18, filter: "blur(6px)" }}
                animate={headerInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
                transition={{ ...SPRING_SOFT, delay: 0.25 + i * 0.08 }}
              >
                {w}
              </motion.span>
            ))}
            <span
              style={{
                background: "linear-gradient(135deg, #a855f7, #c084fc, #e9d5ff)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {headlineAccent.map((w, i) => (
                <motion.span
                  key={`ha-${i}`}
                  className="inline-block mr-[0.25em]"
                  initial={{ opacity: 0, y: 18, filter: "blur(6px)" }}
                  animate={headerInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
                  transition={{ ...SPRING_SOFT, delay: 0.55 + i * 0.08 }}
                >
                  {w}
                </motion.span>
              ))}
            </span>
          </h2>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.85 }}
            className="text-white/50 max-w-2xl mx-auto text-base leading-relaxed"
          >
            Every brand we work with gets their own private back-end, built and hosted by us, completely free. Your editors see the same numbers you see, in real time. Delivery, approvals, hook rates, ROAS and CPA, all in one place. No more guessing what is working, no more chasing status updates. Full transparency for you, sharper creative decisions for them.
          </motion.p>

          {/* CTA pill — scale in with glow bloom */}
          <motion.div
            initial={{ opacity: 0, scale: 0.6, filter: "blur(8px)" }}
            animate={headerInView ? { opacity: 1, scale: 1, filter: "blur(0px)" } : {}}
            transition={{ ...SPRING_OVERSHOOT, delay: 1.05 }}
            className="mt-8 inline-flex items-center gap-2 px-4 py-2 rounded-full text-[12px] font-semibold text-white"
            style={{
              background: "linear-gradient(135deg, rgba(168,85,247,0.22), rgba(124,58,237,0.18))",
              border: "1px solid rgba(168,85,247,0.45)",
              boxShadow: "0 0 28px -4px rgba(168,85,247,0.55)",
            }}
          >
            <Sparkles className="w-3.5 h-3.5" style={{ color: "#e9d5ff" }} />
            <span>Included free with every brand. You only pay per video.</span>
          </motion.div>
        </div>

        {/* Top row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
          <FeatureCard
            variant="left"
            delay={0}
            title="Trained on your KPIs"
            description="Every editor on your account studies your hook rates, hold curves, CPA and ROAS. They learn what your winners share, then engineer more of them."
            visual={(settled) => <EditorBrainVisual active={settled} />}
          />
          <FeatureCard
            variant="right"
            delay={0.15}
            title="Editor delivery tracker"
            description="Delivered vs approved videos per editor, week by week. See exactly who is shipping and who is shipping work that lands."
            visual={(settled) => <EditorDeliveryTrackerVisual active={settled} />}
          />
        </div>

        {/* Bottom row: KPI Dashboard full width */}
        <div className="grid grid-cols-1 gap-5 mb-16">
          <FeatureCard
            variant="bottom"
            delay={0.35}
            title="KPI Dashboard"
            description="ROAS front and centre, with CPA, CTR, hook rate and hold rate streaming alongside. One live view of what every editor on your account is moving."
            visual={(settled) => <KpiDashboardVisual active={settled} />}
          />
        </div>

        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.5 }}
            className="mb-3 inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider text-white/70"
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
          </motion.div>
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

        @media (prefers-reduced-motion: reduce) {
          .mw-grain-bg, .mw-grain-purple { animation: none !important; }
        }
      `}</style>
    </section>
  );
};

export default EditorEdge;
