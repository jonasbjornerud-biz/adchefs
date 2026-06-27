import { Button } from "@/components/ui/button";
import { ArrowRight, Volume2, VolumeX, X as XIcon } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import jonasPhoto from "@/assets/jonas.jpg";

/* ------------------------------------------------------------------ */
/* CLEARED TILES ONLY — RITUEL + Jonas personal work.                  */
/* Add new cleared cuts here as they clear. Do NOT add KiddoSpace,     */
/* MADO, or any agency client cuts to this array.                      */
/* Each tile is a Cloudinary video id from cloud "dqnifzwda", or a     */
/* direct { preview, poster, full } object for non-Cloudinary sources. */
/* ------------------------------------------------------------------ */

const CLOUD = "dqnifzwda";

type ClearedTile =
  | { kind: "cloudinary"; id: string; mov?: boolean; label: string; brand: "RITUEL" | "PERSONAL" }
  | { kind: "raw"; preview: string; poster: string; full: string; label: string; brand: "RITUEL" | "PERSONAL" };

const CLEARED_TILES: ClearedTile[] = [
  // e.g. { kind: "cloudinary", id: "XXX", label: "RITUEL · 01", brand: "RITUEL" },
];

type TileUrls = { preview: string; poster: string; full: string; label: string };

const resolveTile = (t: ClearedTile): TileUrls => {
  if (t.kind === "raw") {
    return { preview: t.preview, poster: t.poster, full: t.full, label: t.label };
  }
  const f = t.mov ? "" : ",f_auto";
  return {
    preview: `https://res.cloudinary.com/${CLOUD}/video/upload/so_0,eo_3,w_400,q_auto${f},ac_none/${t.id}.mp4`,
    poster: `https://res.cloudinary.com/${CLOUD}/video/upload/so_1,w_400,q_auto${f}/${t.id}.jpg`,
    full: `https://res.cloudinary.com/${CLOUD}/video/upload/q_auto${f}/${t.id}.mp4`,
    label: t.label,
  };
};

const TILES: TileUrls[] = CLEARED_TILES.map(resolveTile);

/* ------------------------------------------------------------------ */

const splitColumns = (n: number, tiles: TileUrls[]) => {
  const cols: TileUrls[][] = Array.from({ length: n }, () => []);
  tiles.forEach((t, i) => cols[i % n].push(t));
  return cols;
};

const Lightbox = ({ src, onClose }: { src: string | null; onClose: () => void }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    if (!src) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [src, onClose]);

  if (!src) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={onClose}
      className="fixed inset-0 z-[100] flex items-center justify-center"
      style={{ background: "rgba(26,26,26,0.92)" }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "relative",
          aspectRatio: "9 / 16",
          height: "85vh",
          borderRadius: 4,
          overflow: "hidden",
        }}
      >
        <video
          ref={videoRef}
          src={src}
          autoPlay
          loop
          playsInline
          preload="auto"
          style={{ width: "100%", height: "100%", objectFit: "cover", background: "#000" }}
        />
        <div style={{ position: "absolute", top: 8, right: 8, display: "flex", gap: 4 }}>
          <button
            type="button"
            onClick={() => {
              const v = videoRef.current;
              if (!v) return;
              v.muted = !v.muted;
              setMuted(v.muted);
            }}
            aria-label={muted ? "Unmute" : "Mute"}
            className="csh-lb-chrome"
          >
            {muted ? <VolumeX className="h-[18px] w-[18px]" /> : <Volume2 className="h-[18px] w-[18px]" />}
          </button>
          <button type="button" onClick={onClose} aria-label="Close" className="csh-lb-chrome">
            <XIcon className="h-[18px] w-[18px]" />
          </button>
        </div>
      </div>
    </div>
  );
};

const Tile = ({ tile, onOpen }: { tile: TileUrls; onOpen: (full: string) => void }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const el = btnRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        const v = videoRef.current;
        if (!v) return;
        if (entry.isIntersecting && entry.intersectionRatio >= 0.5) v.play().catch(() => {});
        else v.pause();
      },
      { threshold: [0, 0.5, 1] }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <button
      ref={btnRef}
      type="button"
      onClick={() => onOpen(tile.full)}
      className="csh-tile"
      aria-label={`Play ${tile.label}`}
    >
      <video
        ref={videoRef}
        src={tile.preview}
        poster={tile.poster}
        muted
        loop
        playsInline
        preload="metadata"
        className="w-full h-full object-cover block"
      />
      <span aria-hidden className="csh-tile-ring" />
    </button>
  );
};

const scrollToBooking = () => {
  const el = document.getElementById("booking");
  if (el) el.scrollIntoView({ behavior: "smooth" });
  else window.location.href = "/#booking";
};

