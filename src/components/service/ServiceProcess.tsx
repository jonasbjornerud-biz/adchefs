type Step = { title: string; body: string };

type Props = {
  eyebrow: string;
  title: string;
  steps: Step[];
};

const ServiceProcess = ({ eyebrow, title, steps }: Props) => {
  return (
    <section className="py-20 sm:py-28" style={{ background: "#1A1A1A", color: "#F7F6F3" }}>
      <div className="mx-auto max-w-[1100px] px-6">
        <div className="max-w-[680px]">
          <span
            style={{
              fontFamily: "'JetBrains Mono', ui-monospace, monospace",
              fontSize: 11,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "#9A968C",
            }}
          >
            {eyebrow}
          </span>
          <h2
            className="mt-4 text-[30px] md:text-[42px] leading-[1.05] tracking-[-0.02em] font-semibold"
            style={{ fontFamily: "'Inter Tight', sans-serif", color: "#F7F6F3" }}
          >
            {title}
          </h2>
        </div>

        <ol className="mt-14 relative">
          {/* vertical spine */}
          <span
            aria-hidden
            className="absolute left-[14px] top-2 bottom-2 w-px"
            style={{ background: "rgba(247,246,243,0.12)" }}
          />
          {steps.map((s, i) => (
            <li
              key={s.title}
              className="relative grid grid-cols-[44px_1fr] gap-6 md:gap-10 pb-12 last:pb-0"
            >
              {/* number node */}
              <div className="relative">
                <span
                  className="inline-flex h-7 w-7 items-center justify-center rounded-full"
                  style={{
                    background: "#9ED8F5",
                    color: "#1A1A1A",
                    fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: "0.05em",
                  }}
                >
                  0{i + 1}
                </span>
              </div>
              <div className="max-w-[640px]">
                <h3
                  className="text-[22px] md:text-[28px] leading-tight tracking-[-0.015em] font-semibold"
                  style={{ fontFamily: "'Inter Tight', sans-serif", color: "#F7F6F3" }}
                >
                  {s.title}
                </h3>
                <p
                  className="mt-3 text-[15px] md:text-[16px] leading-relaxed"
                  style={{ color: "rgba(247,246,243,0.72)" }}
                >
                  {s.body}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
};

export default ServiceProcess;