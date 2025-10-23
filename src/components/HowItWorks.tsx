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
        
        {/* 3D Cards Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto" style={{ perspective: "2000px" }}>
          {steps.map((step, index) => (
            <div 
              key={index}
              className="group relative animate-slide-up"
              style={{ 
                animationDelay: `${index * 0.2}s`,
              }}
            >
              {/* 3D Card Container */}
              <div 
                className="relative h-[480px] rounded-2xl transition-all duration-500 ease-in-out
                  scale-95 group-hover:scale-105
                  shadow-[0_20px_50px_rgba(0,0,0,0.5)] 
                  group-hover:shadow-[0_30px_80px_rgba(168,85,247,0.6)]
                  transform-gpu"
                style={{
                  transformStyle: "preserve-3d",
                  transform: "rotateX(5deg) rotateY(-5deg)",
                }}
              >
                {/* Main Card Body */}
                <div className="relative h-full rounded-2xl overflow-hidden bg-neutral-950 border border-white/20 group-hover:border-purple-400/50 transition-all duration-500"
                  style={{
                    transform: "translateZ(0px)",
                  }}
                >
                  {/* Image Container - More Visible */}
                  <div className="relative h-64 overflow-hidden">
                    <img 
                      src={step.image} 
                      alt={step.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    {/* Lighter gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/60" />
                  </div>

                  {/* Content Area with Glass Effect */}
                  <div className="relative h-[216px] p-8 bg-gradient-to-br from-neutral-900/95 via-neutral-950/95 to-black/95 backdrop-blur-sm border-t border-white/10">
                    {/* Floating Number Badge */}
                    <div 
                      className="absolute -top-6 right-8 w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-purple-500/50 transition-all duration-300 group-hover:scale-110 group-hover:shadow-purple-500/70"
                      style={{
                        transform: "translateZ(30px)",
                      }}
                    >
                      {index + 1}
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-2xl md:text-3xl font-bold text-white leading-tight">
                        {step.title}
                      </h3>
                      <p className="text-gray-300 leading-relaxed text-base">
                        {step.description}
                      </p>
                    </div>
                  </div>

                  {/* Glossy shine overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                </div>

                {/* Animated shine effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none rounded-2xl overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
