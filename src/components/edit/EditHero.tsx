import jonasPhoto from "@/assets/jonas.jpg";
import HeroWall from "@/components/HeroWall";
import { useLocalTimecode } from "./useTimecode";

const EditHero = () => {
  const tc = useLocalTimecode();
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };
  return (
    <section id="hero" className="pt-[128px] pb-16 md:pb-24" style={{ background: "var(--es-studio)" }}>
      <div className="es-container">
        <div className="grid lg:grid-cols-[1.05fr_1fr] gap-12 lg:gap-16 items-center">
          {/* LEFT */}
          <div className="es-reveal es-in min-w-0">
            <span className="es-timecode-label">00 · BUILT FOR DTC BRANDS</span>
            <h1
              className="mt-6 es-display text-[44px] sm:text-[64px] lg:text-[80px] leading-[0.98]"
              style={{ color: "var(--es-ink)" }}
            >
              Creative strategy for 7 to 9 figure DTC brands
            </h1>
            <p
              className="mt-8 text-[16px] md:text-[18px] leading-relaxed max-w-xl"
              style={{ color: "var(--es-graphite)", fontFamily: "Archivo, sans-serif" }}
            >
              I run the entire creative department. Research, angles, briefs, produced videos, and the weekly read on what is actually moving.
            </p>
            <div className="mt-8 flex flex-col gap-2">
              <button className="es-btn-primary self-start" onClick={() => scrollTo("booking")}>
                Book a call
              </button>
              <span className="es-mono text-[10px] uppercase tracking-[0.18em]" style={{ color: "var(--es-graphite)" }}>
                1 TO 2 NEW BRANDS PER MONTH
              </span>
            </div>

            <div className="mt-10 flex items-center gap-3">
              <div className="w-11 h-11 overflow-hidden" style={{ border: "1px solid var(--es-frame)" }}>
                <img src={jonasPhoto} alt="Jonas Bjørnerud" className="w-full h-full object-cover grayscale" />
              </div>
              <div className="flex flex-col">
                <span className="text-[14px] font-medium" style={{ color: "var(--es-ink)", fontFamily: "Archivo, sans-serif" }}>
                  Jonas Bjørnerud
                </span>
                <span className="es-mono text-[10px] uppercase tracking-[0.18em] mt-0.5" style={{ color: "var(--es-graphite)" }}>
                  FOUNDER · ADCHEFS
                </span>
              </div>
            </div>
          </div>

          {/* RIGHT: program monitor */}
          <div className="min-w-0">
            <div className="es-monitor" style={{ maxHeight: "78vh" }}>
              <div className="es-monitor-header">
                <span className="flex items-center gap-2">
                  <span className="es-rec-dot" />
                  <span>REC</span>
                  <span style={{ color: "var(--es-ink)" }}>CUTS GOING LIVE FOR CLIENTS</span>
                </span>
                <span className="es-mono" style={{ color: "var(--es-ink)" }}>{tc}</span>
              </div>
              <div className="p-3">
                <HeroWall label="" disclaimer="" />
              </div>
            </div>
            <p
              className="mt-3 es-mono text-[10px] uppercase tracking-[0.18em]"
              style={{ color: "var(--es-graphite)" }}
            >
              Includes agencies. Brand ownership belongs to respective clients.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EditHero;