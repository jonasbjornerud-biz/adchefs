/**
 * Case work carousel — screenshot cards with a metrics overlay that slides up
 * on hover. Auto-marquee with edge fades. Touch devices show metrics expanded.
 */

type CaseItem = {
  image: string;
  label: string;
  spend: string;
  roas: string;
  value: string;
  ctr: string;
  win?: boolean;
};

const CASES: CaseItem[] = [
  { image: "https://res.cloudinary.com/dqnifzwda/image/upload/v1782584798/Screenshot_2026-06-26_010601_xo9r97.png", label: "TD · UK · B091", spend: "$142K", roas: "2.52", value: "$358K", ctr: "4.20%" },
  { image: "https://res.cloudinary.com/dqnifzwda/image/upload/v1782584798/Screenshot_2026-06-26_010629_saeqm2.png", label: "NS · DE · B074", spend: "$96K", roas: "3.10", value: "$298K", ctr: "3.85%", win: true },
  { image: "https://res.cloudinary.com/dqnifzwda/image/upload/v1782584798/Screenshot_2026-06-26_010602_skqwxz.png", label: "PG · US · B112", spend: "$210K", roas: "2.18", value: "$458K", ctr: "5.10%" },
  { image: "https://res.cloudinary.com/dqnifzwda/image/upload/v1782584797/Screenshot_2026-06-26_010626_cfpvhd.png", label: "RC · NO · B058", spend: "$68K", roas: "2.74", value: "$186K", ctr: "4.45%" },
  { image: "https://res.cloudinary.com/dqnifzwda/image/upload/v1782584797/Screenshot_2026-06-26_010612_fchr9z.png", label: "HH · US · B088", spend: "$124K", roas: "3.42", value: "$424K", ctr: "3.95%", win: true },
  { image: "https://res.cloudinary.com/dqnifzwda/image/upload/v1782584798/Screenshot_2026-06-26_010649_d2vn3p.png", label: "OW · UK · B103", spend: "$88K", roas: "2.66", value: "$234K", ctr: "4.80%" },
];

const LOOP = [...CASES, ...CASES];

const Row = ({ k, v, chip }: { k: string; v: string; chip?: boolean }) => (
  <div className="flex items-center justify-between py-1.5 border-b border-white/10 last:border-b-0">
    <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-white/60">{k}</span>
    {chip ? (
      <span
        className="font-mono text-[11px] font-semibold tabular-nums px-2 py-0.5 rounded-[3px]"
        style={{ background: "#9ED8F5", color: "#1A1A1A" }}
      >
        {v}
      </span>
    ) : (
      <span className="text-[12px] font-semibold tabular-nums text-white">{v}</span>
    )}
  </div>
);

const Card = ({ c }: { c: CaseItem }) => (
  <div
    className="case-card group/case relative flex-shrink-0 w-[240px] md:w-[280px] aspect-[4/5] rounded-[4px] overflow-hidden bg-white"
    style={{
      boxShadow:
        "0 40px 80px -32px rgba(25,70,110,0.30), 0 16px 32px -16px rgba(26,26,26,0.18), inset 0 0 0 1px rgba(255,255,255,0.85)",
    }}
  >
    <img
      src={c.image}
      alt={c.label}
      className="w-full h-full object-cover"
      loading="lazy"
    />
    <div className="absolute top-3 left-3 rounded-[3px] bg-black/60 backdrop-blur-md px-2 py-1 ring-1 ring-white/20">
      <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-white/90">
        {c.label}
      </span>
    </div>

    <div
      className="case-overlay absolute inset-x-0 bottom-0 p-4"
      style={{
        background:
          "linear-gradient(180deg, rgba(26,26,26,0) 0%, rgba(26,26,26,0.85) 40%, rgba(26,26,26,0.95) 100%)",
      }}
    >
      <div className="font-mono text-[8.5px] uppercase tracking-[0.22em] text-white/50 mb-1.5">
        Verified account data
      </div>
      <Row k="Spend" v={c.spend} />
      <Row k="ROAS" v={c.roas} chip={c.win} />
      <Row k="Value" v={c.value} />
      <Row k="CTR" v={c.ctr} />
    </div>
  </div>
);

const ResultsMarquee = () => {
  return (
    <section className="relative py-20 sm:py-32 overflow-hidden">
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
        className="relative mt-16 group"
        style={{
          maskImage:
            "linear-gradient(90deg, transparent 0%, #000 8%, #000 92%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(90deg, transparent 0%, #000 8%, #000 92%, transparent 100%)",
        }}
      >
        <div
          className="flex items-center gap-8 md:gap-10 py-12 results-marquee-track"
          style={{ width: "max-content" }}
        >
          {LOOP.map((c, i) => (
            <Card key={i} c={c} />
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
        .results-marquee-track:hover { animation-play-state: paused; }
        @keyframes results-marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        .case-overlay {
          transform: translateY(72%);
          transition: transform 500ms cubic-bezier(0.22, 0.61, 0.36, 1);
        }
        .case-card:hover .case-overlay { transform: translateY(0%); }
        @media (hover: none) {
          .case-overlay { transform: translateY(0%); }
        }
        @media (prefers-reduced-motion: reduce) {
          .results-marquee-track { animation: none; }
          .case-overlay { transform: translateY(0%); transition: none; }
        }
      `}</style>
    </section>
  );
};

export default ResultsMarquee;
