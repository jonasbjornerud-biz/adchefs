import { AdMetric } from "@/data/mockAds";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface OverviewChartProps {
  ads: AdMetric[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#1A1A2E] border border-[rgba(139,92,246,0.3)] rounded-[10px] p-3 backdrop-blur-xl shadow-[0_8px_24px_rgba(0,0,0,0.4)] text-sm">
      <p className="text-muted-readable text-xs mb-1">{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} className="text-primary-readable font-mono text-xs">
          <span className="inline-block w-2 h-2 rounded-full mr-2" style={{ background: p.color }} />
          {p.name}: ${p.value.toFixed(2)}
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

  return (
    <div className="bg-card-surface border border-purple rounded-[16px] shadow-card p-6 animate-card-enter" style={{ animationDelay: "300ms" }}>
      <h3 className="text-lg font-semibold text-primary-readable mb-5">Spend vs Revenue Overview</h3>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="overviewSpend" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8B5CF6" stopOpacity={0.15} />
              <stop offset="100%" stopColor="#8B5CF6" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="overviewRev" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10B981" stopOpacity={0.15} />
              <stop offset="100%" stopColor="#10B981" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="rgba(255,255,255,0.04)" strokeDasharray="3 3" />
          <XAxis dataKey="date" tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11, fontFamily: "JetBrains Mono" }} axisLine={{ stroke: "rgba(255,255,255,0.06)" }} tickLine={false} tickFormatter={(v) => v.slice(5)} />
          <YAxis tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11, fontFamily: "JetBrains Mono" }} axisLine={{ stroke: "rgba(255,255,255,0.06)" }} tickLine={false} tickFormatter={(v) => `$${v}`} />
          <Tooltip content={<CustomTooltip />} />
          <Area type="monotone" dataKey="spend" stroke="#8B5CF6" strokeWidth={2} fill="url(#overviewSpend)" name="Spend" dot={false} activeDot={{ fill: "#8B5CF6", stroke: "#fff", strokeWidth: 2, r: 4 }} />
          <Area type="monotone" dataKey="revenue" stroke="#10B981" strokeWidth={2} fill="url(#overviewRev)" name="Revenue" dot={false} activeDot={{ fill: "#10B981", stroke: "#fff", strokeWidth: 2, r: 4 }} />
        </AreaChart>
      </ResponsiveContainer>
      <div className="flex gap-6 mt-4">
        <div className="flex items-center gap-2 text-xs text-muted-readable">
          <span className="w-3 h-0.5 bg-[#8B5CF6] rounded-full" /> Spend
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-readable">
          <span className="w-3 h-0.5 bg-[#10B981] rounded-full" /> Revenue
        </div>
      </div>
    </div>
  );
}