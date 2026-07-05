import { useEffect, useRef, useState } from "react";

function useInView(threshold = 0.25) {
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
      className="relative overflow-hidden py-24 md:py-32"
      style={{ background: "#1A1A1A", color: "#F7F6F3" }}
    >
      {/* Ambient wash */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 45% at 88% 92%, rgba(158,216,245,0.07), transparent 60%), radial-gradient(ellipse 55% 40% at 12% 8%, rgba(158,216,245,0.05), transparent 60%)",
        }}
      />
      {/* Grain */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none opacity-[0.04] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          backgroundSize: "220px 220px",
        }}
      />
      {/* Top / bottom hairlines */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(247,246,243,0.14), transparent)",
          transform: active ? "scaleX(1)" : "scaleX(0)",
          transition: "transform 900ms cubic-bezier(0.22,0.61,0.36,1)",
          transformOrigin: "left",
        }}
      />
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(247,246,243,0.1), transparent)",
          transform: active ? "scaleX(1)" : "scaleX(0)",
          transition: "transform 900ms cubic-bezier(0.22,0.61,0.36,1) 120ms",
          transformOrigin: "right",
        }}
      />

      <div className="relative mx-auto max-w-[1100px] px-6">
        <div
          className="grid grid-cols-1 md:grid-cols-2 gap-14 md:gap-24 items-center"
          style={{
            opacity: active ? 1 : 0,
            transform: active ? "translateY(0)" : "translateY(12px)",
            transition:
              "opacity 700ms ease, transform 900ms cubic-bezier(0.22,0.61,0.36,1)",
          }}
        >
          {/* LEFT — copy */}
          <div className="flex flex-col">
            <span
              className="font-mono uppercase mb-8"
              style={{
                color: "#75726B",
                fontSize: "10px",
                letterSpacing: "0.22em",
              }}
            >
              The problem
            </span>

            <h2
              className="font-display font-medium leading-[1.02] tracking-[-0.02em]"
              style={{
                color: "#F7F6F3",
                fontSize: "clamp(38px, 5vw, 60px)",
              }}
            >
              Iterating is just{" "}
              <em
                className="font-serif italic font-normal"
                style={{ color: "#9ED8F5" }}
              >
                stalling
              </em>
              .
            </h2>

            <p
              className="mt-7 max-w-[420px] leading-[1.7]"
              style={{ color: "rgba(247,246,243,0.6)", fontSize: "16.5px" }}
            >
              Five similar looking variations of the same concept sends Meta a
              single signal. When that winner fatigues, the account hits a wall.
              You don't need more versions, you need distinct concepts and new
              iteration strategies.
            </p>
          </div>

          {/* RIGHT — proof lockup */}
          <div className="relative flex flex-col">
            {/* Row 1 — single signal */}
            <div
              className="flex items-center justify-between py-7"
              style={{
                borderTop: "1px solid rgba(247,246,243,0.12)",
                borderBottom: "1px solid rgba(247,246,243,0.12)",
              }}
            >
              <div className="flex flex-col">
                <span
                  className="font-mono uppercase mb-2"
                  style={{
                    color: "#75726B",
                    fontSize: "10px",
                    letterSpacing: "0.22em",
                  }}
                >
                  Single signal
                </span>
                <span
                  className="font-display font-medium"
                  style={{
                    color: "#F7F6F3",
                    fontSize: "18px",
                    letterSpacing: "-0.01em",
                  }}
                >
                  1 iterative idea
                </span>
              </div>
              <div
                className="h-12 w-12 flex items-center justify-center rounded-[4px]"
                style={{ border: "1px solid rgba(247,246,243,0.2)" }}
              >
                <span
                  className="block w-[6px] h-[6px] rounded-full"
                  style={{ background: "rgba(247,246,243,0.4)" }}
                />
              </div>
            </div>

            {/* Row 2 — five signals */}
            <div
              className="flex items-center justify-between py-7"
              style={{ borderBottom: "1px solid rgba(247,246,243,0.12)" }}
            >
              <div className="flex flex-col">
                <span
                  className="font-mono uppercase mb-2"
                  style={{
                    color: "#9ED8F5",
                    fontSize: "10px",
                    letterSpacing: "0.22em",
                  }}
                >
                  Diversified scale
                </span>
                <span
                  className="font-display font-medium"
                  style={{
                    color: "#F7F6F3",
                    fontSize: "18px",
                    letterSpacing: "-0.01em",
                  }}
                >
                  5 distinct concepts
                </span>
              </div>
              <div className="flex gap-1.5">
                {[0, 1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="h-7 w-7 flex items-center justify-center rounded-[3px]"
                    style={{
                      border:
                        i === 4
                          ? "1px solid rgba(158,216,245,0.9)"
                          : "1px solid rgba(158,216,245,0.3)",
                      opacity: active ? 1 : 0,
                      transform: active ? "translateY(0)" : "translateY(6px)",
                      transition: `opacity 500ms ease ${200 + i * 90}ms, transform 600ms cubic-bezier(0.22,0.61,0.36,1) ${200 + i * 90}ms`,
                    }}
                  >
                    <span
                      className="block w-[5px] h-[5px] rounded-full"
                      style={{
                        background: "#9ED8F5",
                        boxShadow:
                          i === 4 ? "0 0 10px rgba(158,216,245,0.75)" : "none",
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Insight line */}
            <div className="mt-6 flex items-center gap-3">
              <span
                className="block w-1 h-1 rounded-full"
                style={{ background: "#9ED8F5" }}
              />
              <span
                className="font-mono uppercase"
                style={{
                  color: "#75726B",
                  fontSize: "10px",
                  letterSpacing: "0.2em",
                }}
              >
                Iteration burns audiences. Variety unlocks new ones.
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProblemSection;