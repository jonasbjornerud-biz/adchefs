import { useState } from "react";

const ME_PHOTO =
  "https://res.cloudinary.com/dqnifzwda/image/upload/v1782586250/PNG_B_W_b9o8yy.png";

const ACCENT = "#9ED8F5";
const MUTED = "#75726B";
const SURFACE = "#EEEDE8";

const TOOLS = [
  { slug: "notion", label: "Notion" },
  { slug: "slack", label: "Slack" },
  { slug: "google-drive", label: "Drive" },
  { slug: "clickup", label: "ClickUp" },
  { slug: "asana", label: "Asana" },
  { slug: "frameio", label: "Frame" },
  { slug: "monday", label: "Monday" },
];

const EDITORS = [
  { label: "Editor 1" },
  { label: "Editor 2" },
  { label: "Editor 3" },
];

const EditorNode = ({ label }: { label: string }) => (
  <div className="flex items-center gap-3">
    <div
      className="h-10 w-10 rounded-full flex items-center justify-center"
      style={{ backgroundColor: SURFACE }}
      aria-label={label}
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <circle cx="12" cy="9" r="4" stroke={MUTED} strokeWidth="1.5" />
        <path
          d="M5 21c0-4 4-6 7-6s7 2 7 6"
          stroke={MUTED}
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    </div>
  </div>
);

const ToolIcon = ({ slug, label }: { slug: string; label: string }) => {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        className="h-10 px-3 rounded-[4px] flex items-center justify-center"
        style={{ backgroundColor: SURFACE }}
        title={label}
      >
        <span className="text-[11px] font-medium" style={{ color: MUTED }}>
          {label}
        </span>
      </div>
    );
  }

  return (
    <div
      className="h-10 w-10 rounded-[4px] flex items-center justify-center p-2"
      style={{ backgroundColor: SURFACE }}
      title={label}
    >
      <img
        src={`https://cdn.simpleicons.org/${slug}/${MUTED.replace("#", "")}`}
        alt={label}
        className="h-full w-full object-contain"
        loading="lazy"
        onError={() => setFailed(true)}
      />
    </div>
  );
};

