const CalendlyBooking = () => {
  return (
    <section id="booking" className="py-28">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-start max-w-5xl mx-auto">
          <div className="space-y-6">
            <p className="text-xs uppercase tracking-[0.2em] text-accent font-medium">Get started</p>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground leading-tight">
              Ready to scale your creative?
            </h2>
            <div className="space-y-5 text-sm text-muted-foreground leading-relaxed">
              <p>
                I onboard a limited number of new brands each month to protect editor quality and attention. Book a call if you want to see if we're a fit.
              </p>

              <div>
                <p className="font-semibold text-foreground mb-2">Book a call if:</p>
                <ul className="space-y-2 list-disc list-outside ml-5">
                  <li>You're an e-commerce brand spending at least €5,000/month on paid ads</li>
                  <li>You want to ship more video creative without hiring in-house</li>
                  <li>You value real performance data over vanity deliverables</li>
                </ul>
              </div>

              <div>
                <p className="font-semibold text-foreground mb-2">What happens on the call:</p>
                <ul className="space-y-2 list-disc list-outside ml-5">
                  <li>I ask about your current creative, offer, and performance</li>
                  <li>I show you how AdChefs would plug into your workflow</li>
                  <li>If it's a fit, we scope a trial. If not, I point you toward a better option</li>
                </ul>
              </div>

              <p className="italic text-foreground/70 pt-1">
                No sales pressure. Worst case, you leave the call with sharper feedback on your current creative.
              </p>
            </div>
          </div>

          <div className="glass-card p-2 min-h-[700px]">
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
