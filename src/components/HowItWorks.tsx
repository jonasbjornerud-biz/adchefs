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
    title: "Deliver & Iterate",
    description: "Finished videos are delivered within days. Request revisions, approve finals, and keep your creative pipeline moving.",
  },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-28" aria-labelledby="how-it-works-heading">
      <div className="container mx-auto px-6">
        {/* Section header */}
        <div className="text-center mb-6 animate-slide-up">
          <p className="section-label">Process</p>
          <h2 id="how-it-works-heading" className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-3">
            How It Works
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto text-sm leading-relaxed">
            Three steps to transform your creative production
          </p>
        </div>

        <div className="section-divider mb-16" aria-hidden="true" />

        {/* Cards — Glassmorphism (#3) */}
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <article
              key={index}
              className="group glass-card overflow-hidden animate-slide-up"
              style={{ animationDelay: `${index * 0.12}s` }}
            >
              {/* Image — UX #19: Reserve space to prevent layout shift */}
              <div className="relative aspect-[4/3] overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-card/90 z-10" aria-hidden="true" />
                <div className="absolute top-3 left-3 z-20 w-8 h-8 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/25">
                  <span className="text-xs font-bold text-primary-foreground">{index + 1}</span>
                </div>
                <img
                  src={step.image}
                  alt={step.title}
                  className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div className="p-5 pt-3">
                <h3 className="font-heading text-lg font-semibold mb-2 text-foreground">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
