import { Button } from "@/components/ui/button";
import { ArrowRight, Check } from "lucide-react";

const scrollToBooking = () => {
  const el = document.getElementById("booking");
  if (el) el.scrollIntoView({ behavior: "smooth" });
};

type CardProps = {
  eyebrow: string;
  title: string;
  serifWord: string;
  tagline: string;
  price: string;
  priceNote: string;
  bullets: string[];
  bulletsHeader: string;
  variant: "light" | "dark";
  cta: string;
};

const Card = ({
  eyebrow,
  title,
  serifWord,
  tagline,
  price,
  priceNote,
  bullets,
  bulletsHeader,
  variant,
  cta,
}: CardProps) => {
  const popular = variant === "light";

  return (
    <div className="relative h-full">
      {popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20">
          <span className="rounded-full bg-[#F7F6F3] px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-[#1A1A1A] shadow-[0_6px_20px_rgba(26,26,26,0.18)]">
            Most Popular
          </span>
        </div>
      )}

      <div
        className="relative flex flex-col h-full text-center rounded-[24px] p-8 md:p-12 text-[#1A1A1A] overflow-hidden
          bg-white/30 backdrop-blur-2xl
          ring-1 ring-white/60
          shadow-[inset_0_1px_0_rgba(255,255,255,0.7),0_30px_80px_-20px_rgba(26,26,26,0.25)]
          transition-all duration-500 hover:-translate-y-1 hover:bg-white/35"
      >
        {/* glossy top sheen */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-white/50 to-transparent"
          aria-hidden
        />

        {/* title block */}
        <h3 className="relative mt-2 font-serif italic font-normal text-[44px] md:text-[56px] leading-[1.0] tracking-[-0.01em] text-[#1A1A1A]">
          {serifWord}
        </h3>
        <p className="relative mt-4 text-[15px] md:text-[16px] leading-snug text-[#1A1A1A]/85 max-w-[34ch] mx-auto">
          {tagline}
        </p>
        <p className="relative mt-2 font-mono text-[10px] uppercase tracking-[0.2em] text-[#1A1A1A]/55">
          {eyebrow}
        </p>

        {/* price */}
        <div className="relative mt-10">
          <div className="font-display text-[56px] md:text-[72px] leading-none tracking-[-0.02em] text-[#1A1A1A]">
            {price}
          </div>
          <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.2em] text-[#1A1A1A]/55">
            {priceNote}
          </p>
        </div>

        {/* CTA */}
        <div className="relative mt-8">
          <Button
            size="lg"
            onClick={scrollToBooking}
            className="h-auto rounded-full bg-[#F7F6F3]/95 text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-[#F7F6F3] px-7 py-3 gap-[10px] shadow-[0_8px_24px_-8px_rgba(26,26,26,0.3)] transition-colors"
          >
            {cta}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>

        {/* bullets */}
        <div className="relative mt-10 text-left">
          <p className="text-[14px] font-medium text-[#1A1A1A]">{bulletsHeader}</p>
          <ul className="mt-5 space-y-3.5">
            {bullets.map((item, i) => (
              <li
                key={i}
                className="flex items-start gap-3 text-[14px] md:text-[15px] leading-snug text-[#1A1A1A]/90"
              >
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#1A1A1A]" strokeWidth={2.5} />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

const TwoWaysToWork = () => {
  return (
    <section
      className="relative py-24 sm:py-36 overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg, #C9E8F7 0%, #9ED8F5 45%, #BDE4F8 100%)",
      }}
    >
      {/* soft cloud layers — pure CSS, no images */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse 700px 180px at 12% 22%, rgba(255,255,255,0.85), transparent 60%), radial-gradient(ellipse 520px 150px at 88% 18%, rgba(255,255,255,0.75), transparent 65%), radial-gradient(ellipse 620px 200px at 80% 78%, rgba(255,255,255,0.7), transparent 60%), radial-gradient(ellipse 480px 160px at 8% 85%, rgba(255,255,255,0.6), transparent 65%), radial-gradient(ellipse 380px 120px at 50% 50%, rgba(255,255,255,0.35), transparent 70%)",
        }}
      />

      {/* top + bottom paper fades to blend with neighboring sections */}
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#F7F6F3] to-transparent pointer-events-none" aria-hidden />
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#F7F6F3]/60 to-transparent pointer-events-none" aria-hidden />

      <div className="relative mx-auto max-w-[1120px] px-6">
        {/* section header — Air style: centered, serif italic on key word */}
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="font-display text-[40px] md:text-[64px] leading-[1.02] tracking-[-0.02em] text-[#1A1A1A]">
            Two ways I work with{" "}
            <em className="font-serif italic font-normal">brands</em>
          </h2>
          <p className="mt-5 text-[16px] md:text-[18px] leading-relaxed text-[#1A1A1A]/75">
            Most brands start with an editor then loop me in on creative strategy.
          </p>
        </div>

        {/* cards */}
        <div className="mt-16 md:mt-24 grid md:grid-cols-2 gap-6 md:gap-8 items-stretch">
          <Card
            variant="light"
            eyebrow="Entry · Start here"
            title="Editor Placement"
            serifWord="Editor Placement"
            tagline="A dedicated direct response editor embedded in your team."
            price="$100"
            priceNote="per delivered video"
            cta="Start with an editor"
            bulletsHeader="Everything you need to ship ads weekly"
            bullets={[
              "Vetted direct response editor matched to your workflow",
              "Pay per delivered video, no retainer or minimum",
              "24 to 48 hour turnaround standard",
              "All editing software covered by AdChefs",
              "Replaced fast if it is not clicking",
              "Trained on direct response, not wedding cuts",
            ]}
          />
          <Card
            variant="dark"
            eyebrow="Scale · Full creative department"
            title="Creative Strategy"
            serifWord="Creative Strategy"
            tagline="One operator owning the creative number end to end."
            price="Custom"
            priceNote="priced on the call"
            cta="Book a call"
            bulletsHeader="Everything in Editor Placement, plus"
            bullets={[
              "Research, angles, and briefs built with an editing eye",
              "Weekly read on hook, hold, ROAS, CPA",
              "New creative batches shipped every week",
              "Produced videos included, not just strategy decks",
              "Dedicated editor placement included",
              "Live KPI dashboard, free",
            ]}
          />
        </div>
      </div>
    </section>
  );
};

export default TwoWaysToWork;
