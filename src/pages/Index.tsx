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

      {/* Subtle floating orbs */}
      <div className="fixed inset-0 z-[1] pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="absolute top-[15%] left-[10%] w-[400px] h-[400px] rounded-full bg-accent opacity-[0.04] blur-[140px] animate-[float-orb_20s_ease-in-out_infinite]" />
        <div className="absolute top-[50%] right-[5%] w-[350px] h-[350px] rounded-full bg-accent opacity-[0.03] blur-[130px] animate-[float-orb_24s_ease-in-out_4s_infinite]" />
        <div className="absolute top-[75%] left-[30%] w-[450px] h-[450px] rounded-full bg-accent opacity-[0.03] blur-[150px] animate-[float-orb_28s_ease-in-out_8s_infinite]" />
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
