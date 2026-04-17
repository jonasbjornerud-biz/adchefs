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

            {/* Handwritten signature - rushed JHB with attached underline */}
            <div className="pt-3 flex flex-col items-start">
              <svg
                viewBox="0 0 260 140"
                className="h-24 w-auto -ml-1"
                aria-label="JHB signature"
              >
                <g
                  transform="rotate(-16 130 65)"
                  fill="none"
                  stroke="#1a1a1a"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  {/* Quick entry tick into J — short jittered segments */}
                  <path
                    d="M 22 34 Q 28 28 34 27 T 48 26 Q 52 27 55 30"
                    strokeWidth="1.3"
                  />

                  {/* J descender + bottom loop, continuing up as H's left leg.
                      Built from short Q segments with offset control points to
                      fake pen wobble — no clean cubic. */}
                  <path
                    d="M 55 30
                       Q 56 36 55 42
                       Q 53 50 52 58
                       Q 50 67 49 75
                       Q 48 82 46 88
                       Q 43 94 36 94
                       Q 28 93 27 87
                       Q 28 82 35 81
                       Q 39 81 41 84"
                    strokeWidth="3.6"
                  />
                  {/* Heavy pressure overlay on middle of J downstroke */}
                  <path
                    d="M 54 44 Q 52 56 50 68 Q 49 74 48 78"
                    strokeWidth="2.2"
                    opacity="0.55"
                  />
                  {/* Light tail wobble overlay */}
                  <path
                    d="M 49 74 Q 47 80 45 86"
                    strokeWidth="1.1"
                    opacity="0.6"
                  />

                  {/* H crossbar — quick angled flick, jittered, tilts up */}
                  <path
                    d="M 51 62 Q 60 59 70 57 T 90 54"
                    strokeWidth="1.6"
                  />

                  {/* Tiny lead-in into H right leg */}
                  <path
                    d="M 78 26 Q 82 27 86 29 Q 89 31 90 33"
                    strokeWidth="1.2"
                  />

                  {/* H right leg → continues straight down as B spine.
                      Jittered, slight wobble. */}
                  <path
                    d="M 90 33
                       Q 91 44 91 54
                       Q 92 64 92 74
                       Q 92 82 93 90
                       Q 94 95 95 98"
                    strokeWidth="3.6"
                  />
                  <path
                    d="M 91 46 Q 92 58 92 70 Q 92 80 93 88"
                    strokeWidth="1.8"
                    opacity="0.5"
                  />

                  {/* B upper lobe — small, squashed, asymmetric, jittered */}
                  <path
                    d="M 92 34
                       Q 102 31 112 33
                       Q 122 35 127 42
                       Q 130 49 122 54
                       Q 110 58 92 60"
                    strokeWidth="2.7"
                  />

                  {/* B lower lobe — bigger, lopsided, bulges low-right.
                      Last stroke flows directly into the underline below. */}
                  <path
                    d="M 92 60
                       Q 108 59 122 63
                       Q 138 68 144 78
                       Q 147 88 138 95
                       Q 124 100 108 99
                       Q 100 98 95 98"
                    strokeWidth="3.3"
                  />

                  {/* CONTINUOUS pen exit: starts where the B finishes (~95,98),
                      sweeps down and back LEFT under the whole signature,
                      then exits to the right with a slight upturn flick.
                      Drawn as one path so it reads as one motion. */}
                  <path
                    d="M 95 98
                       Q 100 104 92 108
                       Q 70 114 48 117
                       Q 30 119 18 120
                       Q 14 120 16 122
                       Q 22 124 36 123
                       Q 70 122 110 121
                       Q 150 119 188 116
                       Q 210 114 224 110
                       Q 230 108 226 112"
                    strokeWidth="2.2"
                  />
                  {/* Pressure swell in the middle of the underline */}
                  <path
                    d="M 60 121 Q 110 122 168 119"
                    strokeWidth="1.4"
                    opacity="0.7"
                  />
                  {/* Tapered exit flick */}
                  <path
                    d="M 222 112 Q 230 110 236 107"
                    strokeWidth="1"
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
