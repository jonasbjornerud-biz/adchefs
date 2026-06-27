import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import ServiceHero from "@/components/service/ServiceHero";
import ServiceProcess from "@/components/service/ServiceProcess";
import ServiceIncludes from "@/components/service/ServiceIncludes";
import ServiceCTA from "@/components/service/ServiceCTA";

const steps = [
  {
    title: "Read the account",
    body: "I pull up your active ads and go through the data. Hook rate, hold curve, what is staying alive past three seconds and what is not.",
  },
  {
    title: "Build the angle",
    body: "From the winners, I figure out the pattern. Then I build the next angles from what is already converting in your account.",
  },
  {
    title: "Brief the editor",
    body: "The editor gets a proper brief. Hook, shot list, pacing, format. I have been in the timeline long enough to write briefs that translate into cuts.",
  },
  {
    title: "Ship and learn",
    body: "When it goes live, I track what moves. Every round gets a little tighter because we are building off proof, not guessing again from zero.",
  },
];

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

        <ServiceHero
          eyebrow="CREATIVE STRATEGY · OVERVIEW"
          monoLine="The full creative department"
          headlinePre="One operator owning the"
          headlineItalic="creative number"
          headlinePost="."
          body="Research, angles, briefs, produced videos, and the weekly read on what's actually moving. Built for 7 – 9 figure DTC brands that have outgrown ad-hoc freelancers and want creative run like a department, not a queue of tasks."
          fromLabel="FROM"
          fromValue="Custom"
          fromUnit="/ PRICED ON THE CALL"
          monoNote="Two to three brands at a time. Editor placement is included."
          ctaLabel="Book a 15 minute call"
          tagline="Built for operators who want one person on the hook for the creative number, not a deck and a Slack channel."
          graphicKind="brief"
        />

        <ServiceIncludes
          eyebrow="What's included"
          title="Everything in Editor Placement, plus the strategy layer"
          items={includes}
        />

        <ServiceProcess
          eyebrow="The process"
          title="How a week looks when I'm running creative."
          steps={steps}
        />

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