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

// Extract video_id from object_story_spec, checking multiple nested paths
function extractVideoId(spec: any): string {
  if (!spec) return '';
  return spec.video_data?.video_id
    || spec.link_data?.video_id
    || spec.template_data?.video_id
    || '';
}

// Extract image URL from object_story_spec
function extractImageUrl(spec: any): string {
  if (!spec) return '';
  return spec.video_data?.image_url
    || spec.video_data?.call_to_action?.value?.link
    || spec.link_data?.picture
    || spec.link_data?.image_hash
    || '';
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
    const rawAccountId = accountId.replace('act_', '');

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

    // Fetch insights
    const insightFields = 'ad_id,ad_name,campaign_name,spend,impressions,clicks,actions,action_values,video_play_actions,video_p25_watched_actions,video_30_sec_watched_actions';
    const timeRange = JSON.stringify({ since, until });
    const insightsUrl = `${META_BASE_URL}/${accountId}/insights?level=ad&fields=${insightFields}&time_range=${encodeURIComponent(timeRange)}&time_increment=1&limit=500&access_token=${accessToken}`;

    console.log('Fetching insights, date range:', since, 'to', until);
    const allInsights = await fetchAllPages(insightsUrl);
    console.log(`Got ${allInsights.length} insight rows`);

    const adMap = new Map<string, { name: string; campaignName: string; dailyRows: any[] }>();
    for (const row of allInsights) {
      const adId = row.ad_id;
      if (!adMap.has(adId)) {
        adMap.set(adId, { name: row.ad_name || 'Unknown Ad', campaignName: row.campaign_name || 'Unknown Campaign', dailyRows: [] });
      }
      adMap.get(adId)!.dailyRows.push(row);
    }

    // Fetch ads with status + creative details via object_story_spec
    const adsUrl = `${META_BASE_URL}/${accountId}/ads?fields=id,status,creative{id,object_story_spec,thumbnail_url,image_url}&limit=500&access_token=${accessToken}`;
    let statusMap: Record<string, string> = {};
    let thumbnailMap: Record<string, string> = {};
    let videoIdMap: Record<string, string> = {};

    try {
      const adsData = await fetchAllPages(adsUrl);
      console.log(`Got ${adsData.length} ads`);
      const sMap: Record<string, string> = { ACTIVE: 'active', PAUSED: 'paused', ARCHIVED: 'ended', DELETED: 'ended' };

      for (const ad of adsData) {
        statusMap[ad.id] = sMap[ad.status] || 'paused';
        const creative = ad.creative;
        if (!creative) continue;

        // Extract video_id from object_story_spec
        const videoId = extractVideoId(creative.object_story_spec);
        if (videoId) videoIdMap[ad.id] = videoId;

        // Extract thumbnail: prefer image_url, then thumbnail_url, then from spec
        const imgUrl = creative.image_url || creative.thumbnail_url || extractImageUrl(creative.object_story_spec) || '';
        if (imgUrl) thumbnailMap[ad.id] = imgUrl;
      }
      console.log(`Found ${Object.keys(videoIdMap).length} video IDs from object_story_spec, ${Object.keys(thumbnailMap).length} thumbnails`);
    } catch (e) {
      console.log('Could not fetch ads:', e.message);
    }

    // If we still have no video IDs, try fetching advideos from the account
    if (Object.keys(videoIdMap).length === 0) {
      console.log('No video IDs from creatives, trying advideos endpoint...');
      try {
        const videosUrl = `${META_BASE_URL}/${accountId}/advideos?fields=id,title,source,picture&limit=500&access_token=${accessToken}`;
        const adVideos = await fetchAllPages(videosUrl);
        console.log(`Got ${adVideos.length} account-level videos`);
        // We can't directly map these to ads, but log for debugging
        if (adVideos.length > 0) {
          console.log('Sample video:', JSON.stringify({ id: adVideos[0].id, hasSource: !!adVideos[0].source, title: adVideos[0].title?.slice(0, 50) }));
        }
      } catch (e) {
        console.log('advideos fetch failed:', e.message);
      }
    }

    // Fetch playable video source URLs for found video IDs
    let videoUrlMap: Record<string, string> = {};
    let hdThumbnailMap: Record<string, string> = {};
    const uniqueVideoIds = [...new Set(Object.values(videoIdMap))];
    if (uniqueVideoIds.length > 0) {
      console.log(`Fetching source for ${uniqueVideoIds.length} videos`);
      const videoPromises = uniqueVideoIds.map(async (videoId) => {
        try {
          const res = await fetch(`${META_BASE_URL}/${videoId}?fields=source,picture&access_token=${accessToken}`);
          const json = await res.json();
          if (json.error) { console.log(`Video ${videoId} error:`, json.error.message?.slice(0, 80)); return null; }
          return { id: videoId, source: json.source || '', picture: json.picture || '' };
        } catch (_e) { return null; }
      });
      const videoResults = await Promise.all(videoPromises);
      const videoSourceMap: Record<string, { source: string; picture: string }> = {};
      for (const r of videoResults) {
        if (r) videoSourceMap[r.id] = { source: r.source, picture: r.picture };
      }
      for (const [adId, videoId] of Object.entries(videoIdMap)) {
        const v = videoSourceMap[videoId];
        if (v?.source) videoUrlMap[adId] = v.source;
        if (v?.picture) hdThumbnailMap[adId] = v.picture;
      }
      console.log(`Got ${Object.keys(videoUrlMap).length} playable video URLs`);
    }

    // Build ad metrics
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
          impressions, clicks,
          conversions: Math.round(conversions),
          revenue: Math.round(revenue * 100) / 100,
        };
      });

      // Fallback: Ads Manager URL for when video source isn't available
      const adManagerUrl = `https://adsmanager.facebook.com/adsmanager/manage/ads?act=${rawAccountId}&selected_ad_ids=${adId}`;

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
        thumbnail: hdThumbnailMap[adId] || thumbnailMap[adId] || '',
        videoUrl: videoUrlMap[adId] || '',
        adManagerUrl,
        dailyData,
      };
    });

    await supabase.from('meta_ads_cache').upsert({
      account_id: accountId, since, until, data: adMetrics, fetched_at: new Date().toISOString(),
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
