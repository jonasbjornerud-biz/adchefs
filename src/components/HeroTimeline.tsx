import { useEffect, useState } from "react";

const FPS = 25;
const LOOP_FRAMES = 60 * FPS; // 1500 frames = 60s

const formatTC = (frames: number) => {
  const ff = frames % FPS;
  const totalSec = Math.floor(frames / FPS);
  const ss = totalSec % 60;
  const mm = Math.floor(totalSec / 60) % 60;
  const hh = Math.floor(totalSec / 3600);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(hh)}:${pad(mm)}:${pad(ss)}:${pad(ff)}`;
};

const HeroTimeline = () => {
  const [frames, setFrames] = useState(0);

  useEffect(() => {
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setFrames(Math.floor(LOOP_FRAMES * 0.3));
      return;
    }
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const elapsed = (now - start) / 1000;
      setFrames(Math.floor(elapsed * FPS) % LOOP_FRAMES);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  // Generate timecode labels for major ticks (every 144px, +96 frames each)
  const labels = Array.from({ length: 30 }, (_, i) => formatTC(i * 96));

  return (
    <div
      aria-hidden
      className="hero-timeline hidden md:block absolute left-0 right-0 pointer-events-none"
      style={{ bottom: 500, height: 80, zIndex: 1 }}
    >
      <style>{`
        @keyframes timelineFadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes timelinePlayhead {
          from { left: 0%; }
          to   { left: 100%; }
        }
        .hero-timeline {
          opacity: 0;
          animation: timelineFadeIn 1.2s ease-out 0.2s forwards;
        }
        .timeline-playhead {
          animation: timelinePlayhead 60s linear infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .hero-timeline { opacity: 1; animation: none; }
          .timeline-playhead { animation: none !important; left: 30% !important; }
        }
      `}</style>

      {/* Ruler line */}
      <div
        className="absolute left-0 right-0"
        style={{ top: 30, height: 1, background: "#1A1A1A", opacity: 0.12 }}
      />

      {/* Minor ticks (every 24px, 6px tall) */}
      <div
        className="absolute left-0 right-0"
        style={{
          top: 31,
          height: 6,
          backgroundImage:
            "repeating-linear-gradient(to right, rgba(26,26,26,0.10) 0 1px, transparent 1px 24px)",
        }}
      />

      {/* Major ticks (every 144px, 12px tall) */}
      <div
        className="absolute left-0 right-0"
        style={{
          top: 31,
          height: 12,
          backgroundImage:
            "repeating-linear-gradient(to right, rgba(26,26,26,0.18) 0 1px, transparent 1px 144px)",
        }}
      />

      {/* Clip markers (static, just above the line) */}
      <div
        className="absolute"
        style={{
          left: "18%",
          top: 25,
          width: 78,
          height: 3,
          borderRadius: 2,
          background: "#9ED8F5",
          opacity: 0.4,
        }}
      />
      <div
        className="absolute"
        style={{
          left: "44%",
          top: 25,
          width: 64,
          height: 3,
          borderRadius: 2,
          background: "#1A1A1A",
          opacity: 0.12,
        }}
      />

      {/* Timecode labels under major ticks */}
      <div className="absolute left-0 right-0 overflow-hidden" style={{ top: 46, height: 14 }}>
        {labels.map((tc, i) => (
          <span
            key={i}
            className="mono absolute"
            style={{
              left: i * 144 + 4,
              top: 0,
              fontSize: 9,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "#75726B",
              opacity: 0.5,
              whiteSpace: "nowrap",
            }}
          >
            {tc}
          </span>
        ))}
      </div>

      {/* Playhead (glow + line + triangle) */}
      <div
        className="timeline-playhead absolute"
        style={{ top: 6, left: 0, width: 0, height: 74 }}
      >
        {/* Glow */}
        <div
          className="absolute"
          style={{
            top: 0,
            left: -2,
            width: 4,
            height: 74,
            background: "#9ED8F5",
            opacity: 0.25,
            filter: "blur(4px)",
          }}
        />
        {/* Line */}
        <div
          className="absolute"
            style={{
            top: 0,
            left: 0,
            width: 1,
            height: 74,
            background: "#9ED8F5",
            opacity: 0.9,
          }}
        />
        {/* Triangle marker */}
        <div
          className="absolute"
          style={{
            top: -2,
            left: -4,
            width: 0,
            height: 0,
            borderLeft: "4px solid transparent",
            borderRight: "4px solid transparent",
            borderTop: "8px solid #9ED8F5",
            opacity: 0.9,
          }}
        />
      </div>

      {/* Live timecode readout */}
      <div
        className="mono absolute"
        style={{
          right: 16,
          top: 8,
          fontSize: 11,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: "#1A1A1A",
          opacity: 0.35,
        }}
      >
        {formatTC(frames)}
      </div>
    </div>
  );
};

export default HeroTimeline;