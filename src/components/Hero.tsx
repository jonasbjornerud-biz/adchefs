import { Button } from "@/components/ui/button";
import { ArrowRight, X as XIcon, Play } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCallback, useEffect, useRef, useState } from "react";
import HeroBackground from "./HeroBackground";
import jonasPhoto from "@/assets/jonas.jpg";

const CLOUD = "dqnifzwda";
const CLIPS: { id: string; mov?: boolean }[] = [
  { id: "AC1_r0bbjh" },
  { id: "AC2_xllvey" },
  { id: "AC3_wa3d0v" },
  { id: "AC4_l0cp6d" },
  { id: "AC5_v65ofr" },
  { id: "AC6_pqpagf", mov: true },
  { id: "AC7_kwkbqq", mov: true },
  { id: "AC8_bvkrvb" },
  { id: "AC9_uwa9z6" },
  { id: "AC10_obarrz" },
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

const CLIP_URLS: ClipUrls[] = CLIPS.map((c) => buildUrls(c.id, c.mov));

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

interface CardProps {
  urls: ClipUrls;
  onOpen: (full: string) => void;
  className?: string;
}

const RecentWorkCard = ({ urls, onOpen, className }: CardProps) => {
  const wrapRef = useRef<HTMLButtonElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [errored, setErrored] = useState(false);
  const [hover, setHover] = useState(false);
  const reduced = useRef(prefersReducedMotion());

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        const v = videoRef.current;
        if (!v) return;
        if (entry.isIntersecting) {
          if (v.preload === "none") v.preload = "metadata";
          if (!reduced.current) v.play().catch(() => {});
        } else {
          v.pause();
        }
      },
      { rootMargin: "200px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const showIndicator = hover || errored;

  return (
    <button
      ref={wrapRef}
      type="button"
      onClick={() => onOpen(urls.full)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className={
        className ??
        "recent-work-card group relative flex-shrink-0 w-[170px] h-[240px] sm:w-[220px] sm:h-[310px] rounded-[4px] overflow-hidden border border-foreground/10 bg-secondary p-0 cursor-pointer"
      }
      style={{
        backgroundImage: `url("${urls.poster}")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
      aria-label="Play video"
    >
      {!errored && (
        <video
          ref={videoRef}
          src={urls.preview}
          poster={urls.poster}
          muted
          autoPlay={!reduced.current}
          loop
          playsInline
          preload="none"
          onError={() => setErrored(true)}
          className="w-full h-full object-cover block"
        />
      )}
      {errored && (
        <img src={urls.poster} alt="" className="w-full h-full object-cover block" />
      )}

      {/* inset ring */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[4px] transition-opacity duration-[250ms] ease-out"
        style={{
          boxShadow: "inset 0 0 0 1px #9ED8F5",
          opacity: hover ? 1 : 0,
        }}
      />

      {/* play indicator */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 flex items-center justify-center transition-all duration-300"
        style={{
          opacity: showIndicator ? 1 : 0,
          transform: showIndicator ? "scale(1)" : "scale(0.8)",
          transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      >
        <span
          className="flex items-center justify-center"
          style={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            background: "rgba(26,26,26,0.85)",
          }}
        >
          <Play className="h-4 w-4 text-white fill-white" />
        </span>
      </span>
    </button>
  );
};

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
  const navigate = useNavigate();
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const openLightbox = useCallback((full: string) => setLightboxSrc(full), []);
  const closeLightbox = useCallback(() => setLightboxSrc(null), []);

  // Split clips into two columns, then double each for seamless loop
  const colA = CLIP_URLS.filter((_, i) => i % 2 === 0);
  const colB = CLIP_URLS.filter((_, i) => i % 2 === 1);
  const colADoubled = [...colA, ...colA];
  const colBDoubled = [...colB, ...colB];

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
        <div className="grid lg:grid-cols-[55%_45%] gap-10 lg:gap-16 items-stretch lg:h-full">
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

          {/* RIGHT: video wall column. Wall is right-aligned, capped width, with breathing room. */}
          <div className="flex flex-col items-end justify-center min-w-0 h-[640px] lg:h-full lg:pt-28 lg:pb-8">
            <div
              className="flex flex-col w-full max-w-[420px]"
              style={{ height: "80vh", maxHeight: "calc(100vh - 160px)", marginRight: "48px" }}
            >
              {/* Top label */}
              <div className="text-center mb-3">
                <span className="mono text-[11px] uppercase tracking-[0.15em] text-muted-foreground whitespace-nowrap">
                  Live cuts shipping for clients
                </span>
              </div>

              {/* Tilted wall */}
              <div
                className="video-wall-perspective relative flex-1 min-h-0"
                style={{ perspective: "1200px" }}
              >
                <div
                  className="video-wall-tilt absolute inset-0 overflow-hidden"
                  style={{
                    transform: "rotateX(8deg) rotateY(-12deg) rotateZ(2deg)",
                    transformStyle: "preserve-3d",
                    transformOrigin: "center center",
                    WebkitMaskImage:
                      "linear-gradient(to bottom, transparent 0px, black 120px, black calc(100% - 120px), transparent 100%)",
                    maskImage:
                      "linear-gradient(to bottom, transparent 0px, black 120px, black calc(100% - 120px), transparent 100%)",
                  }}
                >
                  <div className="grid grid-cols-2 gap-3 h-full">
                    <div className="video-col video-col-up overflow-hidden">
                      <div className="video-track-up flex flex-col gap-3">
                        {colADoubled.map((urls, i) => (
                          <RecentWorkCard
                            key={`a-${i}`}
                            urls={urls}
                            onOpen={openLightbox}
                            className="recent-work-card group relative w-full aspect-[9/16] rounded-[4px] overflow-hidden border border-foreground/10 bg-secondary p-0 cursor-pointer block shadow-[0_12px_32px_rgba(26,26,26,0.12)]"
                          />
                        ))}
                      </div>
                    </div>
                    <div className="video-col video-col-down overflow-hidden">
                      <div className="video-track-down flex flex-col gap-3">
                        {colBDoubled.map((urls, i) => (
                          <RecentWorkCard
                            key={`b-${i}`}
                            urls={urls}
                            onOpen={openLightbox}
                            className="recent-work-card group relative w-full aspect-[9/16] rounded-[4px] overflow-hidden border border-foreground/10 bg-secondary p-0 cursor-pointer block shadow-[0_12px_32px_rgba(26,26,26,0.12)]"
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Disclaimer */}
              <p className="text-center mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground/70 whitespace-nowrap px-4 mt-3">
                Video editing only. Brand ownership belongs to respective clients.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Lightbox src={lightboxSrc} onClose={closeLightbox} />

      <style>{`
        @media (hover: hover) and (pointer: fine) {
          .recent-work-card {
            transition: transform 250ms ease-out, box-shadow 250ms ease-out;
          }
          .recent-work-card:hover {
            transform: scale(1.03);
            box-shadow: 0 8px 24px rgba(26,26,26,0.10);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .recent-work-card:hover { transform: none !important; }
        }

        @keyframes video-scroll-up {
          0% { transform: translateY(0); }
          100% { transform: translateY(-50%); }
        }
        @keyframes video-scroll-down {
          0% { transform: translateY(-50%); }
          100% { transform: translateY(0); }
        }
        .video-track-up {
          animation: video-scroll-up 60s linear infinite;
          will-change: transform;
        }
        .video-track-down {
          animation: video-scroll-down 60s linear infinite;
          animation-delay: -30s;
          will-change: transform;
        }
        .video-col-up:hover .video-track-up,
        .video-col-down:hover .video-track-down {
          animation-play-state: paused;
        }
        @media (prefers-reduced-motion: reduce) {
          .video-track-up, .video-track-down { animation: none; }
        }
      `}</style>
    </section>
  );
};

export default Hero;
