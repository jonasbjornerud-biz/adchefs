import { useEffect, useRef, useState } from "react";

const STEPS = [
  {
    tc: "MON 00:00",
    title: "Read the account",
    body: "I open Ads Manager, GA and the KPI dashboard first. Losers get cut, winners get scaled, and the next batch is planned off what the data actually said.",
  },
  {
    tc: "TUE 00:00",
    title: "Build the angle",
    body: "New angles come from customer language, competitor gaps, and what the winning ads all share. Not from a swipe folder.",
  },
  {
    tc: "WED 00:00",
    title: "Brief the editor",
    body: "Shot by shot brief with the hook, holds, cuts and text pace. Written by someone who edits, not a project manager.",
  },
  {
    tc: "THU FRI",
    title: "Ship and learn",
    body: "Cuts ship 24 to 48 hours. Launched, tagged in Ads Manager, watched daily. Anything underperforming gets a fix the same week.",
  },
];

const EditWeekly = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setPlaying(true); },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section id="method" className="es-ink-band es-section">
      <div className="es-container">
        <span className="es-timecode-label" style={{ color: "rgba(245,245,244,0.65)" }}>
          02 · THE WEEKLY LOOP
        </span>
        <h2
          className="mt-6 es-display text-[36px] md:text-[52px] leading-[1.02] max-w-3xl"
          style={{ color: "var(--es-studio)" }}
        >
          How a week looks when I run creative.
        </h2>

        <div ref={ref} className="mt-16">
          {/* Desktop track */}
          <div className="hidden md:block relative">
            <div className="es-weekly-track relative">
              <div className="grid grid-cols-4">
                {STEPS.map((s, i) => (
                  <div
                    key={s.title}
                    className="p-6"
                    style={{
                      borderRight: i < STEPS.length - 1 ? "1px solid rgba(245,245,244,0.15)" : undefined,
                    }}
                  >
                    <span
                      className="es-mono text-[10px] uppercase tracking-[0.18em]"
                      style={{ color: "var(--es-playhead)" }}
                    >
                      {s.tc}
                    </span>
                    <h3 className="mt-4 es-display text-[20px] leading-tight" style={{ color: "var(--es-studio)" }}>
                      {s.title}
                    </h3>
                    <p className="mt-3 text-[14px] leading-relaxed" style={{ color: "rgba(245,245,244,0.65)" }}>
                      {s.body}
                    </p>
                  </div>
                ))}
              </div>
              {playing && <div className="es-weekly-playhead" />}
            </div>
          </div>

          {/* Mobile */}
          <div className="md:hidden space-y-6" style={{ borderLeft: "1px solid rgba(245,245,244,0.2)", paddingLeft: 20 }}>
            {STEPS.map((s) => (
              <div key={s.title}>
                <span className="es-mono text-[10px] uppercase tracking-[0.18em]" style={{ color: "var(--es-playhead)" }}>
                  {s.tc}
                </span>
                <h3 className="mt-2 es-display text-[20px]" style={{ color: "var(--es-studio)" }}>{s.title}</h3>
                <p className="mt-2 text-[14px]" style={{ color: "rgba(245,245,244,0.65)" }}>{s.body}</p>
              </div>
            ))}
          </div>
        </div>

        <p
          className="mt-10 es-mono text-[10px] uppercase tracking-[0.22em]"
          style={{ color: "rgba(245,245,244,0.5)" }}
        >
          LOOPS BACK TO 01 · NEXT WEEK
        </p>
      </div>
    </section>
  );
};

export default EditWeekly;