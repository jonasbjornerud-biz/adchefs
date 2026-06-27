import { useState } from "react";
import { Plus, Minus } from "lucide-react";

const faqs: { q: string; a: string }[] = [
  {
    q: "What counts as a delivered video?",
    a: "One finished ad, cut to your brief, in the ratios you need. Hook variations and platform cutdowns of that same ad are bundled in, not billed as separate videos.",
  },
  {
    q: "What is a revision versus a new brief?",
    a: "A revision changes what you already briefed: trims, captions, pacing, swaps. A new brief is a different concept, hook, or script. Revisions run until you approve. A new brief is a new video.",
  },
  {
    q: "How fast do videos come back?",
    a: "24 to 48 hours is the standard on a briefed cut. Longer or more complex pieces get a timeline up front.",
  },
  {
    q: "What if the editor is not clicking?",
    a: "I replace them fast. Same price, same pace, I handle the swap and the ramp.",
  },
  {
    q: "Do I pay for software or AI tools?",
    a: "No. Editing tools, licenses, and AI tools sit on AdChefs. The only line on your bill is the work.",
  },
  {
    q: "Is there a contract or minimum?",
    a: "No retainer, no minimum, cancel whenever. You pay per delivered video.",
  },
  {
    q: "How is this different from creative direction?",
    a: "Editor placement is execution: you bring the direction, the editor ships the volume. Creative direction is me owning the angles, briefs, and the performance read, priced on the call.",
  },
];

const EditorPlacementFAQ = () => {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="py-20 sm:py-32" style={{ background: "#F7F6F3" }}>
      <div className="mx-auto max-w-[860px] px-6">
        <span className="eyebrow eyebrow-accent">COMMON QUESTIONS</span>
        <h2
          className="mt-6 text-[36px] md:text-[52px] leading-[1.05] tracking-[-0.025em] font-semibold"
          style={{ fontFamily: "'Inter Tight', sans-serif", color: "#1A1A1A" }}
        >
          Questions before you{" "}
          <em
            style={{
              fontFamily: "'Instrument Serif', serif",
              fontStyle: "italic",
              fontWeight: 400,
            }}
          >
            book
          </em>
          .
        </h2>

        <ul className="mt-12 space-y-3">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <li
                key={f.q}
                className="rounded-[4px] border transition-colors"
                style={{
                  background: "#FFFFFF",
                  borderColor: isOpen ? "#9ED8F5" : "rgba(26,26,26,0.10)",
                }}
              >
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                  aria-expanded={isOpen}
                >
                  <span
                    className="text-[17px] md:text-[18px] font-medium"
                    style={{
                      fontFamily: "'Inter Tight', sans-serif",
                      color: "#1A1A1A",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {f.q}
                  </span>
                  <span
                    className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-[4px]"
                    style={{
                      background: isOpen ? "#9ED8F5" : "#EEEDE8",
                      color: "#1A1A1A",
                    }}
                  >
                    {isOpen ? <Minus className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
                  </span>
                </button>
                <div
                  className="grid overflow-hidden transition-[grid-template-rows] duration-300 ease-out"
                  style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
                >
                  <div className="min-h-0">
                    <p
                      className="px-6 pb-6 text-[15px] leading-relaxed"
                      style={{ fontFamily: "'Inter', sans-serif", color: "#75726B" }}
                    >
                      {f.a}
                    </p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
};

export default EditorPlacementFAQ;