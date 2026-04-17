interface SparklineProps {
  data: number[];
  accent: string;
  height?: number;
  className?: string;
}

/**
 * Tiny SVG sparkline with gradient fill + glow — designed for premium dashboard cards.
 */
export function Sparkline({ data, accent, height = 56, className }: SparklineProps) {
  if (!data || data.length < 2) {
    return <div style={{ height }} className={className} />;
  }

  const w = 100;
  const h = 100;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const stepX = w / (data.length - 1);

  const points = data.map((v, i) => {
    const x = i * stepX;
    const y = h - ((v - min) / range) * (h - 10) - 5;
    return [x, y] as const;
  });

  // Smooth path via simple Catmull-Rom-ish bezier
  let line = `M ${points[0][0]} ${points[0][1]}`;
  for (let i = 0; i < points.length - 1; i++) {
    const [x0, y0] = points[i];
    const [x1, y1] = points[i + 1];
    const cx = (x0 + x1) / 2;
    line += ` C ${cx} ${y0}, ${cx} ${y1}, ${x1} ${y1}`;
  }
  const area = `${line} L ${w} ${h} L 0 ${h} Z`;

  const gradId = `spark-${accent.replace('#', '')}`;
  const lastPoint = points[points.length - 1];

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      preserveAspectRatio="none"
      width="100%"
      height={height}
      className={className}
      style={{ display: 'block', overflow: 'visible' }}
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={accent} stopOpacity="0.35" />
          <stop offset="100%" stopColor={accent} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${gradId})`} />
      <path
        d={line}
        fill="none"
        stroke={accent}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ filter: `drop-shadow(0 0 4px ${accent})` }}
        vectorEffect="non-scaling-stroke"
      />
      <circle
        cx={lastPoint[0]}
        cy={lastPoint[1]}
        r="2"
        fill={accent}
        style={{ filter: `drop-shadow(0 0 6px ${accent})` }}
      />
    </svg>
  );
}
