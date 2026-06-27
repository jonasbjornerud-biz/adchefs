/**
 * Results for other brands — premium auto-scrolling marquee of 6 image placeholders.
 * No copy beyond the section header. Cards swerve on a curved baseline and glide
 * across the viewport on an infinite, paused-on-hover loop.
 */

const PLACEHOLDERS = [
  { hue: 210, tint: "#9ED8F5" },
  { hue: 30, tint: "#E8C9A0" },
  { hue: 260, tint: "#C9B8E8" },
  { hue: 160, tint: "#A8D8C5" },
  { hue: 350, tint: "#E8A8B8" },
  { hue: 200, tint: "#B8D4E8" },
];

// Duplicate the list so the marquee loops seamlessly.
const LOOP = [...PLACEHOLDERS, ...PLACEHOLDERS];

const Card = ({ index, tint }: { index: number; tint: string }) => {
  // Stagger vertical offset to create a wave / swerve effect along the row
  const offsets = [0, -28, 18, -14, 28, -22];
  const rotations = [-2.5, 1.5, -1.2, 2.2, -2, 1.8];
  const y = offsets[index % offsets.length];
  const r = rotations[index % rotations.length];

  return (
    <div
      className="relative flex-shrink-0 w-[240px] md:w-[280px] aspect-[9/14] rounded-[14px] overflow-hidden"
      style={{
        transform: `translateY(${y}px) rotate(${r}deg)`,
        boxShadow:
          "0 30px 60px -28px rgba(26,26,26,0.32), 0 12px 24px -16px rgba(26,26,26,0.18), inset 0 0 0 1px rgba(255,255,255,0.6)",
        background: `linear-gradient(155deg, ${tint} 0%, rgba(255,255,255,0.85) 55%, ${tint}55 100%)`,
      }}
    >
      {/* Subtle frame chrome to feel like a phone ad creative */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 70% at 50% 0%, rgba(255,255,255,0.55) 0%, transparent 55%), radial-gradient(120% 80% at 50% 100%, rgba(26,26,26,0.18) 0%, transparent 60%)",
        }}
      />
      {/* Faux play glyph centerpiece */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className="h-12 w-12 rounded-full flex items-center justify-center"
          style={{
            background: "rgba(255,255,255,0.6)",
            backdropFilter: "blur(8px)",
            boxShadow: "0 8px 20px -8px rgba(26,26,26,0.3)",
          }}
        >
          <span
            style={{
              display: "inline-block",
              width: 0,
              height: 0,
              borderLeft: "10px solid #1A1A1A",
              borderTop: "7px solid transparent",
              borderBottom: "7px solid transparent",
              marginLeft: 3,
            }}
          />
        </div>
      </div>
    </div>
  );
};

const ResultsMarquee = () => {
  return (
    <section className="py-20 sm:py-32 bg-background relative overflow-hidden">
      {/* Soft background wash matching brand accent */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(50% 40% at 20% 30%, rgba(158,216,245,0.12) 0%, transparent 70%), radial-gradient(50% 40% at 85% 70%, rgba(158,216,245,0.08) 0%, transparent 70%)",
        }}
      />

      <div className="relative mx-auto max-w-[1200px] px-6">
        <div className="text-center">
          <span className="eyebrow">CASE WORK</span>
          <h2 className="mt-5 font-display text-[32px] md:text-[44px] leading-[1.05] tracking-[-0.02em] text-foreground">
            Results for <em className="font-serif">other brands</em>.
          </h2>
        </div>
      </div>

      {/* Marquee track */}
      <div
        className="relative mt-20 group"
        style={{
          maskImage:
            "linear-gradient(90deg, transparent 0%, #000 8%, #000 92%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(90deg, transparent 0%, #000 8%, #000 92%, transparent 100%)",
        }}
      >
        <div
          className="flex items-center gap-10 md:gap-14 py-16 results-marquee-track"
          style={{ width: "max-content" }}
        >
          {LOOP.map((p, i) => (
            <Card key={i} index={i} tint={p.tint} />
          ))}
        </div>
      </div>

      <style>{`
        .results-marquee-track {
          animation: results-marquee 38s linear infinite;
          will-change: transform;
        }
        .group:hover .results-marquee-track {
          animation-play-state: paused;
        }
        @keyframes results-marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        @media (prefers-reduced-motion: reduce) {
          .results-marquee-track { animation: none; }
        }
      `}</style>
    </section>
  );
};

export default ResultsMarquee;