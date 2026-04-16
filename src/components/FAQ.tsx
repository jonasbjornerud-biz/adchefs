import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "How does the pay-per-video model work?",
    answer:
      "You pay a flat rate per delivered video, starting at €100. No retainer, no minimum commitment. You request videos when you need them, your editor delivers, and you only pay for what ships and is approved. Most brands end up ordering 15 to 40 videos per month once we're dialed in.",
  },
  {
    question: "What's included in the price?",
    answer:
      "Every video includes full editing, sound design, captions, revisions until approved, and delivery in your preferred formats. You also get a private performance dashboard, direct communication with your editor, and my oversight on quality and strategy, all free.",
  },
  {
    question: "How fast is turnaround?",
    answer:
      "Standard turnaround is 48 to 72 hours from brief to first draft. Revisions are typically same-day. If you need faster, talk to me on the call. We can usually accommodate rush work.",
  },
  {
    question: "Can you match our existing brand style?",
    answer:
      "Yes. Before your editor starts, I personally onboard them on your brand: past winners, visual style, tone of voice, do's and don'ts. Your first few videos are calibration. After that, output looks like you made it in-house.",
  },
  {
    question: "Who owns the footage and final videos?",
    answer:
      "You do. Full IP transfer on delivery. Raw files, project files, and final exports are yours. I keep nothing proprietary.",
  },
  {
    question: "What if I don't like the editor I'm matched with?",
    answer:
      "You get a new one, no questions asked. I only win if the editor-brand match works, so I'd rather swap early than force a bad fit.",
  },
  {
    question: "What tools and software do your editors use?",
    answer:
      "Primarily Adobe Premiere Pro and After Effects. Editors are briefed through Notion or your preferred system and deliver through Frame.io, Google Drive, or whatever you use. We adapt to your workflow, not the other way around.",
  },
  {
    question: "Do you sign NDAs?",
    answer:
      "Yes, happy to. I also sign non-compete clauses for direct competitors in your category if needed. Bring your own agreement or use mine.",
  },
];

const FAQ = () => {
  return (
    <section id="faq" className="py-28">
      <div className="container mx-auto px-6">
        <div className="text-center mb-6">
          <p className="text-xs uppercase tracking-[0.2em] text-[#7c3aed] mb-3 font-medium">Support</p>
          <h2 className="text-3xl md:text-4xl font-bold text-[#1a1a2e] mb-3">Frequently Asked Questions</h2>
          <p className="text-[#6b7280] max-w-md mx-auto text-sm">
            Everything you need to know before booking a call.
          </p>
        </div>

        <div className="w-full max-w-2xl mx-auto mt-14">
          <Accordion type="single" collapsible className="w-full space-y-3">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="rounded-xl border border-[#f0ecff] bg-white px-5 hover:!transform-none"
                style={{
                  boxShadow: '0 1px 3px rgba(139,92,246,0.04), 0 4px 12px rgba(139,92,246,0.04)',
                }}
              >
                <AccordionTrigger className="text-left text-sm font-medium text-[#1a1a2e] hover:text-[#7c3aed] py-4">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-[#6b7280] leading-relaxed pb-4">
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
