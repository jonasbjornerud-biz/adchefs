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
    <section id="faq" className="section-dark py-32">
      <BackgroundElements variant="dark" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-6">
          <p className="text-xs uppercase tracking-[0.25em] mb-3 font-medium" style={{ color: "hsl(262 83% 68%)" }}>
            Support
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">Frequently Asked Questions</h2>
          <p className="text-white/40 max-w-md mx-auto text-sm">
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
                className="rounded-2xl border border-white/[0.06] bg-white/[0.03] px-5 backdrop-blur-sm"
              >
                <AccordionTrigger className="text-left text-sm font-medium text-white/80 hover:text-white py-4 [&[data-state=open]]:text-white">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-white/40 leading-relaxed pb-4">
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
