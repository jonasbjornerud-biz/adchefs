import { AdMetric } from "@/data/mockAds";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface OverviewChartProps {
  ads: AdMetric[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl p-3 text-sm" style={{
      background: 'rgba(20,20,30,0.85)',
      backdropFilter: 'blur(16px)',
      border: '1px solid rgba(168,85,247,0.25)',
      boxShadow: '0 8px 32px rgba(0,0,0,0.5), 0 0 24px -8px rgba(168,85,247,0.4)',
    }}>
      <p className="text-white/40 text-[10px] uppercase tracking-widest mb-2 font-semibold">{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} className="text-white/80 text-xs font-medium flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full" style={{ background: p.color, boxShadow: `0 0 6px ${p.color}` }} />
          {p.name}: <span className="text-white font-black tracking-tight">${p.value.toFixed(2)}</span>
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
      className="relative rounded-2xl p-6 animate-card-enter overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.015) 100%)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.07)',
        boxShadow: '0 1px 0 rgba(255,255,255,0.05) inset, 0 20px 50px -20px rgba(0,0,0,0.6)',
        animationDelay: "300ms",
      }}
    >
      {/* Decorative gradient orb */}
      <div className="absolute -top-32 -right-32 w-64 h-64 rounded-full pointer-events-none opacity-40" style={{
        background: 'radial-gradient(circle, rgba(168,85,247,0.25) 0%, transparent 70%)',
      }} />
      {/* Top sheen */}
      <div className="absolute inset-x-0 top-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(168,85,247,0.4), transparent)' }} />

      <div className="flex items-start justify-between mb-5 relative">
        <div>
          <h3 className="text-lg font-bold text-white tracking-tight">Performance Overview</h3>
          <p className="text-xs text-white/40 mt-0.5">Spend vs Revenue trend</p>
        </div>
        <div className="hidden sm:flex items-center gap-5">
          <div className="text-right">
            <div className="text-[10px] uppercase tracking-widest text-white/40 font-semibold">Spend</div>
            <div className="text-sm font-black text-white tracking-tight">${totalSpend.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
          </div>
          <div className="w-px h-8 bg-white/10" />
          <div className="text-right">
            <div className="text-[10px] uppercase tracking-widest text-white/40 font-semibold">Revenue</div>
            <div className="text-sm font-black text-emerald-400 tracking-tight">${totalRevenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
          </div>
        </div>
      </div>

      {isEmpty ? (
        <div className="flex items-center justify-center h-[300px]">
          <p className="text-white/30 text-sm">No data available for this date range</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={chartData} margin={{ top: 5, right: 8, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="overviewSpend" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#a855f7" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#a855f7" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="overviewRev" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#34d399" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#34d399" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="rgba(255,255,255,0.04)" strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="date" tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => v.slice(5)} />
            <YAxis tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(168,85,247,0.3)', strokeWidth: 1, strokeDasharray: '3 3' }} />
            <Area type="monotone" dataKey="spend" stroke="#a855f7" strokeWidth={2} fill="url(#overviewSpend)" name="Spend" dot={false} activeDot={{ fill: "#a855f7", stroke: "#1a1a24", strokeWidth: 2, r: 5 }} />
            <Area type="monotone" dataKey="revenue" stroke="#34d399" strokeWidth={2} fill="url(#overviewRev)" name="Revenue" dot={false} activeDot={{ fill: "#34d399", stroke: "#1a1a24", strokeWidth: 2, r: 5 }} />
          </AreaChart>
        </ResponsiveContainer>
      )}

      <div className="flex gap-5 mt-4 relative">
        <div className="flex items-center gap-2 text-xs text-white/50">
          <span className="w-2 h-2 rounded-full bg-[#a855f7]" style={{ boxShadow: '0 0 8px rgba(168,85,247,0.6)' }} /> Spend
        </div>
        <div className="flex items-center gap-2 text-xs text-white/50">
          <span className="w-2 h-2 rounded-full bg-[#34d399]" style={{ boxShadow: '0 0 8px rgba(52,211,153,0.6)' }} /> Revenue
        </div>
      </div>
    </div>
  );
}
