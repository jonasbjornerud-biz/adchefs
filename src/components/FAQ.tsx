import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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
    <section id="faq" className="py-28">
      <div className="container mx-auto px-6">
        <div className="text-center mb-6">
          <p className="text-xs uppercase tracking-[0.2em] text-[#7c3aed] mb-3 font-medium">Support</p>
          <h2 className="text-3xl md:text-4xl font-bold text-[#1a1a2e] mb-3">Frequently Asked Questions</h2>
          <p className="text-[#6b7280] max-w-md mx-auto text-sm">
            Everything you need to know about working with AdChefs
          </p>
        </div>

        <div className="w-full max-w-2xl mx-auto mt-14">
          <Accordion type="single" collapsible className="w-full space-y-3">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="rounded-xl border border-[#f0ecff] bg-white px-5 hover:!transform-none"
                style={{
                  boxShadow: '0 1px 3px rgba(139,92,246,0.04), 0 4px 12px rgba(139,92,246,0.04)',
                }}
              >
                <AccordionTrigger className="text-left text-sm font-medium text-[#1a1a2e] hover:text-[#7c3aed] py-4">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-[#6b7280] leading-relaxed pb-4">
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
