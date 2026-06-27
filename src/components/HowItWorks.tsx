import { cn } from "@/lib/utils";
import type React from "react";

/* ------------------------------ Section ------------------------------ */

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-16 sm:py-32 bg-background">
      <div className="mx-auto max-w-[1200px] px-6">
        <div className="max-w-2xl mb-12 md:mb-16">
          <span className="eyebrow">EDITOR PLACEMENT · HOW IT WORKS</span>
          <h2 className="mt-5 font-display text-[32px] md:text-[44px] leading-[1.05] tracking-[-0.02em] text-foreground">
            Your editor, <em>handled</em> for you.
          </h2>
          <p className="mt-5 text-[15px] text-muted-foreground leading-relaxed">
            Your editor is yours alone. Not shared, not rotating, not freelancing on the side. I hire them, train them, and place them in your team like a contractor you never had to recruit. They sit in your Slack, learn your brand, and grow with your account.
          </p>
        </div>

        <div className="relative mx-auto grid w-full grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-6">
          <FeatureCard className="md:col-span-2">
            <VettedVisual />
            <Caption
              eyebrow="STAGE 01 · VETTED"
              title="Hundreds in. One out."
              body="A real recruiting funnel — skills tests, brand voice trials, paid trial edits. Only editors who can ship reach your account."
            />
          </FeatureCard>

          <FeatureCard className="md:col-span-2">
            <TrainedVisual />
            <Caption
              eyebrow="STAGE 02 · TRAINED"
              title="Skill compounding"
              body="Direct response training on hooks, hold curves, sound design. The work gets sharper the longer they're with you."
            />
          </FeatureCard>

          <FeatureCard className="md:col-span-2">
            <DedicatedVisual />
            <Caption
              eyebrow="STAGE 03 · DEDICATED"
              title="One brand. Not five."
              body="Your editor works on your account only. No freelance side gigs, no rotating pool, no shared attention."
            />
          </FeatureCard>

          <FeatureCard className="sm:col-span-2 md:col-span-3 p-0">
            <EmbeddedVisual />
          </FeatureCard>

          <FeatureCard className="sm:col-span-2 md:col-span-3 p-0">
            <ManagedVisual />
          </FeatureCard>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;

/* ------------------------------ Primitives ------------------------------ */

function FeatureCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-[4px] border border-foreground/10 bg-paper px-8 pt-8 pb-6 transition-colors hover:border-foreground/20",
        className,
      )}
    >
      {children}
    </div>
  );
}

function Caption({
  eyebrow,
  title,
  body,
  align = "center",
}: {
  eyebrow: string;
  title: string;
  body: string;
  align?: "center" | "left";
}) {
  return (
    <div className={cn("relative mt-8 space-y-2", align === "center" ? "text-center" : "text-left")}>
      <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-accent-deep">
        {eyebrow}
      </span>
      <h3 className="font-display text-[20px] leading-tight tracking-tight text-foreground">
        {title}
      </h3>
      <p className="text-[14px] text-muted-foreground leading-relaxed">{body}</p>
    </div>
  );
}

/* ------------------------------ Visuals ------------------------------ */

function VettedVisual() {
  // Funnel-as-counter: 4 layers narrow from many to one, with counts.
  const rows = [
    { w: "100%", label: "847 applied" },
    { w: "62%", label: "Skills test" },
    { w: "32%", label: "Brand trial" },
    { w: "10%", label: "Paid trial edit" },
  ];
  return (
    <div className="relative mx-auto flex h-40 w-full max-w-[260px] flex-col items-center justify-center gap-1.5">
      <div className="pointer-events-none absolute inset-0 scale-125 bg-radial from-foreground/[0.04] via-transparent to-transparent blur-xl" />
      {rows.map((r, i) => (
        <div
          key={r.label}
          className="flex h-7 items-center justify-between rounded-[2px] border border-foreground/10 bg-background/60 px-2.5 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground"
          style={{ width: r.w }}
        >
          <span>{r.label}</span>
          {i === rows.length - 1 && (
            <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
          )}
        </div>
      ))}
      <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-foreground">
        1 placed
      </div>
    </div>
  );
}

function TrainedVisual() {
  // Compounding bars: hold-curve / hook-rate climbing over weeks.
  const bars = [22, 34, 28, 46, 58, 54, 72, 86];
  return (
    <div className="relative h-40 w-full">
      <div className="pointer-events-none absolute inset-0 scale-125 bg-radial from-foreground/[0.04] via-transparent to-transparent blur-xl" />
      <div className="absolute left-2 top-2 font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
        Hook rate · 8w
      </div>
      <div className="absolute right-2 top-2 font-mono text-[10px] uppercase tracking-[0.15em] text-accent-deep">
        +291%
      </div>
      <div className="absolute inset-x-0 bottom-0 flex h-28 items-end justify-center gap-1.5 px-2">
        {bars.map((h, i) => (
          <div
            key={i}
            className={cn(
              "w-5 rounded-t-[2px] border-t border-foreground/10",
              i === bars.length - 1 ? "bg-accent" : "bg-foreground/10",
            )}
            style={{ height: `${h}%` }}
          />
        ))}
      </div>
      {/* baseline */}
      <div className="absolute inset-x-2 bottom-0 h-px bg-foreground/10" />
    </div>
  );
}

