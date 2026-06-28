import { AdMetric } from "@/data/mockAds";
import { X, TrendingUp, MousePointerClick, DollarSign, Eye, Play } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

interface AdDetailPanelProps {
  ad: AdMetric;
  onClose: () => void;
}

function MetricBox({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="glass-chip p-4">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-[#75726B]">{icon}</span>
        <span className="text-[10px] font-mono uppercase tracking-[0.15em] text-[#75726B]">{label}</span>
      </div>
      <span className="font-semibold text-xl text-[#1A1A1A] tabular-nums tracking-tight">{value}</span>
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-dropdown p-3 text-sm">
      <p className="text-[#75726B] text-[10px] font-mono uppercase tracking-[0.15em] mb-1">{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} className="text-[#75726B] text-xs">
          <span className="inline-block w-2 h-2 rounded-full mr-2" style={{ background: p.color }} />
          {p.name}: <span className="text-[#1A1A1A] font-semibold tabular-nums">{typeof p.value === "number" ? `$${p.value.toFixed(2)}` : p.value}</span>
        </p>
      ))}
    </div>
  );
};

export function AdDetailPanel({ ad, onClose }: AdDetailPanelProps) {
  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 glass-scrim" onClick={onClose} />
      <div className="relative w-full max-w-2xl glass-sheet rounded-l-[16px] overflow-y-auto animate-sheet-in">
        <div className="sticky top-0 z-10 flex items-center justify-between p-6 glass-topbar">
          <div>
            <h2 className="text-lg font-semibold text-[#1A1A1A] tracking-tight">{ad.name}</h2>
            <p className="text-[10px] font-mono uppercase tracking-[0.15em] text-[#75726B] mt-0.5">{ad.campaignName}</p>
          </div>
          <button onClick={onClose} className="w-9 h-9 glass-chip flex items-center justify-center hover:border-[#9ED8F5] transition-all duration-200 cursor-pointer">
            <X className="w-4 h-4 text-[#1A1A1A]" strokeWidth={1.5} />
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

          <div className="glass-card p-6">
            <h3 className="text-sm font-semibold text-[#1A1A1A] mb-4 tracking-tight">Spend vs Revenue <span className="text-[#75726B] font-normal">(14 days)</span></h3>
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={ad.dailyData}>
                <defs>
                  <linearGradient id="spendGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#9ED8F5" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="#9ED8F5" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#1A1A1A" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="#1A1A1A" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(26,26,26,0.06)" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" tick={{ fill: "#75726B", fontFamily: "'JetBrains Mono', monospace", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => v.slice(5)} />
                <YAxis tick={{ fill: "#75726B", fontFamily: "'JetBrains Mono', monospace", fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="spend" stroke="#9ED8F5" strokeWidth={2} fill="url(#spendGrad)" name="Spend" dot={false} activeDot={{ fill: "#9ED8F5", stroke: "#1A1A1A", strokeWidth: 2, r: 5 }} />
                <Area type="monotone" dataKey="revenue" stroke="#1A1A1A" strokeWidth={2} fill="url(#revGrad)" name="Revenue" dot={false} activeDot={{ fill: "#1A1A1A", stroke: "#F7F6F3", strokeWidth: 2, r: 5 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="glass-card p-6">
            <h3 className="text-sm font-semibold text-[#1A1A1A] mb-4 tracking-tight">Daily Clicks</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={ad.dailyData}>
                <defs>
                  <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#1A1A1A" />
                    <stop offset="100%" stopColor="#1A1A1A" stopOpacity={0.6} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(26,26,26,0.06)" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" tick={{ fill: "#75726B", fontFamily: "'JetBrains Mono', monospace", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => v.slice(5)} />
                <YAxis tick={{ fill: "#75726B", fontFamily: "'JetBrains Mono', monospace", fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="clicks" fill="url(#barGrad)" radius={[4, 4, 0, 0]} name="Clicks" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="glass-card p-6">
            <h3 className="text-sm font-semibold text-[#1A1A1A] mb-4 tracking-tight">Detailed Stats</h3>
            <div className="space-y-3">
              {[
                ["Impressions", ad.impressions.toLocaleString()],
                ["Clicks", ad.clicks.toLocaleString()],
                ["Conversions", ad.conversions.toLocaleString()],
                ["Video Views", ad.videoViews.toLocaleString()],
                ["3s Views (Hook)", ad.threeSecViews.toLocaleString()],
                ["Completed Views", ad.completedViews.toLocaleString()],
              ].map(([label, val]) => (
                <div key={label} className="flex justify-between items-center py-2 border-b border-[rgba(26,26,26,0.05)] last:border-b-0">
                  <span className="text-[10px] font-mono uppercase tracking-[0.15em] text-[#75726B]">{label}</span>
                  <span className="text-sm text-[#1A1A1A] font-semibold tabular-nums">{val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
