interface ProgressBarProps {
  completed: number;
  total: number;
}

export function ProgressBar({ completed, total }: ProgressBarProps) {
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
  const allDone = pct === 100;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground">
          {allDone ? '🎉 All modules complete' : `${completed} of ${total} modules completed`}
        </span>
        <span className={`text-sm font-bold font-mono ${allDone ? 'text-emerald-500' : 'text-foreground'}`}>
          {pct}%
        </span>
      </div>
      <div className="h-2 rounded-full bg-muted/60 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{
            width: `${pct}%`,
            background: allDone
              ? 'linear-gradient(90deg, #22c55e, #4ade80)'
              : 'linear-gradient(90deg, #0ea5e9, #38bdf8, #7dd3fc)',
            boxShadow: allDone
              ? '0 0 12px hsl(142 71% 45% / 0.4)'
              : '0 0 12px hsl(199 89% 48% / 0.3)',
          }}
        />
      </div>
    </div>
  );
}
