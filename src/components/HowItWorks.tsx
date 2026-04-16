import { useEffect, useRef, useState } from "react";
import {
  Sparkles,
  Brain,
  GraduationCap,
  UsersRound,
  Slack,
  FileText,
  Folder,
  MessageSquare,
} from "lucide-react";
import {
  motion,
  useInView,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
  type MotionValue,
} from "framer-motion";

const ACCENT = "#a855f7";

// Spring presets (matched to EditorEdge for consistency)
const SPRING_SOFT = { type: "spring" as const, stiffness: 90, damping: 18, mass: 0.9 };
const SPRING_OVERSHOOT = { type: "spring" as const, stiffness: 260, damping: 14, mass: 0.7 };

// One-shot count-up
function useCountUpOnce(target: number, active: boolean, duration = 1.2, decimals = 0) {
  const [val, setVal] = useState(0);
  const startedRef = useRef(false);
  useEffect(() => {
    if (!active || startedRef.current) return;
    startedRef.current = true;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / (duration * 1000));
      const eased = 1 - Math.pow(1 - t, 3);
      setVal(target * eased);
      if (t < 1) raf = requestAnimationFrame(tick);
      else setVal(target);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, target, duration]);
  return Number(val.toFixed(decimals));
}

// Parallax helper
function useParallax(mx: MotionValue<number>, my: MotionValue<number>, depthX: number, depthY: number) {
  const tx = useSpring(useTransform(mx, [0, 1], [-depthX, depthX]), { stiffness: 90, damping: 18 });
  const ty = useSpring(useTransform(my, [0, 1], [-depthY, depthY]), { stiffness: 90, damping: 18 });
  return { tx, ty };
}

type VisualRender = (ctx: { active: boolean; mx: MotionValue<number>; my: MotionValue<number> }) => React.ReactNode;

// ────────────────────────────────────────────────────────────────────────────
// Step card shell — perspective + cursor-follow tilt + sequenced entry
// ────────────────────────────────────────────────────────────────────────────
function StepCard({
  stepNumber,
  title,
  description,
  icon: Icon,
  visual,
  variant = "left",
  delay = 0,
}: {
  stepNumber: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  visual: VisualRender;
  variant?: "left" | "center" | "right";
  delay?: number;
}) {
  const reduce = useReducedMotion();
  const cardRef = useRef<HTMLDivElement>(null);
  const inView = useInView(cardRef, { once: true, margin: "-15% 0% -15% 0%" });
  const [settled, setSettled] = useState(false);

  // Auto-driven sweep position (replaces cursor input). Visuals consume mx/my
  // for layered drift; the CinematicCamera adds the strong rotational sweep.
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);

  useEffect(() => {
    if (reduce || !settled) return;
    let raf = 0;
    const start = performance.now();
    const periodX = 14000;
    const periodY = 18000;
    const offset = (delay || 0) * 1000;
    const tick = (now: number) => {
      const t = now - start + offset;
      const sx = 0.5 + 0.5 * Math.sin((t / periodX) * Math.PI * 2);
      const sy = 0.5 + 0.5 * Math.sin((t / periodY) * Math.PI * 2 + Math.PI / 3);
      mx.set(sx);
      my.set(sy);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reduce, settled, delay, mx, my]);

  const initial =
    variant === "left"
      ? { opacity: 0, x: -32, y: 8, scale: 0.96 }
      : variant === "right"
      ? { opacity: 0, x: 32, y: 8, scale: 0.96 }
      : { opacity: 0, y: 32, scale: 0.96 };

  return (
    <motion.div
      ref={cardRef}
      initial={initial}
      animate={inView ? { opacity: 1, x: 0, y: 0, scale: 1 } : initial}
      transition={{ ...SPRING_SOFT, delay }}
      onAnimationComplete={() => {
        if (!settled) setSettled(true);
      }}
      style={{
        background: "linear-gradient(180deg, rgba(28,24,42,0.85) 0%, rgba(14,12,22,0.92) 100%)",
        border: "1px solid rgba(255,255,255,0.06)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        boxShadow:
          "0 1px 0 rgba(255,255,255,0.08) inset, 0 0 0 1px rgba(255,255,255,0.02) inset, 0 20px 60px -20px rgba(0,0,0,0.6)",
      }}
      className="hiw-card relative overflow-hidden rounded-3xl"
    >
      <div
        className="absolute inset-x-8 top-0 h-px pointer-events-none"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(168,85,247,0.55), transparent)",
        }}
      />
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

      {/* Visual region — fixed bounds. Inner camera sweeps the scene cinematically. */}
      <div
        className="relative h-[260px] overflow-hidden"
        style={{ perspective: "1200px", transformStyle: "preserve-3d" }}
      >
        <CinematicCamera active={settled} delay={delay}>
          {visual({ active: settled, mx, my })}
        </CinematicCamera>
        <div className="absolute inset-0 pointer-events-none hiw-grain-purple" />
      </div>

      {/* Text */}
      <div className="relative p-6 pt-5">
        <div className="flex items-center gap-2 mb-3">
          <div
            className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full"
            style={{
              color: "#e9d5ff",
              background: "rgba(168,85,247,0.12)",
              border: "1px solid rgba(168,85,247,0.30)",
            }}
          >
            Step {stepNumber}
          </div>
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{
              background: "rgba(168,85,247,0.10)",
              border: "1px solid rgba(168,85,247,0.25)",
            }}
          >
            <Icon className="w-3.5 h-3.5 text-white" />
          </div>
        </div>
        <h3 className="text-[20px] font-semibold text-white tracking-tight mb-2">
          {title}
        </h3>
        <p className="text-sm text-white/50 leading-relaxed">{description}</p>
      </div>
    </motion.div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// CinematicCamera — self-running 3D sweep over an oversized inner scene.
