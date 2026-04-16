import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import EditorEdge from "@/components/EditorEdge";
import FAQ from "@/components/FAQ";
import CalendlyBooking from "@/components/CalendlyBooking";
import Footer from "@/components/Footer";
import ScrollCrossfade from "@/components/ScrollCrossfade";

const Index = () => {
  return (
    <>
      {/* Fixed gradient background */}
      <div className="site-gradient-bg" />

      {/* Page content */}
      <div className="min-h-screen relative z-10">
        <Navigation />
        <Hero />

        {/*
          Cinematic scroll-driven cross-fade between the two dark sections.
          - "How it works" fades out + drifts up + scales down slightly
          - "What sets us apart" fades in + drifts up into place + scales to 1
          - Both layers overlap during the transition for a layered depth feel.
        */}
        <ScrollCrossfade
          overlap={0.7}
          outgoing={<HowItWorks />}
          incoming={<EditorEdge />}
        />

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
