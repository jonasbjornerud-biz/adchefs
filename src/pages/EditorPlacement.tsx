import { ArrowLeft, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";

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
        canonicalPath="/editor-placement"
      />
      <Navigation />

      <main className="pt-32 pb-24">
        <div className="mx-auto max-w-[840px] px-6">
          <Link to="/" className="inline-flex items-center gap-2 mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-3 w-3" />
            Back to home
          </Link>

          <span className="mt-10 block mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            Entry · Start here
          </span>
          <h1 className="mt-4 font-display text-[40px] md:text-[64px] leading-[1.02] tracking-[-0.02em]">
            Editor <em className="font-serif italic">Placement</em>
          </h1>
          <p className="mt-6 text-[17px] md:text-[19px] leading-relaxed text-muted-foreground max-w-[640px]">
            A dedicated direct response editor, embedded in your team. Pay per delivered video. No retainers, no minimums, no rotating freelancers.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-6">
            <Button asChild size="lg" variant="cta" className="h-auto px-7 py-4 gap-[10px]">
              <Link to="/#booking">
                Book a call
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <div className="font-display text-[34px] leading-none tracking-[-0.02em]">$100</div>
              <div className="mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground mt-1">Per delivered video</div>
            </div>
          </div>

          {/* What's included */}
          <section className="mt-20">
            <span className="mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">What's included</span>
            <ul className="mt-6 grid sm:grid-cols-2 gap-x-8 gap-y-3">
              {includes.map((item) => (
                <li key={item} className="flex gap-3 text-[15px] leading-snug">
                  <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[#9ED8F5] shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Pipeline */}
          <section className="mt-20">
            <span className="mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">How editors get to your account</span>
            <h2 className="mt-3 font-display text-[28px] md:text-[36px] leading-tight tracking-[-0.02em]">
              Vetted, trained, embedded
            </h2>
            <ol className="mt-10 space-y-10">
              {stages.map((s, i) => (
                <li key={s.title} className="grid grid-cols-[auto_1fr] gap-6 md:gap-10">
                  <span className="mono text-[12px] tracking-[0.18em] text-[#9ED8F5] pt-1">0{i + 1}</span>
                  <div>
                    <h3 className="font-display text-[22px] md:text-[26px] leading-tight tracking-[-0.01em]">{s.title}</h3>
                    <p className="mt-3 text-[15px] md:text-[16px] leading-relaxed text-muted-foreground">{s.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          {/* CTA */}
          <section className="mt-24 rounded-[6px] border border-foreground/10 p-8 md:p-12 text-center">
            <h2 className="font-display text-[28px] md:text-[36px] leading-tight tracking-[-0.02em]">
              Get an editor matched this week
            </h2>
            <p className="mt-4 text-[15px] text-muted-foreground max-w-[520px] mx-auto">
              Tell me about the brand and the pace you want. If it's a fit, your editor starts inside a few days.
            </p>
            <div className="mt-7">
              <Button asChild size="lg" variant="cta" className="h-auto px-7 py-4 gap-[10px]">
                <Link to="/#booking">
                  Book a call
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default EditorPlacement;