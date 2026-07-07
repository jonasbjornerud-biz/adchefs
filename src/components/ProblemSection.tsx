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
      className="relative overflow-hidden py-20 md:py-[120px]"
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
          className="grid grid-cols-1 md:grid-cols-[45%_55%] gap-14 md:gap-20 items-center"
          style={{
            opacity: active ? 1 : 0,
            transform: active ? "translateY(0)" : "translateY(12px)",
            transition:
              "opacity 700ms ease, transform 900ms cubic-bezier(0.22,0.61,0.36,1)",
          }}
        >
          {/* LEFT — copy */}
          <div className="flex flex-col max-w-[480px]">
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

          {/* RIGHT — comparison panel */}
          <div
            className="relative rounded-[4px] p-6 md:p-8"
            style={{
              background: "rgba(247,246,243,0.03)",
              border: "1px solid rgba(247,246,243,0.08)",
            }}
          >
            {/* BLOCK 1 — failure state */}
            <div className="group/block pb-8">
              <div className="flex items-center justify-between mb-5">
                <span
                  className="font-mono uppercase"
                  style={{
                    color: "#75726B",
                    fontSize: "11px",
                    letterSpacing: "0.15em",
                  }}
                >
                  Most accounts
                </span>
                <span
                  className="font-mono uppercase"
                  style={{
                    color: "#F7F6F3",
                    fontSize: "11px",
                    letterSpacing: "0.15em",
                  }}
                >
                  1 signal
                </span>
              </div>
              <div className="flex gap-2 mb-5">
                {[1, 0.85, 0.7, 0.55, 0.4].map((op, i) => (
                  <div
                    key={i}
                    className="rounded-[4px] w-11 h-11 md:w-14 md:h-14 transition-transform duration-150 ease-out group-hover/block:-translate-y-0.5"
                    style={{
                      background: "rgba(247,246,243,0.06)",
                      border: "1px solid rgba(247,246,243,0.1)",
                      opacity: op,
                    }}
                  />
                ))}
              </div>
              <p
                className="leading-[1.6]"
                style={{ color: "#75726B", fontSize: "14px" }}
              >
                Five lookalike variations. Meta reads them as one signal.
              </p>
            </div>

            <div
              aria-hidden
              className="h-px w-full"
              style={{ background: "rgba(247,246,243,0.08)" }}
            />

            {/* BLOCK 2 — the AdChefs way */}
            <div className="group/block pt-8 pb-8">
              <div className="flex items-center justify-between mb-5">
                <span
                  className="font-mono uppercase"
                  style={{
                    color: "#9ED8F5",
                    fontSize: "11px",
                    letterSpacing: "0.15em",
                  }}
                >
                  Diversified scale
                </span>
                <span
                  className="font-mono uppercase"
                  style={{
                    color: "#9ED8F5",
                    fontSize: "11px",
                    letterSpacing: "0.15em",
                  }}
                >
                  5 signals
                </span>
              </div>
              <div className="flex gap-2 mb-5">
                {[
                  { background: "#9ED8F5", border: "1px solid #9ED8F5" },
                  { background: "transparent", border: "1px solid #9ED8F5" },
                  {
                    background: "rgba(158,216,245,0.15)",
                    border: "1px solid rgba(158,216,245,0.15)",
                  },
                  { background: "#F7F6F3", border: "1px solid #F7F6F3" },
                  { background: "transparent", border: "1px solid #F7F6F3" },
                ].map((s, i) => (
                  <div
                    key={i}
                    className="rounded-[4px] w-11 h-11 md:w-14 md:h-14 transition-transform duration-150 ease-out group-hover/block:-translate-y-0.5"
                    style={{
                      background: s.background,
                      border: s.border,
                    }}
                  />
                ))}
              </div>
              <p
                className="leading-[1.6]"
                style={{ color: "rgba(247,246,243,0.7)", fontSize: "14px" }}
              >
                Five distinct concepts. Five chances to find a new winner.
              </p>
            </div>

            <div
              aria-hidden
              className="h-px w-full"
              style={{ background: "rgba(247,246,243,0.08)" }}
            />

            {/* FOOTER */}
            <div className="pt-6 flex items-center justify-center gap-2.5">
              <span
                className="block rounded-full"
                style={{
                  width: "6px",
                  height: "6px",
                  background: "#9ED8F5",
                }}
              />
              <span
                className="font-mono uppercase"
                style={{
                  color: "#75726B",
                  fontSize: "10px",
                  letterSpacing: "0.15em",
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