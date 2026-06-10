const HeroBackground = () => {
  return (
    <div
      aria-hidden
      className="absolute inset-0 overflow-hidden pointer-events-none z-0"
    >
      <style>{`
        @keyframes heroRingDriftA {
          0%   { transform: translate(0px, 0px) rotate(14deg); }
          100% { transform: translate(-50px, 30px) rotate(20deg); }
        }
        @keyframes heroRingDriftB {
          0%   { transform: translate(0px, 0px) rotate(-12deg); }
          100% { transform: translate(40px, -40px) rotate(-20deg); }
        }
        @keyframes heroRingBreatheA {
          0%, 100% { stroke-opacity: 0.11; }
          50%      { stroke-opacity: 0.15; }
        }
        @keyframes heroRingBreatheB {
          0%, 100% { stroke-opacity: 0.11; }
          50%      { stroke-opacity: 0.15; }
        }
        .hero-ring-a { animation: heroRingDriftA 45s ease-in-out infinite alternate; transform-origin: center; will-change: transform; }
        .hero-ring-b { animation: heroRingDriftB 60s ease-in-out infinite alternate; transform-origin: center; will-change: transform; }
        .hero-ring-a > ellipse { animation: heroRingBreatheA 45s ease-in-out infinite alternate; }
        .hero-ring-b > ellipse { animation: heroRingBreatheB 60s ease-in-out infinite alternate; }
        @media (prefers-reduced-motion: reduce) {
          .hero-ring-a, .hero-ring-b,
          .hero-ring-a > ellipse, .hero-ring-b > ellipse { animation: none; }
        }
      `}</style>

      {/* Soft top-right radial wash over Paper background */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 90% 70% at 90% 0%, rgba(158, 216, 245, 0.12) 0%, rgba(158, 216, 245, 0.06) 30%, rgba(247, 246, 243, 0) 70%)',
        }}
      />

      <svg
        className="hero-ring-a absolute"
        style={{ left: '-30%', top: '-10%', width: 1600, height: 1600, filter: 'blur(2px)' }}
        viewBox="0 0 1600 1600"
        preserveAspectRatio="none"
      >
        <ellipse
          cx="800"
          cy="800"
          rx="720"
          ry="540"
          fill="none"
          stroke="#9ED8F5"
          strokeOpacity="0.11"
          strokeWidth="110"
        />
      </svg>

      {/* Bottom-right ring */}
      <svg
        className="hero-ring-b absolute"
        style={{ right: '-35%', bottom: '-30%', width: 1750, height: 1750, filter: 'blur(2px)' }}
        viewBox="0 0 1750 1750"
        preserveAspectRatio="none"
      >
        <ellipse
          cx="875"
          cy="875"
          rx="800"
          ry="600"
          fill="none"
          stroke="#9ED8F5"
          strokeOpacity="0.11"
          strokeWidth="100"
        />
      </svg>

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
    </div>
  );
};

export default HeroBackground;