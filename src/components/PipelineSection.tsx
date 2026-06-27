import { useState } from "react";

const ME_PHOTO =
  "https://res.cloudinary.com/dqnifzwda/image/upload/v1782586250/PNG_B_W_b9o8yy.png";

const ACCENT = "#9ED8F5";
const MUTED = "#75726B";
const SURFACE = "#EEEDE8";

const ICONS: Record<string, string> = {
  slack:
    "M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z",
  googledrive:
    "M12.01 1.485c-2.082 0-3.754.02-3.743.047.01.02 1.708 3.001 3.774 6.62l3.76 6.574h3.76c2.081 0 3.753-.02 3.742-.047-.005-.02-1.708-3.001-3.775-6.62l-3.76-6.574zm-4.76 1.73a789.828 789.861 0 0 0-3.63 6.319L0 15.868l1.89 3.298 1.885 3.297 3.62-6.335 3.618-6.33-1.88-3.287C8.1 4.704 7.255 3.22 7.25 3.214zm2.259 12.653-.203.348c-.114.198-.96 1.672-1.88 3.287a423.93 423.948 0 0 1-1.698 2.97c-.01.026 3.24.042 7.222.042h7.244l1.796-3.157c.992-1.734 1.85-3.23 1.906-3.323l.104-.167h-7.249z",
};

const TOOLS = [
  { slug: "notion", label: "Notion", inline: false },
  { slug: "slack", label: "Slack", inline: true },
  { slug: "googledrive", label: "Drive", inline: true },
  { slug: "clickup", label: "ClickUp", inline: false },
  { slug: "asana", label: "Asana", inline: false },
  { slug: "framedotio", label: "Frame", inline: false },
  { slug: "mondaydotcom", label: "Monday", inline: false },
];

const EDITORS = [
  { label: "Editor 1" },
  { label: "Editor 2" },
  { label: "Editor 3" },
];

const InlineSvg = ({ path, label }: { path: string; label: string }) => (
  <svg
    role="img"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    className="h-full w-full"
    aria-label={label}
  >
    <title>{label}</title>
    <path d={path} fill={MUTED} />
  </svg>
);

