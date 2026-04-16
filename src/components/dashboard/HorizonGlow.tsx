/**
 * HorizonGlow — moneywise-inspired purple arc hero graphic.
 * A bright curved horizon line with soft halo, sitting behind/below content.
 */
export function HorizonGlow({ height = 280 }: { height?: number }) {
  return (
    <div
      className="absolute inset-x-0 top-0 pointer-events-none overflow-hidden"
      style={{ height }}
      aria-hidden
    >
      {/* Soft outer halo */}
      <div
        className="absolute left-1/2 -translate-x-1/2"
        style={{
          bottom: -height * 0.55,
          width: '160%',
          height: height * 1.6,
          background:
            'radial-gradient(ellipse 50% 50% at 50% 50%, rgba(168,85,247,0.45) 0%, rgba(124,58,237,0.18) 35%, transparent 65%)',
          filter: 'blur(40px)',
        }}
      />
      {/* Inner bright glow */}
      <div
        className="absolute left-1/2 -translate-x-1/2"
        style={{
          bottom: -height * 0.35,
          width: '110%',
          height: height * 1.1,
          background:
            'radial-gradient(ellipse 50% 50% at 50% 50%, rgba(216,180,254,0.55) 0%, rgba(168,85,247,0.25) 30%, transparent 60%)',
          filter: 'blur(20px)',
        }}
      />
      {/* The bright crisp horizon arc (curved highlight) */}
      <svg
        className="absolute left-1/2 -translate-x-1/2"
        style={{ bottom: -2, width: '120%', height: height * 0.9 }}
        viewBox="0 0 1200 260"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="horizon-arc" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="rgba(168,85,247,0)" />
            <stop offset="20%" stopColor="rgba(216,180,254,0.5)" />
            <stop offset="50%" stopColor="rgba(255,255,255,0.95)" />
            <stop offset="80%" stopColor="rgba(216,180,254,0.5)" />
            <stop offset="100%" stopColor="rgba(168,85,247,0)" />
          </linearGradient>
          <linearGradient id="horizon-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(168,85,247,0.35)" />
            <stop offset="100%" stopColor="rgba(124,58,237,0)" />
          </linearGradient>
          <filter id="horizon-blur" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.5" />
          </filter>
        </defs>
        {/* Filled dome under the arc for depth */}
        <path
          d="M -50 260 Q 600 -20 1250 260 Z"
          fill="url(#horizon-fill)"
        />
        {/* The crisp bright arc line */}
        <path
          d="M -50 260 Q 600 -10 1250 260"
          fill="none"
          stroke="url(#horizon-arc)"
          strokeWidth="2.5"
          filter="url(#horizon-blur)"
        />
        {/* Sharper highlight on top of the arc */}
        <path
          d="M -50 260 Q 600 -10 1250 260"
          fill="none"
          stroke="url(#horizon-arc)"
          strokeWidth="1"
        />
      </svg>
      {/* Subtle grid texture only inside the glow band */}
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          maskImage:
            'radial-gradient(ellipse 60% 80% at 50% 100%, black 0%, transparent 70%)',
          WebkitMaskImage:
            'radial-gradient(ellipse 60% 80% at 50% 100%, black 0%, transparent 70%)',
        }}
      />
    </div>
  );
}
