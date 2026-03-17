import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const videoSources = [
  "https://res.cloudinary.com/dqnifzwda/video/upload/v1773501822/GIF9_u1acww.webm",
  "https://res.cloudinary.com/dqnifzwda/video/upload/v1773501817/GIF10_mgrxbx.webm",
  "https://res.cloudinary.com/dqnifzwda/video/upload/v1773501820/GIF11_dfnd9x.webm",
  "https://res.cloudinary.com/dqnifzwda/video/upload/v1773501815/GIF5_NEW_c8ocsj.webm",
  "https://res.cloudinary.com/dqnifzwda/image/upload/v1773785219/GIF12_zcuv10.webp",
];

const scrollToSection = (id: string) => {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth" });
};

const Hero = () => {
  return (
    <section className="hero-section relative min-h-[100svh] flex flex-col justify-center pt-[calc(80px+env(safe-area-inset-top))] md:pt-24 pb-12">
      <div className="hero-grain" />

      {/* Centered hero text */}
      <div className="container mx-auto px-6 relative z-10 text-center">
        <div className="relative inline-block">
          {/* Spotlight glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-accent/10 blur-[120px] pointer-events-none -z-10" />

          <div className="inline-flex items-center justify-center px-5 py-1.5 mb-6 rounded-full bg-white/[0.06] dark:bg-[rgba(126,61,255,0.08)] backdrop-blur-md border border-[rgba(126,61,255,0.4)] dark:border-[rgba(126,61,255,0.25)] transition-colors duration-300">
            <span className="text-sm text-muted-foreground transition-colors duration-300">
              Pay per video. No retainers. No BS.
            </span>
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-[#0a0a14] dark:text-white leading-[1.08] transition-colors duration-300 hero-headline-glow">
            Scroll-stopping <span className="text-[#7e3dff]">ads</span>.{" "}
            <br className="hidden sm:block" />
            Pay only per <span className="text-[#7e3dff]">video</span>.
          </h1>

          <p className="text-lg md:text-xl mb-8 text-muted-foreground leading-relaxed max-w-2xl mx-auto transition-colors duration-300">
            Get high-converting video ads crafted by elite editors and AI — without
            locking into monthly retainers. Order what you need, when you need it.
          </p>

          <div className="flex justify-center">
            <Button
              size="lg"
              variant="cta"
              onClick={() => scrollToSection("booking")}
              className="text-lg px-8 py-6 h-auto group relative overflow-hidden shimmer-button"
            >
              <span className="relative z-10 flex items-center">
                Get Your First Video
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </Button>
          </div>

          {/* Trust line */}
          <div className="flex flex-wrap justify-center gap-6 mt-6 text-sm text-muted-foreground">
            <span>✓ No contracts</span>
            <span>✓ 48hr turnaround</span>
            <span>✓ Unlimited revisions</span>
          </div>
        </div>
      </div>

      {/* Full-width marquee */}
      <div className="relative w-screen left-1/2 -translate-x-1/2 mt-16 overflow-hidden marquee-wrapper">
        <div className="marquee-track flex gap-4">
          {[...videoSources, ...videoSources].map((src, i) => {
            const isImage = /\.(webp|png|jpe?g|gif)(\?|$)/i.test(src);
            return (
              <div
                key={i}
                className="flex-shrink-0 w-[260px] h-[360px] rounded-xl overflow-hidden border border-white/5 shadow-lg shadow-purple-500/5"
              >
                {isImage ? (
                  <img
                    src={src}
                    alt=""
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
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
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Hero;
