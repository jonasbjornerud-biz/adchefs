import { Zap, Users, Rocket } from "lucide-react";

const steps = [
  {
    icon: Zap,
    title: "AI-Powered Automation",
    description: "Our proprietary AI systems analyze your brand, products, and audience to generate creative briefs and automate repetitive editing tasks.",
  },
  {
    icon: Users,
    title: "Elite Editor Teams",
    description: "Vetted professional editors refine and polish your content, ensuring brand consistency and high-quality output that converts.",
  },
  {
    icon: Rocket,
    title: "Scale & Deploy",
    description: "Receive polished, platform-optimized video content ready to launch across all your marketing channels in record time.",
  },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-24 bg-background/50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 animate-slide-up">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">How It Works</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Three simple steps to transform your creative production
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto">
          {steps.map((step, index) => (
            <div 
              key={index}
              className="text-center animate-slide-up"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="mb-6 inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-accent/10">
                <step.icon className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-2xl font-bold mb-4">{step.title}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
