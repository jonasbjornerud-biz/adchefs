import { ArrowLeft, ArrowRight, Crosshair } from "lucide-react";
import { Button } from "@/components/ui/button";
import Footer from "@/components/Footer";
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

const MonoLabel = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <span className={`font-mono text-[10px] uppercase tracking-[0.18em] ${className}`}>{children}</span>
);

const FramedImage = ({
  caption,
  dark = false,
  className = "",
}: {
  caption: string;
  dark?: boolean;
  className?: string;
}) => (
  <div
    className={`relative aspect-[4/3] w-full overflow-hidden rounded-[4px] border ${
      dark ? "border-white/10 bg-white/[0.03]" : "border-foreground/10 bg-[hsl(var(--surface))]"
    } ${className}`}
    aria-label={`Image placeholder: ${caption}`}
  >
    {/* faint compass / crosshair motif */}
    <div className="absolute inset-0 flex items-center justify-center">
      <Crosshair
        className={`w-24 h-24 ${dark ? "text-white/10" : "text-foreground/10"}`}
        strokeWidth={0.6}
      />
    </div>
    {/* corner ticks */}
    <div className={`absolute top-3 left-3 w-3 h-3 border-l border-t ${dark ? "border-white/20" : "border-foreground/15"}`} />
    <div className={`absolute top-3 right-3 w-3 h-3 border-r border-t ${dark ? "border-white/20" : "border-foreground/15"}`} />
    <div className={`absolute bottom-3 left-3 w-3 h-3 border-l border-b ${dark ? "border-white/20" : "border-foreground/15"}`} />
    <div className={`absolute bottom-3 right-3 w-3 h-3 border-r border-b ${dark ? "border-white/20" : "border-foreground/15"}`} />

    <div className="absolute bottom-4 left-4">
      <span
        className={`inline-block font-mono text-[10px] uppercase tracking-[0.18em] rounded-[4px] border px-2.5 py-1 ${
          dark
            ? "bg-[#1A1A1A]/80 border-white/15 text-white/70"
            : "bg-background/80 border-foreground/10 text-muted-foreground"
        }`}
      >
        {caption}
      </span>
    </div>
  </div>
);

const MetricChip = ({
  value,
  accent,
  label,
  dark = false,
}: {
  value: string;
  accent: string;
  label: string;
  dark?: boolean;
}) => (
  <div
    className={`inline-flex items-baseline gap-3 rounded-[4px] border px-3.5 py-2 ${
      dark ? "border-white/15 bg-white/[0.03]" : "border-foreground/10 bg-background"
    }`}
  >
    <span className={`font-display text-[18px] leading-none tracking-[-0.01em] ${dark ? "text-paper" : "text-foreground"}`}>
      {value}
      <em className="font-serif italic font-normal ml-0.5">{accent}</em>
    </span>
    <MonoLabel className={dark ? "text-white/50" : "text-muted-foreground"}>{label}</MonoLabel>
  </div>
);

/* ---------- Chapter component ---------- */

type Chapter = {
  num: string;
  label: string;
  title: React.ReactNode;
  body: React.ReactNode;
  chips: { value: string; accent: string; label: string }[];
  imageCaption: string;
  imageLeft: boolean;
  bg: "paper" | "surface" | "ink";
  extra?: React.ReactNode;
};

