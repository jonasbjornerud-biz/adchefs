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
        @keyframes orbitSpin       { from { transform: rotate(0deg);   } to { transform: rotate(360deg);   } }
        @keyframes orbitSpinRev    { from { transform: rotate(0deg);   } to { transform: rotate(-360deg);  } }
        @keyframes orbitDot1       { from { transform: rotate(0deg);   } to { transform: rotate(360deg);   } }
        @keyframes orbitDot2       { from { transform: rotate(120deg); } to { transform: rotate(480deg);   } }
        .orbit-spin       { animation: orbitSpin 240s linear infinite;    transform-origin: 800px 800px; transform-box: fill-box; }
        .orbit-spin-rev   { animation: orbitSpinRev 180s linear infinite; transform-origin: 800px 800px; transform-box: fill-box; }
        .orbit-dot-1      { animation: orbitDot1 45s linear infinite;     transform-origin: 800px 800px; transform-box: fill-box; }
        .orbit-dot-2      { animation: orbitDot2 70s linear infinite;     transform-origin: 800px 800px; transform-box: fill-box; }
        @media (prefers-reduced-motion: reduce) {
          .orbit-spin, .orbit-spin-rev, .orbit-dot-1, .orbit-dot-2 { animation: none; }
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

      {/* Orbital line system */}
      <svg
        width="1600"
        height="1600"
        viewBox="0 0 1600 1600"
        className="absolute"
        style={{
          top: '45%',
          left: '85%',
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
          zIndex: 1,
          WebkitMaskImage:
            'linear-gradient(to right, transparent 0%, #000 30%, #000 100%)',
          maskImage:
            'linear-gradient(to right, transparent 0%, #000 30%, #000 100%)',
        }}
      >
        <g className="orbit-spin">
          <circle cx="800" cy="800" r="380" fill="none" stroke="#1A1A1A" strokeWidth="1" opacity="0.15" />
          <circle cx="800" cy="800" r="740" fill="none" stroke="#1A1A1A" strokeWidth="1" opacity="0.12" />
        </g>
        <g className="orbit-spin-rev">
          <circle
            cx="800"
            cy="800"
            r="560"
            fill="none"
            stroke="#9ED8F5"
            strokeWidth="1.5"
            opacity="0.6"
            strokeDasharray="4 8"
          />
        </g>
        <g className="orbit-dot-1">
          <circle cx="1360" cy="800" r="5" fill="#9ED8F5" />
        </g>
        <g className="orbit-dot-2">
          <circle cx="1180" cy="800" r="4" fill="#1A1A1A" opacity="0.5" />
        </g>
      </svg>
    </div>
  );
};

export default HeroBackground;