import { Button } from "@/components/ui/button";
import { ArrowRight, X as XIcon, Play } from "lucide-react";
import { useNavigate } from "react-router-dom";
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

const CLIP_URLS: ClipUrls[] = CLIPS.map((c) => buildUrls(c.id, c.mov));
const FEATURED_FULL = CLIPS.map((c) => ({
  ...buildUrls(c.id, c.mov),
  label: c.label.slice(0, 14).toUpperCase(),
}));

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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
  const [activeIdx, setActiveIdx] = useState(0);
  const [topLayer, setTopLayer] = useState(0); // which stacked video is visible (0 or 1)
  const [layerSrcs, setLayerSrcs] = useState<[string, string]>([
    FEATURED_FULL[0].preview,
    FEATURED_FULL[1 % FEATURED_FULL.length].preview,
  ]);
  const [paused, setPaused] = useState(false);
  const [cursor, setCursor] = useState<{ x: number; y: number; visible: boolean }>({
    x: 0,
    y: 0,
    visible: false,
  });
  const cursorTargetRef = useRef({ x: 0, y: 0 });
  const cursorRafRef = useRef<number | null>(null);
  const videoARef = useRef<HTMLVideoElement>(null);
  const videoBRef = useRef<HTMLVideoElement>(null);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const openLightbox = useCallback((full: string) => setLightboxSrc(full), []);
  const closeLightbox = useCallback(() => setLightboxSrc(null), []);

  // Swap to a given index with crossfade
  const swapTo = useCallback(
    (idx: number) => {
      const next = ((idx % FEATURED_FULL.length) + FEATURED_FULL.length) % FEATURED_FULL.length;
      setActiveIdx((prev) => {
        if (prev === next) return prev;
        // Place the incoming video on the hidden layer, then flip
        setLayerSrcs((srcs) => {
          const incomingLayer = topLayer === 0 ? 1 : 0;
          const newSrcs: [string, string] = [...srcs] as [string, string];
          newSrcs[incomingLayer] = FEATURED_FULL[next].preview;
          return newSrcs;
        });
        setTopLayer((l) => (l === 0 ? 1 : 0));
        return next;
      });
    },
    [topLayer]
  );

  // Auto-advance every 7s unless paused
  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => {
      swapTo(activeIdx + 1);
    }, 7000);
    return () => clearInterval(t);
  }, [paused, activeIdx, swapTo]);

  // Smoothed cursor follow
  useEffect(() => {
    const tick = () => {
      setCursor((c) => {
        const tx = cursorTargetRef.current.x;
        const ty = cursorTargetRef.current.y;
        const nx = c.x + (tx - c.x) * 0.18;
        const ny = c.y + (ty - c.y) * 0.18;
        return { ...c, x: nx, y: ny };
      });
      cursorRafRef.current = requestAnimationFrame(tick);
    };
    cursorRafRef.current = requestAnimationFrame(tick);
    return () => {
      if (cursorRafRef.current) cancelAnimationFrame(cursorRafRef.current);
    };
  }, []);

  const featuredWrapRef = useRef<HTMLDivElement>(null);

  const handleFeaturedMove = (e: React.MouseEvent) => {
    const rect = featuredWrapRef.current?.getBoundingClientRect();
    if (!rect) return;
    cursorTargetRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const handleFeaturedEnter = (e: React.MouseEvent) => {
    const rect = featuredWrapRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    cursorTargetRef.current = { x, y };
    setCursor({ x, y, visible: true });
    setPaused(true);
  };

  const handleFeaturedLeave = () => {
    setCursor((c) => ({ ...c, visible: false }));
    setPaused(false);
  };

  const handleFeaturedClick = () => {
    openLightbox(FEATURED_FULL[activeIdx].full);
  };

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

          {/* RIGHT: featured video + index list */}
          <div className="flex min-w-0 justify-end items-center lg:h-full lg:pt-28 lg:pb-8">
            {/* Desktop layout: index list + featured video, with featured bleeding off the right edge */}
            <div className="hidden lg:flex w-full items-center gap-6 relative">
              {/* Index list */}
              <div
                className="flex flex-col flex-shrink-0"
                onMouseEnter={() => setPaused(true)}
                onMouseLeave={() => setPaused(false)}
              >
                <span className="mono text-[11px] uppercase tracking-[0.15em] text-muted-foreground mb-4">
                  Live cuts shipping for clients
                </span>
                <ul className="flex flex-col">
                  {FEATURED_FULL.map((c, i) => {
                    const active = i === activeIdx;
                    return (
                      <li key={i}>
                        <button
                          type="button"
                          onMouseEnter={() => swapTo(i)}
                          onClick={() => swapTo(i)}
                          className="group flex items-center gap-3 py-[5px] mono uppercase whitespace-nowrap transition-colors duration-200"
                          style={{
                            fontSize: "11px",
                            letterSpacing: "0.15em",
                            color: active ? "#1A1A1A" : "#75726B",
                          }}
                        >
                          <span
                            aria-hidden
                            className="block transition-all duration-200"
                            style={{
                              width: active ? "16px" : "0px",
                              height: "1px",
                              background: "#1A1A1A",
                              opacity: active ? 1 : 0,
                            }}
                          />
                          <span>
                            {String(i + 1).padStart(2, "0")} {c.label}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
                <span className="mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground/70 mt-5 max-w-[240px] leading-[1.6]">
                  Video editing only. Brand ownership belongs to respective clients.
                </span>
              </div>

              {/* Featured video — bleeds 7% off the right viewport edge */}
              <div
                ref={featuredWrapRef}
                onMouseEnter={handleFeaturedEnter}
                onMouseMove={handleFeaturedMove}
                onMouseLeave={handleFeaturedLeave}
                onClick={handleFeaturedClick}
                className="relative rounded-[4px] overflow-hidden border border-foreground/10 bg-secondary flex-shrink-0"
                style={{
                  height: "min(80vh, 720px)",
                  aspectRatio: "9 / 16",
                  marginRight: "calc(-7% * (min(80vh, 720px) * 9 / 16) / 100% * 100%)",
                  transform: "translateX(7%)",
                  cursor: "none",
                  boxShadow: "0 24px 60px rgba(26,26,26,0.18)",
                }}
              >
                {/* Two stacked video layers for crossfade */}
                <video
                  ref={videoARef}
                  key={`a-${layerSrcs[0]}`}
                  src={layerSrcs[0]}
                  muted
                  autoPlay
                  loop
                  playsInline
                  preload="auto"
                  className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ease-out"
                  style={{ opacity: topLayer === 0 ? 1 : 0 }}
                />
                <video
                  ref={videoBRef}
                  key={`b-${layerSrcs[1]}`}
                  src={layerSrcs[1]}
                  muted
                  autoPlay
                  loop
                  playsInline
                  preload="auto"
                  className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ease-out"
                  style={{ opacity: topLayer === 1 ? 1 : 0 }}
                />

                {/* Custom cursor chip */}
                <div
                  aria-hidden
                  className="absolute pointer-events-none flex items-center justify-center rounded-full transition-opacity duration-200"
                  style={{
                    width: 56,
                    height: 56,
                    background: "#1A1A1A",
                    color: "#F7F6F3",
                    transform: `translate(${cursor.x - 28}px, ${cursor.y - 28}px)`,
                    opacity: cursor.visible ? 1 : 0,
                    left: 0,
                    top: 0,
                  }}
                >
                  <span
                    className="mono uppercase"
                    style={{ fontSize: "10px", letterSpacing: "0.15em" }}
                  >
                    Play
                  </span>
                </div>
              </div>
            </div>

            {/* Mobile / tablet layout */}
            <div className="lg:hidden w-full flex flex-col">
              <span className="mono text-[11px] uppercase tracking-[0.15em] text-muted-foreground mb-3">
                Live cuts shipping for clients
              </span>
              <div className="-mx-6 overflow-x-auto no-scrollbar mb-3">
                <ul className="flex gap-5 px-6">
                  {FEATURED_FULL.map((c, i) => {
                    const active = i === activeIdx;
                    return (
                      <li key={i}>
                        <button
                          type="button"
                          onClick={() => swapTo(i)}
                          className="mono uppercase whitespace-nowrap py-1"
                          style={{
                            fontSize: "11px",
                            letterSpacing: "0.15em",
                            color: active ? "#1A1A1A" : "#75726B",
                            borderBottom: active ? "1px solid #1A1A1A" : "1px solid transparent",
                          }}
                        >
                          {String(i + 1).padStart(2, "0")} {c.label}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
              <div
                onClick={handleFeaturedClick}
                className="relative w-full rounded-[4px] overflow-hidden border border-foreground/10 bg-secondary"
                style={{ height: "60vh", maxHeight: "640px" }}
              >
                <video
                  key={`m-${layerSrcs[0]}`}
                  src={layerSrcs[0]}
                  muted
                  autoPlay
                  loop
                  playsInline
                  preload="auto"
                  className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300"
                  style={{ opacity: topLayer === 0 ? 1 : 0 }}
                />
                <video
                  key={`m2-${layerSrcs[1]}`}
                  src={layerSrcs[1]}
                  muted
                  autoPlay
                  loop
                  playsInline
                  preload="auto"
                  className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300"
                  style={{ opacity: topLayer === 1 ? 1 : 0 }}
                />
              </div>
              <span className="mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground/70 mt-3 leading-[1.6]">
                Video editing only. Brand ownership belongs to respective clients.
              </span>
            </div>
          </div>
        </div>
      </div>

      <Lightbox src={lightboxSrc} onClose={closeLightbox} />

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </section>
  );
};

export default Hero;
