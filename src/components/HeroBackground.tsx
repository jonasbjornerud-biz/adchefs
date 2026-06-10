const HeroBackground = () => {
  return (
    <div
      aria-hidden
      className="absolute inset-0 overflow-hidden pointer-events-none z-0"
    >
      <style>{`
        @keyframes arcSpin    { from { transform: rotate(0deg);  } to { transform: rotate(360deg);  } }
        @keyframes arcSpinRev { from { transform: rotate(0deg);  } to { transform: rotate(-360deg); } }
        .arc-1 { transform-box: view-box; transform-origin: 1750px -100px; animation: arcSpin    200s linear infinite; }
        .arc-2 { transform-box: view-box; transform-origin: 1400px 950px;  animation: arcSpinRev 320s linear infinite; }
        .arc-3 { transform-box: view-box; transform-origin: -200px 700px;  animation: arcSpin    260s linear infinite; }
        @media (prefers-reduced-motion: reduce) {
          .arc-1, .arc-2, .arc-3 { animation: none; }
        }
      `}</style>

      {/* Base static gradient (top-right wash) */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 100% 0%, rgba(158, 216, 245, 0.10) 0%, transparent 60%)",
        }}
      />

      {/* Asymmetric arc composition */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 1600 900"
        preserveAspectRatio="xMidYMid slice"
        style={{ pointerEvents: "none", zIndex: 1 }}
      >
        {/* Arc 1 — anchor: r=900, ~200° sweep, center off top-right */}
        <g className="arc-1">
          <circle
            cx="1750"
            cy="-100"
            r="900"
            fill="none"
            stroke="#9ED8F5"
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0.5"
            pathLength="360"
            strokeDasharray="200 360"
            strokeDashoffset="90"
          />
        </g>

        {/* Arc 2 — heavy short: r=500, ~70° sweep, center below bottom-right */}
        <g className="arc-2">
          <circle
            cx="1400"
            cy="950"
            r="500"
            fill="none"
            stroke="#9ED8F5"
            strokeWidth="40"
            opacity="0.07"
            pathLength="360"
            strokeDasharray="70 360"
            strokeDashoffset="220"
            style={{ filter: "blur(3px)" }}
          />
        </g>

        {/* Arc 3 — ink whisper: r=650, ~140° sweep, center off left */}
        <g className="arc-3">
          <circle
            cx="-200"
            cy="700"
            r="650"
            fill="none"
            stroke="#1A1A1A"
            strokeWidth="1"
            opacity="0.07"
            pathLength="360"
            strokeDasharray="140 360"
            strokeDashoffset="320"
          />
        </g>
      </svg>

      {/* Static film grain overlay (unchanged) */}
      <div
        className="absolute inset-0"
        style={{
          opacity: 0.045,
          mixBlendMode: "overlay",
          backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.6 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>")`,
          backgroundRepeat: "repeat",
          backgroundSize: "240px 240px",
        }}
      />
    </div>
  );
};

export default HeroBackground;