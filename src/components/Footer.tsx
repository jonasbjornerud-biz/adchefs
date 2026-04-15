const Footer = () => {
  return (
    <footer className="border-t border-border/30 py-8" role="contentinfo">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
          <div>
            <span className="font-heading text-lg font-bold text-foreground">AdChefs</span>
            <p className="text-xs text-muted-foreground mt-1 max-w-xs">
              AI-powered video production for modern e-commerce brands.
            </p>
          </div>
          <nav className="flex gap-6 text-xs text-muted-foreground" aria-label="Footer">
            <a href="#" className="hover:text-foreground transition-colors duration-200">Privacy Policy</a>
            <a href="#" className="hover:text-foreground transition-colors duration-200">Terms of Service</a>
          </nav>
        </div>
        <div className="border-t border-border/20 pt-4 text-center text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} AdChefs. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
