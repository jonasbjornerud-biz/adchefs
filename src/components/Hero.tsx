import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useState } from "react";
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
  const videoGifs = [gif1, gif2, gif3, gif4, gif5, gif6, gif7, gif8];
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(3);

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

          {/* Right side - Stacked Carousel */}
          <div className="hidden lg:block relative h-[600px]">
            <div className="stacked-carousel-container">
              {videoGifs.map((gif, i) => {
                const centerIndex = hoveredIndex ?? 3;
                const offset = i - centerIndex;
                
                const positions = [
                  { x: -180, y: 40, rotate: -12, z: -100, scale: 0.85 },
                  { x: -120, y: 20, rotate: -8, z: -60, scale: 0.9 },
                  { x: -60, y: 5, rotate: -4, z: -30, scale: 0.95 },
                  { x: 0, y: 0, rotate: 0, z: 0, scale: 1 },
                  { x: 60, y: 5, rotate: 4, z: -30, scale: 0.95 },
                  { x: 120, y: 20, rotate: 8, z: -60, scale: 0.9 },
                  { x: 180, y: 40, rotate: 12, z: -100, scale: 0.85 },
                  { x: 240, y: 60, rotate: 16, z: -140, scale: 0.8 },
                ];
                
                const posIndex = Math.min(Math.max(offset + 3, 0), positions.length - 1);
                const pos = positions[posIndex];
                
                return (
                  <div
                    key={i}
                    className="stacked-carousel-item cursor-pointer"
                    onMouseEnter={() => setHoveredIndex(i)}
                    onMouseLeave={() => setHoveredIndex(3)}
                    style={{
                      transform: `translate(${pos.x}px, ${pos.y}px) rotateY(${pos.rotate}deg) translateZ(${pos.z}px) scale(${pos.scale})`,
                      zIndex: i === centerIndex ? 100 : totalVideos - Math.abs(offset),
                    }}
                  >
                    <div className="aspect-[9/16] w-[160px] rounded-2xl border border-white/20 backdrop-blur-sm overflow-hidden hover:border-accent/60 hover:shadow-[0_0_30px_rgba(168,85,247,0.5)] transition-all duration-500 shadow-[0_12px_40px_rgba(0,0,0,0.6)]">
                      <img 
                        src={gif} 
                        alt={`Video ${i + 1}`}
                        className="w-full h-full object-cover"
                      />
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
