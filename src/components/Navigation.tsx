import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import adchefsLogo from "@/assets/adchefs-logo.png.asset.json";

const navLinks = [
  { label: "How it works", id: "how-it-works" },
  { label: "Pricing", id: "pricing" },
  { label: "FAQ", id: "faq" },
];

const Navigation = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
    setMobileOpen(false);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/85 backdrop-blur-xl border-b border-foreground/10"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="mx-auto max-w-[1200px] px-6 h-16 md:h-28 flex items-center justify-between">
        <a href="/" className="flex items-center" aria-label="AdChefs">
          <img src={adchefsLogo.url} alt="AdChefs" className="h-12 md:h-28 w-auto max-h-none" />
        </a>

        <div className="hidden md:flex items-center gap-9">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => scrollToSection(link.id)}
              className="text-[13px] text-foreground/70 hover:text-foreground transition-colors"
            >
              {link.label}
            </button>
          ))}
          <Button onClick={() => scrollToSection("booking")} variant="cta" size="sm">
            Book a call
          </Button>
        </div>

        <div className="flex md:hidden items-center gap-3">
          <button onClick={() => setMobileOpen(!mobileOpen)} className="text-foreground" aria-label="Toggle menu">
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-background/95 backdrop-blur-xl border-b border-foreground/10 px-6 pb-6 pt-3 space-y-4">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => scrollToSection(link.id)}
              className="block w-full text-left text-sm text-foreground/70 hover:text-foreground"
            >
              {link.label}
            </button>
          ))}
          <Button onClick={() => scrollToSection("booking")} variant="cta" size="sm" className="w-full">
            Book a call
          </Button>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
