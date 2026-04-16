import { useEffect, useState } from "react";
import { Sparkles, Brain, GraduationCap, UsersRound } from "lucide-react";

const ACCENT = "#a855f7";

// ────────────────────────────────────────────────────────────────────────────
// Step card shell (matches EditorEdge FeatureCard)
// ────────────────────────────────────────────────────────────────────────────
function StepCard({
  stepNumber,
  title,
  description,
  icon: Icon,
  visual,
  delay = 0,
}: {
  stepNumber: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  visual: React.ReactNode;
  delay?: number;
}) {
  return (
    <div
      className="hiw-card group relative overflow-hidden rounded-3xl"
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
        className="absolute inset-x-0 -bottom-32 h-64 pointer-events-none hiw-horizon"
        style={{
          background:
            "radial-gradient(ellipse 60% 100% at 50% 100%, rgba(168,85,247,0.40) 0%, rgba(168,85,247,0.10) 35%, transparent 70%)",
          filter: "blur(20px)",
        }}
      />

      {/* Visual */}
      <div className="relative h-[260px] overflow-hidden">
        {visual}
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
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// VISUAL 1: AI-Powered Hiring — funnel of candidates filtered to top 1%
// ════════════════════════════════════════════════════════════════════════════
function HiringVisual() {
  const [scanIdx, setScanIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setScanIdx((i) => (i + 1) % 6), 1400);
    return () => clearInterval(t);
  }, []);

  const W = 400, H = 260;
  // 5 columns × 4 rows of candidates, plus 1 winner at right
  const cols = 5;
  const rows = 4;
  const startX = 40;
  const startY = 50;
  const spacingX = 38;
  const spacingY = 40;
  const winnerX = 340;
  const winnerY = 130;

  return (
    <div className="absolute inset-0">
      <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid slice">
        <defs>
          <radialGradient id="hiringGlow" cx="80%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(168,85,247,0.45)" />
            <stop offset="100%" stopColor="rgba(168,85,247,0)" />
          </radialGradient>
          <linearGradient id="winnerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#c084fc" />
            <stop offset="100%" stopColor="#7c3aed" />
          </linearGradient>
        </defs>

        <ellipse cx={winnerX} cy={winnerY} rx="80" ry="100" fill="url(#hiringGlow)" />

        {/* Candidate grid */}
        {Array.from({ length: rows }).map((_, r) =>
          Array.from({ length: cols }).map((_, c) => {
            const cx = startX + c * spacingX;
            const cy = startY + r * spacingY;
            const idx = r * cols + c;
            const passed = idx === 12; // arbitrary "winner" in grid
            return (
              <g key={`${r}-${c}`}>
                <circle
                  cx={cx}
                  cy={cy}
                  r="9"
                  fill={passed ? "rgba(168,85,247,0.20)" : "rgba(255,255,255,0.04)"}
                  stroke={passed ? "rgba(168,85,247,0.7)" : "rgba(255,255,255,0.10)"}
                  strokeWidth="1"
                >
                  {!passed && (
                    <animate
                      attributeName="opacity"
                      values="1;0.35;1"
                      dur="3s"
                      begin={`${(idx % 5) * 0.18}s`}
                      repeatCount="indefinite"
                    />
                  )}
                </circle>
                {/* simple person icon */}
                <circle cx={cx} cy={cy - 1.5} r="2.5" fill={passed ? "#fff" : "rgba(255,255,255,0.45)"} />
                <path
                  d={`M${cx - 4},${cy + 5} Q${cx},${cy + 1} ${cx + 4},${cy + 5}`}
                  stroke={passed ? "#fff" : "rgba(255,255,255,0.45)"}
                  strokeWidth="1.4"
                  fill="none"
                  strokeLinecap="round"
                />
                {/* X for failed */}
                {!passed && (
                  <g opacity="0.45">
                    <line
                      x1={cx + 5}
                      y1={cy - 5}
                      x2={cx + 9}
                      y2={cy - 1}
                      stroke="#f87171"
                      strokeWidth="1.2"
                      strokeLinecap="round"
                    />
                    <line
                      x1={cx + 9}
                      y1={cy - 5}
                      x2={cx + 5}
                      y2={cy - 1}
                      stroke="#f87171"
                      strokeWidth="1.2"
                      strokeLinecap="round"
                    />
                  </g>
                )}
              </g>
            );
          })
        )}

        {/* Sweeping AI scan column */}
        {Array.from({ length: cols }).map((_, c) => {
          const x = startX + c * spacingX;
          const isActive = c === scanIdx % cols;
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

        {/* Connecting line to winner */}
        <path
          d={`M${startX + (cols - 1) * spacingX + 12},${startY + 1.5 * spacingY} Q${winnerX - 60},${winnerY - 30} ${winnerX - 24},${winnerY}`}
          fill="none"
          stroke="rgba(168,85,247,0.5)"
          strokeWidth="1.5"
          strokeDasharray="3 4"
        >
          <animate attributeName="stroke-dashoffset" values="0;-14" dur="1.8s" repeatCount="indefinite" />
        </path>

        {/* Winner avatar */}
        <g style={{ transformOrigin: `${winnerX}px ${winnerY}px` }} className="hiw-breath">
          <circle cx={winnerX} cy={winnerY} r="28" fill="url(#winnerGrad)"
            style={{ filter: "drop-shadow(0 0 18px rgba(168,85,247,0.7))" }} />
          <circle cx={winnerX} cy={winnerY - 5} r="7" fill="#fff" opacity="0.95" />
          <path
            d={`M${winnerX - 11},${winnerY + 13} Q${winnerX},${winnerY + 4} ${winnerX + 11},${winnerY + 13}`}
            stroke="#fff"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
            opacity="0.95"
          />
        </g>

        {/* Pulse ring around winner */}
        <circle cx={winnerX} cy={winnerY} r="28" fill="none" stroke="rgba(168,85,247,0.55)" strokeWidth="1.2">
          <animate attributeName="r" values="28;58" dur="2.4s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.7;0" dur="2.4s" repeatCount="indefinite" />
        </circle>

        {/* Top label */}
        <g>
          <rect
            x="20" y="14"
            width="92" height="22"
            rx="11"
            fill="rgba(20,16,32,0.85)"
            stroke="rgba(168,85,247,0.30)"
            strokeWidth="1"
          />
          <text x="66" y="29" textAnchor="middle"
            fontSize="10" fontFamily="ui-sans-serif, system-ui, sans-serif"
            fontWeight="700" fill="rgba(255,255,255,0.85)">
            200+ screened
          </text>
        </g>

        {/* Bottom label near winner */}
        <g>
          <rect
            x={winnerX - 38} y={winnerY + 48}
            width="76" height="22"
            rx="11"
            fill="url(#winnerGrad)"
            style={{ filter: "drop-shadow(0 0 12px rgba(168,85,247,0.6))" }}
          />
          <text x={winnerX} y={winnerY + 63} textAnchor="middle"
            fontSize="10" fontFamily="ui-sans-serif, system-ui, sans-serif"
            fontWeight="800" fill="#fff" letterSpacing="0.5">
            TOP 1%
          </text>
        </g>
      </svg>

      {/* Live AI badge */}
      <div className="absolute right-3 top-3 inline-flex items-center gap-1.5 text-[9px] font-semibold uppercase tracking-wider text-[#a855f7]">
        <span className="relative flex w-1.5 h-1.5">
          <span className="absolute inset-0 rounded-full animate-ping bg-[#a855f7] opacity-60" />
          <span className="relative w-1.5 h-1.5 rounded-full bg-[#a855f7]"
            style={{ boxShadow: "0 0 8px #a855f7" }} />
        </span>
        AI scanning
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// VISUAL 2: Editor Mentoring System — modules completing on a course card
// ════════════════════════════════════════════════════════════════════════════
const MENTOR_MODULES = [
  { label: "Hook engineering",  unlocked: true,  progress: 100 },
  { label: "Hold curve craft",  unlocked: true,  progress: 100 },
  { label: "Pacing & rhythm",   unlocked: true,  progress: 78  },
  { label: "Brand voice",       unlocked: true,  progress: 42  },
  { label: "Sound design",      unlocked: false, progress: 0   },
  { label: "Performance review", unlocked: false, progress: 0   },
];

function MentoringVisual() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setProgress((p) => (p >= 100 ? 0 : p + 2));
    }, 80);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="absolute inset-0 px-4 pt-3 pb-3 flex gap-3">
      {/* Left: course module list */}
      <div
        className="flex-1 rounded-xl overflow-hidden relative"
        style={{
          background: "rgba(20,16,32,0.6)",
          border: "1px solid rgba(168,85,247,0.20)",
          backdropFilter: "blur(8px)",
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
          {MENTOR_MODULES.map((m, i) => {
            const animatedProgress = m.progress === 100
              ? 100
              : m.progress > 0
              ? Math.min(m.progress + (Math.sin((progress / 50 + i) * Math.PI) * 4), 100)
              : 0;
            return (
              <div
                key={m.label}
                className="flex items-center gap-2 px-2 py-1.5 rounded-md"
                style={{
                  background: m.unlocked ? "rgba(168,85,247,0.06)" : "rgba(255,255,255,0.02)",
                  border: `1px solid ${m.unlocked ? "rgba(168,85,247,0.18)" : "rgba(255,255,255,0.04)"}`,
                  opacity: m.unlocked ? 1 : 0.5,
                }}
              >
                {/* Status dot / check */}
                <div
                  className="w-3.5 h-3.5 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{
                    background: m.progress === 100 ? "#a855f7" : "rgba(255,255,255,0.05)",
                    border: `1px solid ${m.progress === 100 ? "#a855f7" : "rgba(255,255,255,0.15)"}`,
                    boxShadow: m.progress === 100 ? "0 0 8px rgba(168,85,247,0.6)" : "none",
                  }}
                >
                  {m.progress === 100 && (
                    <svg viewBox="0 0 10 10" className="w-2 h-2">
                      <path d="M2 5 L4 7 L8 3" stroke="#fff" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>

                {/* Label */}
                <span className="text-[9px] font-medium text-white/85 flex-1 truncate">
                  {m.label}
                </span>

                {/* Progress bar */}
                <div className="w-12 h-1 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${animatedProgress}%`,
                      background: "linear-gradient(90deg, #7c3aed, #c084fc)",
                      boxShadow: animatedProgress > 0 ? "0 0 6px #a855f7" : "none",
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right: quality gauge */}
      <div
        className="w-[120px] rounded-xl flex flex-col items-center justify-center relative overflow-hidden"
        style={{
          background: "linear-gradient(180deg, rgba(168,85,247,0.10), rgba(124,58,237,0.05))",
          border: "1px solid rgba(168,85,247,0.25)",
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
          <circle
            cx="50" cy="50" r="40"
            fill="none"
            stroke="url(#gaugeGrad)"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray="251"
            strokeDashoffset={251 - (251 * 0.92)}
            transform="rotate(-90 50 50)"
            style={{ filter: "drop-shadow(0 0 6px rgba(168,85,247,0.6))" }}
          >
            <animate
              attributeName="stroke-dashoffset"
              values={`${251 - (251 * 0.85)};${251 - (251 * 0.96)};${251 - (251 * 0.85)}`}
              dur="3.6s"
              repeatCount="indefinite"
            />
          </circle>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-[22px] font-extrabold text-white leading-none tabular-nums"
            style={{ textShadow: "0 0 12px rgba(168,85,247,0.7)" }}>
            A+
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
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// VISUAL 3: Placed in your team — editor slots into your existing team
// ════════════════════════════════════════════════════════════════════════════
const TEAM_MEMBERS = [
  { initials: "AM", role: "Marketing", color: "#c084fc" },
  { initials: "JR", role: "Brand",     color: "#a855f7" },
  { initials: "SK", role: "Founder",   color: "#d8b4fe" },
];

function PlacementVisual() {
  const [phase, setPhase] = useState<"approaching" | "joined">("approaching");

  useEffect(() => {
    const t = setInterval(() => {
      setPhase((p) => (p === "approaching" ? "joined" : "approaching"));
    }, 2400);
    return () => clearInterval(t);
  }, []);

  const W = 400, H = 260;

  return (
    <div className="absolute inset-0">
      <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid slice">
        <defs>
          <radialGradient id="teamGlow" cx="50%" cy="55%" r="50%">
            <stop offset="0%" stopColor="rgba(168,85,247,0.45)" />
            <stop offset="100%" stopColor="rgba(168,85,247,0)" />
          </radialGradient>
          <linearGradient id="newEditorGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#c084fc" />
            <stop offset="100%" stopColor="#7c3aed" />
          </linearGradient>
        </defs>

        <ellipse cx={W / 2} cy={H / 2 + 4} rx="160" ry="100" fill="url(#teamGlow)" />

        {/* "Your team" container outline */}
        <rect
          x="60"
          y="55"
          width="280"
          height="130"
          rx="18"
          fill="rgba(20,16,32,0.4)"
          stroke="rgba(168,85,247,0.30)"
          strokeWidth="1"
          strokeDasharray="4 5"
        />
        <text x={W / 2} y="48" textAnchor="middle"
          fontSize="9" fontFamily="ui-sans-serif, system-ui, sans-serif"
          fontWeight="700" fill="rgba(255,255,255,0.55)" letterSpacing="1">
          YOUR TEAM
        </text>

        {/* Existing team members (3 circles inside the box, left side) */}
        {TEAM_MEMBERS.map((m, i) => {
          const cx = 110 + i * 60;
          const cy = 120;
          return (
            <g key={i}>
              <circle cx={cx} cy={cy} r="22" fill="rgba(20,16,32,0.85)"
                stroke={m.color} strokeWidth="1.5"
                style={{ filter: `drop-shadow(0 0 8px ${m.color}55)` }} />
              <text x={cx} y={cy + 4} textAnchor="middle"
                fontSize="11" fontFamily="ui-sans-serif, system-ui, sans-serif"
                fontWeight="800" fill="#fff">
                {m.initials}
              </text>
              <text x={cx} y={cy + 38} textAnchor="middle"
                fontSize="8" fontFamily="ui-sans-serif, system-ui, sans-serif"
                fontWeight="600" fill="rgba(255,255,255,0.45)" letterSpacing="0.5">
                {m.role}
              </text>
            </g>
          );
        })}

        {/* Empty slot (where editor goes) */}
        <g style={{ transition: "opacity 0.6s ease", opacity: phase === "joined" ? 0 : 1 }}>
          <circle cx="290" cy="120" r="22" fill="none"
            stroke="rgba(168,85,247,0.45)" strokeWidth="1.5"
            strokeDasharray="3 4" />
          <text x="290" y="125" textAnchor="middle"
            fontSize="16" fontFamily="ui-sans-serif, system-ui, sans-serif"
            fontWeight="700" fill="rgba(168,85,247,0.55)">
            +
          </text>
        </g>

        {/* Connecting line (always there, dashed) */}
        <line
          x1={phase === "joined" ? 290 : 360}
          y1={phase === "joined" ? 120 : 120}
          x2="290"
          y2="120"
          stroke="rgba(168,85,247,0.45)"
          strokeWidth="1.5"
          strokeDasharray="3 3"
          style={{ transition: "x1 1.4s cubic-bezier(.4,0,.2,1)", opacity: phase === "approaching" ? 1 : 0 }}
        />

        {/* New editor avatar — slides from right into the slot */}
        <g
          style={{
            transition: "transform 1.2s cubic-bezier(.4,0,.2,1)",
            transform: phase === "joined" ? "translate(0,0)" : "translate(80px,0)",
          }}
        >
          <circle cx="290" cy="120" r="24" fill="url(#newEditorGrad)"
            style={{ filter: "drop-shadow(0 0 14px rgba(168,85,247,0.8))" }} />
          <text x="290" y="124" textAnchor="middle"
            fontSize="11" fontFamily="ui-sans-serif, system-ui, sans-serif"
            fontWeight="800" fill="#fff">
            ED
          </text>
          <text x="290" y="158" textAnchor="middle"
            fontSize="8" fontFamily="ui-sans-serif, system-ui, sans-serif"
            fontWeight="700" fill="#e9d5ff" letterSpacing="0.5">
            Your editor
          </text>

          {/* Pulse ring when joined */}
          {phase === "joined" && (
            <circle cx="290" cy="120" r="24" fill="none" stroke="rgba(168,85,247,0.6)" strokeWidth="1.2">
              <animate attributeName="r" values="24;48" dur="1.6s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.7;0" dur="1.6s" repeatCount="indefinite" />
            </circle>
          )}
        </g>

        {/* Bottom badge */}
        <g>
          <rect x={W / 2 - 76} y="200" width="152" height="24" rx="12"
            fill="rgba(20,16,32,0.85)"
            stroke="rgba(168,85,247,0.40)"
            strokeWidth="1" />
          <text x={W / 2} y="216" textAnchor="middle"
            fontSize="10" fontFamily="ui-sans-serif, system-ui, sans-serif"
            fontWeight="700" fill="#e9d5ff" letterSpacing="0.5">
            DEDICATED · NOT SHARED
          </text>
        </g>
      </svg>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// Section
// ════════════════════════════════════════════════════════════════════════════
const HowItWorks = () => {
  return (
    <section
      id="how-it-works"
      className="relative py-28 overflow-hidden -mx-6 md:-mx-0"
      style={{ background: "#09090f" }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(124,58,237,0.14) 0%, transparent 70%)",
        }}
      />
      <div className="absolute inset-0 pointer-events-none hiw-grain-bg" />

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
            How it works
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold text-white leading-tight mb-5">
            An{" "}
            <span
              style={{
                background:
                  "linear-gradient(135deg, #a855f7, #c084fc, #e9d5ff)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              in-house
            </span>{" "}
            experience
          </h2>
          <p className="text-white/50 max-w-2xl mx-auto text-base leading-relaxed">
            Your editor is yours alone. Not shared, not rotating, not freelancing on the side. We hire, train and place them inside your team like a contractor or employee. They learn your brand, sit in your channels, and grow with you. The only difference is we handle the recruiting, the mentoring and the ongoing performance management for you.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <StepCard
            stepNumber="01"
            title="AI-Powered Hiring"
            description="We screen 200+ video editors every week with our own AI-driven evaluation. Only the top 1% make it to the interview stage. You get the best of the best, matched to your brand."
            icon={Brain}
            visual={<HiringVisual />}
            delay={0}
          />
          <StepCard
            stepNumber="02"
            title="Editor Mentoring System"
            description="Every editor goes through our masterclass. Hook engineering, hold curves, brand voice, performance review. They keep training while they work for you, so quality only goes up."
            icon={GraduationCap}
            visual={<MentoringVisual />}
            delay={0.1}
          />
          <StepCard
            stepNumber="03"
            title="Placed in your team"
            description="Your editor gets dropped into your Slack, your Notion, your workflow. Dedicated to your brand only, like an in-house hire. We stay in the background managing performance and growth."
            icon={UsersRound}
            visual={<PlacementVisual />}
            delay={0.2}
          />
        </div>
      </div>

      <style>{`
        .hiw-card {
          opacity: 0;
          transform: translateY(20px);
          animation: hiw-card-in 1s cubic-bezier(.2,.7,.2,1) forwards;
          transition: transform .5s cubic-bezier(.2,.7,.2,1), border-color .5s ease, box-shadow .5s ease;
        }
        @keyframes hiw-card-in { to { opacity: 1; transform: translateY(0); } }
        .hiw-card:hover {
          transform: translateY(-4px);
          border-color: rgba(168,85,247,0.30) !important;
          box-shadow:
            0 1px 0 rgba(255,255,255,0.10) inset,
            0 0 0 1px rgba(168,85,247,0.20) inset,
            0 30px 80px -20px rgba(168,85,247,0.25),
            0 0 60px -10px rgba(168,85,247,0.18) !important;
        }
        .hiw-horizon { opacity: 0.55; transition: opacity 0.8s ease; }
        .hiw-card:hover .hiw-horizon { opacity: 0.95; }

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

        @keyframes hiw-breath {
          0%, 100% { transform: scale(1); }
          50%      { transform: scale(1.06); }
        }
        .hiw-breath { animation: hiw-breath 3s ease-in-out infinite; }

        @media (prefers-reduced-motion: reduce) {
          .hiw-card, .hiw-breath { animation: none !important; }
        }
      `}</style>
    </section>
  );
};

export default HowItWorks;
