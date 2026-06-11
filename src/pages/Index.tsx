import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import WhyAdChefs from "@/components/WhyAdChefs";
import HowItWorks from "@/components/HowItWorks";
import EditorEdge from "@/components/EditorEdge";
import Pricing from "@/components/Pricing";
import FAQ from "@/components/FAQ";
import CalendlyBooking from "@/components/CalendlyBooking";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      <Hero />
      <ScrollReveal><WhyAdChefs /></ScrollReveal>
        <ScrollReveal><HowItWorks /></ScrollReveal>
        <ScrollReveal><EditorEdge /></ScrollReveal>
      <ScrollReveal><Pricing /></ScrollReveal>
      <ScrollReveal><CalendlyBooking /></ScrollReveal>
      <ScrollReveal><FAQ /></ScrollReveal>
      <Footer />
    </div>
  );
};

export default Index;
