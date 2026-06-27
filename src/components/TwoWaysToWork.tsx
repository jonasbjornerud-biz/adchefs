import { Button } from "@/components/ui/button";
import { ArrowRight, Check } from "lucide-react";

const scrollToBooking = () => {
  const el = document.getElementById("booking");
  if (el) el.scrollIntoView({ behavior: "smooth" });
};

const GlassCheck = () => (
  <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#9ED8F5]/25 ring-1 ring-[#9ED8F5]/40 text-ink backdrop-blur-md">
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

const GlassCard = ({
  eyebrow,
  title,
  tagline,
  price,
  priceNote,
  popular,
  bullets,
  bulletsHeader,
}: CardProps) => (
  <div className="relative h-full group">
    {popular && (
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20">
        <span className="rounded-full bg-white/95 backdrop-blur-md px-3 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-ink shadow-[0_4px_16px_rgba(59,134,168,0.20)] ring-1 ring-white/70">
          Most Popular
        </span>
      </div>
    )}

    {/* soft brand-accent glow behind card */}
    <div
      className="absolute -inset-1 rounded-[28px] bg-[#9ED8F5]/20 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100"
      aria-hidden
    />

    <div
      className="relative flex flex-col h-full rounded-[24px] p-8 md:p-10 text-white overflow-hidden backdrop-blur-[60px] ring-1 ring-white/60 transition-all duration-300 hover:-translate-y-1 hover:ring-white/80"
      style={{
        background:
          "linear-gradient(165deg, rgba(255,255,255,0.58) 0%, rgba(255,255,255,0.42) 35%, rgba(200,232,250,0.40) 65%, rgba(158,216,245,0.36) 100%)",
        boxShadow:
          "inset 0 1.5px 1px rgba(255,255,255,0.75), inset 0 0 0 1px rgba(255,255,255,0.28), 0 32px 80px -24px rgba(20,60,100,0.28), 0 12px 32px -8px rgba(20,60,100,0.16)",
      }}
    >
      {/* slow liquid shimmer sweep */}
      <div
        className="pointer-events-none absolute -inset-[100%] opacity-[0.20] group-hover:opacity-[0.45] transition-opacity duration-500"
        style={{
          background: "linear-gradient(105deg, transparent 35%, rgba(255,255,255,0.28) 48%, rgba(255,255,255,0.06) 58%, transparent 70%)",
          animation: "card-shimmer 5s ease-in-out infinite",
        }}
        aria-hidden
      />
      {/* glossy top highlight — iOS specular */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-white/50 via-white/15 to-transparent" aria-hidden />
      {/* curved edge sheen */}
      <div className="pointer-events-none absolute inset-0 rounded-[24px]" style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.16) 0%, transparent 14%, transparent 86%, rgba(255,255,255,0.10) 100%)" }} aria-hidden />
      {/* faint inner specular glows */}
      <div className="pointer-events-none absolute -top-20 -right-20 h-64 w-64 rounded-full bg-white/22 blur-3xl" aria-hidden />
      <div className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-[#9ED8F5]/22 blur-3xl" aria-hidden />
      {/* inner liquid edge glow */}
      <div className="pointer-events-none absolute inset-0 rounded-[24px]" style={{ boxShadow: "inset 0 0 28px rgba(158,216,245,0.12)" }} aria-hidden />

      <div className="relative text-center">
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink/70">
          {eyebrow}
        </span>
        <h3 className="mt-4 font-serif italic text-[36px] md:text-[44px] leading-[1.05] tracking-[-0.01em] text-ink drop-shadow-[0_1px_0_rgba(255,255,255,0.6)]">
          {title}
        </h3>
        <p className="mt-3 text-[14px] md:text-[15px] text-ink/80">
          {tagline}
        </p>

        <div className="mt-10">
          <div className="font-display text-[56px] md:text-[64px] leading-none tracking-[-0.02em] text-ink drop-shadow-[0_1px_0_rgba(255,255,255,0.6)]">
            {price}
          </div>
          <p className="mt-2 text-[12px] text-ink/70">{priceNote}</p>
        </div>

        <div className="mt-6">
          <Button
            size="lg"
            className="h-auto px-6 py-3 rounded-full bg-ink text-paper hover:bg-ink/90 gap-[10px] ring-1 ring-white/50 shadow-[0_6px_20px_-6px_rgba(20,60,100,0.25)] transition-colors"
            onClick={scrollToBooking}
          >
            Book a Call
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="relative mt-10 h-px w-full bg-gradient-to-r from-transparent via-ink/15 to-transparent" aria-hidden />

      <div className="relative mt-6">
        <p className="text-[13px] text-ink/90 italic">{bulletsHeader}</p>
        <ul className="mt-4 space-y-3">
          {bullets.map((item, i) => (
            <li key={i} className="flex items-start gap-3 text-[14px] leading-snug text-ink/90">
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
    <>
      <style>{`
        @keyframes card-shimmer {
          0% { transform: translateX(-60%) translateY(-60%) rotate(30deg); }
          100% { transform: translateX(160%) translateY(160%) rotate(30deg); }
        }
      `}</style>
      <section className="relative py-20 sm:py-32 overflow-hidden">
        {/* white base with a single airy brand accent wash */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(180deg, #FFFFFF 0%, #F7F6F3 50%, #FFFFFF 100%)",
          }}
          aria-hidden
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 80% 55% at 50% 50%, rgba(158,216,245,0.18), transparent 65%), radial-gradient(ellipse 60% 40% at 90% 10%, rgba(158,216,245,0.12), transparent 55%)",
          }}
          aria-hidden
        />

        <div className="relative mx-auto max-w-[1100px] px-6">
          <div className="text-center mb-14 md:mb-20">
            <h2 className="font-display text-[34px] md:text-[52px] leading-[1.05] tracking-[-0.02em] text-ink">
              Two ways I work with <em className="font-serif italic !text-ink">brands</em>
            </h2>
            <p className="mt-5 max-w-2xl mx-auto text-[15px] md:text-[18px] text-muted-foreground">
              Most brands start with an editor, then loop me in on creative strategy.
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
    </>
  );
};

export default TwoWaysToWork;
