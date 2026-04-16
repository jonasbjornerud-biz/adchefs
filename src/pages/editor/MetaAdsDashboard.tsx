import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { subDays, format } from "date-fns";
import { DateRange } from "react-day-picker";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { AdTable } from "@/components/dashboard/AdTable";
import { AdDetailPanel } from "@/components/dashboard/AdDetailPanel";
import { OverviewChart } from "@/components/dashboard/OverviewChart";
import { HorizonGlow } from "@/components/dashboard/HorizonGlow";
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

  // Sparkline data per metric from daily aggregates
  const sparks = (() => {
    const dateMap = new Map<string, { ctr: number; cpa: number; roas: number; hook: number; hold: number; n: number }>();
    ads.forEach(ad => ad.dailyData.forEach(d => {
      const e = dateMap.get(d.date) || { ctr: 0, cpa: 0, roas: 0, hook: 0, hold: 0, n: 0 };
      const ctr = d.clicks && d.impressions ? (d.clicks / d.impressions) * 100 : 0;
      const cpa = (d as any).conversions ? d.spend / (d as any).conversions : 0;
      const roas = d.spend ? d.revenue / d.spend : 0;
      dateMap.set(d.date, {
        ctr: e.ctr + ctr, cpa: e.cpa + cpa, roas: e.roas + roas,
        hook: e.hook + (ad.hookRate || 0), hold: e.hold + (ad.holdRate || 0), n: e.n + 1,
      });
    }));
    const sorted = Array.from(dateMap.entries()).sort(([a], [b]) => a.localeCompare(b)).map(([, v]) => v);
    return {
      ctr: sorted.map(v => v.n ? v.ctr / v.n : 0),
      cpa: sorted.map(v => v.n ? v.cpa / v.n : 0),
      roas: sorted.map(v => v.n ? v.roas / v.n : 0),
      hook: sorted.map(v => v.n ? v.hook / v.n : 0),
      hold: sorted.map(v => v.n ? v.hold / v.n : 0),
    };
  })();

  return (
    <div className="min-h-screen bg-[#06060c] relative overflow-hidden">
      {/* Top ambient glow */}
      <div className="fixed inset-x-0 top-0 h-[500px] pointer-events-none" style={{
        background: 'radial-gradient(ellipse 80% 100% at 50% 0%, rgba(124,58,237,0.18) 0%, transparent 70%)',
      }} />
      {/* Bottom horizon glow */}
      <div className="fixed inset-x-0 bottom-0 h-[400px] pointer-events-none" style={{
        background: 'radial-gradient(ellipse 60% 100% at 50% 100%, rgba(168,85,247,0.22) 0%, rgba(124,58,237,0.08) 35%, transparent 70%)',
      }} />
      {/* Grid texture */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.025]" style={{
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
        backgroundSize: '48px 48px',
      }} />

      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-white/[0.06]" style={{ background: 'rgba(6,6,12,0.6)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}>
        <div className="max-w-[1280px] mx-auto px-5 md:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/dashboard')}
              className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/[0.06] transition-all duration-200 cursor-pointer border border-white/[0.06]"
            >
              <ArrowLeft className="w-4 h-4 text-white/50" />
            </button>
            <span className="text-base font-semibold text-white tracking-tight">Meta Ads</span>
            <span className="text-sm text-white/30 hidden sm:inline">Dashboard</span>
          </div>
        </div>
      </header>

      {/* Hero band with horizon arc */}
      <div className="relative">
        <HorizonGlow height={320} />
        <div className="max-w-[1280px] mx-auto px-5 md:px-8 pt-16 pb-20 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full mb-5 text-[11px] font-medium text-white/80" style={{
            background: 'rgba(168,85,247,0.12)',
            border: '1px solid rgba(168,85,247,0.30)',
            boxShadow: '0 0 24px -6px rgba(168,85,247,0.5)',
          }}>
            <span className="w-1.5 h-1.5 rounded-full bg-[#a855f7]" style={{ boxShadow: '0 0 8px rgba(168,85,247,0.8)' }} />
            {isLoading ? 'Loading…' : isLive ? 'Live data' : 'No data'}
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-white tracking-tight">KPI Dashboard</h1>
          <p className="text-sm text-white/50 mt-3">
            {dateLabel} · All campaigns
            {isLoading ? (
              <span className="inline-flex items-center gap-1 ml-2 text-[#a855f7]"><Loader2 className="w-3 h-3 animate-spin" /> Loading</span>
            ) : isLive ? (
              <span className="inline-flex items-center gap-1 ml-2 text-emerald-400"><Wifi className="w-3 h-3" /> Live</span>
            ) : (
              <span className="inline-flex items-center gap-1 ml-2 text-white/40"><WifiOff className="w-3 h-3" /> No data</span>
            )}
          </p>
        </div>
      </div>

      <main className="max-w-[1280px] mx-auto px-5 md:px-8 pb-10 space-y-8 relative z-10">
        <div className="flex justify-end items-center gap-2">
          <DateRangePicker dateRange={dateRange} onDateRangeChange={setDateRange} />
          <button
            onClick={triggerFetch}
            disabled={isLoading || !dateRange?.from || !dateRange?.to}
            className="h-9 px-4 rounded-lg text-sm font-medium text-white flex items-center gap-2 transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: 'linear-gradient(135deg, #a855f7, #7c3aed)',
              boxShadow: '0 4px 16px -4px rgba(168,85,247,0.5)',
            }}
            onMouseEnter={e => { if (!(e.currentTarget as HTMLButtonElement).disabled) (e.currentTarget as HTMLElement).style.boxShadow = '0 0 24px rgba(168,85,247,0.6)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 16px -4px rgba(168,85,247,0.5)'; }}
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            Fetch
          </button>
        </div>

        {/* KPI Grid — order: ROAS, CPA, CTR, Hook Rate, Hold Rate */}
        {isLoading ? (
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 md:gap-5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-[140px] rounded-2xl bg-white/[0.03]" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 md:gap-5">
            <KpiCard label="ROAS" value={`${metrics.avgROAS}x`} icon={<TrendingUp className="w-3.5 h-3.5" />} trend={{ value: 8.7, positive: true }} delay={0} spark={sparks.roas} accent="emerald" />
            <KpiCard label="CPA" value={`$${metrics.avgCPA}`} icon={<DollarSign className="w-3.5 h-3.5" />} trend={{ value: 5.1, positive: false }} delay={80} spark={sparks.cpa} accent="pink" />
            <KpiCard label="CTR" value={`${metrics.avgCTR}%`} icon={<MousePointerClick className="w-3.5 h-3.5" />} trend={{ value: 12.3, positive: true }} delay={160} spark={sparks.ctr} accent="purple" />
            <KpiCard label="Hook Rate" value={`${metrics.avgHookRate}%`} icon={<Eye className="w-3.5 h-3.5" />} trend={{ value: 3.2, positive: true }} delay={240} spark={sparks.hook} accent="blue" />
            <KpiCard label="Hold Rate" value={`${metrics.avgHoldRate}%`} icon={<Play className="w-3.5 h-3.5" />} trend={{ value: 1.8, positive: false }} delay={320} spark={sparks.hold} accent="purple" />
          </div>
        )}

        {/* Overview Chart */}
        <OverviewChart ads={ads} />

        {/* Ad Table */}
        <div>
          <h2 className="text-[10px] uppercase tracking-[0.18em] text-white/50 font-semibold mb-4 flex items-center gap-2">
            <span className="w-1 h-1 rounded-full bg-[#a855f7]" style={{ boxShadow: '0 0 6px rgba(168,85,247,0.8)' }} />
            Individual Ads
          </h2>
          <AdTable ads={ads} onSelect={setSelectedAd} />
        </div>
      </main>

      {/* Detail Panel */}
      {selectedAd && <AdDetailPanel ad={selectedAd} onClose={() => setSelectedAd(null)} />}
    </div>
  );
};

export default MetaAdsDashboard;
