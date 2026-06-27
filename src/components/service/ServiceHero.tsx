import { ArrowRight } from "lucide-react";
import PrintingReceiptStandalone from "@/components/Pricing";
import CreativeBriefDoc from "@/components/CreativeBriefDoc";
import ReceiptOnly from "./ReceiptOnly";

type Props = {
  eyebrow: string;
  monoLine: string;
  headlinePre: string;
  headlineItalic: string;
  headlinePost?: string;
  body: string;
  fromLabel: string;
  fromValue: string;
  fromUnit: string;
  monoNote: string;
  ctaLabel: string;
  tagline: string;
  graphicKind: "receipt" | "brief";
};

const scrollToBooking = (e: React.MouseEvent) => {
  e.preventDefault();
  const el = document.getElementById("booking");
  if (el) {
    el.scrollIntoView({ behavior: "smooth" });
  } else {
    window.location.href = "/#booking";
  }
};

const ServiceHero = ({
  eyebrow,
  monoLine,
  headlinePre,
  headlineItalic,
  headlinePost = "",
  body,
  fromLabel,
  fromValue,
  fromUnit,
  monoNote,
  ctaLabel,
  tagline,
  graphicKind,
}: Props) => {
  return (
    <section className="pt-10 pb-20 sm:pb-32" style={{ background: "#F7F6F3" }}>
      <div className="mx-auto max-w-[1240px] px-6">
        <div className="flex flex-col md:flex-row gap-16 md:gap-20 md:items-start">
          {/* Left column */}
          <div className="md:w-[55%] flex-shrink-0">
            <span className="eyebrow eyebrow-accent">{eyebrow}</span>
            <p
              className="mt-3 text-[12px]"
              style={{
                fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "#75726B",
              }}
            >
              {monoLine}
            </p>
            <h1
              className="mt-6 text-[40px] md:text-[60px] leading-[1.02] tracking-[-0.025em] font-semibold"
              style={{ fontFamily: "'Inter Tight', sans-serif", color: "#1A1A1A" }}
            >
              {headlinePre}{" "}
              <em
                style={{
                  fontFamily: "'Instrument Serif', serif",
                  fontStyle: "italic",
                  fontWeight: 400,
                }}
              >
                {headlineItalic}
              </em>
              {headlinePost}
            </h1>
            <p
              className="mt-6 text-[16px] leading-relaxed max-w-[540px]"
              style={{ color: "#75726B" }}
            >
              {body}
            </p>

            <div
              className="mt-7 inline-flex items-baseline gap-2"
              style={{
                fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                fontSize: 12,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: "#1A1A1A",
                borderBottom: "1px solid rgba(26,26,26,0.15)",
                paddingBottom: 6,
              }}
            >
              <span style={{ color: "#75726B" }}>{fromLabel}</span>
              <span style={{ fontWeight: 700 }}>{fromValue}</span>
              <span style={{ color: "#75726B" }}>{fromUnit}</span>
            </div>

            <p
              className="mt-3 text-[12px]"
              style={{
                fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "#75726B",
              }}
            >
              {monoNote}
            </p>

            <div className="mt-8">
              <a
                href="#booking"
                onClick={scrollToBooking}
                className="group inline-flex items-center justify-center rounded-[4px] px-7 py-4 text-[14px] font-medium transition-all hover:-translate-y-[2px] hover:shadow-[0_12px_32px_-12px_rgba(26,26,26,0.45)]"
                style={{ background: "#1A1A1A", color: "#F7F6F3" }}
              >
                {ctaLabel}
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>
            </div>

            <p
              className="mt-5 text-[14px]"
              style={{ color: "#75726B" }}
            >
              Revisions included until you approve it. Cancel whenever.
            </p>
            <p
              className="mt-2 text-[13px] max-w-[480px]"
              style={{
                color: "#9A968C",
                fontStyle: "italic",
                fontFamily: "'Instrument Serif', serif",
                fontSize: 16,
                lineHeight: 1.5,
              }}
            >
              {tagline}
            </p>
          </div>

          {/* Right column — signature graphic */}
          <div className="md:w-[45%] flex flex-col items-center md:items-end pt-4 md:pt-10">
            {graphicKind === "receipt" ? <ReceiptOnly /> : <CreativeBriefDoc />}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServiceHero;