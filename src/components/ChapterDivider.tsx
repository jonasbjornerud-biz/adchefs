interface ChapterDividerProps {
  id?: string;
  number: string;
  eyebrow: string;
  /** Heading content. Wrap the italicized word in <em>. */
  heading: React.ReactNode;
  descriptor: string;
  variant: "dark" | "light";
}

/**
 * Full-width chapter break for the landing page.
 * Visually unmistakable section divider that flows straight into the
 * following section by sharing its background colour.
 */
const ChapterDivider = ({
  id,
  number,
  eyebrow,
  heading,
  descriptor,
  variant,
}: ChapterDividerProps) => {
  const isDark = variant === "dark";
  const bg = isDark ? "#1A1A1A" : "#F7F6F3";
  const text = isDark ? "#F7F6F3" : "#1A1A1A";
  const muted = isDark ? "rgba(247,246,243,0.6)" : "#75726B";
  const numberColor = isDark ? "rgba(247,246,243,0.18)" : "rgba(26,26,26,0.14)";

  return (
    <section
      id={id}
      className="pt-28 sm:pt-40 pb-16 sm:pb-24"
      style={{ background: bg, color: text }}
    >
      <div className="mx-auto max-w-[1200px] px-6">
        <div
          className="mb-10"
          style={{
            fontFamily: "'JetBrains Mono', ui-monospace, monospace",
            fontSize: "clamp(72px, 12vw, 168px)",
            lineHeight: 0.9,
            letterSpacing: "-0.04em",
            color: numberColor,
            fontWeight: 500,
          }}
        >
          {number}
        </div>

        <span
          className="eyebrow"
          style={{
            background: "transparent",
            borderColor: "hsl(var(--accent))",
            color: "hsl(var(--accent))",
          }}
        >
          {eyebrow}
        </span>

        <h2
          className="mt-6 font-display text-[40px] md:text-[64px] leading-[1.02] tracking-[-0.025em] max-w-[18ch]"
        >
          {heading}
        </h2>

        <div
          aria-hidden
          className="mt-8 h-px w-24"
          style={{ background: "hsl(var(--accent))" }}
        />

        <p
          className="mt-8 text-[15px] md:text-[17px] leading-relaxed max-w-[60ch]"
          style={{ color: muted }}
        >
          {descriptor}
        </p>
      </div>
    </section>
  );
};

export default ChapterDivider;