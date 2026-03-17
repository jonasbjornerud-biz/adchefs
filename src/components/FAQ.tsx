import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "How does the pay-per-video model work?",
    answer: "You get dedicated full-time editors assigned to your brand, but instead of a monthly retainer, you only pay for each video we deliver. It's the consistency of an in-house team with the flexibility of project-based pricing.",
  },
  {
    question: "What's included in each video?",
    answer: "Every video includes creative strategy, scripting, editing, and revisions. Your dedicated editors handle everything from concept to final cut.",
  },
  {
    question: "How fast do you deliver?",
    answer: "Most videos are delivered within 48 hours. Your editors work full-time on your account, so turnaround is fast and consistent.",
  },
  {
    question: "Do I get the same editors every time?",
    answer: "Yes. We assign dedicated editors to your brand so they learn your style, tone, and audience. You're not getting random freelancers — you're getting a team.",
  },
  {
    question: "Do you offer volume pricing?",
    answer: "Yes. The more videos you need, the lower the per-video cost. Book a call and we'll build a plan around your volume.",
  },
  {
    question: "What if I'm not happy with a video?",
    answer: "Every video comes with unlimited revisions until you're satisfied. Your editors won't move on until it's right.",
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
