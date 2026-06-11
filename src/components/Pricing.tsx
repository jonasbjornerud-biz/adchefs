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
        @keyframes pricing-sway {
          0%   { transform: rotate(0.5deg) translateY(0); }
          50%  { transform: rotate(-0.3deg) translateY(2px); }
          100% { transform: rotate(0.5deg) translateY(0); }
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
                className="relative mx-auto"
                style={{
                  width: "calc(100% + 64px)",
                  marginLeft: "-32px",
                  marginRight: "-32px",
                  height: "22px",
                  background: "#1A1A1A",
                  borderRadius: "4px",
                  zIndex: 2,
                }}
              >
                {/* Recessed slot */}
                <div
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "14px",
                    right: "14px",
                    height: "4px",
                    transform: "translateY(-50%)",
                    background: "#0D0D0D",
                    borderRadius: "1px",
                  }}
                />
                {/* Highlight line above slot */}
                <div
                  style={{
                    position: "absolute",
                    top: "calc(50% - 3px)",
                    left: "14px",
                    right: "14px",
                    height: "1px",
                    background: "rgba(247,246,243,0.12)",
                  }}
                />
                {/* Screw dots */}
                <div
                  style={{
                    position: "absolute",
                    left: "6px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    width: "4px",
                    height: "4px",
                    borderRadius: "9999px",
                    background: "rgba(247,246,243,0.2)",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    right: "6px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    width: "4px",
                    height: "4px",
                    borderRadius: "9999px",
                    background: "rgba(247,246,243,0.2)",
                  }}
                />
              </div>

              {/* Clipping container — receipt slides out from under the slot */}
              <div
                style={{
                  overflow: "hidden",
                  paddingBottom: "14px",
                  position: "relative",
                  zIndex: 1,
                  marginTop: "-6px",
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
                  }}
                >
                  {/* Rotation wrapper — keeps 0.5deg rotation isolated from translate */}
                  <div
                    style={{
                      transform: "rotate(0.5deg)",
                      animation:
                        printed && !reduceMotion
                          ? "pricing-sway 6s ease-in-out 2.1s infinite"
                          : undefined,
                      transformOrigin: "center top",
                    }}
                  >
                    <div
                      className="relative w-full p-7"
                      style={{
                        position: "relative",
                        background: "#FDFCFA",
                        borderRadius: 0,
                        boxShadow:
                          "0 2px 4px rgba(26,26,26,0.05), 0 16px 40px rgba(26,26,26,0.14)",
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

                      {/* Paper curl — bottom-left corner */}
                      <div
                        aria-hidden="true"
                        style={{
                          position: "absolute",
                          left: 0,
                          bottom: 0,
                          width: "28px",
                          height: "28px",
                          background:
                            "linear-gradient(135deg, #E8E6E0 0%, #F3F1EC 50%, transparent 50%)",
                          boxShadow: "-2px 2px 4px rgba(26,26,26,0.08)",
                          zIndex: 2,
                        }}
                      />

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
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
