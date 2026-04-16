import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const brands = ["Brand 1", "Brand 2", "Brand 3", "Brand 4", "Brand 5", "Brand 6", "Brand 7", "Brand 8"];

const Hero = () => {
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const doubled = [...brands, ...brands];

  return (
    <section className="relative bg-white pt-32 pb-20 overflow-hidden">
      <div className="container mx-auto px-6 text-center max-w-3xl">
        <div className="inline-flex items-center px-4 py-1.5 mb-8 rounded-full bg-secondary border border-border text-xs tracking-wide text-muted-foreground">
          Pay-Per-Video Editing for E-Commerce Brands
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-[1.08] tracking-tight mb-6 text-foreground">
          Your editors should understand what makes ads{" "}
          <span className="underline decoration-foreground/20 underline-offset-4">perform.</span>
        </h1>

        <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-xl mx-auto mb-8">
          We train editors on the metrics that matter — CTR, Hook Rate, Hold Rate — and give you full visibility into their output. You only pay for what gets delivered.
        </p>

        <Button
          size="lg"
          onClick={() => scrollToSection("book-a-call")}
          className="text-base px-8 py-5 h-auto group cursor-pointer rounded-xl transition-all duration-200 hover:shadow-lg"
        >
          Book a Free Call
          <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
        </Button>

        <p className="mt-8 text-sm text-muted-foreground/60">
          Trusted by e-commerce brands scaling on Meta and TikTok
        </p>
      </div>

      {/* Logo marquee */}
      <div className="relative w-screen left-1/2 -translate-x-1/2 mt-12 marquee-wrapper">
        <div className="marquee-track flex gap-12 items-center">
          {doubled.map((brand, i) => (
            <div
              key={i}
              className="flex-shrink-0 px-6 py-3 rounded-lg border border-border bg-secondary/50 text-sm text-muted-foreground font-medium"
            >
              [{brand}]
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
