import { ArrowRight } from "lucide-react";

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
/* Long thermal receipt — static, S-curved like a printout in mid-air */
/* ------------------------------------------------------------------ */

const LongReceipt = () => {
  // Geometry
  const W = 360;          // viewBox width
  const H = 620;          // viewBox height
  const paperW = 220;     // receipt width
  const cx = W / 2;
  // Horizontal centerline as a sine wave — left and right edges offset from it
  // Two full curves give the S-shape seen in the reference
  const amp = 26;
  const steps = 60;
  const top = 30;
  const bottom = H - 60;

  const centerX = (t: number) =>
    cx + Math.sin(t * Math.PI * 2) * amp - Math.sin(t * Math.PI * 0.6) * 6;

  const points: { x: number; y: number }[] = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const y = top + (bottom - top) * t;
    points.push({ x: centerX(t), y });
  }

  // Build outline: right edge top→bottom + zigzag bottom + left edge bottom→top + zigzag top
  const right = points.map((p) => `${p.x + paperW / 2},${p.y}`);
  const left = [...points].reverse().map((p) => `${p.x - paperW / 2},${p.y}`);

  const zig = (xStart: number, xEnd: number, y: number, dir: 1 | -1) => {
    const teeth = 14;
    const step = (xEnd - xStart) / teeth;
    const h = 6 * dir;
    let s = "";
    for (let i = 1; i <= teeth; i++) {
      const x = xStart + step * i;
      const yMid = y + (i % 2 === 0 ? 0 : h);
      s += ` L ${x},${yMid}`;
    }
    return s;
  };

  const last = points[points.length - 1];
  const first = points[0];
  const outline =
    `M ${right[0]} ` +
    right.slice(1).map((p) => `L ${p}`).join(" ") +
    zig(last.x + paperW / 2, last.x - paperW / 2, last.y, 1) +
    " " +
    left.slice(1).map((p) => `L ${p}`).join(" ") +
    zig(first.x - paperW / 2, first.x + paperW / 2, first.y, -1) +
    " Z";

  return (
    <div className="relative w-full" style={{ maxWidth: 420 }}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full h-auto"
        style={{ overflow: "visible" }}
        aria-hidden
      >
        <defs>
          {/* Paper base — warm off-white with subtle vertical gradient */}
          <linearGradient id="paperBase" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#F2EFE8" />
            <stop offset="50%" stopColor="#FDFCFA" />
            <stop offset="100%" stopColor="#EDE9E0" />
          </linearGradient>

          {/* Curl shading bands following the S-curve. */}
          <linearGradient id="curlShade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"  stopColor="rgba(26,26,26,0)" />
            <stop offset="18%" stopColor="rgba(26,26,26,0.18)" />
            <stop offset="34%" stopColor="rgba(255,255,255,0)" />
            <stop offset="52%" stopColor="rgba(26,26,26,0.16)" />
            <stop offset="70%" stopColor="rgba(255,255,255,0)" />
            <stop offset="86%" stopColor="rgba(26,26,26,0.20)" />
            <stop offset="100%" stopColor="rgba(26,26,26,0)" />
          </linearGradient>

          {/* Specular highlight bands */}
          <linearGradient id="sheen" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"  stopColor="rgba(255,255,255,0)" />
            <stop offset="10%" stopColor="rgba(255,255,255,0.55)" />
            <stop offset="22%" stopColor="rgba(255,255,255,0)" />
            <stop offset="44%" stopColor="rgba(255,255,255,0.45)" />
            <stop offset="60%" stopColor="rgba(255,255,255,0)" />
            <stop offset="78%" stopColor="rgba(255,255,255,0.4)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </linearGradient>

          {/* Drop shadow */}
          <filter id="paperShadow" x="-30%" y="-10%" width="160%" height="130%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="8" />
            <feOffset dx="10" dy="14" result="offset" />
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.28" />
            </feComponentTransfer>
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Clip the paper shape so shading stays inside */}
          <clipPath id="paperClip">
            <path d={outline} />
          </clipPath>
        </defs>

        {/* Soft floor shadow */}
        <ellipse
          cx={cx}
          cy={H - 24}
          rx={paperW * 0.55}
          ry={10}
          fill="rgba(26,26,26,0.18)"
          filter="url(#paperShadow)"
        />

        {/* Paper body */}
        <path d={outline} fill="url(#paperBase)" filter="url(#paperShadow)" />

        {/* Curl shading + sheen, clipped to paper */}
        <g clipPath="url(#paperClip)">
          <rect x="0" y="0" width={W} height={H} fill="url(#curlShade)" style={{ mixBlendMode: "multiply" }} />
          <rect x="0" y="0" width={W} height={H} fill="url(#sheen)" style={{ mixBlendMode: "screen" }} opacity={0.6} />

          {/* Side edge darkening to imply roundness */}
          <rect x="0" y="0" width={W} height={H} fill="url(#sideShade)" style={{ mixBlendMode: "multiply" }} />
        </g>

        {/* Side shade gradient (defined here so it can reference cx) */}
        <defs>
          <linearGradient id="sideShade" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%"  stopColor="rgba(26,26,26,0.18)" />
            <stop offset="14%" stopColor="rgba(26,26,26,0)" />
            <stop offset="86%" stopColor="rgba(26,26,26,0)" />
            <stop offset="100%" stopColor="rgba(26,26,26,0.22)" />
          </linearGradient>
        </defs>

        {/* Content — text bent along the centerline by translating each row to its sampled point */}
        <g clipPath="url(#paperClip)">
          <ReceiptContent points={points} paperW={paperW} />
        </g>
      </svg>
    </div>
  );
};

