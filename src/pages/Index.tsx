import { useState } from "react";
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import FAQ from "@/components/FAQ";
import CalendlyBooking from "@/components/CalendlyBooking";
import Footer from "@/components/Footer";
import LoadingScreen from "@/components/LoadingScreen";

const Index = () => {
  const [videosLoaded, setVideosLoaded] = useState(false);

  return (
    <>
      {!videosLoaded && <LoadingScreen />}
      
      {/* Fixed gradient background */}
      <div className="site-gradient-bg" />
      
      {/* Page content */}
      <div className={`min-h-screen relative z-10 transition-opacity duration-500 ${videosLoaded ? 'opacity-100' : 'opacity-0'}`}>
        <Navigation />
        <Hero onVideosLoaded={() => setVideosLoaded(true)} />
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
