import { Button } from "@/components/ui/button";
import { ArrowRight, Check, Sparkles, Rocket } from "lucide-react";

const mediaSources = [
  "https://res.cloudinary.com/dqnifzwda/video/upload/v1773501822/GIF9_u1acww.webm",
  "https://res.cloudinary.com/dqnifzwda/video/upload/v1773501817/GIF10_mgrxbx.webm",
  "https://res.cloudinary.com/dqnifzwda/video/upload/v1773501820/GIF11_dfnd9x.webm",
  "https://res.cloudinary.com/dqnifzwda/video/upload/v1773501815/GIF5_NEW_c8ocsj.webm",
  "https://res.cloudinary.com/dqnifzwda/image/upload/v1773785219/GIF12_zcuv10.webp",
];

const floatingBadges = [
  { icon: Sparkles, text: "AI-powered creative workflow", delay: "0s" },
  { icon: Check, text: "Top 1% video editors", delay: "0.15s" },
  { icon: Rocket, text: "Scale without retainers", delay: "0.3s" },
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

      <div className="container mx-auto px-6 relative z-10 max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Copy */}
          <div className="space-y-8">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[4.25rem] font-extrabold leading-[1.04] tracking-tight text-foreground">
              Stop Guessing.{" "}
              <span className="text-accent">Start Scaling.</span>
            </h1>

            <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-lg">
              AI automations and elite video editors working together to deliver
              ads that consistently grow your brand.
            </p>

            <div className="flex items-center gap-2 text-xs text-muted-foreground/60">
              <Check className="w-3.5 h-3.5 text-accent/60" />
              Pay per video. No retainers.
            </div>

            <Button
              size="lg"
              variant="cta"
              onClick={() => scrollToSection("booking")}
              className="text-base px-8 py-5 h-auto group relative overflow-hidden shimmer-button rounded-full"
            >
              <span className="relative z-10 flex items-center">
                Book a Call
                <span className="ml-3 w-9 h-9 rounded-full bg-accent-foreground/20 flex items-center justify-center group-hover:bg-accent-foreground/30 transition-colors">
                  <ArrowRight className="h-4 w-4" />
                </span>
              </span>
            </Button>
          </div>

          {/* Right: Floating badges */}
          <div className="hidden lg:flex flex-col items-end gap-5 pt-6">
            {floatingBadges.map((badge, i) => (
              <div
                key={i}
                className="floating-badge animate-slide-up"
                style={{ animationDelay: badge.delay }}
              >
                <badge.icon className="w-4 h-4 text-accent shrink-0" />
                <span className="text-sm text-muted-foreground">{badge.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Marquee */}
      <div className="relative w-screen left-1/2 -translate-x-1/2 mt-20 mb-8 marquee-wrapper">
        <div className="marquee-track flex gap-4">
          {doubled.map((src, i) => (
            <div
              key={i}
              className="flex-shrink-0 w-[240px] h-[340px] rounded-2xl overflow-hidden border border-border/20"
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
