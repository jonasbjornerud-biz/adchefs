const steps = [
  {
    title: "Read the account",
    body: "I pull up your active ads and go through the data. Hook rate, hold curve, what is staying alive past three seconds and what is not.",
  },
  {
    title: "Build the angle",
    body: "From the winners, I figure out the pattern. Then I build the next angles from what is already converting in your account.",
  },
  {
    title: "Brief the editor",
    body: "The editor gets a proper brief. Hook, shot list, pacing, format. I have been in the timeline long enough to write briefs that translate into cuts.",
  },
  {
    title: "Ship and learn",
    body: "When it goes live, I track what moves. Every round gets a little tighter because we are building off proof, not guessing again from zero.",
  },
];

const CreativeStrategyLoop = () => {
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
            The weekly loop
          </span>
          <h2
            className="mt-4 text-[30px] md:text-[42px] leading-[1.05] tracking-[-0.02em] font-semibold"
            style={{ fontFamily: "'Inter Tight', sans-serif", color: "#F7F6F3" }}
          >
            How a week looks when I'm running creative.
          </h2>
          <p
            className="mt-4 text-[15px] md:text-[16px] leading-relaxed"
            style={{ color: "rgba(247,246,243,0.72)" }}
          >
            Each loop starts from the last loop's winners, so every round gets tighter.
          </p>
        </div>

        {/* Loop layout */}
        <ol className="mt-14 relative">
          {/* vertical spine */}
          <span
            aria-hidden
            className="absolute left-[14px] top-2 bottom-16 w-px"
            style={{ background: "#9ED8F5", opacity: 0.35 }}
          />
          {steps.map((s, i) => (
            <li
              key={s.title}
              className="relative grid grid-cols-[44px_1fr] gap-6 md:gap-10 pb-12 last:pb-0"
            >
              <div className="relative">
                <span
                  className="inline-flex h-7 w-7 items-center justify-center rounded-[4px]"
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

          {/* Return-to-top connector */}
          <li className="relative grid grid-cols-[44px_1fr] gap-6 md:gap-10 pt-2">
            <div className="relative flex items-start justify-center">
              {/* curved arrow returning from bottom node up the left spine */}
              <svg
                width="44"
                height="60"
                viewBox="0 0 44 60"
                fill="none"
                aria-hidden
                style={{ marginTop: -8 }}
              >
                <path
                  d="M14 0 C 14 24, 38 24, 38 48 L 38 56"
                  stroke="#9ED8F5"
                  strokeWidth="1.25"
                  strokeDasharray="3 4"
                  fill="none"
                />
                <path d="M34 50 L 38 58 L 42 50" stroke="#9ED8F5" strokeWidth="1.25" fill="none" />
              </svg>
            </div>
            <div className="max-w-[640px] pt-2">
              <span
                style={{
                  fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                  fontSize: 10,
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  color: "#9ED8F5",
                }}
              >
                Returns to 01 · next week
              </span>
            </div>
          </li>
        </ol>
      </div>
    </section>
  );
};

export default CreativeStrategyLoop;