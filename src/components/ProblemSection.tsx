import { useEffect, useRef, useState } from "react";

function useInView(threshold = 0.3) {
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

// Five distinct pulse peaks — heights and vertical offsets in %.
const peaks = [
  { h: 78, y: 0, o: 0.85 },
  { h: 52, y: 8, o: 0.65 },
  { h: 66, y: -6, o: 0.95 },
  { h: 90, y: 0, o: 0.75 },
  { h: 40, y: -4, o: 0.55 },
];

const cards: Array<[string, string, string]> = [
  [
    "01 / Diagnosis",
    "Fatigue in 2 to 3 weeks",
    "Winners burn out in weeks, not months. A monthly refresh cycle means paying rising CPMs to show old ideas to the same people.",
  ],
  [
    "02 / Principle",
    "Iteration is not variation",
    "New hooks on the same concept read as the same signal. Distinct angles, formats, and stories are what unlock new audiences.",
  ],
  [
    "03 / Cause",
    "The brief is the bottleneck",
    "Editors can cut fast. What brands are missing is someone who reads the numbers and decides what to make next. That is the job I do.",
  ],
];

const ProblemSection = () => {
  const { ref, inView } = useInView(0.25);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  const active = inView || reduced;

  return (
    <section
      ref={ref}
      className="relative overflow-hidden py-24 sm:py-32"
      style={{ background: "#1A1A1A", color: "#F7F6F3" }}
    >
      {/* Ambient wash */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 55% 40% at 15% 10%, rgba(158,216,245,0.06), transparent 60%), radial-gradient(ellipse 50% 35% at 90% 90%, rgba(158,216,245,0.05), transparent 60%)",
        }}
      />

      <div className="relative mx-auto max-w-[1120px] px-6">
        {/* Header */}
        <div className="mb-16 md:mb-20 max-w-[720px]">
          <span
            className="block mb-4 font-mono text-[10px] uppercase tracking-[0.22em]"
            style={{ color: "#75726B" }}
          >
            Algorithmic stagnation
          </span>
          <h2
            className="text-[36px] md:text-[52px] leading-[1.05] tracking-[-0.02em] font-medium"
            style={{ fontFamily: "'Inter Tight', sans-serif" }}
          >
            Why creative <em>stalls</em>.
          </h2>
          <p
            className="mt-6 text-[15px] md:text-[17px] leading-relaxed max-w-[600px]"
            style={{ color: "#75726B" }}
          >
            Meta's algorithm optimizes for data. Ship five hooks of the same conceptual
            core and the machine sees a single data point. To scale, you have to feed it
            genuinely distinct signals.
          </p>
        </div>

        {/* Visual proof: spectral analysis */}
        <div
          className="grid md:grid-cols-2 gap-px mb-20 md:mb-24 rounded-[6px] overflow-hidden"
          style={{
            background: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.12)",
          }}
        >
          {/* Left panel — iterative noise */}
          <div
            className="p-8 md:p-10 flex flex-col"
            style={{ background: "#1A1A1A" }}
          >
            <div className="flex justify-between items-end mb-10">
              <div>
                <span
                  className="block font-mono text-[9px] uppercase tracking-[0.22em]"
                  style={{ color: "#75726B" }}
                >
                  Current state
                </span>
                <h3
                  className="mt-1.5 text-[19px] md:text-[20px] font-medium tracking-[-0.01em]"
                  style={{ fontFamily: "'Inter Tight', sans-serif" }}
                >
                  Iterative noise
                </h3>
              </div>
              <div className="text-right">
                <span
                  className="font-mono text-[13px] tracking-[0.12em]"
                  style={{ color: "#75726B" }}
                >
                  1 signal
                </span>
              </div>
            </div>

            {/* Overlapping identical waves collapsing to a single muddy bar */}
            <div className="flex-1 flex items-center justify-center min-h-[200px]">
              <div className="relative w-full h-32">
                {/* baseline */}
                <div
                  className="absolute inset-x-0 top-1/2 h-px"
                  style={{ background: "rgba(255,255,255,0.06)" }}
                />
                {/* five near-identical wave paths */}
                <svg
                  viewBox="0 0 400 100"
                  className="w-full h-full"
                  fill="none"
                  stroke="#75726B"
                  aria-hidden
                >
                  {[0, 4, 8, 12, 16].map((o, i) => (
                    <path
                      key={i}
                      d={`M0,50 Q100,${50 - 42 + o} 200,50 T400,50`}
                      strokeWidth="1"
                      style={{
                        opacity: active ? 0.28 : 0,
                        transition: `opacity 700ms ease ${i * 80}ms`,
                      }}
                    />
                  ))}
                </svg>
                {/* The single muddy resulting signal */}
                <div className="absolute inset-0 flex items-center">
                  <div
                    className="h-[3px] w-full rounded-full"
                    style={{
                      background:
                        "linear-gradient(90deg, transparent 0%, rgba(117,114,107,0.55) 20%, rgba(117,114,107,0.55) 80%, transparent 100%)",
                      filter: "blur(1.5px)",
                      opacity: active ? 0.9 : 0,
                      transition: "opacity 700ms ease 500ms",
                    }}
                  />
                </div>
              </div>
            </div>

            <p
              className="mt-8 text-[13.5px] leading-relaxed max-w-[440px]"
              style={{ color: "#75726B" }}
            >
              Five variations of the same visual hook act as one frequency. The algorithm
              stays blind to new audiences.
            </p>
          </div>

          {/* Right panel — conceptual breadth */}
          <div
            className="p-8 md:p-10 flex flex-col"
            style={{ background: "#1A1A1A" }}
          >
            <div className="flex justify-between items-end mb-10">
              <div>
                <span
                  className="block font-mono text-[9px] uppercase tracking-[0.22em]"
                  style={{ color: "#9ED8F5" }}
                >
                  What scales
                </span>
                <h3
                  className="mt-1.5 text-[19px] md:text-[20px] font-medium tracking-[-0.01em]"
                  style={{ fontFamily: "'Inter Tight', sans-serif" }}
                >
                  Conceptual breadth
                </h3>
              </div>
              <div className="text-right">
                <span
                  className="font-mono text-[13px] tracking-[0.12em]"
                  style={{ color: "#9ED8F5" }}
                >
                  5 signals
                </span>
              </div>
            </div>

            {/* Five distinct spectrum peaks */}
            <div className="flex-1 flex items-center min-h-[200px] relative">
              <div
                className="absolute inset-x-0 top-1/2 h-px"
                style={{ background: "rgba(255,255,255,0.06)" }}
              />
              <div className="w-full h-32 flex items-center justify-between px-2">
                {peaks.map((p, i) => (
                  <div
                    key={i}
                    className="flex flex-col items-center gap-2"
                    style={{
                      transform: `translateY(${p.y}px)`,
                    }}
                  >
                    <div
                      className="w-px rounded-full"
                      style={{
                        height: active ? `${p.h}px` : "0px",
                        background:
                          "linear-gradient(to top, transparent 0%, #9ED8F5 45%, #9ED8F5 60%, transparent 100%)",
                        opacity: p.o,
                        transition: `height 700ms cubic-bezier(0.22, 0.61, 0.36, 1) ${
                          150 + i * 110
                        }ms`,
                      }}
                    />
                    <div
                      className="w-1.5 h-1.5 rounded-full"
                      style={{
                        background: "#9ED8F5",
                        boxShadow: "0 0 12px rgba(158,216,245,0.85)",
                        opacity: active ? 1 : 0,
                        transform: active ? "scale(1)" : "scale(0.4)",
                        transition: `opacity 400ms ease ${
                          280 + i * 110
                        }ms, transform 500ms cubic-bezier(0.22, 0.61, 0.36, 1) ${
                          280 + i * 110
                        }ms`,
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>

            <p
              className="mt-8 text-[13.5px] leading-relaxed max-w-[440px]"
              style={{ color: "#75726B" }}
            >
              Five genuinely different concepts trigger five unique data points, so Meta
              can find five different winning pockets.
            </p>
          </div>
        </div>

        {/* Insight cards */}
        <div className="grid md:grid-cols-3 gap-4 md:gap-6">
          {cards.map(([label, title, body], i) => (
            <div
              key={title}
              className="rounded-[6px] p-7 md:p-8"
              style={{
                border: "1px solid rgba(255,255,255,0.08)",
                background: "transparent",
                transform: active ? "translateY(0)" : "translateY(16px)",
                opacity: active ? 1 : 0,
                transition: `transform 700ms cubic-bezier(0.22, 0.61, 0.36, 1) ${
                  500 + i * 120
                }ms, opacity 700ms ease ${500 + i * 120}ms`,
              }}
            >
              <span
                className="block mb-5 font-mono text-[10px] uppercase tracking-[0.22em]"
                style={{ color: "#75726B" }}
              >
                {label}
              </span>
              <h4
                className="mb-3 text-[18px] md:text-[19px] font-medium tracking-[-0.01em]"
                style={{ fontFamily: "'Inter Tight', sans-serif" }}
              >
                {title}
              </h4>
              <p
                className="text-[13.5px] leading-relaxed"
                style={{ color: "#75726B" }}
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