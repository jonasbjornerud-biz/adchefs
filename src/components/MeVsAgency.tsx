import { Check, X, Sparkles } from "lucide-react";

const rows = [
  "An operator who reads your ad numbers weekly",
  "Briefs written by someone with 7 years of DR editing experience",
  "Net-new concepts engineered from your data, not a content calendar",
  "Shot by shot direction, not just a script",
  "Finished videos included, not strategy decks",
  "New creative batches shipped every week",
  "One person who owns the result end to end",
];

const GlassCheck = () => (
  <span
    className="relative inline-flex h-8 w-8 items-center justify-center rounded-full text-white"
    style={{
      background:
        "linear-gradient(180deg, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0.18) 100%)",
      boxShadow:
        "inset 0 1px 1px rgba(255,255,255,0.85), inset 0 -1px 1px rgba(25,70,110,0.25), 0 6px 14px -6px rgba(25,70,110,0.5), 0 0 0 1px rgba(255,255,255,0.55)",
    }}
  >
    <Check className="h-4 w-4 drop-shadow-[0_1px_1px_rgba(0,0,0,0.2)]" strokeWidth={3} />
  </span>
);

const FadedX = () => (
  <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-ink/[0.035] ring-1 ring-ink/15 text-ink/30">
    <X className="h-3.5 w-3.5" strokeWidth={2.25} />
  </span>
);

