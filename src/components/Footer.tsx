import adchefsLogoLight from "@/assets/adchefs-logo-light.png.asset.json";
import adchefsLogoDark from "@/assets/adchefs-logo-dark.png.asset.json";

const NAV_ITEMS: Array<{ label: string; href: string; section?: boolean }> = [
  { label: "How it works", href: "/#how-it-works", section: true },
  { label: "Pricing", href: "/#pricing", section: true },
  { label: "Contact us", href: "/contact" },
  { label: "Careers", href: "/jobs" },
];

const Footer = ({ variant = "dark" }: { variant?: "dark" | "grey" }) => {
  const grey = variant === "grey";

  const open = (href: string, section?: boolean) => {
    if (section) {
      const id = href.replace("/#", "");
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
        return;
      }
    }
    window.location.href = href;
  };

  return (
    <footer
      className={`pt-12 sm:pt-20 pb-10 ${
        grey
          ? "bg-[#EEEDE8]/85 text-foreground border-t border-foreground/10 backdrop-blur-sm"
          : "bg-foreground text-background"
      }`}
    >
      <div className="mx-auto max-w-[1200px] px-6">
        <div className="grid md:grid-cols-[1.5fr_1fr_1fr] gap-10 md:gap-12 mb-16">
          <div>
            <img
              src={grey ? adchefsLogoDark.url : adchefsLogoLight.url}
              alt="AdChefs logo"
              className="h-12 md:h-14 w-auto"
            />
            <p className={`mt-4 text-[14px] leading-relaxed max-w-sm ${grey ? "text-foreground/70" : "text-background/60"}`}>
              Creative strategy and production for DTC brands. Concepts engineered from performance data, shipped as finished videos.
            </p>
          </div>

          <div>
            <p className={`mono text-[11px] uppercase tracking-[0.15em] mb-4 ${grey ? "text-foreground/50" : "text-background/50"}`}>
              Navigate
            </p>
            <ul className={`space-y-2.5 text-[14px] ${grey ? "text-foreground/80" : "text-background/80"}`}>
              {NAV_ITEMS.map((item) => (
                <li key={item.label}>
                  <button
                    onClick={() => open(item.href, item.section)}
                    className={`transition-colors ${grey ? "hover:text-foreground" : "hover:text-accent"}`}
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className={`mono text-[11px] uppercase tracking-[0.15em] mb-4 ${grey ? "text-foreground/50" : "text-background/50"}`}>
              Contact
            </p>
            <a
              href="mailto:jonas@adchefs.com"
              className={`text-[14px] block transition-colors ${grey ? "text-foreground/80 hover:text-foreground" : "text-background/80 hover:text-accent"}`}
            >
              jonas@adchefs.com
            </a>
            <p className={`mt-3 mono text-[11px] uppercase tracking-[0.15em] ${grey ? "text-foreground/50" : "text-background/50"}`}>
              Based in Norway
            </p>
          </div>
        </div>

        <div className={`pt-8 border-t flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${grey ? "border-foreground/10" : "border-background/10"}`}>
          <p className={`mono text-[11px] uppercase tracking-[0.15em] ${grey ? "text-foreground/40" : "text-background/40"}`}>
            © 2026 Bjørnerud Media. All rights reserved.
          </p>
          <p className={`mono text-[11px] uppercase tracking-[0.15em] ${grey ? "text-foreground/40" : "text-background/40"}`}>
            adchefs.com
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
