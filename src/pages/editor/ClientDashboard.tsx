import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Client } from '@/types/playbook';
import { logout } from '@/lib/auth';
import { LogOut, BarChart3, TrendingUp, ChevronRight, Sparkles } from 'lucide-react';

const CARD_SHADOW = '0 0 0 1px rgba(255,255,255,0.06) inset, 0 4px 24px rgba(0,0,0,0.4)';

export default function ClientDashboard() {
  const navigate = useNavigate();
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { navigate('/login'); return; }
      const { data: clientData } = await supabase.from('clients').select('*').eq('user_id', user.id).maybeSingle();
      if (!clientData) { setLoading(false); return; }
      setClient(clientData as Client);
      setLoading(false);
    })();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#09090f]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[#a855f7] border-t-transparent rounded-full animate-spin" />
          <span className="text-sm text-white/30">Loading…</span>
        </div>
      </div>
    );
  }

  if (!client) return null;

  const cards = [
    {
      title: 'Editor Performance',
      description: 'Track deliveries, editor output, approval rates, and weekly trends across your team.',
      icon: BarChart3,
      route: '/performance',
      accent: '#a855f7',
      enabled: !!client.spreadsheet_id,
    },
    {
      title: 'KPI Dashboard',
      description: 'Monitor ad spend, ROAS, CTR, CPA, and revenue with real-time Meta Ads data.',
      icon: TrendingUp,
      route: '/ads',
      accent: '#34d399',
      enabled: true,
    },
  ];

  return (
    <div className="min-h-screen bg-[#09090f] relative overflow-hidden">
      {/* Purple glow — top center */}
      <div className="fixed inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(124,58,237,0.18) 0%, transparent 100%)',
      }} />
      {/* Secondary subtle glow */}
      <div className="fixed inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse 60% 40% at 30% 80%, rgba(52,211,153,0.04) 0%, transparent 100%)',
      }} />

      {/* Header */}
      <header className="relative z-10 border-b border-white/[0.06]" style={{ background: 'rgba(9,9,15,0.85)', backdropFilter: 'blur(12px)' }}>
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center text-white text-xs font-bold"
              style={{ background: 'linear-gradient(135deg, #a855f7, #7c3aed)', boxShadow: '0 0 20px rgba(168,85,247,0.3)' }}
            >
              {client.brand_name.charAt(0)}
            </div>
            <span className="text-sm font-medium text-white">{client.brand_name}</span>
          </div>
          <button
            onClick={() => { logout(); navigate('/login'); }}
            className="flex items-center gap-1.5 text-[11px] text-white/40 hover:text-white transition-all duration-200 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" /> Sign out
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className="relative z-10 max-w-5xl mx-auto px-6 pt-20 pb-16">
        {/* Welcome */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-medium text-white/40 mb-6" style={{
            background: 'rgba(168,85,247,0.08)',
            boxShadow: '0 0 0 1px rgba(168,85,247,0.15) inset',
          }}>
            <Sparkles className="w-3 h-3 text-[#a855f7]" /> Client Portal
          </div>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
            <span className="text-white">Welcome back,</span>
            <br />
            <span style={{
              background: 'linear-gradient(135deg, #a855f7, #c084fc, #e9d5ff)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              filter: 'drop-shadow(0 0 20px rgba(168,85,247,0.5))',
            }}>{client.brand_name}</span>
          </h1>
          <p className="text-white/30 text-base mt-4 max-w-md mx-auto">
            Select a dashboard to view your performance data and insights.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {cards.map((card) => {
            const Icon = card.icon;
            if (!card.enabled) {
              return (
                <div
                  key={card.title}
                  className="bg-[#111118] rounded-2xl p-8 opacity-40"
                  style={{ boxShadow: CARD_SHADOW }}
                >
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-6" style={{
                    background: `${card.accent}10`,
                    boxShadow: `0 0 0 1px ${card.accent}20 inset`,
                  }}>
                    <Icon className="w-5 h-5" style={{ color: card.accent }} />
                  </div>
                  <h3 className="text-lg font-semibold text-white/50 mb-2">{card.title}</h3>
                  <p className="text-xs text-white/20 leading-relaxed">Not yet configured</p>
                </div>
              );
            }
            return (
              <button
                key={card.title}
                onClick={() => navigate(card.route)}
                className="group text-left cursor-pointer bg-[#111118] rounded-2xl p-8 transition-all duration-300 relative overflow-hidden"
                style={{ boxShadow: CARD_SHADOW }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.boxShadow = `0 0 0 1px ${card.accent}30 inset, 0 0 40px ${card.accent}15, 0 4px 24px rgba(0,0,0,0.4)`;
                  el.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.boxShadow = CARD_SHADOW;
                  el.style.transform = 'translateY(0)';
                }}
              >
                {/* Hover glow overlay */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{
                  background: `radial-gradient(ellipse at 30% 20%, ${card.accent}08, transparent 70%)`,
                }} />

                <div className="relative">
                  <div className="flex items-start justify-between mb-6">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300" style={{
                      background: `${card.accent}10`,
                      boxShadow: `0 0 0 1px ${card.accent}20 inset`,
                    }}>
                      <Icon className="w-5 h-5" style={{ color: card.accent }} />
                    </div>
                    <ChevronRight className="w-5 h-5 text-white/15 group-hover:text-white/40 group-hover:translate-x-1 transition-all duration-300" />
                  </div>

                  <h3 className="text-xl font-semibold text-white mb-2">{card.title}</h3>
                  <p className="text-sm text-white/30 leading-relaxed mb-8">{card.description}</p>

                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold transition-all duration-300 group-hover:translate-x-1" style={{ color: card.accent }}>
                      Open Dashboard →
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </main>
    </div>
  );
}