const MeVsAgency = () => {
  return (
    <section className="relative py-20 sm:py-32 overflow-hidden">
      {/* Match TwoWaysToWork base — white with airy accent wash */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, #FFFFFF 0%, #F8F9FA 50%, #FFFFFF 100%)",
        }}
        aria-hidden
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 55% at 50% 50%, rgba(158,216,245,0.16), transparent 65%), radial-gradient(ellipse 60% 40% at 10% 90%, rgba(158,216,245,0.10), transparent 55%)",
        }}
        aria-hidden
      />

      <div className="relative mx-auto max-w-[1100px] px-6">
        {/* Header — centered, matching TwoWaysToWork */}
        <div className="text-center mb-16 md:mb-24">
          <span className="eyebrow">Operator vs Agency</span>
          <h2 className="mt-4 font-display text-[34px] md:text-[52px] leading-[1.05] tracking-[-0.02em] text-ink">
            <em className="font-serif italic !text-ink">Me</em> vs a regular agency
          </h2>
          <p className="mt-5 max-w-2xl mx-auto text-[15px] md:text-[18px] text-muted-foreground">
            Same deliverable on paper. A very different person doing the actual work.
          </p>
        </div>

        {/* DESKTOP: single premium card with ME glass column inside */}
        <div className="hidden md:block relative group mvsa-root">
          {/* ambient glow under whole card */}
          <div
            className="absolute -inset-2 rounded-[40px] bg-[#9ED8F5]/30 opacity-70 blur-3xl"
            aria-hidden
          />

          {/* slow rotating conic glow behind ME column */}
          <div
            className="absolute top-1/2 -translate-y-1/2 pointer-events-none mvsa-conic"
            style={{
              right: "200px",
              width: "320px",
              height: "320px",
              background:
                "conic-gradient(from 0deg, rgba(158,216,245,0.0), rgba(158,216,245,0.55), rgba(255,255,255,0.0), rgba(158,216,245,0.45), rgba(158,216,245,0.0))",
              filter: "blur(40px)",
              opacity: 0.55,
              borderRadius: "9999px",
            }}
            aria-hidden
          />

          <div
            className="relative rounded-[32px] ring-1 ring-white/70 backdrop-blur-[40px]"
            style={{
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.88) 0%, rgba(255,255,255,0.74) 100%)",
              boxShadow:
                "inset 0 1px 1px rgba(255,255,255,0.95), 0 40px 90px -28px rgba(25,70,110,0.28), 0 14px 40px -14px rgba(25,70,110,0.14)",
            }}
          >
            <div className="grid grid-cols-[1fr_240px_180px] relative">
              {/* Floating ME pedestal — extends above and below the card */}
              <div
                className="absolute pointer-events-none mvsa-me-pedestal overflow-hidden"
                style={{
                  left: "calc(100% - 240px - 180px - 10px)",
                  width: "260px",
                  top: "-28px",
                  bottom: "-28px",
                  borderRadius: "28px",
                  background:
                    "linear-gradient(160deg, rgba(120,188,224,0.96) 0%, rgba(85,160,200,0.92) 45%, rgba(45,110,150,0.96) 100%)",
                  boxShadow:
                    "inset 0 1px 1px rgba(255,255,255,0.55), inset 0 0 0 1px rgba(255,255,255,0.25), 0 36px 70px -22px rgba(25,70,110,0.55), 0 18px 36px -14px rgba(25,70,110,0.3)",
                }}
                aria-hidden
              >
                {/* Glossy iOS top highlight */}
                <div className="absolute inset-x-0 top-0 h-44 rounded-t-[28px] bg-gradient-to-b from-white/45 via-white/12 to-transparent" />
                {/* Edge sheen */}
                <div
                  className="absolute inset-0 rounded-[28px]"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(255,255,255,0.18) 0%, transparent 12%, transparent 88%, rgba(255,255,255,0.10) 100%)",
                  }}
                />
                {/* Inner ambient orbs */}
                <div className="absolute -top-20 -right-10 h-56 w-56 rounded-full bg-white/22 blur-3xl" />
                <div className="absolute -bottom-20 -left-10 h-56 w-56 rounded-full bg-[#9ED8F5]/30 blur-3xl" />
                {/* Animated diagonal shimmer — soft, diffused */}
                <div className="absolute inset-0 mvsa-shimmer blur-[1px]" />
              </div>

              {/* Floating "ME" badge above pedestal */}
              <div
                className="absolute z-20 pointer-events-none flex items-center gap-2 rounded-full px-4 py-1.5 mvsa-badge"
                style={{
                  left: "calc(100% - 240px - 180px - 10px + 130px)",
                  transform: "translateX(-50%)",
                  top: "-44px",
                  background:
                    "linear-gradient(180deg, #FFFFFF 0%, #F0F4F8 100%)",
                  boxShadow:
                    "0 12px 28px -10px rgba(25,70,110,0.4), inset 0 1px 1px rgba(255,255,255,0.9), 0 0 0 1px rgba(255,255,255,0.6)",
                }}
                aria-hidden
              >
                <Sparkles className="h-3 w-3 text-[#3B86A8]" strokeWidth={2.5} />
                <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink font-semibold">
                  The pick
                </span>
              </div>

              {/* Header row */}
              <div className="px-8 py-7 flex items-center">
                <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                  What you get
                </span>
              </div>
              <div className="px-4 py-7 flex items-center justify-center relative z-10">
                <span className="font-serif italic text-[28px] leading-none text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.18)]">
                  Me
                </span>
              </div>
              <div className="px-4 py-7 flex items-center justify-center">
                <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground/80 text-center leading-tight">
                  Creative<br />Agency
                </span>
              </div>

              {rows.map((label, i) => (
                <div key={label} className="contents mvsa-row" style={{ ['--i' as never]: i }}>
                  <div
                    className="flex items-center px-8 py-5 border-t border-ink/[0.06] transition-colors duration-300"
                    style={
                      i % 2 === 1
                        ? { background: "linear-gradient(90deg, rgba(158,216,245,0.04) 0%, transparent 80%)" }
                        : undefined
                    }
                  >
                    <span className="text-[15px] text-ink leading-snug">{label}</span>
                  </div>
                  <div className="flex items-center justify-center px-4 py-5 relative z-10">
                    <GlassCheck />
                  </div>
                  <div className="flex items-center justify-center px-4 py-5 border-t border-ink/[0.06]">
                    <FadedX />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* MOBILE: stacked premium rows */}
        <div className="md:hidden space-y-3">
          {rows.map((label) => (
            <div
              key={label}
              className="rounded-[20px] p-5 ring-1 ring-white/70 backdrop-blur-[30px]"
              style={{
                background:
                  "linear-gradient(180deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.75) 100%)",
                boxShadow:
                  "inset 0 1px 1px rgba(255,255,255,0.9), 0 12px 30px -16px rgba(25,70,110,0.2)",
              }}
            >
              <span className="text-[14px] text-ink block mb-4 leading-snug">
                {label}
              </span>
              <div className="grid grid-cols-2 gap-3">
                <div
                  className="flex items-center justify-between rounded-[14px] px-4 py-3"
                  style={{
                    background:
                      "linear-gradient(160deg, rgba(105,178,218,0.92) 0%, rgba(55,130,172,0.88) 100%)",
                    boxShadow:
                      "inset 0 1px 1px rgba(255,255,255,0.4), 0 6px 16px -8px rgba(25,70,110,0.4)",
                  }}
                >
                  <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-white">
                    Me
                  </span>
                  <GlassCheck />
                </div>
                <div className="flex items-center justify-between rounded-[14px] px-4 py-3 bg-ink/[0.03] ring-1 ring-ink/10">
                  <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                    Agency
                  </span>
                  <FadedX />
                </div>
              </div>
            </div>
          ))}
        </div>

        <p className="mt-8 text-center text-[13px] text-muted-foreground italic max-w-xl mx-auto">
          Some agencies are great, but most aren't built for brands that value an in-house experience.
        </p>
      </div>

      <style>{`
        @keyframes mvsa-conic-spin {
          from { transform: translateY(-50%) rotate(0deg); }
          to   { transform: translateY(-50%) rotate(360deg); }
        }
        .mvsa-conic { animation: mvsa-conic-spin 30s linear infinite; opacity: 0.18 !important; }
        @keyframes mvsa-shimmer-sweep {
          0%   { transform: translateX(-140%) skewX(-18deg); opacity: 0; }
          15%  { opacity: 0.5; }
          85%  { opacity: 0.5; }
          100% { transform: translateX(140%) skewX(-18deg); opacity: 0; }
        }
        .mvsa-shimmer {
          background: linear-gradient(110deg, transparent 0%, transparent 35%, rgba(255,255,255,0.09) 50%, transparent 65%, transparent 100%);
          background-size: 200% 100%;
          animation: mvsa-shimmer-sweep 14s ease-in-out infinite;
          animation-delay: 2s;
          mask-image: linear-gradient(90deg, transparent 0%, black 18%, black 82%, transparent 100%);
          -webkit-mask-image: linear-gradient(90deg, transparent 0%, black 18%, black 82%, transparent 100%);
        }
        .mvsa-badge {
          animation: mvsa-badge-float 5s ease-in-out infinite;
        }
        @keyframes mvsa-badge-float {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50%      { transform: translateX(-50%) translateY(-4px); }
        }
        @media (prefers-reduced-motion: reduce) {
          .mvsa-conic, .mvsa-shimmer, .mvsa-badge { animation: none; }
        }
      `}</style>
    </section>
  );
};

export default MeVsAgency;
