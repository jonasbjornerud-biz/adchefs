import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { subDays, format } from "date-fns";
import { DateRange } from "react-day-picker";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { AdTable } from "@/components/dashboard/AdTable";
import { AdDetailPanel } from "@/components/dashboard/AdDetailPanel";
import { OverviewChart } from "@/components/dashboard/OverviewChart";
import { DateRangePicker } from "@/components/dashboard/DateRangePicker";
import { AdMetric } from "@/data/mockAds";
import { useMetaAds } from "@/hooks/useMetaAds";
import { MousePointerClick, DollarSign, TrendingUp, Eye, Play, Wifi, WifiOff, Loader2, Search, ArrowLeft } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const MetaAdsDashboard = () => {
  const navigate = useNavigate();
  const [selectedAd, setSelectedAd] = useState<AdMetric | null>(null);
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 13),
    to: new Date(),
  });

  const since = dateRange?.from ? format(dateRange.from, "yyyy-MM-dd") : undefined;
  const until = dateRange?.to ? format(dateRange.to, "yyyy-MM-dd") : undefined;

  const { ads, metrics, isLoading, isLive, triggerFetch } = useMetaAds({ since, until });

  const dateLabel = dateRange?.from && dateRange?.to
    ? `${format(dateRange.from, "MMM d")} – ${format(dateRange.to, "MMM d, yyyy")}`
    : "All time";

  return (
    <div className="min-h-screen bg-[#09090f]">
      {/* Purple glow */}
      <div className="fixed inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse 80% 40% at 50% 0%, rgba(124,58,237,0.15) 0%, transparent 100%)',
      }} />

      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-white/[0.06]" style={{ background: 'rgba(9,9,15,0.85)', backdropFilter: 'blur(12px)' }}>
        <div className="max-w-[1200px] mx-auto px-5 md:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/dashboard')}
              className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/[0.04] transition-all duration-200 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 text-white/30" />
            </button>
            <span className="text-base font-semibold text-white">Meta Ads</span>
            <span className="text-sm text-white/30 hidden sm:inline">Dashboard</span>
          </div>
        </div>
      </header>

      <main className="max-w-[1200px] mx-auto px-5 md:px-8 py-8 space-y-7 relative z-10">
        {/* Title + Date Picker + Fetch */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold text-white">Ad Performance</h1>
            <p className="text-sm text-white/40 mt-1">
              {dateLabel} · All campaigns
              {isLoading ? (
                <span className="inline-flex items-center gap-1 ml-2 text-[#a855f7]"><Loader2 className="w-3 h-3 animate-spin" /> Loading</span>
              ) : isLive ? (
                <span className="inline-flex items-center gap-1 ml-2 text-emerald-400"><Wifi className="w-3 h-3" /> Live</span>
              ) : (
                <span className="inline-flex items-center gap-1 ml-2 text-white/30"><WifiOff className="w-3 h-3" /> No data</span>
              )}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <DateRangePicker dateRange={dateRange} onDateRangeChange={setDateRange} />
            <button
              onClick={triggerFetch}
              disabled={isLoading || !dateRange?.from || !dateRange?.to}
              className="h-9 px-4 rounded-lg text-sm font-medium text-white flex items-center gap-2 transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: 'linear-gradient(135deg, #a855f7, #7c3aed)',
              }}
              onMouseEnter={e => { if (!(e.currentTarget as HTMLButtonElement).disabled) (e.currentTarget as HTMLElement).style.boxShadow = '0 0 20px rgba(168,85,247,0.4)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = 'none'; }}
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              Fetch
            </button>
          </div>
        </div>

        {/* KPI Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 md:gap-5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-[100px] rounded-2xl bg-[#111118]" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 md:gap-5">
            <KpiCard label="CTR" value={`${metrics.avgCTR}%`} icon={<MousePointerClick className="w-3.5 h-3.5" />} trend={{ value: 12.3, positive: true }} delay={0} />
            <KpiCard label="CPA" value={`$${metrics.avgCPA}`} icon={<DollarSign className="w-3.5 h-3.5" />} trend={{ value: 5.1, positive: false }} delay={100} />
            <KpiCard label="ROAS" value={`${metrics.avgROAS}x`} icon={<TrendingUp className="w-3.5 h-3.5" />} trend={{ value: 8.7, positive: true }} delay={200} />
            <KpiCard label="Hook Rate" value={`${metrics.avgHookRate}%`} icon={<Eye className="w-3.5 h-3.5" />} trend={{ value: 3.2, positive: true }} delay={300} />
            <KpiCard label="Hold Rate" value={`${metrics.avgHoldRate}%`} icon={<Play className="w-3.5 h-3.5" />} trend={{ value: 1.8, positive: false }} delay={400} />
          </div>
        )}

        {/* Overview Chart */}
        <OverviewChart ads={ads} />

        {/* Ad Table */}
        <div>
          <h2 className="text-xs uppercase tracking-widest text-white/40 font-medium mb-4">Individual Ads</h2>
          <AdTable ads={ads} onSelect={setSelectedAd} />
        </div>
      </main>

      {/* Detail Panel */}
      {selectedAd && <AdDetailPanel ad={selectedAd} onClose={() => setSelectedAd(null)} />}
    </div>
  );
};

export default MetaAdsDashboard;
