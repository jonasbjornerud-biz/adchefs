const Footer = () => {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer className="border-t border-border/30 py-10">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-lg font-bold text-foreground">AdChefs</h3>
            <p className="text-xs text-muted-foreground mt-2 leading-relaxed max-w-xs">
              Dedicated video editors for e-commerce. Pay per video.
            </p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-foreground font-semibold mb-3">
              Links
            </p>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li>
                <button onClick={() => scrollTo("how-it-works")} className="hover:text-foreground transition-colors">
                  How It Works
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo("pricing")} className="hover:text-foreground transition-colors">
                  Pricing
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo("faq")} className="hover:text-foreground transition-colors">
                  FAQ
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo("booking")} className="hover:text-foreground transition-colors">
                  Book a Call
                </button>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-foreground font-semibold mb-3">
              Contact
            </p>
            <a
              href="mailto:jonas@adchefs.com"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              jonas@adchefs.com
            </a>
          </div>
        </div>

        <div className="border-t border-border/20 pt-5 text-center text-xs text-muted-foreground">
          <p>© 2026 Bjørnerud Media. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
