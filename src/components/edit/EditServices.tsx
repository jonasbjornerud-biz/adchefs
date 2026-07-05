import { Link } from "react-router-dom";

const PLACEMENT = [
  "Vetted direct response editor matched to my workflow",
  "Pay per delivered video, no retainer or minimum",
  "24 to 48 hour turnaround standard",
  "All editing software covered by me",
  "Replaced fast if it is not clicking",
  "Trained on direct response, not wedding cuts",
];

const STRATEGY = [
  "Research, angles, and briefs built with an editing eye",
  "Weekly read on hook, hold, ROAS, CPA",
  "New creative batches shipped every week",
  "Produced videos included, not just strategy decks",
  "Dedicated editor placement included",
  "Live KPI dashboard, free",
  "One operator owning the creative number end to end",
];

const Tick = ({ dark }: { dark?: boolean }) => (
  <span
    aria-hidden
    className="es-mono"
    style={{ color: "var(--es-playhead)", marginRight: 10, fontSize: 12 }}
  >
    ▸
  </span>
);

const EditServices = () => {
  return (
    <section id="services" className="es-section" style={{ background: "var(--es-studio)" }}>
      <div className="es-container">
        <span className="es-timecode-label">03 · SERVICES</span>
        <h2
          className="mt-6 es-display text-[36px] md:text-[52px] leading-[1.02] max-w-3xl"
          style={{ color: "var(--es-ink)" }}
        >
          Two ways I work with brands.
        </h2>

        <div className="mt-14 grid md:grid-cols-2 gap-6">
          {/* Editor Placement */}
          <div style={{ border: "1px solid var(--es-ink)", background: "var(--es-studio)" }}>
            <div
              className="flex items-center justify-between px-5 py-3"
              style={{
                borderBottom: "1px solid var(--es-frame)",
                fontFamily: "'IBM Plex Mono', ui-monospace, monospace",
                fontSize: 10,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "var(--es-ink)",
              }}
            >
              <span>ENTRY · EDITOR PLACEMENT</span>
              <span style={{ color: "var(--es-graphite)" }}>01</span>
            </div>
            <div className="p-8">
              <div className="flex items-baseline gap-3">
                <span className="es-display" style={{ fontSize: 64, color: "var(--es-ink)", lineHeight: 1 }}>$100</span>
                <span className="es-mono text-[10px] uppercase tracking-[0.18em]" style={{ color: "var(--es-graphite)" }}>
                  PER DELIVERED VIDEO
                </span>
              </div>
              <ul className="mt-8 space-y-3">
                {PLACEMENT.map((b) => (
                  <li key={b} className="flex items-start text-[14px]" style={{ color: "var(--es-ink)" }}>
                    <Tick />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
              <Link to="/editor-placement" className="es-btn-secondary mt-8">Learn more</Link>
            </div>
          </div>

          {/* Creative Strategy — featured */}
          <div style={{ border: "1px solid var(--es-ink)", background: "var(--es-ink)", color: "var(--es-studio)" }}>
            <div
              className="flex items-center justify-between px-5 py-3"
              style={{
                borderBottom: "1px solid rgba(245,245,244,0.15)",
                fontFamily: "'IBM Plex Mono', ui-monospace, monospace",
                fontSize: 10,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
              }}
            >
              <span style={{ color: "var(--es-studio)" }}>SCALE · CREATIVE STRATEGY</span>
              <span className="es-chip es-chip-red">MOST BRANDS END UP HERE</span>
            </div>
            <div className="p-8">
              <div className="flex items-baseline gap-3">
                <span className="es-display" style={{ fontSize: 64, color: "var(--es-studio)", lineHeight: 1 }}>Custom</span>
                <span className="es-mono text-[10px] uppercase tracking-[0.18em]" style={{ color: "rgba(245,245,244,0.65)" }}>
                  PRICED ON THE CALL
                </span>
              </div>
              <ul className="mt-8 space-y-3">
                {STRATEGY.map((b) => (
                  <li key={b} className="flex items-start text-[14px]" style={{ color: "var(--es-studio)" }}>
                    <Tick dark />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
              <Link to="/creative-strategy" className="es-btn-primary es-btn-inverted mt-8" style={{ marginTop: 32 }}>
                Learn more
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EditServices;