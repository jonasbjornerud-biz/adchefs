import { useEffect, useRef, useState } from "react";

/* ------------------------------------------------------------------ */
/* Brand tokens used here                                              */
/* Ink #1A1A1A · Paper #F7F6F3 · Surface #EEEDE8 · Muted #75726B       */
/* Accent #9ED8F5                                                      */
/* ------------------------------------------------------------------ */

const MONO = "'JetBrains Mono', ui-monospace, monospace";
const DISPLAY = "'Inter Tight', sans-serif";
const SERIF = "'Instrument Serif', serif";

/* --- Illustrations ----------------------------------------------- */

const BriefIllustration = () => {
  const rows = [
    { l: "ANGLE", v: "MAPPED" },
    { l: "HOOK", v: "TESTED" },
    { l: "SHOT LIST", v: "BRIEFED" },
    { l: "READ", v: "WEEKLY" },
  ];
  return (
    <div
      aria-hidden
      className="absolute inset-5 rounded-[4px] flex items-center justify-center"
      style={{ background: "#F7F6F3", border: "1px solid rgba(26,26,26,0.06)" }}
    >
      <div className="w-[78%]">
        <ul className="space-y-[10px]">
          {rows.map((r) => (
            <li
              key={r.l}
              className="flex items-baseline gap-2"
              style={{
                fontFamily: MONO,
                fontSize: 9,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "#75726B",
              }}
            >
              <span>{r.l}</span>
              <span
                style={{
                  flex: 1,
                  borderBottom: "1px dotted rgba(26,26,26,0.25)",
                  transform: "translateY(-3px)",
                }}
              />
              <span style={{ color: "#1A1A1A" }}>{r.v}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const DeliveryIllustration = () => {
  return (
    <div
      aria-hidden
      className="absolute inset-5 rounded-[4px] flex flex-col items-center justify-center gap-3 p-4"
      style={{ background: "#F7F6F3", border: "1px solid rgba(26,26,26,0.06)" }}
    >
      <div className="flex items-end gap-2">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="relative rounded-[4px]"
            style={{
              width: 38,
              aspectRatio: "9 / 16",
              background: "#EEEDE8",
              border: "1px solid rgba(26,26,26,0.08)",
            }}
          >
            <span
              className="absolute bottom-1 right-1 inline-flex items-center justify-center rounded-[4px]"
              style={{
                width: 12,
                height: 12,
                background: "#9ED8F5",
                color: "#1A1A1A",
                fontFamily: MONO,
                fontSize: 8,
                lineHeight: 1,
              }}
            >
              ✓
            </span>
          </div>
        ))}
      </div>
      <div
        className="flex items-center gap-2 w-[78%]"
        style={{
          fontFamily: MONO,
          fontSize: 9,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "#75726B",
        }}
      >
        <span
          className="inline-flex items-center justify-center rounded-[4px]"
          style={{
            width: 12,
            height: 12,
            background: "#9ED8F5",
            color: "#1A1A1A",
            fontSize: 8,
            lineHeight: 1,
          }}
        >
          ✓
        </span>
        <span>BATCH · SHIPPED</span>
      </div>
    </div>
  );
};

/*
  SWAP TARGET: this KpiIllustration is a decorative placeholder for a
  real ROAS chart once a cleared client result is available. Replace
  the SVG line + labels, keep the outer Paper panel + badge wrapper.
*/
const KpiIllustration = () => {
  return (
    <div
      aria-hidden
      className="absolute inset-5 rounded-[4px] p-4"
      style={{ background: "#F7F6F3", border: "1px solid rgba(26,26,26,0.06)" }}
    >
      <div
        className="flex items-center gap-4"
        style={{
          fontFamily: MONO,
          fontSize: 9,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: "#75726B",
        }}
      >
        <span>HOOK</span>
        <span>HOLD</span>
        <span>ROAS</span>
      </div>
      <div className="mt-3 relative" style={{ height: 86 }}>
        <svg
          viewBox="0 0 240 90"
          preserveAspectRatio="none"
          className="absolute inset-0 w-full h-full"
        >
          <defs>
            <linearGradient id="csKpiFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#9ED8F5" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#9ED8F5" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d="M0,72 C40,66 70,58 100,50 C130,42 160,38 200,22 L240,10 L240,90 L0,90 Z"
            fill="url(#csKpiFill)"
          />
          <path
            d="M0,72 C40,66 70,58 100,50 C130,42 160,38 200,22 L240,10"
            stroke="#9ED8F5"
            strokeWidth="1.5"
            fill="none"
            strokeLinecap="round"
          />
        </svg>
      </div>
    </div>
  );
};

/* --- Card ---------------------------------------------------------- */

type CardDef = {
  illustration: React.ReactNode;
  badge: React.ReactNode;
  title: string;
  body: string;
};

const cards: CardDef[] = [
  {
    illustration: <BriefIllustration />,
    badge: (
      <span
        style={{
          fontFamily: MONO,
          fontSize: 10,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          background: "#9ED8F5",
          color: "#1A1A1A",
          padding: "6px 10px",
          borderRadius: 4,
        }}
      >
        Angle
      </span>
    ),
    title: "Strategy",
    body: "Research, angles, and briefs built with an editing eye, plus a weekly read on hook, hold, ROAS, and CPA.",
  },
  {
    illustration: <DeliveryIllustration />,
    badge: (
      <span
        style={{
          fontFamily: MONO,
          fontSize: 10,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          background: "#1A1A1A",
          color: "#F7F6F3",
          padding: "6px 10px",
          borderRadius: 4,
        }}
      >
        ×8 This week
      </span>
    ),
    title: "Production",
    body: "New creative batches shipped every week. Produced videos included, not just strategy decks. Dedicated editor placement built in.",
  },
  {
    illustration: <KpiIllustration />,
    badge: (
      <span
        className="inline-flex items-center gap-1.5"
        style={{
          fontFamily: MONO,
          fontSize: 10,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          background: "#9ED8F5",
          color: "#1A1A1A",
          padding: "6px 10px",
          borderRadius: 4,
        }}
      >
        <span
          aria-hidden
          style={{
            width: 6,
            height: 6,
            borderRadius: 9999,
            background: "#1A1A1A",
            display: "inline-block",
            animation: "csLiveDot 1.6s ease-in-out infinite",
          }}
        />
        Live
      </span>
    ),
    title: "Ownership",
    body: "A live KPI dashboard, free. One operator owning the creative number end to end.",
  },
];

const CSIncludes = () => {
  const rootRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      setReduced(true);
      setVisible(true);
      return;
    }
    const el = rootRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setVisible(true);
            obs.disconnect();
          }
        });
      },
      { threshold: 0.2 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section className="py-24 sm:py-32" style={{ background: "#F7F6F3" }}>
      <style>{`
        @keyframes csLiveDot {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.35; }
        }
        .cs-card { transition: transform 320ms ease, border-color 320ms ease, box-shadow 320ms ease; }
        @media (hover: hover) {
          .cs-card:hover {
            transform: translateY(-4px);
            border-color: #9ED8F5;
            box-shadow: 0 18px 40px -28px rgba(26,26,26,0.25);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .cs-card:hover { transform: none; box-shadow: none; }
        }
      `}</style>

      <div ref={rootRef} className="mx-auto max-w-[1120px] px-6">
        <div className="text-center max-w-[760px] mx-auto">
          <span className="eyebrow">WHAT'S INCLUDED</span>
          <h2
            className="mt-5 text-[32px] sm:text-[42px] lg:text-[48px] leading-[1.05] tracking-[-0.025em] font-semibold"
            style={{ fontFamily: DISPLAY, color: "#1A1A1A" }}
          >
            Everything in Editor Placement, plus the strategy{" "}
            <em style={{ fontFamily: SERIF, fontStyle: "italic", fontWeight: 400 }}>
              layer
            </em>
            .
          </h2>
          <p
            className="mt-5 text-[16px] leading-relaxed max-w-[560px] mx-auto"
            style={{ color: "#75726B" }}
          >
            Strategy, production, and the weekly read. One operator owning all three.
          </p>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-3">
          {cards.map((c, i) => {
            const cardDelay = reduced ? 0 : i * 90;
            const badgeDelay = reduced ? 0 : cardDelay + 220;
            return (
              <div
                key={c.title}
                className="cs-card flex flex-col rounded-[4px] p-6 h-full"
                style={{
                  background: "#EEEDE8",
                  border: "1px solid rgba(26,26,26,0.08)",
                  opacity: visible ? 1 : 0,
                  transform: visible ? "translateY(0)" : "translateY(14px)",
                  transition: reduced
                    ? "none"
                    : `opacity 620ms ease ${cardDelay}ms, transform 620ms cubic-bezier(0.22,0.61,0.36,1) ${cardDelay}ms`,
                }}
              >
                {/* Illustration zone */}
                <div
                  className="relative w-full rounded-[4px]"
                  style={{
                    height: 180,
                    background: "#E6E5DF",
                    border: "1px solid rgba(26,26,26,0.05)",
                  }}
                >
                  {c.illustration}
                  {/* Floating badge */}
                  <div
                    className="absolute"
                    style={{
                      top: -10,
                      right: 14,
                      opacity: visible ? 1 : 0,
                      transform: visible ? "translateY(0)" : "translateY(-6px)",
                      transition: reduced
                        ? "none"
                        : `opacity 480ms ease ${badgeDelay}ms, transform 480ms cubic-bezier(0.22,0.61,0.36,1) ${badgeDelay}ms`,
                      filter: "drop-shadow(0 4px 10px rgba(26,26,26,0.12))",
                    }}
                  >
                    {c.badge}
                  </div>
                </div>

                <h3
                  className="mt-6 text-[22px] tracking-[-0.01em] font-semibold"
                  style={{ fontFamily: DISPLAY, color: "#1A1A1A" }}
                >
                  {c.title}
                </h3>
                <p
                  className="mt-2 text-[15px] leading-relaxed"
                  style={{ color: "#75726B" }}
                >
                  {c.body}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CSIncludes;