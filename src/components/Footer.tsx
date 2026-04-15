const Footer = () => {
  return (
    <footer className="relative mt-20">
      <div className="container mx-auto px-6">
        <div className="glass-card rounded-2xl px-8 py-10 md:px-12">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            {/* Brand */}
            <div>
              <h3 className="text-lg font-bold text-foreground mb-2">AdChefs</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                AI-powered video production for modern e-commerce brands.
              </p>
            </div>

            {/* Navigation */}
            <div>
              <h4 className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Navigation</h4>
              <div className="space-y-2 text-sm">
                <button onClick={() => document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" })} className="block text-muted-foreground hover:text-foreground transition-colors">How It Works</button>
                <button onClick={() => document.getElementById("faq")?.scrollIntoView({ behavior: "smooth" })} className="block text-muted-foreground hover:text-foreground transition-colors">FAQ</button>
                <button onClick={() => document.getElementById("booking")?.scrollIntoView({ behavior: "smooth" })} className="block text-muted-foreground hover:text-foreground transition-colors">Book a Call</button>
              </div>
            </div>

            {/* Legal */}
            <div>
              <h4 className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Legal</h4>
              <div className="space-y-2 text-sm">
                <span className="block text-muted-foreground hover:text-foreground cursor-pointer transition-colors">Privacy Policy</span>
                <span className="block text-muted-foreground hover:text-foreground cursor-pointer transition-colors">Terms of Service</span>
              </div>
            </div>
          </div>

          <div className="border-t border-border/20 pt-6 text-center text-xs text-muted-foreground">
            <p>© {new Date().getFullYear()} AdChefs. All rights reserved.</p>
          </div>
        </div>
      </div>

      <div className="h-8" />
    </footer>
  );
};

export default Footer;
