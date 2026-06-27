import { Check, X } from "lucide-react";

const rows = [
  "An operator who reads your ad numbers weekly",
  "Briefs written by someone who can actually edit",
  "Shot by shot direction, not just a script",
  "Live KPI dashboard, included free",
  "New creative batches shipped every week",
  "Fast creative iterations, no month long wait to launch",
  "One person who owns the result end to end",
];

const GlassCheck = () => (
  <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/30 text-white ring-1 ring-white/70 backdrop-blur-md shadow-[0_4px_12px_-4px_rgba(25,70,110,0.35)]">
    <Check className="h-3.5 w-3.5" strokeWidth={2.75} />
  </span>
);

const FadedX = () => (
  <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-ink/[0.04] ring-1 ring-ink/15 text-ink/35">
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
        <div className="text-center mb-14 md:mb-20">
          <h2 className="font-display text-[34px] md:text-[52px] leading-[1.05] tracking-[-0.02em] text-ink">
            <em className="font-serif italic !text-ink">Me</em> vs a regular agency
          </h2>
          <p className="mt-5 max-w-2xl mx-auto text-[15px] md:text-[18px] text-muted-foreground">
            Same deliverable on paper. A very different person doing the actual work.
          </p>
        </div>

        {/* DESKTOP: single premium card with ME glass column inside */}
        <div className="hidden md:block relative group">
          {/* ambient glow */}
          <div
            className="absolute -inset-1 rounded-[36px] bg-[#9ED8F5]/25 opacity-60 blur-3xl"
            aria-hidden
          />

          <div
            className="relative rounded-[32px] overflow-hidden ring-1 ring-white/70 backdrop-blur-[40px]"
            style={{
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0.72) 100%)",
              boxShadow:
                "inset 0 1px 1px rgba(255,255,255,0.9), 0 30px 80px -24px rgba(25,70,110,0.25), 0 12px 32px -12px rgba(25,70,110,0.12)",
            }}
          >
            <div className="grid grid-cols-[1fr_220px_180px] relative">
              {/* ME glass column — spans full table height behind cells */}
              <div
                className="absolute top-0 bottom-0 pointer-events-none"
                style={{
                  left: "calc(100% - 220px - 180px)",
                  width: "220px",
                  borderRadius: "24px",
                  margin: "12px 0",
                  background:
                    "linear-gradient(160deg, rgba(105,178,218,0.92) 0%, rgba(78,153,194,0.88) 45%, rgba(45,110,150,0.92) 100%)",
                  boxShadow:
                    "inset 0 1px 1px rgba(255,255,255,0.45), inset 0 0 0 1px rgba(255,255,255,0.22), 0 20px 50px -20px rgba(25,70,110,0.5)",
                }}
                aria-hidden
              >
                {/* iOS glossy top highlight */}
                <div className="absolute inset-x-0 top-0 h-32 rounded-t-[24px] bg-gradient-to-b from-white/35 via-white/10 to-transparent" />
                <div className="absolute -top-16 -right-10 h-48 w-48 rounded-full bg-white/15 blur-3xl" />
                <div className="absolute -bottom-16 -left-10 h-48 w-48 rounded-full bg-[#9ED8F5]/25 blur-3xl" />
              </div>

              {/* Header row */}
              <div className="px-8 py-6 flex items-center">
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                  What you get
                </span>
              </div>
              <div className="px-4 py-6 flex items-center justify-center relative">
                <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-white font-semibold drop-shadow-[0_1px_1px_rgba(0,0,0,0.15)]">
                  Me
                </span>
              </div>
              <div className="px-4 py-6 flex items-center justify-center">
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground/80 text-center leading-tight">
                  Creative<br />Agency
                </span>
              </div>

              {rows.map((label, i) => (
                <div key={label} className="contents">
                  <div className="flex items-center px-8 py-5 border-t border-ink/5">
                    <span className="text-[15px] text-ink leading-snug">{label}</span>
                  </div>
                  <div className="flex items-center justify-center px-4 py-5 relative">
                    <GlassCheck />
                  </div>
                  <div className="flex items-center justify-center px-4 py-5 border-t border-ink/5">
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
          Some agencies are excellent. Most are not built for brands that just want video that ships and works.
        </p>
      </div>
    </section>
  );
};

export default MeVsAgency;
