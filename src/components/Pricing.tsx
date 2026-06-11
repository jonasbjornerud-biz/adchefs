import { ArrowRight } from "lucide-react";

const receiptLines: { label: string; value: string; ink?: boolean }[] = [
  { label: "VIDEOS × 20", value: "$2,000", ink: true },
  { label: "HOOK VARIATIONS", value: "$0" },
  { label: "2 PLACEMENT FORMATS", value: "$0" },
  { label: "HIGGSFIELD + ELEVENLABS", value: "$0" },
  { label: "EDITING SOFTWARE", value: "$0" },
  { label: "RECRUITING + MANAGEMENT", value: "$0" },
  { label: "PERFORMANCE DASHBOARD", value: "$0" },
  { label: "REVISIONS UNTIL APPROVED", value: "$0" },
  { label: "RETAINER", value: "$0" },
];

const Pricing = () => {
  const scrollToBooking = (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById("booking");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="pricing" className="py-16 sm:py-32" style={{ background: "#F7F6F3" }}>
      <div className="mx-auto max-w-[1200px] px-6">
        <div className="flex flex-col md:flex-row gap-16 md:items-start">
          {/* Left column */}
          <div className="md:w-[55%] flex-shrink-0">
            <span className="eyebrow">PRICING</span>
            <h2
              className="mt-5 text-[32px] md:text-[44px] leading-[1.05] tracking-[-0.02em] font-semibold"
              style={{ fontFamily: "'Inter Tight', sans-serif", color: "#1A1A1A" }}
            >
              Stop paying for the month. Pay for the{" "}
              <em
                className="not-italic"
                style={{ fontFamily: "'Instrument Serif', serif" }}
              >
                video
              </em>
              .
            </h2>
            <p
              className="mt-5 text-[15px] leading-relaxed max-w-md"
              style={{ color: "#75726B" }}
            >
              Retainers bill you whether anything ships or not. Here, the only line item is the work. Hook variations, both placement formats, tools, and management come with it.
            </p>
            <a
              href="#booking"
              onClick={scrollToBooking}
              className="mt-8 inline-flex items-center justify-center rounded-[4px] px-6 py-3.5 text-[14px] font-medium transition-opacity hover:opacity-90"
              style={{ background: "#1A1A1A", color: "#F7F6F3" }}
            >
              Book a 15 minute call
              <ArrowRight className="ml-1.5 h-4 w-4" />
            </a>
            <p
              className="mt-4 text-[14px]"
              style={{ color: "#75726B" }}
            >
              Unlimited revisions until you approve. Cancel anytime.
            </p>
          </div>

          {/* Right column — receipt */}
          <div className="md:w-[45%] flex justify-start md:justify-end">
            <div
              className="w-full max-w-sm rounded-[4px] p-7"
              style={{
                background: "#FFFFFF",
                border: "1px solid rgba(26,26,26,0.12)",
                boxShadow: "0 8px 24px rgba(26,26,26,0.06)",
              }}
            >
              {/* Wordmark */}
              <div
                className="text-center font-bold text-[18px] tracking-tight"
                style={{ fontFamily: "'Inter Tight', sans-serif", color: "#1A1A1A" }}
              >
                AdChefs.
              </div>
              <div
                className="mono text-center text-[10px] uppercase tracking-[0.15em] mt-1.5"
                style={{ color: "#75726B" }}
              >
                A MONTH OF CREATIVE, ITEMIZED
              </div>

              {/* Divider */}
              <div
                className="mt-4 w-full"
                style={{ borderTop: "1.5px dashed rgba(26,26,26,0.25)" }}
              />

              {/* Line items */}
              <div className="mt-3">
                {receiptLines.map((line, i) => (
                  <div
                    key={i}
                    className="mono flex justify-between text-[12px] py-1.5"
                    style={{ color: line.ink ? "#1A1A1A" : "#75726B" }}
                  >
                    <span>{line.label}</span>
                    <span>{line.value}</span>
                  </div>
                ))}
              </div>

              {/* Divider */}
              <div
                className="mt-2 w-full"
                style={{ borderTop: "1.5px dashed rgba(26,26,26,0.25)" }}
              />

              {/* Total */}
              <div
                className="mono flex justify-between text-[13px] font-medium mt-3"
                style={{ color: "#1A1A1A" }}
              >
                <span>TOTAL</span>
                <span>$2,000</span>
              </div>

              {/* Per video */}
              <div
                className="mono text-center text-[10px] uppercase tracking-[0.15em] mt-3"
                style={{ color: "#75726B" }}
              >
                FROM $100 / DELIVERED VIDEO
              </div>

              {/* Divider */}
              <div
                className="mt-3 w-full"
                style={{ borderTop: "1.5px dashed rgba(26,26,26,0.25)" }}
              />

              {/* Footer */}
              <div
                className="mono text-center text-[10px] uppercase tracking-[0.15em] mt-3 leading-relaxed"
                style={{ color: "#B0552F" }}
              >
                AN AGENCY BILLS $4,500 THIS MONTH<br />
                WHETHER ANYTHING SHIPS OR NOT
              </div>
            </div>
          </div>
        </div>

        {/* Bottom line */}
        <p className="mt-12 text-[14px]" style={{ color: "#75726B" }}>
          Complex edits and longer form priced on the call. Most brands start with a small trial batch.
        </p>
      </div>
    </section>
  );
};

export default Pricing;
