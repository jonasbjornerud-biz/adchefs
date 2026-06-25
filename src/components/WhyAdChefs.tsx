import jonasPhoto from "@/assets/jonas.jpg";
import jonasSignature from "@/assets/jonas-signature.png";

const WhyAdChefs = () => {
  return (
    <section className="py-16 sm:py-32 bg-secondary border-y border-foreground/5">
      <div className="mx-auto max-w-[1100px] px-6">
        <div className="grid md:grid-cols-[220px_1fr] gap-10 md:gap-16 items-start">
          <div className="flex justify-start">
            <div className="w-[180px] h-[180px] rounded-full overflow-hidden border-2 border-[#3B86A8]">
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
    </section>
  );
};

export default WhyAdChefs;
