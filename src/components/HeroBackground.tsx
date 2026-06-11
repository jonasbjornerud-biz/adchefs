const HeroBackground = () => {
  return (
    <div
      aria-hidden
      className="absolute inset-0 overflow-hidden pointer-events-none z-0"
    >
      <style>{`
        /* Top-right ring — breathes from center */
        @keyframes ringBreatheTR {
          from {
            transform: translate(0, 0) scale(1);
            opacity: 1;
          }
          to {
            transform: translate(-20px, 14px) scale(1.035);
            opacity: 1.08;
          }
        }
        .hero-ring-tr {
          transform-origin: center center;
          transform-box: fill-box;
          animation: ringBreatheTR 14s ease-in-out infinite alternate;
        }
        /* Bottom-left arc — slower, larger drift, offset phase */
        @keyframes arcBreatheBL {
          from {
            transform: translate(0, 0) scale(1);
            opacity: 1;
          }
          to {
            transform: translate(22px, -20px) scale(1.05);
            opacity: 1.08;
          }
        }
        .hero-arc-bl {
          transform-origin: center center;
          transform-box: fill-box;
          animation: arcBreatheBL 19s ease-in-out infinite alternate;
          animation-delay: -7s;
        }
        @media (prefers-reduced-motion: reduce) {
          .hero-ring-tr, .hero-arc-bl { animation: none; }
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

      {/* TOP-RIGHT ring — original watermark, masked to fade above the section's bottom */}
      <div
        className="absolute inset-0"
        style={{
          WebkitMaskImage:
            "linear-gradient(to bottom, #000 0, #000 calc(100% - 280px), transparent 100%)",
          maskImage:
            "linear-gradient(to bottom, #000 0, #000 calc(100% - 280px), transparent 100%)",
        }}
      >
        <svg
          className="hero-ring-tr absolute"
          style={{
            right: "-650px",
            top: "-600px",
            width: "1400px",
            height: "1000px",
            filter: "blur(16px)",
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
      </div>

      {/* BOTTOM-LEFT arc — quieter, ~220deg of a very large ellipse, ends dissolved by mask */}
      <div
        className="absolute inset-0"
        style={{
          WebkitMaskImage:
            "radial-gradient(ellipse 70% 60% at 20% 90%, #000 40%, transparent 80%)",
          maskImage:
            "radial-gradient(ellipse 70% 60% at 20% 90%, #000 40%, transparent 80%)",
        }}
      >
        <svg
          className="hero-arc-bl absolute"
          style={{
            left: "-500px",
            bottom: "-700px",
            width: "1800px",
            height: "1200px",
            filter: "blur(14px)",
            overflow: "visible",
            opacity: 0.85,
          }}
          viewBox="0 0 1800 1200"
          preserveAspectRatio="none"
        >
          {/* Open arc: ~220deg of an ellipse rx=820 ry=520, centered at (900,600).
              Path traces from angle 200deg to 60deg going the long way (220deg). */}
          <g transform="rotate(-8 900 600)">
            <path
              d="M 129.4 422.2 A 820 520 0 1 1 1310 1050.2"
              fill="none"
              stroke="#DDEFF9"
              strokeWidth="100"
              strokeLinecap="round"
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
