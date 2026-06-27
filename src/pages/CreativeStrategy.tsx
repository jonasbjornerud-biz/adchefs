import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import CreativeStrategyLoop from "@/components/CreativeStrategyLoop";
import CSHero from "@/components/cs/CSHero";
import CSIncludes from "@/components/cs/CSIncludes";
import CSFinalCTA from "@/components/cs/CSFinalCTA";

const CreativeStrategy = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO
        title="Creative Strategy for DTC Brands | AdChefs"
        description="One operator owning the creative number end to end. Research, angles, briefs, and produced videos shipped weekly for 7–9 figure DTC brands."
        path="/creative-strategy"
      />
      <Navigation />

      <main>
        <CSHero />
        <CSIncludes />
        <CreativeStrategyLoop />
        <CSFinalCTA />
      </main>

      <Footer />
    </div>
  );
};

export default CreativeStrategy;