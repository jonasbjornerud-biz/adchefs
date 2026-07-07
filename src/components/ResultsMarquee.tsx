/**
 * Case work marquee — a curated wall of full uncropped screenshots that
 * drifts horizontally. Alternating rotation and vertical offset give it an
 * editorial pinboard feel. No hover state, no labels, no overlay text.
 */

type CaseItem = { image: string };

const CASES: CaseItem[] = [
  { image: "https://res.cloudinary.com/dqnifzwda/image/upload/v1782584798/Screenshot_2026-06-26_010601_xo9r97.png" },
  { image: "https://res.cloudinary.com/dqnifzwda/image/upload/v1782584798/Screenshot_2026-06-26_010629_saeqm2.png" },
  { image: "https://res.cloudinary.com/dqnifzwda/image/upload/v1782584798/Screenshot_2026-06-26_010602_skqwxz.png" },
  { image: "https://res.cloudinary.com/dqnifzwda/image/upload/v1782584797/Screenshot_2026-06-26_010626_cfpvhd.png" },
  { image: "https://res.cloudinary.com/dqnifzwda/image/upload/v1782584797/Screenshot_2026-06-26_010612_fchr9z.png" },
  { image: "https://res.cloudinary.com/dqnifzwda/image/upload/v1782584798/Screenshot_2026-06-26_010649_d2vn3p.png" },
];

const LOOP = [...CASES, ...CASES];

// Alternating tilt + vertical drift for an editorial pinboard feel.
const TILTS = [-2, 1.4, -1, 2, -1.6, 1];
const OFFSETS = [0, 26, -18, 14, -10, 22];

const Card = ({ c, i }: { c: CaseItem; i: number }) => {
  const rot = TILTS[i % TILTS.length];
  const dy = OFFSETS[i % OFFSETS.length];
  return (
    <div
      className="relative flex-shrink-0"
      style={{
        transform: `translateY(${dy}px) rotate(${rot}deg)`,
      }}
    >
      <img
        src={c.image}
        alt=""
        aria-hidden
        loading="lazy"
        className="block w-auto h-[320px] md:h-[380px] max-w-none rounded-[4px]"
        style={{
          boxShadow:
            "0 40px 80px -32px rgba(25,70,110,0.30), 0 16px 32px -16px rgba(26,26,26,0.18), 0 0 0 1px rgba(26,26,26,0.06)",
        }}
      />
    </div>
  );
};

const ResultsMarquee = () => {
  return (
    <section className="relative py-20 sm:pb-32 sm:pt-16 overflow-hidden">
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

      <div
        className="relative mt-20 md:mt-24"
        style={{
          maskImage:
            "linear-gradient(90deg, transparent 0%, #000 8%, #000 92%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(90deg, transparent 0%, #000 8%, #000 92%, transparent 100%)",
        }}
      >
        <div
          className="flex items-center gap-10 md:gap-14 py-20 results-marquee-track"
          style={{ width: "max-content" }}
        >
          {LOOP.map((c, i) => (
            <Card key={i} c={c} i={i} />
          ))}
        </div>
      </div>

      <p className="relative mt-10 text-center text-[12px] md:text-[13px] text-muted-foreground italic max-w-xl mx-auto px-6">
        Some case work is editing only, delivered under a separate strategist. Strategy results are marked.
      </p>

      <style>{`
        .results-marquee-track {
          animation: results-marquee 60s linear infinite;
          will-change: transform;
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
