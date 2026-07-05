const CARDS = [
  { image: "https://res.cloudinary.com/dqnifzwda/image/upload/v1782584798/Screenshot_2026-06-26_010601_xo9r97.png", spend: "$17K", roas: "2.52", pv: "$42K", ctr: "4.20%", tc: "00:00:32:12" },
  { image: "https://res.cloudinary.com/dqnifzwda/image/upload/v1782584798/Screenshot_2026-06-26_010629_saeqm2.png", spend: "$24K", roas: "3.10", pv: "$74K", ctr: "3.85%", tc: "00:01:04:18" },
  { image: "https://res.cloudinary.com/dqnifzwda/image/upload/v1782584798/Screenshot_2026-06-26_010602_skqwxz.png", spend: "$11K", roas: "2.18", pv: "$24K", ctr: "5.10%", tc: "00:00:22:05" },
  { image: "https://res.cloudinary.com/dqnifzwda/image/upload/v1782584797/Screenshot_2026-06-26_010626_cfpvhd.png", spend: "$19K", roas: "2.74", pv: "$52K", ctr: "4.45%", tc: "00:00:46:22" },
  { image: "https://res.cloudinary.com/dqnifzwda/image/upload/v1782584797/Screenshot_2026-06-26_010612_fchr9z.png", spend: "$29K", roas: "3.42", pv: "$99K", ctr: "3.95%", tc: "00:01:18:03" },
  { image: "https://res.cloudinary.com/dqnifzwda/image/upload/v1782584798/Screenshot_2026-06-26_010649_d2vn3p.png", spend: "$14K", roas: "2.66", pv: "$37K", ctr: "4.80%", tc: "00:00:38:14" },
];

const LOOP = [...CARDS, ...CARDS];

const isWinRoas = (v: string) => parseFloat(v) >= 1.5;
const isWinCtr = (v: string) => parseFloat(v) >= 2;

const ClipCard = ({ c }: { c: typeof CARDS[number] }) => (
  <div
    className="flex-shrink-0"
    style={{ width: 280, background: "var(--es-studio)", border: "1px solid var(--es-frame)" }}
  >
    <div className="relative" style={{ aspectRatio: "3/4", background: "var(--es-frame)" }}>
      <img src={c.image} alt="" className="w-full h-full object-cover" loading="lazy" />
      <span
        className="absolute top-3 left-3 es-mono"
        style={{
          background: "rgba(17,17,16,0.85)",
          color: "var(--es-studio)",
          fontSize: 10,
          letterSpacing: "0.12em",
          padding: "3px 6px",
        }}
      >
        {c.tc}
      </span>
    </div>
    <div className="grid grid-cols-4" style={{ borderTop: "1px solid var(--es-frame)" }}>
      {[
        { k: "SPEND", v: c.spend, win: false },
        { k: "ROAS", v: c.roas, win: isWinRoas(c.roas) },
        { k: "PV", v: c.pv, win: false },
        { k: "CTR", v: c.ctr, win: isWinCtr(c.ctr) },
      ].map((cell, i, arr) => (
        <div
          key={cell.k}
          className="px-2 py-3"
          style={{ borderRight: i < arr.length - 1 ? "1px solid var(--es-frame)" : undefined }}
        >
          <div className="es-mono text-[8px] uppercase tracking-[0.18em]" style={{ color: "var(--es-graphite)" }}>
            {cell.k}
          </div>
          <div className="mt-1 flex items-center">
            <span
              className="es-mono tabular-nums text-[12px] font-semibold"
              style={{
                color: cell.win ? "#fff" : "var(--es-ink)",
                background: cell.win ? "var(--es-signal)" : "transparent",
                padding: cell.win ? "1px 5px" : 0,
              }}
            >
              {cell.v}
            </span>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const EditCaseWork = () => {
  return (
    <section id="work" className="es-section" style={{ background: "var(--es-studio)" }}>
      <div className="es-container">
        <span className="es-timecode-label">04 · CASE WORK</span>
        <h2
          className="mt-6 es-display text-[36px] md:text-[52px] leading-[1.02]"
          style={{ color: "var(--es-ink)" }}
        >
          Results for other brands.
        </h2>
      </div>

      <div
        className="relative mt-14 group"
        style={{
          maskImage: "linear-gradient(90deg, transparent 0, #000 6%, #000 94%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(90deg, transparent 0, #000 6%, #000 94%, transparent 100%)",
        }}
      >
        <div
          className="flex items-stretch gap-6 py-4 es-marquee"
          style={{ width: "max-content" }}
        >
          {LOOP.map((c, i) => <ClipCard key={i} c={c} />)}
        </div>
      </div>

      <p
        className="es-container mt-10 es-mono text-[10px] uppercase tracking-[0.22em]"
        style={{ color: "var(--es-graphite)" }}
      >
        SOME CASE WORK INCLUDES EDITOR PLACEMENT SERVICES WITH A SEPARATE STRATEGIST.
      </p>

      <style>{`
        .es-marquee { animation: es-marquee 42s linear infinite; will-change: transform; }
        .group:hover .es-marquee { animation-play-state: paused; }
        @keyframes es-marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        @media (prefers-reduced-motion: reduce) { .es-marquee { animation: none; } }
      `}</style>
    </section>
  );
};

export default EditCaseWork;