const CalendlyBooking = () => {
  return (
    <section id="booking" className="py-24 sm:py-32 bg-secondary border-y border-foreground/10">
      <div className="mx-auto max-w-[1200px] px-6">
        <div className="grid lg:grid-cols-[1fr_1.2fr] gap-12 items-start">
          <div>
            <span className="eyebrow eyebrow-accent">Get started</span>
            <h2 className="mt-5 font-display text-[32px] md:text-[44px] leading-[1.05] tracking-[-0.02em] text-foreground">
              Let's see if we're a <em>fit.</em>
            </h2>
            <p className="mt-5 text-[15px] text-foreground/80 leading-relaxed max-w-md">
              I only onboard 2–3 new brands a month to protect editor quality. Book a 15-minute call and I'll show you how AdChefs would plug into your workflow.
            </p>

            <div className="mt-8 space-y-6">
              <div>
                <p className="mono text-[11px] uppercase tracking-[0.15em] text-foreground/70 mb-3">Book a call if</p>
                <ul className="space-y-2 text-[14px] text-foreground/85">
                  <li>· You spend $5K+/month on ads and need more creative</li>
                  <li>· You want a dedicated editor without hiring in-house</li>
                  <li>· You care about what converts, not just what gets delivered</li>
                </ul>
              </div>

              <div>
                <p className="mono text-[11px] uppercase tracking-[0.15em] text-foreground/70 mb-3">What happens on the call</p>
                <ul className="space-y-2 text-[14px] text-foreground/85">
                  <li>· I ask about your current creative, offer and performance</li>
                  <li>· I show how AdChefs would plug into your workflow</li>
                  <li>· If it's a fit, we scope a trial. If not, I point you elsewhere</li>
                </ul>
              </div>

              <p className="text-[13px] text-foreground/60 italic">
                No sales pressure. Worst case, you leave with sharper feedback on your current creative.
              </p>
            </div>
          </div>

          <div className="rounded-[4px] border border-foreground/15 bg-background overflow-hidden">
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

export default CalendlyBooking;