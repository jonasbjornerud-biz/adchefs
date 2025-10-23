import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const Hero = () => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* UnicornStudio Background with overlay */}
      <div className="absolute inset-0 w-full h-full">
        <div 
          data-us-project="HAczCrp9KHzB4URilldv" 
          className="absolute inset-0 w-full h-full animate-subtle-float"
          style={{ pointerEvents: 'none' }}
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/40" />
      </div>
      <div className="container mx-auto px-6 py-32 relative z-10">
        <div className="max-w-[960px] mx-auto text-center animate-fade-in">
          <div className="inline-flex items-center justify-center px-6 py-2 mb-6 rounded-full bg-white/5 backdrop-blur-sm border border-white/10">
            <span className="text-sm text-white/90">Blending AI automations with expert video editors</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white text-glow">
            We cook up <span className="text-purple-highlight">ads</span> that <span className="text-purple-highlight">scale</span> your brand
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-white/80 max-w-2xl mx-auto text-glow">
            Creative strategy, <span className="text-purple-highlight">AI insights</span>, and elite editors working together to deliver videos that drive consistent growth.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg"
              variant="cta"
              onClick={() => scrollToSection("booking")}
              className="text-lg px-8 py-6 h-auto group relative overflow-hidden shimmer-button"
            >
              <span className="relative z-10 flex items-center">
                Book Call Now
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </Button>
          </div>
          <div className="mt-16 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">52%</div>
              <div className="text-white/80 text-sm">CPA Reduction</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">3500+</div>
              <div className="text-white/80 text-sm">Creatives Delivered</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">70%</div>
              <div className="text-white/80 text-sm">Faster Turnarounds</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
