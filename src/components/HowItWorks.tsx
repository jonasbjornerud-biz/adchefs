import { useState } from "react";
import aiHiring from "@/assets/hiring.gif";
import editorDevelopment from "@/assets/mentoring.gif";
import creativeIntelligence from "@/assets/creative.gif";

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
  const [activeCard, setActiveCard] = useState(0);

  return (
    <section id="how-it-works" className="py-24 relative overflow-hidden">
      {/* Purple gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-neutral-900/60 via-purple-900/20 to-neutral-900/60" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-20 animate-slide-up">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">How It Works</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Three simple steps to transform your creative production
          </p>
        </div>
        
        {/* Stacked 3D Cards Container */}
        <div className="max-w-2xl mx-auto relative" style={{ perspective: "1500px", height: "550px" }}>
          {steps.map((step, index) => {
            const isActive = index === activeCard;
            const offset = index - activeCard;
            
            return (
              <div
                key={index}
                onClick={() => setActiveCard(index)}
                className="absolute inset-0 cursor-pointer transition-all duration-700 ease-out"
                style={{
                  zIndex: steps.length - Math.abs(offset),
                  transform: `
                    translateY(${offset * 40}px)
                    translateX(${offset * 30}px)
                    scale(${1 - Math.abs(offset) * 0.1})
                    rotateX(${offset * -3}deg)
                  `,
                  opacity: isActive ? 1 : 0.6,
                  pointerEvents: isActive ? 'auto' : 'auto',
                }}
              >
                {/* 3D Card */}
                <div 
                  className="relative h-full rounded-3xl overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.6)] transition-shadow duration-500"
                  style={{
                    boxShadow: isActive 
                      ? '0 30px 80px rgba(168,85,247,0.5), 0 0 0 1px rgba(255,255,255,0.1)'
                      : '0 20px 50px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.05)',
                  }}
                >
                  {/* Background Image */}
                  <div className="absolute inset-0">
                    <img 
                      src={step.image} 
                      alt={step.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/50 to-black/90" />
                  </div>

                  {/* Glassmorphic Content Panel */}
                  <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12">
                    {/* Number Badge */}
                    <div className="absolute top-8 right-8 w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center shadow-lg shadow-purple-500/50">
                      <span className="text-white font-bold text-2xl drop-shadow-lg">
                        {index + 1}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="space-y-4 backdrop-blur-sm bg-black/20 p-8 rounded-2xl border border-white/10">
                      <h3 className="text-3xl md:text-4xl font-bold text-white leading-tight drop-shadow-lg">
                        {step.title}
                      </h3>
                      <p className="text-lg text-white/90 leading-relaxed drop-shadow-md font-medium">
                        {step.description}
                      </p>
                    </div>
                  </div>

                  {/* Gloss Effect */}
                  {isActive && (
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent pointer-events-none" />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Navigation Dots */}
        <div className="flex justify-center gap-3 mt-12">
          {steps.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveCard(index)}
              className={`transition-all duration-300 rounded-full ${
                index === activeCard 
                  ? 'w-12 h-3 bg-purple-500' 
                  : 'w-3 h-3 bg-white/30 hover:bg-white/50'
              }`}
              aria-label={`View card ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
