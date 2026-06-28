import { AdMetric } from "@/data/mockAds";
import { ComposedChart, Area, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface OverviewChartProps {
  ads: AdMetric[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-dropdown p-3 text-sm">
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
      className="relative glass-card p-6 animate-card-enter"
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
          <div className="w-px h-8 bg-[rgba(26,26,26,0.08)]" />
          <div className="text-right">
            <div className="text-[10px] font-mono uppercase tracking-[0.15em] text-[#75726B]">Revenue</div>
            <div className="text-sm font-semibold text-[#1A1A1A] tracking-tight tabular-nums">${totalRevenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
          </div>
        </div>
      </div>

      {isEmpty ? (
        <div className="flex flex-col items-center justify-center h-[300px] gap-3">
          <span className="glass-skeleton h-2 w-48" aria-hidden />
          <p className="text-[#9A988F] text-[10px] font-mono uppercase tracking-[0.22em]">Awaiting data</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <ComposedChart data={chartData} margin={{ top: 5, right: 8, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="overviewSpend" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2E6BE6" stopOpacity={0.10} />
                <stop offset="100%" stopColor="#2E6BE6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="rgba(26,26,26,0.06)" strokeDasharray="2 5" vertical={false} />
            <XAxis dataKey="date" tick={{ fill: "#75726B", fontFamily: "'JetBrains Mono', monospace", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => v.slice(5)} />
            <YAxis tick={{ fill: "#75726B", fontFamily: "'JetBrains Mono', monospace", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(26,26,26,0.2)', strokeWidth: 1, strokeDasharray: '2 5' }} />
            <Area type="monotone" dataKey="spend" stroke="#2E6BE6" strokeWidth={1.5} fill="url(#overviewSpend)" name="Spend" dot={false} activeDot={{ fill: "#2E6BE6", stroke: "#1A1A1A", strokeWidth: 2, r: 5 }} />
            <Line type="monotone" dataKey="revenue" stroke="#1A1A1A" strokeWidth={2.25} dot={false} name="Revenue" activeDot={{ fill: "#1A1A1A", stroke: "#F7F6F3", strokeWidth: 2, r: 5 }} strokeLinecap="round" />
          </ComposedChart>
        </ResponsiveContainer>
      )}

      <div className="flex gap-5 mt-4 relative">
        <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.15em] text-[#75726B]">
          <span className="w-2 h-2 rounded-full bg-[#2E6BE6]" /> Spend
        </div>
        <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.15em] text-[#75726B]">
          <span className="w-2 h-2 rounded-full bg-[#1A1A1A]" /> Revenue
        </div>
      </div>
    </div>
  );
}
