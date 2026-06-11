import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "How does the pay-per-video model work?",
    a: "You brief your editor, they deliver, you approve, you pay. From $100 per delivered video. No retainer, no minimum volume, no contract length. If you ship ten videos one month and two the next, that's what you pay for.",
  },
  {
    q: "What's included in the price?",
    a: "The editor, their management, all software. Higgsfield, ElevenLabs, and professional editing subscriptions are covered by me. The performance dashboard is free. The only thing you pay for is delivered videos.",
  },
  {
    q: "How fast is turnaround?",
    a: "24 to 48 hours standard per video. Complex or longer form work gets scoped on the call.",
  },
  {
    q: "Can you match our existing brand style?",
    a: "Yes. Your editor goes through your brand folder, your past winners, and your ad account before the first cut. Matching your style is part of onboarding, not an extra.",
  },
  {
    q: "Who owns the footage and final videos?",
    a: "You do. Everything delivered belongs to your brand. AdChefs is video editing only.",
  },
  {
    q: "What if I don't click with the editor?",
    a: "Tell me and I replace them. Because I run the recruiting funnel continuously, a replacement is matched fast, and they onboard from your existing brand documentation rather than from zero.",
  },
  {
    q: "What tools do your editors use?",
    a: "Premiere Pro, CapCut, or DaVinci Resolve depending on your format, plus Higgsfield and ElevenLabs where they lift performance. All licenses are on me.",
  },
  {
    q: "Do you sign NDAs?",
    a: "Yes, standard practice. Your data, footage, and numbers stay inside your account.",
  },
];

const FAQ = () => {
  return (
    <section id="faq" className="py-16 sm:py-32 bg-background">
      <div className="mx-auto max-w-[1100px] px-6">
        <div className="grid md:grid-cols-[1fr_1.6fr] gap-8 md:gap-12">
          <div>
            <span className="eyebrow">FAQ</span>
            <h2 className="mt-5 font-display text-[32px] md:text-[40px] leading-[1.05] tracking-[-0.02em] text-foreground md:whitespace-nowrap">
              Things people <em>actually</em> ask.
            </h2>
            <p className="mt-5 text-[15px] text-muted-foreground leading-relaxed">
              If you're not ready to book yet, these usually cover what's left.
            </p>
          </div>

          <div>
            <Accordion type="single" collapsible className="w-full space-y-2">
              {faqs.map((f, i) => (
                <AccordionItem
                  key={i}
                  value={`item-${i}`}
                  className="border border-foreground/10 rounded-[4px] px-5 bg-card"
                >
                  <AccordionTrigger className="text-left text-[15px] font-medium text-foreground hover:no-underline py-5">
                    {f.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-[14px] text-muted-foreground leading-relaxed pb-5">
                    {f.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
