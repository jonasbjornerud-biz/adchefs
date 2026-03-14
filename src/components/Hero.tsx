import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useState } from "react";
import { ParticleNetwork } from "./ParticleNetwork";
import PhoneCard from "./PhoneCard";

const phones = [
  {
    src: "https://res.cloudinary.com/dqnifzwda/video/upload/v1773501815/GIF2_wnilkz.webm",
    floatDuration: 4.5,
    floatDelay: 0.3,
  },
  {
    src: "https://res.cloudinary.com/dqnifzwda/video/upload/v1773501822/GIF9_u1acww.webm",
    floatDuration: 3,
    floatDelay: 0,
  },
  {
    src: "https://res.cloudinary.com/dqnifzwda/video/upload/v1773501817/GIF10_mgrxbx.webm",
    floatDuration: 3.8,
    floatDelay: 0.6,
  },
];

const Hero = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
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

          {/* Right side - Floating Phones */}
          <div
            className="relative h-[400px] md:h-[500px] lg:h-[600px] mt-8 lg:mt-0 animate-fade-in"
            style={{ perspective: "1200px", animationDelay: "0.3s", animationFillMode: "backwards" }}
          >
            <div className="floating-phones-container">
              {phones.map((phone, i) => {
                const isCenter = i === 1;
                return (
                  <div
                    key={phone.src}
                    className={`floating-phone-slot floating-phone-slot-${i}`}
                    onMouseEnter={() => setHoveredIndex(i)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  >
                    <PhoneCard
                      src={phone.src}
                      isCenter={isCenter}
                      preload={isCenter ? "auto" : "metadata"}
                      floatDuration={phone.floatDuration}
                      floatDelay={phone.floatDelay}
                      isHoveredSibling={hoveredIndex !== null && hoveredIndex !== i}
                    />
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
