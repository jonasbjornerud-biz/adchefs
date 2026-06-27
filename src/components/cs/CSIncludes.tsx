import { Compass, Clapperboard, LineChart } from "lucide-react";

type Card = {
  label: string;
  icon: React.ReactNode;
  body: string;
};

const cards: Card[] = [
  {
    label: "STRATEGY",
    icon: <Compass className="h-4 w-4" strokeWidth={2} />,
    body: "Research, angles, and briefs built with an editing eye. A weekly read on hook, hold, ROAS, and CPA.",
  },
  {
    label: "PRODUCTION",
    icon: <Clapperboard className="h-4 w-4" strokeWidth={2} />,
    body: "New creative batches shipped every week. Produced videos included, not just strategy decks. Dedicated editor placement included.",
  },
  {
    label: "OWNERSHIP",
    icon: <LineChart className="h-4 w-4" strokeWidth={2} />,
    body: "A live KPI dashboard, free. One operator owning the creative number end to end.",
  },
];

const CSIncludes = () => {
  return (
    <section className="py-24 sm:py-32" style={{ background: "#F7F6F3" }}>
      <div className="mx-auto max-w-[1120px] px-6">
        <div className="text-center max-w-[760px] mx-auto">
          <span className="eyebrow">WHAT'S INCLUDED</span>
          <h2
            className="mt-5 text-[32px] sm:text-[42px] lg:text-[48px] leading-[1.05] tracking-[-0.025em] font-semibold"
            style={{ fontFamily: "'Inter Tight', sans-serif", color: "#1A1A1A" }}
          >
            Everything in Editor Placement, plus the strategy{" "}
            <em
              style={{ fontFamily: "'Instrument Serif', serif", fontStyle: "italic", fontWeight: 400 }}
            >
              layer
            </em>
            .
          </h2>
          <p
            className="mt-5 text-[16px] leading-relaxed max-w-[560px] mx-auto"
            style={{ color: "#75726B" }}
          >
            One operator running creative end to end. Strategy, production, and the weekly read in one seat.
          </p>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-3">
          {cards.map((c) => (
            <div
              key={c.label}
              className="flex flex-col rounded-[4px] p-7 h-full"
              style={{
                background: "#EEEDE8",
                border: "1px solid rgba(26,26,26,0.06)",
              }}
            >
              <span
                className="inline-flex items-center justify-center h-9 w-9 rounded-[4px]"
                style={{ background: "#9ED8F5", color: "#1A1A1A" }}
              >
                {c.icon}
              </span>
              <span
                className="mt-5"
                style={{
                  fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                  fontSize: 10,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "#75726B",
                }}
              >
                {c.label}
              </span>
              <p
                className="mt-3 text-[15px] leading-relaxed"
                style={{ color: "#1A1A1A" }}
              >
                {c.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CSIncludes;