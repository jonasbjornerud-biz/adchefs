import adchefsLogo from "@/assets/adchefs-logo-light.png.asset.json";

const Footer = () => {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer className="bg-foreground text-background pt-12 sm:pt-20 pb-10">
      <div className="mx-auto max-w-[1200px] px-6">
        <div className="grid md:grid-cols-[1.5fr_1fr_1fr] gap-10 md:gap-12 mb-16">
          <div>
            <img src={adchefsLogo.url} alt="AdChefs" className="h-9 md:h-10 w-auto" />
            <p className="mt-4 text-[14px] text-background/60 leading-relaxed max-w-sm">
              A dedicated video editor matched to your e-commerce brand. Pay per video. No retainers, no agency markup, no rotating freelancers.
            </p>
          </div>

          <div>
            <p className="mono text-[11px] uppercase tracking-[0.15em] text-background/50 mb-4">Navigate</p>
            <ul className="space-y-2.5 text-[14px] text-background/80">
              <li><button onClick={() => scrollTo("how-it-works")} className="hover:text-accent transition-colors">How it works</button></li>
              <li><button onClick={() => scrollTo("pricing")} className="hover:text-accent transition-colors">Pricing</button></li>
              <li><button onClick={() => scrollTo("faq")} className="hover:text-accent transition-colors">FAQ</button></li>
              <li><button onClick={() => scrollTo("booking")} className="hover:text-accent transition-colors">Book a call</button></li>
              <li><a href="/jobs" className="hover:text-accent transition-colors">Careers</a></li>
            </ul>
          </div>

          <div>
            <p className="mono text-[11px] uppercase tracking-[0.15em] text-background/50 mb-4">Contact</p>
            <a href="mailto:jonas@adchefs.com" className="text-[14px] text-background/80 hover:text-accent transition-colors block">
              jonas@adchefs.com
            </a>
            <p className="mt-3 mono text-[11px] uppercase tracking-[0.15em] text-background/50">Based in Norway</p>
          </div>
        </div>

        <div className="pt-8 border-t border-background/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <p className="mono text-[11px] uppercase tracking-[0.15em] text-background/40">
            © 2026 Bjørnerud Media. All rights reserved.
          </p>
          <p className="mono text-[11px] uppercase tracking-[0.15em] text-background/40">
            adchefs.com
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;