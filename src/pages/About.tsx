import { ArrowLeft, ArrowRight, Crosshair } from "lucide-react";
import { Button } from "@/components/ui/button";
import Footer from "@/components/Footer";
import HeroBackground from "@/components/HeroBackground";
import ScrollReveal from "@/components/ScrollReveal";
import jonasPhoto from "@/assets/jonas.jpg";
import jonasSignature from "@/assets/jonas-signature.png";
import adchefsLogo from "@/assets/adchefs-logo-dark.png.asset.json";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "How it works", href: "/#how-it-works" },
  { label: "Pricing", href: "/#pricing" },
  { label: "FAQ", href: "/#faq" },
];

const goBooking = () => {
  window.location.href = "/#booking";
};

/* ------- small primitives ------- */

const Mono = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <span className={`mono text-[10px] uppercase tracking-[0.18em] ${className}`}>{children}</span>
);

const PlaceholderFrame = ({ caption }: { caption: string }) => (
  <div className="relative w-full aspect-[16/9] rounded-[4px] border border-foreground/10 overflow-hidden">
    {/* transparent — gradient shows through */}
    <div className="absolute inset-0 flex items-center justify-center">
      <Crosshair className="w-16 h-16 text-foreground/10" strokeWidth={0.5} />
    </div>
    {/* faint hairline cross */}
    <div className="absolute inset-0 pointer-events-none">
      <div className="absolute left-0 right-0 top-1/2 h-px bg-foreground/[0.06]" />
      <div className="absolute top-0 bottom-0 left-1/2 w-px bg-foreground/[0.06]" />
    </div>
    {/* corner ticks */}
    <div className="absolute top-3 left-3 w-2.5 h-2.5 border-l border-t border-foreground/15" />
    <div className="absolute top-3 right-3 w-2.5 h-2.5 border-r border-t border-foreground/15" />
    <div className="absolute bottom-3 left-3 w-2.5 h-2.5 border-l border-b border-foreground/15" />
    <div className="absolute bottom-3 right-3 w-2.5 h-2.5 border-r border-b border-foreground/15" />
    <div className="absolute bottom-3 left-1/2 -translate-x-1/2">
      <span className="inline-block mono text-[9.5px] uppercase tracking-[0.18em] rounded-[4px] border border-foreground/10 bg-background/60 backdrop-blur-sm text-muted-foreground px-2.5 py-1">
        {caption}
      </span>
    </div>
  </div>
);

/* ------- chapter ------- */

type Chapter = {
  num: string;
  label: string;
  title: React.ReactNode;
  body: React.ReactNode;
  metrics: string[];
  imageCaption: string;
  extra?: React.ReactNode;
};

const ChapterRow = ({ ch, last }: { ch: Chapter; last?: boolean }) => (
  <div className="relative pl-12 md:pl-20 pb-20 md:pb-28">
    {/* spine */}
    {!last && (
      <span
        aria-hidden
        className="absolute left-[14px] md:left-[22px] top-[64px] md:top-[72px] bottom-0 w-px bg-foreground/15"
      />
    )}
    {/* node */}
    <span
      aria-hidden
      className="absolute left-[10px] md:left-[18px] top-[14px] w-[9px] h-[9px] rounded-full bg-accent ring-4 ring-background/70"
    />
    {/* numeral + label sit on the spine */}
    <div className="flex items-baseline gap-4 md:gap-5">
      <span
        className="font-display leading-none tracking-[-0.03em] text-[44px] md:text-[56px]"
        style={{ color: "hsl(var(--accent-deep, var(--accent)))" }}
      >
        {ch.num}
      </span>
      <Mono className="text-muted-foreground">{ch.label}</Mono>
    </div>

    <h2 className="mt-5 font-display text-[28px] md:text-[40px] leading-[1.05] tracking-[-0.02em] text-foreground max-w-[640px]">
      {ch.title}
    </h2>

    <div className="mt-6 space-y-5 text-[16px] md:text-[17px] leading-[1.7] text-muted-foreground max-w-[640px]">
      {ch.body}
    </div>

    {ch.extra}

    {ch.metrics.length > 0 && (
      <div className="mt-8 flex flex-wrap gap-x-7 gap-y-2 max-w-[640px]">
        {ch.metrics.map((m) => (
          <Mono key={m} className="text-foreground/65">
            {m}
          </Mono>
        ))}
      </div>
    )}

    <div className="mt-10 max-w-[640px]">
      <PlaceholderFrame caption={ch.imageCaption} />
    </div>
  </div>
);

