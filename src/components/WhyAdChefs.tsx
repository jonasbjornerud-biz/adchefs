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

      <div className="relative mx-auto max-w-[820px] px-6">
        {/* Paper stack — bottom sheet for depth */}
        <div className="relative">
          <div
            aria-hidden
            className="absolute inset-0 border border-neutral-200/70 bg-white"
            style={{
              transform: "translate(6px, 8px) rotate(-0.9deg)",
              boxShadow: "0 30px 60px -28px rgba(25,40,60,0.18)",
            }}
          />

          {/* Main letter */}
          <article
            className="relative px-8 py-14 md:px-20 md:py-24 border border-neutral-200/70"
            style={{
              background: "#FDFCFB",
              transform: "rotate(0.4deg)",
              boxShadow:
                "0 40px 80px -28px rgba(25,40,60,0.18), 0 14px 36px -16px rgba(25,40,60,0.10)",
            }}
          >
            {/* paper grain */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-[0.05] mix-blend-multiply"
              style={{
                backgroundImage:
                  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>\")",
              }}
            />

            {/* Header: eyebrow + headline | polaroid */}
            <header className="relative flex flex-col md:flex-row justify-between items-start gap-10 md:gap-12 mb-12 md:mb-14">
              <div className="flex-1 min-w-0">
                <span className="eyebrow">HOW IT STARTED</span>
                <h2
                  className="mt-5 text-[34px] md:text-[44px] leading-[1.1] tracking-[-0.015em] text-ink"
                  style={{ fontFamily: "'EB Garamond', Georgia, serif", fontWeight: 500 }}
                >
                  Built by an operator,{" "}
                  <span className="italic text-ink/90">not an agency.</span>
                </h2>
              </div>

              {/* Polaroid */}
              <div className="relative shrink-0">
                <div
                  className="bg-white p-2.5 pb-5 border border-neutral-200/80"
                  style={{
                    transform: "rotate(-3deg)",
                    boxShadow:
                      "0 18px 40px -18px rgba(25,40,60,0.30), 0 6px 14px -8px rgba(25,40,60,0.18)",
                  }}
                >
                  <div className="w-[120px] h-[150px] md:w-[140px] md:h-[176px] overflow-hidden bg-neutral-100">
                    <img
                      src={jonasPhoto}
                      alt="Jonas Bjørnerud, founder of AdChefs"
                      className="w-full h-full object-cover grayscale"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                </div>
              </div>
            </header>

            {/* Letter body */}
            <div
              className="relative space-y-6 text-[17px] md:text-[19px] leading-[1.7] text-ink/85"
              style={{ fontFamily: "'EB Garamond', Georgia, serif" }}
            >
              <p className="first-letter:text-[58px] first-letter:font-medium first-letter:float-left first-letter:mr-3 first-letter:leading-[0.9] first-letter:mt-1 first-letter:text-ink">
                I'm Jonas. I spent years cutting direct response ads for e-com brands, then more years running a video department and living inside the performance data. Long enough to know what makes someone stop, watch, and actually buy.
              </p>
              <p>
                Every brand I worked with kept hitting the same wall. Freelancers who relearn the brand from zero every quarter. Retainers that bill whether anything ships or not. Briefs filtered through a project manager who has never opened a timeline. So I built AdChefs to strip all of that out.
              </p>
              <p>
                Now I direct the creative and manage the editors myself. I read the numbers, build the angles, and brief shot by shot. When an ad underperforms I know why, and we fix it the same week.
              </p>
            </div>

            {/* Signature */}
            <footer className="relative mt-14 flex flex-col">
              <img
                src={jonasSignature}
                alt="Jonas Bjørnerud signature"
                className="h-16 w-auto select-none pointer-events-none mix-blend-multiply opacity-90 -ml-1"
                draggable={false}
                loading="lazy"
                decoding="async"
              />
              <div className="mt-2">
                <p className="text-[13px] font-medium text-ink">Jonas Bjørnerud</p>
                <p className="mono text-[10px] uppercase tracking-[0.2em] text-ink/55 mt-1">
                  Founder · AdChefs
                </p>
              </div>
            </footer>

            {/* Embossed monogram */}
            <div
              aria-hidden
              className="absolute bottom-10 right-10 md:bottom-14 md:right-14 opacity-25"
            >
              <div
                className="w-14 h-14 rounded-full border flex items-center justify-center"
                style={{ borderColor: "rgba(26,26,26,0.35)" }}
              >
                <span
                  className="text-[11px] font-medium italic text-ink/60"
                  style={{ fontFamily: "'EB Garamond', Georgia, serif" }}
                >
                  JB
                </span>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
};

export default WhyAdChefs;
