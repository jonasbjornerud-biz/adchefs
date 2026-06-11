import { Button } from "@/components/ui/button";
import { ArrowRight, X as XIcon } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import HeroBackground from "./HeroBackground";
import jonasPhoto from "@/assets/jonas.jpg";

const CLOUD = "dqnifzwda";
const CLIPS: { id: string; mov?: boolean; label: string }[] = [
  { id: "AC1_r0bbjh", label: "BOSANT" },
  { id: "AC2_xllvey", label: "IRON MAN" },
  { id: "AC3_wa3d0v", label: "NORDIC SKIN" },
  { id: "AC4_l0cp6d", label: "PEAK GEAR" },
  { id: "AC5_v65ofr", label: "RITUAL CO" },
  { id: "AC6_pqpagf", mov: true, label: "OAKWELL" },
  { id: "AC7_kwkbqq", mov: true, label: "FORMA" },
  { id: "AC8_bvkrvb", label: "HALO HOME" },
  { id: "AC9_uwa9z6", label: "VANTA" },
  { id: "AC10_obarrz", label: "NORTHFIELD" },
];

type ClipUrls = { preview: string; poster: string; full: string };

const buildUrls = (id: string, mov?: boolean): ClipUrls => {
  const f = mov ? "" : ",f_auto";
  return {
    preview: `https://res.cloudinary.com/${CLOUD}/video/upload/so_0,eo_3,w_400,q_auto${f},ac_none/${id}.mp4`,
    poster: `https://res.cloudinary.com/${CLOUD}/video/upload/so_1,w_400,q_auto${f}/${id}.jpg`,
    full: `https://res.cloudinary.com/${CLOUD}/video/upload/q_auto${f}/${id}.mp4`,
  };
};

const FEATURED_FULL = CLIPS.map((c) => ({
  ...buildUrls(c.id, c.mov),
  label: c.label.slice(0, 14).toUpperCase(),
}));

// Card sizing pattern for the broken-grid wall.
type CardSize = "standard" | "small" | "feature";

// Per-column size patterns. Repeats deterministically so the doubled-loop is seamless.
const PATTERNS_3: CardSize[][] = [
  ["feature", "standard", "small", "standard", "small", "standard"],
  ["small", "standard", "small", "standard", "small", "standard"],
  ["standard", "small", "standard", "small", "standard", "small"],
];
const PATTERNS_2: CardSize[][] = [
  ["feature", "standard", "small", "standard", "small"],
  ["small", "standard", "small", "standard", "small", "standard"],
];

type WallItem = { clip: typeof FEATURED_FULL[number]; size: CardSize };

const buildPatternedColumns = (patterns: CardSize[][], min: number): WallItem[][] => {
  const n = patterns.length;
  const cols: WallItem[][] = Array.from({ length: n }, () => []);
  FEATURED_FULL.forEach((c, i) => {
    const ci = i % n;
    const pat = patterns[ci];
    cols[ci].push({ clip: c, size: pat[cols[ci].length % pat.length] });
  });
  return cols.map((col) => {
    let filled = [...col];
    while (filled.length < min) filled = filled.concat(col);
    return [...filled, ...filled];
  });
};
const COLS_3 = buildPatternedColumns(PATTERNS_3, 4);
const COLS_2 = buildPatternedColumns(PATTERNS_2, 4);
// Single row for mobile: all videos doubled for seamless loop
const ROW_M = [...FEATURED_FULL, ...FEATURED_FULL];

interface LightboxProps {
  src: string | null;
  onClose: () => void;
}

interface WallCardProps {
  clip: typeof FEATURED_FULL[number];
  onOpen: (full: string) => void;
  horizontal?: boolean;
  size?: CardSize;
}

