const CalendlyBooking = () => {
  return (
    <section id="booking" className="py-24 bg-secondary/30">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-start max-w-7xl mx-auto">
          {/* Left side - Information */}
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Ready to meet your new editing team?
            </h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                We pair you with full-time editors who become an extension of your brand — without the overhead of a retainer. Book a free strategy call and see how it works.
              </p>
              <p>
                Whether you need 10 videos a month or 100, you only pay for what we deliver.
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
