import { useEffect, useRef, useState } from "react";

const steps = [
  {
    n: "01",
    title: "Read the account",
    body: "I pull up your active ads and go through the data. Hook rate, hold curve, what is staying alive past three seconds and what is not.",
  },
  {
    n: "02",
    title: "Build the angle",
    body: "From the winners, I figure out the pattern. Then I build the next angles from what is already converting in your account.",
  },
  {
    n: "03",
    title: "Brief the editor",
    body: "The editor gets a proper brief. Hook, shot list, pacing, format. I have been in the timeline long enough to write briefs that translate into cuts.",
  },
  {
    n: "04",
    title: "Ship and learn",
    body: "When it goes live, I track what moves. Every round gets a little tighter because we are building off proof, not guessing again from zero.",
  },
];

const CreativeStrategyLoop = () => {
  const railRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setProgress(1);
      return;
    }
    const onScroll = () => {
      if (!railRef.current) return;
      const rect = railRef.current.getBoundingClientRect();
      const vh = window.innerHeight;
      const total = rect.height - vh * 0.4;
      const scrolled = Math.min(Math.max(vh * 0.6 - rect.top, 0), total);
      setProgress(total > 0 ? scrolled / total : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section className="py-24 sm:py-32" style={{ background: "#F7F6F3", color: "#1A1A1A" }}>
      <div className="mx-auto max-w-[1180px] px-6 grid md:grid-cols-[minmax(0,420px)_1fr] gap-12 md:gap-20">
        {/* Sticky heading */}
        <div className="md:sticky md:top-24 self-start">
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#75726B]">
            The weekly loop
          </span>
          <h2
            className="mt-4 text-[32px] md:text-[46px] leading-[1.05] tracking-[-0.02em] font-semibold"
            style={{ fontFamily: "'Inter Tight', sans-serif" }}
          >
            How a week looks when I run{" "}
            <em>creative</em>.
          </h2>
          <p className="mt-5 text-[15px] md:text-[16px] leading-relaxed text-[#75726B] max-w-[420px]">
            Each loop starts from the last loop's winners, so every batch is built on proof,
            not guesses.
          </p>
          <div className="mt-6 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-[#1A1A1A]/70">
            <span className="inline-block w-6 h-px bg-[#9ED8F5]" />
            Returns to 01 · Next week
          </div>
        </div>

        {/* Steps with progress rail */}
        <div ref={railRef} className="relative pl-8 md:pl-10">
          {/* Track */}
          <div
            className="absolute left-[10px] md:left-[14px] top-2 bottom-2 w-px"
            style={{ background: "rgba(26,26,26,0.12)" }}
            aria-hidden
          />
          {/* Progress fill */}
          <div
            className="absolute left-[10px] md:left-[14px] top-2 w-px origin-top"
            style={{
              background: "#9ED8F5",
              height: `calc(${Math.min(Math.max(progress, 0), 1) * 100}% - 4px)`,
              transition: "height 200ms linear",
            }}
            aria-hidden
          />

          <ol className="space-y-10 md:space-y-14">
            {steps.map((s, i) => {
              const active = progress >= i / steps.length;
              return (
                <li key={s.n} className="relative">
                  <span
                    className="absolute -left-8 md:-left-10 top-1 inline-flex h-[22px] min-w-[22px] items-center justify-center rounded-[4px] px-1.5 font-mono text-[10px] font-semibold tracking-[0.05em] transition-colors duration-300 motion-reduce:transition-none"
                    style={{
                      background: active ? "#9ED8F5" : "#EEEDE8",
                      color: active ? "#1A1A1A" : "#75726B",
                      border: active ? "1px solid #9ED8F5" : "1px solid rgba(26,26,26,0.12)",
                    }}
                  >
                    {s.n}
                  </span>
                  <h3
                    className="text-[22px] md:text-[26px] leading-tight tracking-[-0.015em] font-semibold"
                    style={{ fontFamily: "'Inter Tight', sans-serif" }}
                  >
                    {s.title}
                  </h3>
                  <p className="mt-3 text-[15px] md:text-[16px] leading-relaxed text-[#75726B] max-w-[560px]">
                    {s.body}
                  </p>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
};

export default CreativeStrategyLoop;