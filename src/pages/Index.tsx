import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import FAQ from "@/components/FAQ";
import CalendlyBooking from "@/components/CalendlyBooking";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <>
      {/* Aurora UI background (#10) */}
      <div className="site-gradient-bg" aria-hidden="true" />

      {/* Floating aurora orbs */}
      <div className="fixed inset-0 z-[1] pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="absolute top-[12%] left-[8%] w-[400px] h-[400px] rounded-full bg-primary opacity-[0.04] blur-[140px] will-change-transform animate-[float-orb_18s_ease-in-out_infinite]" />
        <div className="absolute top-[45%] right-[5%] w-[350px] h-[350px] rounded-full bg-accent opacity-[0.03] blur-[130px] will-change-transform animate-[float-orb_22s_ease-in-out_4s_infinite]" />
        <div className="absolute top-[72%] left-[25%] w-[450px] h-[450px] rounded-full bg-primary opacity-[0.03] blur-[150px] will-change-transform animate-[float-orb_26s_ease-in-out_9s_infinite]" />
      </div>

      {/* Main content — z-10 above background */}
      <main className="min-h-screen relative z-10">
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
      </main>
    </>
  );
};

export default Index;
