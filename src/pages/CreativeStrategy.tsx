import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import ServiceIncludes from "@/components/service/ServiceIncludes";
import ServiceCTA from "@/components/service/ServiceCTA";
import CreativeStrategyLoop from "@/components/CreativeStrategyLoop";
import CreativeStrategyFAQ from "@/components/CreativeStrategyFAQ";
import CreativeStrategyHero from "@/components/CreativeStrategyHero";

const includes = [
  "Research, angles, and briefs built with an editing eye",
  "Weekly read on hook, hold, ROAS, CPA",
  "New creative batches shipped every week",
  "Produced videos included, not just strategy decks",
  "Dedicated editor placement included",
  "Live KPI dashboard, free",
  "One operator owning the creative number end to end",
];

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

        <CreativeStrategyHero />

        <ServiceIncludes
          eyebrow="What's included"
          title="Everything in Editor Placement, plus the strategy layer"
          items={includes}
        />

        <CreativeStrategyLoop />

        <CreativeStrategyFAQ />

        <ServiceCTA
          title="Ready to hand creative to one operator?"
          body="Pricing is built around your account on the call. Two to three brands max at a time."
          ctaLabel="Book a call"
        />
      </main>

      <Footer />
    </div>
  );
};

export default CreativeStrategy;