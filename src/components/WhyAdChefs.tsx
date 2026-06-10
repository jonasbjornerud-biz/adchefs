import jonasPhoto from "@/assets/jonas.jpg";
import jonasSignature from "@/assets/jonas-signature.png";

const WhyAdChefs = () => {
  return (
    <section className="py-16 sm:py-32 bg-secondary border-y border-foreground/5">
      <div className="mx-auto max-w-[1100px] px-6">
        <div className="grid md:grid-cols-[220px_1fr] gap-10 md:gap-16 items-start">
          <div className="flex justify-start">
            <div className="w-[180px] h-[180px] rounded-[4px] overflow-hidden border border-foreground/10">
              <img
                src={jonasPhoto}
                alt="Jonas Bjørnerud, founder of AdChefs"
                className="w-full h-full object-cover grayscale"
              />
            </div>
          </div>

          <div>
            <span className="eyebrow">Why AdChefs</span>
            <h2 className="mt-5 font-display text-[32px] md:text-[40px] leading-[1.05] tracking-[-0.02em] text-foreground">
              Built by an <em>operator</em>, not an agency.
            </h2>
            <div className="mt-6 space-y-4 text-[15px] text-muted-foreground leading-relaxed max-w-xl">
              <p>
                I'm Jonas. I've spent 7 years editing direct response video ads for e-commerce brands, learning exactly what makes someone stop scrolling, watch, and buy.
              </p>
              <p>
                Every e-commerce brand and agency I worked with had the same problem: rotating editors, slow turnarounds, retainer lock-in, and no real understanding of what drives performance. So I built AdChefs to fix it.
              </p>
              <p>
                I personally recruit, train, and oversee every editor on the roster. I vet every brand before we start. And I stay close enough to the work that if an ad underperforms, I know why, and we fix it.
              </p>
            </div>

            <div className="mt-7 flex items-end gap-4">
              <img
                src={jonasSignature}
                alt="Jonas Bjørnerud signature"
                className="h-14 w-auto select-none pointer-events-none"
                draggable={false}
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
