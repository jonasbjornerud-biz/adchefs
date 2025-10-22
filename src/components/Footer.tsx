const Footer = () => {
  return (
    <footer className="bg-background/80 backdrop-blur-sm text-foreground py-12 border-t border-border/50">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-xl font-bold mb-4 text-foreground">AdChefs</h3>
            <p className="text-sm text-muted-foreground">
              AI-powered video production for modern e-commerce brands.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 text-foreground">Services</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Video Production</li>
              <li>AI Automation</li>
              <li>Creative Strategy</li>
              <li>Post-Production</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 text-foreground">Company</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>About Us</li>
              <li>Case Studies</li>
              <li>Careers</li>
              <li>Contact</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 text-foreground">Legal</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Privacy Policy</li>
              <li>Terms of Service</li>
              <li>Cookie Policy</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-border/30 pt-8 text-center text-sm text-muted-foreground">
          <p>© 2024 AdChefs. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
