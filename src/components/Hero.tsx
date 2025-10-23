import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { ParticleNetwork } from "./ParticleNetwork";
import gif1 from "@/assets/videos/GIF1.gif";
import gif2 from "@/assets/videos/GIF2.gif";
import gif3 from "@/assets/videos/GIF3.gif";
import gif4 from "@/assets/videos/GIF4.gif";
import gif5 from "@/assets/videos/GIF5.gif";
import gif6 from "@/assets/videos/GIF6.gif";
import gif7 from "@/assets/videos/GIF7.gif";
import gif8 from "@/assets/videos/GIF8.gif";

const Hero = () => {
  const totalVideos = 8;
  const videoGifs = [gif4, gif2, gif3, gif1, gif5, gif6, gif7, gif8];
  const [centerIndex, setCenterIndex] = useState(1); // Start at GIF2 (index 1), GIF4 on left

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handlePrevious = () => {
    setCenterIndex((prev) => (prev > 0 ? prev - 1 : totalVideos - 1));
  };

  const handleNext = () => {
    setCenterIndex((prev) => (prev < totalVideos - 1 ? prev + 1 : 0));
  };

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      <ParticleNetwork />
      <div className="container mx-auto px-6 py-32 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Content */}
          <div className="max-w-[700px] text-left animate-text-entrance">
            <div className="inline-flex items-center justify-center px-6 py-2 mb-6 rounded-full bg-accent/10 backdrop-blur-sm border border-accent/20">
              <span className="text-sm text-foreground/90">Blending AI automations with expert video editors</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-foreground">
              We cook up <span className="text-accent">ads</span> that{" "}
              <span className="text-accent">scale</span> your brand
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-muted-foreground">
              Creative strategy, <span className="text-accent">AI insights</span>, and elite editors working
              together to deliver videos that drive consistent growth.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 items-start">
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

          {/* Right side - Stacked Carousel */}
          <div className="hidden lg:block relative h-[600px] animate-fade-in" style={{ animationDelay: '0.3s', animationFillMode: 'backwards' }}>
            {/* Navigation Arrows */}
            <button
              onClick={handlePrevious}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-[200] w-12 h-12 rounded-full bg-card/80 backdrop-blur-sm border border-border flex items-center justify-center hover:bg-accent/20 hover:border-accent/60 transition-all duration-300 hover:shadow-lg hover:shadow-accent/30"
              aria-label="Previous video"
            >
              <ChevronLeft className="w-6 h-6 text-foreground" />
            </button>

            <button
              onClick={handleNext}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-[200] w-12 h-12 rounded-full bg-card/80 backdrop-blur-sm border border-border flex items-center justify-center hover:bg-accent/20 hover:border-accent/60 transition-all duration-300 hover:shadow-lg hover:shadow-accent/30"
              aria-label="Next video"
            >
              <ChevronRight className="w-6 h-6 text-foreground" />
            </button>

            <div className="stacked-carousel-container">
              {videoGifs.map((gif, i) => {
                let offset = i - centerIndex;
                
                // Wrap around logic for balanced distribution
                if (offset > totalVideos / 2) {
                  offset -= totalVideos;
                } else if (offset < -totalVideos / 2) {
                  offset += totalVideos;
                }

                // Hide items that are beyond the visible stack to avoid jitter
                if (Math.abs(offset) > 3) {
                  return null;
                }

                const positions = [
                  { x: -220, y: 40, rotate: -10, z: -120, scale: 0.86 },
                  { x: -150, y: 22, rotate: -7, z: -80, scale: 0.91 },
                  { x: -75, y: 8, rotate: -3, z: -35, scale: 0.96 },
                  { x: 0, y: 0, rotate: 0, z: 0, scale: 1 },
                  { x: 75, y: 8, rotate: 3, z: -35, scale: 0.96 },
                  { x: 150, y: 22, rotate: 7, z: -80, scale: 0.91 },
                  { x: 220, y: 40, rotate: 10, z: -120, scale: 0.86 },
                ];

                const posIndex = Math.min(Math.max(offset + 3, 0), positions.length - 1);
                const pos = positions[posIndex];

                return (
                  <div
                    key={gif as unknown as string}
                    className="stacked-carousel-item"
                    style={{
                      transform: `translate(${pos.x}px, ${pos.y}px) rotateY(${pos.rotate}deg) translateZ(${pos.z}px) scale(${pos.scale})`,
                      zIndex: i === centerIndex ? 100 : totalVideos - Math.abs(offset),
                    }}
                  >
                    <div className="aspect-[9/16] w-[210px] rounded-2xl border border-border backdrop-blur-sm overflow-hidden hover:border-accent/60 hover:shadow-lg hover:shadow-accent/30 transition-all duration-500 shadow-lg">
                      <img src={gif} alt={`Video ${i + 1}`} className="w-full h-full object-cover" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
