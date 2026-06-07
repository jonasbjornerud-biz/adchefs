import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "How does the pay-per-video model work?",
    a: "Flat rate per delivered video, starting at €100. No retainer, no minimum. You request cuts when you need them, the editor delivers, you pay for what ships and is approved. Most brands end up ordering 15–40 videos a month once we're dialed in.",
  },
  {
    q: "What's included in the price?",
    a: "Full edit, sound design, captions, revisions until approved, delivery in your formats. Plus a private performance dashboard, direct line to your editor, and my oversight on quality and strategy — all free.",
  },
  {
    q: "How fast is turnaround?",
    a: "48–72 hours brief to first draft. Revisions usually same-day. Rush work — talk to me on the call, we can almost always accommodate.",
  },
  {
    q: "Can you match our existing brand style?",
    a: "Yes. I personally onboard the editor on your brand before they start — past winners, visual style, tone, do's and don'ts. First few cuts are calibration. After that, it looks like you made it in-house.",
  },
  {
    q: "Who owns the footage and final videos?",
    a: "You do. Full IP transfer on delivery. Raw files, project files, exports — yours. I keep nothing proprietary.",
  },
  {
    q: "What if I don't click with the editor?",
    a: "You get a new one, no questions asked. I only win if the match works, so I'd rather swap early than force a bad fit.",
  },
  {
    q: "What tools do your editors use?",
    a: "Primarily Adobe Premiere Pro and After Effects. Briefed through Notion or your system. Delivered through Frame.io, Drive, or wherever you live. We adapt to your workflow, not the other way around.",
  },
  {
    q: "Do you sign NDAs?",
    a: "Yes. Happy to sign non-competes for direct category competitors too. Use your paperwork or mine.",
  },
];

const FAQ = () => {
  return (
    <section id="faq" className="py-24 sm:py-32 bg-background">
      <div className="mx-auto max-w-[1100px] px-6">
        <div className="grid md:grid-cols-[1fr_1.6fr] gap-12">
          <div>
            <span className="eyebrow">FAQ</span>
            <h2 className="mt-5 font-display text-[32px] md:text-[40px] leading-[1.05] tracking-[-0.02em] text-foreground">
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