import { Button } from "@/components/ui/button";
import { ArrowRight, Check } from "lucide-react";

const scrollToBooking = () => {
  const el = document.getElementById("booking");
  if (el) el.scrollIntoView({ behavior: "smooth" });
};

const GlassCheck = () => (
  <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/15 ring-1 ring-white/25 text-white backdrop-blur-md">
    <Check className="h-3 w-3" strokeWidth={2.5} />
  </span>
);

type CardProps = {
  eyebrow: string;
  title: string;
  tagline: string;
  price: string;
  priceNote: string;
  popular?: boolean;
  bullets: string[];
  bulletsHeader: string;
};

const GlassCard = ({ eyebrow, title, tagline, price, priceNote, popular, bullets, bulletsHeader }: CardProps) => (
  <div className="relative h-full">
    {popular && (
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
        <span className="rounded-full bg-[#F7F6F3] px-3 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-[#1A1A1A] shadow-[0_4px_16px_rgba(0,0,0,0.12)]">
          Most Popular
        </span>
      </div>
    )}
    <div className="relative flex flex-col h-full rounded-[20px] p-8 md:p-10 text-white overflow-hidden bg-white/10 backdrop-blur-2xl ring-1 ring-white/20 shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_20px_60px_-20px_rgba(0,0,0,0.35)] transition-transform duration-300 hover:-translate-y-1">
      {/* glossy top highlight */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-white/20 to-transparent" aria-hidden />
      <div className="pointer-events-none absolute -top-24 -right-16 h-56 w-56 rounded-full bg-white/15 blur-3xl" aria-hidden />

      <div className="relative text-center">
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/70">
          {eyebrow}
        </span>
        <h3 className="mt-4 font-serif italic text-[34px] md:text-[40px] leading-[1.05] tracking-[-0.01em]">
          {title}
        </h3>
        <p className="mt-3 text-[14px] md:text-[15px] text-white/85">
          {tagline}
        </p>

        <div className="mt-10">
          <div className="font-display text-[56px] md:text-[64px] leading-none tracking-[-0.02em]">
            {price}
          </div>
          <p className="mt-2 text-[12px] text-white/70">{priceNote}</p>
        </div>

        <div className="mt-6">
          <Button
            variant="cta"
            size="lg"
            className="h-auto px-6 py-3 rounded-full bg-[#F7F6F3] text-[#1A1A1A] hover:bg-[#EEEDE8] gap-[10px]"
            onClick={scrollToBooking}
          >
            Book a Call
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="relative mt-10 h-px w-full bg-white/15" aria-hidden />

      <div className="relative mt-6">
        <p className="text-[13px] text-white/85 italic">{bulletsHeader}</p>
        <ul className="mt-4 space-y-3">
          {bullets.map((item, i) => (
            <li key={i} className="flex items-start gap-3 text-[14px] leading-snug text-white/90">
              <GlassCheck />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  </div>
);

const TwoWaysToWork = () => {
  return (
    <section className="relative py-20 sm:py-32 overflow-hidden bg-[#09090f]">
      {/* Liquid gradient background — brand slate */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0E0E10] via-[#09090f] to-[#0a0a0a]" aria-hidden />
      <div className="absolute -top-40 left-1/4 h-[520px] w-[520px] rounded-full bg-[#9ED8F5]/12 blur-3xl" aria-hidden />
      <div className="absolute -bottom-40 right-1/4 h-[520px] w-[520px] rounded-full bg-[#1a1a1a]/60 blur-3xl" aria-hidden />

      <div className="relative mx-auto max-w-[1100px] px-6">
        <div className="text-center mb-14 md:mb-20">
          <h2 className="font-display text-[34px] md:text-[52px] leading-[1.05] tracking-[-0.02em] text-white">
            Two ways I work with <em className="font-serif italic !text-white">brands</em>
          </h2>
          <p className="mt-5 text-[15px] md:text-[17px] text-white/85 whitespace-nowrap overflow-hidden text-ellipsis">
            Start with an editor. Scale with a creative partner.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 md:gap-8 items-stretch">
          <GlassCard
            popular
            eyebrow="ENTRY · START HERE"
            title="Editor Placement"
            tagline="A dedicated editor, embedded in your team."
            price="$100"
            priceNote="per delivered video"
            bulletsHeader="Everything you need to ship ads weekly."
            bullets={[
              "Vetted direct response editor matched to your workflow",
              "Pay per delivered video, no retainer or minimum",
              "24 to 48 hour turnaround standard",
              "All editing software covered by AdChefs",
              "Replaced fast if it is not clicking",
              "Trained on direct response, not wedding cuts",
            ]}
          />
          <GlassCard
            eyebrow="SCALE · FULL CREATIVE DEPARTMENT"
            title="Creative Strategy"
            tagline="One operator owning the creative number."
            price="Custom"
            priceNote="priced on the call"
            bulletsHeader="Everything in Editor Placement, plus"
            bullets={[
              "Research, angles, and briefs built with an editing eye",
              "Weekly read on hook, hold, ROAS, CPA",
              "New creative batches shipped every week",
              "Produced videos included, not just strategy decks",
              "Dedicated editor placement included",
              "Live KPI dashboard, free",
              "One operator owning the creative number end to end",
            ]}
          />
        </div>
      </div>
    </section>
  );
};

export default TwoWaysToWork;
