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

/* ---------- Primitives ---------- */

const Mono = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <span className={`mono text-[10px] uppercase tracking-[0.18em] ${className}`}>{children}</span>
);

const Shell = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`mx-auto w-full max-w-[1120px] px-6 md:px-10 ${className}`}>{children}</div>
);

const PlaceholderFrame = ({
  caption,
  ratio = "16/9",
  className = "",
}: {
  caption: string;
  ratio?: string;
  className?: string;
}) => (
  <figure className={className}>
    <div
      className="relative w-full rounded-[4px] border border-foreground/10 overflow-hidden bg-background/40"
      style={{ aspectRatio: ratio }}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <Crosshair className="w-12 h-12 text-foreground/10" strokeWidth={0.5} />
      </div>
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-0 right-0 top-1/2 h-px bg-foreground/[0.05]" />
        <div className="absolute top-0 bottom-0 left-1/2 w-px bg-foreground/[0.05]" />
      </div>
      <div className="absolute top-2.5 left-2.5 w-2 h-2 border-l border-t border-foreground/20" />
      <div className="absolute top-2.5 right-2.5 w-2 h-2 border-r border-t border-foreground/20" />
      <div className="absolute bottom-2.5 left-2.5 w-2 h-2 border-l border-b border-foreground/20" />
      <div className="absolute bottom-2.5 right-2.5 w-2 h-2 border-r border-b border-foreground/20" />
      <div className="absolute top-2.5 right-3">
        <Mono className="text-muted-foreground/70">PLACEHOLDER</Mono>
      </div>
    </div>
    <figcaption className="mt-3 mono text-[9.5px] uppercase tracking-[0.18em] text-muted-foreground">
      {caption}
    </figcaption>
  </figure>
);

/* ---------- Top-only gradient (same background system as the lander hero) ---------- */

const TopGradient = () => (
  <div aria-hidden className="absolute inset-x-0 top-0 h-[900px] overflow-hidden pointer-events-none z-0">
    <HeroBackground />
    <div
      className="absolute inset-0 z-[1]"
      style={{
        background:
          "radial-gradient(ellipse at 80% 8%, hsl(var(--accent) / 0.32) 0%, transparent 55%), radial-gradient(ellipse at 10% 0%, hsl(var(--accent) / 0.18) 0%, transparent 50%)",
      }}
    />
    <div className="absolute inset-x-0 bottom-0 z-[2] h-72 bg-gradient-to-b from-transparent to-background" />
  </div>
);

/* ---------- Chapter ---------- */

type Chapter = {
  num: string;
  label: string;
  title: React.ReactNode;
  body: React.ReactNode;
  metrics: string[];
  imageCaption: string;
  imageRatio?: string;
  extra?: React.ReactNode;
};

const ChapterBlock = ({ ch, flip }: { ch: Chapter; flip: boolean }) => (
  <article className="grid grid-cols-1 md:grid-cols-12 gap-x-10 gap-y-8 py-16 md:py-24">
    {/* Left rail: number + label (sticky on desktop) */}
    <aside className="md:col-span-3 md:sticky md:top-28 self-start">
      <div className="flex md:block items-baseline gap-4">
        <span
          className="font-display leading-none tracking-[-0.04em] text-[56px] md:text-[88px]"
          style={{ color: "hsl(var(--accent-deep))" }}
        >
          {ch.num}
        </span>
        <Mono className="md:mt-4 block text-muted-foreground">{ch.label}</Mono>
      </div>
    </aside>

    {/* Right content */}
    <div className="md:col-span-9">
      <h2 className="font-display font-semibold text-[30px] md:text-[44px] leading-[1.05] tracking-[-0.025em] text-foreground max-w-[20ch]">
        {ch.title}
      </h2>

      <div
        className={`mt-10 grid grid-cols-1 md:grid-cols-12 gap-x-8 gap-y-8 ${
          flip ? "md:[&>figure]:order-first" : ""
        }`}
      >
        <div className="md:col-span-7 space-y-5 text-[16px] md:text-[17px] leading-[1.75] text-muted-foreground">
          {ch.body}
          {ch.extra}
          {ch.metrics.length > 0 && (
            <div className="pt-4 flex flex-wrap gap-x-8 gap-y-3">
              {ch.metrics.map((m) => (
                <div key={m} className="text-foreground/70">
                  <Mono>{m}</Mono>
                </div>
              ))}
            </div>
          )}
        </div>
        <PlaceholderFrame
          caption={ch.imageCaption}
          ratio={ch.imageRatio ?? "4/5"}
          className="md:col-span-5"
        />
      </div>
    </div>
  </article>
);

