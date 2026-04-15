const CalendlyBooking = () => {
  return (
    <section id="booking" className="section-white py-32">
      <div className="max-w-[1440px] mx-auto px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-start max-w-5xl mx-auto">
          <div className="space-y-6">
            <div className="inline-block px-3 py-1 border mb-2" style={{ borderColor: "hsl(263 70% 50% / 0.3)", background: "hsl(263 70% 50% / 0.05)" }}>
              <span className="mono-label" style={{ color: "hsl(263 70% 50%)" }}>
                Client Onboarding // 003
              </span>
            </div>
            <h2
              className="font-extrabold uppercase leading-[0.9]"
              style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)", color: "hsl(240 6% 4%)" }}
            >
              Ready to <span style={{ color: "hsl(263 70% 50%)" }}>deploy</span>?
            </h2>
            <div className="space-y-4 text-sm leading-relaxed" style={{ color: "hsl(240 8% 46%)" }}>
              <p>We only work with 2 new e-commerce brands each month, ready to streamline creative operations and scale with precision.</p>
              <p className="font-semibold" style={{ color: "hsl(240 6% 4%)" }}>Book a call only if you:</p>
              <ol className="space-y-2 list-decimal list-inside">
                <li>Have a monthly ad spend of at least €5,000</li>
                <li>Want to increase creative output efficiently</li>
                <li>Value data-driven creative strategy powered by AI insights and elite video editors</li>
              </ol>
              <p className="font-semibold" style={{ color: "hsl(240 6% 4%)" }}>This isn't a sales pitch.</p>
              <p>
                It's a strategy session to assess fit and, if aligned, outline a tailored plan to expand your ad volume and maximize ROI.
              </p>
            </div>
          </div>

          <div className="min-h-[700px] border" style={{ borderColor: "rgba(0,0,0,0.08)", boxShadow: "0 4px 60px -12px rgba(0,0,0,0.08)" }}>
            <iframe
              src="https://calendly.com/jonas-adchefs/15"
              width="100%"
              height="700"
              frameBorder="0"
              title="Book a Call"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default CalendlyBooking;
