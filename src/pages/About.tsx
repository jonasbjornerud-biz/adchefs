import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Footer from "@/components/Footer";
import jonasPhoto from "@/assets/jonas.jpg";
import jonasSignature from "@/assets/jonas-signature.png";
import adchefsLogo from "@/assets/adchefs-logo-dark.png.asset.json";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "How it works", href: "/#how-it-works" },
  { label: "Pricing", href: "/#pricing" },
  { label: "FAQ", href: "/#faq" },
];

const PlaceholderImage = ({ label, className = "" }: { label: string; className?: string }) => (
  <div
    className={`relative overflow-hidden rounded-[4px] border border-foreground/10 bg-secondary ${className}`}
    aria-label={`Image placeholder: ${label}`}
  >
    <img
      src="/placeholder.svg"
      alt={`${label} placeholder`}
      className="w-full h-full object-cover opacity-60"
    />
    <div className="absolute inset-0 flex items-center justify-center">
      <span className="mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground bg-background/80 px-3 py-1.5 rounded-[4px]">
        {label}
      </span>
    </div>
  </div>
);

const About = () => {
  const scrollToBooking = () => {
    window.location.href = "/#booking";
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Simple sticky nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/85 backdrop-blur-xl border-b border-foreground/10">
        <div className="mx-auto max-w-[1200px] px-6 h-16 md:h-20 flex items-center justify-between">
          <a href="/" className="flex items-center" aria-label="AdChefs">
            <img src={adchefsLogo.url} alt="AdChefs" className="h-8 md:h-10 w-auto" />
          </a>
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-[13px] text-foreground/70 hover:text-foreground transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>
          <Button onClick={scrollToBooking} variant="cta" size="sm">
            Book a call
          </Button>
        </div>
      </nav>

      <main className="pt-24 md:pt-32">
        {/* Hero */}
        <section className="pb-16 md:pb-24 border-b border-foreground/5">
          <div className="mx-auto max-w-[1100px] px-6">
            <a
              href="/"
              className="inline-flex items-center gap-2 text-[13px] text-muted-foreground hover:text-foreground transition-colors mb-8"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to home
            </a>

            <div className="grid md:grid-cols-[280px_1fr] gap-10 md:gap-16 items-start">
              <div className="flex justify-start md:justify-center">
                <div className="w-[220px] h-[220px] md:w-[280px] md:h-[280px] rounded-full overflow-hidden border-2 border-[#3B86A8]">
                  <img
                    src={jonasPhoto}
                    alt="Jonas Bjørnerud"
                    className="w-full h-full object-cover grayscale"
                  />
                </div>
              </div>

              <div className="max-w-2xl">
                <span className="eyebrow">ABOUT THE FOUNDER</span>
                <h1 className="mt-5 font-display text-[36px] md:text-[52px] leading-[1.05] tracking-[-0.03em] text-foreground">
                  Editor, mentor, <em>founder.</em>
                </h1>
                <p className="mt-6 text-[16px] md:text-[18px] text-muted-foreground leading-relaxed">
                  For the last ten years I've been turning raw footage into measurable revenue for e-commerce brands around the world. Editing is the skill. Performance is the obsession.
                </p>
                <div className="mt-7 flex items-end gap-4">
                  <img
                    src={jonasSignature}
                    alt="Jonas Bjørnerud signature"
                    className="h-14 w-auto select-none pointer-events-none"
                    draggable={false}
                  />
                  <div className="pb-1">
                    <p className="text-[13px] font-medium text-foreground">Jonas Bjørnerud</p>
                    <p className="mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground mt-0.5">Founder · AdChefs</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Story block 1 */}
        <section className="py-16 md:py-24">
          <div className="mx-auto max-w-[1100px] px-6">
            <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
              <div>
                <span className="mono text-[11px] uppercase tracking-[0.15em] text-muted-foreground">01 / THE BEGINNING</span>
                <h2 className="mt-4 font-display text-[28px] md:text-[36px] leading-[1.05] tracking-[-0.02em]">
                  It started with a <em>retention curve.</em>
                </h2>
                <div className="mt-5 space-y-4 text-[15px] text-muted-foreground leading-relaxed">
                  <p>
                    I was twelve when I uploaded my first YouTube video. What hooked me wasn't the editing itself. It was the analytics. Retention curves, engagement rates, click-through rates. I was already wired to measure things, already fascinated by what made someone stay and what made them leave.
                  </p>
                  <p>
                    That instinct never left. It just found a better use case.
                  </p>
                </div>
              </div>
              <PlaceholderImage label="Early YouTube analytics" className="aspect-[4/3]" />
            </div>
          </div>
        </section>

        {/* Story block 2 */}
        <section className="py-16 md:py-24 bg-secondary border-y border-foreground/5">
          <div className="mx-auto max-w-[1100px] px-6">
            <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
              <PlaceholderImage label="First direct-response ads" className="aspect-[4/3] md:order-1" />
              <div className="md:order-2">
                <span className="mono text-[11px] uppercase tracking-[0.15em] text-muted-foreground">02 / THE PIVOT</span>
                <h2 className="mt-4 font-display text-[28px] md:text-[36px] leading-[1.05] tracking-[-0.02em]">
                  Then I found <em>DTC ads.</em>
                </h2>
                <div className="mt-5 space-y-4 text-[15px] text-muted-foreground leading-relaxed">
                  <p>
                    In 2020 I joined a local business and ran my first direct-response ad campaign. The measurability hit me immediately. Every second of footage had a job. Every cut could be tied to a metric. I never went back to editing blind.
                  </p>
                  <p>
                    This was the intersection I'd been looking for. Creativity, but judged by numbers.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Story block 3 */}
        <section className="py-16 md:py-24">
          <div className="mx-auto max-w-[1100px] px-6">
            <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
              <div>
                <span className="mono text-[11px] uppercase tracking-[0.15em] text-muted-foreground">03 / THE LEAP</span>
                <h2 className="mt-4 font-display text-[28px] md:text-[36px] leading-[1.05] tracking-[-0.02em]">
                  From freelance to leading a <em>team of ten.</em>
                </h2>
                <div className="mt-5 space-y-4 text-[15px] text-muted-foreground leading-relaxed">
                  <p>
                    After two years freelancing, I became lead editor for a nine-figure e-commerce brand. My job wasn't just to cut videos. It was to build a system that produced winning ads at volume, across languages, across markets.
                  </p>
                  <p>
                    I learned what separates a good editor from one who can actually move a business. And I saw, from the inside, why most brands never get that reliably.
                  </p>
                </div>
              </div>
              <PlaceholderImage label="Leading a remote editing team" className="aspect-[4/3]" />
            </div>
          </div>
        </section>

        {/* Story block 4 */}
        <section className="py-16 md:py-32 bg-foreground text-background">
          <div className="mx-auto max-w-[1100px] px-6">
            <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
              <PlaceholderImage label="Building the AdChefs system" className="aspect-[4/3] md:order-1" />
              <div className="md:order-2">
                <span className="eyebrow" style={{ background: "transparent", borderColor: "hsl(var(--accent))", color: "hsl(var(--accent))" }}>
                  04 / THE PROBLEM
                </span>
                <h2 className="mt-5 font-display text-[28px] md:text-[36px] leading-[1.05] tracking-[-0.02em]">
                  The same problem, <em>on repeat.</em>
                </h2>
                <div className="mt-5 space-y-4 text-[15px] text-background/60 leading-relaxed">
                  <p>
                    Editors left. New editors came in. Offboarding, onboarding, re-training, babysitting. Every cycle cost the brand time and money.
                  </p>
                  <p>
                    And the editors themselves were never taught the thing that actually mattered: how to read the data behind the ad they just made.
                  </p>
                  <p>
                    So I built AdChefs. One dedicated editor per brand. Trained on performance. Managed by someone who has lived inside the work. No rotating freelancers. No retainers that bill whether anything ships or not.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Closing CTA */}
        <section className="py-16 md:py-24 border-t border-foreground/5">
          <div className="mx-auto max-w-[1100px] px-6 text-center">
            <h2 className="font-display text-[32px] md:text-[44px] leading-[1.05] tracking-[-0.02em]">
              Want to see if AdChefs fits <em>your</em> brand?
            </h2>
            <p className="mt-5 text-[15px] text-muted-foreground leading-relaxed max-w-xl mx-auto">
              I vet every brand before we start. If your ad spend is north of €5k per month and you need consistent creative output, book a call.
            </p>
            <Button onClick={scrollToBooking} size="lg" variant="cta" className="mt-8 h-auto px-8 py-4 tracking-[0.01em] gap-[10px]">
              Book a call
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default About;
