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

            {/* Handwritten signature - hand-signed JHB */}
            <div className="pt-3 flex flex-col items-start">
              <svg
                viewBox="0 0 240 130"
                className="h-24 w-auto -ml-1"
                aria-label="JHB signature"
              >
                <g
                  transform="rotate(-17 120 60)"
                  fill="none"
                  stroke="#1a1a1a"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  {/* Casual entry tick into the J */}
                  <path
                    d="M 24 32 C 33 25, 43 23, 52 27"
                    strokeWidth="1.2"
                  />

                  {/* J descender + loop, continuing up as H's left leg.
                      Slightly wobbly, not a clean arc. Built from two overlapping
                      strokes of different weight to fake pen-pressure variation. */}
                  <path
                    d="M 52 27
                       C 54 30, 55 34, 54 40
                       C 53 51, 51 63, 49 74
                       C 48 81, 47 87, 45 91
                       C 43 96, 36 97, 30 93
                       C 25 89, 27 83, 34 81"
                    strokeWidth="3.8"
                  />
                  {/* Pressure overlay on the heaviest part of the J downstroke */}
                  <path
                    d="M 53 38 C 52 50, 50 62, 48 73"
                    strokeWidth="2"
                    opacity="0.55"
                  />

                  {/* H crossbar — quick angled flick, slightly tilted up */}
                  <path
                    d="M 52 60 C 63 56, 76 55, 87 53"
                    strokeWidth="1.7"
                  />

                  {/* Tiny lead-in into top of H right leg */}
                  <path
                    d="M 76 24 C 81 25, 84 26, 87 30"
                    strokeWidth="1.2"
                  />

                  {/* H right leg → continues straight down as B spine.
                      Slight wobble, not a ruler-straight line. */}
                  <path
                    d="M 87 30
                       C 88 44, 89 60, 89 72
                       C 89 80, 90 86, 91 92"
                    strokeWidth="3.8"
                  />
                  <path
                    d="M 88 42 C 89 56, 90 70, 90 82"
                    strokeWidth="1.8"
                    opacity="0.5"
                  />

                  {/* B upper lobe — smaller, slightly squashed, asymmetric */}
                  <path
                    d="M 89 32
                       C 105 28, 122 32, 127 42
                       C 130 50, 120 56, 90 58"
                    strokeWidth="2.8"
                  />

                  {/* B lower lobe — bigger, looser, lopsided.
                      Bulges more on the lower-right and pinches back in. */}
                  <path
                    d="M 90 58
                       C 112 58, 138 64, 142 80
                       C 144 92, 128 99, 108 96
                       C 100 95, 94 93, 91 92"
                    strokeWidth="3.4"
                  />

                  {/* Trailing pen exit off the B */}
                  <path
                    d="M 134 96 C 150 100, 168 99, 184 92"
                    strokeWidth="1.3"
                  />

                  {/* Hand-drawn underline — wavy, left-heavy, tapers off.
                      Sits a few pixels under the signature, offset slightly left. */}
                  <path
                    d="M 14 116
                       C 40 112, 70 120, 110 116
                       C 140 113, 168 118, 196 110"
                    strokeWidth="2.6"
                    opacity="0.9"
                  />
                  {/* Tapered tail of the underline */}
                  <path
                    d="M 196 110 C 204 108, 210 107, 214 106"
                    strokeWidth="1.2"
                    opacity="0.7"
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
