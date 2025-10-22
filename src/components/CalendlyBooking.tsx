const CalendlyBooking = () => {
  return (
    <section id="booking" className="py-24 bg-background/30">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-start max-w-7xl mx-auto">
          {/* Left side - Information */}
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold">
              🚀 Ready to scale your creative system?
            </h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                We partner with only 2 to 3 new e-commerce brands per month, focusing on those serious about systemizing creative production and scaling profitably.
              </p>
              <p className="font-semibold text-foreground">
                Book a call only if you:
              </p>
              <ol className="space-y-3 list-decimal list-inside">
                <li>Spend at least €5,000 per month on paid ads</li>
                <li>Want to increase creative output efficiently</li>
                <li>Value data-driven creative strategy powered by AI insights and top-tier video editors</li>
              </ol>
              <p className="font-semibold text-foreground pt-4">
                This is not a sales call.
              </p>
              <p>
                It is a focused strategy chat to see if your brand fits our model.
                If there is a strong match, we will prepare a custom creative growth plan showing exactly how to increase ad volume, consistency, and ROI through your chosen creative setup.
              </p>
            </div>
          </div>

          {/* Right side - Calendly Widget */}
          <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-lg p-2 min-h-[700px]">
            <iframe
              src="https://calendly.com/your-calendly-link"
              width="100%"
              height="700"
              frameBorder="0"
              title="Book a Call"
              className="rounded-lg"
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CalendlyBooking;
