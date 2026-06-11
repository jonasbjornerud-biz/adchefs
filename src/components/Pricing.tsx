import { ArrowRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const receiptLines: { label: string; value: string; ink?: boolean }[] = [
  { label: "VIDEOS × 20", value: "$2,000", ink: true },
  { label: "HOOK VARIATIONS + 2 FORMATS", value: "$0" },
  { label: "EDITING TOOLS", value: "$0" },
  { label: "HIGGSFIELD + ELEVENLABS", value: "$0" },
  { label: "ONGOING MANAGEMENT", value: "$0" },
  { label: "AD KPI DASHBOARD", value: "$0" },
  { label: "EDITOR DELIVERY TRACKING", value: "$0" },
];

const Pricing = () => {
  const scrollToBooking = (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById("booking");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const triggerRef = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<"idle" | "armed" | "printed">("idle");
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const el = triggerRef.current;
    if (!el) return;
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setReduceMotion(reduce);
    if (reduce || typeof IntersectionObserver === "undefined") {
      setPhase("printed");
      return;
    }
    setPhase("armed");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setPhase("printed");
            io.disconnect();
          }
        });
      },
      { threshold: 0.35 }
    );
    io.observe(el);
    // Safety fallback: never leave the receipt hidden
    const t = window.setTimeout(() => setPhase("printed"), 4000);
    return () => {
      io.disconnect();
      window.clearTimeout(t);
    };
  }, []);

  const hidden = phase === "armed";
  const printed = phase === "printed";

  const rowStyle = (i: number): React.CSSProperties => ({
    opacity: hidden ? 0 : 1,
    transition: "opacity 0.3s ease-out",
    transitionDelay: printed ? `${400 + i * 80}ms` : "0ms",
  });

  return (
    <section id="pricing" className="py-16 sm:py-32" style={{ background: "#F7F6F3" }}>
      <style>{`
        @keyframes pricing-settle {
          0% { transform: translateY(0); }
          50% { transform: translateY(-2px); }
          100% { transform: translateY(0); }
        }
        @keyframes sheetBreathe {
          0%, 100% { transform: rotateX(6deg) rotateY(-7deg) rotateZ(0.5deg); }
          50%      { transform: rotateX(7.5deg) rotateY(-5deg) rotateZ(0.2deg); }
        }
        @keyframes shadowBreathe {
          0%, 100% { opacity: 0.18; }
          50%      { opacity: 0.14; }
        }
        .receipt-sheet {
          animation: sheetBreathe 10s ease-in-out infinite;
        }
        .receipt-cast-shadow {
          animation: shadowBreathe 10s ease-in-out infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .receipt-sheet,
          .receipt-cast-shadow { animation: none !important; }
        }
      `}</style>
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

          {/* Right column — printer + receipt */}
          <div
            ref={triggerRef}
            className="md:w-[45%] flex flex-col items-center md:items-end"
          >
            <div className="w-full" style={{ maxWidth: "360px" }}>
              {/* Thermal printer bar */}
              <div
                className="relative mx-auto rounded-[6px]"
                style={{
                  width: "calc(100% + 48px)",
                  marginLeft: "-24px",
                  marginRight: "-24px",
                  height: "24px",
                  background:
                    "linear-gradient(180deg, #2A2A2A 0%, #1A1A1A 55%, #111111 100%)",
                  zIndex: 3,
                }}
              >
                {/* Recessed slot */}
                <div
                  className="rounded-full"
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "20px",
                    right: "20px",
                    height: "5px",
                    transform: "translateY(-50%)",
                    background: "#0A0A0A",
                    boxShadow:
                      "inset 0 1px 2px rgba(0,0,0,0.8), 0 1px 0 rgba(247,246,243,0.08)",
                  }}
                />
              </div>

              {/* Clipping container — receipt slides out from under the slot */}
              <div
                style={{
                  overflow: "hidden",
                  paddingBottom: "72px",
                  position: "relative",
                  zIndex: 1,
                  marginTop: "-12px",
                }}
              >
                {/* Translate wrapper */}
                <div
                  style={{
                    transform: hidden ? "translateY(-110%)" : "translateY(0)",
                    transition: "transform 1.8s cubic-bezier(0.22, 1, 0.36, 1)",
                    animation: printed
                      ? "pricing-settle 0.25s ease-out 1.8s"
                      : undefined,
                    willChange: "transform",
                    perspective: "1200px",
                  }}
                >
                  {/* Sheet wrapper — holds paper + detached cast shadow */}
                  <div className="relative">
                    {/* Cast shadow — sibling, behind paper, follows tilt */}
                    <div
                      aria-hidden="true"
                      className="shadow-breathe"
                      style={{
                        position: "absolute",
                        top: "28px",
                        left: "14px",
                        width: "100%",
                        height: "85%",
                        background: "rgba(26,26,26,0.18)",
                        borderRadius: "12px",
                        filter: "blur(26px)",
                        transform: "rotateX(6deg) skewX(-4deg)",
                        transformOrigin: "top center",
                        opacity: 0.18,
                        zIndex: 0,
                        pointerEvents: "none",
                      }}
                    />

                    {/* Receipt paper — flat plane, 3D tilt + curvature shading */}
                    <div
                      className="receipt-paper sheet-breathe relative w-full p-7"
                      style={{
                        background: "#FDFCFA",
                        borderRadius: 0,
                        transform:
                          "rotateX(6deg) rotateY(-7deg) rotateZ(0.5deg)",
                        transformStyle: "preserve-3d",
                        transformOrigin: "top center",
                        zIndex: 1,
                      }}
                    >
                      {/* Wordmark */}
                      <div style={rowStyle(0)}>
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
                          ONE MONTH, ITEMIZED
                        </div>
                      </div>

                      {/* Divider */}
                      <div
                        className="mt-4 w-full"
                        style={{ borderTop: "1.5px dashed rgba(26,26,26,0.25)", ...rowStyle(1) }}
                      />

                      {/* Line items */}
                      <div className="mt-3">
                        {receiptLines.map((line, i) => (
                          <div
                            key={i}
                            className="mono flex justify-between text-[12px] py-1.5"
                            style={{
                              color: line.ink ? "#1A1A1A" : "#75726B",
                              ...rowStyle(2 + i),
                            }}
                          >
                            <span>{line.label}</span>
                            <span>{line.value}</span>
                          </div>
                        ))}
                      </div>

                      {/* Total */}
                      <div
                        className="mono flex justify-between text-[13px] font-medium mt-3 pt-3"
                        style={{
                          color: "#1A1A1A",
                          borderTop: "2px solid #1A1A1A",
                          ...rowStyle(2 + receiptLines.length),
                        }}
                      >
                        <span>TOTAL</span>
                        <span>$2,000</span>
                      </div>

                      {/* Per video */}
                      <div
                        className="mono text-center text-[10px] uppercase tracking-[0.15em] mt-3"
                        style={{ color: "#75726B", ...rowStyle(3 + receiptLines.length) }}
                      >
                        FROM $100 / DELIVERED VIDEO
                      </div>

                      {/* Divider */}
                      <div
                        className="mt-3 w-full"
                        style={{
                          borderTop: "1.5px dashed rgba(26,26,26,0.25)",
                          ...rowStyle(4 + receiptLines.length),
                        }}
                      />

                      {/* Footer */}
                      <div
                        className="mono text-center text-[10px] uppercase tracking-[0.15em] mt-3 leading-relaxed"
                        style={{ color: "#B0552F", ...rowStyle(5 + receiptLines.length) }}
                      >
                        AN AGENCY BILLS $4,500 THIS MONTH<br />
                        WHETHER ANYTHING SHIPS OR NOT
                      </div>

                      {/* Torn bottom edge — shortened from left to clear the curl */}
                      <div
                        aria-hidden="true"
                        style={{
                          position: "absolute",
                          left: "56px",
                          right: 0,
                          bottom: "-12px",
                          height: "12px",
                          background:
                            "linear-gradient(-45deg, transparent 8px, #FDFCFA 0) 0 0 / 16px 12px repeat-x, linear-gradient(45deg, transparent 8px, #FDFCFA 0) 0 0 / 16px 12px repeat-x",
                        }}
                      />

                      {/* Curvature shading — last child, above content */}
                      <div
                        aria-hidden="true"
                        style={{
                          position: "absolute",
                          inset: 0,
                          pointerEvents: "none",
                          borderRadius: "inherit",
                          background:
                            "linear-gradient(100deg, rgba(26,26,26,0.10) 0%, rgba(26,26,26,0.02) 18%, rgba(255,255,255,0) 40%, rgba(255,255,255,0.35) 62%, rgba(26,26,26,0.04) 85%, rgba(26,26,26,0.10) 100%), linear-gradient(180deg, rgba(26,26,26,0.06) 0%, transparent 12%)",
                          mixBlendMode: "soft-light",
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
