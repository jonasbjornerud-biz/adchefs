import { AdMetric } from "./mockAds";

// ---------- MOCK META ADS DATA ($120k/mo spend) ----------

function randomBetween(min: number, max: number) {
  return Math.round((Math.random() * (max - min) + min) * 100) / 100;
}

function generateDailyData(days: number, avgDailySpend: number) {
  const data = [];
  const now = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const spend = avgDailySpend * randomBetween(0.7, 1.3);
    const impressions = Math.round(spend * randomBetween(80, 150));
    const clicks = Math.round(impressions * randomBetween(0.015, 0.04));
    const conversions = Math.round(clicks * randomBetween(0.03, 0.08));
    const revenue = conversions * randomBetween(40, 120);
    data.push({
      date: d.toISOString().split("T")[0],
      spend: Math.round(spend * 100) / 100,
      impressions,
      clicks,
      conversions,
      revenue: Math.round(revenue * 100) / 100,
    });
  }
  return data;
}

const adNames = [
  "UGC Testimonial – Before/After",
  "Product Demo – Kitchen Set",
  "Founder Story – Why We Started",
  "Lifestyle Montage – Summer Drop",
  "Problem/Solution – Pain Points",
  "Social Proof – Customer Reviews",
  "Unboxing Experience – Premium",
  "How-To Tutorial – Quick Guide",
  "Comparison Ad – Us vs Them",
  "Flash Sale – Limited Time",
  "Behind The Scenes – Production",
  "Influencer Collab – @SarahK",
];

const campaigns = [
  "TOF – Prospecting",
  "TOF – Broad Audience",
  "MOF – Retargeting",
  "BOF – Converters",
  "Scaling – Winners",
  "Testing – New Creatives",
];

export function generateMockAds(): AdMetric[] {
  const dailyBudget = 120000 / 30; // $4000/day total
  const adCount = 12;
  const perAdDaily = dailyBudget / adCount;

  return adNames.map((name, i) => {
    const daily = generateDailyData(14, perAdDaily);
    const spend = daily.reduce((s, d) => s + d.spend, 0);
    const impressions = daily.reduce((s, d) => s + d.impressions, 0);
    const clicks = daily.reduce((s, d) => s + d.clicks, 0);
    const conversions = daily.reduce((s, d) => s + d.conversions, 0);
    const revenue = daily.reduce((s, d) => s + d.revenue, 0);
    const videoViews = Math.round(impressions * randomBetween(0.3, 0.6));
    const threeSecViews = Math.round(videoViews * randomBetween(0.25, 0.55));
    const completedViews = Math.round(threeSecViews * randomBetween(0.1, 0.35));

    return {
      id: `mock-ad-${i + 1}`,
      name,
      campaignName: campaigns[i % campaigns.length],
      status: i < 9 ? "active" : i < 11 ? "paused" : "ended",
      spend: Math.round(spend * 100) / 100,
      impressions,
      clicks,
      conversions,
      revenue: Math.round(revenue * 100) / 100,
      videoViews,
      threeSecViews,
      completedViews,
      ctr: impressions > 0 ? Math.round((clicks / impressions) * 10000) / 100 : 0,
      cpa: conversions > 0 ? Math.round((spend / conversions) * 100) / 100 : 0,
      roas: spend > 0 ? Math.round((revenue / spend) * 100) / 100 : 0,
      hookRate: videoViews > 0 ? Math.round((threeSecViews / videoViews) * 10000) / 100 : 0,
      holdRate: threeSecViews > 0 ? Math.round((completedViews / threeSecViews) * 10000) / 100 : 0,
      thumbnail: "",
      dailyData: daily,
    } as AdMetric;
  });
}

// ---------- MOCK EDITOR PERFORMANCE DATA ----------

const EDITOR_NAMES = ["Marcus L.", "Priya S.", "Jake R.", "Amina K."];
const WEEKDAYS_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

interface MockEodRow {
  Month: string;
  Week: string;
  Date: string;
  Name: string;
  "Videos Delivered": string;
  "Select the working day the report is for": string;
}

interface MockPaymentRow {
  brief: string;
  date: string;
  month: string;
  approved: boolean;
}

export interface MockPerformanceData {
  eod: MockEodRow[];
  editors: string[];
  months: string[];
  paymentRows: MockPaymentRow[];
}

export function generateMockPerformanceData(): MockPerformanceData {
  const months = ["January", "February", "March", "April"];
  const eod: MockEodRow[] = [];

  months.forEach((month, mi) => {
    const daysInMonth = [31, 28, 31, 30][mi];
    for (let week = 1; week <= 4; week++) {
      WEEKDAYS_LABELS.forEach((dayLabel, di) => {
        const dateNum = (week - 1) * 7 + di + 1;
        if (dateNum > daysInMonth) return;

        EDITOR_NAMES.forEach((name) => {
          // Each editor delivers 1-3 videos per day, skip some days randomly
          if (Math.random() < 0.1) return; // 10% chance of day off
          const delivered = Math.floor(Math.random() * 3) + 1;
          eod.push({
            Month: month,
            Week: String(week),
            Date: String(dateNum),
            Name: name,
            "Videos Delivered": String(delivered),
            "Select the working day the report is for": dayLabel,
          });
        });
      });
    }
  });

  // Generate payment/approval rows
  const briefNames = [
    "Summer Collection Hero",
    "Product Launch V2",
    "Customer Testimonial Comp",
    "Flash Sale Promo",
    "Brand Story Edit",
    "Before/After Transformation",
    "Quick Tutorial Cut",
    "Social Proof Reel",
    "Unboxing Experience",
    "Lifestyle Montage",
    "Problem/Solution Ad",
    "Founder Story V3",
    "Comparison Breakdown",
    "Holiday Special",
    "Influencer Collab Edit",
    "Behind The Scenes",
    "UGC Compilation",
    "Product Demo – Kitchen",
    "Seasonal Campaign",
    "Retargeting Creative",
  ];

  const paymentRows: MockPaymentRow[] = [];
  let briefIdx = 0;
  months.forEach((month, mi) => {
    const count = 12 + Math.floor(Math.random() * 8); // 12-19 approved per month
    for (let i = 0; i < count; i++) {
      const day = Math.floor(Math.random() * 28) + 1;
      paymentRows.push({
        brief: briefNames[briefIdx % briefNames.length] + ` #${briefIdx + 1}`,
        date: `${month.slice(0, 3)} ${day}, 2025`,
        month,
        approved: Math.random() > 0.15, // 85% approved
      });
      briefIdx++;
    }
  });

  return {
    eod,
    editors: ["(All Editors)", ...EDITOR_NAMES],
    months,
    paymentRows,
  };
}
