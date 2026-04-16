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
      <div className="site-gradient-bg" />

      <div className="min-h-screen relative z-10">
        <Navigation />
        <Hero />

        <ScrollCrossfade outgoing={<HowItWorks />} incoming={<EditorEdge />} />

        <div className="section-band section-band-accent">
          <div className="content-container">
            <CalendlyBooking />
          </div>
        </div>

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
