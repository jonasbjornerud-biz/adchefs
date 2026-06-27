import { Button } from "@/components/ui/button";
import { ArrowRight, Check } from "lucide-react";

const scrollToBooking = () => {
  const el = document.getElementById("booking");
  if (el) el.scrollIntoView({ behavior: "smooth" });
};

const GlassCheck = () => (
  <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/20 ring-1 ring-ink/10 text-ink backdrop-blur-md">
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
        <span className="rounded-full bg-accent px-3 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-ink shadow-[0_4px_16px_rgba(0,0,0,0.08)]">
          Most Popular
        </span>
      </div>
    )}

    {/* soft accent glow behind card */}
    <div
      className="absolute -inset-0.5 rounded-[22px] bg-accent/20 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
      aria-hidden
    />

    <div className="relative flex flex-col h-full rounded-[20px] p-8 md:p-10 text-ink overflow-hidden bg-white/50 backdrop-blur-[40px] ring-1 ring-ink/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.9),0_24px_80px_-20px_rgba(0,0,0,0.12)] transition-all duration-300 hover:-translate-y-1 hover:ring-ink/20">
      {/* glossy top highlight */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-white/50 to-transparent" aria-hidden />
      {/* faint inner accent glow */}
      <div className="pointer-events-none absolute -top-20 -right-20 h-64 w-64 rounded-full bg-accent/15 blur-3xl" aria-hidden />
      <div className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-accent/10 blur-3xl" aria-hidden />

      <div className="relative text-center">
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
          {eyebrow}
        </span>
        <h3 className="mt-4 font-serif italic text-[36px] md:text-[44px] leading-[1.05] tracking-[-0.01em]">
          {title}
        </h3>
        <p className="mt-3 text-[14px] md:text-[15px] text-muted-foreground">
          {tagline}
        </p>

        <div className="mt-10">
          <div className="font-display text-[56px] md:text-[64px] leading-none tracking-[-0.02em] text-ink">
            {price}
          </div>
          <p className="mt-2 text-[12px] text-muted-foreground">{priceNote}</p>
        </div>

        <div className="mt-6">
          <Button
            size="lg"
            className="h-auto px-6 py-3 rounded-full bg-ink text-paper hover:bg-accent hover:text-ink gap-[10px] transition-colors"
            onClick={scrollToBooking}
          >
            Book a Call
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="relative mt-10 h-px w-full bg-gradient-to-r from-transparent via-ink/15 to-transparent" aria-hidden />

      <div className="relative mt-6">
        <p className="text-[13px] text-ink italic">{bulletsHeader}</p>
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
    <section className="relative py-20 sm:py-32 overflow-hidden bg-paper">
      {/* minimal top-right accent wash — borrowed from hero, muted for light */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 45% at 95% 5%, rgba(158,216,245,0.16), transparent 55%), radial-gradient(ellipse 50% 40% at 5% 95%, rgba(158,216,245,0.10), transparent 55%)",
        }}
        aria-hidden
      />

      {/* soft blue ring — top-right, like hero watermark */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <svg
          className="absolute"
          style={{
            right: "-520px",
            top: "-360px",
            width: "1000px",
            height: "700px",
            filter: "blur(28px)",
            opacity: 0.28,
            overflow: "visible",
          }}
          viewBox="0 0 1000 700"
          preserveAspectRatio="none"
        >
          <g transform="rotate(20 500 350)">
            <ellipse
              cx="500"
              cy="350"
              rx="430"
              ry="300"
              fill="none"
              stroke="#9ED8F5"
              strokeWidth="80"
            />
          </g>
        </svg>
      </div>

      {/* subtle film grain */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.025] mix-blend-multiply"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 256 256'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: "200px 200px",
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
  );
};

export default TwoWaysToWork;
