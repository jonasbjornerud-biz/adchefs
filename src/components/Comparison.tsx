const features: { label: string; value: string }[] = [
  { label: "DEDICATED", value: "One editor, yours alone" },
  { label: "BRIEFING", value: "You talk to the editor, directly" },
  { label: "TURNAROUND", value: "24 to 48 hours, standard" },
  { label: "MANAGEMENT", value: "Hiring, training, oversight on me" },
  { label: "TOOLS", value: "Higgsfield, ElevenLabs, editing software included" },
  { label: "COST", value: "From $100 per delivered video, cancel anytime" },
];

const alternatives: { name: string; dot: string; copy: string }[] = [
  {
    name: "IN-HOUSE HIRE",
    dot: "#D67462",
    copy: "A recruiting project, a salary, license costs, and management on your plate.",
  },
  {
    name: "AGENCY",
    dot: "#DEC46E",
    copy: "A shared team behind a PM, billed monthly whether the work ships or not.",
  },
  {
    name: "FREELANCERS",
    dot: "#75726B",
    copy: "Rotating people who start from zero on your brand, every time.",
  },
];

const CheckIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 14 14"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    style={{ flexShrink: 0, marginTop: 4 }}
  >
    <path
      d="M2.5 7.5L5.5 10.5L11.5 3.5"
      stroke="#9ED8F5"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const Comparison = () => {
  return (
    <section id="comparison" className="py-16 sm:py-32" style={{ background: "#F7F6F3" }}>
      <div className="mx-auto max-w-[1200px] px-6">
        <div className="max-w-2xl mb-14">
          <span className="eyebrow">WHERE ADCHEFS FITS</span>
          <h2 className="mt-5 font-display text-[32px] md:text-[44px] leading-[1.05] tracking-[-0.02em] text-foreground">
            Four ways to get ads edited. <em>One</em> is built for this.
          </h2>
          <p className="mt-5 text-[15px] leading-relaxed max-w-2xl" style={{ color: "#75726B" }}>
            Agencies sell access to a team. Freelancers sell hours. Hiring in-house buys you a recruiting project. AdChefs places one trained editor inside your team and charges per video.
          </p>
        </div>

        <div
          className="grid gap-6"
          style={{ gridTemplateColumns: "minmax(0,1fr)" }}
        >
          <div className="md:grid md:gap-6" style={{ gridTemplateColumns: "55fr 45fr" }}>
            {/* AdChefs card */}
            <div
              className="rounded-[4px] p-10"
              style={{ background: "#1A1A1A" }}
            >
              <div
                className="font-display font-bold text-[24px] tracking-tight"
                style={{ color: "#F7F6F3" }}
              >
                AdChefs.
              </div>
              <span
                className="mono inline-block mt-3 rounded-[4px] px-2.5 py-1 text-[10px] uppercase tracking-[0.15em]"
                style={{ background: "#9ED8F5", color: "#1A1A1A" }}
              >
                PAY PER VIDEO
              </span>

              <div className="mt-10 space-y-5">
                {features.map((f, i) => (
                  <div
                    key={f.label}
                    className="flex items-start gap-3"
                    style={{
                      paddingTop: i === 0 ? 0 : 20,
                      borderTop: i === 0 ? "none" : "1px solid rgba(247,246,243,0.08)",
                    }}
                  >
                    <CheckIcon />
                    <div className="flex-1 min-w-0">
                      <div
                        className="mono text-[10px] uppercase tracking-[0.15em]"
                        style={{ color: "rgba(247,246,243,0.45)" }}
                      >
                        {f.label}
                      </div>
                      <div
                        className="mt-1 text-[16px] font-medium"
                        style={{ color: "#F7F6F3" }}
                      >
                        {f.value}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Alternatives column */}
            <div className="mt-6 md:mt-0 h-full flex flex-col justify-between gap-4">
              {alternatives.map((alt) => (
                <div
                  key={alt.name}
                  className="rounded-[4px] p-6 flex-1 flex flex-col justify-center"
                  style={{
                    background: "#EEEDE8",
                    border: "1px solid rgba(26,26,26,0.06)",
                  }}
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      aria-hidden="true"
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: 9999,
                        background: alt.dot,
                        display: "inline-block",
                      }}
                    />
                    <span
                      className="mono text-[11px] uppercase tracking-[0.15em]"
                      style={{ color: "#75726B" }}
                    >
                      {alt.name}
                    </span>
                  </div>
                  <p
                    className="mt-3 text-[14px] leading-relaxed"
                    style={{ color: "#75726B" }}
                  >
                    {alt.copy}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 flex justify-center">
          <a
            href="#booking"
            className="inline-flex items-center justify-center rounded-[4px] px-6 py-3 text-[14px] font-medium transition-opacity hover:opacity-90"
            style={{ background: "#1A1A1A", color: "#F7F6F3" }}
          >
            Book a call
          </a>
        </div>
      </div>
    </section>
  );
};

export default Comparison;
