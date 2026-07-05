import adchefsLogo from "@/assets/adchefs-logo-dark.png.asset.json";

const EditNav = () => {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };
  return (
    <nav
      className="fixed left-0 right-0 top-0 z-50 h-16 flex items-center"
      style={{ background: "var(--es-studio)" }}
    >
      <div className="mx-auto max-w-[1200px] w-full px-6 flex items-center justify-between">
        <a href="/" aria-label="AdChefs">
          <img src={adchefsLogo.url} alt="AdChefs" className="h-8 w-auto" />
        </a>
        <div className="flex items-center gap-6">
          <button
            onClick={() => scrollTo("services")}
            className="es-mono text-[11px] uppercase tracking-[0.18em]"
            style={{ color: "var(--es-graphite)" }}
          >
            Services
          </button>
          <button
            onClick={() => scrollTo("faq")}
            className="es-mono text-[11px] uppercase tracking-[0.18em]"
            style={{ color: "var(--es-graphite)" }}
          >
            FAQ
          </button>
          <button onClick={() => scrollTo("booking")} className="es-btn-primary">
            Book a call
          </button>
        </div>
      </div>
    </nav>
  );
};

export default EditNav;