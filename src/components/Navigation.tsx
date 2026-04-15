import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";

const navLinks = [
  { label: "How It Works", id: "how-it-works" },
  { label: "FAQ", id: "faq" },
];

const Navigation = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
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
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        backgroundColor: scrolled ? "hsl(240 16% 6% / 0.8)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "1px solid transparent",
      }}
    >
      <div className="container mx-auto px-6 h-14 flex items-center justify-between">
        <span className="text-lg font-bold tracking-tight text-white">AdChefs</span>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => scrollToSection(link.id)}
              className="text-sm text-white/40 hover:text-white/80 transition-colors duration-200"
            >
              {link.label}
            </button>
          ))}
          <Button onClick={() => scrollToSection("booking")} variant="cta" size="sm">
            Book a Call
          </Button>
        </div>

        {/* Mobile toggle */}
        <div className="flex md:hidden items-center gap-3">
          <button onClick={() => setMobileOpen(!mobileOpen)} className="text-white">
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div
          className="md:hidden px-6 pb-6 pt-2 space-y-4 animate-fade-in"
          style={{ backgroundColor: "hsl(240 16% 6% / 0.95)", backdropFilter: "blur(20px)" }}
        >
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => scrollToSection(link.id)}
              className="block w-full text-left text-sm text-white/40 hover:text-white/80 transition-colors"
            >
              {link.label}
            </button>
          ))}
          <Button onClick={() => scrollToSection("booking")} variant="cta" size="sm" className="w-full">
            Book a Call
          </Button>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
