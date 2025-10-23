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
        <div className="text-center mb-16 animate-slide-up">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">How It Works</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Three simple steps to transform your creative production
          </p>
        </div>
        
        {/* 3D Cards Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto" style={{ perspective: "1800px" }}>
          {steps.map((step, index) => (
            <div 
              key={index}
              className="group animate-slide-up"
              style={{ 
                animationDelay: `${index * 0.15}s`,
              }}
            >
              {/* 3D Card */}
              <div 
                className="relative h-[380px] rounded-2xl overflow-hidden transition-all duration-500 ease-out
                  shadow-[0_20px_50px_rgba(0,0,0,0.5)]
                  group-hover:shadow-[0_30px_70px_rgba(168,85,247,0.6)]
                  transform-gpu"
                style={{
                  transformStyle: "preserve-3d",
                  transform: "translateY(30px) rotateX(8deg) scale(0.95)",
                  opacity: 0.85,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(0px) rotateX(0deg) scale(1)";
                  e.currentTarget.style.opacity = "1";
                  e.currentTarget.style.zIndex = "10";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(30px) rotateX(8deg) scale(0.95)";
                  e.currentTarget.style.opacity = "0.85";
                  e.currentTarget.style.zIndex = "auto";
                }}
              >
                {/* Background Image */}
                <div className="absolute inset-0">
                  <img 
                    src={step.image} 
                    alt={step.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-black/85" />
                </div>

                {/* Border & Glass Effect */}
                <div className="absolute inset-0 border border-white/20 group-hover:border-purple-400/60 rounded-2xl transition-all duration-500" />

                {/* Content */}
                <div className="relative h-full flex flex-col justify-end p-6">
                  {/* Number Badge */}
                  <div className="absolute top-6 right-6 w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center shadow-lg shadow-purple-500/50 transition-transform duration-300 group-hover:scale-110">
                    <span className="text-white font-bold text-xl drop-shadow-lg">
                      {index + 1}
                    </span>
                  </div>

                  {/* Text Content with Backdrop */}
                  <div className="space-y-3 backdrop-blur-sm bg-black/30 p-5 rounded-xl border border-white/10">
                    <h3 className="text-2xl font-bold text-white leading-tight drop-shadow-lg">
                      {step.title}
                    </h3>
                    <p className="text-base text-white/90 leading-relaxed drop-shadow-md font-medium">
                      {step.description}
                    </p>
                  </div>
                </div>

                {/* Glossy Shine on Hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                
                {/* Animated Shine Effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none overflow-hidden">
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
