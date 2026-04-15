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
    <section id="faq" className="py-28" aria-labelledby="faq-heading">
      <div className="container mx-auto px-6">
        <div className="text-center mb-6 animate-slide-up">
          <p className="section-label">Support</p>
          <h2 id="faq-heading" className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-3">
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto text-sm leading-relaxed">
            Everything you need to know about working with AdChefs
          </p>
        </div>

        <div className="section-divider mb-14" aria-hidden="true" />

        <div className="max-w-2xl mx-auto">
          <Accordion type="single" collapsible className="w-full space-y-3">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="glass-card px-5 hover:!transform-none data-[state=open]:border-primary/20"
              >
                <AccordionTrigger className="text-left text-sm font-medium hover:text-primary transition-colors duration-200 py-4 [&>svg]:text-primary/50">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-4">
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
