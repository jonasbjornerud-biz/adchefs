import { ArrowRight } from "lucide-react";

const scrollToBooking = (e: React.MouseEvent) => {
  e.preventDefault();
  const el = document.getElementById("booking");
  if (el) el.scrollIntoView({ behavior: "smooth" });
  else window.location.href = "/#booking";
};

const CSFinalCTA = () => {
  return (
    <section className="relative py-16 sm:py-24 bg-background overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 80% 50%, rgba(158,216,245,0.12), transparent 60%)",
        }}
      />

      <div className="relative mx-auto max-w-[1120px] px-6">
        <div className="relative overflow-hidden rounded-[4px] bg-foreground text-background px-8 sm:px-14 py-12 sm:py-16">
          <div
            aria-hidden
            className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-accent/20 blur-[80px]"
          />
          <div
            aria-hidden
            className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-accent/10 blur-[60px]"
          />

          <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-10">
            <div className="md:max-w-[640px]">
              <h2 className="font-display text-[30px] sm:text-[40px] lg:text-[46px] leading-[1.04] tracking-[-0.025em] text-background">
                Ready to hand creative to one{" "}
                <em className="font-serif">operator</em>?
              </h2>
              <p className="mt-4 text-[15px] sm:text-[16px] leading-relaxed text-background/70">
                Pricing is built around your account on the call. Two to three brands max at a time.
              </p>
            </div>
            <div className="md:flex-shrink-0">
              <a
                href="#booking"
                onClick={scrollToBooking}
                className="group inline-flex items-center justify-center rounded-[4px] bg-accent px-7 py-4 text-[14px] font-medium text-accent-foreground transition-all hover:-translate-y-[2px] hover:shadow-[0_12px_32px_-12px_rgba(158,216,245,0.45)]"
              >
                Book a call
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CSFinalCTA;
