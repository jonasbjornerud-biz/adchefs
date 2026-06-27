import { Check, X } from "lucide-react";

const rows = [
  "In-house system building",
  "Briefs written by a former direct response editor",
  "New creative batches shipped every week",
  "Fast creative iterations",
  "Live KPI dashboard, included free",
  "One person who owns the result end to end",
];

const MeCheck = () => (
  <span
    className="relative inline-flex h-9 w-9 items-center justify-center rounded-full text-white"
    style={{
      background:
        "linear-gradient(180deg, #ffffff 0%, #E6F4FB 55%, #BFE3F4 100%)",
      boxShadow:
        "inset 0 1px 1px rgba(255,255,255,0.95), inset 0 -1px 2px rgba(79,169,216,0.35), 0 6px 18px -6px rgba(25,70,110,0.35), 0 0 0 1px rgba(255,255,255,0.35)",
      color: "#1F6A92",
    }}
  >
    <Check className="h-4 w-4" strokeWidth={3.25} />
  </span>
);

const AgencyX = () => (
  <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-ink/15 text-ink/40 bg-white/40">
    <X className="h-4 w-4" strokeWidth={2} />
  </span>
);

const MeVsAgency = () => {
  return (
    <section className="relative py-24 sm:py-36 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none bg-[#F7F6F3]" />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 65% 40%, rgba(158,216,245,0.22), transparent 60%), radial-gradient(ellipse 55% 40% at 15% 90%, rgba(158,216,245,0.10), transparent 55%)",
        }}
        aria-hidden
      />

      <div className="relative mx-auto max-w-[1080px] px-6">
        {/* Header */}
        <div className="text-center mb-20 md:mb-28">
          <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
            The comparison
          </span>
          <h2 className="mt-4 font-display text-[36px] md:text-[56px] leading-[1.02] tracking-[-0.02em] text-ink">
            <em className="font-serif italic !text-ink">Me</em> vs a regular agency
          </h2>
          <p className="mt-5 max-w-xl mx-auto text-[15px] md:text-[17px] text-muted-foreground">
            Same deliverable on paper. A very different person doing the actual work.
          </p>
        </div>

        {/* DESKTOP */}
        <div className="hidden md:block relative">
          {/* Floating ribbon banner above ME column */}
          <div
            className="absolute z-30 left-1/2 -translate-x-1/2 md:left-auto md:translate-x-0"
            style={{ right: "calc(20% - 6px)", top: "-34px" }}
          >
            <div
              className="px-4 py-1.5 rounded-full flex items-center gap-2"
              style={{
                background:
                  "linear-gradient(180deg, #ffffff 0%, #F2FAFE 100%)",
                boxShadow:
                  "0 10px 24px -8px rgba(25,70,110,0.25), inset 0 1px 1px rgba(255,255,255,0.9), 0 0 0 1px rgba(79,169,216,0.25)",
              }}
            >
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{ background: "#4FA9D8", boxShadow: "0 0 8px #4FA9D8" }}
              />
              <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink font-semibold">
                The pick
              </span>
            </div>
          </div>

          <div
            className="relative rounded-[36px] border border-white/70 overflow-hidden backdrop-blur-[40px]"
            style={{
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0.78) 100%)",
              boxShadow:
                "inset 0 1px 1px rgba(255,255,255,0.95), 0 50px 100px -32px rgba(25,70,110,0.22), 0 14px 40px -14px rgba(25,70,110,0.10)",
            }}
          >
            <div className="grid grid-cols-[1fr_220px_180px] relative">
              {/* ME column highlight (inside the card, full height) */}
              <div
                className="col-start-2 row-span-full relative"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(158,216,245,0.55) 0%, rgba(116,194,235,0.45) 55%, rgba(79,169,216,0.40) 100%)",
                  boxShadow:
                    "inset 0 1px 1px rgba(255,255,255,0.7), inset 1px 0 0 rgba(255,255,255,0.5), inset -1px 0 0 rgba(255,255,255,0.5)",
                }}
                aria-hidden
              >
                {/* subtle gloss */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background:
                      "linear-gradient(160deg, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0) 35%)",
                  }}
                />
              </div>

              {/* Header row */}
              <div className="col-start-1 h-20 flex items-end px-10 pb-5 relative z-10">
                <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
                  What you get
                </span>
              </div>
              <div className="col-start-2 h-20 flex items-end justify-center pb-5 relative z-10">
                <span className="font-serif italic text-[28px] leading-none text-ink">
                  Me
                </span>
              </div>
              <div className="col-start-3 h-20 flex items-end justify-center pb-5 relative z-10">
                <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground text-center leading-tight">
                  Creative<br />agency
                </span>
              </div>

              {/* Data rows */}
              {rows.map((label) => (
                <div key={label} className="contents">
                  <div className="col-start-1 h-[72px] flex items-center px-10 border-t border-ink/[0.07] relative z-10">
                    <span className="text-[15px] text-ink leading-snug">{label}</span>
                  </div>
                  <div className="col-start-2 h-[72px] flex items-center justify-center border-t border-white/40 relative z-10">
                    <MeCheck />
                  </div>
                  <div className="col-start-3 h-[72px] flex items-center justify-center border-t border-ink/[0.07] relative z-10">
                    <AgencyX />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* MOBILE */}
        <div className="md:hidden space-y-3">
          {rows.map((label) => (
            <div
              key={label}
              className="rounded-[20px] p-5 border border-white/70 backdrop-blur-[30px]"
              style={{
                background:
                  "linear-gradient(180deg, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0.78) 100%)",
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
                      "linear-gradient(160deg, rgba(158,216,245,0.7) 0%, rgba(79,169,216,0.55) 100%)",
                    boxShadow:
                      "inset 0 1px 1px rgba(255,255,255,0.5), 0 6px 16px -8px rgba(25,70,110,0.35)",
                  }}
                >
                  <span className="font-serif italic text-[16px] text-ink">Me</span>
                  <MeCheck />
                </div>
                <div className="flex items-center justify-between rounded-[14px] px-4 py-3 bg-ink/[0.03] ring-1 ring-ink/10">
                  <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                    Agency
                  </span>
                  <AgencyX />
                </div>
              </div>
            </div>
          ))}
        </div>

        <p className="mt-10 text-center text-[13px] text-muted-foreground italic max-w-xl mx-auto">
          Some agencies are excellent. Most are not built for brands that just want video that ships and works.
        </p>
      </div>
    </section>
  );
};

export default MeVsAgency;
