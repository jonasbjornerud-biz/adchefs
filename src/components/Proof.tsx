/**
 * Proof section, redesigned as floating screenshot frames.
 *
 * Each "screenshot" is a placeholder frame styled like a redacted Meta Ads
 * Manager row. Replace the `frames` array entries with real screenshot
 * imports when they clear for publishing — the layout is the same.
 */

type Frame = {
  brand: string;
  format: string;
  spend: string;
  roas: string;
  ctr: string;
  result: string;
  thumb?: string; // optional poster image to drop in later
};

const frames: Frame[] = [
  {
    brand: "DTC Wellness",
    format: "UGC · 30s",
    spend: "$17,420",
    roas: "2.52",
    ctr: "4.20%",
    result: "848 purchases",
  },
  {
    brand: "Skincare Brand",
    format: "Static · 9:16",
    spend: "Pending",
    roas: "—",
    ctr: "—",
    result: "Pending publish",
  },
  {
    brand: "Outdoor Apparel",
    format: "Founder · 45s",
    spend: "Pending",
    roas: "—",
    ctr: "—",
    result: "Pending publish",
  },
];

const ScreenshotFrame = ({ f, accent = false }: { f: Frame; accent?: boolean }) => (
  <div
    className="relative rounded-[6px] border border-foreground/10 bg-card overflow-hidden"
    style={{
      boxShadow:
        "0 30px 60px -30px rgba(26,26,26,0.35), 0 12px 24px -12px rgba(26,26,26,0.18)",
    }}
  >
    {/* Browser-style chrome */}
    <div className="flex items-center justify-between gap-3 border-b border-foreground/10 bg-foreground/[0.025] px-4 py-2.5">
      <div className="flex items-center gap-1.5">
        <span className="h-2.5 w-2.5 rounded-full bg-foreground/15" />
        <span className="h-2.5 w-2.5 rounded-full bg-foreground/15" />
        <span className="h-2.5 w-2.5 rounded-full bg-foreground/15" />
      </div>
      <span className="mono text-[9.5px] uppercase tracking-[0.18em] text-muted-foreground truncate">
        ads-manager · {f.brand}
      </span>
      <span className="mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground/70">
        LIVE
      </span>
    </div>

    {/* Thumb placeholder (square-ish creative preview) */}
    <div className="relative aspect-[16/8] bg-gradient-to-br from-foreground/[0.04] to-foreground/[0.08] flex items-center justify-center overflow-hidden">
      {f.thumb ? (
        <img src={f.thumb} alt="" className="w-full h-full object-cover" loading="lazy" decoding="async" />
      ) : (
        <span className="mono text-[10px] uppercase tracking-[0.22em] text-foreground/30">
          Screenshot placeholder
        </span>
      )}
      <span className="absolute top-3 left-3 mono text-[9px] uppercase tracking-[0.18em] text-foreground/50 bg-background/70 backdrop-blur px-2 py-1 rounded-[2px]">
        {f.format}
      </span>
    </div>

    {/* Metric strip */}
    <div className="grid grid-cols-4 divide-x divide-foreground/10 border-t border-foreground/10">
      {[
        { k: "Spend", v: f.spend },
        { k: "ROAS", v: f.roas, accent: accent },
        { k: "CTR", v: f.ctr },
        { k: "Result", v: f.result },
      ].map((c) => (
        <div key={c.k} className="px-3 py-3">
          <div className="mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
            {c.k}
          </div>
          <div
            className={`mt-1 text-[13px] font-semibold tabular-nums truncate ${
              c.accent ? "text-accent" : "text-foreground"
            }`}
          >
            {c.v}
          </div>
        </div>
      ))}
    </div>
  </div>
);

const Proof = () => {
  return (
    <section className="py-16 sm:py-32 bg-background relative overflow-hidden">
      {/* Soft background wash */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(60% 50% at 80% 20%, rgba(158, 216, 245, 0.10) 0%, transparent 70%)",
        }}
      />

      <div className="mx-auto max-w-[1200px] px-6 relative">
        <div className="grid lg:grid-cols-[440px_1fr] gap-12 lg:gap-20 items-start">
          {/* LEFT: copy */}
          <div className="lg:sticky lg:top-28">
            <span className="eyebrow">PROOF</span>
            <h2 className="mt-5 font-display text-[32px] md:text-[44px] leading-[1.05] tracking-[-0.02em] text-foreground">
              Real spend, real <em>results</em>.
            </h2>
            <p className="mt-5 text-[15px] text-muted-foreground leading-relaxed">
              Screenshots straight from the ad accounts. One brand cleared so far. More dropping in as they clear for publishing.
            </p>

            <div className="mt-8 grid grid-cols-3 gap-px bg-foreground/10 border border-foreground/10 rounded-[4px] overflow-hidden">
              {[
                { k: "Best ROAS", v: "2.52" },
                { k: "CTR", v: "4.20%" },
                { k: "Spend", v: "$17K+" },
              ].map((m) => (
                <div key={m.k} className="bg-card px-4 py-4">
                  <div className="mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
                    {m.k}
                  </div>
                  <div className="mt-1 text-[20px] font-semibold tabular-nums text-foreground">
                    {m.v}
                  </div>
                </div>
              ))}
            </div>

            <p className="mt-6 mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              · DTC Wellness · Cleared for publishing
            </p>
          </div>

          {/* RIGHT: floating screenshot stack */}
          <div className="relative min-h-[520px]">
            {/* Frame 1 — featured, brought forward */}
            <div className="lg:absolute lg:top-0 lg:left-0 lg:right-8 lg:rotate-[-1.2deg] z-30">
              <ScreenshotFrame f={frames[0]} accent />
            </div>

            {/* Frame 2 — offset down-right */}
            <div className="mt-6 lg:mt-0 lg:absolute lg:top-[230px] lg:left-16 lg:right-0 lg:rotate-[1.5deg] z-20 opacity-95">
              <ScreenshotFrame f={frames[1]} />
            </div>

            {/* Frame 3 — furthest back */}
            <div className="mt-6 lg:mt-0 lg:absolute lg:top-[460px] lg:left-2 lg:right-16 lg:rotate-[-0.8deg] z-10 opacity-90">
              <ScreenshotFrame f={frames[2]} />
            </div>

            {/* Spacer for absolute layout on desktop */}
            <div aria-hidden className="hidden lg:block" style={{ height: 700 }} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Proof;