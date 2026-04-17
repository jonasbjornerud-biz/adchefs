import { Sparkline } from './Sparkline';

interface WtdStat {
  label: string;
  value: string;
}

interface WtdStatsProps {
  rangeLabel: string;
  stats: WtdStat[];
  accent: string;
  loading?: boolean;
  trend?: number[];
}

export function WtdStats({ rangeLabel, stats, accent, loading, trend }: WtdStatsProps) {
  return (
    <div
      className="mt-4 mb-5 rounded-2xl px-4 py-3 relative overflow-hidden"
      style={{
        background: 'rgba(255,255,255,0.025)',
        border: '1px solid rgba(255,255,255,0.05)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
      }}
    >
      <div className="flex items-center justify-between mb-2.5">
        <span className="text-[10px] uppercase tracking-wider font-semibold text-white/35">
          Week to date
        </span>
        <span
          className="text-[10px] font-medium tracking-wide"
          style={{ color: `${accent}cc` }}
        >
          {rangeLabel}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {stats.map((s, i) => (
          <div key={i} className="flex flex-col">
            <span className="text-[10px] text-white/40 font-medium tracking-wide mb-0.5">
              {s.label}
            </span>
            <span className="text-base font-semibold text-white tabular-nums">
              {loading ? (
                <span className="inline-block w-12 h-4 rounded bg-white/5 animate-pulse" />
              ) : (
                s.value
              )}
            </span>
          </div>
        ))}
      </div>
      {trend && trend.length > 1 && !loading && (
        <div className="mt-3 -mx-1">
          <Sparkline data={trend} accent={accent} height={44} />
        </div>
      )}
    </div>
  );
}
