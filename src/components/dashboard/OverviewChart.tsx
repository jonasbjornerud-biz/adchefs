import { AdMetric } from "@/data/mockAds";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface OverviewChartProps {
  ads: AdMetric[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-[4px] p-3 text-sm bg-white border border-[#1A1A1A] shadow-[0_8px_24px_-8px_rgba(26,26,26,0.25)]">
      <p className="text-[#75726B] text-[10px] uppercase tracking-[0.15em] mb-2 font-mono">{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} className="text-[#75726B] text-xs font-medium flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full" style={{ background: p.color }} />
          {p.name}: <span className="text-[#1A1A1A] font-semibold tracking-tight tabular-nums">${p.value.toFixed(2)}</span>
        </p>
      ))}
    </div>
  );
};

const AXIS_TICK = {
  fill: "#75726B",
  fontSize: 10,
  fontFamily: "'JetBrains Mono', monospace",
  letterSpacing: "0.12em",
} as const;

export function OverviewChart({ ads }: OverviewChartProps) {
  const dateMap = new Map<string, { spend: number; revenue: number }>();
  ads.forEach((ad) =>
    ad.dailyData.forEach((d) => {
      const existing = dateMap.get(d.date) || { spend: 0, revenue: 0 };
      dateMap.set(d.date, { spend: existing.spend + d.spend, revenue: existing.revenue + d.revenue });
    })
  );
  const chartData = Array.from(dateMap.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, vals]) => ({ date, ...vals }));

  const isEmpty = chartData.length === 0;

  const totalSpend = chartData.reduce((s, d) => s + d.spend, 0);
  const totalRevenue = chartData.reduce((s, d) => s + d.revenue, 0);

  return (
    <div
      className="relative glass-card p-6 animate-card-enter overflow-hidden"
      style={{ animationDelay: "300ms" }}
    >
      <span aria-hidden className="glass-rail" />

      <div className="flex items-start justify-between mb-5 relative">
        <div>
          <h3 className="text-lg font-semibold text-[#1A1A1A] tracking-tight">Performance <em>Overview</em></h3>
          <p className="text-[10px] font-mono uppercase tracking-[0.15em] text-[#75726B] mt-1">Spend vs Revenue trend</p>
        </div>
        <div className="hidden sm:flex items-center gap-5">
          <div className="text-right">
            <div className="text-[10px] font-mono uppercase tracking-[0.15em] text-[#75726B]">Spend</div>
            <div className="text-sm font-semibold text-[#1A1A1A] tracking-tight tabular-nums">${totalSpend.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
          </div>
          <div className="w-px h-8 bg-[#E2E0D9]" />
          <div className="text-right">
            <div className="text-[10px] font-mono uppercase tracking-[0.15em] text-[#75726B]">Revenue</div>
            <div className="text-sm font-semibold text-[#1A1A1A] tracking-tight tabular-nums">${totalRevenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
          </div>
        </div>
      </div>

      {isEmpty ? (
        <div className="flex items-center justify-center h-[300px]">
          <p className="text-[#75726B] text-sm">No data available for this date range</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="overviewSpend" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#9ED8F5" stopOpacity={0.6} />
                <stop offset="100%" stopColor="#9ED8F5" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="overviewRev" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#1A1A1A" stopOpacity={0.25} />
                <stop offset="100%" stopColor="#1A1A1A" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="rgba(26,26,26,0.09)" strokeDasharray="2 4" vertical={true} horizontal={true} />
            <XAxis dataKey="date" tick={AXIS_TICK} axisLine={false} tickLine={false} tickFormatter={(v) => String(v).slice(5).toUpperCase()} />
            <YAxis tick={AXIS_TICK} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(158,216,245,0.4)', strokeWidth: 1, strokeDasharray: '2 4' }} />
            <Area type="monotone" dataKey="spend" stroke="#9ED8F5" strokeWidth={2.25} fill="url(#overviewSpend)" name="Spend" dot={false} activeDot={{ fill: "#9ED8F5", stroke: "#1A1A1A", strokeWidth: 2, r: 5 }} style={{ filter: 'drop-shadow(0 5px 10px rgba(110, 184, 224, 0.24))' }} />
            <Area type="monotone" dataKey="revenue" stroke="#1A1A1A" strokeWidth={1.5} fill="url(#overviewRev)" name="Revenue" dot={false} activeDot={{ fill: "#1A1A1A", stroke: "#F7F6F3", strokeWidth: 2, r: 5 }} />
          </AreaChart>
        </ResponsiveContainer>
      )}

      <div className="flex gap-5 mt-4 relative">
        <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.15em] text-[#75726B]">
          <span className="w-2 h-2 rounded-full bg-[#9ED8F5] shadow-[0_2px_6px_rgba(110,184,224,0.35)]" /> Spend
        </div>
        <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.15em] text-[#75726B]">
          <span className="w-2 h-2 rounded-full bg-[#1A1A1A]" /> Revenue
        </div>
      </div>
    </div>
  );
}
