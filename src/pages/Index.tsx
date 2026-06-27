import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import WhyAdChefs from "@/components/WhyAdChefs";
import FAQ from "@/components/FAQ";
import CalendlyBooking from "@/components/CalendlyBooking";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import SEO from "@/components/SEO";
import TwoWaysToWork from "@/components/TwoWaysToWork";
import ResultsMarquee from "@/components/ResultsMarquee";
import MeVsAgency from "@/components/MeVsAgency";

const FAQ_ITEMS: Array<{ q: string; a: string }> = [
  { q: "How does the pay-per-video model work?", a: "You brief your editor, they deliver, you approve, you pay. From $100 per delivered video. No retainer, no minimum volume, no contract length. If you ship ten videos one month and two the next, that's what you pay for." },
  { q: "What's included in the price?", a: "The editor, their management, all software. Higgsfield, ElevenLabs, and professional editing subscriptions are covered by me. The performance dashboard is free. The only thing you pay for is delivered videos." },
  { q: "How fast is turnaround?", a: "24 to 48 hours standard per video. Complex or longer form work gets scoped on the call." },
  { q: "Can you match our existing brand style?", a: "Yes. Your editor goes through your brand folder, your past winners, and your ad account before the first cut. Matching your style is part of onboarding, not an extra." },
  { q: "Who owns the footage and final videos?", a: "You do. Everything delivered belongs to your brand. AdChefs is video editing only." },
  { q: "What if I don't click with the editor?", a: "Tell me and I replace them. Because I run the recruiting funnel continuously, a replacement is matched fast, and they onboard from your existing brand documentation rather than from zero." },
  { q: "What tools do your editors use?", a: "Premiere Pro, CapCut, or DaVinci Resolve depending on your format, plus Higgsfield and ElevenLabs where they lift performance. All licenses are on me." },
  { q: "Do you sign NDAs?", a: "Yes, standard practice. Your data, footage, and numbers stay inside your account." },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO
        title="AdChefs — Scale ad creative without hiring"
        description="Dedicated video editors for e-commerce brands doing over €5k/month in ad spend. Pay per delivered video. No retainers, no rotating freelancers."
        path="/"
        jsonLd={[
          {
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "AdChefs",
            url: "https://adchefs.com",
            logo: "https://adchefs.com/favicon.ico",
            description:
              "Dedicated video editors for e-commerce brands. Pay per video, no retainer.",
            founder: { "@type": "Person", name: "Jonas Bjørnerud" },
          },
          {
            "@context": "https://schema.org",
            "@type": "Service",
            name: "Dedicated video editor for e-commerce brands",
            serviceType: "Direct-response video editing",
            provider: {
              "@type": "Organization",
              name: "AdChefs",
              url: "https://adchefs.com",
            },
            areaServed: "Worldwide",
            offers: {
              "@type": "Offer",
              priceSpecification: {
                "@type": "PriceSpecification",
                price: 100,
                priceCurrency: "USD",
                minPrice: 100,
                unitText: "video",
              },
              url: "https://adchefs.com/#booking",
              availability: "https://schema.org/InStock",
            },
          },
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: FAQ_ITEMS.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          },
        ]}
      />
      <Navigation />
      <Hero />
      <ScrollReveal><WhyAdChefs /></ScrollReveal>
      <ScrollReveal><TwoWaysToWork /></ScrollReveal>
      <ScrollReveal><ResultsMarquee /></ScrollReveal>
      <ScrollReveal><MeVsAgency /></ScrollReveal>
      <ScrollReveal><CalendlyBooking /></ScrollReveal>
      <ScrollReveal><FAQ /></ScrollReveal>
      <Footer />
    </div>
  );
};

export default Index;
