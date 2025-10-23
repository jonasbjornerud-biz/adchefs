import { Sparkles, Users, Lightbulb } from "lucide-react";

const steps = [
  {
    icon: Users,
    title: "AI-Powered Hiring",
    description: "Screens 200+ video editors weekly to recruit the top 1% talent.",
  },
  {
    icon: Sparkles,
    title: "Editor Development System",
    description: "Custom SOPs and QA processes built around your creative workflow to ensure consistent output.",
  },
  {
    icon: Lightbulb,
    title: "Creative Intelligence Layer",
    description: "Ad frameworks and AI insights tailored to your brand to sharpen creative strategy and direction",
  },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-24 bg-neutral-900/40">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 animate-slide-up">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">How It Works</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Three simple steps to transform your creative production
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div 
                key={index}
                className="group relative animate-slide-up"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="relative overflow-hidden rounded-xl bg-background/40 backdrop-blur-xl border border-white/10 p-6 transition-all duration-300 hover:bg-background/60 hover:border-accent/50 hover:-translate-y-1">
                  {/* Icon and Title */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-accent" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground">
                      {step.title}
                    </h3>
                  </div>
                  
                  {/* Description */}
                  <p className="text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>

                  {/* Subtle glow effect on hover */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-xl bg-gradient-to-br from-accent/5 to-transparent" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
