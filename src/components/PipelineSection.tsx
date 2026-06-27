import { useState } from "react";

const ME_PHOTO =
  "https://res.cloudinary.com/dqnifzwda/image/upload/v1782586250/PNG_B_W_b9o8yy.png";

const ACCENT = "#9ED8F5";
const MUTED = "#75726B";
const SURFACE = "#EEEDE8";

const TOOLS = [
  { slug: "notion", label: "Notion" },
  { slug: "slack", label: "Slack" },
  { slug: "googledrive", label: "Drive" },
  { slug: "clickup", label: "ClickUp" },
  { slug: "asana", label: "Asana" },
  { slug: "framedotio", label: "Frame" },
  { slug: "mondaydotcom", label: "Monday" },
];

const EDITORS = [
  { initials: "ED", label: "Editor 1" },
  { initials: "ED", label: "Editor 2" },
  { initials: "ED", label: "Editor 3" },
];

const EditorNode = ({ initials, label }: { initials: string; label: string }) => (
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
    <span className="font-mono text-[10px] uppercase tracking-[0.12em]" style={{ color: MUTED }}>
      {initials}
    </span>
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

        {/* Diagram */}
        <div className="relative">
          {/* Desktop lines */}
          <svg
            className="absolute inset-0 hidden md:block w-full h-full pointer-events-none"
            viewBox="0 0 1000 420"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            {/* Left lines: editors → center */}
            <line x1="75" y1="105" x2="350" y2="210" stroke={ACCENT} strokeWidth="1.5" opacity="0.7" />
            <line x1="75" y1="210" x2="350" y2="210" stroke={ACCENT} strokeWidth="1.5" opacity="0.7" />
            <line x1="75" y1="315" x2="350" y2="210" stroke={ACCENT} strokeWidth="1.5" opacity="0.7" />

            {/* Right lines: center → tools */}
            <line x1="650" y1="210" x2="925" y2="60" stroke={ACCENT} strokeWidth="1.5" opacity="0.7" />
            <line x1="650" y1="210" x2="925" y2="120" stroke={ACCENT} strokeWidth="1.5" opacity="0.7" />
            <line x1="650" y1="210" x2="925" y2="180" stroke={ACCENT} strokeWidth="1.5" opacity="0.7" />
            <line x1="650" y1="210" x2="925" y2="240" stroke={ACCENT} strokeWidth="1.5" opacity="0.7" />
            <line x1="650" y1="210" x2="925" y2="300" stroke={ACCENT} strokeWidth="1.5" opacity="0.7" />
            <line x1="650" y1="210" x2="925" y2="360" stroke={ACCENT} strokeWidth="1.5" opacity="0.7" />
            <line x1="650" y1="210" x2="925" y2="420" stroke={ACCENT} strokeWidth="1.5" opacity="0.7" />
          </svg>

          {/* Mobile lines */}
          <svg
            className="absolute inset-0 md:hidden w-full h-full pointer-events-none"
            viewBox="0 0 400 900"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            {/* Editors → Me */}
            <line x1="200" y1="135" x2="200" y2="280" stroke={ACCENT} strokeWidth="1.5" opacity="0.7" />
            <line x1="200" y1="175" x2="200" y2="280" stroke={ACCENT} strokeWidth="1.5" opacity="0.7" />
            <line x1="200" y1="215" x2="200" y2="280" stroke={ACCENT} strokeWidth="1.5" opacity="0.7" />

            {/* Me → Tools */}
            <line x1="200" y1="560" x2="200" y2="700" stroke={ACCENT} strokeWidth="1.5" opacity="0.7" />
            <line x1="200" y1="560" x2="80" y2="740" stroke={ACCENT} strokeWidth="1.5" opacity="0.7" />
            <line x1="200" y1="560" x2="320" y2="740" stroke={ACCENT} strokeWidth="1.5" opacity="0.7" />
            <line x1="200" y1="560" x2="80" y2="810" stroke={ACCENT} strokeWidth="1.5" opacity="0.7" />
            <line x1="200" y1="560" x2="320" y2="810" stroke={ACCENT} strokeWidth="1.5" opacity="0.7" />
            <line x1="200" y1="560" x2="80" y2="880" stroke={ACCENT} strokeWidth="1.5" opacity="0.7" />
            <line x1="200" y1="560" x2="320" y2="880" stroke={ACCENT} strokeWidth="1.5" opacity="0.7" />
          </svg>

          {/* Desktop layout */}
          <div className="hidden md:grid md:grid-cols-[1fr_auto_1fr] gap-6 items-center min-h-[420px]">
            {/* Left: editors */}
            <div className="flex flex-col gap-16 justify-center">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] uppercase tracking-[0.18em]" style={{ color: MUTED }}>
                  YOUR EDITORS
                </span>
              </div>
              <div className="flex flex-col gap-10">
                {EDITORS.map((editor, i) => (
                  <EditorNode key={i} initials={editor.initials} label={editor.label} />
                ))}
              </div>
            </div>

            {/* Center: me */}
            <div className="flex flex-col items-center justify-center px-12">
              <div
                className="relative h-[180px] w-[180px] rounded-full overflow-hidden"
                style={{ boxShadow: `0 0 0 2px ${ACCENT}40, 0 0 0 8px ${ACCENT}15` }}
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

            {/* Right: tools */}
            <div className="flex flex-col gap-10 justify-center">
              <div className="flex items-center justify-end">
                <span className="font-mono text-[10px] uppercase tracking-[0.18em]" style={{ color: MUTED }}>
                  YOUR STACK
                </span>
              </div>
              <div className="flex flex-col gap-5 items-end">
                {TOOLS.map((tool, i) => (
                  <ToolIcon key={i} slug={tool.slug} label={tool.label} />
                ))}
              </div>
            </div>
          </div>

          {/* Mobile layout */}
          <div className="md:hidden flex flex-col items-center gap-12 relative">
            {/* Editors */}
            <div className="w-full">
              <div className="flex justify-center mb-6">
                <span className="font-mono text-[10px] uppercase tracking-[0.18em]" style={{ color: MUTED }}>
                  YOUR EDITORS
                </span>
              </div>
              <div className="flex justify-center gap-8">
                {EDITORS.map((editor, i) => (
                  <EditorNode key={i} initials={editor.initials} label={editor.label} />
                ))}
              </div>
            </div>

            {/* Me */}
            <div className="flex flex-col items-center">
              <div
                className="relative h-[140px] w-[140px] rounded-full overflow-hidden"
                style={{ boxShadow: `0 0 0 2px ${ACCENT}40, 0 0 0 8px ${ACCENT}15` }}
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

            {/* Tools */}
            <div className="w-full">
              <div className="flex justify-center mb-6">
                <span className="font-mono text-[10px] uppercase tracking-[0.18em]" style={{ color: MUTED }}>
                  YOUR STACK
                </span>
              </div>
              <div className="flex flex-wrap justify-center gap-3">
                {TOOLS.map((tool, i) => (
                  <ToolIcon key={i} slug={tool.slug} label={tool.label} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PipelineSection;
