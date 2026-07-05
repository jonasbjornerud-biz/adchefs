const EditFinalCta = () => {
  const scrollToBooking = () => {
    const el = document.getElementById("booking");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };
  return (
    <section className="es-ink-band py-20 md:py-24">
      <div className="es-container">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
          <div className="max-w-2xl">
            <span className="es-timecode-label" style={{ color: "rgba(245,245,244,0.65)" }}>
              09 · READY
            </span>
            <h2
              className="mt-5 es-display text-[32px] md:text-[46px] leading-[1.02]"
              style={{ color: "var(--es-studio)" }}
            >
              Ready to hand creative to one operator?
            </h2>
            <p className="mt-4 text-[15px]" style={{ color: "rgba(245,245,244,0.65)", fontFamily: "Archivo, sans-serif" }}>
              Pricing is built around your account on the call.
            </p>
          </div>
          <div className="flex flex-col items-start md:items-end gap-3">
            <button className="es-btn-primary es-btn-inverted" onClick={scrollToBooking}>
              Book a call
            </button>
            <span className="es-mono text-[10px] uppercase tracking-[0.22em]" style={{ color: "rgba(245,245,244,0.55)" }}>
              2 TO 3 BRANDS MAX AT A TIME
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EditFinalCta;