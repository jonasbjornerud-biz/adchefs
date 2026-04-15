import { Button } from "@/components/ui/button";
import { ArrowRight, Check } from "lucide-react";

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
    <section className="hero-section relative min-h-[100svh] flex flex-col justify-center pt-20 overflow-hidden">
      <div className="hero-grain" />

      <div className="container mx-auto px-6 relative z-10 text-center max-w-3xl">
        <div className="inline-flex items-center px-4 py-1.5 mb-8 rounded-full bg-accent/[0.08] border border-accent/20 backdrop-blur-sm">
          <span className="text-xs tracking-wide text-muted-foreground">
            AI automations × expert video editors
          </span>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.06] tracking-tight mb-6 text-foreground">
          We cook up{" "}
          <span className="text-accent">ads</span> that{" "}
          <br className="hidden sm:block" />
          <span className="text-accent">scale</span> your brand
        </h1>

        <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-xl mx-auto mb-4">
          Creative strategy, <span className="text-accent">AI insights</span>, and elite editors
          working together to deliver videos that drive consistent growth.
        </p>

        <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground/50 mb-10">
          <Check className="w-3.5 h-3.5 text-accent/50" />
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
      <div className="relative w-screen left-1/2 -translate-x-1/2 mt-20 mb-8 marquee-wrapper">
        <div className="marquee-track flex gap-4">
          {doubled.map((src, i) => (
            <div
              key={i}
              className="flex-shrink-0 w-[240px] h-[340px] rounded-xl overflow-hidden border border-border/30"
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