function DedicatedVisual() {
  // Single ring with one brand badge inside; competing brand chips orbit dimmed.
  return (
    <div className="relative mx-auto flex h-40 w-full items-center justify-center">
      <div className="pointer-events-none absolute inset-0 scale-125 bg-radial from-foreground/[0.05] via-transparent to-transparent blur-xl" />
      {/* Dashed orbit */}
      <div className="relative flex size-32 items-center justify-center rounded-full border border-dashed border-foreground/20">
        {/* center: the editor */}
        <div className="flex size-14 items-center justify-center rounded-full border border-foreground/15 bg-background shadow-sm">
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-foreground">
            Your<br />brand
          </span>
        </div>
        {/* orbit chips — faded */}
        {[
          { top: "-8px", left: "50%", t: "Brand B" },
          { top: "50%", right: "-12px", t: "Brand C" },
          { bottom: "-8px", left: "50%", t: "Brand D" },
          { top: "50%", left: "-12px", t: "Brand E" },
        ].map((p, i) => (
          <div
            key={i}
            className="absolute -translate-x-1/2 -translate-y-1/2 rounded-[2px] border border-foreground/10 bg-background/80 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.15em] text-muted-foreground/40 line-through"
            style={p as React.CSSProperties}
          >
            {p.t}
          </div>
        ))}
      </div>
    </div>
  );
}

function EmbeddedVisual() {
  // Split: copy left, "channels" panel right (Slack/Notion/Drive rows).
  return (
    <div className="grid h-full sm:grid-cols-2">
      <div className="relative z-10 space-y-5 py-8 ps-8 pe-2">
        <div className="flex size-12 items-center justify-center rounded-full border border-foreground/15 bg-background shadow-sm">
          <svg viewBox="0 0 24 24" fill="none" className="size-5 text-foreground/80" aria-hidden="true">
            <path d="M4 7h16M4 12h16M4 17h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>
        <div className="space-y-2">
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-accent-deep">
            STAGE 04 · EMBEDDED
          </span>
          <h3 className="font-display text-[20px] leading-tight tracking-tight text-foreground">
            Inside your stack
          </h3>
          <p className="text-[14px] text-muted-foreground leading-relaxed">
            Your editor sits in your Slack, your Notion, your brand folder. Briefed where your team already works — no extra portal to babysit.
          </p>
        </div>
      </div>
      <div className="relative mask-r-from-90% mask-b-from-90%">
        <div className="absolute right-0 bottom-0 w-[92%] max-w-[320px] rounded-tl-md border border-foreground/10 bg-background p-3 shadow-sm">
          <div className="space-y-2">
            {[
              { tag: "#brand-creative", msg: "Cut 04 hits — pushing to Drive", time: "2m" },
              { tag: "Notion · Brief 07", msg: "Hook locked · 1.4s", time: "14m" },
              { tag: "Drive · /winners/Q4", msg: "3 new uploads", time: "1h" },
            ].map((r) => (
              <div key={r.tag} className="flex items-center justify-between gap-3 rounded-[2px] border border-foreground/10 bg-paper px-2.5 py-2">
                <div className="min-w-0">
                  <div className="font-mono text-[9px] uppercase tracking-[0.15em] text-accent-deep">
                    {r.tag}
                  </div>
                  <div className="truncate text-[12px] text-foreground/80">{r.msg}</div>
                </div>
                <div className="font-mono text-[10px] text-muted-foreground">{r.time}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ManagedVisual() {
  // Split: copy left, manager dashboard chip with QA rows right.
  return (
    <div className="grid h-full sm:grid-cols-2">
      <div className="relative z-10 space-y-5 py-8 ps-8 pe-2">
        <div className="flex size-12 items-center justify-center rounded-full border border-foreground/15 bg-background shadow-sm">
          <svg viewBox="0 0 24 24" fill="none" className="size-5 text-foreground/80" aria-hidden="true">
            <path d="M12 3l8 4v6c0 5-3.5 7.5-8 8-4.5-.5-8-3-8-8V7l8-4z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
            <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div className="space-y-2">
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-accent-deep">
            STAGE 05 · MANAGED
          </span>
          <h3 className="font-display text-[20px] leading-tight tracking-tight text-foreground">
            The hard parts stay with me
          </h3>
          <p className="text-[14px] text-muted-foreground leading-relaxed">
            Recruiting, mentoring, performance reviews, replacements. You get the output, I carry the people management.
          </p>
        </div>
      </div>
      <div className="relative mask-r-from-90% mask-b-from-90%">
        <div className="absolute right-0 bottom-0 w-[92%] max-w-[320px] rounded-tl-md border border-foreground/10 bg-background p-3 shadow-sm">
          <div className="mb-2 flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-foreground">
              QA · this week
            </span>
            <span className="font-mono text-[10px] text-accent-deep">12/12 ✓</span>
          </div>
          <div className="space-y-1.5">
            {[
              { l: "Brand voice", v: "Pass" },
              { l: "Hook clarity", v: "Pass" },
              { l: "Pacing", v: "Pass" },
              { l: "Output cadence", v: "On track" },
            ].map((r) => (
              <div key={r.l} className="flex items-center justify-between rounded-[2px] border border-foreground/10 bg-paper px-2.5 py-1.5">
                <span className="text-[12px] text-foreground/80">{r.l}</span>
                <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-accent-deep">
                  {r.v}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
