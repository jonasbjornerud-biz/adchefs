const CalendlyBooking = () => {
  return (
    <section id="booking" className="py-24 bg-secondary/30">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-start max-w-7xl mx-auto">
          {/* Left side - Information */}
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Ready to scale your creative system?
            </h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>We only work with 2 new e-commerce brands each month, ready to streamline creative operations and scale with precision.</p>
              <p className="font-semibold text-foreground">
                Book a call only if you:
              </p>
              <ol className="space-y-3 list-decimal list-inside">
                <li>Have a monthly ad spend of at least €5,000</li>
                <li>Want to increase creative output efficiently</li>
                <li>Value data-driven creative strategy powered by AI insights and elite video editors</li>
              </ol>
              <p className="font-semibold text-foreground pt-4">
                This isn't a sales pitch.
              </p>
              <p>
                It's a strategy session to assess fit and, if aligned, outline a tailored plan to expand your ad volume, improve consistency, and maximize ROI through a scalable creative system.
              </p>
            </div>
          </div>

          {/* Right side - Calendly Widget */}
          <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-lg p-2 min-h-[700px]">
            <iframe
              src="https://calendly.com/jonas-adchefs/15"
              width="100%"
              height="700"
              frameBorder="0"
              title="Book a Call"
              className="rounded-lg"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default CalendlyBooking;
