const CalendlyBooking = () => {
  return <section id="booking" className="py-24 bg-secondary/30">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-start max-w-7xl mx-auto">
          {/* Left side - Information */}
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Ready to scale your creative system?
            </h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>Whether you need 1 video or 100, we'll create a plan that fits your budget.</p>
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
            <iframe src="https://calendly.com/jonas-adchefs/15" width="100%" height="700" frameBorder="0" title="Book a Call" className="rounded-lg"></iframe>
          </div>
        </div>
      </div>
    </section>;
};
export default CalendlyBooking;