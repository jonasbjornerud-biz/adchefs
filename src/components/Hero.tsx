import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";

import VideoCard from "./VideoCard";

const videoSources = [
  "https://res.cloudinary.com/dqnifzwda/video/upload/v1773501822/GIF9_u1acww.webm",
  "https://res.cloudinary.com/dqnifzwda/video/upload/v1773501815/GIF2_wnilkz.webm",
  "https://res.cloudinary.com/dqnifzwda/video/upload/v1773501817/GIF10_mgrxbx.webm",
  "https://res.cloudinary.com/dqnifzwda/video/upload/v1773501820/GIF11_dfnd9x.webm",
  "https://res.cloudinary.com/dqnifzwda/video/upload/v1773501817/GIF10_mgrxbx.webm",
  "https://res.cloudinary.com/dqnifzwda/video/upload/v1773501815/GIF6_eycqkn.webm",
  "https://res.cloudinary.com/dqnifzwda/video/upload/v1773501815/GIF7_xrgax0.webm",
  "https://res.cloudinary.com/dqnifzwda/video/upload/v1773501815/GIF5_NEW_c8ocsj.webm",
];

const Hero = () => {
  const totalVideos = 8;
  const [centerIndex, setCenterIndex] = useState(0);


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
    <section className="hero-section relative min-h-screen flex items-center overflow-hidden">
      {/* CSS grain overlay */}
      <div className="hero-grain" />
      <div className="container mx-auto px-6 py-16 md:py-32 relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
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
          <div className="relative h-[350px] md:h-[500px] lg:h-[600px] mt-4 lg:mt-0 animate-fade-in" style={{ animationDelay: '0.3s', animationFillMode: 'backwards' }}>
            {/* Navigation Arrows */}
            <button
              onClick={handlePrevious}
              className="absolute left-0 md:left-0 top-1/2 -translate-y-1/2 z-[200] w-10 h-10 md:w-12 md:h-12 rounded-full bg-card/80 backdrop-blur-sm border border-border flex items-center justify-center hover:bg-accent/20 hover:border-accent/60 transition-all duration-300 hover:shadow-lg hover:shadow-accent/30"
              aria-label="Previous video"
            >
              <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-foreground" />
            </button>

            <button
              onClick={handleNext}
              className="absolute right-0 md:right-0 top-1/2 -translate-y-1/2 z-[200] w-10 h-10 md:w-12 md:h-12 rounded-full bg-card/80 backdrop-blur-sm border border-border flex items-center justify-center hover:bg-accent/20 hover:border-accent/60 transition-all duration-300 hover:shadow-lg hover:shadow-accent/30"
              aria-label="Next video"
            >
              <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-foreground" />
            </button>

            {/* Bloom glow behind cards */}
            <div className="carousel-bloom" />
            <div className="stacked-carousel-container">
              {videoSources.map((videoSrc, i) => {
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
                    key={videoSrc as unknown as string}
                    className="stacked-carousel-item"
                    style={{
                      transform: `translate(${pos.x}px, ${pos.y}px) rotateY(${pos.rotate}deg) translateZ(${pos.z}px) scale(${pos.scale})`,
                      zIndex: i === centerIndex ? 100 : totalVideos - Math.abs(offset),
                    }}
                  >
                    <VideoCard src={videoSrc} isCenter={i === centerIndex} />
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
