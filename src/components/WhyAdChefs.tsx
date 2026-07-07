import jonasPhoto from "@/assets/jonas.jpg";
import jonasSignature from "@/assets/jonas-signature.png";
import { useEffect, useRef, useState } from "react";

const WhyAdChefs = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => e.isIntersecting && setInView(true),
      { threshold: 0.25 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section ref={ref} className="relative py-20 sm:pt-32 sm:pb-12 overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, #FFFFFF 0%, #F8F9FA 50%, #FFFFFF 100%)",
        }}
        aria-hidden
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 55% at 50% 50%, rgba(158,216,245,0.16), transparent 65%), radial-gradient(ellipse 60% 40% at 90% 10%, rgba(158,216,245,0.10), transparent 55%)",
        }}
        aria-hidden
      />

      <div className="relative mx-auto max-w-[1120px] px-6">
        <div className="mb-12 md:mb-16">
          <span className="eyebrow">HOW IT STARTED</span>
        </div>

        <div
          className="grid md:grid-cols-[280px_1fr] gap-10 md:gap-16"
          style={{
            transform: inView ? "translateY(0)" : "translateY(24px)",
            opacity: inView ? 1 : 0,
            transition: "transform 900ms cubic-bezier(0.22, 0.61, 0.36, 1), opacity 900ms ease",
          }}
        >
          {/* Portrait column (sticky on desktop) */}
          <div className="md:sticky md:top-28 self-start">
            <div
              className="relative w-[180px] h-[220px] md:w-[240px] md:h-[300px] overflow-hidden rounded-[4px]"
              style={{
                boxShadow:
                  "0 30px 60px -24px rgba(25,70,110,0.28), 0 12px 30px -12px rgba(25,70,110,0.18)",
              }}
            >
              <img
                src={jonasPhoto}
                alt="Jonas Bjørnerud, founder of AdChefs"
                className="w-full h-full object-cover grayscale"
                loading="lazy"
                decoding="async"
              />
              <div
                aria-hidden
                className="absolute inset-0 pointer-events-none"
                style={{ boxShadow: "inset 0 0 0 1px rgba(158,216,245,0.35)" }}
              />
            </div>
            <div className="mt-5">
              <p className="text-[14px] font-medium text-ink">Jonas Bjørnerud</p>
              <p className="mono text-[10px] uppercase tracking-[0.15em] text-ink/55 mt-0.5">
                Founder · AdChefs
              </p>
            </div>
          </div>

          {/* Letter column */}
          <div className="max-w-[680px]">
            <h2 className="font-display text-[30px] md:text-[46px] leading-[1.05] tracking-[-0.02em] text-ink">
              Built by an{" "}
              <em className="font-serif italic !text-ink">operator</em>,
              <br className="hidden md:block" /> not an agency.
            </h2>

            <div className="mt-8 space-y-5 text-[15px] md:text-[16px] leading-[1.8] text-ink/80">
              <p>
                I'm Jonas. I spent years editing direct response ads for e-com brands, then more
                years running a video department and consuming the performance data. Long
                enough to know{" "}
                <span
                  className="relative inline"
                  style={{
                    backgroundImage:
                      "linear-gradient(180deg, transparent 62%, rgba(158,216,245,0.55) 62%, rgba(158,216,245,0.55) 92%, transparent 92%)",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: inView ? "100% 100%" : "0% 100%",
                    transition: "background-size 1200ms cubic-bezier(0.22, 0.61, 0.36, 1) 600ms",
                  }}
                >
                  what makes someone stop, watch, and actually buy
                </span>
                .
              </p>
              <p>
                Every brand I worked with kept hitting the same wall. Freelancers who relearn the
                brand from zero every quarter. Retainers that bill whether anything ships or not.
                Briefs filtered through a project manager who has never edited a video. So I
                built AdChefs to fix it all.
              </p>
              <p>
                Now I run creative end to end. I read the numbers, build the angles and briefs, and editors go through my video editing masterclass before they start editing. When an ad underperforms I know why, and the next batch is built from what the data said.
              </p>
            </div>

            <div className="mt-10 flex items-end gap-4">
              <img
                src={jonasSignature}
                alt="Jonas Bjørnerud signature"
                className="h-14 w-auto select-none pointer-events-none mix-blend-multiply opacity-90"
                draggable={false}
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyAdChefs;
