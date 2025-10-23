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
                className="relative h-[420px] rounded-2xl transition-all duration-500 ease-in-out transform-gpu
                  opacity-80 group-hover:opacity-100
                  scale-95 group-hover:scale-105
                  -rotate-y-6 group-hover:rotate-y-0
                  translate-y-4 group-hover:translate-y-0
                  shadow-[0_8px_30px_rgb(0,0,0,0.4)] 
                  group-hover:shadow-[0_20px_60px_rgba(168,85,247,0.4)]"
                style={{
                  transformStyle: "preserve-3d",
                }}
              >
                {/* Background Image Layer */}
                <div className="absolute inset-0 rounded-2xl overflow-hidden">
                  <img 
                    src={step.image} 
                    alt={step.title}
                    className="w-full h-full object-cover opacity-30 group-hover:opacity-40 transition-opacity duration-500 group-hover:scale-110 transform"
                  />
                  {/* Dark overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/80 to-black/90" />
                </div>

                {/* Glassmorphic Overlay */}
                <div className="absolute inset-0 rounded-2xl backdrop-blur-sm bg-gradient-to-br from-white/5 to-white/0 border border-white/10 group-hover:border-purple-400/30 transition-all duration-500" />

                {/* Content */}
                <div className="relative h-full flex flex-col justify-end p-8 z-20">
                  {/* Glowing badge number */}
                  <div className="absolute top-6 right-6 w-12 h-12 rounded-full bg-purple-500/20 backdrop-blur-md border border-purple-400/30 flex items-center justify-center text-purple-300 font-bold text-lg group-hover:scale-110 transition-transform duration-300">
                    {index + 1}
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-2xl md:text-3xl font-bold text-white leading-tight transform transition-transform duration-300 group-hover:translate-x-1">
                      {step.title}
                    </h3>
                    <p className="text-gray-300 leading-relaxed text-base transform transition-all duration-300 group-hover:translate-x-1">
                      {step.description}
                    </p>
                  </div>
                </div>

                {/* Shine effect on hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none rounded-2xl overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
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
