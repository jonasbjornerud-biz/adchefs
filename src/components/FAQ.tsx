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
    <section id="faq" className="relative py-16 sm:py-32 bg-background overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 55% at 50% 40%, rgba(158,216,245,0.12), transparent 65%)",
        }}
      />

      <div className="relative mx-auto max-w-[1100px] px-6">
        <div className="grid md:grid-cols-[1fr_1.65fr] gap-10 md:gap-14">
          <div className="md:sticky md:top-32 md:self-start">
            <span className="eyebrow">FAQ</span>
            <h2 className="mt-5 font-display text-[32px] md:text-[42px] leading-[1.05] tracking-[-0.02em] text-foreground">
              Things people <em className="font-serif">actually</em> ask.
            </h2>
            <p className="mt-5 text-[15px] text-muted-foreground leading-relaxed">
              If you're not ready to book yet, these usually cover what's left.
            </p>
          </div>

          <div>
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((f, i) => (
                <AccordionItem
                  key={i}
                  value={`item-${i}`}
                  className="group glass-card !rounded-[4px] mb-3 px-6 py-5 transition-all duration-200 hover:border-accent/40"
                >
                  <div
                    aria-hidden
                    className="absolute left-0 top-5 bottom-5 w-0.5 bg-accent rounded-full opacity-0 transition-opacity duration-200 group-data-[state=open]:opacity-100"
                  />
                  <AccordionTrigger className="text-[15px] md:text-[16px] font-medium text-foreground py-0">
                    <span className="flex items-start gap-4">
                      <span className="font-mono text-[11px] text-accent-deep mt-1.5">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="leading-snug">{f.q}</span>
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="text-[14px] md:text-[15px] text-muted-foreground leading-relaxed pl-[34px]">
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