const ChapterBlock = ({ chapter }: { chapter: Chapter }) => {
  const dark = chapter.bg === "ink";
  const sectionBg =
    chapter.bg === "ink"
      ? "bg-[hsl(var(--ink))] text-paper"
      : chapter.bg === "surface"
      ? "bg-[hsl(var(--surface))]"
      : "bg-background";

  return (
    <section className={`py-20 md:py-28 ${sectionBg} ${chapter.bg !== "ink" ? "border-y border-foreground/5" : ""}`}>
      <div className="mx-auto max-w-[1100px] px-6">
        <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
          {/* Image */}
          <div className={`order-2 ${chapter.imageLeft ? "md:order-1" : "md:order-2"}`}>
            <FramedImage caption={chapter.imageCaption} dark={dark} />
          </div>
          {/* Text */}
          <div className={`order-1 ${chapter.imageLeft ? "md:order-2" : "md:order-1"}`}>
            <div className="flex items-center gap-4">
              <span
                className={`font-display text-[44px] md:text-[56px] leading-none tracking-[-0.03em] ${
                  dark ? "text-accent" : "text-accent"
                }`}
                style={{ color: "hsl(var(--accent))" }}
              >
                {chapter.num}
              </span>
              <MonoLabel className={dark ? "text-accent" : "text-muted-foreground"}>{chapter.label}</MonoLabel>
            </div>
            <h2
              className={`mt-5 font-display text-[28px] md:text-[40px] leading-[1.05] tracking-[-0.02em] ${
                dark ? "text-paper" : "text-foreground"
              }`}
            >
              {chapter.title}
            </h2>
            <div className={`mt-5 space-y-4 text-[15px] leading-relaxed ${dark ? "text-white/65" : "text-muted-foreground"}`}>
              {chapter.body}
            </div>
            {chapter.extra}
            <div className="mt-7 flex flex-wrap gap-2.5">
              {chapter.chips.map((c) => (
                <MetricChip key={c.label} value={c.value} accent={c.accent} label={c.label} dark={dark} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

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
      chips: [
        { value: "Age ", accent: "4", label: "FIRST CAMERA" },
        { value: "Age ", accent: "12", label: "FIRST UPLOAD" },
      ],
      imageCaption: "EARLY YOUTUBE ANALYTICS",
      imageLeft: true,
      bg: "paper",
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
      chips: [
        { value: "", accent: "2020", label: "FIRST DR CAMPAIGN" },
        { value: "0 ", accent: "blind", label: "CUTS SINCE" },
      ],
      imageCaption: "FIRST DIRECT-RESPONSE ADS",
      imageLeft: false,
      bg: "surface",
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
      chips: [
        { value: "9 ", accent: "figures", label: "BRAND SCALE" },
        { value: "Team of ", accent: "10", label: "EDITORS LED" },
        { value: "Multi ", accent: "market", label: "AT VOLUME" },
      ],
      imageCaption: "LEADING A REMOTE EDITING TEAM",
      imageLeft: true,
      bg: "paper",
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
          className="mt-6 rounded-[4px] border-l-2 border-accent bg-accent/10 px-5 py-4 text-[15px] leading-relaxed text-white/80"
        >
          <p>
            <span className="font-medium text-paper">
              So I built <em className="font-serif italic font-normal">AdChefs.</em>
            </span>{" "}
            One dedicated editor per brand, trained on performance, placed and managed by someone who has lived inside the work. No rotating freelancers. No retainer that bills whether anything ships or not.
          </p>
        </div>
      ),
      chips: [],
      imageCaption: "BUILDING THE ADCHEFS SYSTEM",
      imageLeft: false,
      bg: "ink",
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Sticky nav */}
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
          <Button onClick={goBooking} variant="cta" size="sm">
            Book a call
          </Button>
        </div>
      </nav>

      <main className="pt-24 md:pt-32">
        {/* HERO */}
        <section className="pb-14 md:pb-20">
          <div className="mx-auto max-w-[1100px] px-6">
            <a
              href="/"
              className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground hover:text-foreground transition-colors mb-10"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to home
            </a>

            <div className="grid md:grid-cols-[300px_1fr] gap-10 md:gap-16 items-start">
              {/* Portrait */}
              <div className="flex justify-start md:justify-center">
                <div className="relative">
                  <div className="w-[240px] h-[240px] md:w-[300px] md:h-[300px] rounded-full overflow-hidden border border-accent/70 bg-[hsl(var(--ink))]">
                    <img
                      src={jonasPhoto}
                      alt="Jonas Bjørnerud"
                      className="w-full h-full object-cover grayscale"
                    />
                  </div>
                  <p className="mt-4 text-center font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                    Jonas Bjørnerud
                  </p>
                </div>
              </div>

              {/* Content */}
              <div className="max-w-2xl">
                <span
                  className="inline-block font-mono text-[10px] uppercase tracking-[0.18em] rounded-[4px] border border-accent text-accent bg-accent/10 px-2.5 py-1"
                  style={{ color: "hsl(var(--accent-deep, var(--accent)))" }}
                >
                  ABOUT THE FOUNDER
                </span>
                <h1 className="mt-5 font-display text-[40px] md:text-[60px] leading-[1.02] tracking-[-0.03em] text-foreground">
                  Editor, mentor, <em className="font-serif italic font-normal">founder.</em>
                </h1>
                <p className="mt-6 text-[16px] md:text-[18px] text-muted-foreground leading-relaxed max-w-xl">
                  For ten years I have turned raw footage into measurable revenue for e-commerce brands around the world. Editing is the skill. Performance is the obsession.
                </p>
                <div className="mt-8 flex items-end gap-4">
                  <img
                    src={jonasSignature}
                    alt="Jonas Bjørnerud signature"
                    className="h-14 w-auto select-none pointer-events-none"
                    draggable={false}
                  />
                  <div className="pb-1">
                    <p className="text-[13px] font-medium text-foreground">Jonas Bjørnerud</p>
                    <p className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.18em] text-accent" style={{ color: "hsl(var(--accent-deep, var(--accent)))" }}>
                      FOUNDER · ADCHEFS
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Credential strip */}
            <div className="mt-14 md:mt-20 grid grid-cols-2 md:grid-cols-4 rounded-[4px] border border-foreground/10 overflow-hidden bg-background">
              {[
                { value: "10", accent: "yrs", label: "EDITING FOR REVENUE" },
                { value: "9", accent: "fig", label: "BRAND LED AS EDITOR" },
                { value: "10", accent: "", label: "EDITORS MANAGED" },
                { value: "1", accent: "obsession", label: "PERFORMANCE" },
              ].map((cell, i) => (
                <div
                  key={cell.label}
                  className={`p-6 md:p-7 ${i < 3 ? "md:border-r" : ""} ${i < 2 ? "border-r md:border-r" : ""} ${
                    i < 2 ? "border-b md:border-b-0" : ""
                  } border-foreground/10`}
                >
                  <div className="font-display text-[34px] md:text-[42px] leading-none tracking-[-0.03em] text-foreground">
                    {cell.value}
                    {cell.accent && (
                      <em className="font-serif italic font-normal ml-0.5">{cell.accent}</em>
                    )}
                  </div>
                  <MonoLabel className="mt-3 block text-muted-foreground">{cell.label}</MonoLabel>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* STORY TIMELINE */}
        {chapters.map((c) => (
          <ScrollReveal key={c.num}>
            <ChapterBlock chapter={c} />
          </ScrollReveal>
        ))}

        {/* CTA */}
        <section className="py-20 md:py-28 bg-background">
          <div className="mx-auto max-w-[800px] px-6 text-center">
            <MonoLabel className="text-muted-foreground">LET'S SEE IF WE'RE A FIT</MonoLabel>
            <h2 className="mt-5 font-display text-[32px] md:text-[48px] leading-[1.05] tracking-[-0.02em]">
              Want to see if AdChefs fits <em className="font-serif italic font-normal">your</em> brand?
            </h2>
            <p className="mt-5 text-[15px] md:text-[16px] text-muted-foreground leading-relaxed max-w-xl mx-auto">
              I vet every brand before we start. If you spend north of €5k a month on ads and you need consistent creative output, book a call.
            </p>
            <Button onClick={goBooking} size="lg" variant="cta" className="mt-9 h-auto px-8 py-4 tracking-[0.01em] gap-[10px]">
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