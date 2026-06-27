const steps = [
  {
    step: "01",
    title: <>Read the <em className="font-serif italic !text-[#9ED8F5]">account</em></>,
    body: "I pull up your active ads and go through the data. Hook rate, hold curve, what's staying alive past three seconds and what's not. Before I touch anything, I need to know what the account is already telling us.",
  },
  {
    step: "02",
    title: <>Build the <em className="font-serif italic !text-[#9ED8F5]">angle</em></>,
    body: "From the winners, I figure out the pattern. What problem are they leading with, what proof is landing. Then I build the next angles from that. Not from what's trending. From what's already converting in your account.",
  },
  {
    step: "03",
    title: <>Brief the <em className="font-serif italic !text-[#9ED8F5]">editor</em></>,
    body: "The editor gets a proper brief. Hook, shot list, pacing, format. I've been in the timeline long enough to write briefs that actually translate into cuts, so we're not burning rounds on revisions.",
  },
  {
    step: "04",
    title: <>Ship and <em className="font-serif italic !text-[#9ED8F5]">learn</em></>,
    body: "When it goes live, I track what moves. The data from this batch feeds into the next one. Every round gets a little tighter because we're building off proof, not guessing again from zero.",
  },
];

const Step = ({ step, title, body, isLast }: {
  step: string;
  title: React.ReactNode;
  body: string;
  isLast?: boolean;
}) => (
  <li
    className={[
      "relative grid grid-cols-[48px_1fr] md:grid-cols-[100px_1fr] gap-4 md:gap-6",
      isLast ? "pb-20" : "",
    ].join(" ")}
  >
    {/* Timeline dot */}
    <div className="absolute left-[23px] md:left-[79px] top-[18px] z-10 h-2 w-2 rounded-full bg-[#9ED8F5]" />

    {/* Ghost number */}
    <div className="relative flex justify-start">
      <span
        className="font-display text-[80px] md:text-[120px] leading-none select-none"
        style={{ color: "#1F1F1F" }}
      >
        {step}
      </span>
    </div>

    {/* Content */}
    <div className="pt-3 md:pt-5 max-w-[640px]">
      <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-[#75726B]">
        STEP {step}
      </span>
      <h3 className="mt-3 font-display text-[28px] font-semibold leading-tight text-[#F7F6F3]">
        {title}
      </h3>
      <p className="mt-4 font-sans text-[15px] leading-[1.7] text-[#75726B] hover:!text-[#75726B] selection:!text-[#75726B]">
        {body}
      </p>
    </div>
  </li>
);

const EditorEdge = () => (
  <section className="py-20 md:py-[80px]" style={{ backgroundColor: "#1A1A1A" }}>
    <div className="mx-auto max-w-[1100px] px-6">
      {/* Section header */}
      <div className="mb-16 md:mb-20 pl-16 md:pl-[124px]">
        <span
          className="inline-block font-mono text-[11px] uppercase tracking-[0.15em] text-[#75726B] px-4 py-2 rounded-[4px] border"
          style={{ borderColor: "#2A2A2A" }}
        >
          CREATIVE DIRECTION
        </span>
        <h2 className="mt-6 font-display text-[32px] md:text-[44px] leading-[1.05] tracking-[-0.02em] text-[#F7F6F3]">
          Creative built on <em className="font-serif italic !text-[#9ED8F5]">data</em>, not taste.
        </h2>
        <p className="mt-5 max-w-[480px] font-sans text-[15px] leading-[1.7] text-[#75726B] hover:!text-[#75726B] selection:!text-[#75726B]">
          I go through your account, find what's actually working, and build the next batch of ads from that. Not from gut feel. From your own numbers.
        </p>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical line */}
        <div
          className="absolute left-[23px] md:left-[79px] top-4 bottom-4 w-px"
          style={{ backgroundColor: "#2A2A2A" }}
        />

        <ol className="relative space-y-16 md:space-y-16">
          {steps.map((s, index) => (
            <Step key={s.step} {...s} isLast={index === steps.length - 1} />
          ))}
        </ol>
      </div>
    </div>
  </section>
);

export default EditorEdge;
