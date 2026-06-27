/**
 * Results for other brands — 3D coverflow carousel.
 * Cards drift along an arc with perspective rotation; the centered card
 * pops forward and gets a hand-drawn highlighter marker swipe across its
 * metrics strip instead of a circle.
 */

const IMAGES = [
  "https://res.cloudinary.com/dqnifzwda/image/upload/v1782584798/Screenshot_2026-06-26_010601_xo9r97.png",
  "https://res.cloudinary.com/dqnifzwda/image/upload/v1782584798/Screenshot_2026-06-26_010629_saeqm2.png",
  "https://res.cloudinary.com/dqnifzwda/image/upload/v1782584798/Screenshot_2026-06-26_010602_skqwxz.png",
  "https://res.cloudinary.com/dqnifzwda/image/upload/v1782584797/Screenshot_2026-06-26_010626_cfpvhd.png",
  "https://res.cloudinary.com/dqnifzwda/image/upload/v1782584797/Screenshot_2026-06-26_010612_fchr9z.png",
  "https://res.cloudinary.com/dqnifzwda/image/upload/v1782584798/Screenshot_2026-06-26_010649_d2vn3p.png",
];

// Loop the deck for a seamless infinite track.
const LOOP = [...IMAGES, ...IMAGES, ...IMAGES];

const ResultsMarquee = () => {
  return (
    <section className="relative py-20 sm:py-32 overflow-hidden">
      {/* Background — match TwoWaysToWork airy white/blue wash */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, #FFFFFF 0%, #F8F9FA 50%, #FFFFFF 100%)",
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 55% at 50% 50%, rgba(158,216,245,0.18), transparent 65%), radial-gradient(ellipse 60% 40% at 90% 10%, rgba(158,216,245,0.10), transparent 55%)",
        }}
      />

      <div className="relative mx-auto max-w-[1200px] px-6">
        <div className="text-center">
          <span className="eyebrow">CASE WORK</span>
          <h2 className="mt-5 font-display text-[32px] md:text-[44px] leading-[1.05] tracking-[-0.02em] text-foreground">
            Results for <em className="font-serif">other brands</em>.
          </h2>
        </div>
      </div>

      {/* Stage with 3D perspective */}
      <div
        className="relative mt-16 group"
        style={{
          perspective: "1600px",
          perspectiveOrigin: "50% 50%",
          maskImage:
            "linear-gradient(90deg, transparent 0%, #000 14%, #000 86%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(90deg, transparent 0%, #000 14%, #000 86%, transparent 100%)",
        }}
      >
        <div
          className="flex items-center gap-6 md:gap-8 py-14 coverflow-track"
          style={{ width: "max-content", transformStyle: "preserve-3d" }}
        >
          {LOOP.map((src, i) => (
            <div
              key={i}
              className="coverflow-card relative flex-shrink-0 w-[200px] md:w-[230px] rounded-[14px] overflow-hidden bg-white"
              style={{
                boxShadow:
                  "0 30px 60px -28px rgba(25,70,110,0.35), 0 12px 24px -12px rgba(26,26,26,0.18), inset 0 0 0 1px rgba(255,255,255,0.85)",
              }}
            >
              <img
                src={src}
                alt="Case study result"
                className="w-full h-auto block"
                loading="lazy"
                decoding="async"
              />
            </div>
          ))}
        </div>

        {/* Highlighter marker swipe — drawn over the centered card's metrics row */}
        <div
          aria-hidden
          className="absolute left-1/2 top-1/2 -translate-x-1/2 pointer-events-none z-20"
          style={{ transform: "translate(-50%, 60%)" }}
        >
          <div className="highlighter-swipe" />
        </div>
      </div>

      <p className="relative mt-6 text-center text-[12px] md:text-[13px] text-muted-foreground italic max-w-xl mx-auto px-6">
        Some case work includes editor placement services with a separate strategist.
      </p>

      <style>{`
        .coverflow-track {
          animation: coverflow-scroll 42s linear infinite;
          will-change: transform;
        }
        .group:hover .coverflow-track { animation-play-state: paused; }

        /* Give each card a subtle rotation/depth based on position — pure CSS
           arc using nth-child cycling across the 18-card loop. */
        .coverflow-card {
          transform-style: preserve-3d;
          transition: transform 0.6s ease;
        }
        .coverflow-card:nth-child(6n+1) { transform: translateZ(-80px) rotateY(28deg) translateY(8px); }
        .coverflow-card:nth-child(6n+2) { transform: translateZ(-30px) rotateY(14deg) translateY(-6px); }
        .coverflow-card:nth-child(6n+3) { transform: translateZ(40px)  rotateY(0deg)  translateY(-14px) scale(1.06); }
        .coverflow-card:nth-child(6n+4) { transform: translateZ(-30px) rotateY(-14deg) translateY(-6px); }
        .coverflow-card:nth-child(6n+5) { transform: translateZ(-80px) rotateY(-28deg) translateY(8px); }
        .coverflow-card:nth-child(6n+6) { transform: translateZ(-120px) rotateY(-34deg) translateY(14px); }

        @keyframes coverflow-scroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-33.3333%); }
        }

        /* Yellow highlighter marker swiping across the centered metrics row */
        .highlighter-swipe {
          width: 180px;
          height: 22px;
          border-radius: 3px;
          background: linear-gradient(
            90deg,
            rgba(255, 232, 90, 0) 0%,
            rgba(255, 232, 90, 0.85) 12%,
            rgba(255, 215, 60, 0.85) 88%,
            rgba(255, 232, 90, 0) 100%
          );
          mix-blend-mode: multiply;
          filter: blur(0.4px);
          transform-origin: left center;
          animation: highlighter-sweep 3.4s ease-in-out infinite;
          box-shadow: 0 0 18px rgba(255, 215, 60, 0.35);
        }
        @keyframes highlighter-sweep {
          0%   { transform: scaleX(0); opacity: 0; }
          15%  { opacity: 1; }
          55%  { transform: scaleX(1); opacity: 1; }
          85%  { transform: scaleX(1); opacity: 1; }
          100% { transform: scaleX(1); opacity: 0; }
        }

        @media (prefers-reduced-motion: reduce) {
          .coverflow-track,
          .highlighter-swipe { animation: none; }
          .highlighter-swipe { transform: scaleX(1); opacity: 0.7; }
        }
      `}</style>
    </section>
  );
};

export default ResultsMarquee;