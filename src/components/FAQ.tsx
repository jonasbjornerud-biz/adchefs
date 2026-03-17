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
    question: "Do I get the same editors every time?",
    answer: "Yes. Your editors learn your brand, tone, and audience over time. They're not random freelancers — they're a consistent team assigned to your account.",
  },
  {
    question: "How fast is delivery?",
    answer: "Most videos are delivered within three to four business days. Your editors work full-time on your account, so turnaround stays consistent even at higher volumes.",
  },
  {
    question: "Can we use our own editors with your system?",
    answer: "Yes. Your editors can integrate into our workflow and use the same data-driven briefs, AI insights, and QA standards. You subscribe to the strategy layer only.",
  },
  {
    question: "What's included in each video?",
    answer: "Creative strategy, scripting, editing, and revision rounds. Your dedicated editors handle the full process from brief to final cut.",
  },
  {
    question: "Can you match our existing brand style?",
    answer: "Yes. We build customized SOPs based on your product research, ideal customer profiles, and brand assets. Every video follows your creative direction precisely.",
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
