import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

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
    <section className="hero-section relative min-h-[100svh] flex flex-col justify-center pt-[calc(80px+env(safe-area-inset-top))] md:pt-20 overflow-hidden">
      <div className="hero-grain" />

      {/* Hero text — centered */}
      <div className="container mx-auto px-6 relative z-10 text-center">
        <div className="relative inline-block">
          {/* Spotlight glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-[hsl(260_100%_62%/0.10)] blur-[120px] pointer-events-none -z-10" />

          <div className="inline-flex items-center justify-center px-5 py-1.5 mb-6 rounded-full bg-white/[0.06] dark:bg-[rgba(126,61,255,0.08)] backdrop-blur-md border border-[rgba(126,61,255,0.4)] dark:border-[rgba(126,61,255,0.25)] transition-colors duration-300">
            <span className="text-sm text-muted-foreground transition-colors duration-300">
              Blending AI automations with expert video editors
            </span>
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-foreground leading-[1.08] transition-colors duration-300 hero-headline-glow">
            We cook up <span className="text-accent">ads</span> that{" "}
            <br className="hidden sm:block" />
            <span className="text-accent">scale</span> your brand
          </h1>
        </div>

        <p className="text-lg md:text-xl mb-4 text-muted-foreground leading-relaxed max-w-2xl mx-auto transition-colors duration-300">
          Creative strategy, <span className="text-accent">AI insights</span>, and elite editors working
          together to deliver videos that drive consistent growth.
        </p>

        <div className="flex items-center justify-center gap-1.5 text-xs md:text-sm text-muted-foreground/60 mb-8">
          <Check className="w-3.5 h-3.5 text-accent/60" />
          Pay per video. No retainers.
        </div>

        <div className="flex justify-center">
          <Button
            size="lg"
            variant="cta"
            onClick={() => scrollToSection("booking")}
            className="text-lg px-8 py-6 h-auto group relative overflow-hidden shimmer-button"
          >
            <span className="relative z-10 flex items-center">
              Book Call Now
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </span>
          </Button>
        </div>
      </div>

      {/* Full-width marquee */}
      <div className="relative w-screen left-1/2 -translate-x-1/2 mt-16 mb-8 marquee-wrapper">
        <div className="marquee-track flex gap-4">
          {doubled.map((src, i) => (
            <div
              key={i}
              className="flex-shrink-0 w-[260px] h-[360px] rounded-xl overflow-hidden border border-white/5 shadow-lg shadow-[hsl(260_100%_62%/0.05)]"
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
