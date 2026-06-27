import { useEffect, useRef, useState } from "react";
import adchefsLogo from "@/assets/adchefs-logo-dark.png.asset.json";

/* ------------------------------------------------------------------ */
/* Signature graphic for /creative-strategy                            */
/* A printed creative brief sheet, same paper/3D language as Pricing  */
/* ------------------------------------------------------------------ */

const rows: { label: string; value: string; ink?: boolean }[] = [
  { label: "Account read", value: "Weekly" },
  { label: "Winning angles", value: "Mapped" },
  { label: "Hook variations", value: "Tested" },
  { label: "Shot list", value: "Briefed" },
  { label: "Editor placement", value: "Included" },
  { label: "Produced videos", value: "Shipped" },
  { label: "KPI dashboard", value: "Live" },
];

const CreativeBriefDoc = () => {
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

  const lineDelay = (i: number) => (reduced ? 0 : 500 + i * 70);

  return (
    <div
      ref={wrapRef}
      className="relative w-full"
      style={{ maxWidth: 420, perspective: "1800px" }}
    >
      {/* Clip header — bulldog clip suggesting a clipboard / brief */}
      <div
        aria-hidden
        className="relative mx-auto"
        style={{
          width: "38%",
          height: 16,
          background:
            "linear-gradient(180deg, #c9c6bd 0%, #8d8a82 50%, #6e6b63 100%)",
          borderRadius: 3,
          boxShadow:
            "inset 0 1px 0 rgba(255,255,255,0.5), 0 2px 6px -2px rgba(0,0,0,0.35)",
          opacity: printed ? 1 : 0,
          transition: "opacity 400ms ease",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 4,
            left: "10%",
            right: "10%",
            height: 3,
            background: "rgba(0,0,0,0.25)",
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

      <div style={{ marginTop: 2 }}>
        <div
          style={{
            transform: printed
              ? "translateY(0) rotateX(4deg) rotateY(-6deg) rotateZ(-2deg)"
              : "translateY(-8%) rotateX(4deg) rotateY(-6deg) rotateZ(-2deg)",
            transformOrigin: "50% 0%",
            transition: reduced
              ? "none"
              : "transform 1400ms cubic-bezier(0.22, 0.61, 0.36, 1)",
            willChange: "transform",
            opacity: printed ? 1 : 0,
            transitionProperty: "transform, opacity",
          }}
        >
          <div
            style={{
              position: "relative",
              background:
                "linear-gradient(180deg, #FBFAF6 0%, #FDFCF8 14%, #F5F2EA 55%, #FDFCF8 88%, #FBFAF6 100%)",
              boxShadow:
                "0 1px 0 rgba(255,255,255,0.9) inset, 0 -1px 0 rgba(0,0,0,0.04) inset, 22px 36px 70px -30px rgba(26,26,26,0.50), 6px 10px 22px -10px rgba(26,26,26,0.22)",
              padding: "30px 30px 28px",
              borderRadius: 2,
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
              className="relative"
              style={{
                opacity: printed ? 1 : 0,
                transform: printed ? "translateY(0)" : "translateY(4px)",
                transition: reduced
                  ? "none"
                  : `opacity 500ms ease ${lineDelay(0)}ms, transform 500ms ease ${lineDelay(0)}ms`,
              }}
            >
              <div className="flex items-center justify-between">
                <img
                  src={adchefsLogo.url}
                  alt="AdChefs"
                  style={{ height: 22, width: "auto" }}
                  loading="lazy"
                  decoding="async"
                />
                <span
                  style={{
                    fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                    fontSize: 9,
                    letterSpacing: "0.22em",
                    textTransform: "uppercase",
                    color: "#9A968C",
                  }}
                >
                  Brief · w24
                </span>
              </div>
              <div
                style={{
                  marginTop: 14,
                  fontFamily: "'Inter Tight', sans-serif",
                  fontWeight: 700,
                  fontSize: 14,
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                  color: "#1A1A1A",
                }}
              >
                Creative Operating System
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
                Account · Confidential
              </div>
              <div
                style={{
                  marginTop: 14,
                  borderTop: "1px dashed rgba(26,26,26,0.28)",
                }}
              />
            </div>

            {/* Rows */}
            <ul className="relative mt-4 space-y-[11px]">
              {rows.map((it, i) => (
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

            {/*
              SWAP TARGET: this OWNED BY / ONE OPERATOR block is the
              placeholder for a real ROAS chart once a cleared client
              result is available. Replace the inner block, keep the
              border-top + spacing wrapper.
            */}
            <div
              className="relative mt-6 pt-3"
              style={{
                borderTop: "1.5px solid #1A1A1A",
                opacity: printed ? 1 : 0,
                transform: printed ? "translateY(0)" : "translateY(4px)",
                transition: reduced
                  ? "none"
                  : `opacity 600ms ease ${lineDelay(rows.length + 2)}ms, transform 600ms ease ${lineDelay(rows.length + 2)}ms`,
              }}
            >
              <div
                style={{
                  fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                  fontSize: 10,
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  color: "#9A968C",
                }}
              >
                Owned by
              </div>
              <div
                style={{
                  marginTop: 6,
                  fontFamily: "'Inter Tight', sans-serif",
                  fontWeight: 700,
                  fontSize: 30,
                  lineHeight: 1.02,
                  letterSpacing: "-0.02em",
                  textTransform: "uppercase",
                  color: "#1A1A1A",
                }}
              >
                One operator
              </div>
            </div>

            {/* Footer / signature */}
            <div
              className="relative mt-6 pt-4"
              style={{
                borderTop: "1px dashed rgba(26,26,26,0.28)",
                opacity: printed ? 1 : 0,
                transition: reduced
                  ? "none"
                  : `opacity 600ms ease ${lineDelay(rows.length + 3)}ms`,
              }}
            >
              <div className="flex items-end justify-between gap-4">
                <div>
                  <div
                    style={{
                      fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                      fontSize: 9,
                      letterSpacing: "0.22em",
                      textTransform: "uppercase",
                      color: "#9A968C",
                    }}
                  >
                    Owned by
                  </div>
                  <div
                    style={{
                      marginTop: 2,
                      fontFamily: "'Instrument Serif', serif",
                      fontStyle: "italic",
                      fontSize: 22,
                      lineHeight: 1.1,
                      color: "#1A1A1A",
                    }}
                  >
                    Jonas Bjørnerud
                  </div>
                </div>
                <div
                  style={{
                    fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                    fontSize: 8,
                    letterSpacing: "0.32em",
                    color: "#9A968C",
                    paddingBottom: 4,
                  }}
                >
                  ADCHEFS · 2026
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreativeBriefDoc;