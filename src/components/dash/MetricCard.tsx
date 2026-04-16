import { ReactNode, useEffect, useRef, useState } from 'react';
import { Area, AreaChart, ResponsiveContainer } from 'recharts';
import { GlassCard } from './GlassCard';

interface MetricCardProps {
  label: string;
  value?: string | number;
  numericValue?: number;          // for count-up animation
  prefix?: string;                // e.g. '$'
  suffix?: string;                // e.g. '%', 'x'
  decimals?: number;
  icon?: ReactNode;
  delta?: { value: number; positive: boolean; suffix?: string };
  sparkline?: number[];
  delay?: number;
}

function useCountUp(target: number | undefined, duration = 600) {
  const [val, setVal] = useState(0);
  const started = useRef(false);
  useEffect(() => {
    if (target === undefined || started.current) return;
    started.current = true;
    const start = performance.now();
    const from = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(from + (target - from) * eased);
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [target, duration]);
  return val;
}

export function MetricCard({
  label, value, numericValue, prefix = '', suffix = '', decimals = 0,
  icon, delta, sparkline, delay = 0,
}: MetricCardProps) {
  const animated = useCountUp(numericValue);
  const display =
    numericValue !== undefined
      ? `${prefix}${animated.toFixed(decimals)}${suffix}`
      : `${value}`;

  const sparkData = sparkline?.map((v, i) => ({ i, v })) ?? [];
  const accentColor = delta && !delta.positive ? '#EF4444' : '#A855F7';

  return (
    <GlassCard className="p-5 flex flex-col gap-3 min-w-0" delay={delay}>
      {/* Label + icon */}
      <div className="flex items-center justify-between">
        <span className="dash-font-label">{label}</span>
        {icon && <span style={{ color: 'var(--dash-text-tertiary)' }}>{icon}</span>}
      </div>

      {/* Metric */}
      <div className="flex flex-col gap-1.5 min-w-0">
        <span
          className="dash-font-display dash-tabular truncate"
          style={{ color: 'var(--dash-text-primary)', fontSize: 'clamp(28px, 4vw, 48px)' }}
        >
          {display}
        </span>

        {delta && (
          <span
            className="inline-flex items-center self-start rounded-md px-1.5 py-0.5 text-[11px] font-semibold gap-0.5"
            style={{
              background: delta.positive ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.12)',
              color: delta.positive ? '#10B981' : '#EF4444',
            }}
          >
            {delta.positive ? '↑' : '↓'} {Math.abs(delta.value)}{delta.suffix ?? '%'}
          </span>
        )}
      </div>

      {/* Sparkline */}
      {sparkline && sparkline.length > 1 && (
        <div className="h-10 -mx-2 -mb-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={sparkData} margin={{ top: 2, right: 0, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id={`spark-${label}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={accentColor} stopOpacity={0.4} />
                  <stop offset="100%" stopColor={accentColor} stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="v"
                stroke={accentColor}
                strokeWidth={1.5}
                fill={`url(#spark-${label})`}
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </GlassCard>
  );
}
