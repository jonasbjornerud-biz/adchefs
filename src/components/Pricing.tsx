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
        @keyframes receiptSway3d {
          0%   { transform: rotateX(0deg) rotateY(0deg) rotateZ(0.4deg); }
          25%  { transform: rotateX(1.2deg) rotateY(-1deg) rotateZ(-0.2deg); }
          50%  { transform: rotateX(-0.6deg) rotateY(0.8deg) rotateZ(0.3deg); }
          75%  { transform: rotateX(0.8deg) rotateY(-0.5deg) rotateZ(-0.3deg); }
          100% { transform: rotateX(0deg) rotateY(0deg) rotateZ(0.4deg); }
        }
        @keyframes curlFlutter {
          0%   { transform: rotate(0deg) scale(1); }
          30%  { transform: rotate(-3deg) scale(1.04); }
          55%  { transform: rotate(1deg) scale(0.99); }
          80%  { transform: rotate(-2deg) scale(1.02); }
          100% { transform: rotate(0deg) scale(1); }
        }
        @keyframes wrinkleDrift {
          0%   { background-position: 0% 0%, 100% 0%, 0% 100%, 100% 100%; }
          50%  { background-position: 30% 15%, 70% 20%, 25% 75%, 75% 80%; }
          100% { background-position: 0% 0%, 100% 0%, 0% 100%, 100% 100%; }
        }
        .wrinkle-light {
          background:
            radial-gradient(ellipse 50% 30% at 25% 20%, rgba(26,26,26,0.05), transparent 70%),
            radial-gradient(ellipse 40% 25% at 75% 45%, rgba(26,26,26,0.04), transparent 70%),
            radial-gradient(ellipse 55% 30% at 40% 75%, rgba(26,26,26,0.05), transparent 70%),
            radial-gradient(ellipse 35% 20% at 80% 85%, rgba(255,255,255,0.5), transparent 70%);
          background-size: 220% 220%;
        }
        @media (prefers-reduced-motion: no-preference) {
          .receipt-sway {
            animation: receiptSway3d 8s ease-in-out infinite;
            transform-origin: top center;
            transform-style: preserve-3d;
            will-change: transform;
          }
          .curl-flutter {
            animation: curlFlutter 8s ease-in-out infinite;
          }
          .wrinkle-light {
            animation: wrinkleDrift 8s ease-in-out infinite;
          }
        }
        .receipt-paper { position: relative; }
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
                    perspective: "900px",
                  }}
                >
                  {/* Sway wrapper — moves the whole sheet (paper + curl together) */}
                  <div className="receipt-sway relative">
                    {/* Receipt paper — crisp content, lighting overlay fakes wrinkles */}
                    <div
                      className="receipt-paper relative w-full p-7"
                      style={{
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

                      {/* Wrinkle lighting overlay — last child, sits above all content */}
                      <div
                        className="wrinkle-light"
                        aria-hidden="true"
                        style={{
                          position: "absolute",
                          inset: 0,
                          pointerEvents: "none",
                          mixBlendMode: "multiply",
                          opacity: 0.5,
                          borderRadius: "inherit",
                        }}
                      />
                    </div>

                    {/* Drawn SVG curl — sibling of paper so filter doesn't touch it */}
                    <svg
                      viewBox="0 0 64 64"
                      aria-hidden="true"
                      className="curl-flutter"
                      style={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        width: "64px",
                        height: "64px",
                        overflow: "visible",
                        transformOrigin: "0% 100%",
                        zIndex: 5,
                        pointerEvents: "none",
                      }}
                    >
                      <defs>
                        <linearGradient id="curlFace" x1="0" y1="1" x2="0.8" y2="0.2">
                          <stop offset="0" stopColor="#D8D6CF" />
                          <stop offset="0.45" stopColor="#F1EFEA" />
                          <stop offset="1" stopColor="#FDFCFA" />
                        </linearGradient>
                      </defs>
                      {/* cast shadow */}
                      <path
                        d="M0 64 L0 20 Q2 50 26 58 Q44 63 64 64 Z"
                        fill="rgba(26,26,26,0.14)"
                        style={{ filter: "blur(3px)", transform: "translate(3px,-2px)" }}
                      />
                      {/* curled flap face */}
                      <path
                        d="M0 64 L0 14 Q14 46 40 56 Q52 61 64 64 Q34 60 14 44 Q2 32 0 14 Z"
                        fill="url(#curlFace)"
                      />
                      {/* fold crease */}
                      <path
                        d="M0 14 Q14 46 40 56 Q52 61 64 64"
                        fill="none"
                        stroke="rgba(26,26,26,0.10)"
                        strokeWidth={0.8}
                      />
                    </svg>
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
