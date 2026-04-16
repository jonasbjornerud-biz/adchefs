import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import EditorEdge from "@/components/EditorEdge";
import FAQ from "@/components/FAQ";
import CalendlyBooking from "@/components/CalendlyBooking";
import Footer from "@/components/Footer";
import ParallaxSection from "@/components/ParallaxSection";

const Index = () => {
  return (
    <>
      {/* Fixed gradient background */}
      <div className="site-gradient-bg" />

      {/* Page content */}
      <div className="min-h-screen relative z-10">
        <Navigation />
        <Hero />

        {/* How It Works — in-house experience (now first) */}
        <ParallaxSection speed={0.18}>
          <HowItWorks />
        </ParallaxSection>

        {/* Seamless transition band between dark sections */}
        <div
          className="relative h-24 -my-12 pointer-events-none"
          aria-hidden="true"
          style={{
            background:
              "linear-gradient(180deg, #09090f 0%, #0c0a18 50%, #09090f 100%)",
          }}
        >
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 60% 100% at 50% 50%, rgba(168,85,247,0.18) 0%, transparent 70%)",
            }}
          />
        </div>

        {/* What Sets Us Apart — now second, parallax in opposite direction */}
        <ParallaxSection speed={-0.18}>
          <EditorEdge />
        </ParallaxSection>

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
