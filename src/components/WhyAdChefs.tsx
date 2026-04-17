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

            {/* Handwritten signature - merged JHB monogram */}
            <div className="pt-3 flex flex-col items-start">
              <svg
                viewBox="0 0 240 100"
                className="h-20 w-auto -ml-1"
                aria-label="JHB signature"
              >
                <g
                  transform="rotate(-12 120 50)"
                  fill="none"
                  stroke="hsl(var(--foreground))"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  {/* Top flourish entering the J (thin upstroke) */}
                  <path
                    d="M 18 28 C 30 18, 48 14, 62 22"
                    strokeWidth="1.4"
                    opacity="0.85"
                  />

                  {/* SHARED LEFT VERTICAL: J descender + H left post.
                      Thick downstroke, curls at the bottom into the J hook. */}
                  <path
                    d="M 62 18
                       C 60 36, 58 56, 56 74
                       C 55 84, 50 90, 42 88
                       C 34 86, 32 78, 38 74"
                    strokeWidth="4.2"
                  />

                  {/* H crossbar — branches off the shared left vertical,
                      sweeps across to the shared right vertical. */}
                  <path
                    d="M 58 50 C 78 46, 110 46, 132 50"
                    strokeWidth="3"
                  />

                  {/* SHARED RIGHT VERTICAL: H right post + B spine.
                      Thick downstroke. */}
                  <path
                    d="M 134 22
                       C 133 40, 132 60, 132 82"
                    strokeWidth="4.2"
                  />

                  {/* Small entry tick into the H right post (thin upstroke) */}
                  <path
                    d="M 124 18 C 128 18, 132 20, 134 22"
                    strokeWidth="1.4"
                    opacity="0.85"
                  />

                  {/* B upper lobe — bumps out to the right from the shared spine */}
                  <path
                    d="M 132 24
                       C 152 22, 172 30, 172 40
                       C 172 48, 158 52, 132 52"
                    strokeWidth="3.4"
                  />

                  {/* B lower lobe — larger bump, tapering off into a trailing stroke */}
                  <path
                    d="M 132 52
                       C 158 52, 180 60, 180 72
                       C 180 84, 160 88, 132 84"
                    strokeWidth="3.8"
                  />

                  {/* Trailing flourish off the bottom of the B */}
                  <path
                    d="M 170 86 C 188 88, 206 84, 220 76"
                    strokeWidth="1.4"
                    opacity="0.8"
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
