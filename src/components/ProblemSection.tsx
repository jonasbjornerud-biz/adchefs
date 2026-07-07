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
      className="relative overflow-hidden py-14 md:py-[88px]"
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
          <div className="flex flex-col max-w-[460px]">
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

          {/* RIGHT — comparison strip */}
          <ComparisonStrip active={active} />
        </div>
      </div>
    </section>
  );
};

/* ---------- Mini ad frames ---------- */

const FRAME_BASE =
  "relative rounded-[4px] overflow-hidden w-11 h-[78px] shrink-0";

const IDENTICAL_SRC =
  "https://res.cloudinary.com/dqnifzwda/image/upload/v1776562215/GIF14_ajoqr7.gif";

const IDENTICAL_OPACITIES = [1, 0.75, 0.5, 0.3, 0.15];

const DISTINCT_MEDIA: { type: "image" | "video"; src: string }[] = [
  { type: "image", src: "https://res.cloudinary.com/dqnifzwda/image/upload/v1776562212/GIF11_ts3qsg.gif" },
  { type: "image", src: "https://res.cloudinary.com/dqnifzwda/image/upload/v1773785219/GIF12_zcuv10.webp" },
  { type: "video", src: "https://res.cloudinary.com/dqnifzwda/video/upload/v1773501822/GIF9_u1acww.webm" },
  { type: "video", src: "https://res.cloudinary.com/dqnifzwda/video/upload/v1773501817/GIF10_mgrxbx.webm" },
  { type: "image", src: "https://res.cloudinary.com/dqnifzwda/image/upload/v1776562702/GIF15_or6gkv.gif" },
];

const ComparisonStrip = ({ active }: { active: boolean }) => {
  return (
    <div className="flex flex-col min-w-0">
      {/* Eyebrow */}
      <span
        className="font-mono uppercase mb-[14px]"
        style={{
          color: "#75726B",
          fontSize: "10px",
          letterSpacing: "0.22em",
        }}
      >
        What Meta actually sees
      </span>

      {/* Strip */}
      <div className="flex overflow-x-auto md:overflow-visible pb-2 md:pb-0 -mx-6 px-6 md:mx-0 md:px-0">
        <div className="flex items-center gap-2">
          {/* Left half */}
          <div className="flex flex-col">
            <div className="flex gap-2">
              {IDENTICAL_OPACITIES.map((op, i) => (
                <div
                  key={`identical-${i}`}
                  className={FRAME_BASE}
                  style={{
                    background: "rgba(247,246,243,0.04)",
                    border: "1px solid rgba(247,246,243,0.10)",
                    opacity: active ? op : 0,
                    transform: active ? "translateY(0)" : "translateY(4px)",
                    transition: `opacity 250ms ease-out ${i * 30}ms, transform 250ms ease-out ${i * 30}ms`,
                  }}
                >
                  <img
                    src={IDENTICAL_SRC}
                    alt=""
                    loading="lazy"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.display = "none";
                    }}
                    className="absolute inset-0 w-full h-full object-cover"
                    style={{ filter: "grayscale(1)" }}
                  />
                </div>
              ))}
            </div>
            <span
              className="font-mono uppercase mt-[10px]"
              style={{
                color: "#75726B",
                fontSize: "9px",
                letterSpacing: "0.18em",
              }}
            >
              1 signal · same concept, fatiguing
            </span>
          </div>

          {/* Vertical divider */}
          <div
            className="shrink-0 flex items-center justify-center"
            style={{ width: "24px", height: "78px" }}
          >
            <div
              className="relative h-full"
              style={{ width: "1px", background: "rgba(158,216,245,0.40)" }}
            >
              <span
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full block"
                style={{
                  width: "5px",
                  height: "5px",
                  background: "#9ED8F5",
                }}
              />
            </div>
          </div>

          {/* Right half */}
          <div className="flex flex-col">
            <div className="flex gap-2">
              {DISTINCT_MEDIA.map((media, i) => (
                <div
                  key={`distinct-${i}`}
                  className={FRAME_BASE}
                  style={{
                    background: "rgba(247,246,243,0.04)",
                    border: "1px solid rgba(158,216,245,0.25)",
                    opacity: active ? 1 : 0,
                    transform: active ? "translateY(0)" : "translateY(4px)",
                    transition: `opacity 250ms ease-out ${150 + i * 30}ms, transform 250ms ease-out ${150 + i * 30}ms`,
                  }}
                >
                  {media.type === "video" ? (
                    <video
                      src={media.src}
                      autoPlay
                      loop
                      muted
                      playsInline
                      preload="metadata"
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  ) : (
                    <img
                      src={media.src}
                      alt=""
                      loading="lazy"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).style.display = "none";
                      }}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  )}
                </div>
              ))}
            </div>
            <span
              className="font-mono uppercase mt-[10px]"
              style={{
                color: "#9ED8F5",
                fontSize: "9px",
                letterSpacing: "0.18em",
              }}
            >
              5 signals · distinct concepts, testing
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProblemSection;