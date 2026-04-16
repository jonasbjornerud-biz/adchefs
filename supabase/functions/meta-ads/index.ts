const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const META_API_VERSION = 'v21.0';
const META_BASE_URL = `https://graph.facebook.com/${META_API_VERSION}`;

function getActionValue(actions: { action_type: string; value: string }[] | undefined, type: string): number {
  if (!actions) return 0;
  const action = actions.find((a) => a.action_type === type);
  return action ? parseFloat(action.value) : 0;
}

function sumActionValues(actions: { action_type: string; value: string }[] | undefined): number {
  if (!actions) return 0;
  return actions.reduce((sum, a) => sum + parseFloat(a.value), 0);
}

async function fetchAllPages(url: string): Promise<any[]> {
  let allData: any[] = [];
  let nextUrl: string | null = url;
  while (nextUrl) {
    const res = await fetch(nextUrl);
    const json = await res.json();
    if (json.error) throw new Error(json.error.message);
    allData = allData.concat(json.data || []);
    nextUrl = json.paging?.next || null;
  }
  return allData;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const accessToken = Deno.env.get('META_ACCESS_TOKEN');
    const adAccountId = Deno.env.get('META_AD_ACCOUNT_ID');
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    if (!accessToken || !adAccountId) {
      return new Response(JSON.stringify({ error: 'Missing Meta credentials' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    let since: string;
    let until: string;

    try {
      const body = await req.json();
      since = body.since || '';
      until = body.until || '';
    } catch {
      since = '';
      until = '';
    }

    if (!since || !until) {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(endDate.getDate() - 13);
      since = startDate.toISOString().slice(0, 10);
      until = endDate.toISOString().slice(0, 10);
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    const accountId = adAccountId.startsWith('act_') ? adAccountId : `act_${adAccountId}`;

    const { data: cached } = await supabase
      .from('meta_ads_cache')
      .select('data')
      .eq('account_id', accountId)
      .eq('since', since)
      .eq('until', until)
      .maybeSingle();

    if (cached) {
      console.log('Cache hit for', since, 'to', until);
      return new Response(JSON.stringify({ ads: cached.data, cached: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const insightFields = 'ad_id,ad_name,campaign_name,spend,impressions,clicks,actions,action_values,video_play_actions,video_p25_watched_actions,video_30_sec_watched_actions';
    const timeRange = JSON.stringify({ since, until });
    const insightsUrl = `${META_BASE_URL}/${accountId}/insights?level=ad&fields=${insightFields}&time_range=${encodeURIComponent(timeRange)}&time_increment=1&limit=500&access_token=${accessToken}`;

    console.log('Fetching account-level insights, date range:', since, 'to', until);
    const allInsights = await fetchAllPages(insightsUrl);
    console.log(`Got ${allInsights.length} insight rows`);

    const adMap = new Map<string, {
      name: string; campaignName: string; dailyRows: any[];
    }>();

    for (const row of allInsights) {
      const adId = row.ad_id;
      if (!adMap.has(adId)) {
        adMap.set(adId, {
          name: row.ad_name || 'Unknown Ad',
          campaignName: row.campaign_name || 'Unknown Campaign',
          dailyRows: [],
        });
      }
      adMap.get(adId)!.dailyRows.push(row);
    }

    // Fetch ad statuses and creative info (thumbnail + video)
    const adsUrl = `${META_BASE_URL}/${accountId}/ads?fields=id,status,creative{thumbnail_url,video_id}&limit=500&access_token=${accessToken}`;
    let statusMap: Record<string, string> = {};
    let thumbnailMap: Record<string, string> = {};
    let videoIdMap: Record<string, string> = {};
    try {
      const adsData = await fetchAllPages(adsUrl);
      const sMap: Record<string, string> = { ACTIVE: 'active', PAUSED: 'paused', ARCHIVED: 'ended', DELETED: 'ended' };
      for (const ad of adsData) {
        statusMap[ad.id] = sMap[ad.status] || 'paused';
        if (ad.creative?.thumbnail_url) thumbnailMap[ad.id] = ad.creative.thumbnail_url;
        if (ad.creative?.video_id) videoIdMap[ad.id] = ad.creative.video_id;
      }
    } catch (e) {
      console.log('Could not fetch ad creatives:', e.message);
    }

    // Fetch video source URLs for ads that have videos
    let videoUrlMap: Record<string, string> = {};
    const uniqueVideoIds = [...new Set(Object.values(videoIdMap))];
    if (uniqueVideoIds.length > 0) {
      console.log(`Fetching source URLs for ${uniqueVideoIds.length} videos`);
      const videoPromises = uniqueVideoIds.map(async (videoId) => {
        try {
          const res = await fetch(`${META_BASE_URL}/${videoId}?fields=source&access_token=${accessToken}`);
          const json = await res.json();
          if (json.source) return { id: videoId, source: json.source };
        } catch (_e) { /* skip */ }
        return null;
      });
      const videoResults = await Promise.all(videoPromises);
      const videoSourceMap: Record<string, string> = {};
      for (const r of videoResults) {
        if (r) videoSourceMap[r.id] = r.source;
      }
      // Map ad IDs to video source URLs
      for (const [adId, videoId] of Object.entries(videoIdMap)) {
        if (videoSourceMap[videoId]) videoUrlMap[adId] = videoSourceMap[videoId];
      }
    }

    const adMetrics = Array.from(adMap.entries()).map(([adId, info]) => {
      let totalSpend = 0, totalImpressions = 0, totalClicks = 0, totalConversions = 0, totalRevenue = 0;
      let totalVideoPlays = 0, totalP25Views = 0, total30sViews = 0;

      const dailyData = info.dailyRows.map((day: any) => {
        const spend = parseFloat(day.spend || '0');
        const impressions = parseInt(day.impressions || '0');
        const clicks = parseInt(day.clicks || '0');
        const conversions = getActionValue(day.actions, 'offsite_conversion.fb_pixel_purchase')
          || getActionValue(day.actions, 'purchase')
          || getActionValue(day.actions, 'omni_purchase');
        const revenue = getActionValue(day.action_values, 'offsite_conversion.fb_pixel_purchase')
          || getActionValue(day.action_values, 'purchase')
          || getActionValue(day.action_values, 'omni_purchase');
        const videoPlays = sumActionValues(day.video_play_actions);
        const p25Views = sumActionValues(day.video_p25_watched_actions);
        const sec30Views = sumActionValues(day.video_30_sec_watched_actions);

        totalSpend += spend;
        totalImpressions += impressions;
        totalClicks += clicks;
        totalConversions += conversions;
        totalRevenue += revenue;
        totalVideoPlays += videoPlays;
        totalP25Views += p25Views;
        total30sViews += sec30Views;

        return {
          date: day.date_start,
          spend: Math.round(spend * 100) / 100,
          impressions,
          clicks,
          conversions: Math.round(conversions),
          revenue: Math.round(revenue * 100) / 100,
        };
      });

      return {
        id: adId,
        name: info.name,
        campaignName: info.campaignName,
        status: statusMap[adId] || 'paused',
        spend: Math.round(totalSpend * 100) / 100,
        impressions: totalImpressions,
        clicks: totalClicks,
        conversions: Math.round(totalConversions),
        revenue: Math.round(totalRevenue * 100) / 100,
        videoViews: Math.round(totalVideoPlays),
        threeSecViews: Math.round(totalP25Views),
        completedViews: Math.round(total30sViews),
        ctr: totalImpressions > 0 ? Math.round((totalClicks / totalImpressions) * 10000) / 100 : 0,
        cpa: totalConversions > 0 ? Math.round((totalSpend / totalConversions) * 100) / 100 : 0,
        roas: totalSpend > 0 ? Math.round((totalRevenue / totalSpend) * 100) / 100 : 0,
        hookRate: totalVideoPlays > 0 ? Math.round((totalP25Views / totalVideoPlays) * 10000) / 100 : 0,
        holdRate: totalP25Views > 0 ? Math.round((total30sViews / totalP25Views) * 10000) / 100 : 0,
        thumbnail: thumbnailMap[adId] || '',
        videoUrl: videoUrlMap[adId] || '',
        dailyData,
      };
    });

    await supabase.from('meta_ads_cache').upsert({
      account_id: accountId,
      since,
      until,
      data: adMetrics,
      fetched_at: new Date().toISOString(),
    }, { onConflict: 'account_id,since,until' });

    console.log(`Returning ${adMetrics.length} ad metrics`);
    return new Response(JSON.stringify({ ads: adMetrics }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Edge function error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});