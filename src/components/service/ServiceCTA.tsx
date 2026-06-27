import { ArrowRight } from "lucide-react";

type Props = {
  title: string;
  body: string;
  ctaLabel: string;
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

const ServiceCTA = ({ title, body, ctaLabel }: Props) => {
  return (
    <section className="py-20 sm:py-28" style={{ background: "#F7F6F3" }}>
      <div className="mx-auto max-w-[860px] px-6 text-center">
        <h2
          className="text-[30px] md:text-[44px] leading-[1.05] tracking-[-0.025em] font-semibold"
          style={{ fontFamily: "'Inter Tight', sans-serif", color: "#1A1A1A" }}
        >
          {title}
        </h2>
        <p
          className="mt-5 text-[16px] leading-relaxed max-w-[560px] mx-auto"
          style={{ color: "#75726B" }}
        >
          {body}
        </p>
        <div className="mt-9 flex justify-center">
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
      </div>
    </section>
  );
};

export default ServiceCTA;