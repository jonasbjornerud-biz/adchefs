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
    <section id="how-it-works" className="py-24 bg-secondary/30">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 animate-slide-up">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">How It Works</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Three simple steps to transform your creative production
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {steps.map((step, index) => (
            <div 
              key={index}
              className="group relative animate-slide-up"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="relative overflow-hidden rounded-2xl bg-card border border-border/50 transition-all duration-500 hover:border-accent/50 hover:shadow-2xl hover:shadow-accent/20 hover:-translate-y-2 transform perspective-1000">
                <div className="relative transform-gpu transition-transform duration-500 group-hover:rotateX-2 group-hover:rotateY-2">
                  <div className="relative h-64 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/80 z-10" />
                    <div className="absolute top-4 left-4 z-20 w-12 h-12 rounded-full bg-accent/90 backdrop-blur-sm border-2 border-accent/30 flex items-center justify-center shadow-lg shadow-accent/50">
                      <span className="text-xl font-bold text-accent-foreground">{index + 1}</span>
                    </div>
                    <img 
                      src={step.image} 
                      alt={step.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>
                  <div className="p-6 relative z-20">
                    <h3 className="text-2xl font-bold mb-3 bg-gradient-to-r from-foreground to-accent bg-clip-text text-transparent">
                      {step.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 transform translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
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
