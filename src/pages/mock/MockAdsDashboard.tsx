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

  // Generate sparkline data per metric from daily aggregates
  const sparks = useMemo(() => {
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
  }, [ads]);

  return (
    <div className="min-h-screen bg-[#06060c] relative overflow-hidden">
      {/* Top ambient glow */}
      <div className="fixed inset-x-0 top-0 h-[500px] pointer-events-none" style={{
        background: 'radial-gradient(ellipse 80% 100% at 50% 0%, rgba(124,58,237,0.18) 0%, transparent 70%)',
      }} />
      {/* Bottom horizon glow — moneywise inspired */}
      <div className="fixed inset-x-0 bottom-0 h-[400px] pointer-events-none" style={{
        background: 'radial-gradient(ellipse 60% 100% at 50% 100%, rgba(168,85,247,0.22) 0%, rgba(124,58,237,0.08) 35%, transparent 70%)',
      }} />
      {/* Grid texture */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.025]" style={{
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
        backgroundSize: '48px 48px',
      }} />

      <header className="sticky top-0 z-40 border-b border-white/[0.06]" style={{ background: 'rgba(6,6,12,0.6)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}>
        <div className="max-w-[1280px] mx-auto px-5 md:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/mock')} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/[0.06] transition-all duration-200 cursor-pointer border border-white/[0.06]">
              <ArrowLeft className="w-4 h-4 text-white/50" />
            </button>
            <span className="text-base font-semibold text-white tracking-tight">Meta Ads</span>
            <span className="text-sm text-white/30 hidden sm:inline">Demo Dashboard</span>
          </div>
        </div>
      </header>

      <main className="max-w-[1280px] mx-auto px-5 md:px-8 py-10 space-y-8 relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full mb-3 text-[11px] font-medium text-white/70" style={{
              background: 'rgba(168,85,247,0.10)',
              border: '1px solid rgba(168,85,247,0.25)',
            }}>
              <span className="w-1.5 h-1.5 rounded-full bg-[#a855f7]" style={{ boxShadow: '0 0 8px rgba(168,85,247,0.8)' }} />
              Live Demo Mode
            </div>
            <h1 className="text-4xl font-black text-white tracking-tight">KPI Dashboard</h1>
            <p className="text-sm text-white/40 mt-1.5">
              {dateLabel} · All campaigns
              <span className="inline-flex items-center gap-1 ml-2 text-emerald-400"><Wifi className="w-3 h-3" /> Demo</span>
            </p>
          </div>
          <DateRangePicker dateRange={dateRange} onDateRangeChange={setDateRange} />
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 md:gap-5">
          <KpiCard label="CTR" value={`${metrics.avgCTR}%`} icon={<MousePointerClick className="w-3.5 h-3.5" />} trend={{ value: 12.3, positive: true }} delay={0} spark={sparks.ctr} accent="purple" />
          <KpiCard label="CPA" value={`$${metrics.avgCPA}`} icon={<DollarSign className="w-3.5 h-3.5" />} trend={{ value: 5.1, positive: false }} delay={80} spark={sparks.cpa} accent="pink" />
          <KpiCard label="ROAS" value={`${metrics.avgROAS}x`} icon={<TrendingUp className="w-3.5 h-3.5" />} trend={{ value: 8.7, positive: true }} delay={160} spark={sparks.roas} accent="emerald" />
          <KpiCard label="Hook Rate" value={`${metrics.avgHookRate}%`} icon={<Eye className="w-3.5 h-3.5" />} trend={{ value: 3.2, positive: true }} delay={240} spark={sparks.hook} accent="blue" />
          <KpiCard label="Hold Rate" value={`${metrics.avgHoldRate}%`} icon={<Play className="w-3.5 h-3.5" />} trend={{ value: 1.8, positive: false }} delay={320} spark={sparks.hold} accent="purple" />
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
