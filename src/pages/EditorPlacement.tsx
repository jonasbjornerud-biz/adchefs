import { ArrowLeft, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import ServiceHero from "@/components/service/ServiceHero";
import ServiceProcess from "@/components/service/ServiceProcess";
import ServiceIncludes from "@/components/service/ServiceIncludes";
import ServiceCTA from "@/components/service/ServiceCTA";
import EditorPlacementFAQ from "@/components/EditorPlacementFAQ";

const stages = [
  {
    title: "Vetted",
    body: "Hundreds in. One out. Skills tests, brand voice trials, paid trial edits. Only editors who can ship make it to your account.",
  },
  {
    title: "Trained",
    body: "Every editor goes through direct response training. Hook engineering, hold curves, sound design. The work gets sharper the longer they are with you.",
  },
  {
    title: "Embedded",
    body: "Your editor joins your Slack, your Notion, your brand folder. They work only on your account. I manage quality and performance behind the scenes.",
  },
];

const includes = [
  "Vetted direct response editor matched to your workflow",
  "Pay per delivered video, no retainer or minimum",
  "24 to 48 hour turnaround standard",
  "All editing software covered by AdChefs",
  "Replaced fast if it is not clicking",
  "Trained on direct response, not wedding cuts",
];

const EditorPlacement = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO
        title="Editor Placement for DTC Brands | AdChefs"
        description="A vetted direct response video editor embedded in your team. Pay per delivered video. No retainers, no minimums, 24–48h turnaround."
        path="/editor-placement"
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

        {/* Hero — service intro with signature graphic */}
        <ServiceHero
          eyebrow="EDITOR PLACEMENT"
          monoLine="THE VIDEO EDITING SERVICE"
          headlinePre="A dedicated editor,"
          headlineItalic="embedded"
          headlinePost=" in your team."
          body="A vetted direct response editor matched to your account. They live in your Slack, your Notion, and your brand folder. You pay per delivered video, never a retainer."
          fromLabel="FROM"
          fromValue="$100"
          fromUnit="/ DELIVERED VIDEO"
          monoNote="CREATIVE DIRECTION IS PRICED SEPARATELY ON THE CALL"
          ctaLabel="Book a 15 minute call"
          tagline="Built for brands that need consistent output, not a fresh six-figure agency contract."
          graphicKind="receipt"
        />

        {/* What's included */}
        <ServiceIncludes
          eyebrow="What's included"
          title="Everything that ships with the editor"
          items={includes}
        />

        {/* Pipeline / process */}
        <ServiceProcess
          eyebrow="How editors get to your account"
          title="Vetted, trained, embedded."
          steps={stages}
        />

        {/* FAQ */}
        <EditorPlacementFAQ />

        {/* Closing CTA */}
        <ServiceCTA
          title="Get an editor matched this week"
          body="Tell me about the brand and the pace you want. If it's a fit, your editor starts inside a few days."
          ctaLabel="Book a call"
        />
      </main>

      <Footer />
    </div>
  );
};

export default EditorPlacement;