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

// Distribute videos across N columns; ensure each column has at least `min` items
// by repeating, then double for seamless loop.
const buildColumns = (n: number, min: number) => {
  const cols: typeof FEATURED_FULL[] = Array.from({ length: n }, () => []);
  FEATURED_FULL.forEach((c, i) => cols[i % n].push(c));
  return cols.map((col) => {
    let filled = [...col];
    while (filled.length < min) filled = filled.concat(col);
    return [...filled, ...filled];
  });
};
const COLS_3 = buildColumns(3, 4);
const COLS_2 = buildColumns(2, 4);
// Single row for mobile: all videos doubled for seamless loop
const ROW_M = [...FEATURED_FULL, ...FEATURED_FULL];

interface LightboxProps {
  src: string | null;
  onClose: () => void;
}

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
        }}
      />

      {/* Top-right radial gradient accent */}
      <div
        className="absolute inset-0 pointer-events-none z-[1]"
        style={{
          background: 'radial-gradient(ellipse at 85% 10%, rgba(158, 216, 245, 0.35) 0%, transparent 60%)',
        }}
      />

      <div className="mx-auto max-w-[1200px] px-6 relative z-10 h-full">
        <div className="grid lg:grid-cols-[55%_45%] gap-10 lg:gap-12 items-stretch lg:h-full">
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

          {/* RIGHT: horizontal video carousel */}
          <div
            className="hero-carousel-col flex min-w-0 justify-center items-center lg:h-full lg:pt-28 lg:pb-8"
            onMouseEnter={() => setHoverPause(true)}
            onMouseLeave={() => setHoverPause(false)}
          >
            <div className="hero-carousel mx-auto flex flex-col w-full">
              {/* Top label, flush with active slide's left edge */}
              <div className="hero-carousel-edge">
                <span className="mono text-[11px] uppercase tracking-[0.15em] text-muted-foreground">
                  Live cuts shipping for clients
                </span>
              </div>

              {/* Track */}
              <div
                className="hero-carousel-track relative mt-4"
                onPointerDown={onPointerDown}
                onPointerUp={onPointerUp}
                onPointerCancel={() => (dragRef.current.active = false)}
                style={{ touchAction: "pan-y" }}
              >
                {FEATURED_FULL.map((c, i) => {
                  // shortest signed distance accounting for wrap
                  let offset = i - activeIdx;
                  if (offset > TOTAL / 2) offset -= TOTAL;
                  if (offset < -TOTAL / 2) offset += TOTAL;
                  const isActive = offset === 0;
                  const isPeek = Math.abs(offset) === 1;
                  const visible = isActive || isPeek;
                  // X position: center + offset * (activeW/2 + gap + peekW/2)
                  // peekW = 0.85 * activeW. so spacing = activeW*0.5 + 20 + 0.85*activeW*0.5 = 0.925W + 20
                  const translate = `calc(-50% + ${offset} * (var(--slide-w) * 0.925 + 20px))`;
                  return (
                    <button
                      key={i}
                      type="button"
                      aria-label={isActive ? `Open ${c.label}` : `Show ${c.label}`}
                      onClick={() => {
                        markManual();
                        if (isActive) openLightbox(c.full);
                        else goTo(i);
                      }}
                      className="hero-slide absolute top-1/2 left-1/2 rounded-[4px] overflow-hidden bg-secondary p-0"
                      style={{
                        width: isActive
                          ? "var(--slide-w)"
                          : "calc(var(--slide-w) * 0.85)",
                        height: isActive
                          ? "var(--slide-h)"
                          : "calc(var(--slide-h) * 0.85)",
                        transform: `translate(${translate}, -50%)`,
                        opacity: visible ? (isActive ? 1 : 0.5) : 0,
                        pointerEvents: visible ? "auto" : "none",
                        zIndex: isActive ? 2 : 1,
                        border: "1px solid rgba(26,26,26,0.08)",
                        boxShadow: isActive
                          ? "0 24px 60px rgba(26,26,26,0.18)"
                          : "0 12px 28px rgba(26,26,26,0.10)",
                        transition:
                          "transform 450ms cubic-bezier(0.22, 1, 0.36, 1), opacity 450ms cubic-bezier(0.22, 1, 0.36, 1), width 450ms cubic-bezier(0.22, 1, 0.36, 1), height 450ms cubic-bezier(0.22, 1, 0.36, 1)",
                        backgroundImage: `url("${c.poster}")`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        cursor: isActive ? "pointer" : "pointer",
                      }}
                    >
                      {isActive && (
                        <video
                          key={`v-${i}`}
                          src={c.preview}
                          poster={c.poster}
                          muted
                          autoPlay
                          loop
                          playsInline
                          preload="auto"
                          className="w-full h-full object-cover block"
                        />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Footer: counter + arrows, left-aligned with active slide */}
              <div className="hero-carousel-edge mt-5 flex items-center gap-4">
                <span
                  className="mono uppercase select-none"
                  style={{
                    fontSize: "11px",
                    letterSpacing: "0.15em",
                    color: "#75726B",
                  }}
                >
                  {String(activeIdx + 1).padStart(2, "0")} / {String(TOTAL).padStart(2, "0")}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    aria-label="Previous slide"
                    onClick={() => {
                      markManual();
                      goTo(activeIdx - 1);
                    }}
                    className="hero-arrow flex items-center justify-center"
                  >
                    <ChevronLeft className="h-4 w-4" strokeWidth={1.5} />
                  </button>
                  <button
                    type="button"
                    aria-label="Next slide"
                    onClick={() => {
                      markManual();
                      goTo(activeIdx + 1);
                    }}
                    className="hero-arrow flex items-center justify-center"
                  >
                    <ChevronRight className="h-4 w-4" strokeWidth={1.5} />
                  </button>
                </div>
              </div>

              {/* Disclaimer */}
              <div className="hero-carousel-edge mt-3">
                <span className="mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground/70">
                  Video editing only. Brand ownership belongs to respective clients.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Lightbox src={lightboxSrc} onClose={closeLightbox} />

      <style>{`
        .hero-carousel {
          --slide-h: min(65vh, 600px);
          --slide-w: calc(var(--slide-h) * 9 / 16);
        }
        @media (max-width: 1023px) {
          .hero-carousel { --slide-h: 55vh; }
        }
        @media (max-width: 767px) {
          .hero-carousel {
            --slide-h: 60vh;
            --slide-w: 100%;
          }
        }
        .hero-carousel-track {
          height: var(--slide-h);
          overflow: hidden;
          user-select: none;
        }
        /* Left-edge aligned blocks: width = active slide, centered in the column */
        .hero-carousel-edge {
          width: var(--slide-w);
          margin-left: auto;
          margin-right: auto;
        }
        .hero-arrow {
          width: 40px;
          height: 40px;
          border-radius: 4px;
          border: 1px solid rgba(26,26,26,0.15);
          background: transparent;
          color: #1A1A1A;
          transition: background-color 200ms ease, color 200ms ease, border-color 200ms ease;
        }
        .hero-arrow:hover {
          background: #1A1A1A;
          color: #F7F6F3;
          border-color: #1A1A1A;
        }
        /* Mobile: single full-width slide, no peek */
        @media (max-width: 767px) {
          .hero-slide {
            width: 100% !important;
            height: var(--slide-h) !important;
          }
        }
      `}</style>
    </section>
  );
};

export default Hero;