/* ------- page ------- */

const About = () => {
  const chapters: Chapter[] = [
    {
      num: "01",
      label: "THE BEGINNING",
      title: (
        <>
          It started at <em className="font-serif italic font-normal">four.</em>
        </>
      ),
      body: (
        <>
          <p>
            I picked up my first camera at four years old and never really put it down. But the camera was never the point. By twelve I was uploading to YouTube, and the thing that hooked me was not the editing. It was the analytics. Retention curves, watch time, click-through. I wanted to know exactly where people dropped off, and why.
          </p>
          <p>That instinct never left. It just found a better use case.</p>
        </>
      ),
      metrics: ["AGE 4 · FIRST CAMERA", "AGE 12 · FIRST UPLOAD"],
      imageCaption: "EARLY YOUTUBE ANALYTICS",
    },
    {
      num: "02",
      label: "THE PIVOT",
      title: (
        <>
          Then I found <em className="font-serif italic font-normal">DTC</em> ads.
        </>
      ),
      body: (
        <>
          <p>
            In 2020 I ran my first direct-response campaign, and the measurability hit me immediately. Every second of footage had a job. Every cut tied back to a number. I never edited blind again.
          </p>
          <p>This was the intersection I had been chasing. Creativity, judged by results.</p>
        </>
      ),
      metrics: ["2020 · FIRST DR CAMPAIGN"],
      imageCaption: "FIRST DIRECT-RESPONSE ADS",
    },
    {
      num: "03",
      label: "THE LEAP",
      title: (
        <>
          From freelance to leading a <em className="font-serif italic font-normal">team.</em>
        </>
      ),
      body: (
        <>
          <p>
            After two years freelancing I became lead editor for a nine-figure e-commerce brand. The job was not cutting videos. It was building a system that produced winners at volume, across languages and markets.
          </p>
          <p>
            That is where I learned what separates a good editor from one who actually moves a business. And I saw, from the inside, why most brands never get that reliably.
          </p>
        </>
      ),
      metrics: ["9 FIGURES · BRAND SCALE", "TEAM OF 10 · EDITORS LED"],
      imageCaption: "LEADING A REMOTE EDITING TEAM",
    },
    {
      num: "04",
      label: "THE PROBLEM",
      title: (
        <>
          The same problem, <em className="font-serif italic font-normal">everywhere.</em>
        </>
      ),
      body: (
        <p>
          Editors left. New ones came in. Offboarding, onboarding, retraining, babysitting. Every cycle cost the brand time and money. And almost none of those editors were ever taught the one thing that mattered: how to read the data behind the ad they just made.
        </p>
      ),
      extra: (
        <div className="mt-7 border-l-2 border-accent pl-5 max-w-[640px]">
          <p className="text-[16px] md:text-[17px] leading-[1.7] text-foreground/80">
            <span className="font-medium text-foreground">
              So I built <em className="font-serif italic font-normal">AdChefs.</em>
            </span>{" "}
            One dedicated editor per brand, trained on performance, placed and managed by someone who has lived inside the work. No rotating freelancers. No retainer that bills whether anything ships or not.
          </p>
        </div>
      ),
      metrics: [],
      imageCaption: "BUILDING THE ADCHEFS SYSTEM",
    },
  ];

  return (
    <div className="relative min-h-screen text-foreground overflow-x-hidden">
      {/* ONE continuous gradient wash across the entire page */}
      <div className="fixed inset-0 -z-10 bg-background" aria-hidden>
        <HeroBackground />
      </div>

      {/* Sticky nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/70 backdrop-blur-xl border-b border-foreground/10">
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
          <Button onClick={goBooking} variant="cta" size="sm">
            Book a call
          </Button>
        </div>
      </nav>

      <main className="relative pt-24 md:pt-32">
        {/* HERO */}
        <section className="pb-16 md:pb-24">
          <div className="mx-auto max-w-[760px] px-6">
            <a
              href="/"
              className="inline-flex items-center gap-2 mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground hover:text-foreground transition-colors mb-10"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to home
            </a>

            <span
              className="inline-block mono text-[10px] uppercase tracking-[0.18em] rounded-[4px] border px-2.5 py-1"
              style={{
                color: "hsl(var(--accent-deep, var(--accent)))",
                borderColor: "hsl(var(--accent))",
                background: "hsl(var(--accent) / 0.12)",
              }}
            >
              ABOUT THE FOUNDER
            </span>

            <h1 className="mt-6 font-display text-[44px] md:text-[68px] leading-[1.02] tracking-[-0.03em] text-foreground">
              Editor, mentor, <em className="font-serif italic font-normal">founder.</em>
            </h1>

            <p className="mt-7 text-[17px] md:text-[19px] leading-[1.65] text-muted-foreground max-w-[620px]">
              For ten years I have turned raw footage into measurable revenue for e-commerce brands around the world. Editing is the skill. Performance is the obsession.
            </p>

            {/* Founder row — quiet, inline */}
            <div className="mt-10 flex items-center gap-4">
              <div className="w-14 h-14 rounded-full overflow-hidden ring-1 ring-accent/70 flex-shrink-0">
                <img
                  src={jonasPhoto}
                  alt="Jonas Bjørnerud"
                  className="w-full h-full object-cover grayscale"
                />
              </div>
              <div className="flex items-end gap-3">
                <img
                  src={jonasSignature}
                  alt="Jonas Bjørnerud signature"
                  className="h-11 w-auto select-none pointer-events-none -mb-1"
                  draggable={false}
                />
                <div className="pb-1">
                  <p className="text-[13px] font-medium text-foreground leading-tight">Jonas Bjørnerud</p>
                  <p
                    className="mt-0.5 mono text-[10px] uppercase tracking-[0.18em]"
                    style={{ color: "hsl(var(--accent-deep, var(--accent)))" }}
                  >
                    FOUNDER · ADCHEFS
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CREDENTIAL STRIP — inline hairline row, no boxes */}
        <section className="pb-20 md:pb-28">
          <div className="mx-auto max-w-[760px] px-6">
            <div className="border-t border-b border-foreground/10 py-6 grid grid-cols-2 md:grid-cols-4 gap-y-6 md:gap-y-0 md:divide-x md:divide-foreground/10">
              {[
                { value: "10", accent: "yrs", label: "EDITING FOR REVENUE" },
                { value: "9", accent: "fig", label: "BRAND LED" },
                { value: "10", accent: "", label: "EDITORS MANAGED" },
                { value: "", accent: "Performance", label: "THE OBSESSION" },
              ].map((cell, i) => (
                <div key={cell.label} className={`${i > 0 ? "md:pl-5" : ""} ${i < 3 ? "md:pr-5" : ""}`}>
                  <div className="font-display text-[26px] md:text-[30px] leading-none tracking-[-0.02em] text-foreground">
                    {cell.value}
                    {cell.accent && (
                      <em className={`font-serif italic font-normal ${cell.value ? "ml-1" : ""}`}>
                        {cell.accent}
                      </em>
                    )}
                  </div>
                  <Mono className="mt-2.5 block text-muted-foreground">{cell.label}</Mono>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* STORY TIMELINE */}
        <section className="pb-12 md:pb-20">
          <div className="mx-auto max-w-[760px] px-6">
            {chapters.map((c, i) => (
              <ScrollReveal key={c.num}>
                <ChapterRow ch={c} last={i === chapters.length - 1} />
              </ScrollReveal>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="pb-24 md:pb-36">
          <div className="mx-auto max-w-[680px] px-6 text-center">
            <Mono className="text-muted-foreground">LET'S SEE IF WE'RE A FIT</Mono>
            <h2 className="mt-5 font-display text-[32px] md:text-[48px] leading-[1.05] tracking-[-0.02em]">
              Want to see if AdChefs fits <em className="font-serif italic font-normal">your</em> brand?
            </h2>
            <p className="mt-5 text-[15px] md:text-[16px] leading-relaxed text-muted-foreground max-w-xl mx-auto">
              I vet every brand before we start. If you spend north of €5k a month on ads and you need consistent creative output, book a call.
            </p>
            <Button
              onClick={goBooking}
              size="lg"
              variant="cta"
              className="mt-9 h-auto px-8 py-4 tracking-[0.01em] gap-[10px]"
            >
              Book a call
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default About;