import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useState } from "react";

const Hero = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    loop: true, 
    align: "start",
    skipSnaps: false,
    dragFree: false
  });
  const [prevBtnEnabled, setPrevBtnEnabled] = useState(false);
  const [nextBtnEnabled, setNextBtnEnabled] = useState(false);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setPrevBtnEnabled(emblaApi.canScrollPrev());
    setNextBtnEnabled(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden py-32">
      <div className="container mx-auto px-6 relative z-10">
        {/* Content */}
        <div className="max-w-[800px] text-left animate-fade-in mb-16">
          <div className="inline-flex items-center justify-center px-6 py-2 mb-6 rounded-full bg-white/5 backdrop-blur-sm border border-white/10">
            <span className="text-sm text-white/90">Blending AI automations with expert video editors</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white text-glow">
            We cook up <span className="text-purple-highlight">ads</span> that <span className="text-purple-highlight">scale</span> your brand
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-white/80 text-glow">
            Creative strategy, <span className="text-purple-highlight">AI insights</span>, and elite editors working together to deliver videos that drive consistent growth.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 items-start mb-12">
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
          <div className="grid grid-cols-3 gap-8 max-w-xl">
            <div className="text-left">
              <div className="text-4xl font-bold text-white mb-2">52%</div>
              <div className="text-white/80 text-sm">CPA Reduction</div>
            </div>
            <div className="text-left">
              <div className="text-4xl font-bold text-white mb-2">3500+</div>
              <div className="text-white/80 text-sm">Creatives Delivered</div>
            </div>
            <div className="text-left">
              <div className="text-4xl font-bold text-white mb-2">70%</div>
              <div className="text-white/80 text-sm">Faster Turnarounds</div>
            </div>
          </div>
        </div>

        {/* Video Carousel */}
        <div className="relative animate-fade-in">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex gap-6">
              {[...Array(10)].map((_, i) => (
                <div
                  key={i}
                  className="flex-[0_0_auto] w-[280px] md:w-[320px]"
                >
                  <div className="aspect-[9/16] bg-neutral-800/50 rounded-2xl border border-white/10 backdrop-blur-sm overflow-hidden hover:border-accent/50 transition-all duration-300 hover:scale-105 cursor-pointer">
                    {/* Placeholder for GIF - replace with actual GIF source */}
                    <div className="w-full h-full flex items-center justify-center text-white/40 text-sm flex-col gap-2">
                      <div className="text-2xl font-bold">Video {i + 1}</div>
                      <div>1080x1920</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Carousel Navigation */}
          <button
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center hover:bg-white/20 transition-all disabled:opacity-30 disabled:cursor-not-allowed z-10"
            onClick={scrollPrev}
            disabled={!prevBtnEnabled}
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>
          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center hover:bg-white/20 transition-all disabled:opacity-30 disabled:cursor-not-allowed z-10"
            onClick={scrollNext}
            disabled={!nextBtnEnabled}
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
