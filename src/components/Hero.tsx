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
    <section className="hero-section relative h-screen flex items-center overflow-hidden">
      {/* CSS grain overlay */}
      <div className="hero-grain" />
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-[0.8fr_1.2fr] gap-8 lg:gap-12 items-center">
          {/* Left side - Content */}
          <div className="max-w-[480px] text-left animate-text-entrance">
            <div className="inline-flex items-center justify-center px-5 py-1.5 mb-6 rounded-full bg-[rgba(126,61,255,0.08)] backdrop-blur-md border border-[rgba(126,61,255,0.25)]">
              <span className="text-sm text-[#a0a0b8]">Blending AI automations with expert video editors</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-[4.2rem] font-bold mb-6 text-white leading-[1.08]">
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
          <div className="relative h-[420px] md:h-[560px] lg:h-[70vh] max-h-[720px] animate-fade-in" style={{ animationDelay: '0.3s', animationFillMode: 'backwards' }}>
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
                  { x: -260, y: 44, rotate: -11, z: -140, scale: 0.78 },
                  { x: -175, y: 26, rotate: -7, z: -90, scale: 0.85 },
                  { x: -88, y: 10, rotate: -3, z: -40, scale: 0.93 },
                  { x: 0, y: 0, rotate: 0, z: 0, scale: 1.05 },
                  { x: 88, y: 10, rotate: 3, z: -40, scale: 0.93 },
                  { x: 175, y: 26, rotate: 7, z: -90, scale: 0.85 },
                  { x: 260, y: 44, rotate: 11, z: -140, scale: 0.78 },
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
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
