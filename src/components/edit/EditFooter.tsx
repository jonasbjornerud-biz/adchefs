import adchefsLogo from "@/assets/adchefs-logo-light.png.asset.json";

const EditFooter = () => {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };
  return (
    <footer className="es-ink-band pt-16 pb-10">
      <div className="es-container">
        <div className="grid md:grid-cols-[1.5fr_1fr_1fr] gap-10">
          <div>
            <img src={adchefsLogo.url} alt="AdChefs" className="h-11 w-auto" />
            <p
              className="mt-4 text-[14px] leading-relaxed max-w-sm"
              style={{ color: "rgba(245,245,244,0.6)", fontFamily: "Archivo, sans-serif" }}
            >
              One operator running creative from A to Z for e-commerce brands.
            </p>
          </div>
          <div>
            <p className="es-mono text-[10px] uppercase tracking-[0.22em]" style={{ color: "rgba(245,245,244,0.45)" }}>
              NAVIGATE
            </p>
            <ul className="mt-4 space-y-2 text-[14px]" style={{ color: "rgba(245,245,244,0.8)" }}>
              <li><button onClick={() => scrollTo("services")} className="hover:text-white">Services</button></li>
              <li><button onClick={() => scrollTo("booking")} className="hover:text-white">Book a call</button></li>
              <li><button onClick={() => scrollTo("faq")} className="hover:text-white">FAQ</button></li>
              <li><a href="/jobs" className="hover:text-white">Careers</a></li>
            </ul>
          </div>
          <div>
            <p className="es-mono text-[10px] uppercase tracking-[0.22em]" style={{ color: "rgba(245,245,244,0.45)" }}>
              CONTACT
            </p>
            <a href="mailto:jonas@adchefs.com" className="mt-4 block text-[14px]" style={{ color: "rgba(245,245,244,0.8)" }}>
              jonas@adchefs.com
            </a>
            <p className="mt-3 es-mono text-[10px] uppercase tracking-[0.22em]" style={{ color: "rgba(245,245,244,0.45)" }}>
              BASED IN NORWAY
            </p>
          </div>
        </div>

        <div
          className="mt-14 pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
          style={{ borderTop: "1px solid rgba(245,245,244,0.1)" }}
        >
          <p className="es-mono text-[10px] uppercase tracking-[0.22em]" style={{ color: "rgba(245,245,244,0.4)" }}>
            © 2026 BJØRNERUD MEDIA · ALL RIGHTS RESERVED
          </p>
          <p className="es-mono text-[10px] uppercase tracking-[0.22em]" style={{ color: "rgba(245,245,244,0.4)" }}>
            END OF REEL · 00:00:58:12
          </p>
        </div>
      </div>
    </footer>
  );
};

export default EditFooter;