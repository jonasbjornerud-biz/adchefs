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
import SEO from "@/components/SEO";

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO
        title="AdChefs — Scale ad creative without hiring"
        description="Dedicated video editors for e-commerce brands doing over €5k/month in ad spend. Pay per delivered video. No retainers, no rotating freelancers."
        path="/"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "AdChefs",
          url: "https://adchefs.lovable.app",
          logo: "https://adchefs.lovable.app/favicon.ico",
          description:
            "Dedicated video editors for e-commerce brands. Pay per video, no retainer.",
          founder: { "@type": "Person", name: "Jonas Bjørnerud" },
        }}
      />
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
