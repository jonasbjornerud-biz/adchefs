import aiHiring from "@/assets/hiring.gif";
import editorDevelopment from "@/assets/mentoring.gif";
import creativeIntelligence from "@/assets/creative.gif";

const steps = [
  {
    num: "01",
    image: aiHiring,
    title: "AI-Powered Hiring",
    description: "Screens 200+ video editors weekly to recruit the top 1% talent.",
  },
  {
    num: "02",
    image: editorDevelopment,
    title: "Editor Development System",
    description: "Custom SOPs and QA processes built around your creative workflow to ensure consistent output.",
  },
  {
    num: "03",
    image: creativeIntelligence,
    title: "Deliver & Iterate",
    description: "Finished videos are delivered within days. Request revisions, approve finals, and keep your creative pipeline moving.",
  },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-28">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-xs uppercase tracking-[0.2em] text-accent mb-4 font-medium">Process</p>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground">How It Works</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <div
              key={index}
              className="group glass-card overflow-hidden animate-slide-up"
              style={{ animationDelay: `${index * 0.12}s` }}
            >
              <div className="relative h-56 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-card/90 z-10" />
                <div className="absolute top-4 left-4 z-20">
                  <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-muted/80 backdrop-blur-sm text-sm font-bold text-muted-foreground">
                    {step.num}
                  </span>
                </div>
                <img
                  src={step.image}
                  alt={step.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-2 text-foreground">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