const WallCard = ({ clip, onOpen, horizontal, size = "standard" }: WallCardProps) => {
  const ref = useRef<HTMLButtonElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const inViewRef = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        const v = videoRef.current;
        if (!v) return;
        const visible = entry.isIntersecting && entry.intersectionRatio >= 0.5;
        inViewRef.current = visible;
        if (visible) {
          v.play().catch(() => {});
        } else {
          v.pause();
        }
      },
      { threshold: [0, 0.5, 1] }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const handleEnter = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = false;
    v.play().catch(() => {});
  };
  const handleLeave = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = true;
    if (!inViewRef.current) v.pause();
  };

  return (
    <button
      ref={ref}
      type="button"
      onClick={() => onOpen(clip.full)}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      className={`hero-wall-card hero-wall-card--${size} ${horizontal ? "hero-wall-card-h" : ""}`}
      aria-label={`Play ${clip.label}`}
      style={{
        backgroundImage: `url("${clip.poster}")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <video
        ref={videoRef}
        src={clip.preview}
        poster={clip.poster}
        muted
        loop
        playsInline
        preload="metadata"
        className="w-full h-full object-cover block"
      />
      <span aria-hidden className="hero-wall-card-ring" />
    </button>
  );
};

/* JS-driven drift track: eases speed multiplier 0↔1 over ~600ms on hover. */
interface DriftTrackProps {
  loopSeconds: number;
  axis: "y" | "x";
  direction: 1 | -1;
  pausedRef: React.MutableRefObject<boolean>;
  className?: string;
  children: React.ReactNode;
}
const DriftTrack = ({ loopSeconds, axis, direction, pausedRef, className, children }: DriftTrackProps) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf = 0;
    let last = 0;
    let pos = direction < 0 ? 0 : -0.0001; // tiny offset so wrap math is symmetric
    let mult = 1;
    const tick = (t: number) => {
      if (!last) last = t;
      const dt = Math.min((t - last) / 1000, 0.05);
      last = t;
      const target = pausedRef.current ? 0 : 1;
      // exponential easing — ~600ms time-constant => k ≈ 1 - exp(-dt * 5)
      mult += (target - mult) * (1 - Math.exp(-dt * 5));
      const el = ref.current;
      if (el) {
        const half = axis === "y" ? el.scrollHeight / 2 : el.scrollWidth / 2;
        if (half > 0) {
          const v = (half / loopSeconds) * direction * mult;
          pos += v * dt;
          if (pos <= -half) pos += half;
          if (pos >= 0) pos -= half;
          el.style.transform = axis === "y"
            ? `translate3d(0, ${pos}px, 0)`
            : `translate3d(${pos}px, 0, 0)`;
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [loopSeconds, axis, direction, pausedRef]);

  return <div ref={ref} className={className}>{children}</div>;
};

const Lightbox = ({ src, onClose }: LightboxProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!src) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      const v = videoRef.current;
      if (v) {
        v.pause();
        v.removeAttribute("src");
        v.load();
      }
    };
  }, [src, onClose]);

  if (!src) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={onClose}
      className="fixed inset-0 z-[100] flex items-center justify-center animate-in fade-in duration-200"
      style={{ background: "rgba(26,26,26,0.90)" }}
    >
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        aria-label="Close"
        className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 transition-colors"
        style={{ color: "#F7F6F3" }}
      >
        <XIcon className="h-6 w-6" />
      </button>
      <video
        ref={videoRef}
        src={src}
        controls
        autoPlay
        preload="none"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: "90vw",
          maxHeight: "85vh",
          width: "auto",
          height: "auto",
        }}
      />
    </div>
  );
};

const Hero = () => {
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);
  const wallPausedRef = useRef(false);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const openLightbox = useCallback((full: string) => setLightboxSrc(full), []);
  const closeLightbox = useCallback(() => setLightboxSrc(null), []);

  return (
    <section className="relative min-h-screen lg:h-screen overflow-hidden bg-background pt-24 pb-12 lg:pt-0 lg:pb-0">
      <HeroBackground />
      {/* Subtle noise texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none z-[1]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '200px 200px',
          mixBlendMode: 'multiply',
        }}
      />

      {/* Top-right radial gradient accent — desaturated, never touches pure white */}
      <div
        className="absolute inset-0 pointer-events-none z-[1]"
        style={{
          background: 'radial-gradient(ellipse at 85% 10%, rgba(180, 214, 232, 0.28) 0%, transparent 60%)',
        }}
      />

      <div className="mx-auto max-w-[1200px] px-6 relative z-10 h-full">
        <div className="grid lg:grid-cols-[45%_1fr] gap-10 lg:gap-6 items-stretch lg:h-full">
          {/* LEFT: hero content (vertically centered) */}
          <div className="flex flex-col justify-center min-w-0 lg:pt-28 lg:pb-16">
            <span className="eyebrow self-start w-fit">Built for e-com brands · Pay per video</span>

            <h1 className="mt-4 font-display text-[34px] sm:text-[52px] lg:text-[60px] leading-[1.02] lg:leading-[1.0] tracking-[-0.03em] text-foreground">
              Your <em>dedicated</em> video editor without the additional cost
            </h1>

            <p className="mt-7 text-[16px] sm:text-[17px] leading-relaxed text-muted-foreground max-w-xl">
              I match e-commerce brands with one vetted editor who learns your product, your voice, and your winners. You pay per video. No retainers, no agency markup, no rotating freelancers.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Button size="lg" variant="cta" className="h-auto px-8 py-4 tracking-[0.01em] gap-[10px]" onClick={() => scrollToSection("booking")}>
                Book a Call
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button size="lg" className="h-auto px-8 py-4 bg-[#9ED8F5] text-[#1A1A1A] border-none font-semibold hover:bg-[#8ecde8]" onClick={() => scrollToSection("how-it-works")}>
                See how it works
              </Button>
            </div>

            <hr className="w-[100px] h-px bg-[#E2E0D9] border-0 mt-4 mb-4" />

            <div className="flex items-center gap-5 mono text-[11px] uppercase tracking-[0.15em] text-muted-foreground">
              <span>From $100 / video</span>
              <span className="h-3 w-px bg-border" />
              <span>Cancel anytime</span>
            </div>

            {/* Founder row */}
            <div className="mt-6 flex items-center gap-3">
              <div className="w-11 h-11 rounded-full overflow-hidden border border-foreground/10 flex-shrink-0">
                <img
                  src={jonasPhoto}
                  alt="Jonas Bjørnerud"
                  className="w-full h-full object-cover grayscale"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-sans font-medium text-[14px] text-foreground leading-tight">
                  Jonas Bjørnerud
                </span>
                <span className="mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground mt-0.5">
                  Founder · AdChefs
                </span>
              </div>
            </div>
          </div>

          {/* RIGHT: broken-grid video wall, bleeds off right viewport edge */}
          <div className="hero-wall-col-wrap relative lg:h-full lg:pt-28 lg:pb-8">
            <div className="hero-wall flex flex-col">
              <span className="hero-wall-label">
                <span aria-hidden className="hero-wall-dot" />
                <span>Live cuts shipping for clients</span>
              </span>
              <span aria-hidden className="hero-wall-rule" />

              {/* Desktop / tablet: vertical multi-column wall */}
              <div
                className="hero-wall-vertical"
                onMouseEnter={() => { wallPausedRef.current = true; }}
                onMouseLeave={() => { wallPausedRef.current = false; }}
              >
                {/* Desktop: 3 unequal columns */}
                <div className="hero-wall-cols hero-wall-cols--3">
                  <div className="hero-wall-col hero-wall-col--a">
                    <DriftTrack className="hero-wall-track" loopSeconds={48} axis="y" direction={-1} pausedRef={wallPausedRef}>
                      {COLS_3[0].map((it, i) => (
                        <WallCard key={`c1-${i}`} clip={it.clip} size={it.size} onOpen={openLightbox} />
                      ))}
                    </DriftTrack>
                  </div>
                  <div className="hero-wall-col hero-wall-col--b">
                    <DriftTrack className="hero-wall-track" loopSeconds={38} axis="y" direction={1} pausedRef={wallPausedRef}>
                      {COLS_3[1].map((it, i) => (
                        <WallCard key={`c2-${i}`} clip={it.clip} size={it.size} onOpen={openLightbox} />
                      ))}
                    </DriftTrack>
                  </div>
                  <div className="hero-wall-col hero-wall-col--c">
                    <DriftTrack className="hero-wall-track" loopSeconds={56} axis="y" direction={-1} pausedRef={wallPausedRef}>
                      {COLS_3[2].map((it, i) => (
                        <WallCard key={`c3-${i}`} clip={it.clip} size={it.size} onOpen={openLightbox} />
                      ))}
                    </DriftTrack>
                  </div>
                </div>

                {/* Tablet: 2 unequal columns */}
                <div className="hero-wall-cols hero-wall-cols--2">
                  <div className="hero-wall-col hero-wall-col--a">
                    <DriftTrack className="hero-wall-track" loopSeconds={48} axis="y" direction={-1} pausedRef={wallPausedRef}>
                      {COLS_2[0].map((it, i) => (
                        <WallCard key={`t1-${i}`} clip={it.clip} size={it.size} onOpen={openLightbox} />
                      ))}
                    </DriftTrack>
                  </div>
                  <div className="hero-wall-col hero-wall-col--b">
                    <DriftTrack className="hero-wall-track" loopSeconds={38} axis="y" direction={1} pausedRef={wallPausedRef}>
                      {COLS_2[1].map((it, i) => (
                        <WallCard key={`t2-${i}`} clip={it.clip} size={it.size} onOpen={openLightbox} />
                      ))}
                    </DriftTrack>
                  </div>
                </div>
              </div>

              {/* Mobile: single horizontal row */}
              <div
                className="hero-wall-horizontal"
                onMouseEnter={() => { wallPausedRef.current = true; }}
                onMouseLeave={() => { wallPausedRef.current = false; }}
              >
                <DriftTrack className="hero-wall-row-track" loopSeconds={39} axis="x" direction={-1} pausedRef={wallPausedRef}>
                  {ROW_M.map((c, i) => (
                    <WallCard key={`r-${i}`} clip={c} onOpen={openLightbox} horizontal />
                  ))}
                </DriftTrack>
              </div>

              <span className="hero-wall-disclaimer">
                Video editing only. Brand ownership belongs to respective clients.
              </span>
            </div>
          </div>
        </div>
      </div>

      <Lightbox src={lightboxSrc} onClose={closeLightbox} />

      <style>{`
        .hero-wall { width: 100%; }
        .hero-wall-edge { display: block; }

        /* Label row with pulsing live dot */
        .hero-wall-label {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-family: 'JetBrains Mono', ui-monospace, monospace;
          font-size: 11px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: hsl(var(--muted-foreground));
        }
        .hero-wall-dot {
          width: 6px;
          height: 6px;
          border-radius: 9999px;
          background: #1A1A1A;
          animation: hero-wall-live 2s ease-in-out infinite;
        }
        @keyframes hero-wall-live {
          0%, 100% { opacity: 0.3; }
          50%      { opacity: 1; }
        }

        /* Hairline rule between label and wall */
        .hero-wall-rule {
          height: 1px;
          background: rgba(26,26,26,0.10);
          margin-top: 16px;
          margin-bottom: 16px;
        }

        /* Disclaimer */
        .hero-wall-disclaimer {
          margin-top: 16px;
          font-family: 'JetBrains Mono', ui-monospace, monospace;
          font-size: 9px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          line-height: 1.6;
          color: hsl(var(--muted-foreground));
          opacity: 0.5;
        }

        /* === Cards === */
        .hero-wall-card {
          position: relative;
          display: block;
          width: 100%;
          aspect-ratio: 9 / 16;
          border-radius: 4px;
          overflow: hidden;
          background-color: hsl(var(--secondary));
          border: 1px solid rgba(26,26,26,0.06);
          box-shadow: 0 1px 2px rgba(26,26,26,0.04);
          padding: 0;
          cursor: pointer;
        }
        .hero-wall-card video {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        .hero-wall-card-ring {
          position: absolute;
          inset: 0;
          pointer-events: none;
          border-radius: 4px;
          box-shadow: inset 0 0 0 1px rgba(26,26,26,0.2);
          opacity: 0;
          transition: opacity 200ms ease;
        }
        .hero-wall-card:hover .hero-wall-card-ring { opacity: 1; }

        /* === Vertical multi-column wall (desktop + tablet) === */
        .hero-wall-vertical {
          position: relative;
          height: 85vh;
          max-height: 760px;
          overflow: hidden;
          -webkit-mask-image: linear-gradient(to bottom, transparent 0%, #000 12%, #000 88%, transparent 100%);
                  mask-image: linear-gradient(to bottom, transparent 0%, #000 12%, #000 88%, transparent 100%);
        }
        .hero-wall-cols, .hero-wall-cols-2 {
          display: none;
          gap: 16px;
          height: 100%;
        }
        .hero-wall-col { flex: 1 1 0; min-width: 0; overflow: hidden; }
        .hero-wall-track {
          display: flex;
          flex-direction: column;
          gap: 16px;
          will-change: transform;
        }

        @media (min-width: 1024px) { .hero-wall-cols { display: flex; } }
        @media (min-width: 768px) and (max-width: 1023px) { .hero-wall-cols-2 { display: flex; } }

        /* === Mobile horizontal row === */
        .hero-wall-horizontal {
          display: none;
          position: relative;
          height: 40vh;
          overflow: hidden;
          -webkit-mask-image: linear-gradient(to right, transparent 0%, #000 12%, #000 88%, transparent 100%);
                  mask-image: linear-gradient(to right, transparent 0%, #000 12%, #000 88%, transparent 100%);
        }
        .hero-wall-row-track {
          display: flex;
          gap: 16px;
          height: 100%;
          width: max-content;
          will-change: transform;
        }
        .hero-wall-card-h {
          height: 100%;
          width: auto;
          aspect-ratio: 9 / 16;
        }
        @media (max-width: 767px) {
          .hero-wall-vertical { display: none; }
          .hero-wall-horizontal { display: block; }
        }
      `}</style>
    </section>
  );
};

export default Hero;
