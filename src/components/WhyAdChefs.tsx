import jonasPhoto from "@/assets/jonas.jpg";
import jonasSignature from "@/assets/jonas-signature.png";

const WhyAdChefs = () => {
  return (
    <section className="relative py-20 sm:py-32 overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "linear-gradient(180deg, #FFFFFF 0%, #F8F9FA 50%, #FFFFFF 100%)",
        }}
        aria-hidden
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 20% 30%, rgba(158,216,245,0.14), transparent 65%), radial-gradient(ellipse 50% 40% at 90% 80%, rgba(158,216,245,0.10), transparent 60%)",
        }}
        aria-hidden
      />

      <div className="relative mx-auto max-w-[1100px] px-6">
        <div
          className="relative rounded-[32px] ring-1 ring-white/70 backdrop-blur-[40px] p-8 md:p-14"
          style={{
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0.70) 100%)",
            boxShadow:
              "inset 0 1px 1px rgba(255,255,255,0.95), 0 40px 90px -28px rgba(25,70,110,0.22), 0 14px 40px -14px rgba(25,70,110,0.12)",
          }}
        >
        <div className="grid md:grid-cols-[220px_1fr] gap-10 md:gap-16 items-start">
          <div className="flex justify-start">
            <div
              className="w-[200px] h-[200px] rounded-full overflow-hidden ring-1 ring-white/80"
              style={{
                boxShadow:
                  "0 20px 50px -20px rgba(25,70,110,0.35), 0 0 0 6px rgba(158,216,245,0.18)",
              }}
            >
              <img
                src={jonasPhoto}
                alt="Jonas Bjørnerud, founder of AdChefs"
                className="w-full h-full object-cover grayscale"
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>

          <div>
            <span className="eyebrow">HOW IT STARTED</span>
            <h2 className="mt-5 font-display text-[32px] md:text-[40px] leading-[1.05] tracking-[-0.02em] text-foreground">
              Built by an operator, not an <em>agency</em>.
            </h2>
            <div className="mt-6 space-y-4 text-[15px] text-muted-foreground leading-relaxed max-w-xl">
              <p>
                I'm Jonas. I spent years cutting direct response ads for e-com brands, then more years running a video department and living inside the performance data. Long enough to know what makes someone stop, watch, and actually buy.
              </p>
              <p>
                Every brand I worked with kept hitting the same wall. Freelancers who relearn the brand from zero every quarter. Retainers that bill whether anything ships or not. Briefs filtered through a project manager who has never opened a timeline. So I built AdChefs to strip all of that out.
              </p>
              <p>
                Now I direct the creative and manage the editors myself. I read the numbers, build the angles, and brief shot by shot. When an ad underperforms I know why, and we fix it the same week.
              </p>
            </div>

            <div className="mt-7 flex items-end gap-4">
              <img
                src={jonasSignature}
                alt="Jonas Bjørnerud signature"
                className="h-14 w-auto select-none pointer-events-none"
                draggable={false}
                loading="lazy"
                decoding="async"
              />
              <div className="pb-1">
                <p className="text-[13px] font-medium text-foreground">Jonas Bjørnerud</p>
                <p className="mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground mt-0.5">Founder · AdChefs</p>
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>
    </section>
  );
};

export default WhyAdChefs;
