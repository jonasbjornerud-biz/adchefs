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
      
      {/* Decorative background orbs */}
      <div className="fixed inset-0 z-[1] pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="absolute top-[10%] left-[5%] w-[500px] h-[500px] rounded-full bg-[hsl(260_100%_62%)] opacity-[0.07] blur-[120px]" />
        <div className="absolute top-[50%] right-[5%] w-[400px] h-[400px] rounded-full bg-[hsl(270_80%_55%)] opacity-[0.07] blur-[140px]" />
        <div className="absolute bottom-[10%] left-[30%] w-[600px] h-[600px] rounded-full bg-[hsl(240_70%_50%)] opacity-[0.07] blur-[150px]" />
      </div>
      
      {/* Page content */}
      <div className="min-h-screen relative z-10">
        <Navigation />
        <Hero />
        <div className="content-container my-8">
          <HowItWorks />
        </div>
        <div className="content-container my-8">
          <CalendlyBooking />
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
