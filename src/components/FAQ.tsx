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
        <div className="text-center mb-16">
          <p className="text-xs uppercase tracking-[0.2em] text-accent mb-4 font-medium">Support</p>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground">Frequently Asked Questions</h2>
        </div>

        <div className="max-w-2xl mx-auto space-y-3">
          <Accordion type="single" collapsible className="w-full space-y-3">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="glass-card px-6 hover:!transform-none"
              >
                <AccordionTrigger className="text-left text-sm font-medium hover:text-accent py-5">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-5">
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
