import { Button } from "@/components/ui/button";
import { ArrowRight, Check } from "lucide-react";
import { Link } from "react-router-dom";

const GlassCheck = () => (
  <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/25 text-white ring-1 ring-white/60 backdrop-blur-md">
    <Check className="h-3 w-3" strokeWidth={2.5} />
  </span>
);

type CardProps = {
  eyebrow: string;
  title: string;
  tagline: string;
  priceLine: string;
  popular?: boolean;
  bullets: string[];
  bulletsHeader: string;
  href: string;
  ctaLabel?: string;
};

const GlassCard = ({
  eyebrow,
  title,
  tagline,
  priceLine,
  popular,
  bullets,
  bulletsHeader,
  href,
  ctaLabel,
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

        <div className="mt-8 mb-2">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/15 backdrop-blur-md px-4 py-2 ring-1 ring-white/40">
            <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-white">
              {priceLine}
            </span>
          </div>
        </div>

        <div className="mt-6">
          <Button
            asChild
            size="lg"
            className="h-auto px-6 py-3 rounded-full bg-white/90 backdrop-blur-md text-ink hover:bg-white gap-[10px] ring-1 ring-white/60 shadow-[0_6px_24px_-6px_rgba(30,85,130,0.35)] transition-colors"
          >
            <Link to={href}>
              {ctaLabel ?? "Book a call"}
              <ArrowRight className="h-4 w-4" />
            </Link>
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
          <span className="eyebrow">SERVICES</span>
          <h2 className="mt-4 font-display text-[34px] md:text-[52px] leading-[1.05] tracking-[-0.02em] text-ink">
            Two ways I run your <em className="font-serif italic !text-ink">creative</em>.
          </h2>
          <p className="mt-5 max-w-2xl mx-auto text-[15px] md:text-[18px] text-muted-foreground">
            Both ship finished videos with a dedicated editor embedded in your team. The difference is how deep the strategy layer goes.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 md:gap-8 items-stretch">
          <GlassCard
            eyebrow="START HERE · CREATIVE SPRINT"
            title="Creative Sprint"
            tagline="Weekly net-new ad concepts, briefed by me, shipped as finished videos by your dedicated editor."
            priceLine="Scoped on the call"
            bulletsHeader="What ships every week."
            bullets={[
              "Net-new concepts briefed every week, mapped to customer awareness",
              "Every concept delivered as a finished, ready-to-launch video",
              "Dedicated vetted editor embedded in your Slack and Notion",
              "Built from your account data and your competitors' ad libraries",
              "Hook variations and platform cutdowns included",
              "Pause or cancel monthly",
            ]}
            href="/#booking"
            ctaLabel="Book a call"
          />
          <GlassCard
            popular
            eyebrow="SCALE · CREATIVE ENGINE"
            title="Creative Engine"
            tagline="Your full creative department. Strategy, production, and the weekly read, owned by one operator."
            priceLine="Scoped on the call"
            bulletsHeader="Everything in Creative Sprint, plus"
            bullets={[
              "Weekly read on hook, hold, ROAS, and CPA",
              "Creative direction across your whole account, not just my batches",
              "Live KPI dashboard, free",
              "Editor capacity scales with your spend",
              "One operator owning the creative number end to end",
            ]}
            href="/#booking"
            ctaLabel="Book a call"
          />
        </div>
      </div>
    </section>
  );
};

export default TwoWaysToWork;
