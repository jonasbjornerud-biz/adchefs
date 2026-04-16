const footerLinks = [
  { label: "How It Works", id: "how-it-works" },
  { label: "Pricing", id: "pricing" },
  { label: "FAQ", id: "faq" },
];

const Footer = () => {
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer className="border-t border-border py-10 bg-white">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-6">
          <span className="text-lg font-bold text-foreground">AdChefs</span>
          <div className="flex gap-6">
            {footerLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollToSection(link.id)}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                {link.label}
              </button>
            ))}
          </div>
        </div>
        <div className="border-t border-border mt-6 pt-6 text-center text-xs text-muted-foreground">
          © 2025 AdChefs / Bjørnerud Media. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
