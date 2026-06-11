const HeroBackground = () => {
  return (
    <div
      aria-hidden
      className="absolute inset-0 overflow-hidden pointer-events-none z-0"
    >
      <style>{`
        @keyframes ringDrift2 {
          from { transform: translate(0, 0) rotate(4deg); }
          to   { transform: translate(-30px, 20px) rotate(-4deg); }
        }
        .hero-ring-2 {
          transform-origin: center center;
          animation: ringDrift2 65s ease-in-out infinite alternate;
        }
        @media (prefers-reduced-motion: reduce) {
          .hero-ring-2 {
            animation: none;
          }
        }
      `}</style>

      {/* Base soft linear gradient — top-right blue tint to Paper */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom left, #E8F4FB 0%, #F7F6F3 65%)",
        }}
      />

      {/* Soft corner wash — lower-left tint to rebalance empty space */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at bottom left, rgba(232, 244, 251, 0.5) 0%, transparent 50%)",
        }}
      />

      {/* Ring layer — anchored to bottom-left, softly faded at top so it doesn't
          fight the headline */}
      <div
        className="absolute inset-0"
        style={{
          WebkitMaskImage:
            "linear-gradient(to top, #000 0, #000 calc(100% - 220px), transparent 100%)",
          maskImage:
            "linear-gradient(to top, #000 0, #000 calc(100% - 220px), transparent 100%)",
        }}
      >
        {/* Ring 2 — sweeps through the lower-left corner, partially off-canvas */}
        <svg
          className="hero-ring-2 absolute"
          style={{
            left: "-700px",
            bottom: "-550px",
            width: "1400px",
            height: "1000px",
            filter: "blur(16px)",
            overflow: "visible",
          }}
          viewBox="0 0 1400 1000"
          preserveAspectRatio="none"
        >
          <g transform="rotate(-15 700 500)">
            <ellipse
              cx="700"
              cy="500"
              rx="620"
              ry="420"
              fill="none"
              stroke="#CDE9F8"
              strokeWidth="140"
            />
          </g>
        </svg>
      </div>

      {/* Static film grain overlay */}
      <div
        className="absolute inset-0"
        style={{
          opacity: 0.04,
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