const PipelineSection = () => {
  return (
    <section id="pipeline" className="relative py-20 sm:py-32 bg-[#F7F6F3]">
      <div className="relative mx-auto max-w-[1100px] px-6">
        {/* Header */}
        <div className="text-center mb-14 md:mb-20">
          <span className="eyebrow">HOW IT WORKS</span>
          <h2 className="mt-4 font-display text-[34px] md:text-[52px] leading-[1.05] tracking-[-0.02em] text-ink">
            <em className="font-serif italic !text-ink">One</em> operator. Your entire video pipeline.
          </h2>
          <p className="mt-5 max-w-2xl mx-auto text-[15px] md:text-[18px]" style={{ color: MUTED }}>
            Editors, briefs, and delivery. All run through one person who reads the numbers.
          </p>
        </div>

        {/* Desktop diagram */}
        <div className="hidden md:block relative mx-auto" style={{ maxWidth: "900px", aspectRatio: "1000/420" }}>
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            viewBox="0 0 1000 420"
            preserveAspectRatio="xMidYMid meet"
            aria-hidden="true"
          >
            <line x1="60" y1="105" x2="400" y2="210" stroke={ACCENT} strokeWidth="1.5" opacity="0.7" />
            <line x1="60" y1="210" x2="400" y2="210" stroke={ACCENT} strokeWidth="1.5" opacity="0.7" />
            <line x1="60" y1="315" x2="400" y2="210" stroke={ACCENT} strokeWidth="1.5" opacity="0.7" />

            <line x1="600" y1="210" x2="940" y2="60" stroke={ACCENT} strokeWidth="1.5" opacity="0.7" />
            <line x1="600" y1="210" x2="940" y2="120" stroke={ACCENT} strokeWidth="1.5" opacity="0.7" />
            <line x1="600" y1="210" x2="940" y2="180" stroke={ACCENT} strokeWidth="1.5" opacity="0.7" />
            <line x1="600" y1="210" x2="940" y2="240" stroke={ACCENT} strokeWidth="1.5" opacity="0.7" />
            <line x1="600" y1="210" x2="940" y2="300" stroke={ACCENT} strokeWidth="1.5" opacity="0.7" />
            <line x1="600" y1="210" x2="940" y2="360" stroke={ACCENT} strokeWidth="1.5" opacity="0.7" />
            <line x1="600" y1="210" x2="940" y2="420" stroke={ACCENT} strokeWidth="1.5" opacity="0.7" />
          </svg>

          {/* Left label */}
          <div className="absolute left-[6%] top-[0%]">
            <span className="font-mono text-[10px] uppercase tracking-[0.18em]" style={{ color: MUTED }}>
              YOUR EDITORS
            </span>
          </div>

          {/* Editor nodes */}
          <div className="absolute left-[6%] top-[19%]">
            <EditorNode label="Editor 1" />
          </div>
          <div className="absolute left-[6%] top-[44%]">
            <EditorNode label="Editor 2" />
          </div>
          <div className="absolute left-[6%] top-[69%]">
            <EditorNode label="Editor 3" />
          </div>

          {/* Center node */}
          <div className="absolute left-1/2 top-[32%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
            <div
              className="relative h-[180px] w-[180px] rounded-full overflow-hidden"
              style={{ boxShadow: `0 0 0 2px ${ACCENT}50, 0 0 0 10px ${ACCENT}12` }}
            >
              <img
                src={ME_PHOTO}
                alt="Jonas Bjørnerud"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="mt-5 text-center">
              <p className="font-display text-[18px] font-semibold text-ink">Me</p>
              <p className="text-[13px]" style={{ color: MUTED }}>
                Creative direction
              </p>
            </div>
          </div>

          {/* Right label */}
          <div className="absolute right-[6%] top-[0%]">
            <span className="font-mono text-[10px] uppercase tracking-[0.18em]" style={{ color: MUTED }}>
              YOUR STACK
            </span>
          </div>

          {/* Tool icons */}
          <div className="absolute right-[6%] top-[8%]">
            <ToolIcon slug={TOOLS[0].slug} label={TOOLS[0].label} />
          </div>
          <div className="absolute right-[6%] top-[22%]">
            <ToolIcon slug={TOOLS[1].slug} label={TOOLS[1].label} />
          </div>
          <div className="absolute right-[6%] top-[36%]">
            <ToolIcon slug={TOOLS[2].slug} label={TOOLS[2].label} />
          </div>
          <div className="absolute right-[6%] top-[50%]">
            <ToolIcon slug={TOOLS[3].slug} label={TOOLS[3].label} />
          </div>
          <div className="absolute right-[6%] top-[64%]">
            <ToolIcon slug={TOOLS[4].slug} label={TOOLS[4].label} />
          </div>
          <div className="absolute right-[6%] top-[78%]">
            <ToolIcon slug={TOOLS[5].slug} label={TOOLS[5].label} />
          </div>
          <div className="absolute right-[6%] top-[92%]">
            <ToolIcon slug={TOOLS[6].slug} label={TOOLS[6].label} />
          </div>
        </div>

        {/* Mobile diagram */}
        <div className="md:hidden relative mx-auto" style={{ maxWidth: "360px", aspectRatio: "400/900" }}>
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            viewBox="0 0 400 900"
            preserveAspectRatio="xMidYMid meet"
            aria-hidden="true"
          >
            <line x1="200" y1="160" x2="200" y2="320" stroke={ACCENT} strokeWidth="1.5" opacity="0.7" />
            <line x1="120" y1="160" x2="200" y2="320" stroke={ACCENT} strokeWidth="1.5" opacity="0.7" />
            <line x1="280" y1="160" x2="200" y2="320" stroke={ACCENT} strokeWidth="1.5" opacity="0.7" />

            <line x1="200" y1="520" x2="200" y2="700" stroke={ACCENT} strokeWidth="1.5" opacity="0.7" />
            <line x1="200" y1="520" x2="80" y2="740" stroke={ACCENT} strokeWidth="1.5" opacity="0.7" />
            <line x1="200" y1="520" x2="320" y2="740" stroke={ACCENT} strokeWidth="1.5" opacity="0.7" />
            <line x1="200" y1="520" x2="80" y2="810" stroke={ACCENT} strokeWidth="1.5" opacity="0.7" />
            <line x1="200" y1="520" x2="320" y2="810" stroke={ACCENT} strokeWidth="1.5" opacity="0.7" />
            <line x1="200" y1="520" x2="80" y2="880" stroke={ACCENT} strokeWidth="1.5" opacity="0.7" />
            <line x1="200" y1="520" x2="320" y2="880" stroke={ACCENT} strokeWidth="1.5" opacity="0.7" />
          </svg>

          {/* Editors label */}
          <div className="absolute left-1/2 -translate-x-1/2 top-[2%]">
            <span className="font-mono text-[10px] uppercase tracking-[0.18em]" style={{ color: MUTED }}>
              YOUR EDITORS
            </span>
          </div>

          {/* Editor nodes */}
          <div className="absolute left-[30%] -translate-x-1/2 top-[12%]">
            <EditorNode label="Editor 1" />
          </div>
          <div className="absolute left-1/2 -translate-x-1/2 top-[12%]">
            <EditorNode label="Editor 2" />
          </div>
          <div className="absolute left-[70%] -translate-x-1/2 top-[12%]">
            <EditorNode label="Editor 3" />
          </div>

          {/* Center node */}
          <div className="absolute left-1/2 top-[42%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
            <div
              className="relative h-[140px] w-[140px] rounded-full overflow-hidden"
              style={{ boxShadow: `0 0 0 2px ${ACCENT}50, 0 0 0 10px ${ACCENT}12` }}
            >
              <img
                src={ME_PHOTO}
                alt="Jonas Bjørnerud"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="mt-4 text-center">
              <p className="font-display text-[17px] font-semibold text-ink">Me</p>
              <p className="text-[13px]" style={{ color: MUTED }}>
                Creative direction
              </p>
            </div>
          </div>

          {/* Tools label */}
          <div className="absolute left-1/2 -translate-x-1/2 top-[58%]">
            <span className="font-mono text-[10px] uppercase tracking-[0.18em]" style={{ color: MUTED }}>
              YOUR STACK
            </span>
          </div>

          {/* Tool icons */}
          <div className="absolute left-1/2 -translate-x-1/2 top-[66%]">
            <ToolIcon slug={TOOLS[0].slug} label={TOOLS[0].label} />
          </div>
          <div className="absolute left-[25%] -translate-x-1/2 top-[72%]">
            <ToolIcon slug={TOOLS[1].slug} label={TOOLS[1].label} />
          </div>
          <div className="absolute left-[75%] -translate-x-1/2 top-[72%]">
            <ToolIcon slug={TOOLS[2].slug} label={TOOLS[2].label} />
          </div>
          <div className="absolute left-[25%] -translate-x-1/2 top-[79%]">
            <ToolIcon slug={TOOLS[3].slug} label={TOOLS[3].label} />
          </div>
          <div className="absolute left-[75%] -translate-x-1/2 top-[79%]">
            <ToolIcon slug={TOOLS[4].slug} label={TOOLS[4].label} />
          </div>
          <div className="absolute left-[25%] -translate-x-1/2 top-[86%]">
            <ToolIcon slug={TOOLS[5].slug} label={TOOLS[5].label} />
          </div>
          <div className="absolute left-[75%] -translate-x-1/2 top-[86%]">
            <ToolIcon slug={TOOLS[6].slug} label={TOOLS[6].label} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default PipelineSection;
