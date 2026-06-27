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
  const popular = variant === "dark";

  return (
    <div className="relative h-full">
      {popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20">
          <span className="rounded-full bg-[#9ED8F5] px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-[#1A1A1A]">
            Most Popular
          </span>
        </div>
      )}

      <div
        className={`relative flex flex-col h-full rounded-[14px] p-10 md:p-12 overflow-hidden transition-all duration-500 hover:-translate-y-0.5 ${
          popular
            ? "bg-white border border-[#1A1A1A]/8 shadow-[0_30px_80px_-30px_rgba(26,26,26,0.25)]"
            : "bg-[#F7F6F3] border border-[#1A1A1A]/8"
        }`}
      >
        {/* eyebrow */}
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#75726B]">
          {eyebrow}
        </p>

        {/* title */}
        <h3 className="mt-4 font-display text-[32px] md:text-[36px] leading-[1.05] tracking-[-0.015em] text-[#1A1A1A]">
          <em className="font-serif italic font-normal">{serifWord}</em>
        </h3>

        <p className="mt-3 text-[15px] leading-relaxed text-[#75726B] max-w-[38ch]">
          {tagline}
        </p>

        {/* price */}
        <div className="mt-10 flex items-baseline gap-2">
          <span className="font-display text-[48px] md:text-[56px] leading-none tracking-[-0.02em] text-[#1A1A1A]">
            {price}
          </span>
          <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#75726B]">
            {priceNote}
          </span>
        </div>

        {/* CTA */}
        <div className="mt-8">
          <Button
            size="lg"
            onClick={scrollToBooking}
            className={`h-auto w-full rounded-full px-6 py-3 gap-[10px] transition-colors ${
              popular
                ? "bg-[#1A1A1A] text-[#F7F6F3] hover:bg-[#1A1A1A]/90"
                : "bg-transparent text-[#1A1A1A] border border-[#1A1A1A]/15 hover:bg-[#1A1A1A] hover:text-[#F7F6F3] hover:border-[#1A1A1A]"
            }`}
          >
            {cta}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>

        {/* divider */}
        <div className="mt-10 h-px w-full bg-[#1A1A1A]/8" aria-hidden />

        {/* bullets */}
        <div className="mt-8 flex-1">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#75726B]">
            {bulletsHeader}
          </p>
          <ul className="mt-6 space-y-4">
            {bullets.map((item, i) => (
              <li
                key={i}
                className="flex items-start gap-3 text-[14px] md:text-[15px] leading-snug text-[#1A1A1A]"
              >
                <Check
                  className="mt-[3px] h-[14px] w-[14px] shrink-0 text-[#1A1A1A]"
                  strokeWidth={2.25}
                />
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
    <section className="relative py-24 sm:py-36 overflow-hidden bg-[#F7F6F3]">
      {/* very faint brand accent wash — mirrors hero */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 95% 8%, rgba(158,216,245,0.18), transparent 60%), radial-gradient(ellipse 55% 40% at 5% 95%, rgba(158,216,245,0.12), transparent 60%)",
        }}
      />

      <div className="relative mx-auto max-w-[1080px] px-6">
        {/* section header — left aligned, hero style */}
        <div className="max-w-2xl">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#75726B]">
            How we work together
          </p>
          <h2 className="mt-5 font-display text-[44px] md:text-[64px] leading-[1.02] tracking-[-0.02em] text-[#1A1A1A]">
            Two ways I work with{" "}
            <em className="font-serif italic font-normal">brands</em>
          </h2>
          <p className="mt-5 text-[16px] md:text-[18px] leading-relaxed text-[#75726B]">
            Most brands start with an editor then loop me in on creative strategy.
          </p>
        </div>

        {/* cards */}
        <div className="mt-16 md:mt-20 grid md:grid-cols-2 gap-5 md:gap-6 items-stretch">
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
