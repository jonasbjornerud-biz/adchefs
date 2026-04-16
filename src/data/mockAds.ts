export interface AdMetric {
  id: string;
  name: string;
  campaignName: string;
  status: "active" | "paused" | "ended";
  spend: number;
  impressions: number;
  clicks: number;
  conversions: number;
  revenue: number;
  videoViews: number;
  threeSecViews: number;
  completedViews: number;
  ctr: number;
  cpa: number;
  roas: number;
  hookRate: number;
  holdRate: number;
  thumbnail: string;
  videoUrl?: string;
  adManagerUrl?: string;
  viewAdUrl?: string;
  dailyData: { date: string; spend: number; conversions: number; clicks: number; impressions: number; revenue: number }[];
}

export function getAggregateMetrics(ads: AdMetric[]) {
  if (ads.length === 0) {
    return {
      totalSpend: 0,
      totalRevenue: 0,
      avgCTR: 0,
      avgCPA: 0,
      avgROAS: 0,
      avgHookRate: 0,
      avgHoldRate: 0,
      totalConversions: 0,
      totalClicks: 0,
      totalImpressions: 0,
    };
  }

  const totalSpend = ads.reduce((s, a) => s + a.spend, 0);
  const totalImpressions = ads.reduce((s, a) => s + a.impressions, 0);
  const totalClicks = ads.reduce((s, a) => s + a.clicks, 0);
  const totalConversions = ads.reduce((s, a) => s + a.conversions, 0);
  const totalRevenue = ads.reduce((s, a) => s + a.revenue, 0);
  const totalVideoViews = ads.reduce((s, a) => s + a.videoViews, 0);
  const total3s = ads.reduce((s, a) => s + a.threeSecViews, 0);
  const totalCompleted = ads.reduce((s, a) => s + a.completedViews, 0);

  return {
    totalSpend: Math.round(totalSpend * 100) / 100,
    totalRevenue: Math.round(totalRevenue * 100) / 100,
    avgCTR: totalImpressions > 0 ? Math.round((totalClicks / totalImpressions) * 10000) / 100 : 0,
    avgCPA: totalConversions > 0 ? Math.round((totalSpend / totalConversions) * 100) / 100 : 0,
    avgROAS: totalSpend > 0 ? Math.round((totalRevenue / totalSpend) * 100) / 100 : 0,
    avgHookRate: totalVideoViews > 0 ? Math.round((total3s / totalVideoViews) * 10000) / 100 : 0,
    avgHoldRate: total3s > 0 ? Math.round((totalCompleted / total3s) * 10000) / 100 : 0,
    totalConversions,
    totalClicks,
    totalImpressions,
  };
}