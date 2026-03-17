import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "How does the pay-per-video model work?",
    answer: "Simple — you pay for each video individually. No monthly fees, no retainers. Pick a package or request a custom quote, and we deliver.",
  },
  {
    question: "What's included in a single video order?",
    answer: "Every order includes creative strategy, scripting, editing, and revisions. We handle everything from concept to final cut.",
  },
  {
    question: "How fast do you deliver?",
    answer: "Most videos are delivered within 48 hours. Rush orders and bulk packages have flexible timelines based on scope.",
  },
  {
    question: "Can I order just one video?",
    answer: "Absolutely. That's the whole point. Order 1 video or 100 — there's no minimum commitment.",
  },
  {
    question: "Do you offer bulk discounts?",
    answer: "Yes. The more videos you order, the lower the per-video cost. Ask us about bundle pricing.",
  },
  {
    question: "What if I'm not happy with the result?",
    answer: "Every order comes with unlimited revisions until you're satisfied. We don't stop until it's right.",
  },
];

const FAQ = () => {
  return (
    <section id="faq" className="py-24 bg-secondary/30">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 animate-slide-up">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">Frequently Asked Questions</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Everything you need to know about working with AdChefs
          </p>
        </div>
        
        <div className="max-w-3xl mx-auto animate-slide-up">
          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="border border-border/50 rounded-lg px-6 bg-card/30 backdrop-blur-sm"
              >
                <AccordionTrigger className="text-left font-semibold hover:text-accent">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
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
