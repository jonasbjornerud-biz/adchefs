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

// Sparse, editorial waveform — one dominant curve for "same signal".
const IDENTICAL_WAVE = "M0,60 Q60,30 120,60 T240,60 T360,60 T480,60";
// Five distinct concept fingerprints (small SVG glyphs).
const CONCEPTS = [
  { label: "Founder POV", d: "M4,32 L14,10 L24,26 L34,6 L44,22 L54,14 L64,28" },
  { label: "UGC unboxing", d: "M4,28 Q14,4 24,28 T44,28 T64,28" },
  { label: "Problem/solve", d: "M4,30 L20,30 L20,10 L44,10 L44,30 L64,30" },
  { label: "Comparison", d: "M4,26 L18,26 L18,12 L34,12 L34,26 L50,26 L50,8 L64,8" },
  { label: "Data proof", d: "M4,30 L14,22 L24,26 L34,14 L44,18 L54,6 L64,10" },
];

const cards: Array<[string, string, string]> = [
  [
    "01 — What kills it",
    "Winners burn out in weeks",
    "You find a hook, it prints for two weeks, then CPMs climb and ROAS falls off a cliff. A monthly refresh cycle is already late.",
  ],
  [
    "02 — Why it happens",
    "Iteration is not variation",
    "Five cutdowns of the same concept read as one signal to the algorithm. Real scale comes from genuinely distinct angles, formats and stories.",
  ],
  [
    "03 — What actually fixes it",
    "An operator on the numbers",
    "The brief is the bottleneck. You need someone reading the ad account weekly and deciding what to make next — that is the job I do.",
  ],
];

