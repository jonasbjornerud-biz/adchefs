import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import WhyAdChefs from "@/components/WhyAdChefs";
import CalendlyBooking from "@/components/CalendlyBooking";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import SEO from "@/components/SEO";
import TwoWaysToWork from "@/components/TwoWaysToWork";
import ResultsMarquee from "@/components/ResultsMarquee";
import MeVsAgency from "@/components/MeVsAgency";
import ProblemSection from "@/components/ProblemSection";

import FAQ from "@/components/FAQ";
import CSFinalCTA from "@/components/cs/CSFinalCTA";

const FAQ_ITEMS: Array<{ q: string; a: string }> = [
  { q: "What counts as a concept?", a: "A genuinely distinct angle: new story, new format, or new awareness level. Hook variations and cutdowns of the same concept are included with it, not counted separately." },
  { q: "Do I get finished videos or just briefs?", a: "Finished videos. Every concept ships as a ready-to-launch ad in the ratios you need. Strategy decks alone do not move ROAS." },
  { q: "How often do batches ship?", a: "Weekly. New concepts are briefed every week and built from the previous week's read." },
  { q: "What data do you need access to?", a: "Read access to your Meta ad account. I build angles from your own winners and your competitors' public ad libraries." },
  { q: "Who does the editing?", a: "A vetted editor I recruited, trained on direct response, and embedded in your Slack and Notion. They work only on your account. I manage quality and performance behind the scenes." },
  { q: "What if a concept flops?", a: "Some will. Only a small share of ads becomes a real winner at any spend level, which is why the loop exists. Losers tell the next batch what to make instead." },
  { q: "Is there a contract or minimum?", a: "Monthly. Pause or cancel before the next batch is briefed." },
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
      <ScrollReveal><ProblemSection /></ScrollReveal>
      <ScrollReveal><WhyAdChefs /></ScrollReveal>
      
      <ScrollReveal><TwoWaysToWork /></ScrollReveal>
      <ScrollReveal><ResultsMarquee /></ScrollReveal>
      <ScrollReveal><MeVsAgency /></ScrollReveal>
      <ScrollReveal><CalendlyBooking /></ScrollReveal>
      <ScrollReveal><FAQ /></ScrollReveal>
      <ScrollReveal><CSFinalCTA /></ScrollReveal>
      <Footer />
    </div>
  );
};

export default Index;
