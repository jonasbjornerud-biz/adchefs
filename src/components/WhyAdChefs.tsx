import jonasPhoto from "@/assets/jonas.jpg";
import jonasSignature from "@/assets/jonas-signature.png";

const WhyAdChefs = () => {
  return (
    <section className="relative py-20 sm:py-32 overflow-hidden">
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

      <div className="relative mx-auto max-w-[900px] px-6">
        <div className="text-center mb-12 md:mb-16">
          <span className="eyebrow">HOW IT STARTED</span>
        </div>

        {/* Paper note */}
        <div className="relative mx-auto" style={{ maxWidth: 720 }}>
          {/* drop shadow stack to feel like real paper */}
          <div
            aria-hidden
            className="absolute -inset-2 rounded-[2px]"
            style={{
              transform: "rotate(-1.2deg)",
              background: "#f3f1ea",
              boxShadow:
                "0 30px 60px -28px rgba(25,40,60,0.28), 0 12px 24px -14px rgba(25,40,60,0.18)",
            }}
          />
          <div
            className="relative p-8 md:p-14"
            style={{
              transform: "rotate(-0.6deg)",
              background:
                "linear-gradient(180deg, #FBF8EF 0%, #F6F1E1 100%)",
              boxShadow:
                "inset 0 0 80px rgba(120,90,40,0.06), 0 20px 50px -22px rgba(40,30,15,0.25)",
              backgroundImage:
                "repeating-linear-gradient(0deg, transparent 0, transparent 31px, rgba(60,90,140,0.08) 31px, rgba(60,90,140,0.08) 32px), linear-gradient(180deg, #FBF8EF 0%, #F6F1E1 100%)",
            }}
          >
            {/* red margin line */}
            <div
              aria-hidden
              className="absolute top-0 bottom-0 w-px"
              style={{ left: "56px", background: "rgba(200,80,80,0.35)" }}
            />
            {/* tape */}
            <div
              aria-hidden
              className="absolute -top-3 left-1/2 -translate-x-1/2 w-28 h-6 rotate-[-2deg]"
              style={{
                background:
                  "linear-gradient(180deg, rgba(255,255,255,0.55) 0%, rgba(220,215,190,0.55) 100%)",
                boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
              }}
            />
            {/* paper corner curl */}
            <div
              aria-hidden
              className="absolute bottom-0 right-0 w-10 h-10"
              style={{
                background:
                  "linear-gradient(135deg, transparent 50%, rgba(0,0,0,0.06) 50%, rgba(0,0,0,0.10) 100%)",
              }}
            />

            <div className="relative pl-4 md:pl-8">
              <div className="flex items-start gap-5 md:gap-6">
                <div
                  className="shrink-0 w-[88px] h-[88px] md:w-[110px] md:h-[110px] overflow-hidden"
                  style={{
                    transform: "rotate(-3deg)",
                    boxShadow:
                      "0 10px 24px -10px rgba(40,30,15,0.4), 0 0 0 6px #FBF8EF, 0 0 0 7px rgba(0,0,0,0.08)",
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
                <h2
                  className="font-serif italic text-[26px] md:text-[34px] leading-[1.1] tracking-[-0.01em] text-ink"
                >
                  Built by an operator,<br />not an agency.
                </h2>
              </div>

              <div className="mt-7 space-y-4 text-[15px] leading-[1.85] text-ink/80">
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

              <div className="mt-8 flex items-end gap-4">
                <img
                  src={jonasSignature}
                  alt="Jonas Bjørnerud signature"
                  className="h-14 w-auto select-none pointer-events-none mix-blend-multiply opacity-90"
                  draggable={false}
                  loading="lazy"
                  decoding="async"
                />
                <div className="pb-1">
                  <p className="text-[13px] font-medium text-ink">Jonas Bjørnerud</p>
                  <p className="mono text-[10px] uppercase tracking-[0.15em] text-ink/55 mt-0.5">Founder · AdChefs</p>
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