// Card stays fixed; only the inner visual physically pans/rotates.
// ────────────────────────────────────────────────────────────────────────────
function CinematicCamera({
  children,
  active,
  delay = 0,
}: {
  children: React.ReactNode;
  active: boolean;
  delay?: number;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className="absolute inset-0"
      style={{
        transformStyle: "preserve-3d",
        transformOrigin: "50% 50%",
        willChange: "transform",
      }}
      initial={{ rotateY: -28, rotateX: 6, x: -36, y: -8, scale: 1.18 }}
      animate={
        reduce || !active
          ? { rotateY: 0, rotateX: 0, x: 0, y: 0, scale: 1.18 }
          : {
              rotateY: [-28, -8, 18, 32, 18, -8, -28],
              rotateX: [6, -2, -7, 2, 7, 2, 6],
              x: [-36, -10, 20, 40, 20, -10, -36],
              y: [-8, 4, 10, -2, -10, 4, -8],
              scale: 1.18,
            }
      }
      transition={
        reduce || !active
          ? { duration: 1.2, ease: "easeOut", delay }
          : {
              duration: 22,
              ease: "easeInOut",
              repeat: Infinity,
              repeatType: "loop",
              times: [0, 0.18, 0.36, 0.5, 0.64, 0.82, 1],
              delay: delay + 0.2,
            }
      }
    >
      {children}
    </motion.div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// VISUAL 1: AI-Powered Hiring — candidate grid + sweeping AI scan
// ════════════════════════════════════════════════════════════════════════════
function HiringVisual({ active, mx, my }: { active: boolean; mx: MotionValue<number>; my: MotionValue<number> }) {
  const reduce = useReducedMotion();
  const [scanIdx, setScanIdx] = useState(0);

  useEffect(() => {
    if (!active || reduce) return;
    const t = setInterval(() => setScanIdx((i) => (i + 1) % 5), 1600);
    return () => clearInterval(t);
  }, [active, reduce]);

  const W = 400, H = 260;
  const cols = 5;
  const rows = 4;
  const startX = 40;
  const startY = 50;
  const spacingX = 38;
  const spacingY = 40;
  const winnerX = 340;
  const winnerY = 130;

  const bg = useParallax(mx, my, 4, 3);
  const mid = useParallax(mx, my, 8, 6);
  const fg = useParallax(mx, my, 14, 10);
  const lightX = useTransform(mx, [0, 1], ["30%", "70%"]);
  const lightY = useTransform(my, [0, 1], ["30%", "70%"]);

  const screenedDisplay = useCountUpOnce(212, active, 1.4, 0);

  const WINNER_CELL = 12;

  return (
    <div className="absolute inset-0" style={{ transformStyle: "preserve-3d" }}>
      {/* BG */}
      <motion.div
        className="absolute inset-0"
        style={{ x: bg.tx, y: bg.ty, transform: "translateZ(-30px)" }}
      >
        <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid slice">
          <defs>
            <radialGradient id="hiringGlow" cx="80%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(168,85,247,0.45)" />
              <stop offset="100%" stopColor="rgba(168,85,247,0)" />
            </radialGradient>
          </defs>
          <motion.ellipse
            cx={winnerX} cy={winnerY} rx="80" ry="100"
            fill="url(#hiringGlow)"
            initial={{ opacity: 0 }}
            animate={active ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 1.2 }}
          />
        </svg>
        <motion.div
          className="absolute inset-0 pointer-events-none mix-blend-screen"
          style={{
            background: useTransform(
              [lightX, lightY] as never,
              ([lx, ly]: any) =>
                `radial-gradient(280px circle at ${lx} ${ly}, rgba(232,213,255,0.10), transparent 65%)`,
            ),
          }}
        />
      </motion.div>

      {/* MID */}
      <motion.div className="absolute inset-0" style={{ x: mid.tx, y: mid.ty }}>
        <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid slice">
          {Array.from({ length: rows }).map((_, r) =>
            Array.from({ length: cols }).map((_, c) => {
              const cx = startX + c * spacingX;
              const cy = startY + r * spacingY;
              const idx = r * cols + c;
              const passed = idx === WINNER_CELL;
              return (
                <motion.g
                  key={`${r}-${c}`}
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={active ? { opacity: passed ? 1 : 0.85, scale: 1 } : { opacity: 0, scale: 0.6 }}
                  transition={{ duration: 0.45, delay: 0.2 + idx * 0.025, ease: "easeOut" }}
                  style={{ transformOrigin: `${cx}px ${cy}px` }}
                >
                  <circle
                    cx={cx} cy={cy} r="9"
                    fill={passed ? "rgba(168,85,247,0.20)" : "rgba(255,255,255,0.04)"}
                    stroke={passed ? "rgba(168,85,247,0.7)" : "rgba(255,255,255,0.10)"}
                    strokeWidth="1"
                  />
                  <circle cx={cx} cy={cy - 1.5} r="2.5" fill={passed ? "#fff" : "rgba(255,255,255,0.45)"} />
                  <path
                    d={`M${cx - 4},${cy + 5} Q${cx},${cy + 1} ${cx + 4},${cy + 5}`}
                    stroke={passed ? "#fff" : "rgba(255,255,255,0.45)"}
                    strokeWidth="1.4"
                    fill="none"
                    strokeLinecap="round"
                  />
                  {!passed && (
                    <g opacity="0.45">
                      <line x1={cx + 5} y1={cy - 5} x2={cx + 9} y2={cy - 1}
                        stroke="#f87171" strokeWidth="1.2" strokeLinecap="round" />
                      <line x1={cx + 9} y1={cy - 5} x2={cx + 5} y2={cy - 1}
                        stroke="#f87171" strokeWidth="1.2" strokeLinecap="round" />
                    </g>
                  )}
                </motion.g>
              );
            }),
          )}

          {Array.from({ length: cols }).map((_, c) => {
            const x = startX + c * spacingX;
            const isActive = c === scanIdx;
            return (
              <rect
                key={c}
                x={x - 14}
                y={startY - 14}
                width="28"
                height={spacingY * rows - 12}
                rx="6"
                fill={isActive ? "rgba(168,85,247,0.10)" : "transparent"}
                stroke={isActive ? "rgba(168,85,247,0.45)" : "transparent"}
                strokeWidth="1"
                style={{ transition: "all 0.6s ease" }}
              />
            );
          })}

          <motion.path
            d={`M${startX + (cols - 1) * spacingX + 12},${startY + 1.5 * spacingY} Q${winnerX - 60},${winnerY - 30} ${winnerX - 24},${winnerY}`}
            fill="none"
            stroke="rgba(168,85,247,0.5)"
            strokeWidth="1.5"
            strokeDasharray="3 4"
            initial={{ pathLength: 0 }}
            animate={active ? { pathLength: 1 } : { pathLength: 0 }}
            transition={{ duration: 1.0, delay: 1.4, ease: [0.22, 0.9, 0.3, 1] }}
          />
        </svg>
      </motion.div>

      {/* FG */}
      <motion.div className="absolute inset-0 pointer-events-none" style={{ x: fg.tx, y: fg.ty }}>
        <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid slice">
          <defs>
            <linearGradient id="winnerGradFg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#c084fc" />
              <stop offset="100%" stopColor="#7c3aed" />
            </linearGradient>
          </defs>

          <motion.g
            initial={{ opacity: 0, y: -6 }}
            animate={active ? { opacity: 1, y: 0 } : { opacity: 0, y: -6 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <rect x="20" y="14" width="100" height="22" rx="11"
              fill="rgba(20,16,32,0.85)" stroke="rgba(168,85,247,0.30)" strokeWidth="1" />
            <text x="70" y="29" textAnchor="middle"
              fontSize="10" fontFamily="ui-sans-serif, system-ui, sans-serif"
              fontWeight="700" fill="rgba(255,255,255,0.85)">
              {screenedDisplay}+ screened
            </text>
          </motion.g>

          <motion.g
            style={{ transformOrigin: `${winnerX}px ${winnerY}px` }}
            initial={{ scale: 0, opacity: 0 }}
            animate={active ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
            transition={{ ...SPRING_OVERSHOOT, delay: 1.9 }}
          >
            <circle cx={winnerX} cy={winnerY} r="28" fill="url(#winnerGradFg)"
              style={{ filter: "drop-shadow(0 0 18px rgba(168,85,247,0.7))" }} />
            <circle cx={winnerX} cy={winnerY - 5} r="7" fill="#fff" opacity="0.95" />
            <path
              d={`M${winnerX - 11},${winnerY + 13} Q${winnerX},${winnerY + 4} ${winnerX + 11},${winnerY + 13}`}
              stroke="#fff" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.95"
            />
          </motion.g>

          {active && !reduce && (
            <circle cx={winnerX} cy={winnerY} r="28" fill="none" stroke="rgba(168,85,247,0.55)" strokeWidth="1.2">
              <animate attributeName="r" values="28;58" dur="2.8s" begin="2.2s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.7;0" dur="2.8s" begin="2.2s" repeatCount="indefinite" />
            </circle>
          )}

          <motion.g
            initial={{ opacity: 0, y: 8 }}
            animate={active ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
            transition={{ ...SPRING_SOFT, delay: 2.1 }}
          >
            <rect x={winnerX - 38} y={winnerY + 48} width="76" height="22" rx="11"
              fill="url(#winnerGradFg)"
              style={{ filter: "drop-shadow(0 0 12px rgba(168,85,247,0.6))" }} />
            <text x={winnerX} y={winnerY + 63} textAnchor="middle"
              fontSize="10" fontFamily="ui-sans-serif, system-ui, sans-serif"
              fontWeight="800" fill="#fff" letterSpacing="0.5">
              TOP 1%
            </text>
          </motion.g>
        </svg>

        <motion.div
          className="absolute right-3 top-3 inline-flex items-center gap-1.5 text-[9px] font-semibold uppercase tracking-wider text-[#a855f7]"
          initial={{ opacity: 0 }}
          animate={active ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <span className="relative flex w-1.5 h-1.5">
            <span className="absolute inset-0 rounded-full animate-ping bg-[#a855f7] opacity-60" />
            <span className="relative w-1.5 h-1.5 rounded-full bg-[#a855f7]"
              style={{ boxShadow: "0 0 8px #a855f7" }} />
          </span>
          AI scanning
        </motion.div>
      </motion.div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// VISUAL 2: Editor Mentoring System — modules with one-shot fill animations
// ════════════════════════════════════════════════════════════════════════════
const MENTOR_MODULES = [
  { label: "Getting started",        target: 100 },
  { label: "Project setup",          target: 100 },
  { label: "Hook engineering",       target: 100 },
  { label: "Premiere Pro tips",      target: 78  },
  { label: "Psychology masterclass", target: 42  },
  { label: "Performance metrics",    target: 0   },
];

function ModuleRow({
  module: m,
  active,
  index,
}: {
  module: typeof MENTOR_MODULES[number];
  active: boolean;
  index: number;
}) {
  const isLocked = m.target === 0;
  const display = useCountUpOnce(m.target, active, 1.0, 0);
  const complete = display === 100;

  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={active ? { opacity: 1, x: 0 } : { opacity: 0, x: -12 }}
      transition={{ ...SPRING_SOFT, delay: 0.4 + index * 0.08 }}
      className="flex items-center gap-2 px-2 py-1.5 rounded-md"
      style={{
        background: !isLocked ? "rgba(168,85,247,0.06)" : "rgba(255,255,255,0.02)",
        border: `1px solid ${!isLocked ? "rgba(168,85,247,0.18)" : "rgba(255,255,255,0.04)"}`,
        opacity: isLocked ? 0.5 : 1,
      }}
    >
      <div
        className="w-3.5 h-3.5 rounded-full flex items-center justify-center flex-shrink-0"
        style={{
          background: complete ? "#a855f7" : "rgba(255,255,255,0.05)",
          border: `1px solid ${complete ? "#a855f7" : "rgba(255,255,255,0.15)"}`,
          boxShadow: complete ? "0 0 8px rgba(168,85,247,0.6)" : "none",
          transition: "background 0.3s, box-shadow 0.3s, border-color 0.3s",
        }}
      >
        {complete && (
          <svg viewBox="0 0 10 10" className="w-2 h-2">
            <path d="M2 5 L4 7 L8 3" stroke="#fff" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </div>

      <span className="text-[9px] font-medium text-white/85 flex-1 truncate">
        {m.label}
      </span>

      <div className="w-12 h-1 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
        <motion.div
          className="h-full rounded-full"
          initial={{ width: "0%" }}
          animate={active ? { width: `${m.target}%` } : { width: "0%" }}
          transition={{ duration: 1.0, delay: 0.5 + index * 0.08, ease: [0.22, 0.9, 0.3, 1] }}
          style={{
            background: "linear-gradient(90deg, #7c3aed, #c084fc)",
            boxShadow: m.target > 0 ? "0 0 6px #a855f7" : "none",
          }}
        />
      </div>

      <span className="text-[8px] font-semibold tabular-nums text-white/55 w-7 text-right">
        {display}%
      </span>
    </motion.div>
  );
}

function MentoringVisual({ active, mx, my }: { active: boolean; mx: MotionValue<number>; my: MotionValue<number> }) {
  const reduce = useReducedMotion();

  const mid = useParallax(mx, my, 10, 7);
  const fg = useParallax(mx, my, 16, 12);

  // Internal X/Y rotation that tracks cursor in addition to card tilt — emphasized panning
  const rotX = useSpring(useTransform(my, [0, 1], [4, -4]), { stiffness: 120, damping: 20 });
  const rotY = useSpring(useTransform(mx, [0, 1], [-5, 5]), { stiffness: 120, damping: 20 });

  const lightX = useTransform(mx, [0, 1], ["30%", "70%"]);
  const lightY = useTransform(my, [0, 1], ["30%", "70%"]);

  const score = useCountUpOnce(92, active, 1.6, 0);
  const dashoffset = 251 - 251 * (score / 100);

  return (
    <motion.div
      className="absolute inset-0 px-4 pt-3 pb-3 flex gap-3"
      style={{
        rotateX: reduce ? 0 : rotX,
        rotateY: reduce ? 0 : rotY,
        transformStyle: "preserve-3d",
      }}
    >
      {/* Independent ambient highlight */}
      <motion.div
        className="absolute inset-0 pointer-events-none mix-blend-screen"
        style={{
          background: useTransform(
            [lightX, lightY] as never,
            ([lx, ly]: any) =>
              `radial-gradient(280px circle at ${lx} ${ly}, rgba(232,213,255,0.10), transparent 65%)`,
          ),
        }}
      />

      {/* LEFT: course module list */}
      <motion.div
        className="flex-1 rounded-xl overflow-hidden relative"
        style={{
          background: "rgba(20,16,32,0.6)",
          border: "1px solid rgba(168,85,247,0.20)",
          backdropFilter: "blur(8px)",
          x: mid.tx,
          y: mid.ty,
        }}
      >
        <div
          className="px-3 py-2 flex items-center justify-between border-b"
          style={{ borderColor: "rgba(168,85,247,0.15)" }}
        >
          <div className="flex items-center gap-1.5">
            <GraduationCap className="w-3 h-3 text-[#c084fc]" />
            <span className="text-[9px] uppercase tracking-wider font-semibold text-white/70">
              Editor curriculum
            </span>
          </div>
          <span className="text-[8px] uppercase tracking-wider font-semibold" style={{ color: ACCENT }}>
            Live
          </span>
        </div>

        <div className="p-2 space-y-1.5">
          {MENTOR_MODULES.map((m, i) => (
            <ModuleRow key={m.label} module={m} active={active} index={i} />
          ))}
        </div>
      </motion.div>

      {/* RIGHT: quality gauge */}
      <motion.div
        className="w-[120px] rounded-xl flex flex-col items-center justify-center relative overflow-hidden"
        style={{
          background: "linear-gradient(180deg, rgba(168,85,247,0.10), rgba(124,58,237,0.05))",
          border: "1px solid rgba(168,85,247,0.25)",
          x: fg.tx,
          y: fg.ty,
        }}
      >
        <svg viewBox="0 0 100 100" className="w-[88px] h-[88px]">
          <defs>
            <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#c084fc" />
              <stop offset="100%" stopColor="#7c3aed" />
            </linearGradient>
          </defs>
          <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="6" />
          <motion.circle
            cx="50" cy="50" r="40"
            fill="none"
            stroke="url(#gaugeGrad)"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray="251"
            initial={{ strokeDashoffset: 251 }}
            animate={active ? { strokeDashoffset: dashoffset } : { strokeDashoffset: 251 }}
            transition={{ duration: 1.6, delay: 0.6, ease: [0.22, 0.9, 0.3, 1] }}
            transform="rotate(-90 50 50)"
            style={{ filter: "drop-shadow(0 0 6px rgba(168,85,247,0.6))" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-[22px] font-extrabold text-white leading-none tabular-nums"
            style={{ textShadow: "0 0 12px rgba(168,85,247,0.7)" }}>
            {score}
          </span>
          <span className="text-[8px] uppercase tracking-wider font-semibold text-white/55 mt-1">
            Quality score
          </span>
        </div>

        <div
          className="absolute bottom-2 left-2 right-2 text-center text-[8px] uppercase tracking-wider font-semibold rounded-md py-0.5"
          style={{
            color: "#e9d5ff",
            background: "rgba(168,85,247,0.15)",
            border: "1px solid rgba(168,85,247,0.30)",
          }}
        >
          Certified
        </div>
      </motion.div>
    </motion.div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// VISUAL 3: Placed in your team — REDESIGNED hub-and-spoke org graph
// Editor at center, connected to Slack / Notion / Drive / Frame.io
// ════════════════════════════════════════════════════════════════════════════
const TEAM_TOOLS = [
  { id: "slack",  label: "Slack",    Icon: Slack,         x: 60,  y: 50  },
  { id: "notion", label: "Notion",   Icon: FileText,      x: 340, y: 50  },
  { id: "drive",  label: "Drive",    Icon: Folder,        x: 60,  y: 200 },
  { id: "frame",  label: "Frame.io", Icon: MessageSquare, x: 340, y: 200 },
];

function PlacementVisual({ active, mx, my }: { active: boolean; mx: MotionValue<number>; my: MotionValue<number> }) {
  const reduce = useReducedMotion();

  const W = 400, H = 260;
  const center = { x: W / 2, y: H / 2 };

  const bg = useParallax(mx, my, 4, 3);
  const mid = useParallax(mx, my, 8, 6);
  const fg = useParallax(mx, my, 14, 10);
  const lightX = useTransform(mx, [0, 1], ["30%", "70%"]);
  const lightY = useTransform(my, [0, 1], ["30%", "70%"]);

  const days = useCountUpOnce(14, active, 1.2, 0);

  return (
    <div className="absolute inset-0" style={{ transformStyle: "preserve-3d" }}>
      {/* BG */}
      <motion.div
        className="absolute inset-0"
        style={{ x: bg.tx, y: bg.ty, transform: "translateZ(-30px)" }}
      >
        <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid slice">
          <defs>
            <radialGradient id="placeGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(168,85,247,0.45)" />
              <stop offset="100%" stopColor="rgba(168,85,247,0)" />
            </radialGradient>
          </defs>
          <motion.ellipse
            cx={center.x} cy={center.y} rx="170" ry="110"
            fill="url(#placeGlow)"
            initial={{ opacity: 0 }}
            animate={active ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 1.4 }}
          />
          {[60, 95, 130].map((r, i) => (
            <motion.circle
              key={r}
              cx={center.x}
              cy={center.y}
              r={r}
              fill="none"
              stroke="rgba(168,85,247,0.10)"
              strokeWidth="1"
              strokeDasharray="2 5"
              initial={{ opacity: 0, scale: 0.6 }}
              animate={active ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.6 }}
              transition={{ duration: 0.9, delay: 0.2 + i * 0.12, ease: "easeOut" }}
              style={{ transformOrigin: `${center.x}px ${center.y}px` }}
            />
          ))}
        </svg>
        <motion.div
          className="absolute inset-0 pointer-events-none mix-blend-screen"
          style={{
            background: useTransform(
              [lightX, lightY] as never,
              ([lx, ly]: any) =>
                `radial-gradient(300px circle at ${lx} ${ly}, rgba(232,213,255,0.10), transparent 65%)`,
            ),
          }}
        />
      </motion.div>

      {/* MID: connection lines drawing from center to each tool */}
      <motion.div className="absolute inset-0" style={{ x: mid.tx, y: mid.ty }}>
        <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid slice">
          <defs>
            <linearGradient id="placeLine" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#a855f7" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#a855f7" stopOpacity="0.1" />
            </linearGradient>
          </defs>
          {TEAM_TOOLS.map((t, i) => {
            const d = `M ${center.x},${center.y} L ${t.x},${t.y}`;
            return (
              <g key={t.id}>
                <motion.path
                  d={d}
                  fill="none"
                  stroke="url(#placeLine)"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={active ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
                  transition={{ duration: 0.9, delay: 1.0 + i * 0.12, ease: [0.22, 0.9, 0.3, 1] }}
                />
                {active && !reduce && (
                  <circle r="2.2" fill="#e9d5ff" style={{ filter: "drop-shadow(0 0 5px #a855f7)" }}>
                    <animateMotion dur={`${2.6 + i * 0.2}s`} begin={`${2.0 + i * 0.18}s`} repeatCount="indefinite" path={d} />
                    <animate attributeName="opacity" values="0;1;1;0" dur={`${2.6 + i * 0.2}s`} begin={`${2.0 + i * 0.18}s`} repeatCount="indefinite" />
                  </circle>
                )}
              </g>
            );
          })}
        </svg>
      </motion.div>

      {/* FG */}
      <motion.div className="absolute inset-0" style={{ x: fg.tx, y: fg.ty }}>
        {TEAM_TOOLS.map((t, i) => {
          const ToolIcon = t.Icon;
          return (
            <motion.div
              key={t.id}
              className="absolute"
              style={{
                left: `${(t.x / W) * 100}%`,
                top: `${(t.y / H) * 100}%`,
                transform: "translate(-50%, -50%)",
              }}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={active ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
              transition={{ ...SPRING_OVERSHOOT, delay: 1.6 + i * 0.1 }}
            >
              <div className="flex flex-col items-center gap-1">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center backdrop-blur-md"
                  style={{
                    background: "rgba(20,16,32,0.85)",
                    border: "1px solid rgba(168,85,247,0.45)",
                    boxShadow: "0 0 14px rgba(168,85,247,0.35)",
                  }}
                >
                  <ToolIcon className="w-4 h-4 text-white" />
                </div>
                <span className="text-[8px] uppercase tracking-wider font-semibold text-white/60">
                  {t.label}
                </span>
              </div>
            </motion.div>
          );
        })}

        {/* Center editor avatar */}
        <motion.div
          className="absolute"
          style={{
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={active ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
          transition={{ ...SPRING_OVERSHOOT, delay: 0.4 }}
        >
          <div className="relative">
            {active && !reduce && (
              <span
                className="absolute inset-0 rounded-full"
                style={{
                  border: "1.5px solid rgba(168,85,247,0.55)",
                  animation: "hiw-place-pulse 2.8s ease-out infinite",
                  animationDelay: "1.4s",
                }}
              />
            )}
            <div
              className="w-[58px] h-[58px] rounded-full flex flex-col items-center justify-center relative"
              style={{
                background: "linear-gradient(135deg, #c084fc, #7c3aed)",
                boxShadow: "0 0 24px rgba(168,85,247,0.7), inset 0 0 16px rgba(255,255,255,0.15)",
              }}
            >
              <span className="text-[14px] font-extrabold text-white leading-none">ED</span>
              <span className="text-[7px] uppercase tracking-wider font-bold text-white/85 mt-0.5">
                Your editor
              </span>
            </div>
          </div>
        </motion.div>

        {/* Bottom badge */}
        <motion.div
          className="absolute left-1/2 -translate-x-1/2"
          style={{ bottom: 14 }}
          initial={{ opacity: 0, y: 8 }}
          animate={active ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
          transition={{ ...SPRING_SOFT, delay: 2.0 }}
        >
          <div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[9px] uppercase tracking-wider font-bold"
            style={{
              background: "rgba(20,16,32,0.85)",
              border: "1px solid rgba(168,85,247,0.40)",
              color: "#e9d5ff",
              boxShadow: "0 0 18px -4px rgba(168,85,247,0.6)",
            }}
          >
            <span className="text-white/55 font-semibold">Avg placement</span>
            <span className="tabular-nums text-white">{days} days</span>
            <span className="w-1 h-1 rounded-full bg-[#a855f7]" />
            <span>Dedicated, not shared</span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// Section
// ════════════════════════════════════════════════════════════════════════════
const HowItWorks = () => {
  const reduce = useReducedMotion();
  const headerRef = useRef<HTMLDivElement>(null);
  const headerInView = useInView(headerRef, { once: true, margin: "-20% 0%" });

  return (
    <section
      id="how-it-works"
      className="relative py-28 overflow-hidden"
      style={{ background: "#09090f" }}
    >
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2.4, ease: "easeOut" }}
      >
        <motion.div
          className="absolute -top-20 right-[10%] w-[520px] h-[520px] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(168,85,247,0.18) 0%, transparent 65%)",
            filter: "blur(40px)",
          }}
          animate={reduce ? undefined : { x: [0, -60, 20, 0], y: [0, 30, -10, 0] }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-[40%] left-[5%] w-[480px] h-[480px] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(124,58,237,0.16) 0%, transparent 65%)",
            filter: "blur(40px)",
          }}
          animate={reduce ? undefined : { x: [0, 50, -30, 0], y: [0, -20, 40, 0] }}
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
      <div className="absolute inset-0 pointer-events-none hiw-grain-bg" />

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <div ref={headerRef} className="text-center mb-16">
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
            How it works
          </motion.div>

          <h2 className="text-3xl md:text-5xl font-extrabold text-white leading-tight mb-5">
            <motion.span
              className="inline-block mr-[0.25em]"
              initial={{ opacity: 0, y: 18 }}
              animate={headerInView ? { opacity: 1, y: 0 } : {}}
              transition={{ ...SPRING_SOFT, delay: 0.25 }}
            >
              An
            </motion.span>
            <motion.span
              className="inline-block mr-[0.25em]"
              style={{
                backgroundImage: "linear-gradient(135deg, #a855f7, #c084fc, #e9d5ff)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                WebkitTextFillColor: "transparent",
                color: "transparent",
              }}
              initial={{ opacity: 0, y: 18 }}
              animate={headerInView ? { opacity: 1, y: 0 } : {}}
              transition={{ ...SPRING_SOFT, delay: 0.4 }}
            >
              in-house
            </motion.span>
            <motion.span
              className="inline-block mr-[0.25em]"
              initial={{ opacity: 0, y: 18 }}
              animate={headerInView ? { opacity: 1, y: 0 } : {}}
              transition={{ ...SPRING_SOFT, delay: 0.55 }}
            >
              experience
            </motion.span>
          </h2>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.85 }}
            className="text-white/50 max-w-2xl mx-auto text-base leading-relaxed"
          >
            Your editor is yours alone. Not shared, not rotating, not freelancing on the side. We hire, train and place them inside your team like a contractor or employee. They learn your brand, sit in your channels, and grow with you. The only difference is we handle the recruiting, the mentoring and the ongoing performance management for you.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <StepCard
            stepNumber="01"
            title="AI-Powered Hiring"
            description="We screen 200+ video editors every week with our own AI-driven evaluation. Only the top 1% make it to the interview stage. You get the best of the best, matched to your brand."
            icon={Brain}
            visual={({ active, mx, my }) => <HiringVisual active={active} mx={mx} my={my} />}
            variant="left"
            delay={0}
          />
          <StepCard
            stepNumber="02"
            title="Editor Mentoring System"
            description="Every editor goes through our masterclass. Hook engineering, hold curves, brand voice, performance review. They keep training while they work for you, so quality only goes up."
            icon={GraduationCap}
            visual={({ active, mx, my }) => <MentoringVisual active={active} mx={mx} my={my} />}
            variant="center"
            delay={0.15}
          />
          <StepCard
            stepNumber="03"
            title="Placed in your team"
            description="Your editor gets dropped into your Slack, your Notion, your Drive and Frame.io. Dedicated to your brand only, like an in-house hire. We stay in the background managing performance and growth."
            icon={UsersRound}
            visual={({ active, mx, my }) => <PlacementVisual active={active} mx={mx} my={my} />}
            variant="right"
            delay={0.3}
          />
        </div>
      </div>

      <style>{`
        .hiw-grain-bg {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
          background-size: 220px 220px;
          mix-blend-mode: overlay;
          opacity: 0.05;
        }
        .hiw-grain-purple {
          background-image:
            url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='pn'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0.66  0 0 0 0 0.33  0 0 0 0 0.97  0 0 0 0.55 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23pn)'/%3E%3C/svg%3E");
          background-size: 180px 180px;
          mix-blend-mode: soft-light;
          opacity: 0.35;
        }

        @keyframes hiw-place-pulse {
          0%   { transform: scale(1);   opacity: 0.7; }
          80%  { transform: scale(2.0); opacity: 0;   }
          100% { transform: scale(2.0); opacity: 0;   }
        }
      `}</style>
    </section>
  );
};

export default HowItWorks;
