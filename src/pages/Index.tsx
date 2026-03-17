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
      
      {/* Decorative floating orbs */}
      <div className="fixed inset-0 z-[1] pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="absolute top-[10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-[hsl(260_100%_62%)] opacity-[0.07] blur-[120px] will-change-transform animate-[float-orb_18s_ease-in-out_infinite]" />
        <div className="absolute top-[40%] right-[-10%] w-[450px] h-[450px] rounded-full bg-[hsl(270_80%_55%)] opacity-[0.07] blur-[140px] will-change-transform animate-[float-orb_22s_ease-in-out_3s_infinite]" />
        <div className="absolute top-[70%] left-[20%] w-[600px] h-[600px] rounded-full bg-[hsl(240_70%_50%)] opacity-[0.07] blur-[150px] will-change-transform animate-[float-orb_25s_ease-in-out_7s_infinite]" />
        <div className="absolute top-[25%] left-[50%] w-[350px] h-[350px] rounded-full bg-[hsl(280_90%_60%)] opacity-[0.05] blur-[130px] will-change-transform animate-[float-orb_20s_ease-in-out_10s_infinite]" />
        <div className="absolute top-[85%] right-[15%] w-[400px] h-[400px] rounded-full bg-[hsl(250_80%_55%)] opacity-[0.06] blur-[135px] will-change-transform animate-[float-orb_16s_ease-in-out_5s_infinite]" />
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
