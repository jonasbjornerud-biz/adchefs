export function PageHeader({
  eyebrow,
  title,
  subtitle,
  actions,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  subtitle?: string;
  actions?: React.ReactNode;
}) {
  return (
    <header className="flex items-end justify-between gap-6 mb-8">
      <div className="min-w-0">
        {eyebrow && (
          <span className="inline-block mono text-[10px] uppercase tracking-[0.18em] text-[#3B86A8] border border-[#3B86A8]/40 rounded-[4px] px-[10px] py-[5px] bg-white/60 backdrop-blur-sm">
            {eyebrow}
          </span>
        )}
        <h1
          className="mt-4 text-[34px] sm:text-[42px] leading-[1.02] tracking-[-0.025em] text-[#1A1A1A]"
          style={{ fontFamily: "'Inter Tight', sans-serif", fontWeight: 700 }}
        >
          {title}
        </h1>
        {subtitle && (
          <p className="mt-2 text-[14px] text-[#75726B] max-w-xl leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>
      {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
    </header>
  );
}
