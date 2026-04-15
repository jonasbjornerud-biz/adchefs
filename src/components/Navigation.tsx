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
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b"
      style={{
        backgroundColor: scrolled ? "hsl(240 6% 4% / 0.85)" : "hsl(240 6% 4% / 0.4)",
        backdropFilter: scrolled ? "blur(24px)" : "blur(8px)",
        borderColor: "rgba(255,255,255,0.05)",
      }}
    >
      <div className="max-w-[1440px] mx-auto px-8 h-20 flex items-center justify-between">
        <div className="flex items-center gap-12">
          <div className="text-xl font-extrabold tracking-tighter uppercase flex items-center gap-2 text-white">
            <div className="w-3 h-3 rounded-full animate-pulse" style={{ backgroundColor: "hsl(263 70% 50%)" }} />
            AdChefs
          </div>
          <div className="hidden md:flex gap-8">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollToSection(link.id)}
                className="mono-label text-white/40 hover:text-white/80 transition-colors duration-200"
              >
                {link.label}
              </button>
            ))}
          </div>
        </div>

        <div className="hidden md:flex items-center gap-6">
          <span className="mono-label text-white/20 hidden lg:block">
            STATUS: ACCEPTING_CLIENTS
          </span>
          <button
            onClick={() => scrollToSection("booking")}
            className="plasma-button px-6 py-2.5 text-xs"
          >
            Initialize Project
          </button>
        </div>

        {/* Mobile toggle */}
        <div className="flex md:hidden items-center">
          <button onClick={() => setMobileOpen(!mobileOpen)} className="text-white">
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div
          className="md:hidden px-8 pb-6 pt-2 space-y-4 animate-fade-in border-t"
          style={{ backgroundColor: "hsl(240 6% 4% / 0.95)", backdropFilter: "blur(24px)", borderColor: "rgba(255,255,255,0.05)" }}
        >
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => scrollToSection(link.id)}
              className="block w-full text-left mono-label text-white/40 hover:text-white/80 transition-colors"
            >
              {link.label}
            </button>
          ))}
          <button
            onClick={() => { scrollToSection("booking"); setMobileOpen(false); }}
            className="plasma-button w-full py-3 text-xs"
          >
            Initialize Project
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
