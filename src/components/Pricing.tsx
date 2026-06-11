import { ArrowRight } from "lucide-react";

const receiptLines: { label: string; value: string; ink?: boolean }[] = [
  { label: "VIDEOS × 20", value: "$2,000", ink: true },
  { label: "HOOK VARIATIONS + 2 FORMATS", value: "$0" },
  { label: "EDITING TOOLS", value: "$0" },
  { label: "ONGOING MANAGEMENT", value: "$0" },
  { label: "CLIENT DASHBOARD", value: "$0" },
];

const Pricing = () => {
  const scrollToBooking = (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById("booking");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="pricing" className="py-20 md:py-28" style={{ background: "#1A1A1A" }}>
      <div className="mx-auto max-w-[1200px] px-6">
        <div className="flex flex-col md:flex-row gap-16 md:items-start">
          {/* Left column */}
          <div className="md:w-[55%] flex-shrink-0">
            <span
              className="mono inline-block text-[11px] uppercase tracking-[0.15em] px-2.5 py-1 rounded-[2px]"
              style={{
                color: "#9ED8F5",
                border: "1px solid #9ED8F5",
                background: "transparent",
              }}
            >
              PRICING
            </span>
            <h2
              className="mt-5 text-[32px] md:text-[44px] leading-[1.05] tracking-[-0.02em] font-semibold"
              style={{ fontFamily: "'Inter Tight', sans-serif", color: "#F7F6F3" }}
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
              style={{ color: "rgba(247,246,243,0.60)" }}
            >
              Retainers bill you whether anything ships or not. Here, the only line item is the work. Hook variations, both placement formats, tools, and management come with it.
            </p>
            <a
              href="#booking"
              onClick={scrollToBooking}
              className="mt-8 inline-flex items-center justify-center rounded-[4px] px-6 py-3.5 text-[14px] font-medium transition-opacity hover:opacity-90"
              style={{ background: "#F7F6F3", color: "#1A1A1A" }}
            >
              Book a 15 minute call
              <ArrowRight className="ml-1.5 h-4 w-4" />
            </a>
            <p
              className="mt-4 text-[14px]"
              style={{ color: "rgba(247,246,243,0.50)" }}
            >
              Unlimited revisions until you approve. Cancel anytime.
            </p>
          </div>

          {/* Right column — receipt */}
          <div className="md:w-[45%] flex justify-center md:justify-end">
            <div
              className="relative w-full flex justify-center md:justify-end"
              style={{ maxWidth: "360px" }}
            >
              {/* Ambient glow — desktop only */}
              <div
                aria-hidden="true"
                className="hidden md:block pointer-events-none"
                style={{
                  position: "absolute",
                  inset: "-60px",
                  background:
                    "radial-gradient(ellipse 60% 50% at center, rgba(158,216,245,0.07), transparent 70%)",
                  zIndex: 0,
                }}
              />
            <div
              className="relative w-full p-7"
              style={{
                position: "relative",
                overflow: "visible",
                background: "#FDFCFA",
                borderTopLeftRadius: 0,
                borderTopRightRadius: 0,
                borderBottomLeftRadius: 0,
                borderBottomRightRadius: 0,
                boxShadow:
                  "0 1px 2px rgba(0,0,0,0.3), 0 24px 64px rgba(0,0,0,0.45)",
                transform: "rotate(0.5deg)",
                zIndex: 1,
              }}
            >
              {/* Top accent strip */}
              <div
                aria-hidden="true"
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: "4px",
                  background: "#9ED8F5",
                }}
              />
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

              {/* Metadata row */}
              <div
                className="mono flex justify-between text-[9px] uppercase tracking-[0.15em] mt-2"
                style={{ color: "#75726B" }}
              >
                <span>NO. 001</span>
                <span>QTY 20</span>
                <span>DEDICATED EDITOR</span>
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

              {/* Total */}
              <div
                className="mono flex justify-between text-[13px] font-medium mt-3 pt-3"
                style={{ color: "#1A1A1A", borderTop: "2px solid #1A1A1A" }}
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

              {/* Stamp */}
              <div
                className="mono"
                style={{
                  position: "absolute",
                  right: "18px",
                  bottom: "44px",
                  fontSize: "11px",
                  letterSpacing: "0.15em",
                  color: "#4A7A96",
                  border: "2px solid #4A7A96",
                  padding: "6px 12px",
                  borderRadius: "4px",
                  transform: "rotate(-8deg)",
                  opacity: 0.85,
                  background: "transparent",
                  textTransform: "uppercase",
                  pointerEvents: "none",
                }}
              >
                PAY PER VIDEO
              </div>

              {/* Torn bottom edge */}
              <div
                aria-hidden="true"
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  bottom: "-12px",
                  height: "12px",
                  background:
                    "linear-gradient(-45deg, transparent 8px, #FDFCFA 0) 0 0 / 16px 12px repeat-x, linear-gradient(45deg, transparent 8px, #FDFCFA 0) 0 0 / 16px 12px repeat-x",
                }}
              />
            </div>
          </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
