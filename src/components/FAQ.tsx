import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "What counts as a concept?",
    a: "A genuinely distinct angle: new story, new format, or new awareness level. Hook variations and cutdowns of the same concept are included with it, not counted separately.",
  },
  {
    q: "Do I get finished videos or just briefs?",
    a: "Finished videos. Every concept ships as a ready-to-launch ad in the ratios you need. Strategy decks alone do not move ROAS.",
  },
  {
    q: "How often do batches ship?",
    a: "Weekly. New concepts are briefed every week and built from the previous week's read.",
  },
  {
    q: "What data do you need access to?",
    a: "Read access to your Meta ad account. I build angles from your own winners and your competitors' public ad libraries.",
  },
  {
    q: "Who does the editing?",
    a: "A vetted editor I recruited, trained on direct response, and embedded in your Slack and Notion. They work only on your account. I manage quality and performance behind the scenes.",
  },
  {
    q: "What if a concept flops?",
    a: "Some will. Only a small share of ads becomes a real winner at any spend level, which is why the loop exists. Losers tell the next batch what to make instead.",
  },
  {
    q: "Is there a contract or minimum?",
    a: "Monthly. Pause or cancel before the next batch is briefed.",
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
