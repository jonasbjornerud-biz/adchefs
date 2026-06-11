const rows: { label: string; values: [string, string, string, string] }[] = [
  { label: "Dedicated to your brand", values: ["Yes, yours alone", "Yes", "Shared across clients", "Rotating"] },
  { label: "Learns your winners", values: ["Trained on your data", "Over time", "Rarely", "Starts from zero"] },
  { label: "Who you brief", values: ["The editor, directly", "The editor", "Their PM", "The freelancer"] },
  { label: "Turnaround", values: ["24 to 48 hours", "Depends on workload", "Days to weeks", "Varies"] },
  { label: "Recruiting and management", values: ["On me", "On you", "Their juniors", "On you"] },
  { label: "Tools and software", values: ["Included", "You buy licenses", "Included", "Their own setup"] },
  { label: "Performance visibility", values: ["Live dashboard, free", "If you build it", "Monthly report", "None"] },
  { label: "Cost structure", values: ["From $100 per video", "Salary plus overhead", "Monthly retainer", "Per project"] },
  { label: "Commitment", values: ["Cancel anytime", "Employment", "Locked-in months", "None"] },
];

const columnGradients: string[] = [
  "linear-gradient(180deg, rgba(158,216,245,0.30) 0%, rgba(158,216,245,0.04) 100%)",
  "linear-gradient(180deg, rgba(214,116,98,0.14) 0%, rgba(214,116,98,0.02) 100%)",
  "linear-gradient(180deg, rgba(222,196,110,0.16) 0%, rgba(222,196,110,0.02) 100%)",
  "linear-gradient(180deg, rgba(117,114,107,0.10) 0%, rgba(117,114,107,0.02) 100%)",
];

const columnLabels = ["AdChefs.", "IN-HOUSE HIRE", "AGENCY", "FREELANCERS"];

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

        {/* Desktop / tablet table */}
        <div className="hidden md:block">
          <div className="grid" style={{ gridTemplateColumns: "1.4fr repeat(4, 1fr)", columnGap: "12px" }}>
            {/* Header row */}
            <div />
            {columnLabels.map((label, i) => (
              <div
                key={label}
                className="rounded-t-[4px] px-5 pt-6 pb-4"
                style={{
                  background: columnGradients[i],
                  ...(i === 0
                    ? { borderLeft: "1px solid #1A1A1A", borderRight: "1px solid #1A1A1A", borderTop: "1px solid #1A1A1A" }
                    : {}),
                }}
              >
                {i === 0 ? (
                  <span className="font-display font-bold text-[18px] tracking-tight" style={{ color: "#1A1A1A" }}>
                    {label}
                  </span>
                ) : (
                  <span className="mono text-[11px] uppercase tracking-[0.15em]" style={{ color: "#75726B" }}>
                    {label}
                  </span>
                )}
              </div>
            ))}

            {/* Body rows */}
            {rows.map((row, rIdx) => {
              const isLast = rIdx === rows.length - 1;
              return (
                <div key={row.label} className="contents">
                  <div
                    className="px-2 py-5 text-[14px] font-medium flex items-center"
                    style={{
                      color: "#1A1A1A",
                      borderTop: rIdx === 0 ? "none" : "1px solid #EEEDE8",
                    }}
                  >
                    {row.label}
                  </div>
                  {row.values.map((val, cIdx) => (
                    <div
                      key={cIdx}
                      className={`px-5 py-5 text-[14px] flex items-center ${isLast && cIdx === 0 ? "rounded-b-[4px]" : ""}`}
                      style={{
                        background: columnGradients[cIdx],
                        color: cIdx === 0 ? "#1A1A1A" : "#75726B",
                        borderTop: rIdx === 0 ? "none" : "1px solid #EEEDE8",
                        ...(cIdx === 0
                          ? {
                              borderLeft: "1px solid #1A1A1A",
                              borderRight: "1px solid #1A1A1A",
                              ...(isLast ? { borderBottom: "1px solid #1A1A1A" } : {}),
                            }
                          : {}),
                      }}
                    >
                      {val}
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>

        {/* Mobile stacked cards */}
        <div className="md:hidden space-y-5">
          {columnLabels.map((label, i) => (
            <div
              key={label}
              className="rounded-[4px] p-5"
              style={{
                background: columnGradients[i],
                ...(i === 0 ? { border: "1px solid #1A1A1A" } : {}),
              }}
            >
              <div className="mb-4">
                {i === 0 ? (
                  <span className="font-display font-bold text-[20px] tracking-tight" style={{ color: "#1A1A1A" }}>
                    {label}
                  </span>
                ) : (
                  <span className="mono text-[11px] uppercase tracking-[0.15em]" style={{ color: "#75726B" }}>
                    {label}
                  </span>
                )}
              </div>
              <dl className="space-y-3">
                {rows.map((row) => (
                  <div key={row.label} className="flex justify-between gap-4 py-2" style={{ borderTop: "1px solid #EEEDE8" }}>
                    <dt className="text-[13px] font-medium" style={{ color: "#1A1A1A" }}>{row.label}</dt>
                    <dd className="text-[13px] text-right" style={{ color: i === 0 ? "#1A1A1A" : "#75726B" }}>
                      {row.values[i]}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <a
            href="#book"
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