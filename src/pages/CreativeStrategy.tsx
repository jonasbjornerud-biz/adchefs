import { ArrowLeft, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";

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
    body: "The editor gets a proper brief. Hook, shot list, pacing, format. I have been in the timeline long enough to write briefs that actually translate into cuts.",
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
        canonicalPath="/creative-strategy"
      />
      <Navigation />

      <main className="pt-32 pb-24">
        <div className="mx-auto max-w-[840px] px-6">
          <Link to="/" className="inline-flex items-center gap-2 mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-3 w-3" />
            Back to home
          </Link>

          <span className="mt-10 block mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            Scale · Full creative department
          </span>
          <h1 className="mt-4 font-display text-[40px] md:text-[64px] leading-[1.02] tracking-[-0.02em]">
            Creative <em className="font-serif italic">Strategy</em>
          </h1>
          <p className="mt-6 text-[17px] md:text-[19px] leading-relaxed text-muted-foreground max-w-[640px]">
            One operator owning the creative number. Built for 7 – 9 figure DTC brands that have outgrown ad-hoc freelancers and want creative run like a department, not a queue of tasks.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg" variant="cta" className="h-auto px-7 py-4 gap-[10px]">
              <Link to="/#booking">
                Book a call
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
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

          {/* Process */}
          <section className="mt-20">
            <span className="mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">The process</span>
            <h2 className="mt-3 font-display text-[28px] md:text-[36px] leading-tight tracking-[-0.02em]">
              How a week looks when I'm running creative
            </h2>
            <ol className="mt-10 space-y-10">
              {steps.map((s, i) => (
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
              Ready to hand creative to one operator?
            </h2>
            <p className="mt-4 text-[15px] text-muted-foreground max-w-[520px] mx-auto">
              Pricing is built around your account on the call. Two to three brands max at a time.
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

export default CreativeStrategy;