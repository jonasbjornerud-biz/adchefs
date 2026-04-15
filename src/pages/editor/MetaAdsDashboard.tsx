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
import { Button } from "@/components/ui/button";

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
    <div className="min-h-screen bg-page bg-dot-grid">
      {/* Top Nav */}
      <header className="sticky top-0 z-40 bg-[rgba(9,9,11,0.8)] backdrop-blur-md border-b border-[rgba(255,255,255,0.05)]">
        <div className="max-w-[1200px] mx-auto px-5 md:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/dashboard')}
              className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-[rgba(139,92,246,0.08)] transition-colors"
            >
              <ArrowLeft className="w-4 h-4 text-secondary-readable" />
            </button>
            <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-xs font-bold text-white">M</div>
            <span className="text-base font-semibold text-primary-readable">Meta Ads</span>
            <span className="text-sm text-secondary-readable hidden sm:inline">Dashboard</span>
          </div>
        </div>
      </header>

      <main className="max-w-[1200px] mx-auto px-5 md:px-8 py-6 space-y-7">
        {/* Title + Date Picker + Fetch */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold text-gradient">Ad Performance</h1>
            <p className="text-sm text-secondary-readable mt-1">
              {dateLabel} · All campaigns
              {isLoading ? (
                <span className="inline-flex items-center gap-1 ml-2 text-[#8B5CF6]"><Loader2 className="w-3 h-3 animate-spin" /> Loading</span>
              ) : isLive ? (
                <span className="inline-flex items-center gap-1 ml-2 text-[#10B981]"><Wifi className="w-3 h-3" /> Live</span>
              ) : (
                <span className="inline-flex items-center gap-1 ml-2 text-muted-readable"><WifiOff className="w-3 h-3" /> No data</span>
              )}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <DateRangePicker dateRange={dateRange} onDateRangeChange={setDateRange} />
            <Button
              onClick={triggerFetch}
              disabled={isLoading || !dateRange?.from || !dateRange?.to}
              className="gradient-primary text-white font-medium gap-2"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              Fetch
            </Button>
          </div>
        </div>

        {/* KPI Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 md:gap-5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-[100px] rounded-[16px] bg-card-surface" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 md:gap-5">
            <KpiCard label="CTR" value={`${metrics.avgCTR}%`} icon={<MousePointerClick className="w-5 h-5" />} trend={{ value: 12.3, positive: true }} delay={0} />
            <KpiCard label="CPA" value={`$${metrics.avgCPA}`} icon={<DollarSign className="w-5 h-5" />} trend={{ value: 5.1, positive: false }} delay={100} />
            <KpiCard label="ROAS" value={`${metrics.avgROAS}x`} icon={<TrendingUp className="w-5 h-5" />} trend={{ value: 8.7, positive: true }} delay={200} />
            <KpiCard label="Hook Rate" value={`${metrics.avgHookRate}%`} icon={<Eye className="w-5 h-5" />} trend={{ value: 3.2, positive: true }} delay={300} />
            <KpiCard label="Hold Rate" value={`${metrics.avgHoldRate}%`} icon={<Play className="w-5 h-5" />} trend={{ value: 1.8, positive: false }} delay={400} />
          </div>
        )}

        {/* Overview Chart */}
        <OverviewChart ads={ads} />

        {/* Ad Table */}
        <div>
          <h2 className="text-xl font-semibold text-primary-readable mb-4">Individual Ads</h2>
          <AdTable ads={ads} onSelect={setSelectedAd} />
        </div>
      </main>

      {/* Detail Panel */}
      {selectedAd && <AdDetailPanel ad={selectedAd} onClose={() => setSelectedAd(null)} />}
    </div>
  );
};

export default MetaAdsDashboard;