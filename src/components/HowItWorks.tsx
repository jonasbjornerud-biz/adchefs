import { Brain, Users, RefreshCw } from "lucide-react";

const steps = [
  {
    icon: Brain,
    title: "AI-Powered Hiring",
    description: "Screens 200+ video editors weekly to recruit the top 1% talent for your brand.",
  },
  {
    icon: Users,
    title: "Editor Mentoring System",
    description: "Custom SOPs and QA processes built around your creative workflow for consistent output.",
  },
  {
    icon: RefreshCw,
    title: "Delivery & Iterations",
    description: "Finished videos delivered within days. Request revisions, approve finals, repeat.",
  },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-28">
      <div className="container mx-auto px-6">
        <div className="text-center mb-6">
          <p className="text-xs uppercase tracking-[0.2em] text-accent mb-3 font-medium">Process</p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">How It Works</h2>
          <p className="text-muted-foreground max-w-md mx-auto text-sm">
            Three steps to transform your creative production
          </p>
        </div>

        <div className="section-divider mb-16" />

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <div
              key={index}
              className="group feature-card animate-slide-up"
              style={{ animationDelay: `${index * 0.12}s` }}
            >
              {/* Icon illustration area */}
              <div className="feature-card-illustration mb-6">
                <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center group-hover:bg-accent/15 transition-colors duration-300">
                  <step.icon className="w-6 h-6 text-accent" />
                </div>
              </div>

              <h3 className="text-lg font-semibold mb-2 text-foreground">{step.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
