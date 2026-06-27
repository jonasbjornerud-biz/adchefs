import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import jonasPhoto from "@/assets/jonas.jpg";
import HeroBackground from "@/components/HeroBackground";
import HeroWall from "@/components/HeroWall";

const scrollToBooking = () => {
  const el = document.getElementById("booking");
  if (el) el.scrollIntoView({ behavior: "smooth" });
  else window.location.href = "/#booking";
};

const CSHero = () => {
  return (
    <section className="relative min-h-screen lg:h-screen overflow-hidden bg-background pt-24 pb-12 lg:pt-0 lg:pb-0">
      <HeroBackground />

      {/* Subtle noise texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none z-[1]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "200px 200px",
          mixBlendMode: "multiply",
        }}
      />

      {/* Top-right accent wash */}
      <div
        className="absolute inset-0 pointer-events-none z-[1]"
        style={{
          background:
            "radial-gradient(ellipse at 85% 10%, rgba(180, 214, 232, 0.28) 0%, transparent 60%)",
        }}
      />

      <div className="mx-auto max-w-[1200px] px-6 relative z-10 h-full">
        <div className="grid lg:grid-cols-[55%_45%] gap-10 lg:gap-12 items-stretch lg:h-full">
          {/* LEFT: hero content */}
          <div className="flex flex-col justify-center min-w-0 lg:pt-28 lg:pb-16">
            <span className="eyebrow self-start w-fit">CREATIVE STRATEGY · DTC</span>

            <h1 className="mt-4 font-display text-[34px] sm:text-[52px] lg:text-[60px] leading-[1.02] lg:leading-[1.0] tracking-[-0.03em] text-foreground">
              One operator
              <br />
              owning the creative <em>number</em>.
            </h1>

            <p className="mt-7 text-[16px] sm:text-[17px] leading-relaxed text-muted-foreground max-w-xl">
              Research, angles, briefs, produced videos, and the weekly read on what is actually moving. Built for 7 to 9 figure DTC brands that want creative run like a department, not a queue of tasks.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-3">
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

            {/* Founder row */}
            <div className="mt-6 flex items-center gap-3">
              <div className="w-11 h-11 rounded-full overflow-hidden border border-foreground/10 flex-shrink-0">
                <img
                  src={jonasPhoto}
                  alt="Jonas Bjørnerud"
                  className="w-full h-full object-cover grayscale"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-sans font-medium text-[14px] text-foreground leading-tight">
                  Jonas Bjørnerud
                </span>
                <span className="mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground mt-0.5">
                  Founder · AdChefs
                </span>
              </div>
            </div>
          </div>

          {/* RIGHT: scrolling video wall */}
          <div className="flex min-w-0 justify-center items-center lg:h-full lg:pt-28 lg:pb-8">
            <HeroWall
              label="Cuts I've directed for clients"
              disclaimer="Includes agency work. Brand ownership belongs to respective clients."
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default CSHero;