import { useState } from "react";
import { Plus, Minus } from "lucide-react";

const faqs: { q: string; a: string }[] = [
  {
    q: "How is this different from editor placement?",
    a: "Editor placement is execution: you bring the direction, the editor ships the volume. Creative strategy is me owning the whole thing: the account read, the angles, the briefs, the editors, and the weekly read on what is moving.",
  },
  {
    q: "Why only two to three brands at a time?",
    a: "Because I am actually reading the account every week, not delegating it. Past three brands the read gets shallow, and the read is the product.",
  },
  {
    q: "What do you need from me to start?",
    a: "Access to your ad account and your current creative, your offer, and your numbers. I do the rest.",
  },
  {
    q: "How is pricing set?",
    a: "On the call, against your account. Editor placement is included in the engagement, so it is one number, not a stack of line items.",
  },
  {
    q: 'What does "owning the number" actually mean?',
    a: "One person accountable for the creative result end to end. When it works I tell you why. When it does not, same.",
  },
  {
    q: "Is there a contract or lock in?",
    a: "Revisions until you approve, cancel whenever. No long agency contract.",
  },
];

const CreativeStrategyFAQ = () => {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="py-20 sm:py-32" style={{ background: "#F7F6F3" }}>
      <div className="mx-auto max-w-[860px] px-6">
        <span className="eyebrow eyebrow-accent">COMMON QUESTIONS</span>
        <h2
          className="mt-6 text-[36px] md:text-[52px] leading-[1.05] tracking-[-0.025em] font-semibold"
          style={{ fontFamily: "'Inter Tight', sans-serif", color: "#1A1A1A" }}
        >
          Before you{" "}
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

export default CreativeStrategyFAQ;