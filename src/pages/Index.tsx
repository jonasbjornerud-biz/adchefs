import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
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

        {/* How It Works — white/clean background */}
        <div className="section-band section-band-white">
          <div className="content-container">
            <HowItWorks />
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
