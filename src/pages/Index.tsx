import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import WhyAdChefs from "@/components/WhyAdChefs";
import HowItWorks from "@/components/HowItWorks";
import EditorEdge from "@/components/EditorEdge";
import Pricing from "@/components/Pricing";
import FAQ from "@/components/FAQ";
import CalendlyBooking from "@/components/CalendlyBooking";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <>
      {/* Fixed gradient background */}
      <div className="site-gradient-bg" />

      {/* Page content */}
      <div className="min-h-screen relative z-10">
        <Navigation />
        <Hero />
        <WhyAdChefs />

        {/* Dark "under the hood" zone: How It Works -> Editor Edge */}
        <div className="relative" style={{ background: "#09090f" }}>
          {/* Top fade: light -> dark */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-32 -translate-y-full"
            style={{ background: "linear-gradient(to bottom, hsl(var(--background)) 0%, #09090f 100%)" }}
          />
          <HowItWorks />
          <EditorEdge />
          {/* Bottom fade: dark -> light */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-32 translate-y-full"
            style={{ background: "linear-gradient(to bottom, #09090f 0%, hsl(0 0% 100%) 100%)" }}
          />
        </div>

        {/* Pricing — light background (matches hero) */}
        <div className="section-band section-band-white">
          <div className="content-container">
            <Pricing />
          </div>
        </div>

        {/* Booking — accent/purple tinted background */}
        <div className="section-band section-band-accent">
          <div className="content-container">
            <CalendlyBooking />
          </div>
        </div>

        {/* FAQ — white/clean background */}
        <div className="section-band section-band-white">
          <div className="content-container">
            <FAQ />
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
};

export default Index;
