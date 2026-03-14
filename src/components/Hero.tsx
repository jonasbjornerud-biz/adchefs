import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useState } from "react";
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

  return (
    <section className="hero-section relative min-h-screen flex items-center overflow-hidden">
      {/* CSS grain overlay */}
      <div className="hero-grain" />
      <div className="container mx-auto px-6 py-12 md:py-20 relative z-10">
        <div className="grid lg:grid-cols-[1fr_1.3fr] gap-8 lg:gap-16 items-center">
          {/* Left side - Content */}
          <div className="max-w-[540px] text-left animate-text-entrance">
            <div className="inline-flex items-center justify-center px-5 py-1.5 mb-6 rounded-full bg-[rgba(126,61,255,0.08)] backdrop-blur-md border border-[rgba(126,61,255,0.25)]">
              <span className="text-sm text-[#a0a0b8]">Blending AI automations with expert video editors</span>
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-white leading-[1.1]">
              We cook up <span className="text-[#7e3dff]">ads</span> that{" "}
              <span className="text-[#7e3dff]">scale</span> your brand
            </h1>
            <p className="text-lg md:text-xl mb-8 text-[#a0a0b8] leading-relaxed">
              Creative strategy, <span className="text-[#7e3dff]">AI insights</span>, and elite editors working
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
          <div className="relative h-[400px] md:h-[550px] lg:h-[650px] mt-2 lg:mt-0 animate-fade-in" style={{ animationDelay: '0.3s', animationFillMode: 'backwards' }}>
            {/* Bloom glow behind cards */}
            <div className="carousel-bloom" />
            <div className="stacked-carousel-container">
              {videoSources.map((videoSrc, i) => {
                let offset = i - centerIndex;
                
                if (offset > totalVideos / 2) {
                  offset -= totalVideos;
                } else if (offset < -totalVideos / 2) {
                  offset += totalVideos;
                }

                if (Math.abs(offset) > 3) {
                  return null;
                }

                const positions = [
                  { x: -240, y: 40, rotate: -10, z: -120, scale: 0.84 },
                  { x: -160, y: 22, rotate: -7, z: -80, scale: 0.9 },
                  { x: -80, y: 8, rotate: -3, z: -35, scale: 0.96 },
                  { x: 0, y: 0, rotate: 0, z: 0, scale: 1 },
                  { x: 80, y: 8, rotate: 3, z: -35, scale: 0.96 },
                  { x: 160, y: 22, rotate: 7, z: -80, scale: 0.9 },
                  { x: 240, y: 40, rotate: 10, z: -120, scale: 0.84 },
                ];

                const posIndex = Math.min(Math.max(offset + 3, 0), positions.length - 1);
                const pos = positions[posIndex];

                return (
                  <div
                    key={i}
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

            {/* Dot indicators */}
            <div className="absolute bottom-2 md:bottom-4 left-1/2 -translate-x-1/2 z-[200] flex gap-2">
              {videoSources.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCenterIndex(i)}
                  className={`rounded-full transition-all duration-300 ${
                    i === centerIndex
                      ? "w-6 h-2 bg-[#7e3dff]"
                      : "w-2 h-2 bg-white/25 hover:bg-white/40"
                  }`}
                  aria-label={`Go to video ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
