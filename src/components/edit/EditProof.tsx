const COLS = [
  { k: "SPEND", v: "$17K", win: false },
  { k: "ROAS", v: "2.52", win: true },
  { k: "CTR", v: "4.20%", win: true },
  { k: "PURCHASES", v: "848", win: false },
];

const EditProof = () => {
  return (
    <section id="proof" className="es-ink-band es-section">
      <div className="es-container">
        <div className="flex items-center justify-between mb-8">
          <span
            className="es-mono text-[10px] uppercase tracking-[0.22em]"
            style={{ color: "rgba(245,245,244,0.55)" }}
          >
            RITUEL · SE.80 · VERIFIED CAMPAIGN DATA
          </span>
          <span
            className="es-mono text-[10px] uppercase tracking-[0.22em]"
            style={{ color: "rgba(245,245,244,0.4)" }}
          >
            ADS MANAGER · LIVE
          </span>
        </div>
        <div
          className="grid grid-cols-2 md:grid-cols-4"
          style={{ borderTop: "1px solid rgba(245,245,244,0.15)", borderBottom: "1px solid rgba(245,245,244,0.15)" }}
        >
          {COLS.map((c, i) => (
            <div
              key={c.k}
              className="px-4 md:px-8 py-8 md:py-12"
              style={{
                borderRight: i < COLS.length - 1 ? "1px solid rgba(245,245,244,0.15)" : undefined,
              }}
            >
              <div
                className="es-mono text-[10px] uppercase tracking-[0.22em]"
                style={{ color: "rgba(245,245,244,0.55)" }}
              >
                {c.k}
              </div>
              <div className="mt-4 flex items-center gap-3 flex-wrap">
                <span
                  className="es-display tabular-nums"
                  style={{
                    color: "var(--es-studio)",
                    fontSize: "clamp(36px, 5vw, 64px)",
                    lineHeight: 1,
                  }}
                >
                  {c.v}
                </span>
                {c.win && <span className="es-chip es-chip-win">WIN</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EditProof;