/* ---------- Page ---------- */

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
      imageRatio: "4/5",
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
      imageRatio: "4/5",
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
      imageRatio: "4/5",
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
        <div
          className="mt-2 border-l-2 pl-5 py-1"
          style={{ borderColor: "hsl(var(--accent-deep))" }}
        >
          <p className="text-[16px] md:text-[17px] leading-[1.7] text-foreground/85">
            <span className="font-medium text-foreground">
              So I built <em className="font-serif italic font-normal">AdChefs.</em>
            </span>{" "}
            One dedicated editor per brand, trained on performance, placed and managed by someone who has lived inside the work. No rotating freelancers. No retainer that bills whether anything ships or not.
          </p>
        </div>
      ),
      metrics: [],
      imageCaption: "BUILDING THE ADCHEFS SYSTEM",
      imageRatio: "4/5",
    },
  ];

  const credentials = [
    { value: "10", accent: "yrs", label: "EDITING FOR REVENUE" },
    { value: "7", accent: "yrs", label: "DIRECT RESPONSE" },
    { value: "10", accent: "", label: "EDITORS MANAGED" },
    { value: "9", accent: "fig", label: "BRAND LED" },
  ];

  return (
    <div className="relative min-h-screen bg-background text-foreground overflow-x-hidden">
      <TopGradient />

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

      <main className="relative z-10 pt-24 md:pt-32">
        {/* HERO */}
        <Shell>
          <section className="relative pb-16 md:pb-24">
            <a
              href="/"
              className="inline-flex items-center gap-2 mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground hover:text-foreground transition-colors mb-12"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to home
            </a>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-x-10 gap-y-12 items-end">
              <div className="md:col-span-7">
                <span
                  className="inline-block mono text-[10px] uppercase tracking-[0.22em] rounded-[4px] border px-2.5 py-1"
                  style={{
                    color: "hsl(var(--accent-deep))",
                    borderColor: "hsl(var(--accent-deep) / 0.4)",
                    background: "hsl(var(--accent) / 0.18)",
                  }}
                >
                  ABOUT THE FOUNDER
                </span>

                <h1 className="mt-7 font-display font-semibold text-[48px] sm:text-[64px] md:text-[80px] leading-[0.98] tracking-[-0.035em] text-foreground">
                  Editor, mentor,
                  <br />
                  <em className="font-serif italic font-normal">founder.</em>
                </h1>

                <p className="mt-8 text-[17px] md:text-[19px] leading-[1.6] text-muted-foreground max-w-[44ch]">
                  For ten years I have turned raw footage into measurable revenue for e-commerce brands around the world. Editing is the skill. Performance is the obsession.
                </p>

                {/* Founder row */}
                <div className="mt-10 flex items-center gap-4 flex-wrap">
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
                      <p className="text-[13px] font-medium text-foreground leading-tight">
                        Jonas Bjørnerud
                      </p>
                      <p
                        className="mt-0.5 mono text-[10px] uppercase tracking-[0.18em]"
                        style={{ color: "hsl(var(--accent-deep))" }}
                      >
                        FOUNDER · ADCHEFS
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Portrait placeholder */}
              <div className="md:col-span-5 md:pl-6">
                <PlaceholderFrame caption="PORTRAIT · ON SET" ratio="4/5" />
              </div>
            </div>
          </section>
        </Shell>

        {/* CREDENTIALS — full-width hairline strip */}
        <Shell>
          <section className="pb-20 md:pb-28">
            <div className="border-t border-b border-foreground/15 py-8 md:py-10 grid grid-cols-2 md:grid-cols-4 gap-y-8 md:gap-y-0 md:divide-x md:divide-foreground/10">
              {credentials.map((cell, i) => (
                <div key={cell.label} className={`${i === 0 ? "md:pl-0" : "md:pl-8"} md:pr-8`}>
                  <div className="font-display font-semibold text-[36px] md:text-[48px] leading-none tracking-[-0.03em] text-foreground">
                    {cell.value}
                    {cell.accent && (
                      <em className="font-serif italic font-normal text-muted-foreground ml-1.5 text-[24px] md:text-[28px]">
                        {cell.accent}
                      </em>
                    )}
                  </div>
                  <Mono className="mt-4 block text-muted-foreground">{cell.label}</Mono>
                </div>
              ))}
            </div>
          </section>
        </Shell>

        {/* STORY EYEBROW */}
        <Shell>
          <section className="pb-2">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-x-10 items-end border-b border-foreground/10 pb-6">
              <div className="md:col-span-3">
                <Mono className="text-muted-foreground">CHAPTERS · 01 — 04</Mono>
              </div>
              <div className="md:col-span-9">
                <h2 className="font-display font-semibold text-[26px] md:text-[34px] leading-[1.1] tracking-[-0.02em] text-foreground">
                  How it <em className="font-serif italic font-normal">started.</em>
                </h2>
              </div>
            </div>
          </section>
        </Shell>

        {/* STORY */}
        <Shell>
          <section>
            {chapters.map((c, i) => (
              <div key={c.num} className={i > 0 ? "border-t border-foreground/10" : ""}>
                <ScrollReveal>
                  <ChapterBlock ch={c} flip={i % 2 === 1} />
                </ScrollReveal>
              </div>
            ))}
          </section>
        </Shell>

        {/* CTA */}
        <Shell>
          <section className="py-24 md:py-32 border-t border-foreground/10">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-x-10 gap-y-8 items-end">
              <div className="md:col-span-8">
                <Mono className="text-muted-foreground">LET'S SEE IF WE'RE A FIT</Mono>
                <h2 className="mt-5 font-display font-semibold text-[36px] md:text-[56px] leading-[1.02] tracking-[-0.03em] max-w-[18ch]">
                  Want to see if AdChefs fits <em className="font-serif italic font-normal">your</em> brand?
                </h2>
                <p className="mt-6 text-[16px] md:text-[17px] leading-relaxed text-muted-foreground max-w-[52ch]">
                  I vet every brand before we start. If you spend north of €5k a month on ads and you need consistent creative output, book a call.
                </p>
              </div>
              <div className="md:col-span-4 md:text-right">
                <Button
                  onClick={goBooking}
                  size="lg"
                  variant="cta"
                  className="h-auto px-8 py-4 tracking-[0.01em] gap-[10px]"
                >
                  Book a call
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </section>
        </Shell>
      </main>

      <Footer />
    </div>
  );
};

export default About;
