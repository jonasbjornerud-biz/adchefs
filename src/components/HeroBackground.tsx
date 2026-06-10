const HeroBackground = () => {
  return (
    <div
      aria-hidden
      className="absolute inset-0 overflow-hidden pointer-events-none z-0"
    >
      <style>{`
        @keyframes ringDrift1 {
          from { transform: translate(0, 0) rotate(-4deg); }
          to   { transform: translate(30px, -20px) rotate(4deg); }
        }
        @keyframes ringDrift2 {
          from { transform: translate(0, 0) rotate(4deg); }
          to   { transform: translate(-30px, 20px) rotate(-4deg); }
        }
        .hero-ring-1 {
          transform-origin: center center;
          animation: ringDrift1 50s ease-in-out infinite alternate;
        }
        .hero-ring-2 {
          transform-origin: center center;
          animation: ringDrift2 65s ease-in-out infinite alternate;
        }
        @media (prefers-reduced-motion: reduce) {
          .hero-ring-1,
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

      {/* Ring 1 — sweeps up through left third from beyond bottom-left */}
      <svg
        className="hero-ring-1 absolute"
        style={{
          left: "-700px",
          bottom: "-650px",
          width: "1600px",
          height: "1100px",
          filter: "blur(10px)",
          overflow: "visible",
        }}
        viewBox="0 0 1600 1100"
        preserveAspectRatio="none"
      >
        <g transform="rotate(-15 800 550)">
          <ellipse
            cx="800"
            cy="550"
            rx="720"
            ry="470"
            fill="none"
            stroke="#CDE9F8"
            strokeWidth="150"
          />
        </g>
      </svg>

      {/* Ring 2 — curves down through right side from beyond top-right */}
      <svg
        className="hero-ring-2 absolute"
        style={{
          right: "-650px",
          top: "-600px",
          width: "1400px",
          height: "1000px",
          filter: "blur(10px)",
          overflow: "visible",
        }}
        viewBox="0 0 1400 1000"
        preserveAspectRatio="none"
      >
        <g transform="rotate(20 700 500)">
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
