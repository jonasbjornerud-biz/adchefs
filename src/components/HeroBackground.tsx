const HeroBackground = () => {
  return (
    <div
      aria-hidden
      className="absolute inset-0 overflow-hidden pointer-events-none z-0"
    >
      <style>{`
        @keyframes heroRingDriftA {
          0%, 100% { transform: translate(-12%, -8%) rotate(14deg); }
          50%      { transform: translate(-9%, -5%) rotate(18deg); }
        }
        @keyframes heroRingDriftB {
          0%, 100% { transform: translate(18%, 22%) rotate(-12deg); }
          50%      { transform: translate(15%, 19%) rotate(-8deg); }
        }
        .hero-ring-a { animation: heroRingDriftA 75s ease-in-out infinite alternate; transform-origin: center; will-change: transform; }
        .hero-ring-b { animation: heroRingDriftB 90s ease-in-out infinite alternate; transform-origin: center; will-change: transform; }
        @media (prefers-reduced-motion: reduce) {
          .hero-ring-a, .hero-ring-b { animation: none; }
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

      {/* Left ring behind headline */}
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
          strokeOpacity="0.07"
          strokeWidth="80"
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
          strokeOpacity="0.07"
          strokeWidth="70"
        />
      </svg>
    </div>
  );
};

export default HeroBackground;