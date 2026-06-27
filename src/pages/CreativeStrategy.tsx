import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import CreativeStrategyLoop from "@/components/CreativeStrategyLoop";
import CSHero from "@/components/cs/CSHero";
import CSIncludes from "@/components/cs/CSIncludes";
import CSMath from "@/components/cs/CSMath";
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
        {/* Back link */}
        <div className="pt-28 pb-2" style={{ background: "#F7F6F3" }}>
          <div className="mx-auto max-w-[1240px] px-6">
            <Link
              to="/"
              className="inline-flex items-center gap-2 mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-3 w-3" />
              Back to home
            </Link>
          </div>
        </div>

        <CSHero />
        <CSIncludes />
        <CSMath />
        <CreativeStrategyLoop />
        <CSFinalCTA />
      </main>

      <Footer />
    </div>
  );
};

export default CreativeStrategy;