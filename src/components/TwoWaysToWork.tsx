import { Button } from "@/components/ui/button";
import { ArrowRight, Check } from "lucide-react";
import { Link } from "react-router-dom";

type Theme = "light" | "dark";

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
  theme: Theme;
};

const CheckIcon = ({ theme }: { theme: Theme }) => (
  <span
    className={`mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
      theme === "dark"
        ? "border-accent text-accent"
        : "border-muted-foreground text-muted-foreground"
    }`}
  >
    <Check className="h-3 w-3" strokeWidth={1.5} />
  </span>
);

const ServiceCard = ({
  eyebrow,
  title,
  tagline,
  priceLine,
  popular,
  bullets,
  bulletsHeader,
  href,
  ctaLabel,
  theme,
}: CardProps) => {
  const isDark = theme === "dark";

  return (
    <div className="relative h-full">
      {popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20">
          <span className="rounded-brand bg-accent px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-ink">
            Most Popular
          </span>
        </div>
      )}

      <div
        className={`relative flex flex-col h-full rounded-brand p-8 md:p-10 overflow-hidden ${
          isDark ? "bg-ink text-paper" : "bg-surface text-ink"
        }`}
      >
        <div className="text-center">
          <span
            className={`font-mono text-[10px] uppercase tracking-[0.18em] ${
              isDark ? "text-paper/70" : "text-ink/70"
            }`}
          >
            {eyebrow}
          </span>
          <h3
            className={`mt-4 font-serif italic text-[36px] md:text-[44px] leading-[1.05] tracking-[-0.01em] ${
              isDark ? "text-accent" : "text-ink"
            }`}
          >
            {title}
          </h3>
          <p
            className={`mt-3 text-[14px] md:text-[15px] ${
              isDark ? "text-paper/80" : "text-ink/80"
            }`}
          >
            {tagline}
          </p>

          <div className="mt-8 mb-2">
            <div
              className={`inline-flex items-center gap-2 rounded-brand border px-4 py-2 ${
                isDark
                  ? "border-paper/20 text-paper"
                  : "border-ink/20 text-ink"
              }`}
            >
              <span className="font-mono text-[10px] uppercase tracking-[0.22em]">
                {priceLine}
              </span>
            </div>
          </div>

          <div className="mt-6">
            <Button
              asChild
              size="lg"
              variant="cta"
              className={`h-auto px-6 py-3 rounded-brand gap-[10px] ${
                isDark
                  ? "bg-paper text-ink hover:bg-paper/85"
                  : "bg-ink text-paper hover:bg-ink/85"
              }`}
            >
              <Link to={href}>
                {ctaLabel ?? "Book a call"}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>

        <div
          className={`mt-10 h-px w-full ${
            isDark ? "bg-paper/15" : "bg-ink/15"
          }`}
          aria-hidden
        />

        <div className="relative mt-6">
          <p className="text-[13px] italic opacity-95">{bulletsHeader}</p>
          <ul className="mt-4 space-y-3">
            {bullets.map((item, i) => (
              <li
                key={i}
                className="flex items-start gap-3 text-[14px] leading-snug"
              >
                <CheckIcon theme={theme} />
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
    <section id="services" className="relative py-20 sm:py-32 overflow-hidden bg-paper">
      <div className="relative mx-auto max-w-[1100px] px-6">
        <div className="text-center mb-14 md:mb-20">
          <span className="eyebrow">SERVICES</span>
          <h2 className="mt-4 font-display text-[34px] md:text-[52px] leading-[1.05] tracking-[-0.02em] text-ink">
            Two ways I run your <em className="font-serif italic !text-ink">creative</em>.
          </h2>
          <p className="mt-5 max-w-2xl mx-auto text-[15px] md:text-[18px] text-muted-foreground">
            Editor Engine places a dedicated editor inside your team and tools. Creative Engine moves the whole creative operation into my system, so you approve and launch, nothing else.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 md:gap-8 items-stretch">
          <ServiceCard
            theme="light"
            eyebrow="START HERE · EDITOR ENGINE"
            title="Editor Engine"
            tagline="A vetted direct response editor wired into your workflow, turning raw assets into finished ads."
            priceLine="Starting at $100 per video"
            bulletsHeader="Includes"
            bullets={[
              "A vetted direct response editor, integrated into your workflow and tools",
              "Feels in-house from day one, without the hiring",
              "24 to 48 hour turnaround standard",
              "Trained on my direct response master class",
              "Replaced fast if it's not clicking",
            ]}
            href="/#booking"
            ctaLabel="Book a call"
          />
          <ServiceCard
            theme="dark"
            popular
            eyebrow="SCALE · CREATIVE ENGINE"
            title="Creative Engine"
            tagline="Your full creative department. Strategy, production, and the weekly read, owned by one operator."
            priceLine="Scoped on the call"
            bulletsHeader="Everything in Editor Engine, plus"
            bullets={[
              "Briefs, production, and review run in my system. You get one channel and one login",
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
