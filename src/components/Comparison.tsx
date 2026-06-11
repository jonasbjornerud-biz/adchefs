const rows: { label: string; values: [string, string, string, string] }[] = [
  { label: "Dedicated to your brand", values: ["Yes, yours alone", "Yes", "Shared across clients", "Rotating"] },
  { label: "Who you brief", values: ["The editor, directly", "The editor", "Their PM", "The freelancer"] },
  { label: "Turnaround", values: ["24 to 48 hours", "Depends on workload", "Days to weeks", "Varies"] },
  { label: "Hiring and management", values: ["On me", "On you", "Their juniors", "On you"] },
  { label: "Tools and software", values: ["Included", "You buy licenses", "Included", "Their own setup"] },
  { label: "Cost", values: ["From $100 per video", "Salary plus overhead", "Monthly retainer", "Per project"] },
];

type ColumnStyle = {
  label: string;
  background: string;
  border: string;
  shadow?: string;
  lifted?: boolean;
  isAdChefs?: boolean;
};

const columns: ColumnStyle[] = [
  {
    label: "AdChefs.",
    background:
      "linear-gradient(180deg, rgba(158,216,245,0.35) 0%, rgba(158,216,245,0.03) 70%)",
    border: "1px solid #1A1A1A",
    shadow: "0 12px 32px rgba(26,26,26,0.10)",
    lifted: true,
    isAdChefs: true,
  },
  {
    label: "IN-HOUSE HIRE",
    background:
      "linear-gradient(180deg, rgba(214,116,98,0.10) 0%, rgba(214,116,98,0.0) 80%)",
    border: "1px solid rgba(26,26,26,0.08)",
  },
  {
    label: "AGENCY",
    background:
      "linear-gradient(180deg, rgba(222,196,110,0.12) 0%, rgba(222,196,110,0.0) 80%)",
    border: "1px solid rgba(26,26,26,0.08)",
  },
  {
    label: "FREELANCERS",
    background:
      "linear-gradient(180deg, rgba(117,114,107,0.08) 0%, rgba(117,114,107,0.0) 80%)",
    border: "1px solid rgba(26,26,26,0.08)",
  },
];

const DIVIDER = "1px solid rgba(26,26,26,0.06)";
const ROW_HEIGHT = 64; // px, equal row heights
const HEADER_PAD_TOP = 28;
const HEADER_PAD_BOTTOM = 24;
const HEADER_HEIGHT = 96; // approx header card section height for label alignment

const CheckIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 14 14"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    style={{ flexShrink: 0 }}
  >
    <path
      d="M2.5 7.5L5.5 10.5L11.5 3.5"
      stroke="#1A1A1A"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ColumnHeader = ({ col }: { col: ColumnStyle }) => {
  if (col.isAdChefs) {
    return (
      <div
        className="px-5"
        style={{ paddingTop: HEADER_PAD_TOP, paddingBottom: HEADER_PAD_BOTTOM }}
      >
        <div className="font-display font-bold text-[20px] tracking-tight" style={{ color: "#1A1A1A" }}>
          AdChefs.
        </div>
        <span
          className="mono inline-block mt-2 rounded-[4px] px-2 py-1 text-[10px] uppercase tracking-[0.15em]"
          style={{ background: "#9ED8F5", color: "#1A1A1A" }}
        >
          PAY PER VIDEO
        </span>
      </div>
    );
  }
  return (
    <div
      className="px-5"
      style={{ paddingTop: HEADER_PAD_TOP, paddingBottom: HEADER_PAD_BOTTOM }}
    >
      <span className="mono text-[11px] uppercase tracking-[0.15em]" style={{ color: "#75726B" }}>
        {col.label}
      </span>
    </div>
  );
};

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

        {/* Desktop / tablet: labels + four continuous column cards */}
        <div className="hidden md:block">
          <div
            className="grid items-start"
            style={{ gridTemplateColumns: "1.4fr repeat(4, 1fr)", columnGap: "16px" }}
          >
            {/* Labels column */}
            <div>
              <div style={{ height: HEADER_HEIGHT }} />
              {rows.map((row, rIdx) => (
                <div
                  key={row.label}
                  className="px-2 flex items-center text-[14px] font-medium"
                  style={{
                    color: "#1A1A1A",
                    height: ROW_HEIGHT,
                    borderTop: rIdx === 0 ? "none" : "1px solid transparent",
                  }}
                >
                  {row.label}
                </div>
              ))}
            </div>

            {/* Four column cards */}
            {columns.map((col, cIdx) => (
              <div
                key={col.label}
                className={`rounded-[4px] overflow-hidden ${col.lifted ? "-translate-y-3" : ""}`}
                style={{
                  background: col.background,
                  border: col.border,
                  boxShadow: col.shadow,
                }}
              >
                <div style={{ height: HEADER_HEIGHT }} className="flex flex-col justify-center">
                  <ColumnHeader col={col} />
                </div>
                {rows.map((row, rIdx) => (
                  <div
                    key={row.label}
                    className="px-5 flex items-center text-[14px]"
                    style={{
                      height: ROW_HEIGHT,
                      borderTop: rIdx === 0 ? "none" : DIVIDER,
                      color: col.isAdChefs ? "#1A1A1A" : "#75726B",
                      fontWeight: col.isAdChefs ? 500 : 400,
                    }}
                  >
                    {col.isAdChefs ? (
                      <span className="inline-flex items-center gap-2">
                        <CheckIcon />
                        <span>{row.values[cIdx]}</span>
                      </span>
                    ) : (
                      <span>{row.values[cIdx]}</span>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Mobile: stacked cards, AdChefs first (already first in columns) */}
        <div className="md:hidden space-y-5">
          {columns.map((col, cIdx) => (
            <div
              key={col.label}
              className="rounded-[4px] overflow-hidden"
              style={{
                background: col.background,
                border: col.border,
                boxShadow: col.shadow,
              }}
            >
              <ColumnHeader col={col} />
              {rows.map((row, rIdx) => (
                <div
                  key={row.label}
                  className="px-5 py-4"
                  style={{
                    borderTop: rIdx === 0 ? "none" : DIVIDER,
                  }}
                >
                  <div
                    className="mono text-[10px] uppercase tracking-[0.15em] mb-1"
                    style={{ color: "#75726B" }}
                  >
                    {row.label}
                  </div>
                  <div
                    className="text-[14px]"
                    style={{
                      color: col.isAdChefs ? "#1A1A1A" : "#75726B",
                      fontWeight: col.isAdChefs ? 500 : 400,
                    }}
                  >
                    {col.isAdChefs ? (
                      <span className="inline-flex items-center gap-2">
                        <CheckIcon />
                        <span>{row.values[cIdx]}</span>
                      </span>
                    ) : (
                      <span>{row.values[cIdx]}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ))}
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