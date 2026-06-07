import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const mediaSources = [
  "https://res.cloudinary.com/dqnifzwda/video/upload/v1773501822/GIF9_u1acww.webm",
  "https://res.cloudinary.com/dqnifzwda/video/upload/v1773501817/GIF10_mgrxbx.webm",
  "https://res.cloudinary.com/dqnifzwda/image/upload/v1776562702/GIF15_or6gkv.gif",
  "https://res.cloudinary.com/dqnifzwda/video/upload/v1773501815/GIF5_NEW_c8ocsj.webm",
  "https://res.cloudinary.com/dqnifzwda/image/upload/v1773785219/GIF12_zcuv10.webp",
  "https://res.cloudinary.com/dqnifzwda/image/upload/v1776562209/GIF12_i0rqck.gif",
  "https://res.cloudinary.com/dqnifzwda/image/upload/v1776562215/GIF14_ajoqr7.gif",
  "https://res.cloudinary.com/dqnifzwda/image/upload/v1776562219/GIF13_lrfho3.gif",
];

const Hero = () => {
  const navigate = useNavigate();

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const doubled = [...mediaSources, ...mediaSources];

  return (
    <section className="relative pt-32 pb-12 sm:pt-40 sm:pb-16 overflow-hidden bg-background">
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
        <div className="max-w-[1200px] -ml-4">
          <span className="eyebrow">Built for e-com brands · Pay per video</span>

          <h1 className="mt-4 font-display text-[40px] sm:text-[56px] md:text-[68px] leading-[0.95] tracking-[-0.03em] text-foreground whitespace-nowrap">
            Your <em>dedicated</em> video editor<br />
            without the additional cost
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
            <span>From €100 / video</span>
            <span className="h-3 w-px bg-border" />
            <span>Cancel anytime</span>
          </div>
        </div>
      </div>

      {/* Recent work marquee */}
      <div className="relative mt-20 sm:mt-24">
        <div className="mx-auto max-w-[1200px] px-6 mb-6 flex items-end justify-between">
          <span className="eyebrow">Recent work</span>
          <span className="mono text-[11px] uppercase tracking-[0.15em] text-muted-foreground">
            Live cuts shipping for clients
          </span>
        </div>

        <div className="relative w-full overflow-hidden marquee-wrapper">
          <div className="absolute left-0 top-0 bottom-0 w-24 z-10 pointer-events-none bg-gradient-to-r from-background to-transparent" />
          <div className="absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none bg-gradient-to-l from-background to-transparent" />

          <div className="marquee-track flex gap-4">
            {doubled.map((src, i) => (
              <div
                key={i}
                className="flex-shrink-0 w-[170px] h-[240px] sm:w-[220px] sm:h-[310px] rounded-[4px] overflow-hidden border border-foreground/10 bg-secondary"
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

        <p className="text-center mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground/70 mt-6 px-4">
          Video editing only. Brand ownership belongs to respective clients.
        </p>
      </div>
    </section>
  );
};

export default Hero;
