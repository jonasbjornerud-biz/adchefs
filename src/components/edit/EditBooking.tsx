const EditBooking = () => {
  return (
    <section id="booking" className="es-section" style={{ background: "var(--es-studio)" }}>
      <div className="es-container">
        <div className="grid lg:grid-cols-[1fr_1.15fr] gap-12 items-start">
          <div>
            <span className="es-timecode-label">07 · GET STARTED</span>
            <h2
              className="mt-6 es-display text-[36px] md:text-[52px] leading-[1.02]"
              style={{ color: "var(--es-ink)" }}
            >
              Let's see if we're a fit.
            </h2>
            <p
              className="mt-6 text-[15px] leading-relaxed max-w-md"
              style={{ color: "var(--es-graphite)", fontFamily: "Archivo, sans-serif" }}
            >
              I take on 1 to 2 new brands a month. When the slots are gone, they're gone. Book a 15 minute call and I'll show you how AdChefs would plug into what you already have.
            </p>

            <div className="mt-10 space-y-8">
              <div>
                <p className="es-mono text-[11px] uppercase tracking-[0.18em]" style={{ color: "var(--es-ink)" }}>
                  BOOK A CALL IF
                </p>
                <ul className="mt-4 space-y-2 text-[14px]" style={{ color: "var(--es-ink)" }}>
                  <li>You spend $5K+ a month on ads and are short on creative</li>
                  <li>You want a dedicated editor without hiring in-house</li>
                  <li>You care about what converts, not just what gets delivered</li>
                </ul>
              </div>
              <div>
                <p className="es-mono text-[11px] uppercase tracking-[0.18em]" style={{ color: "var(--es-ink)" }}>
                  WHAT HAPPENS ON THE CALL
                </p>
                <ul className="mt-4 space-y-2 text-[14px]" style={{ color: "var(--es-ink)" }}>
                  <li>I ask about your current creative, offer and ad numbers</li>
                  <li>I show how I'd plug in without disrupting what works</li>
                  <li>If we're a fit, we scope a trial. If not, I point you somewhere better.</li>
                </ul>
              </div>
              <p className="text-[13px] italic" style={{ color: "var(--es-graphite)" }}>
                No pitch deck. Worst case, you walk away with sharper feedback on your current creative.
              </p>
            </div>
          </div>

          <div style={{ border: "1px solid var(--es-ink)", background: "var(--es-studio)" }}>
            <div
              className="flex items-center justify-between px-4 py-3 es-mono"
              style={{
                borderBottom: "1px solid var(--es-frame)",
                fontSize: 10,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "var(--es-ink)",
              }}
            >
              <span className="flex items-center gap-2">
                <span className="es-rec-dot" />
                15 MINUTE DISCOVERY · LIVE SLOTS
              </span>
              <span style={{ color: "var(--es-graphite)" }}>CALENDLY</span>
            </div>
            <iframe
              src="https://calendly.com/jonas-adchefs/15"
              width="100%"
              height="720"
              frameBorder="0"
              title="Book a Call"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default EditBooking;