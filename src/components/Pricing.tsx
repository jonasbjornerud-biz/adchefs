import { ArrowRight } from "lucide-react";

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

          {/* Right column — long thermal receipt, S-curved, static */}
          <div className="md:w-[45%] flex flex-col items-center md:items-end">
            <LongReceipt />
          </div>
        </div>
      </div>
    </section>
  );
};

/* ------------------------------------------------------------------ */
/* Premium thermal receipt — straight, readable, with curled corners  */
/* ------------------------------------------------------------------ */

const items: { label: string; value: string; ink?: boolean }[] = [
  { label: "Videos × 20", value: "$2,000", ink: true },
  { label: "Hook variations", value: "Included" },
  { label: "Vertical + square cuts", value: "Included" },
  { label: "Editing tools & licenses", value: "Included" },
  { label: "Higgsfield + ElevenLabs", value: "Included" },
  { label: "Ongoing management", value: "Included" },
  { label: "KPI dashboard", value: "Included" },
  { label: "Delivery tracking", value: "Included" },
];

const LongReceipt = () => {
  const W = 320;
  const teeth = 18;
  const toothW = W / teeth;

  const edge = (y: number, dir: 1 | -1) => {
    let d = `M 0 ${y}`;
    for (let i = 0; i < teeth; i++) {
      const x1 = i * toothW;
      const x2 = x1 + toothW / 2;
      const x3 = x1 + toothW;
      d += ` L ${x2} ${y + 6 * dir} L ${x3} ${y}`;
    }
    return d;
  };

  return (
    <div
      className="relative"
      style={{
        width: "100%",
        maxWidth: 380,
        perspective: "1600px",
      }}
    >
      {/* Floor shadow */}
      <div
        aria-hidden
        className="absolute left-1/2 -translate-x-1/2"
        style={{
          bottom: -28,
          width: "78%",
          height: 36,
          background:
            "radial-gradient(50% 50% at 50% 50%, rgba(26,26,26,0.28) 0%, rgba(26,26,26,0) 70%)",
          filter: "blur(6px)",
        }}
      />

      <div
        style={{
          transform: "rotateX(6deg) rotateY(-7deg) rotateZ(-2.5deg)",
          transformOrigin: "50% 30%",
        }}
      >
        {/* Top torn edge */}
        <svg
          viewBox={`0 0 ${W} 8`}
          width="100%"
          height="14"
          preserveAspectRatio="none"
          style={{ display: "block" }}
          aria-hidden
        >
          <path d={`${edge(0, -1)} L ${W} 8 L 0 8 Z`} fill="#FBFAF6" />
        </svg>

        {/* Body */}
        <div
          style={{
            background:
              "linear-gradient(180deg, #FBFAF6 0%, #FDFCF8 12%, #F5F2EA 50%, #FDFCF8 88%, #FBFAF6 100%)",
            boxShadow:
              "0 1px 0 rgba(255,255,255,0.9) inset, 0 -1px 0 rgba(0,0,0,0.04) inset, 18px 32px 60px -28px rgba(26,26,26,0.45), 4px 8px 18px -8px rgba(26,26,26,0.18)",
            padding: "26px 28px 22px",
            position: "relative",
          }}
        >
          {/* Subtle side curl shading */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "linear-gradient(90deg, rgba(26,26,26,0.10) 0%, rgba(26,26,26,0) 12%, rgba(26,26,26,0) 88%, rgba(26,26,26,0.12) 100%)",
              mixBlendMode: "multiply",
            }}
          />
          {/* Paper grain */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
              mixBlendMode: "multiply",
            }}
          />

          {/* Header */}
          <div className="relative text-center">
            <div
              style={{
                fontFamily: "'Inter Tight', sans-serif",
                fontWeight: 700,
                fontSize: 18,
                letterSpacing: "-0.02em",
                color: "#1A1A1A",
              }}
            >
              AdChefs<span style={{ color: "#B0552F" }}>.</span>
            </div>
            <div
              style={{
                marginTop: 4,
                fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                fontSize: 9,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: "#9A968C",
              }}
            >
              One month · itemized
            </div>
            <div
              style={{
                marginTop: 14,
                borderTop: "1px dashed rgba(26,26,26,0.28)",
              }}
            />
          </div>

          {/* Items */}
          <ul className="relative mt-4 space-y-[10px]">
            {items.map((it) => (
              <li
                key={it.label}
                className="flex items-baseline justify-between gap-3"
                style={{
                  fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                  fontSize: 11,
                  letterSpacing: "0.02em",
                  color: it.ink ? "#1A1A1A" : "#6E6B63",
                }}
              >
                <span
                  style={{
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    fontWeight: it.ink ? 600 : 500,
                  }}
                >
                  {it.label}
                </span>
                <span
                  aria-hidden
                  style={{
                    flex: 1,
                    margin: "0 8px",
                    borderBottom: "1px dotted rgba(26,26,26,0.22)",
                    transform: "translateY(-3px)",
                  }}
                />
                <span
                  style={{
                    fontVariantNumeric: "tabular-nums",
                    fontWeight: it.ink ? 700 : 500,
                    color: it.ink ? "#1A1A1A" : "#9A968C",
                  }}
                >
                  {it.value}
                </span>
              </li>
            ))}
          </ul>

          {/* Total */}
          <div
            className="relative mt-5 pt-3"
            style={{ borderTop: "1.5px solid #1A1A1A" }}
          >
            <div className="flex items-baseline justify-between">
              <span
                style={{
                  fontFamily: "'Inter Tight', sans-serif",
                  fontWeight: 700,
                  fontSize: 14,
                  letterSpacing: "0.02em",
                  textTransform: "uppercase",
                  color: "#1A1A1A",
                }}
              >
                Total
              </span>
              <span
                style={{
                  fontFamily: "'Inter Tight', sans-serif",
                  fontWeight: 700,
                  fontSize: 22,
                  letterSpacing: "-0.02em",
                  color: "#1A1A1A",
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                $2,000
              </span>
            </div>
            <div
              style={{
                marginTop: 6,
                fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                fontSize: 9,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: "#9A968C",
              }}
            >
              From $100 / delivered video
            </div>
          </div>

          {/* Footer */}
          <div
            className="relative mt-5 pt-4 text-center"
            style={{ borderTop: "1px dashed rgba(26,26,26,0.28)" }}
          >
            <div
              style={{
                fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                fontSize: 9.5,
                lineHeight: 1.7,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "#B0552F",
              }}
            >
              Agencies bill $4,500
              <br />
              whether anything ships or not
            </div>

            {/* Barcode */}
            <div
              aria-hidden
              className="mx-auto mt-5 flex items-end justify-center gap-[2px]"
              style={{ height: 32 }}
            >
              {[3, 1, 2, 1, 3, 2, 1, 2, 3, 1, 2, 1, 3, 1, 2, 2, 1, 3, 1, 2, 3, 1, 2, 1, 3].map(
                (w, i) => (
                  <span
                    key={i}
                    style={{
                      width: w,
                      height: "100%",
                      background: "#1A1A1A",
                      opacity: i % 4 === 0 ? 0.85 : 1,
                    }}
                  />
                )
              )}
            </div>
            <div
              style={{
                marginTop: 6,
                fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                fontSize: 8,
                letterSpacing: "0.3em",
                color: "#9A968C",
              }}
            >
              ADCHEFS · 2026
            </div>
          </div>
        </div>

        {/* Bottom torn edge */}
        <svg
          viewBox={`0 0 ${W} 8`}
          width="100%"
          height="14"
          preserveAspectRatio="none"
          style={{ display: "block" }}
          aria-hidden
        >
          <path d={`M 0 0 L ${W} 0 ${edge(0, 1).replace("M 0 0", "L 0 0")} Z`} fill="#FBFAF6" />
        </svg>
      </div>
    </div>
  );
};

export default Pricing;
