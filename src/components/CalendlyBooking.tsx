const CalendlyBooking = () => {
  return (
    <section id="booking" className="section-light py-32">
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-start max-w-5xl mx-auto">
          <div className="space-y-6">
            <p
              className="text-xs uppercase tracking-[0.25em] font-medium"
              style={{ color: "hsl(262 83% 58%)" }}
            >
              Get started
            </p>
            <h2 className="text-3xl md:text-4xl font-bold leading-tight" style={{ color: "hsl(240 24% 10%)" }}>
              Ready to scale your creative system?
            </h2>
            <div className="space-y-4 text-sm leading-relaxed" style={{ color: "hsl(240 8% 46%)" }}>
              <p>We only work with 2 new e-commerce brands each month, ready to streamline creative operations and scale with precision.</p>
              <p className="font-medium" style={{ color: "hsl(240 24% 10%)" }}>Book a call only if you:</p>
              <ol className="space-y-2 list-decimal list-inside">
                <li>Have a monthly ad spend of at least €5,000</li>
                <li>Want to increase creative output efficiently</li>
                <li>Value data-driven creative strategy powered by AI insights and elite video editors</li>
              </ol>
              <p className="font-medium" style={{ color: "hsl(240 24% 10%)" }}>This isn't a sales pitch.</p>
              <p>
                It's a strategy session to assess fit and, if aligned, outline a tailored plan to expand your ad volume and maximize ROI.
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-black/[0.06] bg-white shadow-[0_2px_40px_-12px_rgba(0,0,0,0.08)] p-2 min-h-[700px]">
            <iframe
              src="https://calendly.com/jonas-adchefs/15"
              width="100%"
              height="700"
              frameBorder="0"
              title="Book a Call"
              className="rounded-xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default CalendlyBooking;
