import { cn } from '@/lib/utils';

interface SegmentedControlProps<T extends string> {
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string }[];
  className?: string;
}

export function SegmentedControl<T extends string>({ value, onChange, options, className }: SegmentedControlProps<T>) {
  return (
    <div
      className={cn('inline-flex p-0.5 rounded-lg backdrop-blur-md', className)}
      style={{
        background: 'var(--dash-bg-glass)',
        border: '1px solid var(--dash-border-subtle)',
      }}
    >
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className="px-3 py-1 text-[11px] font-semibold rounded-md transition-all duration-150 cursor-pointer"
            style={{
              background: active ? 'var(--dash-accent-subtle)' : 'transparent',
              color: active ? 'var(--dash-accent-glow)' : 'var(--dash-text-tertiary)',
            }}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
