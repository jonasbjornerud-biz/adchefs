import { useEffect, useState } from "react";
import { useScrollTimecode } from "./useTimecode";

const CLIPS = [
  { id: "hero", label: "HERO" },
  { id: "proof", label: "PROOF" },
  { id: "method-story", label: "METHOD" },
  { id: "services", label: "SERVICES" },
  { id: "work", label: "WORK" },
  { id: "compare", label: "COMPARE" },
  { id: "booking", label: "BOOK" },
  { id: "faq", label: "FAQ" },
];

const TimelineBar = () => {
  const { tc, progress } = useScrollTimecode();
  const [active, setActive] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY + window.innerHeight * 0.35;
      let idx = 0;
      CLIPS.forEach((c, i) => {
        const el = document.getElementById(c.id);
        if (el && el.offsetTop <= y) idx = i;
      });
      setActive(idx);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const jump = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="es-timeline-bar" role="navigation" aria-label="Section timeline">
      <span className="es-timecode">TC</span>
      <div className="es-timeline-track">
        {CLIPS.map((c, i) => (
          <button
            key={c.id}
            type="button"
            className={`es-clip-seg ${i === active ? "active" : ""}`}
            onClick={() => jump(c.id)}
            aria-label={`Jump to ${c.label}`}
          >
            {c.label}
          </button>
        ))}
        <span
          className="es-playhead-line"
          style={{ left: `${progress * 100}%` }}
          aria-hidden
        />
      </div>
      <span className="es-timecode es-mono" style={{ minWidth: 96, textAlign: "right" }}>
        {tc}
      </span>
    </div>
  );
};

export default TimelineBar;