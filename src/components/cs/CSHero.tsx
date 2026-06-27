import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import jonasPhoto from "@/assets/jonas.jpg";

const scrollToBooking = () => {
  const el = document.getElementById("booking");
  if (el) el.scrollIntoView({ behavior: "smooth" });
  else window.location.href = "/#booking";
};

const CSHero = () => {
  return (
    <section
      className="relative overflow-hidden pt-10 pb-24 sm:pb-32"
      style={{ background: "#F7F6F3" }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 0%, rgba(158,216,245,0.16) 0%, transparent 60%)",
        }}
      />
      <div className="relative mx-auto max-w-[820px] px-6 text-center flex flex-col items-center">
        <span className="eyebrow eyebrow-accent">BUILT FOR DTC BRANDS</span>

        <h1
          className="mt-6 text-[40px] sm:text-[52px] lg:text-[60px] leading-[1.02] tracking-[-0.025em] font-semibold"
          style={{ fontFamily: "'Inter Tight', sans-serif", color: "#1A1A1A" }}
        >
          One operator owning the creative{" "}
          <em
            style={{
              fontFamily: "'Instrument Serif', serif",
              fontStyle: "italic",
              fontWeight: 400,
            }}
          >
            number
          </em>
          .
        </h1>

        <p
          className="mt-7 text-[16px] sm:text-[17px] leading-relaxed max-w-[620px]"
          style={{ color: "#75726B" }}
        >
          Research, angles, briefs, produced videos, and the weekly read on what is actually moving. Built for 7 to 9 figure DTC brands that want creative run like a department, not a queue of tasks.
        </p>

        <div className="mt-9">
          <Button
            size="lg"
            variant="cta"
            className="h-auto px-8 py-4 tracking-[0.01em] gap-[10px]"
            onClick={scrollToBooking}
          >
            Book a Call
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="mt-7 flex items-center gap-3">
          <div className="w-11 h-11 rounded-full overflow-hidden border border-foreground/10 flex-shrink-0">
            <img src={jonasPhoto} alt="Jonas Bjørnerud" className="w-full h-full object-cover grayscale" />
          </div>
          <div className="flex flex-col text-left">
            <span className="font-sans font-medium text-[14px] leading-tight" style={{ color: "#1A1A1A" }}>
              Jonas Bjørnerud
            </span>
            <span
              className="mt-0.5"
              style={{
                fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                fontSize: 10,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "#75726B",
              }}
            >
              Founder · AdChefs
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CSHero;