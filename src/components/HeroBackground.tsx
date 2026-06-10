const HeroBackground = () => {
  // 6×6 tile with two 1px dots (ink + accent), URL-encoded inline SVG.
  // Tile size chosen to avoid moiré at 1280–1920px widths.
  const weaveTile =
    "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='6' height='6'><rect x='0' y='0' width='1' height='1' fill='%231A1A1A' fill-opacity='0.06'/><rect x='3' y='3' width='1' height='1' fill='%239ED8F5' fill-opacity='0.04'/></svg>\")";

  return (
    <div
      aria-hidden
      className="absolute inset-0 overflow-hidden pointer-events-none z-0"
    >
      <style>{`
        @keyframes heroGradientDrift {
          from { background-position: 100% 0%;  }
          to   { background-position: 92%  8%;  }
        }
        .hero-base-gradient {
          background: radial-gradient(circle at 100% 0%, rgba(158, 216, 245, 0.12) 0%, transparent 60%);
          background-size: 100% 100%;
          background-repeat: no-repeat;
          animation: heroGradientDrift 40s ease-in-out infinite alternate;
        }
        @media (prefers-reduced-motion: reduce) {
          .hero-base-gradient { animation: none; }
        }
      `}</style>

      {/* Base radial gradient (gentle drift) */}
      <div className="hero-base-gradient absolute inset-0" />

      {/* Fine paper/linen weave texture */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: weaveTile,
          backgroundRepeat: "repeat",
          backgroundSize: "6px 6px",
        }}
      />

      {/* Static film grain overlay (unchanged) */}
      <div
        className="absolute inset-0"
        style={{
          opacity: 0.05,
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