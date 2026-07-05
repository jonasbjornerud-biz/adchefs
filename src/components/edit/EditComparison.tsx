const ROWS = [
  "An operator who reads your ad numbers weekly",
  "Briefs written by someone who can actually edit",
  "Shot by shot direction, not just a script",
  "Live KPI dashboard, included free",
  "New creative batches shipped every week",
  "Fast creative iterations, no month long wait to launch",
  "One person who owns the result end to end",
];

const EditComparison = () => {
  return (
    <section id="compare" className="es-section" style={{ background: "var(--es-studio)" }}>
      <div className="es-container">
        <span className="es-timecode-label">05 · COMPARE</span>
        <h2
          className="mt-6 es-display text-[36px] md:text-[52px] leading-[1.02]"
          style={{ color: "var(--es-ink)" }}
        >
          Me vs a regular agency.
        </h2>

        <div className="mt-14 overflow-x-auto">
          <div className="grid" style={{ gridTemplateColumns: "1fr 160px 160px", minWidth: 640 }}>
            {/* Header */}
            <div
              className="px-6 py-5 es-mono text-[10px] uppercase tracking-[0.22em]"
              style={{ color: "var(--es-graphite)", borderBottom: "1px solid var(--es-frame)" }}
            >
              WHAT YOU GET
            </div>
            <div
              className="px-6 py-5 text-center es-mono text-[11px] uppercase tracking-[0.22em]"
              style={{
                color: "var(--es-ink)",
                borderBottom: "1px solid var(--es-frame)",
                borderTop: "2px solid var(--es-playhead)",
                fontWeight: 600,
              }}
            >
              ME <span style={{ color: "var(--es-graphite)", fontWeight: 400 }}>· THE PICK</span>
            </div>
            <div
              className="px-6 py-5 text-center es-mono text-[10px] uppercase tracking-[0.22em]"
              style={{ color: "var(--es-graphite)", borderBottom: "1px solid var(--es-frame)" }}
            >
              CREATIVE AGENCY
            </div>

            {ROWS.map((r, i) => (
              <div key={r} className="contents">
                <div
                  className="px-6 py-5 text-[15px]"
                  style={{
                    color: "var(--es-ink)",
                    borderBottom: i < ROWS.length - 1 ? "1px solid var(--es-frame)" : undefined,
                  }}
                >
                  {r}
                </div>
                <div
                  className="px-6 py-5 text-center es-mono"
                  style={{
                    color: "var(--es-playhead)",
                    fontSize: 18,
                    borderBottom: i < ROWS.length - 1 ? "1px solid var(--es-frame)" : undefined,
                  }}
                >
                  ▸
                </div>
                <div
                  className="px-6 py-5 text-center"
                  style={{
                    color: "var(--es-graphite)",
                    fontSize: 16,
                    borderBottom: i < ROWS.length - 1 ? "1px solid var(--es-frame)" : undefined,
                  }}
                >
                  ✕
                </div>
              </div>
            ))}
          </div>
        </div>

        <p
          className="mt-10 text-[13px] italic max-w-2xl"
          style={{ color: "var(--es-graphite)", fontFamily: "Archivo, sans-serif" }}
        >
          Some agencies are great, but most aren't built for brands that value an in-house experience.
        </p>
      </div>
    </section>
  );
};

export default EditComparison;