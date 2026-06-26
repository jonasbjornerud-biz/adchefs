import { ArrowUpRight, TrendingUp } from "lucide-react";

const tileBase =
  "rounded-[4px] border border-white/[0.08] bg-white/[0.02] p-4";
const labelMono =
  "font-mono text-[9px] uppercase tracking-[0.18em] text-white/40";

const KpiCluster = () => (
  <div className={tileBase}>
    <div className="flex items-center justify-between mb-3">
      <span className={labelMono}>LIVE · LAST 7D</span>
      <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-accent">SYNCED</span>
    </div>
    <div className="grid grid-cols-3 gap-2">
      {[
        { k: "ROAS", v: "3.42", d: "+0.4" },
        { k: "CTR", v: "2.18%", d: "+0.3" },
        { k: "HOOK", v: "41%", d: "+6" },
      ].map((m) => (
        <div key={m.k} className="rounded-[4px] border border-white/[0.06] bg-white/[0.02] p-3">
          <div className={labelMono}>{m.k}</div>
          <div className="mt-1 font-display text-[20px] leading-none">{m.v}</div>
          <div className="mt-1 font-mono text-[10px] text-accent">▲ {m.d}</div>
        </div>
      ))}
    </div>
  </div>
);

const PatternCard = () => (
  <div className={tileBase}>
    <div className="flex items-center justify-between mb-3">
      <span className={labelMono}>WINNING PATTERN · #14</span>
      <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-accent">CONFIRMED</span>
    </div>
    <p className="text-[13px] leading-snug text-white/80">
      Hooks opening on a price objection hold <span className="text-accent">2.3×</span> longer than product reveals.
    </p>
    <div className="mt-3 flex flex-wrap gap-1.5">
      {["price-led", "ugc-static", "0-3s cut"].map((t) => (
        <span key={t} className="font-mono text-[9px] uppercase tracking-[0.15em] px-2 py-1 rounded-[4px] border border-white/[0.08] text-white/60">
          {t}
        </span>
      ))}
    </div>
  </div>
);

const BriefSnippet = () => (
  <div className={tileBase}>
    <div className="flex items-center justify-between mb-3">
      <span className={labelMono}>BRIEF · SHOT LIST</span>
      <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-white/40">v2</span>
    </div>
    <ul className="space-y-2 text-[12.5px] text-white/75">
      {[
        ["0:00", "Close up, price tag, snap cut"],
        ["0:02", "UGC hook, eye contact"],
        ["0:05", "Product B-roll, 3 angles"],
        ["0:09", "Receipt overlay, CTA"],
      ].map(([t, l]) => (
        <li key={t} className="flex gap-3">
          <span className="font-mono text-[10px] text-accent w-10 shrink-0 pt-0.5">{t}</span>
          <span className="leading-snug">{l}</span>
        </li>
      ))}
    </ul>
  </div>
);

const DeltaCard = () => (
  <div className={tileBase}>
    <div className="flex items-center justify-between mb-4">
      <span className={labelMono}>BEFORE / AFTER · 14D</span>
      <span className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-[0.15em] text-accent">
        <TrendingUp className="h-3 w-3" /> SHIPPED
      </span>
    </div>
    <div className="grid grid-cols-2 gap-3">
      <div>
        <div className={labelMono}>BEFORE</div>
        <div className="mt-1 font-display text-[22px] leading-none text-white/50">1.8×</div>
        <div className="mt-1 font-mono text-[10px] text-white/40">ROAS</div>
      </div>
      <div>
        <div className={labelMono}>AFTER</div>
        <div className="mt-1 flex items-baseline gap-1.5">
          <span className="font-display text-[22px] leading-none">3.4×</span>
          <ArrowUpRight className="h-4 w-4 text-accent" />
        </div>
        <div className="mt-1 font-mono text-[10px] text-accent">+88%</div>
      </div>
    </div>
  </div>
);

