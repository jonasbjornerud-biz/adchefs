import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Client } from '@/types/playbook';
import { logout } from '@/lib/auth';
import { LogOut, BarChart3, TrendingUp, Sparkles } from 'lucide-react';
import { GlassCard } from '@/components/dash/GlassCard';

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
      <div className="dash-bg flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 relative z-10">
          <div className="w-7 h-7 border-2 rounded-full animate-spin" style={{ borderColor: 'var(--dash-accent)', borderTopColor: 'transparent' }} />
          <span className="text-xs dash-font-body" style={{ color: 'var(--dash-text-tertiary)' }}>Loading…</span>
        </div>
      </div>
    );
  }

  if (!client) return null;

  const cards = [
    {
      title: 'KPI Dashboard',
      description: 'Real-time Meta Ads performance — spend, ROAS, CTR, CPA, and revenue trends.',
      icon: TrendingUp,
      route: '/ads',
      enabled: true,
      stats: [
        { label: 'Live Sync', value: 'Meta API' },
        { label: 'Updated', value: 'On demand' },
      ],
    },
    {
      title: 'Editor Performance',
      description: 'Track deliveries, editor output, approval rates, and weekly trends across the team.',
      icon: BarChart3,
      route: '/performance',
      enabled: !!client.spreadsheet_id,
      stats: [
        { label: 'Source', value: 'Google Sheets' },
        { label: 'Refresh', value: '12h cache' },
      ],
    },
  ];

  return (
    <div className="dash-bg">
      {/* Header */}
      <header
        className="relative z-10 border-b backdrop-blur-xl"
        style={{ background: 'rgba(10,10,15,0.85)', borderColor: 'var(--dash-border-subtle)' }}
      >
        <div className="max-w-[1280px] mx-auto px-6 md:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold"
              style={{ background: 'linear-gradient(135deg, #A855F7, #6D28D9)', boxShadow: '0 0 16px rgba(168,85,247,0.3)' }}
            >
              {client.brand_name.charAt(0).toUpperCase()}
            </div>
            <span className="text-sm font-semibold dash-font-body" style={{ color: 'var(--dash-text-primary)' }}>
              {client.brand_name}
            </span>
          </div>
          <button
            onClick={() => { logout(); navigate('/login'); }}
            className="flex items-center gap-1.5 text-[11px] transition-colors duration-200 cursor-pointer hover:text-white"
            style={{ color: 'var(--dash-text-tertiary)' }}
          >
            <LogOut className="w-3.5 h-3.5" /> Sign out
          </button>
        </div>
      </header>

      {/* Main */}
      <main className="relative z-10 max-w-[1280px] mx-auto px-6 md:px-8 pt-14 pb-16">
        {/* Welcome — left aligned */}
        <div className="mb-12 max-w-2xl">
          <span
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider mb-5"
            style={{
              background: 'var(--dash-accent-subtle)',
              color: 'var(--dash-accent-glow)',
              border: '1px solid rgba(168,85,247,0.2)',
            }}
          >
            <Sparkles className="w-3 h-3" /> Client Portal
          </span>
          <h1 className="dash-font-display" style={{ fontSize: 'clamp(40px, 5vw, 56px)', color: 'var(--dash-text-primary)' }}>
            Welcome back,{' '}
            <span className="dash-text-gradient" style={{ filter: 'drop-shadow(0 0 24px rgba(168,85,247,0.4))' }}>
              {client.brand_name}
            </span>
          </h1>
          <p className="text-sm mt-3 dash-font-body" style={{ color: 'var(--dash-text-secondary)' }}>
            Choose a dashboard to dive into your performance data.
          </p>
        </div>

        {/* Cards — split 50/50 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {cards.map((card, i) => {
            const Icon = card.icon;
            if (!card.enabled) {
              return (
                <GlassCard key={card.title} hover={false} delay={i * 80} className="p-6 opacity-50">
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center mb-5"
                    style={{ background: 'var(--dash-accent-subtle)' }}
                  >
                    <Icon className="w-5 h-5" style={{ color: 'var(--dash-accent-glow)' }} />
                  </div>
                  <h3 className="dash-font-display font-bold text-xl mb-1" style={{ color: 'var(--dash-text-secondary)' }}>
                    {card.title}
                  </h3>
                  <p className="text-xs dash-font-body" style={{ color: 'var(--dash-text-tertiary)' }}>
                    Not yet configured
                  </p>
                </GlassCard>
              );
            }
            return (
              <button
                key={card.title}
                onClick={() => navigate(card.route)}
                className="text-left group cursor-pointer"
                style={{ all: 'unset', cursor: 'pointer' }}
              >
                <GlassCard delay={i * 80} className="p-6 h-full flex flex-col">
                  <div className="flex items-start justify-between mb-5">
                    <div
                      className="w-12 h-12 rounded-lg flex items-center justify-center"
                      style={{ background: 'var(--dash-accent-subtle)' }}
                    >
                      <Icon className="w-5 h-5" style={{ color: 'var(--dash-accent-glow)' }} />
                    </div>
                  </div>
                  <h3 className="dash-font-display font-bold text-xl mb-2" style={{ color: 'var(--dash-text-primary)' }}>
                    {card.title}
                  </h3>
                  <p className="text-sm dash-font-body mb-6 flex-1" style={{ color: 'var(--dash-text-secondary)' }}>
                    {card.description}
                  </p>

                  {/* Stats row */}
                  <div className="grid grid-cols-2 gap-3 pt-4 border-t" style={{ borderColor: 'var(--dash-border-subtle)' }}>
                    {card.stats.map((s) => (
                      <div key={s.label}>
                        <p className="dash-font-label mb-1">{s.label}</p>
                        <p className="dash-font-mono text-sm" style={{ color: 'var(--dash-text-primary)' }}>{s.value}</p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-5 flex justify-end">
                    <span
                      className="text-xs font-semibold transition-transform duration-200 group-hover:translate-x-1"
                      style={{ color: 'var(--dash-accent-glow)' }}
                    >
                      Open Dashboard →
                    </span>
                  </div>
                </GlassCard>
              </button>
            );
          })}
        </div>
      </main>
    </div>
  );
}
