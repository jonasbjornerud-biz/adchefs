import { useState, useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { subDays, format } from "date-fns";
import { DateRange } from "react-day-picker";
import { MetricCard } from "@/components/dash/MetricCard";
import { GlassCard } from "@/components/dash/GlassCard";
import { EmptyState } from "@/components/dash/EmptyState";
import { PageHeader } from "@/components/dash/PageHeader";
import { PrimaryButton } from "@/components/dash/PrimaryButton";
import { AdGrid } from "@/components/dashboard/AdGrid";
import { AdDetailPanel } from "@/components/dashboard/AdDetailPanel";
import { OverviewChart } from "@/components/dashboard/OverviewChart";
import { DateRangePicker } from "@/components/dashboard/DateRangePicker";
import { AdMetric } from "@/data/mockAds";
import { useMetaAds } from "@/hooks/useMetaAds";
import {
  MousePointerClick, DollarSign, TrendingUp, Eye, Play,
  Wifi, WifiOff, Loader2, Search, Video, BarChart3,
} from "lucide-react";

const MetaAdsDashboard = () => {
  const navigate = useNavigate();
  const { clientId: adminClientId } = useParams<{ clientId?: string }>();
  const isAdminView = !!adminClientId;
  const [selectedAd, setSelectedAd] = useState<AdMetric | null>(null);
  const [adminBrandName, setAdminBrandName] = useState<string>('');
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 13),
    to: new Date(),
  });

  useEffect(() => {
    if (isAdminView && adminClientId) {
      supabase.from('clients').select('brand_name').eq('id', adminClientId).maybeSingle()
        .then(({ data }) => setAdminBrandName(data?.brand_name || ''));
    }
  }, [isAdminView, adminClientId]);

  const since = dateRange?.from ? format(dateRange.from, "yyyy-MM-dd") : undefined;
  const until = dateRange?.to ? format(dateRange.to, "yyyy-MM-dd") : undefined;

  const { ads, metrics, isLoading, isLive, triggerFetch } = useMetaAds({ since, until });

  const dateLabel = dateRange?.from && dateRange?.to
    ? `${format(dateRange.from, "MMM d")} – ${format(dateRange.to, "MMM d, yyyy")}`
    : "All time";

  // Build daily totals for sparklines
  const dailySeries = useMemo(() => {
    const map = new Map<string, { spend: number; revenue: number; clicks: number; impressions: number; conversions: number; threeSec: number; videoViews: number; completed: number }>();
    ads.forEach((a) => a.dailyData.forEach((d) => {
      const e = map.get(d.date) || { spend: 0, revenue: 0, clicks: 0, impressions: 0, conversions: 0, threeSec: 0, videoViews: 0, completed: 0 };
      e.spend += d.spend; e.revenue += d.revenue; e.clicks += d.clicks; e.impressions += d.impressions; e.conversions += d.conversions;
      map.set(d.date, e);
    }));
    return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b)).map(([, v]) => v);
  }, [ads]);

  const sparkCTR = dailySeries.map((d) => d.impressions > 0 ? (d.clicks / d.impressions) * 100 : 0);
  const sparkCPA = dailySeries.map((d) => d.conversions > 0 ? d.spend / d.conversions : 0);
  const sparkROAS = dailySeries.map((d) => d.spend > 0 ? d.revenue / d.spend : 0);

  return (
    <div className="dash-bg">
      <PageHeader
        backTo={isAdminView ? `/admin/clients/${adminClientId}` : '/dashboard'}
        crumbs={[{ label: 'Meta Ads' }, { label: 'Dashboard' }]}
        badge={isAdminView && adminBrandName ? { label: `Admin · ${adminBrandName}` } : undefined}
      />

      <main className="max-w-[1280px] mx-auto px-5 md:px-8 py-8 space-y-7 relative z-10">
        {/* Title row */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h1 className="dash-font-display" style={{ fontSize: 40, color: 'var(--dash-text-primary)' }}>
              KPI Dashboard
            </h1>
            <p className="text-[13px] mt-2 dash-font-body" style={{ color: 'var(--dash-text-tertiary)' }}>
              {dateLabel} · All campaigns
              {isLoading ? (
                <span className="inline-flex items-center gap-1 ml-2" style={{ color: 'var(--dash-accent-glow)' }}>
                  · <Loader2 className="w-3 h-3 animate-spin" /> Loading
                </span>
              ) : isLive ? (
                <span className="inline-flex items-center gap-1 ml-2" style={{ color: 'var(--dash-success)' }}>
                  · <Wifi className="w-3 h-3" /> Live
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 ml-2" style={{ color: 'var(--dash-text-tertiary)' }}>
                  · <WifiOff className="w-3 h-3" /> No data
                </span>
              )}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <DateRangePicker dateRange={dateRange} onDateRangeChange={setDateRange} />
            <PrimaryButton onClick={triggerFetch} disabled={!dateRange?.from || !dateRange?.to} loading={isLoading}>
              {!isLoading && <Search className="w-4 h-4" />}
              Fetch
            </PrimaryButton>
          </div>
        </div>

        {/* KPI grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 md:gap-5">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-[160px] rounded-[12px] animate-pulse" style={{ background: 'var(--dash-bg-surface)' }} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 md:gap-5">
            <MetricCard label="CTR"      numericValue={metrics.avgCTR}      suffix="%" decimals={2} icon={<MousePointerClick className="w-3.5 h-3.5" />} delta={{ value: 12.3, positive: true }} sparkline={sparkCTR} delay={0}   />
            <MetricCard label="CPA"      numericValue={metrics.avgCPA}      prefix="$" decimals={2} icon={<DollarSign className="w-3.5 h-3.5" />}        delta={{ value: 5.1,  positive: false }} sparkline={sparkCPA} delay={60}  />
            <MetricCard label="ROAS"     numericValue={metrics.avgROAS}     suffix="x" decimals={2} icon={<TrendingUp className="w-3.5 h-3.5" />}        delta={{ value: 8.7,  positive: true }}  sparkline={sparkROAS} delay={120} />
            <MetricCard label="Hook Rate" numericValue={metrics.avgHookRate} suffix="%" decimals={2} icon={<Eye className="w-3.5 h-3.5" />}              delta={{ value: 3.2,  positive: true }}  delay={180} />
            <MetricCard label="Hold Rate" numericValue={metrics.avgHoldRate} suffix="%" decimals={2} icon={<Play className="w-3.5 h-3.5" />}             delta={{ value: 1.8,  positive: false }} delay={240} />
          </div>
        )}

        {/* Overview chart or empty state */}
        {!isLoading && ads.length === 0 ? (
          <GlassCard hover={false} className="p-2">
            <EmptyState
              icon={BarChart3}
              title="No data for this range"
              description="Adjust the date range or click Fetch to load fresh Meta Ads data."
            />
          </GlassCard>
        ) : (
          <OverviewChart ads={ads} />
        )}

        {/* Ads grid */}
        <div>
          <h2 className="dash-font-label mb-4">Individual Ads</h2>
          {!isLoading && ads.length === 0 ? (
            <GlassCard hover={false} className="p-2">
              <EmptyState icon={Video} title="No ads for this date range" description="Try a wider date range or check your Meta connection." />
            </GlassCard>
          ) : (
            <AdGrid ads={ads} onSelect={setSelectedAd} />
          )}
        </div>
      </main>

      {selectedAd && <AdDetailPanel ad={selectedAd} onClose={() => setSelectedAd(null)} />}
    </div>
  );
};

export default MetaAdsDashboard;
