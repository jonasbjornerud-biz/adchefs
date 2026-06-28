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
    <div className="min-h-screen admin-bloom text-[#1A1A1A] relative">
      {/* Subtle paper grain */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.04] z-[1]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.6'/></svg>\")",
          backgroundSize: '200px 200px',
        }}
      />
      <div
        className="absolute inset-x-0 top-0 h-[420px] pointer-events-none z-[1]"
        style={{ background: 'radial-gradient(ellipse at 90% 0%, rgba(158, 216, 245, 0.28) 0%, transparent 55%)' }}
      />

      {/* Header */}
      <header className="sticky top-0 z-40 glass-topbar">
        <div className="max-w-[1280px] mx-auto px-5 md:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                const cid = new URLSearchParams(window.location.search).get('clientId');
                navigate(cid ? `/admin/clients/${cid}` : '/dashboard');
              }}
              className="w-8 h-8 rounded-[4px] flex items-center justify-center hover:bg-white transition-all duration-200 cursor-pointer border border-[#E2E0D9] hover:border-[#1A1A1A]"
            >
              <ArrowLeft className="w-4 h-4 text-[#1A1A1A]" strokeWidth={1.5} />
            </button>
            <span className="text-sm font-medium text-[#1A1A1A] tracking-tight">KPI Dashboard</span>
          </div>
          <span className="text-[10px] font-mono uppercase tracking-[0.15em] text-[#75726B]">
            {isLoading ? (
              <span className="inline-flex items-center gap-1"><Loader2 className="w-3 h-3 animate-spin" /> Loading</span>
            ) : isLive ? (
              <span className="inline-flex items-center gap-1.5">
                <span className="relative flex w-1.5 h-1.5">
                  <span className="absolute inset-0 rounded-full bg-[#9ED8F5] animate-ping opacity-60" />
                  <span className="relative w-1.5 h-1.5 rounded-full bg-[#9ED8F5]" />
                </span>
                <Wifi className="w-3 h-3" strokeWidth={1.5} /> Live
              </span>
            ) : (
              <span className="inline-flex items-center gap-1"><WifiOff className="w-3 h-3" strokeWidth={1.5} /> No data</span>
            )}
          </span>
        </div>
      </header>

      {/* Hero band */}
      <section className="relative z-10 max-w-[1280px] mx-auto px-5 md:px-8 pt-16 pb-10">
        <span className="eyebrow eyebrow-accent">Paid Performance — {dateLabel}</span>
        <h1 className="mt-6 text-5xl md:text-6xl leading-[0.95] tracking-tight font-semibold max-w-3xl">
          Ad <em>performance</em>, at a glance.
        </h1>
        <p className="mt-5 text-[15px] text-[#75726B] max-w-xl leading-relaxed">
          ROAS, CPA, hook rate, hold rate — pulled live from Meta. Pick a date range, fetch, and drill into any individual ad.
        </p>
        <hr className="w-[100px] h-px bg-[#E2E0D9] border-0 mt-8" />
      </section>

      <main className="max-w-[1280px] mx-auto px-5 md:px-8 pb-16 space-y-8 relative z-10">
        <div className="flex justify-end items-center gap-2">
          <DateRangePicker dateRange={dateRange} onDateRangeChange={setDateRange} />
          <button
            onClick={triggerFetch}
            disabled={isLoading || !dateRange?.from || !dateRange?.to}
            className="h-9 px-4 rounded-[4px] text-sm font-medium text-[#1A1A1A] bg-[#1A1A1A] !text-[#F7F6F3] hover:bg-[#000] flex items-center gap-2 transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" strokeWidth={1.5} />}
            Fetch
          </button>
        </div>

        {/* KPI Grid — order: ROAS, CPA, CTR, Hook Rate, Hold Rate */}
        {isLoading ? (
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 md:gap-5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-[140px] rounded-[4px] bg-[#EEEDE8]" />
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
          <span className="eyebrow mb-4 inline-block">Individual Ads</span>
          <AdTable ads={ads} onSelect={setSelectedAd} />
        </div>
      </main>

      {/* Detail Panel */}
      {selectedAd && <AdDetailPanel ad={selectedAd} onClose={() => setSelectedAd(null)} />}
    </div>
  );
};

export default MetaAdsDashboard;
