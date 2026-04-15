import { Button } from "@/components/ui/button";
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
    <section className="section-dark min-h-[100svh] flex flex-col justify-center pt-20">
      <BackgroundElements variant="dark" />

      <div className="container mx-auto px-6 relative z-10 text-center max-w-3xl">
        <div className="inline-flex items-center px-4 py-1.5 mb-8 rounded-full border border-white/10 bg-white/[0.04]">
          <span className="text-xs tracking-wide text-white/50">
            AI automations × expert video editors
          </span>
        </div>

        <h1
          className="font-extrabold leading-[1.04] tracking-[-0.03em] mb-6 text-white"
          style={{ fontSize: "clamp(2.5rem, 6vw, 4.5rem)" }}
        >
          We cook up{" "}
          <span style={{ color: "hsl(262 83% 58%)" }}>ads</span> that{" "}
          <br className="hidden sm:block" />
          <span style={{ color: "hsl(262 83% 58%)" }}>scale</span> your brand
        </h1>

        <p className="text-base md:text-lg text-white/50 leading-relaxed max-w-xl mx-auto mb-4">
          Creative strategy, <span style={{ color: "hsl(262 83% 68%)" }}>AI insights</span>, and elite editors
          working together to deliver videos that drive consistent growth.
        </p>

        <div className="flex items-center justify-center gap-1.5 text-xs text-white/30 mb-10">
          <Check className="w-3.5 h-3.5" style={{ color: "hsl(262 83% 58% / 0.6)" }} />
          Pay per video. No retainers.
        </div>

        <Button
          size="lg"
          variant="cta"
          onClick={() => scrollToSection("booking")}
          className="text-base px-8 py-5 h-auto group relative overflow-hidden shimmer-button rounded-xl"
        >
          <span className="relative z-10 flex items-center">
            Book a Call
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
          </span>
        </Button>
      </div>

      {/* Marquee */}
      <div className="relative w-screen left-1/2 -translate-x-1/2 mt-20 mb-8 marquee-wrapper z-10">
        <div className="marquee-track flex gap-4">
          {doubled.map((src, i) => (
            <div
              key={i}
              className="flex-shrink-0 w-[240px] h-[340px] rounded-xl overflow-hidden border border-white/[0.06]"
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