const ProblemSection = () => {
  const { ref, inView } = useInView(0.2);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  const active = inView || reduced;

  return (
    <section
      ref={ref}
      className="relative overflow-hidden py-24 sm:py-36"
      style={{ background: "#1A1A1A", color: "#F7F6F3" }}
    >
      {/* Vignette + accent wash */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 12% 8%, rgba(158,216,245,0.09), transparent 60%), radial-gradient(ellipse 60% 45% at 92% 92%, rgba(158,216,245,0.07), transparent 60%), radial-gradient(ellipse 100% 60% at 50% 100%, rgba(0,0,0,0.5), transparent 60%)",
        }}
      />
      {/* Grain */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none opacity-[0.05] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          backgroundSize: "220px 220px",
        }}
      />
      {/* Top + bottom hairlines */}
      <div aria-hidden className="absolute inset-x-0 top-0 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(247,246,243,0.12), transparent)" }} />
      <div aria-hidden className="absolute inset-x-0 bottom-0 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(247,246,243,0.08), transparent)" }} />

      <div className="relative mx-auto max-w-[1180px] px-6">
        {/* Ledger header */}
        <div className="flex items-baseline justify-between mb-14 md:mb-20">
          <span
            className="font-mono text-[10px] uppercase tracking-[0.22em]"
            style={{ color: "rgba(247,246,243,0.5)" }}
          >
            <span style={{ color: "#9ED8F5" }}>●</span> &nbsp;The creative wall
          </span>
          <span
            className="hidden md:inline font-mono text-[10px] uppercase tracking-[0.22em]"
            style={{ color: "rgba(247,246,243,0.35)" }}
          >
            Ch. 01 / Diagnosis
          </span>
        </div>

        {/* Headline block */}
        <div className="max-w-[880px] mb-20 md:mb-28">
          <h2
            className="font-display text-[40px] sm:text-[60px] md:text-[76px] leading-[0.98] tracking-[-0.03em] font-medium"
          >
            Every winner burns out.
            <br />
            <span style={{ color: "rgba(247,246,243,0.55)" }}>
              Iteration is why creative{" "}
              <em
                className="font-serif italic"
                style={{ color: "#F7F6F3", fontStyle: "italic" }}
              >
                stalls
              </em>
              .
            </span>
          </h2>
          <p
            className="mt-8 md:mt-10 text-[16px] md:text-[19px] leading-[1.65] max-w-[640px]"
            style={{ color: "rgba(247,246,243,0.65)" }}
          >
            Meta doesn't reward volume, it rewards variety. Ship five cutdowns of the same
            idea and the algorithm reads them as one data point. To keep scaling you have
            to feed it genuinely different signals — new stories, new formats, new
            awareness levels — every week.
          </p>
        </div>

        {/* The proof: side-by-side ledger */}
        <div
          className="relative grid md:grid-cols-[1fr_1px_1fr] gap-y-14 md:gap-y-0 mb-24 md:mb-32"
        >
          {/* Divider */}
          <div
            aria-hidden
            className="hidden md:block h-full w-px"
            style={{
              gridColumn: "2 / 3",
              background:
                "linear-gradient(180deg, transparent, rgba(247,246,243,0.14) 20%, rgba(247,246,243,0.14) 80%, transparent)",
            }}
          />

          {/* LEFT — the trap */}
          <div className="md:pr-14">
            <div className="flex items-baseline justify-between mb-10">
              <span
                className="font-mono text-[10px] uppercase tracking-[0.22em]"
                style={{ color: "rgba(247,246,243,0.45)" }}
              >
                What most brands do
              </span>
              <span
                className="font-mono text-[10px] uppercase tracking-[0.2em]"
                style={{ color: "rgba(247,246,243,0.35)" }}
              >
                Result
              </span>
            </div>

            {/* Giant numeral */}
            <div className="relative flex items-start gap-6 mb-10">
              <div
                className="font-display font-medium leading-[0.85] tracking-[-0.06em]"
                style={{
                  fontSize: "clamp(140px, 18vw, 240px)",
                  color: "rgba(247,246,243,0.08)",
                  WebkitTextStroke: "1px rgba(247,246,243,0.35)",
                }}
              >
                1
              </div>
              <div className="pt-6 md:pt-10">
                <div
                  className="font-mono text-[10px] uppercase tracking-[0.22em]"
                  style={{ color: "rgba(247,246,243,0.45)" }}
                >
                  Signal to Meta
                </div>
                <div
                  className="mt-2 font-display text-[22px] md:text-[26px] tracking-[-0.01em] leading-tight"
                  style={{ color: "#F7F6F3" }}
                >
                  5 hooks,
                  <br />
                  <em className="font-serif italic">one</em> concept.
                </div>
              </div>
            </div>

            {/* Overlapping identical waves collapsing */}
            <div className="relative h-24 mb-8">
              <svg viewBox="0 0 480 120" className="w-full h-full" fill="none" aria-hidden>
                {[0, 1, 2, 3, 4].map((i) => (
                  <path
                    key={i}
                    d={IDENTICAL_WAVE}
                    stroke="rgba(247,246,243,0.4)"
                    strokeWidth="1"
                    style={{
                      transform: active ? `translateY(${(i - 2) * 1.2}px)` : "translateY(0)",
                      opacity: active ? 0.3 : 0,
                      transition: `opacity 900ms ease ${i * 100}ms, transform 900ms ease ${i * 100}ms`,
                    }}
                  />
                ))}
              </svg>
            </div>

            <p
              className="text-[14px] md:text-[15px] leading-[1.7] max-w-[440px]"
              style={{ color: "rgba(247,246,243,0.55)" }}
            >
              Same idea in five outfits. CPMs climb. ROAS falls. You end the month
              blaming the algorithm.
            </p>
          </div>

          {/* RIGHT — what scales */}
          <div className="md:pl-14" style={{ gridColumn: "3 / 4" }}>
            <div className="flex items-baseline justify-between mb-10">
              <span
                className="font-mono text-[10px] uppercase tracking-[0.22em]"
                style={{ color: "#9ED8F5" }}
              >
                What actually scales
              </span>
              <span
                className="font-mono text-[10px] uppercase tracking-[0.2em]"
                style={{ color: "rgba(247,246,243,0.35)" }}
              >
                Result
              </span>
            </div>

            <div className="relative flex items-start gap-6 mb-10">
              <div
                className="font-display font-medium leading-[0.85] tracking-[-0.06em]"
                style={{
                  fontSize: "clamp(140px, 18vw, 240px)",
                  color: "#F7F6F3",
                  textShadow:
                    "0 0 60px rgba(158,216,245,0.28), 0 0 1px rgba(158,216,245,0.6)",
                }}
              >
                5
              </div>
              <div className="pt-6 md:pt-10">
                <div
                  className="font-mono text-[10px] uppercase tracking-[0.22em]"
                  style={{ color: "#9ED8F5" }}
                >
                  Signals to Meta
                </div>
                <div
                  className="mt-2 font-display text-[22px] md:text-[26px] tracking-[-0.01em] leading-tight"
                  style={{ color: "#F7F6F3" }}
                >
                  5 concepts,
                  <br />
                  <em className="font-serif italic">five</em> pockets.
                </div>
              </div>
            </div>

            {/* Five distinct concept glyphs */}
            <div className="relative h-24 mb-8 grid grid-cols-5 gap-2">
              {CONCEPTS.map((c, i) => (
                <div
                  key={c.label}
                  className="relative flex flex-col items-start justify-end"
                  style={{
                    opacity: active ? 1 : 0,
                    transform: active ? "translateY(0)" : "translateY(10px)",
                    transition: `opacity 600ms ease ${200 + i * 110}ms, transform 700ms cubic-bezier(0.22,0.61,0.36,1) ${200 + i * 110}ms`,
                  }}
                >
                  <svg viewBox="0 0 68 36" className="w-full h-10" fill="none" aria-hidden>
                    <path
                      d={c.d}
                      stroke="#9ED8F5"
                      strokeWidth="1.25"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span
                    className="mt-2 font-mono text-[8.5px] uppercase tracking-[0.18em] block"
                    style={{ color: "rgba(247,246,243,0.5)" }}
                  >
                    {c.label}
                  </span>
                </div>
              ))}
            </div>

            <p
              className="text-[14px] md:text-[15px] leading-[1.7] max-w-[440px]"
              style={{ color: "rgba(247,246,243,0.65)" }}
            >
              Five genuinely different swings. Five audience pockets to find. The
              account keeps compounding instead of stalling out.
            </p>
          </div>
        </div>

        {/* Insight cards — ledger entries */}
        <div className="grid md:grid-cols-3 gap-0 md:gap-px" style={{ background: "rgba(247,246,243,0.08)", border: "1px solid rgba(247,246,243,0.08)", borderRadius: "6px", overflow: "hidden" }}>
          {cards.map(([label, title, body], i) => (
            <div
              key={title}
              className="p-8 md:p-10 relative group"
              style={{
                background: "#1A1A1A",
                transform: active ? "translateY(0)" : "translateY(14px)",
                opacity: active ? 1 : 0,
                transition: `transform 700ms cubic-bezier(0.22, 0.61, 0.36, 1) ${500 + i * 120}ms, opacity 700ms ease ${500 + i * 120}ms, background-color 400ms ease`,
              }}
            >
              <div className="flex items-center justify-between mb-8">
                <span
                  className="font-mono text-[10px] uppercase tracking-[0.22em]"
                  style={{ color: "rgba(247,246,243,0.45)" }}
                >
                  {label}
                </span>
                <span
                  className="h-px w-8"
                  style={{ background: "rgba(158,216,245,0.6)" }}
                />
              </div>
              <h4
                className="font-display text-[22px] md:text-[24px] font-medium tracking-[-0.015em] leading-[1.15] mb-4"
                style={{ color: "#F7F6F3" }}
              >
                {title}
              </h4>
              <p
                className="text-[14px] md:text-[15px] leading-[1.7]"
                style={{ color: "rgba(247,246,243,0.6)" }}
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