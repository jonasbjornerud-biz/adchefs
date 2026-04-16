const steps = [
  {
    number: "01",
    title: "We match you with a trained editor",
    description: "Based on your niche, volume, and creative style — we pair you with an editor who's already trained on performance metrics.",
  },
  {
    number: "02",
    title: "Editor is onboarded on your brand",
    description: "Your editor learns your products, brand voice, and KPI targets before producing a single video.",
  },
  {
    number: "03",
    title: "Videos delivered, tracked, and guaranteed",
    description: "You get performance-tracked videos with full visibility. If quality drops, request a free replacement.",
  },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-24 bg-white">
      <div className="container mx-auto px-6 max-w-5xl">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground mb-16 text-center">
          Simple by design.
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {steps.map((step) => (
            <div key={step.number} className="text-left">
              <span className="text-sm font-semibold text-muted-foreground/40 tracking-widest mb-3 block">
                {step.number}
              </span>
              <h3 className="text-lg font-bold text-foreground mb-3 leading-snug">
                {step.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
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