const ReceiptContent = ({
  points,
  paperW,
}: {
  points: { x: number; y: number }[];
  paperW: number;
}) => {
  // Sample the centerline at vertical positions and place rows there
  const sample = (yTarget: number) => {
    // Find nearest point by y
    let best = points[0];
    let bestD = Infinity;
    for (const p of points) {
      const d = Math.abs(p.y - yTarget);
      if (d < bestD) {
        bestD = d;
        best = p;
      }
    }
    // Slope-based rotation for slight tilt
    const i = points.indexOf(best);
    const a = points[Math.max(0, i - 1)];
    const b = points[Math.min(points.length - 1, i + 1)];
    const angle = (Math.atan2(b.x - a.x, b.y - a.y) * 180) / Math.PI;
    // We want angle off-vertical: rotation = -angle (since text is horizontal and we tilt with curve)
    return { x: best.x, y: best.y, rot: -angle };
  };

  const inner = paperW - 24;

  const row = (
    yTarget: number,
    render: (innerW: number) => React.ReactNode
  ) => {
    const s = sample(yTarget);
    return (
      <g transform={`translate(${s.x}, ${s.y}) rotate(${s.rot})`}>
        <foreignObject x={-inner / 2} y={-10} width={inner} height={28}>
          <div
            // @ts-expect-error xmlns required for foreignObject HTML
            xmlns="http://www.w3.org/1999/xhtml"
            style={{ width: "100%", color: "#1A1A1A" }}
          >
            {render(inner)}
          </div>
        </foreignObject>
      </g>
    );
  };

  const startY = 60;
  const headerGap = 22;
  const rowH = 22;
  let y = startY;

  const items = [
    { label: "VIDEOS × 20", value: "$2,000", ink: true },
    { label: "HOOK VARIATIONS", value: "$0" },
    { label: "2 FORMATS", value: "$0" },
    { label: "EDITING TOOLS", value: "$0" },
    { label: "HIGGSFIELD", value: "$0" },
    { label: "ELEVENLABS", value: "$0" },
    { label: "MANAGEMENT", value: "$0" },
    { label: "KPI DASHBOARD", value: "$0" },
    { label: "DELIVERY TRACKING", value: "$0" },
  ];

  const nodes: React.ReactNode[] = [];

  // Wordmark
  nodes.push(
    <g key="brand">
      {row(y, () => (
        <div
          style={{
            textAlign: "center",
            fontFamily: "'Inter Tight', sans-serif",
            fontWeight: 700,
            fontSize: 14,
            letterSpacing: "-0.01em",
            color: "#1A1A1A",
          }}
        >
          AdChefs.
        </div>
      ))}
    </g>
  );
  y += 16;
  nodes.push(
    <g key="sub">
      {row(y, () => (
        <div
          style={{
            textAlign: "center",
            fontFamily: "'JetBrains Mono', ui-monospace, monospace",
            fontSize: 8,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "#75726B",
          }}
        >
          One month · itemized
        </div>
      ))}
    </g>
  );
  y += headerGap;

  // Divider
  nodes.push(
    <g key="d1">
      {row(y, () => (
        <div
          style={{
            borderTop: "1px dashed rgba(26,26,26,0.3)",
            width: "100%",
          }}
        />
      ))}
    </g>
  );
  y += 12;

  items.forEach((it, idx) => {
    nodes.push(
      <g key={`it-${idx}`}>
        {row(y, () => (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontFamily: "'JetBrains Mono', ui-monospace, monospace",
              fontSize: 9.5,
              letterSpacing: "0.04em",
              color: it.ink ? "#1A1A1A" : "#75726B",
            }}
          >
            <span>{it.label}</span>
            <span>{it.value}</span>
          </div>
        ))}
      </g>
    );
    y += rowH;
  });

  // Total bar
  y += 4;
  nodes.push(
    <g key="totalbar">
      {row(y, () => (
        <div style={{ borderTop: "1.5px solid #1A1A1A", width: "100%" }} />
      ))}
    </g>
  );
  y += 14;
  nodes.push(
    <g key="total">
      {row(y, () => (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontFamily: "'JetBrains Mono', ui-monospace, monospace",
            fontSize: 11,
            fontWeight: 600,
            color: "#1A1A1A",
          }}
        >
          <span>TOTAL</span>
          <span>$2,000</span>
        </div>
      ))}
    </g>
  );
  y += 22;
  nodes.push(
    <g key="per">
      {row(y, () => (
        <div
          style={{
            textAlign: "center",
            fontFamily: "'JetBrains Mono', ui-monospace, monospace",
            fontSize: 8,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "#75726B",
          }}
        >
          From $100 / delivered video
        </div>
      ))}
    </g>
  );
  y += 18;
  nodes.push(
    <g key="d2">
      {row(y, () => (
        <div
          style={{
            borderTop: "1px dashed rgba(26,26,26,0.3)",
            width: "100%",
          }}
        />
      ))}
    </g>
  );
  y += 14;
  nodes.push(
    <g key="foot">
      {row(y, () => (
        <div
          style={{
            textAlign: "center",
            fontFamily: "'JetBrains Mono', ui-monospace, monospace",
            fontSize: 8,
            lineHeight: 1.55,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: "#B0552F",
          }}
        >
          Agencies bill $4,500
          <br />
          whether anything ships or not
        </div>
      ))}
    </g>
  );

  return <>{nodes}</>;
};

export default Pricing;