const CreativeStrategyHero = () => {
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);
  const openLightbox = useCallback((full: string) => setLightboxSrc(full), []);
  const closeLightbox = useCallback(() => setLightboxSrc(null), []);

  const hasTiles = TILES.length > 0;
  const colCount = TILES.length >= 5 ? 3 : 2;
  const cols = splitColumns(colCount, TILES);

  return (
    <section
      className="relative overflow-hidden pt-10 pb-20 sm:pb-28"
      style={{ background: "#F7F6F3" }}
    >
      {/* Soft blue radial wash — hero only */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 85% 8%, rgba(158,216,245,0.22) 0%, transparent 58%), radial-gradient(ellipse at 8% 92%, rgba(158,216,245,0.14) 0%, transparent 55%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          mixBlendMode: "multiply",
        }}
      />

      <div className="relative mx-auto max-w-[1200px] px-6">
        <div className="grid lg:grid-cols-[55%_45%] gap-10 lg:gap-12 items-start">
          {/* LEFT */}
          <div className="flex flex-col justify-center min-w-0 lg:pt-12 lg:pb-8">
            <span className="eyebrow eyebrow-accent self-start w-fit">BUILT FOR DTC BRANDS</span>

            <h1
              className="mt-5 text-[40px] sm:text-[52px] lg:text-[60px] leading-[1.02] tracking-[-0.025em] font-semibold"
              style={{ fontFamily: "'Inter Tight', sans-serif", color: "#1A1A1A" }}
            >
              One operator owning the creative{" "}
              <em
                style={{
                  fontFamily: "'Instrument Serif', serif",
                  fontStyle: "italic",
                  fontWeight: 400,
                }}
              >
                number
              </em>
              .
            </h1>

            <p
              className="mt-7 text-[16px] sm:text-[17px] leading-relaxed max-w-xl"
              style={{ color: "#75726B" }}
            >
              Research, angles, briefs, produced videos, and the weekly read on what is actually moving. Built for 7 to 9 figure DTC brands that want creative run like a department, not a queue of tasks.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Button
                size="lg"
                variant="cta"
                className="h-auto px-8 py-4 tracking-[0.01em] gap-[10px]"
                onClick={scrollToBooking}
              >
                Book a Call
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>

            <div className="mt-6 flex items-center gap-3">
              <div className="w-11 h-11 rounded-full overflow-hidden border border-foreground/10 flex-shrink-0">
                <img src={jonasPhoto} alt="Jonas Bjørnerud" className="w-full h-full object-cover grayscale" />
              </div>
              <div className="flex flex-col">
                <span className="font-sans font-medium text-[14px] leading-tight" style={{ color: "#1A1A1A" }}>
                  Jonas Bjørnerud
                </span>
                <span
                  className="mt-0.5"
                  style={{
                    fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                    fontSize: 10,
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    color: "#75726B",
                  }}
                >
                  Founder · AdChefs
                </span>
              </div>
            </div>
          </div>

          {/* RIGHT — work wall */}
          <div className="min-w-0 lg:pt-12">
            <div className="flex items-center gap-2">
              <span aria-hidden className="csh-dot" />
              <span
                style={{
                  fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                  fontSize: 10,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: "#75726B",
                }}
              >
                Cuts running for clients right now
              </span>
            </div>
            <div
              className="mt-3 h-px w-full"
              style={{ background: "rgba(26,26,26,0.10)" }}
            />

            {hasTiles ? (
              <div
                className="mt-5 csh-wall-mask"
              >
                <div
                  className="grid gap-3"
                  style={{ gridTemplateColumns: `repeat(${colCount}, minmax(0, 1fr))` }}
                >
                  {cols.map((col, ci) => (
                    <div key={ci} className="flex flex-col gap-3" style={{ transform: ci % 2 === 1 ? "translateY(24px)" : "none" }}>
                      {col.map((t, ti) => (
                        <Tile key={`${ci}-${ti}`} tile={t} onOpen={openLightbox} />
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div
                className="mt-6 flex items-center justify-center rounded-[4px] px-6 py-16 text-center"
                style={{
                  border: "1px dashed rgba(26,26,26,0.18)",
                  background:
                    "linear-gradient(180deg, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.2) 100%)",
                }}
              >
                <p
                  style={{
                    fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                    fontSize: 10,
                    letterSpacing: "0.22em",
                    textTransform: "uppercase",
                    color: "#75726B",
                    maxWidth: 320,
                    lineHeight: 1.7,
                  }}
                >
                  Cleared cuts being added as they release
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <Lightbox src={lightboxSrc} onClose={closeLightbox} />

      <style>{`
        .csh-dot {
          width: 7px; height: 7px; border-radius: 9999px;
          background: #9ED8F5;
          box-shadow: 0 0 0 3px rgba(158,216,245,0.25);
          animation: csh-pulse 1.6s ease-in-out infinite;
          display: inline-block;
        }
        @keyframes csh-pulse {
          0%,100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.55; transform: scale(0.85); }
        }
        .csh-tile {
          position: relative;
          width: 100%;
          aspect-ratio: 9 / 16;
          border-radius: 4px;
          overflow: hidden;
          background: #1A1A1A;
          padding: 0; border: 0; cursor: pointer; display: block;
          box-shadow: 0 10px 24px -16px rgba(26,26,26,0.45);
          transition: transform 280ms ease;
        }
        .csh-tile:hover { transform: translateY(-2px); }
        .csh-tile-ring {
          position: absolute; inset: 0;
          border-radius: 4px;
          box-shadow: inset 0 0 0 1px rgba(158,216,245,0);
          transition: box-shadow 240ms ease;
          pointer-events: none;
        }
        .csh-tile:hover .csh-tile-ring {
          box-shadow: inset 0 0 0 1px rgba(158,216,245,0.75);
        }
        .csh-wall-mask {
          -webkit-mask-image: linear-gradient(180deg, transparent 0%, #000 8%, #000 92%, transparent 100%);
                  mask-image: linear-gradient(180deg, transparent 0%, #000 8%, #000 92%, transparent 100%);
        }
        .csh-lb-chrome {
          width: 36px; height: 36px; display: inline-flex; align-items: center; justify-content: center;
          background: rgba(26,26,26,0.6); color: #F7F6F3; border-radius: 4px; border: 0; cursor: pointer;
        }
      `}</style>
    </section>
  );
};

export default CreativeStrategyHero;