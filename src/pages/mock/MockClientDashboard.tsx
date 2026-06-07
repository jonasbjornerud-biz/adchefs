import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, BarChart3, TrendingUp, ArrowRight, FileSpreadsheet, Zap } from 'lucide-react';
import { getWeekToDateRange, formatCurrency, formatNumber } from '@/lib/weekToDate';
import { generateMockAds, generateMockPerformanceData } from '@/data/mockDemoData';

const BRAND = 'Acme Goods';

export default function MockClientDashboard() {
  const navigate = useNavigate();

  const wtd = useMemo(() => getWeekToDateRange(), []);

  const performanceStats = useMemo(() => {
    const data = generateMockPerformanceData();
    const daysFraction = wtd.daysCount / 28; // ~4 weeks of mock data
    const totalVideos = data.eod.reduce((s, r) => s + Number(r['Videos Delivered'] || 0), 0);
    const wtdVideos = Math.round(totalVideos * daysFraction * 0.25);
    const activeEditors = new Set(data.eod.map((r) => r.Name)).size;
    return [
      { label: 'Videos delivered', value: formatNumber(wtdVideos) },
      { label: 'Active editors', value: String(activeEditors) },
    ];
  }, [wtd.daysCount]);

  const adsStats = useMemo(() => {
    const ads = generateMockAds();
    let spend = 0;
    let revenue = 0;
    ads.forEach((ad) => {
      const recent = (ad as any).dailyData?.slice(-wtd.daysCount) ?? [];
      recent.forEach((d: any) => {
        spend += d.spend || 0;
        revenue += d.revenue || 0;
      });
    });
    const roas = spend > 0 ? revenue / spend : 0;
    return [
      { label: 'Ad spend', value: formatCurrency(spend) },
      { label: 'ROAS', value: `${roas.toFixed(2)}x` },
    ];
  }, [wtd.daysCount]);

  const cards = [
    {
      title: 'Editor Performance',
      emphasis: 'Performance',
      titlePrefix: 'Editor',
      description: 'Track deliveries, editor output, approval rates, and weekly trends across your team.',
      icon: BarChart3,
      route: '/mock/performance',
      statusLabel: 'Sample data',
      statusIcon: FileSpreadsheet,
      cta: 'Open Performance',
      stats: performanceStats,
      rangeLabel: wtd.label,
    },
    {
      title: 'KPI Dashboard',
      emphasis: 'Dashboard',
      titlePrefix: 'KPI',
      description: 'Monitor ad spend, ROAS, CTR, CPA, and revenue with real-time Meta Ads data.',
      icon: TrendingUp,
      route: '/mock/ads',
      statusLabel: 'Sample data',
      statusIcon: Zap,
      cta: 'Open Dashboard',
      stats: adsStats,
      rangeLabel: wtd.label,
    },
  ];

  return (
    <div className="min-h-screen bg-[#F7F6F3] text-[#1A1A1A] relative overflow-hidden">
      {/* Subtle paper grain */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.04] z-[1]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.6'/></svg>\")",
          backgroundSize: '200px 200px',
        }}
      />
      {/* Soft top-right accent wash */}
      <div
        className="absolute inset-0 pointer-events-none z-[1]"
        style={{
          background:
            'radial-gradient(ellipse at 90% 0%, rgba(158, 216, 245, 0.30) 0%, transparent 55%)',
        }}
      />

      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-[#E2E0D9] bg-[#F7F6F3]/85 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-[4px] flex items-center justify-center text-[#1A1A1A] text-xs font-semibold border border-[#1A1A1A]/15 bg-[#9ED8F5]">
              {BRAND.charAt(0)}
            </div>
            <span className="text-sm font-medium tracking-tight">
              {BRAND}
              <span className="text-[#9ED8F5]">.</span>
            </span>
            <span className="ml-1 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[4px] text-[10px] font-mono uppercase tracking-[0.15em] bg-[#9ED8F5]/25 text-[#1A1A1A] border border-[#9ED8F5]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#9ED8F5]" />
              Sample
            </span>
          </div>
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-[0.15em] text-[#75726B] hover:text-[#1A1A1A] transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" /> Exit Demo
          </button>
        </div>
      </header>

      {/* Hero band */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 pt-20 pb-12">
        <span className="eyebrow eyebrow-accent">Client Portal — Sample data</span>
        <h1 className="mt-6 text-5xl md:text-6xl leading-[0.95] tracking-tight font-semibold max-w-3xl">
          Welcome back, <em>{BRAND}</em>.
        </h1>
        <p className="mt-5 text-[15px] text-[#75726B] max-w-xl leading-relaxed">
          A live preview using sample data. Every chart and number below is illustrative — pick where you want to look.
        </p>
        <hr className="w-[100px] h-px bg-[#E2E0D9] border-0 mt-8" />
      </section>

      {/* Cards */}
      <main className="relative z-10 max-w-6xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {cards.map((card, idx) => {
            const Icon = card.icon;
            const StatusIcon = card.statusIcon;
            return (
              <button
                key={card.title}
                onClick={() => navigate(card.route)}
                className="group text-left relative overflow-hidden rounded-[4px] p-8 transition-all duration-300 bg-white border border-[#E2E0D9] cursor-pointer hover:border-[#1A1A1A] hover:-translate-y-0.5 hover:shadow-[0_24px_60px_-30px_rgba(26,26,26,0.35)]"
              >
                <span
                  className="absolute top-0 left-0 h-px transition-all duration-300 bg-[#9ED8F5]"
                  style={{ width: '64px' }}
                />

                <div className="relative flex flex-col h-full min-h-[280px]">
                  <div className="flex items-start justify-between mb-8">
                    <div className="flex items-center gap-3">
                      <span className="eyebrow">0{idx + 1}</span>
                      <Icon className="w-4 h-4 text-[#75726B]" strokeWidth={1.5} />
                    </div>
                    <ArrowRight className="w-5 h-5 text-[#1A1A1A] transition-transform duration-300 group-hover:translate-x-1" strokeWidth={1.5} />
                  </div>

                  <h3 className="text-[28px] leading-[1.05] tracking-tight font-semibold mb-3">
                    {card.titlePrefix} <em>{card.emphasis}</em>
                  </h3>
                  <p className="text-[14px] text-[#75726B] leading-relaxed max-w-sm">{card.description}</p>

                  <div className="mt-7 mb-6 grid grid-cols-2 gap-px bg-[#E2E0D9] border border-[#E2E0D9] rounded-[4px] overflow-hidden">
                    {card.stats.map((s, i) => (
                      <div key={i} className="bg-[#F7F6F3] px-4 py-3.5">
                        <div className="text-[10px] uppercase tracking-[0.15em] font-mono text-[#75726B] mb-1.5">{s.label}</div>
                        <div className="text-xl font-semibold tracking-tight tabular-nums text-[#1A1A1A]">{s.value}</div>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-5 border-t border-[#E2E0D9] mt-auto">
                    <div className="inline-flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.15em] text-[#75726B]">
                      <span className="relative flex w-1.5 h-1.5">
                        <span className="absolute inset-0 rounded-full bg-[#9ED8F5] animate-ping opacity-60" />
                        <span className="relative w-1.5 h-1.5 rounded-full bg-[#9ED8F5]" />
                      </span>
                      <StatusIcon className="w-3 h-3" strokeWidth={1.5} />
                      {card.statusLabel}
                    </div>
                    <span className="text-[10px] font-mono uppercase tracking-[0.15em] text-[#1A1A1A]">
                      {card.rangeLabel}
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer trust line */}
        <div className="mt-10 flex items-center justify-between text-[10px] font-mono uppercase tracking-[0.15em] text-[#75726B]">
          <span>AdChefs<span className="text-[#9ED8F5]">.</span> Demo Portal</span>
          <span>v1.0 · {new Date().getFullYear()}</span>
        </div>
      </main>
    </div>
  );
}
