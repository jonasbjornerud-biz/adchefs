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
                Every agency I worked with had the same problem: rotating editors, slow turnarounds, retainer lock-in, and no real understanding of what drives performance. So I built AdChefs to fix it.
              </p>
              <p>
                I personally recruit, train, and oversee every editor on the roster. I vet every brand before we start. And I stay close enough to the work that if an ad underperforms, I know why, and we fix it.
              </p>
            </div>

            {/* Handwritten signature */}
            <div className="pt-3 flex flex-col items-start">
              <svg
                viewBox="0 0 220 90"
                className="h-16 w-auto -ml-1"
                aria-label="JHB signature"
              >
                <path
                  d="M 18 22
                     C 22 18, 30 16, 36 20
                     C 38 22, 38 28, 36 38
                     C 33 52, 28 64, 20 70
                     C 14 74, 6 72, 4 66
                     C 3 62, 6 58, 12 58"
                  fill="none"
                  stroke="hsl(var(--foreground))"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M 60 66
                     C 64 50, 70 32, 74 16
                     M 70 42
                     C 80 38, 92 36, 102 40
                     C 106 42, 106 46, 104 50
                     M 100 18
                     C 100 30, 100 50, 100 68"
                  fill="none"
                  stroke="hsl(var(--foreground))"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M 130 18
                     C 130 34, 130 54, 130 70
                     C 138 70, 150 70, 156 64
                     C 162 58, 158 50, 148 48
                     C 140 46, 132 48, 130 48
                     M 130 48
                     C 140 46, 154 44, 158 38
                     C 162 32, 156 24, 146 24
                     C 138 24, 132 28, 130 32"
                  fill="none"
                  stroke="hsl(var(--foreground))"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {/* Underline flourish */}
                <path
                  d="M 10 82 C 60 78, 130 80, 200 76"
                  fill="none"
                  stroke="hsl(var(--foreground))"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  opacity="0.7"
                />
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
