import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./ThemeToggle";
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
    const onScroll = () => setScrolled(window.scrollY > 20);
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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-250 ${
        scrolled
          ? "bg-background/80 backdrop-blur-2xl border-b border-border/40 shadow-sm"
          : "bg-transparent border-b border-transparent"
      }`}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        {/* UX: Active state — brand as home link */}
        <a
          href="#"
          onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }}
          className="font-heading text-xl font-bold tracking-tight text-foreground hover:text-primary transition-colors duration-200"
          aria-label="AdChefs — Back to top"
        >
          AdChefs
        </a>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => scrollToSection(link.id)}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-primary after:transition-all after:duration-250 hover:after:w-full"
            >
              {link.label}
            </button>
          ))}
          <ThemeToggle />
          <Button
            onClick={() => scrollToSection("booking")}
            variant="cta"
            size="sm"
            className="min-h-[44px] min-w-[44px] rounded-xl"
          >
            Book a Call
          </Button>
        </div>

        {/* Mobile — UX Guideline #22: 44px touch targets */}
        <div className="flex md:hidden items-center gap-2">
          <ThemeToggle />
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center text-foreground"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div
          className="md:hidden bg-background/95 backdrop-blur-2xl border-b border-border/40 px-6 pb-6 pt-2 space-y-1 animate-fade-in"
          role="menu"
        >
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => scrollToSection(link.id)}
              className="block w-full text-left py-3 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors min-h-[44px]"
              role="menuitem"
            >
              {link.label}
            </button>
          ))}
          <Button
            onClick={() => scrollToSection("booking")}
            variant="cta"
            size="sm"
            className="w-full min-h-[44px] rounded-xl mt-2"
          >
            Book a Call
          </Button>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