const steps = [
  {
    step: "01",
    title: "Read the numbers",
    body: "Every decision starts in your live dashboard. Hook rate, hold curve, ROAS, CPA and delivery, front and centre. No spreadsheets.",
    visual: <KpiCluster />,
  },
  {
    step: "02",
    title: "Build the angle",
    body: "I read what your winners share, then build the next angles from the patterns in the data, not from taste.",
    visual: <PatternCard />,
  },
  {
    step: "03",
    title: "Brief it like an editor",
    body: "Editors get more than a script. They get shot by shot direction, because I have spent years in the timeline myself.",
    visual: <BriefSnippet />,
  },
  {
    step: "04",
    title: "Ship and measure",
    body: "Cut, reviewed against the brief, and pushed live. The results land back in the dashboard, and the loop starts again.",
    visual: <DeltaCard />,
  },
];

const StepPanel = ({ step, title, body, visual }: {
  step: string;
  title: string;
  body: string;
  visual: React.ReactNode;
}) => (
  <li className="group relative rounded-[4px] bg-[#16161A] border-t border-white/[0.06] shadow-[0_4px_24px_rgba(0,0,0,0.35)] overflow-hidden transition-all duration-300 hover:shadow-[0_8px_32px_rgba(0,0,0,0.45)] hover:border-white/[0.10]">
    <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr]">
      {/* Text half */}
      <div className="relative p-6 md:p-8 flex flex-col justify-center">
        <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/40 group-hover:text-white/50 transition-colors">
          STEP {step}
        </span>
        <div className="mt-2 font-mono text-[48px] md:text-[56px] leading-none text-white/20 group-hover:text-white/30 transition-colors">
          {step}
        </div>
        <h3 className="mt-4 font-display text-[22px] md:text-[26px] leading-tight tracking-tight text-[#F7F6F3]">
          {title}
        </h3>
        <p className="mt-3 font-sans text-[14px] text-white/60 leading-relaxed">
          {body}
        </p>
      </div>

      {/* Vertical accent rule on desktop */}
      <div
        aria-hidden
        className="hidden md:block absolute left-1/3 top-0 bottom-0 w-px bg-[#9ED8F5]/20 group-hover:bg-[#9ED8F5]/35 transition-colors"
      />

      {/* Horizontal accent rule on mobile */}
      <div
        aria-hidden
        className="md:hidden h-px bg-[#9ED8F5]/20 group-hover:bg-[#9ED8F5]/35 transition-colors"
      />

      {/* Data half */}
      <div className="p-6 md:p-8 flex items-center">
        {visual}
      </div>
    </div>
  </li>
);

const EditorEdge = () => (
  <section className="py-16 sm:py-32 bg-[#0E0E10] text-[#F7F6F3]">
      <div className="mx-auto max-w-[1200px] px-6">
        <div className="max-w-2xl mb-14">
          <span className="eyebrow" style={{ background: "transparent", borderColor: "hsl(var(--accent))", color: "hsl(var(--accent))" }}>
            CREATIVE DIRECTION · SEE HOW IT WORKS
          </span>
          <h2 className="mt-5 font-display text-[32px] md:text-[44px] leading-[1.05] tracking-[-0.02em]">
            Creative built on <em style={{ color: "hsl(var(--accent))" }}>data</em>, not taste.
          </h2>
          <p className="mt-5 text-[15px] text-white/60 leading-relaxed">
            Every account gets a private dashboard, free. Hook rate, hold curve, ROAS, CPA and delivery in one place, updated live. I direct the creative off the same numbers you see, so we are always working from one source of truth.
          </p>
        </div>

        <div className="relative">
          {/* Faint accent radial glow behind panels */}
          <div
            aria-hidden
            className="pointer-events-none absolute -left-20 top-1/2 h-[600px] w-[600px] -translate-y-1/2 rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(158,216,245,0.04) 0%, transparent 60%)",
            }}
          />

          <ol className="relative space-y-6 md:space-y-8">
            {steps.map((p) => (
              <StepPanel key={p.step} {...p} />
            ))}
          </ol>
        </div>
      </div>
    </section>
  );

export default EditorEdge;
