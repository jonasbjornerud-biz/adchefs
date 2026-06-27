import { Check, X, Sparkles } from "lucide-react";

const rows = [
  "In-House System Building",
  "Briefs written by a former direct response editor",
  "New creative batches shipped every week",
  "Fast creative iterations",
  "Live KPI dashboard, included free",
  "One person who owns the result end to end",
];

const GlassCheck = () => (
  <span
    className="relative inline-flex h-8 w-8 items-center justify-center rounded-full text-white"
    style={{
      background:
        "linear-gradient(180deg, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0.15) 100%)",
      boxShadow:
        "inset 0 1px 2px rgba(255,255,255,0.5), 0 4px 10px rgba(25,70,110,0.2), 0 0 0 1px rgba(255,255,255,0.25)",
    }}
  >
    <Check className="h-4 w-4 drop-shadow-[0_1px_1px_rgba(0,0,0,0.15)]" strokeWidth={3} />
  </span>
);

const FadedX = () => (
  <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-ink/10 text-ink/25">
    <X className="h-3.5 w-3.5" strokeWidth={2.25} />
  </span>
);

const MeVsAgency = () => {
  return (
    <section className="relative py-20 sm:py-32 overflow-hidden">
      {/* Match TwoWaysToWork base — Paper with airy accent wash */}
      <div className="absolute inset-0 pointer-events-none bg-[#F7F6F3]" />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 55% at 50% 50%, rgba(158,216,245,0.16), transparent 65%), radial-gradient(ellipse 60% 40% at 10% 90%, rgba(158,216,245,0.10), transparent 55%)",
        }}
        aria-hidden
      />

      <div className="relative mx-auto max-w-[1000px] px-6">
        {/* Header */}
        <div className="text-center mb-16 md:mb-24">
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
            The comparison
          </span>
          <h2 className="mt-4 font-display text-[34px] md:text-[52px] leading-[1.05] tracking-[-0.02em] text-ink">
            <em className="font-serif italic !text-ink">Me</em> vs a regular agency
          </h2>
          <p className="mt-5 max-w-2xl mx-auto text-[15px] md:text-[18px] text-muted-foreground">
            Same deliverable on paper. A very different person doing the actual work.
          </p>
        </div>

        {/* DESKTOP: liquid glass pedestal table */}
        <div className="hidden md:block">
          <div
            className="relative rounded-[40px] border border-white/60 backdrop-blur-[40px]"
            style={{
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.88) 0%, rgba(255,255,255,0.74) 100%)",
              boxShadow:
                "inset 0 1px 1px rgba(255,255,255,0.95), 0 40px 90px -28px rgba(25,70,110,0.18), 0 14px 40px -14px rgba(25,70,110,0.10)",
            }}
          >
            <div className="grid grid-cols-[1fr_220px_160px]">
              {/* Liquid glass pedestal spanning the entire ME column */}
              <div
                className="col-start-2 row-span-full -my-8 mx-1 rounded-[32px] relative z-0"
                style={{
                  background:
                    "linear-gradient(180deg, #9ED8F5 0%, #74C2EB 50%, #4FA9D8 100%)",
                  boxShadow:
                    "0 40px 80px -20px rgba(79,169,216,0.4), inset 0 1px 1px rgba(255,255,255,0.6)",
                  border: "1px solid rgba(255,255,255,0.2)",
                }}
                aria-hidden
              >
                {/* Liquid gloss reflective flare */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent" />
              </div>

              {/* Header row */}
              <div className="col-start-1 h-[120px] flex items-end px-8 pb-6 z-10">
                <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                  What you get
                </span>
              </div>
              <div className="col-start-2 h-[120px] flex flex-col items-center justify-end px-4 pb-6 z-10">
                <div className="bg-white px-3 py-1.5 rounded-full shadow-sm flex items-center gap-1.5">
                  <Sparkles className="h-2.5 w-2.5 text-[#4FA9D8]" strokeWidth={2.5} />
                  <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-ink font-bold">
                    The Pick
                  </span>
                </div>
                <span className="font-serif italic text-4xl text-white mt-4 drop-shadow-sm">
                  Me
                </span>
              </div>
              <div className="col-start-3 h-[120px] flex items-end justify-center px-4 pb-6 z-10">
                <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground text-center leading-tight">
                  Creative<br />Agency
                </span>
              </div>

              {/* Data rows */}
              {rows.map((label, i) => (
                <div key={label} className="contents">
                  <div className="col-start-1 h-16 flex items-center px-8 border-t border-ink/[0.06] z-10">
                    <span className="text-[15px] text-ink leading-snug">{label}</span>
                  </div>
                  <div className="col-start-2 h-16 flex items-center justify-center border-t border-white/10 z-10">
                    <GlassCheck />
                  </div>
                  <div className="col-start-3 h-16 flex items-center justify-center border-t border-ink/[0.06] z-10">
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
              className="rounded-[20px] p-5 border border-white/70 backdrop-blur-[30px]"
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
