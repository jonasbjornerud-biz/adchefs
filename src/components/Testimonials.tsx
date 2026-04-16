const testimonials = [
  {
    name: "Sarah M.",
    brand: "Glow Skincare",
    quote: "Our editor understood our brand from day one. The turnaround is insane and every video feels like it was made in-house.",
  },
  {
    name: "James K.",
    brand: "Peak Athletics",
    quote: "We went from guessing on creative to having an editor who actually understands what CTR means. Night and day difference.",
  },
  {
    name: "Lina R.",
    brand: "Casa Home",
    quote: "The performance dashboard alone is worth it. We can see exactly which videos are working and why. Plus, the free replacement guarantee removes all risk.",
  },
];

const Testimonials = () => {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6 max-w-5xl">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground mb-16 text-center">
          What clients say
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="border border-border rounded-2xl p-6 bg-secondary/30 transition-all duration-200 hover:border-foreground/10 hover:shadow-sm"
            >
              <p className="text-sm text-muted-foreground leading-relaxed mb-6 italic">
                "{t.quote}"
              </p>
              <div>
                <p className="text-sm font-semibold text-foreground">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.brand}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
