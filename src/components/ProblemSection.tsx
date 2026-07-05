import { useEffect, useRef, useState } from "react";

type Variant = "hook" | "story" | "usvsthem" | "unaware" | "ugc" | "stat";

function useInView(threshold = 0.35) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => e.isIntersecting && setInView(true),
      { threshold }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return { ref, inView };
}

const barLine = "h-1 rounded-sm bg-white/25";
const barLineLit = "h-1 rounded-sm bg-[#9ED8F5]/80";

function AdCard({ variant, lit }: { variant: Variant; lit: boolean }) {
  const base =
    "w-full aspect-[9/13] rounded-[6px] border p-2 flex flex-col gap-1.5 transition-all duration-500";
  const litCls = "border-[#9ED8F5]/60 bg-[#9ED8F5]/[0.06] opacity-100";
  const dimCls = "border-white/10 bg-white/[0.03] opacity-30";
  const L = lit ? barLineLit : barLine;

  return (
    <div className={`${base} ${lit ? litCls : dimCls} motion-reduce:transition-none`}>
      {variant === "hook" && (
        <>
          <div className={`${L} w-3/4`} />
          <div className="flex-1 rounded-sm bg-white/5" />
          <div className={`${L} w-1/2`} />
        </>
      )}
      {variant === "story" && (
        <>
          <div className={`${L} w-2/3`} />
          <div className="flex-1 rounded-sm bg-white/5 flex items-end p-1">
            <div className="w-4 h-4 rounded-full bg-white/20" />
          </div>
          <div className={`${L} w-full`} />
          <div className={`${L} w-3/4`} />
        </>
      )}
      {variant === "usvsthem" && (
        <>
          <div className="flex-1 grid grid-cols-2 gap-1">
            <div className="rounded-sm bg-white/5" />
            <div className={`rounded-sm ${lit ? "bg-[#9ED8F5]/20" : "bg-white/10"}`} />
          </div>
          <div className={`${L} w-full`} />
          <div className={`${L} w-1/2`} />
        </>
      )}
      {variant === "unaware" && (
        <>
          <div className={`${L} w-1/3`} />
          <div className={`${L} w-2/3`} />
          <div className="flex-1 rounded-sm bg-white/5" />
          <div className={`${L} w-1/2`} />
        </>
      )}
      {variant === "ugc" && (
        <>
          <div className="flex-1 rounded-sm bg-white/5 flex items-center justify-center">
            <div className={`w-5 h-5 rounded-full ${lit ? "bg-[#9ED8F5]/40" : "bg-white/15"}`} />
          </div>
          <div className={`${L} w-3/4`} />
          <div className={`${L} w-1/2`} />
        </>
      )}
      {variant === "stat" && (
        <>
          <div
            className={`text-[18px] font-semibold leading-none tracking-tight ${
              lit ? "text-[#9ED8F5]" : "text-white/40"
            }`}
            style={{ fontFamily: "'Inter Tight', sans-serif" }}
          >
            2.5x
          </div>
          <div className="flex-1 rounded-sm bg-white/5" />
          <div className={`${L} w-2/3`} />
        </>
      )}
    </div>
  );
}

const distinctVariants: Variant[] = ["story", "usvsthem", "unaware", "ugc", "stat"];
const distinctLabels = ["FOUNDER STORY", "US VS THEM", "PROBLEM UNAWARE", "UGC REACTION", "STAT LEAD"];

const cards: Array<[string, string]> = [
  ["Fatigue in 2 to 3 weeks", "Winners burn out in weeks, not months. A monthly refresh cycle means paying rising CPMs to show old ideas to the same people."],
  ["Iteration is not variation", "New hooks on the same concept read as the same signal. Distinct angles, formats, and stories are what unlock new audiences."],
  ["The brief is the bottleneck", "Editors can cut fast. What brands are missing is someone who reads the numbers and decides what to make next. That is the job I do."],
];

