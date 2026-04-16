import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "How are editors selected?",
    a: "Every editor goes through a multi-step vetting process. We evaluate editing skill, creative instinct, and — most importantly — their ability to understand performance metrics. Only editors who can think in terms of CTR, hook rate, and hold rate make it through.",
  },
  {
    q: "What happens if I'm not happy with my editor?",
    a: "You request a free replacement. No awkward conversations, no delays. We swap in a new editor who's already been briefed on your brand and KPI targets.",
  },
  {
    q: "Do I need to provide a brief or SOP?",
    a: "It helps, but it's not required. During onboarding, we work with you to build a lightweight creative brief that captures your brand, tone, and performance goals. Your editor uses this as their playbook.",
  },
  {
    q: "How long until my first video is delivered?",
    a: "Most clients receive their first video within 5–7 business days of onboarding. After that, delivery is on a rolling basis depending on your plan volume.",
  },
  {
    q: "What platforms do you create for?",
    a: "Primarily Meta (Facebook/Instagram) and TikTok. We can also adapt formats for YouTube Shorts, Pinterest, and other short-form platforms on request.",
  },
  {
    q: "Is there a contract or minimum commitment?",
    a: "No long-term contracts. You pay monthly and can cancel anytime. We believe our work keeps you — not a contract.",
  },
];

const FAQ = () => {
  return (
    <section id="faq" className="py-24 bg-white">
      <div className="container mx-auto px-6 max-w-2xl">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground mb-12 text-center">
          Frequently asked questions
        </h2>

        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`faq-${i}`} className="border-border">
              <AccordionTrigger className="text-left text-sm font-semibold text-foreground hover:no-underline cursor-pointer py-5">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-5">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default FAQ;
