import jonasPhoto from "@/assets/jonas.jpg";

const WhyAdChefs = () => {
  return (
    <section className="py-28">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-[auto_1fr] gap-12 md:gap-16 items-start max-w-4xl mx-auto">
          {/* Photo */}
          <div className="flex justify-center md:justify-start">
            <div
              className="w-[200px] h-[200px] rounded-full overflow-hidden"
              style={{
                border: "3px solid hsl(var(--accent))",
                boxShadow:
                  "0 0 0 4px hsl(var(--accent) / 0.12), 0 20px 50px -12px hsl(var(--accent) / 0.4)",
              }}
            >
              <img
                src={jonasPhoto}
                alt="Jonas Bjørnerud, founder of AdChefs"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Text */}
          <div className="space-y-5">
            <p className="text-xs uppercase tracking-[0.2em] text-accent font-medium">
              Why AdChefs
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground leading-tight">
              Built by an operator, not an agency.
            </h2>
            <div className="space-y-4 text-sm md:text-base text-muted-foreground leading-relaxed">
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

            {/* Handwritten signature - flowing JHB monogram */}
            <div className="pt-3 flex flex-col items-start">
              <svg
                viewBox="0 0 220 110"
                className="h-20 w-auto -ml-1"
                aria-label="JHB signature"
              >
                <g
                  transform="rotate(-15 110 55)"
                  fill="none"
                  stroke="#1a1a1a"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  {/* Light entry stroke into top of J */}
                  <path
                    d="M 22 30 C 32 22, 44 20, 54 26"
                    strokeWidth="1.3"
                  />

                  {/* J descender + loop, continuing up as the H's narrow LEFT leg.
                      One fluid stroke. */}
                  <path
                    d="M 54 26
                       C 55 26, 56 28, 56 32
                       C 54 52, 52 70, 50 86
                       C 48 92, 40 94, 32 90
                       C 26 86, 28 80, 36 78"
                    strokeWidth="4"
                  />

                  {/* H crossbar — short, narrow, lighter weight */}
                  <path
                    d="M 56 56 C 66 53, 78 53, 88 56"
                    strokeWidth="2"
                  />

                  {/* Light lead-in into top of H right leg */}
                  <path
                    d="M 78 24 C 82 24, 85 26, 86 28"
                    strokeWidth="1.3"
                  />

                  {/* H RIGHT leg → continues down as B spine. One stroke. */}
                  <path
                    d="M 86 28
                       C 87 46, 88 66, 89 88"
                    strokeWidth="4"
                  />

                  {/* B upper lobe — smaller, rounded */}
                  <path
                    d="M 88 30
                       C 108 26, 124 34, 124 44
                       C 124 52, 112 56, 89 56"
                    strokeWidth="3"
                  />

                  {/* B lower lobe — larger, looser */}
                  <path
                    d="M 89 56
                       C 116 56, 138 64, 138 78
                       C 138 90, 118 94, 89 88"
                    strokeWidth="3.6"
                  />

                  {/* Trailing flourish off the B */}
                  <path
                    d="M 130 92 C 152 96, 174 92, 196 82"
                    strokeWidth="1.3"
                  />
                </g>
              </svg>
              <p className="text-xs text-muted-foreground mt-1">
                Jonas Bjørnerud, Founder
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyAdChefs;
