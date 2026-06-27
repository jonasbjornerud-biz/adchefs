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
  const isDark = variant === "dark";
  const surface = isDark ? "bg-[#1A1A1A]" : "bg-[#EEEDE8]";
  const text = isDark ? "text-[#F7F6F3]" : "text-[#1A1A1A]";
  const subtle = isDark ? "text-[#F7F6F3]/70" : "text-[#75726B]";
  const divider = isDark ? "bg-white/10" : "bg-[#1A1A1A]/10";
  const checkBg = isDark ? "bg-[#9ED8F5] text-[#1A1A1A]" : "bg-[#1A1A1A] text-[#F7F6F3]";

  return (
    <div
      className={`relative flex flex-col h-full rounded-[6px] ${surface} ${text} p-8 md:p-12 transition-all duration-300 hover:-translate-y-1`}
    >
      {/* eyebrow */}
      <div className="flex items-center gap-3">
        <span className={`h-1.5 w-1.5 rounded-full bg-[#9ED8F5]`} aria-hidden />
        <span className={`font-mono text-[10px] uppercase tracking-[0.2em] ${subtle}`}>
          {eyebrow}
        </span>
      </div>

      {/* title */}
      <h3 className="mt-8 font-display text-[36px] md:text-[44px] leading-[1.05] tracking-[-0.015em]">
        {title}{" "}
        <em className="font-serif italic font-normal">{serifWord}</em>
      </h3>

      <p className={`mt-4 text-[15px] md:text-[16px] leading-relaxed ${subtle}`}>
        {tagline}
      </p>

      {/* price */}
      <div className="mt-10 flex items-baseline gap-3">
        <span className="font-display text-[48px] md:text-[56px] leading-none tracking-[-0.02em]">
          {price}
        </span>
        <span className={`font-mono text-[11px] uppercase tracking-[0.16em] ${subtle}`}>
          {priceNote}
        </span>
      </div>

      {/* divider */}
      <div className={`mt-10 h-px w-full ${divider}`} aria-hidden />

      {/* bullets */}
      <div className="mt-8 flex-1">
        <p className={`font-mono text-[10px] uppercase tracking-[0.2em] ${subtle}`}>
          {bulletsHeader}
        </p>
        <ul className="mt-5 space-y-3.5">
          {bullets.map((item, i) => (
            <li key={i} className="flex items-start gap-3 text-[14px] md:text-[15px] leading-snug">
              <span
                className={`mt-0.5 inline-flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full ${checkBg}`}
              >
                <Check className="h-2.5 w-2.5" strokeWidth={3} />
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* CTA */}
      <div className="mt-10">
        <Button
          size="lg"
          onClick={scrollToBooking}
          className={`h-auto w-full md:w-auto rounded-full px-6 py-3 gap-[10px] transition-colors ${
            isDark
              ? "bg-[#F7F6F3] text-[#1A1A1A] hover:bg-[#9ED8F5]"
              : "bg-[#1A1A1A] text-[#F7F6F3] hover:bg-[#9ED8F5] hover:text-[#1A1A1A]"
          }`}
        >
          {cta}
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

const TwoWaysToWork = () => {
  return (
    <section className="relative py-20 sm:py-32 overflow-hidden bg-[#F7F6F3]">
      {/* very soft accent wash, matching hero */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 90% 10%, rgba(158,216,245,0.22), transparent 60%), radial-gradient(ellipse 60% 50% at 0% 100%, rgba(158,216,245,0.16), transparent 60%)",
        }}
        aria-hidden
      />

      <div className="relative mx-auto max-w-[1120px] px-6">
        {/* section header */}
        <div className="max-w-2xl">
          <div className="flex items-center gap-3">
            <span className="h-1.5 w-1.5 rounded-full bg-[#9ED8F5]" aria-hidden />
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#75726B]">
              How we work together
            </span>
          </div>
          <h2 className="mt-6 font-display text-[40px] md:text-[60px] leading-[1.02] tracking-[-0.02em] text-[#1A1A1A]">
            Two ways I work with{" "}
            <em className="font-serif italic font-normal">brands</em>
          </h2>
          <p className="mt-5 text-[16px] md:text-[18px] leading-relaxed text-[#75726B]">
            Most brands start with an editor then loop me in on creative strategy.
          </p>
        </div>

        {/* cards */}
        <div className="mt-14 md:mt-20 grid md:grid-cols-2 gap-6 md:gap-8 items-stretch">
          <Card
            variant="light"
            eyebrow="Entry · Start here"
            title="Editor"
            serifWord="Placement"
            tagline="A dedicated, direct response editor embedded in your team. No retainer, no minimum."
            price="$100"
            priceNote="per delivered video"
            cta="Start with an editor"
            bulletsHeader="What's included"
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
            title="Creative"
            serifWord="Strategy"
            tagline="One operator owning the creative number end to end. Research, angles, briefs, edits, dashboard."
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
