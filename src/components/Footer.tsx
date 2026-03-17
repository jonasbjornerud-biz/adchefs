const Footer = () => {
  return (
    <footer className="bg-background/80 backdrop-blur-sm text-foreground py-8 border-t border-border/50">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
          <div>
            <h3 className="text-xl font-bold text-foreground">AdChefs</h3>
            <p className="text-sm text-muted-foreground">Dedicated editors. Pay per video.</p>
          </div>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <span className="hover:text-foreground cursor-pointer transition-colors">Privacy Policy</span>
            <span className="hover:text-foreground cursor-pointer transition-colors">Terms of Service</span>
          </div>
        </div>
        <div className="border-t border-border/30 pt-4 text-center text-sm text-muted-foreground">
          <p>© 2025 AdChefs. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
