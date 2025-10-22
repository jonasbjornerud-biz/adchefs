import { useEffect, useRef, useState } from "react";
import aiHiring from "@/assets/ai-hiring.jpg";
import editorDevelopment from "@/assets/editor-development.jpg";
import creativeIntelligence from "@/assets/creative-intelligence.jpg";

const steps = [
  {
    image: aiHiring,
    title: "AI-Powered Hiring",
    description: "Screens 200+ video editors weekly to recruit the top 1% talent.",
  },
  {
    image: editorDevelopment,
    title: "Editor Development System",
    description: "Custom SOPs and QA processes built around your creative workflow to ensure consistent output.",
  },
  {
    image: creativeIntelligence,
    title: "Creative Intelligence Layer",
    description: "Ad frameworks and AI insights tailored to your brand to sharpen creative strategy and direction",
  },
];

const HowItWorks = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeCard, setActiveCard] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (isMobile) return;

    const handleScroll = () => {
      if (!sectionRef.current) return;

      const section = sectionRef.current;
      const rect = section.getBoundingClientRect();
      const sectionHeight = section.offsetHeight;
      const viewportHeight = window.innerHeight;
      
      // Calculate scroll progress through the section
      const scrollStart = rect.top;
      const scrollEnd = rect.bottom - viewportHeight;
      
      if (scrollStart < viewportHeight && scrollEnd > 0) {
        const progress = Math.max(0, Math.min(1, (viewportHeight - scrollStart) / (sectionHeight * 0.8)));
        setScrollProgress(progress);
        
        // Determine active card based on scroll progress
        const cardIndex = Math.min(steps.length - 1, Math.floor(progress * steps.length * 1.5));
        setActiveCard(cardIndex);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial check
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isMobile]);

  return (
    <section ref={sectionRef} id="how-it-works" className="py-24 bg-background/50 relative" style={{ minHeight: isMobile ? "auto" : "200vh" }}>
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 animate-slide-up">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">How It Works</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Three simple steps to transform your creative production
          </p>
        </div>
        
        {/* Desktop: Stacked Cards */}
        {!isMobile && (
          <div className="sticky top-20 max-w-4xl mx-auto" style={{ perspective: "2000px" }}>
            <div className="relative h-[600px]">
              {steps.map((step, index) => {
                const isActive = index <= activeCard;
                const offset = (activeCard - index) * 20;
                const scale = 1 - (activeCard - index) * 0.05;
                const rotateY = isActive ? Math.max(-15, -15 + (activeCard - index) * 5) : -15;
                const opacity = index === activeCard ? 1 : index < activeCard ? 0.4 : 0.7;
                const zIndex = steps.length - Math.abs(activeCard - index);
                
                return (
                  <div
                    key={index}
                    className="absolute inset-0 transition-all duration-700 ease-out"
                    style={{
                      transform: `
                        translateX(${offset}px) 
                        translateY(${offset}px) 
                        scale(${scale})
                        rotateY(${rotateY}deg)
                        rotateX(2deg)
                      `,
                      opacity,
                      zIndex,
                      transformStyle: "preserve-3d",
                    }}
                  >
                    <div className="relative h-full overflow-hidden rounded-2xl bg-card border border-border/50 shadow-2xl backdrop-blur-sm">
                      <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent" />
                      
                      {/* Image Container */}
                      <div className="relative h-80 overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/90 z-10" />
                        <img 
                          src={step.image} 
                          alt={step.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      {/* Content */}
                      <div className="p-8 relative z-20">
                        <div className="flex items-center gap-4 mb-4">
                          <span className="text-5xl font-bold text-accent/20">0{index + 1}</span>
                          <h3 className="text-3xl font-bold bg-gradient-to-r from-foreground to-accent bg-clip-text text-transparent">
                            {step.title}
                          </h3>
                        </div>
                        <p className="text-lg text-muted-foreground leading-relaxed">
                          {step.description}
                        </p>
                      </div>

                      {/* Accent Border */}
                      <div className="absolute inset-0 rounded-2xl border-2 border-accent/20 pointer-events-none" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Mobile: Vertical Stack */}
        {isMobile && (
          <div className="grid gap-8 max-w-lg mx-auto">
            {steps.map((step, index) => (
              <div 
                key={index}
                className="relative animate-slide-up"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="relative overflow-hidden rounded-2xl bg-card border border-border/50 shadow-xl">
                  {/* Image Container */}
                  <div className="relative h-64 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/80 z-10" />
                    <img 
                      src={step.image} 
                      alt={step.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {/* Content */}
                  <div className="p-6 relative z-20">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-3xl font-bold text-accent/20">0{index + 1}</span>
                      <h3 className="text-2xl font-bold bg-gradient-to-r from-foreground to-accent bg-clip-text text-transparent">
                        {step.title}
                      </h3>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default HowItWorks;
