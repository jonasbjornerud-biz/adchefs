interface ProgressBarProps {
  completed: number;
  total: number;
}

export function ProgressBar({ completed, total }: ProgressBarProps) {
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="flex items-center gap-4">
      <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{
            width: `${pct}%`,
            background: pct === 100
              ? 'linear-gradient(90deg, #22c55e, #16a34a)'
              : 'linear-gradient(90deg, #0ea5e9, #38bdf8)',
          }}
        />
      </div>
      <span className="text-sm font-mono text-muted-foreground whitespace-nowrap">
        {completed}/{total} ({pct}%)
      </span>
    </div>
  );
}
