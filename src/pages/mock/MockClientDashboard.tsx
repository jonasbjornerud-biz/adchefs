import { useNavigate } from 'react-router-dom';
import { LogOut, BarChart3, TrendingUp, ChevronRight, Sparkles } from 'lucide-react';
import { HorizonGlow } from '@/components/dashboard/HorizonGlow';

const CARD_SHADOW = '0 0 0 1px rgba(255,255,255,0.06) inset, 0 4px 24px rgba(0,0,0,0.4)';
const BRAND = 'MOCK';

export default function MockClientDashboard() {
  const navigate = useNavigate();

  const cards = [
    {
      title: 'Editor Performance',
      description: 'Track deliveries, editor output, approval rates, and weekly trends across your team.',
      icon: BarChart3,
      route: '/mock/performance',
      accent: '#a855f7',
    },
    {
      title: 'KPI Dashboard',
      description: 'Monitor ad spend, ROAS, CTR, CPA, and revenue with real-time Meta Ads data.',
      icon: TrendingUp,
      route: '/mock/ads',
      accent: '#34d399',
    },
  ];

  return (
    <div className="min-h-screen bg-[#09090f] relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(124,58,237,0.18) 0%, transparent 100%)' }} />
      <div className="fixed inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 60% 40% at 30% 80%, rgba(52,211,153,0.04) 0%, transparent 100%)' }} />

      <header className="relative z-10 border-b border-white/[0.06]" style={{ background: 'rgba(9,9,15,0.85)', backdropFilter: 'blur(12px)' }}>
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center text-white text-xs font-bold" style={{ background: 'linear-gradient(135deg, #a855f7, #7c3aed)', boxShadow: '0 0 20px rgba(168,85,247,0.3)' }}>
              M
            </div>
            <span className="text-sm font-medium text-white">{BRAND}</span>
          </div>
          <button onClick={() => navigate('/')} className="flex items-center gap-1.5 text-[11px] text-white/40 hover:text-white transition-all duration-200 cursor-pointer">
            <LogOut className="w-3.5 h-3.5" /> Exit Demo
          </button>
        </div>
      </header>

      <main className="relative z-10 max-w-5xl mx-auto px-6 pt-20 pb-16">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-medium text-white/40 mb-6" style={{ background: 'rgba(168,85,247,0.08)', boxShadow: '0 0 0 1px rgba(168,85,247,0.15) inset' }}>
            <Sparkles className="w-3 h-3 text-[#a855f7]" /> Demo Portal
          </div>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
            <span className="text-white">Welcome back,</span><br />
            <span style={{ background: 'linear-gradient(135deg, #a855f7, #c084fc, #e9d5ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', filter: 'drop-shadow(0 0 20px rgba(168,85,247,0.5))' }}>{BRAND}</span>
          </h1>
          <p className="text-white/30 text-base mt-4 max-w-md mx-auto">Select a dashboard to view your performance data and insights.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <button
                key={card.title}
                onClick={() => navigate(card.route)}
                className="group text-left cursor-pointer bg-[#111118] rounded-2xl p-8 transition-all duration-300 relative overflow-hidden"
                style={{ boxShadow: CARD_SHADOW }}
                onMouseEnter={e => { const el = e.currentTarget; el.style.boxShadow = `0 0 0 1px ${card.accent}30 inset, 0 0 40px ${card.accent}15, 0 4px 24px rgba(0,0,0,0.4)`; el.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => { const el = e.currentTarget; el.style.boxShadow = CARD_SHADOW; el.style.transform = 'translateY(0)'; }}
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{ background: `radial-gradient(ellipse at 30% 20%, ${card.accent}08, transparent 70%)` }} />
                <div className="relative">
                  <div className="flex items-start justify-between mb-6">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300" style={{ background: `${card.accent}10`, boxShadow: `0 0 0 1px ${card.accent}20 inset` }}>
                      <Icon className="w-5 h-5" style={{ color: card.accent }} />
                    </div>
                    <ChevronRight className="w-5 h-5 text-white/15 group-hover:text-white/40 group-hover:translate-x-1 transition-all duration-300" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">{card.title}</h3>
                  <p className="text-sm text-white/30 leading-relaxed mb-8">{card.description}</p>
                  <span className="text-sm font-semibold transition-all duration-300 group-hover:translate-x-1" style={{ color: card.accent }}>Open Dashboard →</span>
                </div>
              </button>
            );
          })}
        </div>
      </main>
    </div>
  );
}
