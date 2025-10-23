import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import CaseStudies from "@/components/CaseStudies";
import FAQ from "@/components/FAQ";
import CalendlyBooking from "@/components/CalendlyBooking";
import Footer from "@/components/Footer";
import DarkVeil from "@/components/ui/dark-veil";

const Index = () => {
  return (
    <>
      {/* Fixed WebGL background */}
      <div className="fixed inset-0 z-0">
        <DarkVeil 
          hueShift={0}
          noiseIntensity={0.15}
          speed={0.2}
          resolutionScale={0.8}
        />
      </div>
      
      {/* Page content */}
      <div className="min-h-screen relative z-10">
        <Navigation />
        <Hero />
        <div className="content-container my-8">
          <CaseStudies />
        </div>
        <div className="content-container my-8">
          <CalendlyBooking />
        </div>
        <div className="content-container my-8">
          <HowItWorks />
        </div>
        <div className="content-container my-8">
          <FAQ />
        </div>
        <Footer />
      </div>
    </>
  );
};

export default Index;
