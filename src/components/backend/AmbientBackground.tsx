import { useEffect, useRef } from "react";

/**
 * Premium, quiet ambient background for backend surfaces.
 * - Paper base (#F7F6F3)
 * - Fine grain overlay
 * - Two very soft accent-blue blobs bleeding in from the top corners
 * - Long, low-amplitude drift (disabled under prefers-reduced-motion)
 * - Cheap scroll-linked shift via a CSS variable updated with rAF
 */
export default function AmbientBackground() {
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        // Translate at ~6% of scroll, capped, for cheap parallax.
        const y = Math.min(window.scrollY * 0.06, 80);
        el.style.setProperty("--ambient-scroll", `${y}px`);
        ticking = false;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      ref={rootRef}
      aria-hidden
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      style={{ background: "#F7F6F3", ["--ambient-scroll" as any]: "0px" }}
    >
      <style>{`
        @keyframes ambientDriftA {
          0%   { transform: translate3d(0,0,0) scale(1); }
          50%  { transform: translate3d(-28px, 22px, 0) scale(1.04); }
          100% { transform: translate3d(0,0,0) scale(1); }
        }
        @keyframes ambientDriftB {
          0%   { transform: translate3d(0,0,0) scale(1); }
          50%  { transform: translate3d(34px, 18px, 0) scale(1.06); }
          100% { transform: translate3d(0,0,0) scale(1); }
        }
        .ambient-blob-a { animation: ambientDriftA 22s ease-in-out infinite; }
        .ambient-blob-b { animation: ambientDriftB 28s ease-in-out infinite; animation-delay: -9s; }
        @media (prefers-reduced-motion: reduce) {
          .ambient-blob-a, .ambient-blob-b { animation: none !important; }
        }
      `}</style>

      {/* Scroll-linked layer wraps both blobs */}
      <div
        className="absolute inset-0"
        style={{ transform: "translate3d(0, calc(var(--ambient-scroll) * -1), 0)" }}
      >
        {/* Top-right ambient blob */}
        <div
          className="ambient-blob-a absolute"
          style={{
            right: "-220px",
            top: "-260px",
            width: "900px",
            height: "720px",
            background:
              "radial-gradient(ellipse at center, rgba(158, 216, 245, 0.32) 0%, rgba(158, 216, 245, 0.12) 35%, transparent 65%)",
            filter: "blur(40px)",
            willChange: "transform",
          }}
        />
        {/* Top-left ambient blob (cooler, smaller) */}
        <div
          className="ambient-blob-b absolute"
          style={{
            left: "-260px",
            top: "-200px",
            width: "720px",
            height: "560px",
            background:
              "radial-gradient(ellipse at center, rgba(205, 233, 248, 0.32) 0%, rgba(205, 233, 248, 0.10) 40%, transparent 70%)",
            filter: "blur(48px)",
            willChange: "transform",
          }}
        />
      </div>

      {/* Fine grain — fixed, non-moving */}
      <div
        className="absolute inset-0"
        style={{
          opacity: 0.05,
          mixBlendMode: "multiply",
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.92' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.6 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>\")",
          backgroundSize: "220px 220px",
        }}
      />
    </div>
  );
}

/**
 * Shared SVG defs used by chart bars: a subtle diagonal hairline pattern in Ink.
 * Drop <ChartPatternDefs /> inside the chart and reference fill="url(#hairline-ink)".
 */
export function ChartPatternDefs() {
  return (
    <defs>
      <pattern
        id="hairline-ink"
        patternUnits="userSpaceOnUse"
        width="6"
        height="6"
        patternTransform="rotate(45)"
      >
        <rect width="6" height="6" fill="#1A1A1A" fillOpacity="0.06" />
        <line x1="0" y1="0" x2="0" y2="6" stroke="#1A1A1A" strokeOpacity="0.55" strokeWidth="1" />
      </pattern>
    </defs>
  );
}