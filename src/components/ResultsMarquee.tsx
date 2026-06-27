/**
 * Results for other brands — premium auto-scrolling marquee of case-study screenshots.
 * Cards preserve their native aspect ratio, and a centered viewport scanner ring
 * highlights the metrics area as each card passes through the middle.
 */

const PLACEHOLDERS: Array<{ tint: string; roas: string; ctr: string; image?: string }> = [
  { tint: "#9ED8F5", roas: "2.52", ctr: "4.20%", image: "https://res.cloudinary.com/dqnifzwda/image/upload/v1782584798/Screenshot_2026-06-26_010601_xo9r97.png" },
  { tint: "#E8C9A0", roas: "3.10", ctr: "3.85%", image: "https://res.cloudinary.com/dqnifzwda/image/upload/v1782584798/Screenshot_2026-06-26_010629_saeqm2.png" },
  { tint: "#C9B8E8", roas: "2.18", ctr: "5.10%", image: "https://res.cloudinary.com/dqnifzwda/image/upload/v1782584798/Screenshot_2026-06-26_010602_skqwxz.png" },
  { tint: "#A8D8C5", roas: "2.74", ctr: "4.45%", image: "https://res.cloudinary.com/dqnifzwda/image/upload/v1782584797/Screenshot_2026-06-26_010626_cfpvhd.png" },
  { tint: "#E8A8B8", roas: "3.42", ctr: "3.95%", image: "https://res.cloudinary.com/dqnifzwda/image/upload/v1782584797/Screenshot_2026-06-26_010612_fchr9z.png" },
  { tint: "#B8D4E8", roas: "2.66", ctr: "4.80%", image: "https://res.cloudinary.com/dqnifzwda/image/upload/v1782584798/Screenshot_2026-06-26_010649_d2vn3p.png" },
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
      className="relative flex-shrink-0 w-[260px] md:w-[320px] rounded-[18px] overflow-hidden bg-white"
      style={{
        transform: `translateY(${y}px) rotate(${r}deg)`,
        boxShadow:
          "0 40px 80px -32px rgba(25,70,110,0.30), 0 16px 32px -16px rgba(26,26,26,0.18), inset 0 0 0 1px rgba(255,255,255,0.85)",
      }}
    >
      {image ? (
        <img
          src={image}
          alt="Case study result"
          className="w-full h-auto block"
          loading="lazy"
          decoding="async"
        />
      ) : (
        <div
          className="relative w-full aspect-[4/5]"
          style={{
            background:
              `linear-gradient(155deg, ${tint}cc 0%, #ffffff 60%, ${tint}66 100%)`,
          }}
        >
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
        </div>
      )}
    </div>
  );
};

const ResultsMarquee = () => {
  return (
    <section className="relative py-20 sm:py-32 overflow-hidden">
      {/* Match TwoWaysToWork: white base + airy brand-accent wash for a seamless transition */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, #FFFFFF 0%, #F8F9FA 50%, #FFFFFF 100%)",
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 55% at 50% 50%, rgba(158,216,245,0.16), transparent 65%), radial-gradient(ellipse 60% 40% at 90% 10%, rgba(158,216,245,0.10), transparent 55%)",
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

        {/* Hand-drawn marker circle that highlights the metrics block of the centered card */}
        <div
          aria-hidden
          className="absolute left-[58%] top-[78%] -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10"
        >
          <svg
            width="240"
            height="200"
            viewBox="0 0 240 200"
            fill="none"
            className="marker-circle"
            style={{ overflow: "visible", transform: "rotate(-2deg)" }}
          >
            <defs>
              <filter id="marker-glow" x="-50%" y="-50%" width="200%" height="200%">
                <feDropShadow dx="0" dy="1" stdDeviation="3" floodColor="#FF4D4F" floodOpacity="0.35" />
              </filter>
            </defs>
            <path
              className="marker-stroke"
              d="M118 26 C135 22, 162 28, 185 46 C205 62, 218 88, 212 118 C208 140, 192 162, 165 174 C138 186, 105 182, 76 170 C50 158, 28 134, 26 104 C24 74, 40 48, 68 36 C84 29, 100 27, 118 26"
              stroke="#FF4D4F"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
              filter="url(#marker-glow)"
            />
          </svg>
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
        .marker-stroke {
          stroke-dasharray: 750;
          stroke-dashoffset: 750;
          animation: marker-draw 3.2s ease-in-out infinite;
        }
        .marker-circle {
          opacity: 0;
          animation: marker-fade 3.2s ease-in-out infinite;
        }
        @keyframes results-marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        @keyframes marker-draw {
          0% { stroke-dashoffset: 580; }
          40% { stroke-dashoffset: 0; }
          80% { stroke-dashoffset: 0; }
          100% { stroke-dashoffset: 0; }
        }
        @keyframes marker-fade {
          0% { opacity: 0; transform: scale(0.92); }
          15% { opacity: 1; transform: scale(1); }
          70% { opacity: 1; transform: scale(1); }
          100% { opacity: 0; transform: scale(1.02); }
        }
        @media (prefers-reduced-motion: reduce) {
          .results-marquee-track,
          .marker-stroke,
          .marker-circle { animation: none; }
          .marker-circle { opacity: 0.8; }
          .marker-stroke { stroke-dashoffset: 0; }
        }
      `}</style>
    </section>
  );
};

export default ResultsMarquee;