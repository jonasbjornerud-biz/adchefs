import HeroTimeline from "./HeroTimeline";

const HeroBackground = () => {
  return (
    <div
      aria-hidden
      className="absolute inset-0 overflow-hidden pointer-events-none z-0"
    >
      <style>{`
        @keyframes auroraOrbA {
          0%   { transform: translate(0px, 0px); }
          100% { transform: translate(60px, 40px); }
        }
        @keyframes auroraOrbB {
          0%   { transform: translate(0px, 0px); }
          100% { transform: translate(-50px, 60px); }
        }
        @keyframes auroraOrbC {
          0%   { transform: translate(0px, 0px); }
          100% { transform: translate(40px, -30px); }
        }
        .aurora-orb-a { animation: auroraOrbA 70s ease-in-out infinite alternate; }
        .aurora-orb-b { animation: auroraOrbB 90s ease-in-out infinite alternate; }
        .aurora-orb-c { animation: auroraOrbC 55s ease-in-out infinite alternate; }
        @media (prefers-reduced-motion: reduce) {
          .aurora-orb-a, .aurora-orb-b, .aurora-orb-c { animation: none; }
        }
      `}</style>

      {/* Orb 1 — top-left */}
      <div
        className="aurora-orb-a absolute"
        style={{
          top: -200,
          left: -150,
          width: 900,
          height: 700,
          background: 'radial-gradient(ellipse, rgba(158, 216, 245, 0.18) 0%, transparent 70%)',
          filter: 'blur(60px)',
          animationDelay: '0s',
        }}
      />

      {/* Orb 2 — top-right */}
      <div
        className="aurora-orb-b absolute"
        style={{
          top: -100,
          right: -300,
          width: 1000,
          height: 800,
          background: 'radial-gradient(ellipse, rgba(158, 216, 245, 0.13) 0%, transparent 65%)',
          filter: 'blur(60px)',
          animationDelay: '-25s',
        }}
      />

      {/* Orb 3 — bottom center-left */}
      <div
        className="aurora-orb-c absolute"
        style={{
          bottom: -100,
          left: '30%',
          width: 700,
          height: 600,
          background: 'radial-gradient(ellipse, rgba(158, 216, 245, 0.09) 0%, transparent 60%)',
          filter: 'blur(60px)',
          animationDelay: '-45s',
        }}
      />

      {/* Static film grain overlay */}
      <div
        className="absolute inset-0"
        style={{
          opacity: 0.045,
          mixBlendMode: 'overlay',
          backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.6 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '240px 240px',
        }}
      />

      {/* Ghost editing timeline */}
      <HeroTimeline />
    </div>
  );
};

export default HeroBackground;