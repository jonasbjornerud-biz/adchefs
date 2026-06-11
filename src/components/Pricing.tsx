import { ArrowRight } from "lucide-react";

const ledger: {
  label: string;
  color: string;
  statement: string;
  cost: string;
}[] = [
  {
    label: "IN-HOUSE",
    color: "#B0552F",
    statement:
      "A recruiting project, salary, licenses, and management on your plate.",
    cost: "$4K+ / MONTH",
  },
  {
    label: "AGENCY",
    color: "#8A6D1B",
    statement:
      "A shared team behind a PM, billed whether the work ships or not.",
    cost: "$4,500 / MONTH",
  },
  {
    label: "FREELANCERS",
    color: "#5F5E5A",
    statement: "Rotating people who relearn your brand on your time.",
    cost: "YOUR HOURS",
  },
];

const checklist = [
  "One dedicated editor, trained on your account",
  "Hook variations with every video",
  "Both placement formats included",
  "Delivered in 24 to 48 hours",
  "Higgsfield, ElevenLabs, and editing software on us",
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
            One price. Per video. <em>Everything included.</em>
          </h2>
          <p className="mt-5 text-[15px] leading-relaxed max-w-2xl" style={{ color: "#75726B" }}>
            No retainers, no minimums, no contracts. You approve every video before it counts.
          </p>
        </div>

        {/* Ledger */}
        <div className="max-w-5xl">
          <div
            className="mono text-[11px] uppercase tracking-[0.15em]"
            style={{ color: "#75726B", marginBottom: 12 }}
          >
            WHAT THE ALTERNATIVES COST
          </div>
          {ledger.map((row) => (
            <div
              key={row.label}
              className="flex flex-col md:flex-row md:items-start py-4"
              style={{ borderTop: "1px solid rgba(26,26,26,0.10)", gap: 0 }}
            >
              <div className="flex flex-col md:flex-row md:items-baseline gap-0 w-full">
                <div
                  className="mono text-[11px] uppercase tracking-[0.15em] mb-1 md:mb-0 md:flex-shrink-0"
                  style={{ color: row.color, width: 110, marginRight: 20 }}
                >
                  {row.label}
                </div>
                <div className="flex-1">
                  <p
                    className="text-[16px]"
                    style={{ color: "#75726B", lineHeight: 1.45 }}
                  >
                    {row.statement}
                  </p>
                </div>
                <div
                  className="mono text-[11px] uppercase tracking-[0.15em] mt-2 md:mt-0 md:text-right md:flex-shrink-0"
                  style={{ color: row.color, minWidth: 120 }}
                >
                  {row.cost}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* AdChefs price block */}
        <div
          className="rounded-[4px] p-8 max-w-5xl"
          style={{ background: "#1A1A1A", marginTop: 8 }}
        >
          <div className="flex items-center gap-4">
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

          <div className="mt-8 flex flex-wrap items-baseline gap-3">
            <span
              className="font-display font-semibold tracking-tight text-[40px] md:text-[52px] leading-none"
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
            className="mt-8 text-[16px] leading-relaxed max-w-xl"
            style={{ color: "rgba(247,246,243,0.75)" }}
          >
            One brief comes back as a finished ad, hook variations to test against it, and both formats your platforms need. One price covers all of it.
          </p>

          <div
            className="my-7 h-px w-full"
            style={{ background: "rgba(247,246,243,0.10)" }}
          />

          <ul className="grid grid-cols-1 md:grid-cols-2 md:grid-rows-3 md:grid-flow-col gap-x-12 gap-y-4">
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

          <div className="mt-8 flex flex-col md:flex-row md:items-center gap-4">
            <a
              href="#booking"
              onClick={scrollToBooking}
              className="inline-flex w-full md:w-auto items-center justify-center rounded-[4px] px-8 py-4 text-[14px] font-medium transition-opacity hover:opacity-90"
              style={{ background: "#F7F6F3", color: "#1A1A1A" }}
            >
              Book a 15 minute call
              <ArrowRight className="ml-1.5 h-4 w-4" />
            </a>
            <p
              className="text-[14px] text-center md:text-left"
              style={{ color: "rgba(247,246,243,0.60)" }}
            >
              Unlimited revisions until you approve. Cancel anytime.
            </p>
          </div>

          <div
            className="mono text-[10px] uppercase tracking-[0.15em] text-right mt-4"
            style={{ color: "rgba(247,246,243,0.40)" }}
          >
            ONBOARDING 2-3 BRANDS / MONTH
          </div>
        </div>

        <p className="mt-6 text-[14px] max-w-5xl" style={{ color: "#75726B" }}>
          Complex edits and longer form priced on the call. Most brands start with a small trial batch.
        </p>
      </div>
    </section>
  );
};

export default Pricing;
