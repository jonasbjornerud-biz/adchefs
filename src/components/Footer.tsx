const Footer = () => {
  return (
    <footer className="section-dark border-t border-white/[0.06] py-8">
      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
          <div>
            <h3 className="text-lg font-bold text-white">AdChefs</h3>
            <p className="text-xs text-white/30 mt-1">
              AI-powered video production for modern e-commerce brands.
            </p>
          </div>
          <div className="flex gap-6 text-xs text-white/30">
            <span className="hover:text-white/60 cursor-pointer transition-colors">Privacy Policy</span>
            <span className="hover:text-white/60 cursor-pointer transition-colors">Terms of Service</span>
          </div>
        </div>
        <div className="border-t border-white/[0.06] pt-4 text-center text-xs text-white/20">
          <p>© 2024 AdChefs. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
