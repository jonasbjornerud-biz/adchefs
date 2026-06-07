import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "How does the pay-per-video model work?",
    a: "Flat rate per delivered video, starting at €100. You request cuts when you need them, the editor delivers, and you pay for what is approved. Most brands get 15 - 40 videos per month.",
  },
  {
    q: "What's included in the price?",
    a: "Full edit, sound design, captions, and revisions until approved, including different formats and resolutions. You also get a private performance dashboard with performance oversight of all ads and the editors' deliverables over time.",
  },
  {
    q: "How fast is turnaround?",
    a: "As fast as 12 hours from brief to first draft. Revisions are typically handled within 6 hours from feedback is given, depending on the time of day.",
  },
  {
    q: "Can you match our existing brand style?",
    a: "Yes. I personally onboard the editor on your brand before they start. We align on your previous winners, internal SOP's and brand identity, and I build a full playbook for the editors based on that. The first edits are calibration, before the editor fully adapts to your brand and products.",
  },
  {
    q: "Who owns the footage and final videos?",
    a: "You do. Full IP transfer on delivery. You keep the raw files, project files and exports.",
  },
  {
    q: "What if I don't click with the editor?",
    a: "You get a new one, no questions asked. I only win if the match works, so I'd rather swap early than force a bad fit.",
  },
  {
    q: "What tools do your editors use?",
    a: "Primarily Adobe Premiere Pro and After Effects, trained with our internal SOP's tailored to your brand. Delivered through Frame.io, Drive, or wherever you live. We adapt to your workflow, not the other way around.",
  },
  {
    q: "Do you sign NDAs?",
    a: "Yes. Happy to sign non-competes for direct category competitors too.",
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