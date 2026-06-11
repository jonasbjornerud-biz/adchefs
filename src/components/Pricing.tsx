import { ArrowRight } from "lucide-react";

const ledger: { label: string; color: string; statement: string }[] = [
  {
    label: "IN-HOUSE",
    color: "#B0552F",
    statement: "A recruiting project, a salary, licenses, and management on your plate.",
  },
  {
    label: "AGENCY",
    color: "#8A6D1B",
    statement: "A shared team behind a PM, billed monthly whether the work ships or not.",
  },
  {
    label: "FREELANCERS",
    color: "#5F5E5A",
    statement: "Rotating people who start from zero on your brand, every time.",
  },
];

const checklist = [
  "Dedicated editor, yours alone",
  "Hook variations included",
  "Two format adaptations per video",
  "24 to 48 hour turnaround",
  "Tools included: Higgsfield, ElevenLabs, editing software",
  "Live performance dashboard, free",
];

const CheckIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 14 14"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    style={{ flexShrink: 0, marginTop: 5 }}
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

const Pricing = () => {
  const scrollToBooking = (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById("booking");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="pricing" className="py-16 sm:py-32" style={{ background: "#F7F6F3" }}>
      <div className="mx-auto max-w-[1200px] px-6">
        <div className="max-w-2xl mb-14">
          <span className="eyebrow">PRICING</span>
          <h2 className="mt-5 font-display text-[32px] md:text-[44px] leading-[1.05] tracking-[-0.02em] text-foreground">
            Simple pricing. <em>Pay per video.</em>
          </h2>
          <p className="mt-5 text-[15px] leading-relaxed max-w-2xl" style={{ color: "#75726B" }}>
            No retainers. No minimums. No long contracts. You pay for videos delivered, nothing else.
          </p>
        </div>

        {/* Ledger */}
        <div>
          {ledger.map((row) => (
            <div
              key={row.label}
              className="flex flex-col md:flex-row md:items-start md:gap-8 py-6"
              style={{ borderTop: "1px solid rgba(26,26,26,0.10)" }}
            >
              <div
                className="mono text-[11px] uppercase tracking-[0.15em] mb-2 md:mb-0 md:flex-shrink-0"
                style={{ color: row.color, width: 130 }}
              >
                {row.label}
              </div>
              <p
                className="text-[19px]"
                style={{ color: "#75726B", lineHeight: 1.45 }}
              >
                {row.statement}
              </p>
            </div>
          ))}
        </div>

        {/* AdChefs price block */}
        <div
          className="rounded-[4px] p-10"
          style={{ background: "#1A1A1A", marginTop: 8 }}
        >
          <div className="flex items-center justify-between gap-4">
            <div
              className="font-display font-bold text-[22px] tracking-tight"
              style={{ color: "#F7F6F3" }}
            >
              AdChefs.
            </div>
            <span
              className="mono rounded-[4px] text-[10px] uppercase tracking-[0.15em]"
              style={{
                background: "#9ED8F5",
                color: "#1A1A1A",
                padding: "6px 12px",
              }}
            >
              PAY PER VIDEO
            </span>
          </div>

          <div className="mt-8 flex flex-wrap items-baseline gap-x-4 gap-y-2">
            <span
              className="font-display font-semibold tracking-tight text-[40px] md:text-[56px] leading-none"
              style={{ color: "#F7F6F3" }}
            >
              From $100
            </span>
            <span
              className="mono text-[11px] uppercase tracking-[0.15em]"
              style={{ color: "rgba(247,246,243,0.45)" }}
            >
              / DELIVERED VIDEO
            </span>
          </div>

          <p
            className="mt-3 text-[15px] leading-relaxed"
            style={{ color: "rgba(247,246,243,0.65)" }}
          >
            Each video includes hook variations and delivery in two formats, sized for the platforms you run.
          </p>

          <div
            className="my-7 h-px w-full"
            style={{ background: "rgba(247,246,243,0.10)" }}
          />

          <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
            {checklist.map((item) => (
              <li
                key={item}
                className="flex items-start gap-3 text-[15px]"
                style={{ color: "#F7F6F3" }}
              >
                <CheckIcon />
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <div className="mt-8">
            <a
              href="#booking"
              onClick={scrollToBooking}
              className="inline-flex items-center justify-center rounded-[4px] px-6 py-3 text-[14px] font-medium transition-opacity hover:opacity-90"
              style={{ background: "#F7F6F3", color: "#1A1A1A" }}
            >
              Book a call
              <ArrowRight className="ml-1.5 h-4 w-4" />
            </a>
          </div>

          <div
            className="mt-5 mono text-[10px] uppercase tracking-[0.15em]"
            style={{ color: "rgba(247,246,243,0.40)" }}
          >
            NO RETAINER · NO MINIMUM · CANCEL ANYTIME
          </div>
        </div>

        <p className="mt-6 text-[14px]" style={{ color: "#75726B" }}>
          Complex edits and longer form priced on the call.
        </p>
      </div>
    </section>
  );
};

export default Pricing;
