const HeroBackground = () => {
  return (
    <div
      aria-hidden
      className="absolute inset-0 overflow-hidden pointer-events-none z-0"
    >
      <style>{`
        @keyframes orbDrift1 {
          from { transform: translate(0, 0); }
          to   { transform: translate(40px, 30px); }
        }
        @keyframes orbDrift2 {
          from { transform: translate(0, 0); }
          to   { transform: translate(-30px, 50px); }
        }
        @keyframes orbDrift3 {
          from { transform: translate(0, 0); }
          to   { transform: translate(50px, -40px); }
        }
        .hero-orb-1 {
          animation: orbDrift1 60s ease-in-out infinite alternate;
          animation-delay: 0s;
        }
        .hero-orb-2 {
          animation: orbDrift2 80s ease-in-out infinite alternate;
          animation-delay: -30s;
        }
        .hero-orb-3 {
          animation: orbDrift3 50s ease-in-out infinite alternate;
          animation-delay: -15s;
        }
        @media (prefers-reduced-motion: reduce) {
          .hero-orb-1,
          .hero-orb-2,
          .hero-orb-3 {
            animation: none;
          }
        }
      `}</style>

      {/* Orb 1 — top right */}
      <div
        className="hero-orb-1 absolute"
        style={{
          top: "-150px",
          right: "-200px",
          width: "1000px",
          height: "800px",
          background:
            "radial-gradient(ellipse, rgba(158, 216, 245, 0.20) 0%, transparent 65%)",
          filter: "blur(70px)",
        }}
      />

      {/* Orb 2 — left of center */}
      <div
        className="hero-orb-2 absolute"
        style={{
          top: "30%",
          left: "-250px",
          width: "800px",
          height: "700px",
          background:
            "radial-gradient(ellipse, rgba(158, 216, 245, 0.12) 0%, transparent 65%)",
          filter: "blur(70px)",
        }}
      />

      {/* Orb 3 — bottom center-right */}
      <div
        className="hero-orb-3 absolute"
        style={{
          bottom: "-100px",
          left: "55%",
          width: "600px",
          height: "500px",
          background:
            "radial-gradient(ellipse, rgba(158, 216, 245, 0.10) 0%, transparent 60%)",
          filter: "blur(60px)",
        }}
      />

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
