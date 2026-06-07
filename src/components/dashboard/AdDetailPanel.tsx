import { AdMetric } from "@/data/mockAds";
import { X, TrendingUp, MousePointerClick, DollarSign, Eye, Play } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

interface AdDetailPanelProps {
  ad: AdMetric;
  onClose: () => void;
}

function MetricBox({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="bg-[#111118] rounded-xl p-4" style={{ boxShadow: '0 0 0 1px rgba(255,255,255,0.06) inset' }}>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-white/30">{icon}</span>
        <span className="text-xs uppercase tracking-widest font-medium text-white/40">{label}</span>
      </div>
      <span className="font-black text-xl text-white">{value}</span>
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl p-3 text-sm" style={{ background: '#1a1a24', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }}>
      <p className="text-white/30 text-xs mb-1">{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} className="text-white/80 text-xs">
          <span className="inline-block w-2 h-2 rounded-full mr-2" style={{ background: p.color }} />
          {p.name}: <span className="text-white font-black">{typeof p.value === "number" ? `$${p.value.toFixed(2)}` : p.value}</span>
        </p>
      ))}
    </div>
  );
};

export function AdDetailPanel({ ad, onClose }: AdDetailPanelProps) {
  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl bg-[#09090f] border-l border-white/[0.06] overflow-y-auto animate-[slide-in-right_300ms_ease-out]">
        <div className="sticky top-0 z-10 flex items-center justify-between p-6 bg-[#09090f] border-b border-white/[0.06]">
          <div>
            <h2 className="text-lg font-semibold text-white">{ad.name}</h2>
            <p className="text-sm text-white/40">{ad.campaignName}</p>
          </div>
          <button onClick={onClose} className="w-9 h-9 rounded-full flex items-center justify-center border border-white/[0.06] hover:border-[#a855f7]/30 hover:bg-[#a855f7]/5 transition-all duration-200 cursor-pointer">
            <X className="w-4 h-4 text-white/40" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <MetricBox label="CTR" value={`${ad.ctr}%`} icon={<MousePointerClick className="w-4 h-4" />} />
            <MetricBox label="CPA" value={`$${ad.cpa}`} icon={<DollarSign className="w-4 h-4" />} />
            <MetricBox label="ROAS" value={`${ad.roas}x`} icon={<TrendingUp className="w-4 h-4" />} />
            <MetricBox label="Hook Rate" value={`${ad.hookRate}%`} icon={<Eye className="w-4 h-4" />} />
            <MetricBox label="Hold Rate" value={`${ad.holdRate}%`} icon={<Play className="w-4 h-4" />} />
            <MetricBox label="Spend" value={`$${ad.spend.toLocaleString()}`} icon={<DollarSign className="w-4 h-4" />} />
          </div>

          <div className="bg-[#111118] rounded-2xl p-6" style={{ boxShadow: '0 0 0 1px rgba(255,255,255,0.06) inset, 0 4px 24px rgba(0,0,0,0.4)' }}>
            <h3 className="text-sm font-semibold text-white mb-4">Spend vs Revenue (14 days)</h3>
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={ad.dailyData}>
                <defs>
                  <linearGradient id="spendGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#a855f7" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="#a855f7" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#34d399" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="#34d399" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => v.slice(5)} />
                <YAxis tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="spend" stroke="#a855f7" strokeWidth={2} fill="url(#spendGrad)" name="Spend" dot={false} activeDot={{ fill: "#a855f7", stroke: "#1a1a24", strokeWidth: 2, r: 5 }} />
                <Area type="monotone" dataKey="revenue" stroke="#34d399" strokeWidth={2} fill="url(#revGrad)" name="Revenue" dot={false} activeDot={{ fill: "#34d399", stroke: "#1a1a24", strokeWidth: 2, r: 5 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-[#111118] rounded-2xl p-6" style={{ boxShadow: '0 0 0 1px rgba(255,255,255,0.06) inset, 0 4px 24px rgba(0,0,0,0.4)' }}>
            <h3 className="text-sm font-semibold text-white mb-4">Daily Clicks</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={ad.dailyData}>
                <defs>
                  <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#a855f7" />
                    <stop offset="100%" stopColor="#7c3aed" />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => v.slice(5)} />
                <YAxis tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="clicks" fill="url(#barGrad)" radius={[4, 4, 0, 0]} name="Clicks" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-[#111118] rounded-2xl p-6" style={{ boxShadow: '0 0 0 1px rgba(255,255,255,0.06) inset, 0 4px 24px rgba(0,0,0,0.4)' }}>
            <h3 className="text-sm font-semibold text-white mb-4">Detailed Stats</h3>
            <div className="space-y-3">
              {[
                ["Impressions", ad.impressions.toLocaleString()],
                ["Clicks", ad.clicks.toLocaleString()],
                ["Conversions", ad.conversions.toLocaleString()],
                ["Video Views", ad.videoViews.toLocaleString()],
                ["3s Views (Hook)", ad.threeSecViews.toLocaleString()],
                ["Completed Views", ad.completedViews.toLocaleString()],
              ].map(([label, val]) => (
                <div key={label} className="flex justify-between items-center py-2 border-b border-white/[0.03]">
                  <span className="text-sm text-white/40">{label}</span>
                  <span className="text-sm text-white font-black">{val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
