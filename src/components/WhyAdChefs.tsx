import jonasPhoto from "@/assets/jonas.jpg";
import jonasSignature from "@/assets/jonas-signature.png";

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

            {/* Handwritten signature with hand-drawn underline */}
            <div className="pt-3 flex flex-col items-start w-full max-w-[260px]">
              <img
                src={jonasSignature}
                alt="Jonas Bjørnerud signature"
                className="h-16 w-auto -ml-1 select-none pointer-events-none dark:invert"
                draggable={false}
              />

              {/* Hand-drawn underline divider */}
              <svg
                viewBox="0 0 240 14"
                className="w-full max-w-[220px] h-3 -mt-1 -ml-1 dark:invert"
                aria-hidden="true"
                preserveAspectRatio="none"
              >
                <g
                  fill="none"
                  stroke="#1a1a1a"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path
                    d="M 6 7 Q 22 5 44 7 Q 70 10 100 9 Q 132 8 162 8 Q 188 8 208 6 Q 218 5 224 4"
                    strokeWidth="2.4"
                  />
                  <path
                    d="M 14 7 Q 40 6 78 8 Q 100 9 118 9"
                    strokeWidth="1.4"
                    opacity="0.7"
                  />
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
