import { Button } from "@/components/ui/button";
import { ArrowRight, X as XIcon, Play } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCallback, useEffect, useRef, useState } from "react";
import HeroBackground from "./HeroBackground";

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
}

const RecentWorkCard = ({ urls, onOpen }: CardProps) => {
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
      className="recent-work-card group relative flex-shrink-0 w-[170px] h-[240px] sm:w-[220px] sm:h-[310px] rounded-[4px] overflow-hidden border border-foreground/10 bg-secondary p-0 cursor-pointer"
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
        className="pointer-events-none absolute inset-0 flex items-center justify-center transition-opacity duration-[250ms] ease-out"
        style={{ opacity: showIndicator ? 1 : 0 }}
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

  const doubled = [...CLIP_URLS, ...CLIP_URLS];

  return (
    <section className="relative pt-24 pb-12 sm:pt-40 sm:pb-16 overflow-hidden bg-background">
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

      <div className="mx-auto max-w-[1200px] px-6 relative z-10">
        <div className="max-w-[1200px] md:-ml-4">
          <span className="eyebrow">Built for e-com brands · Pay per video</span>

          <h1 className="mt-4 font-display text-[34px] sm:text-[56px] md:text-[68px] leading-[1.02] sm:leading-[0.95] tracking-[-0.03em] text-foreground sm:whitespace-nowrap">
            Your <em>dedicated</em> video editor<br className="hidden sm:inline" />
            {" "}without the additional cost
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
        </div>
      </div>

      {/* Recent work marquee */}
      <div className="relative mt-20 sm:mt-24">
        <div className="mx-auto max-w-[1200px] px-6 mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <span className="eyebrow">Recent work</span>
          <span className="mono text-[11px] uppercase tracking-[0.15em] text-muted-foreground">
            Live cuts shipping for clients
          </span>
        </div>

        <div className="relative w-full overflow-hidden marquee-wrapper">
          <div className="absolute left-0 top-0 bottom-0 w-24 z-10 pointer-events-none bg-gradient-to-r from-background to-transparent" />
          <div className="absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none bg-gradient-to-l from-background to-transparent" />

          <div className="marquee-track flex gap-4">
            {doubled.map((urls, i) => (
              <RecentWorkCard key={i} urls={urls} onOpen={openLightbox} />
            ))}
          </div>
        </div>

        <p className="text-center mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground/70 mt-6 px-4">
          Video editing only. Brand ownership belongs to respective clients.
        </p>
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
      `}</style>
    </section>
  );
};

export default Hero;
