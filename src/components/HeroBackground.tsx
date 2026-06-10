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
        @keyframes curveDraw  { from { stroke-dashoffset: 1000; } to { stroke-dashoffset: 0; } }
        @keyframes curvePulse {
          0%    { stroke-dashoffset: 60; }
          31.25%{ stroke-dashoffset: -1000; }
          100%  { stroke-dashoffset: -1000; }
        }
        .curve-line, .curve-glow {
          stroke-dasharray: 1000;
          stroke-dashoffset: 1000;
          animation: curveDraw 3.5s ease-out forwards;
        }
        .curve-pulse {
          stroke-dasharray: 60 9999;
          stroke-dashoffset: 60;
          animation: curvePulse 8s linear 3.5s infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .curve-line, .curve-glow { animation: none; stroke-dashoffset: 0; }
          .curve-pulse { animation: none; opacity: 0; }
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

      {/* Performance curve */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 1000 600"
        preserveAspectRatio="none"
        style={{ pointerEvents: 'none', zIndex: 1 }}
      >
        <defs>
          <linearGradient id="curveGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#9ED8F5" stopOpacity="0.15" />
            <stop offset="50%" stopColor="#9ED8F5" stopOpacity="0.42" />
            <stop offset="100%" stopColor="#9ED8F5" stopOpacity="0.7" />
          </linearGradient>
        </defs>
        {/* Soft glow underlay */}
        <path
          className="curve-glow"
          d="M 0 450 C 240 475, 430 445, 600 330 S 880 185, 1000 150"
          fill="none"
          stroke="#9ED8F5"
          strokeWidth="6"
          strokeLinecap="round"
          opacity="0.12"
          pathLength="1000"
          style={{ filter: 'blur(6px)' }}
        />
        {/* Main line */}
        <path
          className="curve-line"
          d="M 0 450 C 240 475, 430 445, 600 330 S 880 185, 1000 150"
          fill="none"
          stroke="url(#curveGrad)"
          strokeWidth="1.5"
          strokeLinecap="round"
          pathLength="1000"
        />
        {/* Traveling pulse */}
        <path
          className="curve-pulse"
          d="M 0 450 C 240 475, 430 445, 600 330 S 880 185, 1000 150"
          fill="none"
          stroke="#D6EEFB"
          strokeWidth="2.5"
          strokeLinecap="round"
          opacity="0.9"
          pathLength="1000"
        />
        {/* Tick marks (static) */}
        <g stroke="#1A1A1A" strokeWidth="1" opacity="0.2" strokeLinecap="round">
          <line x1="120" y1="463" x2="120" y2="471" />
          <line x1="310" y1="455" x2="310" y2="463" />
          <line x1="520" y1="378" x2="520" y2="386" />
          <line x1="760" y1="232" x2="760" y2="240" />
          <line x1="920" y1="172" x2="920" y2="180" />
        </g>
      </svg>
    </div>
  );
};

export default HeroBackground;