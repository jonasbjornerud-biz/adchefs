import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import BackgroundElements from "./BackgroundElements";

const faqs = [
  {
    question: "How does the pay-per-video model work?",
    answer: "We assign dedicated full-time editors to your brand. Instead of a monthly retainer, you pay for each video delivered. Scale up or down based on what you need.",
  },
  {
    question: "Can you match our existing brand style?",
    answer: "Yes. We build customized SOPs based on your product research, ideal customer profiles, and brand assets. Every video follows your creative direction precisely.",
  },
  {
    question: "How many revisions are included?",
    answer: "Unlimited. We revise until you're happy with the final cut. There's no cap on revision rounds.",
  },
];

const FAQ = () => {
  return (
    <section id="faq" className="section-steel py-32 border-t" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
      <BackgroundElements />

      <div className="max-w-[1440px] mx-auto px-8 relative z-10">
        <div className="text-center mb-6">
          <div className="inline-block px-3 py-1 border mb-6" style={{ borderColor: "hsl(263 70% 50% / 0.3)", background: "hsl(263 70% 50% / 0.05)" }}>
            <span className="mono-label" style={{ color: "hsl(263 70% 50%)" }}>
              Knowledge Base // 004
            </span>
          </div>
          <h2
            className="font-extrabold text-white uppercase mb-3"
            style={{ fontSize: "clamp(2rem, 5vw, 4rem)", lineHeight: 0.9 }}
          >
            Frequently <span className="text-stroke">Asked</span>
          </h2>
          <p className="text-white/30 max-w-md mx-auto text-sm mt-4">
            Everything you need to know about working with AdChefs
          </p>
        </div>

        <div className="section-divider mb-14" />

        <div className="max-w-2xl mx-auto space-y-3">
          <Accordion type="single" collapsible className="w-full space-y-3">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="hud-card px-6"
              >
                <AccordionTrigger className="text-left text-sm font-semibold text-white/70 hover:text-white py-5 [&[data-state=open]]:text-white transition-colors">
                  <span className="flex items-center gap-4">
                    <span className="mono-label text-white/20 shrink-0">{String(index + 1).padStart(2, '0')}</span>
                    {faq.question}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="text-sm text-white/35 leading-relaxed pb-5 pl-10">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
