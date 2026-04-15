import { AdMetric } from "@/data/mockAds";
import { X, TrendingUp, MousePointerClick, DollarSign, Eye, Play } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

interface AdDetailPanelProps {
  ad: AdMetric;
  onClose: () => void;
}

function MetricBox({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="bg-stat-box border border-purple rounded-[12px] p-4 shadow-stat">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-[#8B5CF6]">{icon}</span>
        <span className="text-xs uppercase tracking-[0.15em] font-medium text-muted-readable">{label}</span>
      </div>
      <span className="font-mono text-xl font-bold text-primary-readable">{value}</span>
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#1A1A2E] border border-[rgba(139,92,246,0.3)] rounded-[10px] p-3 backdrop-blur-xl shadow-[0_8px_24px_rgba(0,0,0,0.4)] text-sm">
      <p className="text-muted-readable text-xs mb-1">{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} className="text-primary-readable font-mono">
          <span className="inline-block w-2 h-2 rounded-full mr-2" style={{ background: p.color }} />
          {p.name}: {typeof p.value === "number" ? `$${p.value.toFixed(2)}` : p.value}
        </p>
      ))}
    </div>
  );
};

export function AdDetailPanel({ ad, onClose }: AdDetailPanelProps) {
  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl bg-elevated border-l border-purple overflow-y-auto animate-[slide-in-right_300ms_ease-out]">
        <div className="sticky top-0 z-10 flex items-center justify-between p-6 bg-elevated border-b border-[rgba(255,255,255,0.05)]">
          <div>
            <h2 className="text-lg font-semibold text-primary-readable">{ad.name}</h2>
            <p className="text-sm text-secondary-readable">{ad.campaignName}</p>
          </div>
          <button onClick={onClose} className="w-9 h-9 rounded-full flex items-center justify-center border border-purple hover:border-purple-hover hover:bg-[rgba(139,92,246,0.06)] transition-all duration-200">
            <X className="w-4 h-4 text-secondary-readable" />
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

          <div className="bg-card-surface border border-purple rounded-[16px] shadow-card p-6">
            <h3 className="text-sm font-semibold text-primary-readable mb-4">Spend vs Revenue (14 days)</h3>
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={ad.dailyData}>
                <defs>
                  <linearGradient id="spendGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8B5CF6" stopOpacity={0.15} />
                    <stop offset="100%" stopColor="#8B5CF6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10B981" stopOpacity={0.15} />
                    <stop offset="100%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(255,255,255,0.04)" strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11, fontFamily: "JetBrains Mono" }} axisLine={{ stroke: "rgba(255,255,255,0.06)" }} tickLine={false} tickFormatter={(v) => v.slice(5)} />
                <YAxis tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11, fontFamily: "JetBrains Mono" }} axisLine={{ stroke: "rgba(255,255,255,0.06)" }} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="spend" stroke="#8B5CF6" strokeWidth={2} fill="url(#spendGrad)" name="Spend" dot={{ fill: "#8B5CF6", stroke: "#fff", strokeWidth: 1, r: 3 }} activeDot={{ r: 5 }} />
                <Area type="monotone" dataKey="revenue" stroke="#10B981" strokeWidth={2} fill="url(#revGrad)" name="Revenue" dot={{ fill: "#10B981", stroke: "#fff", strokeWidth: 1, r: 3 }} activeDot={{ r: 5 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-card-surface border border-purple rounded-[16px] shadow-card p-6">
            <h3 className="text-sm font-semibold text-primary-readable mb-4">Daily Clicks</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={ad.dailyData}>
                <defs>
                  <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8B5CF6" />
                    <stop offset="100%" stopColor="#6366F1" />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(255,255,255,0.04)" strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11, fontFamily: "JetBrains Mono" }} axisLine={{ stroke: "rgba(255,255,255,0.06)" }} tickLine={false} tickFormatter={(v) => v.slice(5)} />
                <YAxis tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11, fontFamily: "JetBrains Mono" }} axisLine={{ stroke: "rgba(255,255,255,0.06)" }} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="clicks" fill="url(#barGrad)" radius={[4, 4, 0, 0]} name="Clicks" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-card-surface border border-purple rounded-[16px] shadow-card p-6">
            <h3 className="text-sm font-semibold text-primary-readable mb-4">Detailed Stats</h3>
            <div className="space-y-3">
              {[
                ["Impressions", ad.impressions.toLocaleString()],
                ["Clicks", ad.clicks.toLocaleString()],
                ["Conversions", ad.conversions.toLocaleString()],
                ["Video Views", ad.videoViews.toLocaleString()],
                ["3s Views (Hook)", ad.threeSecViews.toLocaleString()],
                ["Completed Views", ad.completedViews.toLocaleString()],
              ].map(([label, val]) => (
                <div key={label} className="flex justify-between items-center py-2 border-b border-[rgba(255,255,255,0.03)]">
                  <span className="text-sm text-secondary-readable">{label}</span>
                  <span className="font-mono text-sm text-primary-readable font-medium">{val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}