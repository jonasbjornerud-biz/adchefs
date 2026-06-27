import { Button } from "@/components/ui/button";
import { ArrowRight, Check } from "lucide-react";

const scrollToBooking = () => {
  const el = document.getElementById("booking");
  if (el) el.scrollIntoView({ behavior: "smooth" });
};

const GlassCheck = () => (
  <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/25 text-white ring-1 ring-white/60 backdrop-blur-md">
    <Check className="h-3 w-3" strokeWidth={2.5} />
  </span>
);

const creativeSteps = [
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

const editorStages = [
  {
    title: "Vetted",
    body: "Hundreds in. One out. Skills tests, brand voice trials, paid trial edits. Only editors who can ship make it to your account.",
  },
  {
    title: "Trained",
    body: "Every editor goes through direct response training. Hook engineering, hold curves, sound design. The work gets sharper the longer they are with you.",
  },
  {
    title: "Embedded",
    body: "Your editor joins your Slack, your Notion, your brand folder. They work only on your account. I manage quality and performance behind the scenes.",
  },
];

type CardProps = {
  eyebrow: string;
  title: string;
  tagline: string;
  price: string;
  priceNote: string;
  popular?: boolean;
  bullets: string[];
  bulletsHeader: string;
  processTitle: string;
  steps: Array<{ title: string; body: string }>;
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
  processTitle,
  steps,
}: CardProps) => (
  <div className="relative h-full group">
    {popular && (
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20">
        <span className="rounded-full bg-white/90 backdrop-blur-xl px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-ink shadow-[0_4px_20px_rgba(59,134,168,0.20)] ring-1 ring-white/60">
          Most Popular
        </span>
      </div>
    )}

    {/* soft ambient glow behind card */}
    <div
      className="absolute -inset-1 rounded-[36px] bg-[#9ED8F5]/30 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100"
      aria-hidden
    />

    <div
      className="relative flex flex-col h-full rounded-[32px] p-8 md:p-10 text-white overflow-hidden backdrop-blur-[60px] ring-1 ring-white/50 transition-all duration-300 hover:-translate-y-1 hover:ring-white/70"
      style={{
        background:
          "linear-gradient(160deg, rgba(105,178,218,0.82) 0%, rgba(78,153,194,0.78) 35%, rgba(55,130,172,0.82) 70%, rgba(45,110,150,0.78) 100%)",
        boxShadow:
          "inset 0 1px 1px rgba(255,255,255,0.45), inset 0 0 0 1px rgba(255,255,255,0.20), 0 30px 80px -24px rgba(25,70,110,0.45), 0 12px 32px -12px rgba(25,70,110,0.25)",
      }}
    >
      {/* iOS-style glossy top highlight */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 rounded-t-[32px] bg-gradient-to-b from-white/35 via-white/10 to-transparent" aria-hidden />
      {/* inner bottom shadow for depth */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 rounded-b-[32px] bg-gradient-to-t from-black/10 via-transparent to-transparent" aria-hidden />
      {/* edge sheen */}
      <div className="pointer-events-none absolute inset-0 rounded-[32px]" style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.12) 0%, transparent 15%, transparent 85%, rgba(255,255,255,0.07) 100%)" }} aria-hidden />
      {/* subtle warm inner glow */}
      <div className="pointer-events-none absolute -top-20 -right-20 h-64 w-64 rounded-full bg-white/15 blur-3xl" aria-hidden />
      <div className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-[#9ED8F5]/20 blur-3xl" aria-hidden />

      <div className="relative text-center">
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/90">
          {eyebrow}
        </span>
        <h3 className="mt-4 font-serif italic text-[36px] md:text-[44px] leading-[1.05] tracking-[-0.01em] text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.06)]">
          {title}
        </h3>
        <p className="mt-3 text-[14px] md:text-[15px] text-white/90">
          {tagline}
        </p>

        <div className="mt-10">
          <div className="font-display text-[56px] md:text-[64px] leading-none tracking-[-0.02em] text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.08)]">
            {price}
          </div>
          <p className="mt-2 text-[12px] text-white/85">{priceNote}</p>
        </div>

        <div className="mt-6">
          <Button
            size="lg"
            className="h-auto px-6 py-3 rounded-full bg-white/90 backdrop-blur-md text-ink hover:bg-white gap-[10px] ring-1 ring-white/60 shadow-[0_6px_24px_-6px_rgba(30,85,130,0.35)] transition-colors"
            onClick={scrollToBooking}
          >
            Learn More
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="relative mt-10 h-px w-full bg-gradient-to-r from-transparent via-white/40 to-transparent" aria-hidden />

      <div className="relative mt-6">
        <p className="text-[13px] text-white/95 italic">{bulletsHeader}</p>
        <ul className="mt-4 space-y-3">
          {bullets.map((item, i) => (
            <li key={i} className="flex items-start gap-3 text-[14px] leading-snug text-white">
              <GlassCheck />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="relative mt-10">
        <p className="text-[12px] font-mono uppercase tracking-[0.14em] text-white/70">{processTitle}</p>
        <ul className="mt-4 space-y-4">
          {steps.map((item, i) => (
            <li key={i} className="flex gap-3 text-[14px] leading-snug">
              <span className="font-mono text-[11px] text-white/80 shrink-0 pt-0.5">0{i + 1}</span>
              <div>
                <span className="font-medium text-white">{item.title}</span>
                <span className="block text-white/80 text-[13px] mt-0.5">{item.body}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  </div>
);

const TwoWaysToWork = () => {
  return (
    <section id="services" className="relative py-20 sm:py-32 overflow-hidden">
      {/* white base with a single airy brand accent wash */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, #FFFFFF 0%, #F8F9FA 50%, #FFFFFF 100%)",
        }}
        aria-hidden
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 55% at 50% 50%, rgba(158,216,245,0.16), transparent 65%), radial-gradient(ellipse 60% 40% at 90% 10%, rgba(158,216,245,0.10), transparent 55%)",
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
            processTitle="How it works"
            steps={editorStages}
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
            processTitle="The process"
            steps={creativeSteps}
          />
        </div>
      </div>
    </section>
  );
};

export default TwoWaysToWork;
