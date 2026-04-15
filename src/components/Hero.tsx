import { ArrowRight, Check } from "lucide-react";
import BackgroundElements from "./BackgroundElements";

const mediaSources = [
  "https://res.cloudinary.com/dqnifzwda/video/upload/v1773501822/GIF9_u1acww.webm",
  "https://res.cloudinary.com/dqnifzwda/video/upload/v1773501817/GIF10_mgrxbx.webm",
  "https://res.cloudinary.com/dqnifzwda/video/upload/v1773501820/GIF11_dfnd9x.webm",
  "https://res.cloudinary.com/dqnifzwda/video/upload/v1773501815/GIF5_NEW_c8ocsj.webm",
  "https://res.cloudinary.com/dqnifzwda/image/upload/v1773785219/GIF12_zcuv10.webp",
];

const Hero = () => {
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const doubled = [...mediaSources, ...mediaSources];

  return (
    <section className="section-steel min-h-[100svh] flex flex-col justify-center pt-20">
      <BackgroundElements />

      <div className="container mx-auto px-8 relative z-10 text-center max-w-4xl">
        {/* HUD Label */}
        <div className="inline-block px-3 py-1 border mb-10" style={{ borderColor: "hsl(263 70% 50% / 0.3)", background: "hsl(263 70% 50% / 0.05)" }}>
          <span className="mono-label" style={{ color: "hsl(263 70% 50%)" }}>
            Visual Engineering Unit // 001
          </span>
        </div>

        {/* Massive Title */}
        <h1
          className="font-extrabold leading-[0.85] tracking-tighter uppercase mb-8 text-white"
          style={{ fontSize: "clamp(3.5rem, 10vw, 9rem)" }}
        >
          We cook
          <br />
          <span className="text-stroke">up ads</span>
        </h1>

        <p className="text-lg md:text-xl text-white/40 leading-relaxed max-w-xl mx-auto mb-4">
          Creative strategy, <span style={{ color: "hsl(263 70% 60%)" }}>AI insights</span>, and elite editors
          working together to deliver high-performance video at scale.
        </p>

        <div className="flex items-center justify-center gap-4 mono-label text-white/20 mb-12">
          <Check className="w-3 h-3" style={{ color: "hsl(263 70% 50% / 0.5)" }} />
          <span>Pay per video. No retainers.</span>
        </div>

        <button
          onClick={() => scrollToSection("booking")}
          className="plasma-button px-10 py-5 text-base group inline-flex items-center gap-3"
        >
          <span className="relative z-10">Book a Call</span>
          <ArrowRight className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* Marquee */}
      <div className="relative w-screen left-1/2 -translate-x-1/2 mt-24 mb-12 marquee-wrapper z-10">
        <div className="marquee-track flex gap-4">
          {doubled.map((src, i) => (
            <div
              key={i}
              className="flex-shrink-0 w-[260px] h-[360px] overflow-hidden film-frame"
            >
              {src.match(/\.(webp|png|jpe?g|gif)(\?|$)/i) ? (
                <img src={src} alt="" className="w-full h-full object-cover" loading="lazy" />
              ) : (
                <video
                  src={src}
                  className="w-full h-full object-cover"
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="auto"
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
