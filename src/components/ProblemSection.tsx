import { useEffect, useRef, useState } from "react";

const identical = ["SAME CONCEPT · NEW HOOK", "SAME CONCEPT · NEW HOOK", "SAME CONCEPT · NEW HOOK", "SAME CONCEPT · NEW HOOK", "SAME CONCEPT · NEW HOOK"];
const distinct = ["FOUNDER STORY", "US VS THEM", "PROBLEM UNAWARE", "UGC REACTION", "STAT LEAD"];

const cards: Array<[string, string]> = [
  ["Fatigue in 2 to 3 weeks", "Winners burn out in weeks, not months. A monthly refresh cycle means paying rising CPMs to show old ideas to the same people."],
  ["Iteration is not variation", "New hooks on the same concept read as the same signal. Distinct angles, formats, and stories are what unlock new audiences."],
  ["The brief is the bottleneck", "Editors can cut fast. What brands are missing is someone who reads the numbers and decides what to make next. That is the job I do."],
];

const ProblemSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => e.isIntersecting && setInView(true),
      { threshold: 0.3 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      className="relative overflow-hidden py-24 sm:py-32"
      style={{ background: "#1A1A1A", color: "#F7F6F3" }}
    >
      {/* ambient wash */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 20% 10%, rgba(158,216,245,0.08), transparent 60%), radial-gradient(ellipse 55% 40% at 90% 90%, rgba(158,216,245,0.06), transparent 60%)",
        }}
      />

      <div className="relative mx-auto max-w-[1120px] px-6">
        {/* Animation */}
        <div className="hidden md:grid grid-cols-2 gap-12 mb-16 motion-reduce:hidden">
          {/* Left: collapse into one */}
          <div className="flex flex-col items-center">
            <div className="relative h-[220px] w-full flex items-center justify-center">
              {identical.map((label, i) => (
                <div
                  key={i}
                  className="absolute rounded-[4px] px-4 py-3 font-mono text-[10px] uppercase tracking-[0.18em]"
                  style={{
                    width: 220,
                    background: "rgba(247,246,243,0.04)",
                    border: "1px solid rgba(247,246,243,0.12)",
                    color: "rgba(247,246,243,0.55)",
                    transform: inView
                      ? `translate(${(i - 2) * 4}px, ${(i - 2) * 4}px)`
                      : `translate(0px, ${i * -2}px)`,
                    transition: `transform 900ms cubic-bezier(0.22, 0.61, 0.36, 1) ${i * 60}ms`,
                    textAlign: "center",
                  }}
                >
                  {label}
                </div>
              ))}
            </div>
            <div
              className="mt-6 font-mono text-[10px] uppercase tracking-[0.22em]"
              style={{ color: "rgba(247,246,243,0.5)" }}
            >
              Reads as one signal
            </div>
          </div>

          {/* Right: fan out into distinct */}
          <div className="flex flex-col items-center">
            <div className="relative h-[220px] w-full flex items-center justify-center">
              {distinct.map((label, i) => {
                const spread = (i - 2) * 46;
                const rot = (i - 2) * 3;
                return (
                  <div
                    key={i}
                    className="absolute rounded-[4px] px-4 py-3 font-mono text-[10px] uppercase tracking-[0.18em]"
                    style={{
                      width: 180,
                      background: "rgba(158,216,245,0.10)",
                      border: "1px solid rgba(158,216,245,0.35)",
                      color: "#9ED8F5",
                      transform: inView
                        ? `translateX(${spread}px) rotate(${rot}deg)`
                        : `translate(0px, 0px) rotate(0deg)`,
                      opacity: inView ? 1 : 0.4,
                      transition: `transform 1000ms cubic-bezier(0.22, 0.61, 0.36, 1) ${i * 90}ms, opacity 700ms ease ${i * 90}ms`,
                      textAlign: "center",
                    }}
                  >
                    {label}
                  </div>
                );
              })}
            </div>
            <div
              className="mt-6 font-mono text-[10px] uppercase tracking-[0.22em]"
              style={{ color: "#9ED8F5" }}
            >
              Reads as five signals
            </div>
          </div>
        </div>

        {/* Copy */}
        <div className="max-w-[760px]">
          <span
            className="font-mono text-[11px] uppercase tracking-[0.18em]"
            style={{ color: "rgba(247,246,243,0.55)" }}
          >
            Why creative stalls
          </span>
          <h2
            className="mt-4 text-[32px] md:text-[52px] leading-[1.05] tracking-[-0.02em] font-semibold"
            style={{ fontFamily: "'Inter Tight', sans-serif" }}
          >
            Your ads are not tired. They are{" "}
            <em
              style={{ fontFamily: "'Instrument Serif', serif", fontStyle: "italic", fontWeight: 400 }}
            >
              identical
            </em>
            .
          </h2>
          <p
            className="mt-6 text-[15px] md:text-[17px] leading-relaxed max-w-[640px]"
            style={{ color: "rgba(247,246,243,0.72)" }}
          >
            Meta reads your creative to decide who sees it. Ten variations of one idea count
            as one idea. Winning accounts feed the algorithm genuinely different concepts
            every week, and most brands cannot brief that fast.
          </p>
        </div>

        {/* Cards */}
        <div className="mt-14 md:mt-20 grid md:grid-cols-3 gap-5">
          {cards.map(([title, body], i) => (
            <div
              key={title}
              className="rounded-[4px] p-6 md:p-7"
              style={{
                background: "rgba(247,246,243,0.03)",
                border: "1px solid rgba(247,246,243,0.10)",
                transform: inView ? "translateY(0)" : "translateY(20px)",
                opacity: inView ? 1 : 0,
                transition: `transform 700ms cubic-bezier(0.22, 0.61, 0.36, 1) ${400 + i * 120}ms, opacity 700ms ease ${400 + i * 120}ms`,
              }}
            >
              <div
                className="h-px w-8 mb-5"
                style={{ background: "#9ED8F5" }}
                aria-hidden
              />
              <h3
                className="text-[18px] md:text-[20px] leading-tight tracking-[-0.01em] font-semibold"
                style={{ fontFamily: "'Inter Tight', sans-serif", color: "#F7F6F3" }}
              >
                {title}
              </h3>
              <p
                className="mt-3 text-[14px] leading-relaxed"
                style={{ color: "rgba(247,246,243,0.68)" }}
              >
                {body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProblemSection;