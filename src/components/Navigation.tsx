import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./ThemeToggle";
import { Menu, X, ArrowRight } from "lucide-react";
import { useState } from "react";

const navLinks = [
  { label: "How It Works", id: "how-it-works" },
  { label: "FAQ", id: "faq" },
];

const Navigation = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
    setMobileOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/60 backdrop-blur-2xl border-b border-border/30 transition-colors duration-300">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        <span className="text-xl font-bold tracking-tight text-foreground">AdChefs</span>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => scrollToSection(link.id)}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
            >
              {link.label}
            </button>
          ))}
          <ThemeToggle />
          <Button
            onClick={() => scrollToSection("booking")}
            variant="cta"
            size="sm"
            className="rounded-full pl-4 pr-2 gap-2"
          >
            Book a Call
            <span className="w-7 h-7 rounded-full bg-accent-foreground/20 flex items-center justify-center">
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </Button>
        </div>

        {/* Mobile toggle */}
        <div className="flex md:hidden items-center gap-3">
          <ThemeToggle />
          <button onClick={() => setMobileOpen(!mobileOpen)} className="text-foreground">
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-background/95 backdrop-blur-2xl border-b border-border/30 px-6 pb-6 pt-2 space-y-4 animate-fade-in">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => scrollToSection(link.id)}
              className="block w-full text-left text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {link.label}
            </button>
          ))}
          <Button onClick={() => scrollToSection("booking")} variant="cta" size="sm" className="w-full rounded-full">
            Book a Call
          </Button>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
