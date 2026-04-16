import { AdMetric } from "@/data/mockAds";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface OverviewChartProps {
  ads: AdMetric[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl p-3 text-sm" style={{
      background: '#1a1a24',
      border: '1px solid rgba(255,255,255,0.08)',
      boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
    }}>
      <p className="text-white/30 text-xs mb-1.5 font-medium">{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} className="text-white/80 text-xs font-medium">
          <span className="inline-block w-2 h-2 rounded-full mr-2" style={{ background: p.color }} />
          {p.name}: <span className="text-white font-black">${p.value.toFixed(2)}</span>
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

  return (
    <div
      className="bg-[#111118] rounded-2xl p-6 animate-card-enter"
      style={{
        boxShadow: '0 0 0 1px rgba(255,255,255,0.06) inset, 0 4px 24px rgba(0,0,0,0.4)',
        animationDelay: "300ms",
      }}
    >
      <h3 className="text-lg font-semibold text-white mb-5">Spend vs Revenue Overview</h3>
      {isEmpty ? (
        <div className="flex items-center justify-center h-[300px]">
          <p className="text-white/30 text-sm">No data available for this date range</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="overviewSpend" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#a855f7" stopOpacity={0.25} />
                <stop offset="100%" stopColor="#a855f7" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="overviewRev" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#34d399" stopOpacity={0.25} />
                <stop offset="100%" stopColor="#34d399" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="date" tick={{ fill: "rgba(255,255,255,0.30)", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => v.slice(5)} />
            <YAxis tick={{ fill: "rgba(255,255,255,0.30)", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="spend" stroke="#a855f7" strokeWidth={2} fill="url(#overviewSpend)" name="Spend" dot={false} activeDot={{ fill: "#a855f7", stroke: "#1a1a24", strokeWidth: 2, r: 5 }} />
            <Area type="monotone" dataKey="revenue" stroke="#34d399" strokeWidth={2} fill="url(#overviewRev)" name="Revenue" dot={false} activeDot={{ fill: "#34d399", stroke: "#1a1a24", strokeWidth: 2, r: 5 }} />
          </AreaChart>
        </ResponsiveContainer>
      )}
      <div className="flex gap-6 mt-4">
        <div className="flex items-center gap-2 text-xs text-white/30">
          <span className="w-3 h-0.5 bg-[#a855f7] rounded-full" /> Spend
        </div>
        <div className="flex items-center gap-2 text-xs text-white/30">
          <span className="w-3 h-0.5 bg-[#34d399] rounded-full" /> Revenue
        </div>
      </div>
    </div>
  );
}
