import { ArrowRight } from "lucide-react";

const scrollToBooking = (e: React.MouseEvent) => {
  e.preventDefault();
  const el = document.getElementById("booking");
  if (el) el.scrollIntoView({ behavior: "smooth" });
  else window.location.href = "/#booking";
};

const CSFinalCTA = () => {
  return (
    <section className="py-24 sm:py-32" style={{ background: "#F7F6F3" }}>
      <div className="mx-auto max-w-[1120px] px-6">
        <div
          className="rounded-[4px] px-8 sm:px-14 py-12 sm:py-16 flex flex-col md:flex-row md:items-center md:justify-between gap-10"
          style={{ background: "#9ED8F5", color: "#1A1A1A" }}
        >
          <div className="md:max-w-[640px]">
            <h2
              className="text-[30px] sm:text-[40px] lg:text-[46px] leading-[1.04] tracking-[-0.025em] font-semibold"
              style={{ fontFamily: "'Inter Tight', sans-serif" }}
            >
              Ready to hand creative to one{" "}
              <em
                style={{ fontFamily: "'Instrument Serif', serif", fontStyle: "italic", fontWeight: 400 }}
              >
                operator
              </em>
              ?
            </h2>
            <p
              className="mt-4 text-[15px] sm:text-[16px] leading-relaxed"
              style={{ color: "rgba(26,26,26,0.72)" }}
            >
              Pricing is built around your account on the call. Two to three brands max at a time.
            </p>
          </div>
          <div className="md:flex-shrink-0">
            <a
              href="#booking"
              onClick={scrollToBooking}
              className="group inline-flex items-center justify-center rounded-[4px] px-7 py-4 text-[14px] font-medium transition-all hover:-translate-y-[2px] hover:shadow-[0_12px_32px_-12px_rgba(26,26,26,0.45)]"
              style={{ background: "#1A1A1A", color: "#F7F6F3" }}
            >
              Book a call
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CSFinalCTA;