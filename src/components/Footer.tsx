const Footer = () => {
  return (
    <footer className="section-steel border-t py-8" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
      <div className="max-w-[1440px] mx-auto px-8 relative z-10">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: "hsl(263 70% 50%)" }} />
            <span className="text-lg font-extrabold text-white tracking-tighter uppercase">AdChefs</span>
          </div>
          <div className="flex gap-8 mono-label text-white/20">
            <span className="hover:text-white/50 cursor-pointer transition-colors">Privacy.Policy</span>
            <span className="hover:text-white/50 cursor-pointer transition-colors">Terms.of.Service</span>
          </div>
        </div>
        <div className="border-t pt-4 text-center" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
          <p className="mono-label text-white/15">© 2024 ADCHEFS_CORE / VISUAL_ENGINEERING_LABS</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
