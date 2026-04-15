const CalendlyBooking = () => {
  return (
    <section id="booking" className="py-28" aria-labelledby="booking-heading">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-start max-w-5xl mx-auto">
          {/* Left — value prop */}
          <div className="space-y-6 animate-slide-up">
            <p className="section-label">Get Started</p>
            <h2 id="booking-heading" className="font-heading text-3xl md:text-4xl font-bold text-foreground leading-tight">
              Ready to scale your creative system?
            </h2>
            <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
              <p>
                We only work with 2 new e-commerce brands each month, ready to
                streamline creative operations and scale with precision.
              </p>
              <p className="font-medium text-foreground">Book a call only if you:</p>
              <ol className="space-y-2 list-decimal list-inside marker:text-primary/60">
                <li>Have a monthly ad spend of at least €5,000</li>
                <li>Want to increase creative output efficiently</li>
                <li>Value data-driven creative strategy powered by AI insights and elite video editors</li>
              </ol>
              <p className="font-medium text-foreground pt-2">This isn't a sales pitch.</p>
              <p>
                It's a strategy session to assess fit and, if aligned, outline a
                tailored plan to expand your ad volume and maximize ROI.
              </p>
            </div>
          </div>

          {/* Right — Calendly embed */}
          <div className="glass-card p-2 min-h-[700px] animate-slide-up" style={{ animationDelay: "0.15s" }}>
            <iframe
              src="https://calendly.com/jonas-adchefs/15"
              width="100%"
              height="700"
              frameBorder="0"
              title="Book a Call with AdChefs"
              className="rounded-xl"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default CalendlyBooking;
