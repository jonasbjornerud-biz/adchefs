import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "How does the AI assisted video system work?",
    answer: "The system analyzes top performing ads from leading US brands in your niche. It identifies creative patterns, angles, and hooks that drive conversions. These insights are turned into structured briefs that guide editors toward faster and more consistent ad creation.",
  },
  {
    question: "What's the difference between Creative Strategy and the Editor Plan?",
    answer: "Creative Strategy focuses on concept direction, data analysis, and creative testing. The Editor Plan handles daily video production. You can choose one or combine both depending on your internal setup.",
  },
  {
    question: "Can we use our own editors with your system?",
    answer: "Yes. Your editors can fully integrate into our workflow and use the same data driven briefs, insights, and QA standards. You only subscribe to the strategy layer if you already have an editing team.",
  },
  {
    question: "How fast is onboarding and first delivery?",
    answer: "Onboarding takes seven to fourteen days. After your first brief is approved, finished videos are usually delivered within three to four business days depending on project volume.",
  },
  {
    question: "What's included in the monthly service?",
    answer: "You get structured creative briefs, video deliverables, AI backed insights, and feedback rounds within scope. Everything is managed in your dashboard for speed and transparency.",
  },
  {
    question: "Can you match our existing brand style?",
    answer: "Yes. We create customized SOPs based on your product research, ideal customer profiles, and brand assets. Editors follow these systems precisely so every video fits your tone and creative direction.",
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
