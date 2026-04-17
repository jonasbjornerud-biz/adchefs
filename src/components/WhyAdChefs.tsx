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

            {/* Handwritten signature: JHB monogram, hand-drawn underline divider, name */}
            <div className="pt-3 flex flex-col items-start w-full max-w-[260px]">
              {/* Signature */}
              <svg
                viewBox="0 0 220 90"
                className="h-16 w-auto -ml-1"
                aria-label="JHB signature"
              >
                <g
                  transform="rotate(-15 110 45)"
                  fill="none"
                  stroke="#1a1a1a"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  {/* Casual entry tick into J */}
                  <path
                    d="M 18 26 Q 26 21 34 22 Q 42 23 48 26"
                    strokeWidth="1.2"
                  />

                  {/* J descender + bottom loop, rising into H's left leg.
                      Short Q segments with offset control points for wobble. */}
                  <path
                    d="M 48 26
                       Q 49 32 48 39
                       Q 47 48 45 56
                       Q 44 64 42 71
                       Q 40 76 37 78
                       Q 31 80 26 76
                       Q 23 71 28 69
                       Q 33 69 35 72"
                    strokeWidth="3.4"
                  />
                  {/* Pressure overlay on J downstroke */}
                  <path
                    d="M 47 38 Q 45 50 43 62 Q 42 67 41 70"
                    strokeWidth="1.8"
                    opacity="0.55"
                  />

                  {/* H crossbar — quick light flick, slight upward tilt */}
                  <path
                    d="M 44 50 Q 56 47 68 46 Q 78 46 84 47"
                    strokeWidth="1.5"
                  />

                  {/* Lead-in into H right leg */}
                  <path
                    d="M 72 22 Q 78 23 82 25 Q 85 27 86 30"
                    strokeWidth="1.1"
                  />

                  {/* H right leg → straight down as B spine, with wobble */}
                  <path
                    d="M 86 30
                       Q 87 40 87 50
                       Q 88 60 88 68
                       Q 89 74 90 78"
                    strokeWidth="3.4"
                  />
                  <path
                    d="M 87 40 Q 88 52 88 64 Q 89 72 89 76"
                    strokeWidth="1.6"
                    opacity="0.5"
                  />

                  {/* B upper lobe — small, squashed, asymmetric */}
                  <path
                    d="M 88 30
                       Q 100 27 110 30
                       Q 120 33 122 40
                       Q 123 46 114 49
                       Q 102 51 88 51"
                    strokeWidth="2.6"
                  />

                  {/* B lower lobe — larger, lopsided, bulges low-right */}
                  <path
                    d="M 88 51
                       Q 104 51 118 56
                       Q 132 62 134 72
                       Q 134 80 122 82
                       Q 108 83 96 80
                       Q 92 79 90 78"
                    strokeWidth="3.1"
                  />

                  {/* Trailing pen exit off the B */}
                  <path
                    d="M 124 82 Q 138 84 152 81 Q 162 79 168 76"
                    strokeWidth="1.2"
                  />
                </g>
              </svg>

              {/* Hand-drawn underline divider — separates signature from name */}
              <svg
                viewBox="0 0 240 14"
                className="w-full max-w-[220px] h-3 mt-1 -ml-1"
                aria-hidden="true"
                preserveAspectRatio="none"
              >
                <g
                  fill="none"
                  stroke="#1a1a1a"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  {/* Main underline — wobbly, dips slightly, tapers off right */}
                  <path
                    d="M 6 7
                       Q 22 5 44 7
                       Q 70 10 100 9
                       Q 132 8 162 8
                       Q 188 8 208 6
                       Q 218 5 224 4"
                    strokeWidth="2.4"
                  />
                  {/* Pressure swell early-middle */}
                  <path
                    d="M 14 7 Q 40 6 78 8 Q 100 9 118 9"
                    strokeWidth="1.4"
                    opacity="0.7"
                  />
                  {/* Tapered exit flick */}
                  <path
                    d="M 224 4 Q 230 4 234 3"
                    strokeWidth="0.9"
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
