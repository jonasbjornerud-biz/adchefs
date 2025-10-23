import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "How does the AI-assisted video system work?",
    answer: "Our proprietary AI analyzes your brand guidelines, product catalog, and target audience to generate creative briefs and automate repetitive editing tasks. Elite editors then refine the output to ensure premium quality and brand consistency.",
  },
  {
    question: "What types of video content can you produce?",
    answer: "We specialize in product demos, social media ads, testimonial videos, tutorial content, unboxing videos, and brand storytelling. Our system is optimized for e-commerce and DTC brands across all major platforms.",
  },
  {
    question: "How quickly can you deliver completed videos?",
    answer: "Typical turnaround time is 3-5 business days for standard projects. Rush orders can be accommodated with 24-48 hour delivery. Our AI automation significantly reduces production time compared to traditional agencies.",
  },
  {
    question: "What's included in the monthly service?",
    answer: "Plans include unlimited revisions, dedicated account manager, platform-specific optimization (YouTube, Instagram, TikTok, etc.), brand guidelines integration, and access to our stock footage library. Custom packages available.",
  },
  {
    question: "Do you require a long-term contract?",
    answer: "No long-term contracts required. We offer flexible month-to-month plans. Most clients stay with us because of the results, not because they have to.",
  },
  {
    question: "Can you match our existing brand style?",
    answer: "Absolutely. Our onboarding process includes a deep dive into your brand guidelines, existing content, and style preferences. Our AI learns your brand language, and our editors ensure every video aligns perfectly with your vision.",
  },
];

const FAQ = () => {
  return (
    <section id="faq" className="py-24 bg-neutral-900/40">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 animate-slide-up">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Frequently Asked Questions</h2>
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
