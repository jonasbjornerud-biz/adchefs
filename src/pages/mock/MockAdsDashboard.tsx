import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { subDays, format } from "date-fns";
import { DateRange } from "react-day-picker";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { AdTable } from "@/components/dashboard/AdTable";
import { AdDetailPanel } from "@/components/dashboard/AdDetailPanel";
import { OverviewChart } from "@/components/dashboard/OverviewChart";
import { DateRangePicker } from "@/components/dashboard/DateRangePicker";
import { AdMetric, getAggregateMetrics } from "@/data/mockAds";
import { generateMockAds } from "@/data/mockDemoData";
import { MousePointerClick, DollarSign, TrendingUp, Eye, Play, Wifi, ArrowLeft } from "lucide-react";

const MockAdsDashboard = () => {
  const navigate = useNavigate();
  const [selectedAd, setSelectedAd] = useState<AdMetric | null>(null);
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 13),
    to: new Date(),
  });

  const ads = useMemo(() => generateMockAds(), []);
  const metrics = useMemo(() => getAggregateMetrics(ads), [ads]);

  const dateLabel = dateRange?.from && dateRange?.to
    ? `${format(dateRange.from, "MMM d")} – ${format(dateRange.to, "MMM d, yyyy")}`
    : "All time";

  return (
    <div className="min-h-screen bg-[#09090f]">
      <div className="fixed inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 80% 40% at 50% 0%, rgba(124,58,237,0.15) 0%, transparent 100%)' }} />

      <header className="sticky top-0 z-40 border-b border-white/[0.06]" style={{ background: 'rgba(9,9,15,0.85)', backdropFilter: 'blur(12px)' }}>
        <div className="max-w-[1200px] mx-auto px-5 md:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/mock')} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/[0.04] transition-all duration-200 cursor-pointer">
              <ArrowLeft className="w-4 h-4 text-white/30" />
            </button>
            <span className="text-base font-semibold text-white">Meta Ads</span>
            <span className="text-sm text-white/30 hidden sm:inline">Demo Dashboard</span>
          </div>
        </div>
      </header>

      <main className="max-w-[1200px] mx-auto px-5 md:px-8 py-8 space-y-7 relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold text-white">KPI Dashboard</h1>
            <p className="text-sm text-white/40 mt-1">
              {dateLabel} · All campaigns
              <span className="inline-flex items-center gap-1 ml-2 text-emerald-400"><Wifi className="w-3 h-3" /> Demo</span>
            </p>
          </div>
          <DateRangePicker dateRange={dateRange} onDateRangeChange={setDateRange} />
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 md:gap-5">
          <KpiCard label="CTR" value={`${metrics.avgCTR}%`} icon={<MousePointerClick className="w-3.5 h-3.5" />} trend={{ value: 12.3, positive: true }} delay={0} />
          <KpiCard label="CPA" value={`$${metrics.avgCPA}`} icon={<DollarSign className="w-3.5 h-3.5" />} trend={{ value: 5.1, positive: false }} delay={100} />
          <KpiCard label="ROAS" value={`${metrics.avgROAS}x`} icon={<TrendingUp className="w-3.5 h-3.5" />} trend={{ value: 8.7, positive: true }} delay={200} />
          <KpiCard label="Hook Rate" value={`${metrics.avgHookRate}%`} icon={<Eye className="w-3.5 h-3.5" />} trend={{ value: 3.2, positive: true }} delay={300} />
          <KpiCard label="Hold Rate" value={`${metrics.avgHoldRate}%`} icon={<Play className="w-3.5 h-3.5" />} trend={{ value: 1.8, positive: false }} delay={400} />
        </div>

        <OverviewChart ads={ads} />

        <div>
          <h2 className="text-xs uppercase tracking-widest text-white/40 font-medium mb-4">Individual Ads</h2>
          <AdTable ads={ads} onSelect={setSelectedAd} />
        </div>
      </main>

      {selectedAd && <AdDetailPanel ad={selectedAd} onClose={() => setSelectedAd(null)} />}
    </div>
  );
};

export default MockAdsDashboard;
