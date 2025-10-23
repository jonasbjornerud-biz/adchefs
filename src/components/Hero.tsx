import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const Hero = () => {
  const totalVideos = 10;

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      <div className="container mx-auto px-6 py-32 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Content */}
          <div className="max-w-[700px] text-left animate-fade-in">
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

          {/* Right side - 3D Carousel */}
          <div className="hidden lg:block relative h-[600px]">
            <div className="carousel-3d-container">
              <div className="carousel-3d carousel-rotate">
                {[...Array(totalVideos)].map((_, i) => {
                  const angle = (360 / totalVideos) * i;
                  
                  return (
                    <div
                      key={i}
                      className="carousel-3d-item"
                      style={{
                        transform: `rotateY(${angle}deg) translateZ(350px)`,
                      }}
                    >
                      <div className="aspect-[9/16] w-[220px] bg-neutral-800/50 rounded-2xl border border-white/10 backdrop-blur-sm overflow-hidden hover:border-accent/50 transition-all duration-300">
                        {/* Placeholder for GIF - replace with actual GIF source */}
                        <div className="w-full h-full flex items-center justify-center text-white/60 text-sm flex-col gap-2">
                          <div className="text-xl font-bold">Video {i + 1}</div>
                          <div className="text-xs">1080x1920</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
