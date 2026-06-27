/**
 * Results for other brands — premium auto-scrolling marquee of 6 image placeholders.
 * No copy beyond the section header. Cards swerve on a curved baseline and glide
 * across the viewport on an infinite, paused-on-hover loop.
 */

const PLACEHOLDERS: Array<{ tint: string; roas: string; ctr: string; image?: string }> = [
  { tint: "#9ED8F5", roas: "2.52", ctr: "4.20%" },
  { tint: "#E8C9A0", roas: "3.10", ctr: "3.85%" },
  { tint: "#C9B8E8", roas: "2.18", ctr: "5.10%" },
  { tint: "#A8D8C5", roas: "2.74", ctr: "4.45%" },
  { tint: "#E8A8B8", roas: "3.42", ctr: "3.95%" },
  { tint: "#B8D4E8", roas: "2.66", ctr: "4.80%" },
];

// Duplicate the list so the marquee loops seamlessly.
const LOOP = [...PLACEHOLDERS, ...PLACEHOLDERS];

const Card = ({
  index,
  tint,
  roas,
  ctr,
  image,
}: {
  index: number;
  tint: string;
  roas: string;
  ctr: string;
  image?: string;
}) => {
  const offsets = [0, -16, 12, -8, 18, -14];
  const rotations = [-1.5, 1.2, -0.8, 1.4, -1.3, 1.0];
  const y = offsets[index % offsets.length];
  const r = rotations[index % rotations.length];

  return (
    <div
      className="relative flex-shrink-0 w-[260px] md:w-[320px] aspect-[4/5] rounded-[18px] overflow-hidden bg-white"
      style={{
        transform: `translateY(${y}px) rotate(${r}deg)`,
        boxShadow:
          "0 40px 80px -32px rgba(25,70,110,0.30), 0 16px 32px -16px rgba(26,26,26,0.18), inset 0 0 0 1px rgba(255,255,255,0.85)",
        backgroundImage: image
          ? `url(${image})`
          : `linear-gradient(155deg, ${tint}cc 0%, #ffffff 60%, ${tint}66 100%)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {!image && (
        <>
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(120% 60% at 50% 0%, rgba(255,255,255,0.5) 0%, transparent 55%)",
            }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-mono text-[9.5px] uppercase tracking-[0.22em] text-ink/35">
              Screenshot placeholder
            </span>
          </div>
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between rounded-[10px] bg-white/75 backdrop-blur-md px-3 py-2 ring-1 ring-white/80">
            <div>
              <div className="font-mono text-[8px] uppercase tracking-[0.18em] text-muted-foreground">ROAS</div>
              <div className="text-[13px] font-semibold tabular-nums text-ink leading-none mt-0.5">{roas}</div>
            </div>
            <div className="text-right">
              <div className="font-mono text-[8px] uppercase tracking-[0.18em] text-muted-foreground">CTR</div>
              <div className="text-[13px] font-semibold tabular-nums text-ink leading-none mt-0.5">{ctr}</div>
            </div>
          </div>
        </>
      )}
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
            <Card key={i} index={i} tint={p.tint} roas={p.roas} ctr={p.ctr} image={p.image} />
          ))}
        </div>
      </div>

      <p className="relative mt-10 text-center text-[12px] md:text-[13px] text-muted-foreground italic max-w-xl mx-auto px-6">
        Some case work includes editor placement services with a separate strategist.
      </p>

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