const ProblemSection = () => {
  const { ref, inView } = useInView(0.3);
  // In the identical row, only the middle card stays lit once in view.
  const litIdentical = (i: number) => inView && i === 2;
  // In the distinct row, all cards light up sequentially.
  const [distinctStep, setDistinctStep] = useState(0);
  useEffect(() => {
    if (!inView) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDistinctStep(5);
      return;
    }
    let step = 0;
    const id = setInterval(() => {
      step += 1;
      setDistinctStep(step);
      if (step >= 5) clearInterval(id);
    }, 220);
    return () => clearInterval(id);
  }, [inView]);

  return (
    <section
      ref={ref}
      className="relative overflow-hidden py-24 sm:py-32"
      style={{ background: "#1A1A1A", color: "#F7F6F3" }}
    >
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 20% 10%, rgba(158,216,245,0.08), transparent 60%), radial-gradient(ellipse 55% 40% at 90% 90%, rgba(158,216,245,0.06), transparent 60%)",
        }}
      />

      <div className="relative mx-auto max-w-[1120px] px-6">
        {/* Copy first */}
        <div className="max-w-[760px]">
          <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/55">
            Why creative stalls
          </span>
          <h2
            className="mt-4 text-[32px] md:text-[52px] leading-[1.05] tracking-[-0.02em] font-semibold"
            style={{ fontFamily: "'Inter Tight', sans-serif" }}
          >
            Your ads are not tired. They are{" "}
            <em className="serif-accent">identical</em>.
          </h2>
          <p className="mt-6 text-[15px] md:text-[17px] leading-relaxed max-w-[640px] text-white/70">
            Meta reads your creative to decide who sees it. Ten variations of one idea count
            as one idea. Winning accounts feed the algorithm genuinely different concepts
            every week, and most brands cannot brief that fast.
          </p>
        </div>

        {/* Comparison panel */}
        <div className="mt-12 md:mt-16 rounded-[6px] border border-white/10 bg-white/[0.02] p-5 md:p-8">
          {/* Row 1: iterations */}
          <div className="grid grid-cols-[1fr_auto] gap-6 md:gap-10 items-center">
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/50 mb-3">
                What most brands ship · 5 hooks, 1 concept
              </div>
              <div className="grid grid-cols-5 gap-2 md:gap-3">
                {[0, 1, 2, 3, 4].map((i) => (
                  <AdCard key={i} variant="hook" lit={litIdentical(i)} />
                ))}
              </div>
            </div>
            <div className="text-right pl-2 md:pl-4 border-l border-white/10">
              <div
                className="text-[36px] md:text-[48px] leading-none font-semibold text-white/80"
                style={{ fontFamily: "'Inter Tight', sans-serif" }}
              >
                1
              </div>
              <div className="mt-1 font-mono text-[9px] uppercase tracking-[0.22em] text-white/50">
                Signal
              </div>
            </div>
          </div>

          <div className="h-px w-full bg-white/10 my-8 md:my-10" />

          {/* Row 2: distinct concepts */}
          <div className="grid grid-cols-[1fr_auto] gap-6 md:gap-10 items-center">
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#9ED8F5] mb-3">
                What the algorithm needs · 5 concepts
              </div>
              <div className="grid grid-cols-5 gap-2 md:gap-3">
                {distinctVariants.map((v, i) => (
                  <div key={v} className="flex flex-col gap-1.5">
                    <AdCard variant={v} lit={i < distinctStep} />
                    <div className="hidden md:block font-mono text-[8.5px] uppercase tracking-[0.14em] text-white/45 text-center leading-tight">
                      {distinctLabels[i]}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="text-right pl-2 md:pl-4 border-l border-[#9ED8F5]/30">
              <div
                className="text-[36px] md:text-[48px] leading-none font-semibold text-[#9ED8F5]"
                style={{ fontFamily: "'Inter Tight', sans-serif" }}
              >
                5
              </div>
              <div className="mt-1 font-mono text-[9px] uppercase tracking-[0.22em] text-[#9ED8F5]/80">
                Signals
              </div>
            </div>
          </div>
        </div>

        {/* Three cards */}
        <div className="mt-14 md:mt-20 grid md:grid-cols-3 gap-5">
          {cards.map(([title, body], i) => (
            <div
              key={title}
              className="rounded-[4px] p-6 md:p-7 border border-white/10 bg-white/[0.03]"
              style={{
                transform: inView ? "translateY(0)" : "translateY(20px)",
                opacity: inView ? 1 : 0,
                transition: `transform 700ms cubic-bezier(0.22, 0.61, 0.36, 1) ${400 + i * 120}ms, opacity 700ms ease ${400 + i * 120}ms`,
              }}
            >
              <div className="h-px w-8 mb-5 bg-[#9ED8F5]" aria-hidden />
              <h3
                className="text-[18px] md:text-[20px] leading-tight tracking-[-0.01em] font-semibold"
                style={{ fontFamily: "'Inter Tight', sans-serif" }}
              >
                {title}
              </h3>
              <p className="mt-3 text-[14px] leading-relaxed text-white/70">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProblemSection;