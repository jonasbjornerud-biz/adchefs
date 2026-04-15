const Footer = () => {
  return (
    <footer className="border-t border-border/30 py-8">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
          <div>
            <h3 className="text-lg font-bold text-foreground">AdChefs</h3>
            <p className="text-xs text-muted-foreground mt-1">
              AI-powered video production for modern e-commerce brands.
            </p>
          </div>
          <div className="flex gap-6 text-xs text-muted-foreground">
            <span className="hover:text-foreground cursor-pointer transition-colors">Privacy Policy</span>
            <span className="hover:text-foreground cursor-pointer transition-colors">Terms of Service</span>
          </div>
        </div>
        <div className="border-t border-border/20 pt-4 text-center text-xs text-muted-foreground">
          <p>© 2024 AdChefs. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
