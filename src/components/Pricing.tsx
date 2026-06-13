import { ArrowRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import adchefsLogo from "@/assets/adchefs-logo-dark.png.asset.json";

const Pricing = () => {
  const scrollToBooking = (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById("booking");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="pricing" className="py-20 sm:py-36" style={{ background: "#F7F6F3" }}>
      <div className="mx-auto max-w-[1240px] px-6">
        <div className="flex flex-col md:flex-row gap-16 md:gap-20 md:items-start">
          {/* Left column */}
          <div className="md:w-[55%] flex-shrink-0">
            <span className="eyebrow eyebrow-accent">PRICING</span>
            <h2
              className="mt-6 text-[36px] md:text-[52px] leading-[1.02] tracking-[-0.025em] font-semibold"
              style={{ fontFamily: "'Inter Tight', sans-serif", color: "#1A1A1A" }}
            >
              Stop paying retainers. Pay for videos that{" "}
              <em
                className="not-italic italic"
                style={{ fontFamily: "'Instrument Serif', serif", fontStyle: "italic", fontWeight: 400 }}
              >
                ship
              </em>
              .
            </h2>
            <p
              className="mt-6 text-[16px] leading-relaxed max-w-[520px]"
              style={{ color: "#75726B" }}
            >
              Traditional agencies charge whether anything gets delivered or not. With AdChefs, the only line item is the work: finished videos, hook variations, cutdowns, editing tools, and delivery tracking included.
            </p>

            <div
              className="mt-7 inline-flex items-baseline gap-2"
              style={{
                fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                fontSize: 12,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: "#1A1A1A",
                borderBottom: "1px solid rgba(26,26,26,0.15)",
                paddingBottom: 6,
              }}
            >
              <span style={{ color: "#75726B" }}>FROM</span>
              <span style={{ fontWeight: 700 }}>$100</span>
              <span style={{ color: "#75726B" }}>/ DELIVERED VIDEO</span>
            </div>

            <div className="mt-8">
              <a
                href="#booking"
                onClick={scrollToBooking}
                className="group inline-flex items-center justify-center rounded-[4px] px-7 py-4 text-[14px] font-medium transition-all hover:-translate-y-[2px] hover:shadow-[0_12px_32px_-12px_rgba(26,26,26,0.45)]"
                style={{ background: "#1A1A1A", color: "#F7F6F3" }}
              >
                Book a 15 minute call
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>
            </div>

            <p className="mt-5 text-[14px]" style={{ color: "#75726B" }}>
              Revisions included until final approval. Cancel anytime.
            </p>
            <p
              className="mt-2 text-[13px] max-w-[480px]"
              style={{ color: "#9A968C", fontStyle: "italic", fontFamily: "'Instrument Serif', serif", fontSize: 16, lineHeight: 1.5 }}
            >
              Built for brands that need consistent creative output without bloated agency retainers.
            </p>
          </div>

          {/* Right column — premium printed receipt */}
          <div className="md:w-[45%] flex flex-col items-center md:items-end">
            <PrintingReceipt />
          </div>
        </div>
      </div>
    </section>
  );
};

/* ------------------------------------------------------------------ */
/* Premium thermal receipt — print-on-scroll animation                */
/* ------------------------------------------------------------------ */

const items: { label: string; value: string; ink?: boolean }[] = [
  { label: "Price per video", value: "$100", ink: true },
  { label: "Hook variations", value: "Included" },
  { label: "Vertical + square cuts", value: "Included" },
  { label: "Editing tools & licenses", value: "Included" },
  { label: "AI tools", value: "Included" },
  { label: "Ongoing management", value: "Included" },
  { label: "KPI dashboard", value: "Included" },
  { label: "Delivery tracking", value: "Included" },
];

const PrintingReceipt = () => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [printed, setPrinted] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      setReduced(true);
      setPrinted(true);
      return;
    }
    const el = wrapRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setPrinted(true);
            obs.disconnect();
          }
        });
      },
      { threshold: 0.25 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const W = 320;
  const teeth = 20;
  const toothW = W / teeth;
  let bottomEdge = `M 0 0`;
  for (let i = 0; i < teeth; i++) {
    const x1 = i * toothW;
    const x2 = x1 + toothW / 2;
    const x3 = x1 + toothW;
    bottomEdge += ` L ${x2} 7 L ${x3} 0`;
  }

  const lineDelay = (i: number) => (reduced ? 0 : 550 + i * 80);

  return (
    <div
      ref={wrapRef}
      className="relative w-full"
      style={{ maxWidth: 400, perspective: "1800px" }}
    >
      {/* Printer slot */}
      <div
        aria-hidden
        className="relative mx-auto"
        style={{
          width: "92%",
          height: 14,
          background:
            "linear-gradient(180deg, rgba(26,26,26,0.06) 0%, rgba(26,26,26,0.18) 50%, rgba(26,26,26,0.04) 100%)",
          borderRadius: 2,
          opacity: printed ? 1 : 0,
          transition: "opacity 400ms ease",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 6,
            left: "6%",
            right: "6%",
            height: 2,
            background: "#1A1A1A",
            opacity: 0.55,
            borderRadius: 2,
          }}
        />
      </div>

      {/* Floor shadow */}
      <div
        aria-hidden
        className="absolute left-1/2 -translate-x-1/2 pointer-events-none"
        style={{
          bottom: -34,
          width: "82%",
          height: 44,
          background:
            "radial-gradient(50% 50% at 50% 50%, rgba(26,26,26,0.30) 0%, rgba(26,26,26,0) 72%)",
          filter: "blur(10px)",
          opacity: printed ? 1 : 0,
          transition: "opacity 900ms ease 400ms",
        }}
      />

      {/* Clip mask reveals the receipt as it "prints" out of the slot */}
      <div
        style={{
          marginTop: 2,
          clipPath: "inset(0 0 0 0)",
          WebkitClipPath: "inset(0 0 0 0)",
        }}
      >
        <div
          style={{
            transform: printed
              ? "translateY(0) rotateX(4deg) rotateY(-6deg) rotateZ(-2deg)"
              : "translateY(-102%) rotateX(4deg) rotateY(-6deg) rotateZ(-2deg)",
            transformOrigin: "50% 0%",
            transition: reduced
              ? "none"
              : "transform 1600ms cubic-bezier(0.22, 0.61, 0.36, 1)",
            willChange: "transform",
          }}
        >
          {/* Receipt body */}
          <div
            style={{
              position: "relative",
              background:
                "linear-gradient(180deg, #FBFAF6 0%, #FDFCF8 14%, #F5F2EA 55%, #FDFCF8 88%, #FBFAF6 100%)",
              boxShadow:
                "0 1px 0 rgba(255,255,255,0.9) inset, 0 -1px 0 rgba(0,0,0,0.04) inset, 22px 36px 70px -30px rgba(26,26,26,0.50), 6px 10px 22px -10px rgba(26,26,26,0.22)",
              padding: "28px 30px 26px",
              borderRadius: "1px 1px 0 0",
            }}
          >
            {/* Side curl shading */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "linear-gradient(90deg, rgba(26,26,26,0.10) 0%, rgba(26,26,26,0) 14%, rgba(26,26,26,0) 86%, rgba(26,26,26,0.12) 100%)",
                mixBlendMode: "multiply",
              }}
            />
            {/* Paper grain */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-[0.07]"
              style={{
                backgroundImage:
                  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
                mixBlendMode: "multiply",
              }}
            />

            {/* Header */}
            <div
              className="relative text-center"
              style={{
                opacity: printed ? 1 : 0,
                transform: printed ? "translateY(0)" : "translateY(4px)",
                transition: reduced
                  ? "none"
                  : `opacity 500ms ease ${lineDelay(0)}ms, transform 500ms ease ${lineDelay(0)}ms`,
              }}
            >
              <div className="flex justify-center">
                <img
                  src={adchefsLogo.url}
                  alt="AdChefs"
                  style={{ height: 32, width: "auto" }}
                />
              </div>
              <div
                style={{
                  marginTop: 4,
                  fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                  fontSize: 9,
                  letterSpacing: "0.24em",
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
            <ul className="relative mt-4 space-y-[11px]">
              {items.map((it, i) => (
                <li
                  key={it.label}
                  className="flex items-baseline justify-between gap-3"
                  style={{
                    fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                    fontSize: it.ink ? 12 : 11,
                    letterSpacing: "0.02em",
                    color: it.ink ? "#1A1A1A" : "#6E6B63",
                    opacity: printed ? 1 : 0,
                    transform: printed ? "translateY(0)" : "translateY(3px)",
                    transition: reduced
                      ? "none"
                      : `opacity 420ms ease ${lineDelay(i + 1)}ms, transform 420ms ease ${lineDelay(i + 1)}ms`,
                  }}
                >
                  <span
                    style={{
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                      fontWeight: it.ink ? 700 : 500,
                    }}
                  >
                    {it.label}
                  </span>
                  <span
                    aria-hidden
                    style={{
                      flex: 1,
                      margin: "0 8px",
                      borderBottom: "1px dotted rgba(26,26,26,0.25)",
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
              className="relative mt-6 pt-3"
              style={{
                borderTop: "1.5px solid #1A1A1A",
                opacity: printed ? 1 : 0,
                transform: printed ? "translateY(0) scale(1)" : "translateY(4px) scale(0.98)",
                transition: reduced
                  ? "none"
                  : `opacity 600ms ease ${lineDelay(items.length + 2)}ms, transform 600ms cubic-bezier(0.2,0.7,0.3,1) ${lineDelay(items.length + 2)}ms`,
              }}
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
                    fontSize: 26,
                    letterSpacing: "-0.025em",
                    color: "#1A1A1A",
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  $100
                </span>
              </div>
              <div
                style={{
                  marginTop: 8,
                  fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                  fontSize: 10,
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  color: "#1A1A1A",
                  fontWeight: 600,
                }}
              >
                Pay only per delivered video
              </div>
            </div>

            {/* Footer */}
            <div
              className="relative mt-6 pt-4 text-center"
              style={{
                borderTop: "1px dashed rgba(26,26,26,0.28)",
                opacity: printed ? 1 : 0,
                transition: reduced
                  ? "none"
                  : `opacity 600ms ease ${lineDelay(items.length + 3)}ms`,
              }}
            >
              <div
                style={{
                  fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                  fontSize: 9.5,
                  lineHeight: 1.7,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: "#75726B",
                }}
              >
                Agencies bill $4,500+
                <br />
                whether anything ships or not
              </div>

              {/* Barcode */}
              <div
                aria-hidden
                className="mx-auto mt-5 flex items-end justify-center gap-[2px]"
                style={{ height: 34 }}
              >
                {[3, 1, 2, 1, 3, 2, 1, 2, 3, 1, 2, 1, 3, 1, 2, 2, 1, 3, 1, 2, 3, 1, 2, 1, 3, 1, 2].map(
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
                  letterSpacing: "0.32em",
                  color: "#9A968C",
                }}
              >
                ADCHEFS · 2026
              </div>
            </div>
          </div>

          {/* Bottom perforated edge */}
          <svg
            viewBox={`0 0 ${W} 8`}
            width="100%"
            height="14"
            preserveAspectRatio="none"
            style={{ display: "block", filter: "drop-shadow(0 6px 10px rgba(26,26,26,0.18))" }}
            aria-hidden
          >
            <path d={`${bottomEdge} L ${W} 0 L 0 0 Z`} fill="#FBFAF6" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
