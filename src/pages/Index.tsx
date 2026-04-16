import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import WhatSeparates from "@/components/WhatSeparates";
import Testimonials from "@/components/Testimonials";
import Pricing from "@/components/Pricing";
import FAQ from "@/components/FAQ";
import BookACall from "@/components/BookACall";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <Hero />
      <HowItWorks />
      <WhatSeparates />
      <Testimonials />
      <Pricing />
      <FAQ />
      <BookACall />
      <Footer />
    </div>
  );
};

export default Index;