const EditorNode = ({ label }: { label: string }) => (
  <div className="flex items-center justify-center">
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

const ToolIcon = ({
  slug,
  label,
  inline,
}: {
  slug: string;
  label: string;
  inline: boolean;
}) => {
  const [failed, setFailed] = useState(false);

  if (inline || failed) {
    if (slug === "framedotio" || slug === "mondaydotcom") {
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
        <InlineSvg path={ICONS[slug]} label={label} />
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
        <div className="hidden md:block relative mx-auto max-w-[900px]" style={{ aspectRatio: "1000/420" }}>
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            viewBox="0 0 1000 420"
            preserveAspectRatio="xMidYMid meet"
            aria-hidden="true"
          >
            <line x1="80" y1="105" x2="500" y2="210" stroke={ACCENT} strokeWidth="1.5" opacity="0.7" />
            <line x1="80" y1="210" x2="500" y2="210" stroke={ACCENT} strokeWidth="1.5" opacity="0.7" />
            <line x1="80" y1="315" x2="500" y2="210" stroke={ACCENT} strokeWidth="1.5" opacity="0.7" />

            <line x1="500" y1="210" x2="920" y2="60" stroke={ACCENT} strokeWidth="1.5" opacity="0.7" />
            <line x1="500" y1="210" x2="920" y2="120" stroke={ACCENT} strokeWidth="1.5" opacity="0.7" />
            <line x1="500" y1="210" x2="920" y2="180" stroke={ACCENT} strokeWidth="1.5" opacity="0.7" />
            <line x1="500" y1="210" x2="920" y2="240" stroke={ACCENT} strokeWidth="1.5" opacity="0.7" />
            <line x1="500" y1="210" x2="920" y2="300" stroke={ACCENT} strokeWidth="1.5" opacity="0.7" />
            <line x1="500" y1="210" x2="920" y2="360" stroke={ACCENT} strokeWidth="1.5" opacity="0.7" />
            <line x1="500" y1="210" x2="920" y2="420" stroke={ACCENT} strokeWidth="1.5" opacity="0.7" />
          </svg>

          {/* Left label */}
          <div className="absolute left-[8%] top-[2%] -translate-x-1/2">
            <span className="font-mono text-[10px] uppercase tracking-[0.18em]" style={{ color: MUTED }}>
              YOUR EDITORS
            </span>
          </div>

          {/* Editor nodes: centers at 8%/105, 8%/210, 8%/315 */}
          <div className="absolute left-[8%] top-[25%] -translate-x-1/2 -translate-y-1/2">
            <EditorNode label="Editor 1" />
          </div>
          <div className="absolute left-[8%] top-[50%] -translate-x-1/2 -translate-y-1/2">
            <EditorNode label="Editor 2" />
          </div>
          <div className="absolute left-[8%] top-[75%] -translate-x-1/2 -translate-y-1/2">
            <EditorNode label="Editor 3" />
          </div>

          {/* Center node: center at 50%/210 */}
          <div className="absolute left-1/2 top-[50%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
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
          <div className="absolute right-[8%] top-[2%] translate-x-1/2">
            <span className="font-mono text-[10px] uppercase tracking-[0.18em]" style={{ color: MUTED }}>
              YOUR STACK
            </span>
          </div>

          {/* Tool icons: centers at 92%/60, 120, 180, 240, 300, 360, 420 */}
          <div className="absolute right-[8%] top-[14.3%] translate-x-1/2 -translate-y-1/2">
            <ToolIcon slug={TOOLS[0].slug} label={TOOLS[0].label} inline={TOOLS[0].inline} />
          </div>
          <div className="absolute right-[8%] top-[28.6%] translate-x-1/2 -translate-y-1/2">
            <ToolIcon slug={TOOLS[1].slug} label={TOOLS[1].label} inline={TOOLS[1].inline} />
          </div>
          <div className="absolute right-[8%] top-[42.9%] translate-x-1/2 -translate-y-1/2">
            <ToolIcon slug={TOOLS[2].slug} label={TOOLS[2].label} inline={TOOLS[2].inline} />
          </div>
          <div className="absolute right-[8%] top-[57.1%] translate-x-1/2 -translate-y-1/2">
            <ToolIcon slug={TOOLS[3].slug} label={TOOLS[3].label} inline={TOOLS[3].inline} />
          </div>
          <div className="absolute right-[8%] top-[71.4%] translate-x-1/2 -translate-y-1/2">
            <ToolIcon slug={TOOLS[4].slug} label={TOOLS[4].label} inline={TOOLS[4].inline} />
          </div>
          <div className="absolute right-[8%] top-[85.7%] translate-x-1/2 -translate-y-1/2">
            <ToolIcon slug={TOOLS[5].slug} label={TOOLS[5].label} inline={TOOLS[5].inline} />
          </div>
          <div className="absolute right-[8%] top-[100%] translate-x-1/2 -translate-y-1/2">
            <ToolIcon slug={TOOLS[6].slug} label={TOOLS[6].label} inline={TOOLS[6].inline} />
          </div>
        </div>

        {/* Mobile diagram */}
        <div className="md:hidden relative mx-auto max-w-[360px]" style={{ aspectRatio: "400/900" }}>
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            viewBox="0 0 400 900"
            preserveAspectRatio="xMidYMid meet"
            aria-hidden="true"
          >
            <line x1="120" y1="160" x2="200" y2="420" stroke={ACCENT} strokeWidth="1.5" opacity="0.7" />
            <line x1="200" y1="160" x2="200" y2="420" stroke={ACCENT} strokeWidth="1.5" opacity="0.7" />
            <line x1="280" y1="160" x2="200" y2="420" stroke={ACCENT} strokeWidth="1.5" opacity="0.7" />

            <line x1="200" y1="420" x2="200" y2="700" stroke={ACCENT} strokeWidth="1.5" opacity="0.7" />
            <line x1="200" y1="420" x2="80" y2="740" stroke={ACCENT} strokeWidth="1.5" opacity="0.7" />
            <line x1="200" y1="420" x2="320" y2="740" stroke={ACCENT} strokeWidth="1.5" opacity="0.7" />
            <line x1="200" y1="420" x2="80" y2="810" stroke={ACCENT} strokeWidth="1.5" opacity="0.7" />
            <line x1="200" y1="420" x2="320" y2="810" stroke={ACCENT} strokeWidth="1.5" opacity="0.7" />
            <line x1="200" y1="420" x2="80" y2="880" stroke={ACCENT} strokeWidth="1.5" opacity="0.7" />
            <line x1="200" y1="420" x2="320" y2="880" stroke={ACCENT} strokeWidth="1.5" opacity="0.7" />
          </svg>

          {/* Editors label */}
          <div className="absolute left-1/2 -translate-x-1/2 top-[2%]">
            <span className="font-mono text-[10px] uppercase tracking-[0.18em]" style={{ color: MUTED }}>
              YOUR EDITORS
            </span>
          </div>

          {/* Editor nodes: centers at 25%/160, 50%/160, 75%/160 */}
          <div className="absolute left-[30%] top-[17.8%] -translate-x-1/2 -translate-y-1/2">
            <EditorNode label="Editor 1" />
          </div>
          <div className="absolute left-1/2 top-[17.8%] -translate-x-1/2 -translate-y-1/2">
            <EditorNode label="Editor 2" />
          </div>
          <div className="absolute left-[70%] top-[17.8%] -translate-x-1/2 -translate-y-1/2">
            <EditorNode label="Editor 3" />
          </div>

          {/* Center node: center at 50%/420 */}
          <div className="absolute left-1/2 top-[46.7%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
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
          <div className="absolute left-1/2 -translate-x-1/2 top-[62%]">
            <span className="font-mono text-[10px] uppercase tracking-[0.18em]" style={{ color: MUTED }}>
              YOUR STACK
            </span>
          </div>

          {/* Tool icons: centers at 50%/700, 25%/740, 75%/740, 25%/810, 75%/810, 25%/880, 75%/880 */}
          <div className="absolute left-1/2 top-[77.8%] -translate-x-1/2 -translate-y-1/2">
            <ToolIcon slug={TOOLS[0].slug} label={TOOLS[0].label} inline={TOOLS[0].inline} />
          </div>
          <div className="absolute left-[25%] top-[82.2%] -translate-x-1/2 -translate-y-1/2">
            <ToolIcon slug={TOOLS[1].slug} label={TOOLS[1].label} inline={TOOLS[1].inline} />
          </div>
          <div className="absolute left-[75%] top-[82.2%] -translate-x-1/2 -translate-y-1/2">
            <ToolIcon slug={TOOLS[2].slug} label={TOOLS[2].label} inline={TOOLS[2].inline} />
          </div>
          <div className="absolute left-[25%] top-[90%] -translate-x-1/2 -translate-y-1/2">
            <ToolIcon slug={TOOLS[3].slug} label={TOOLS[3].label} inline={TOOLS[3].inline} />
          </div>
          <div className="absolute left-[75%] top-[90%] -translate-x-1/2 -translate-y-1/2">
            <ToolIcon slug={TOOLS[4].slug} label={TOOLS[4].label} inline={TOOLS[4].inline} />
          </div>
          <div className="absolute left-[25%] top-[97.8%] -translate-x-1/2 -translate-y-1/2">
            <ToolIcon slug={TOOLS[5].slug} label={TOOLS[5].label} inline={TOOLS[5].inline} />
          </div>
          <div className="absolute left-[75%] top-[97.8%] -translate-x-1/2 -translate-y-1/2">
            <ToolIcon slug={TOOLS[6].slug} label={TOOLS[6].label} inline={TOOLS[6].inline} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default PipelineSection;
