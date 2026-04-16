import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Client } from '@/types/playbook';
import { logout } from '@/lib/auth';
import { LogOut, BarChart3, TrendingUp, ArrowUpRight, CheckCircle2, FileSpreadsheet, Zap } from 'lucide-react';
import { HorizonGlow } from '@/components/dashboard/HorizonGlow';

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
      <div className="min-h-screen flex items-center justify-center bg-[#06060c]">
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
      statusLabel: 'Sheet API connected',
      statusIcon: FileSpreadsheet,
      cta: 'Open Performance',
    },
    {
      title: 'KPI Dashboard',
      description: 'Monitor ad spend, ROAS, CTR, CPA, and revenue with real-time Meta Ads data.',
      icon: TrendingUp,
      route: '/ads',
      accent: '#34d399',
      enabled: true,
      statusLabel: 'Meta API connected',
      statusIcon: Zap,
      cta: 'Open Dashboard',
    },
  ];

  return (
    <div className="min-h-screen bg-[#06060c] relative overflow-hidden">
      {/* Top ambient glow */}
      <div className="fixed inset-x-0 top-0 h-[500px] pointer-events-none" style={{
        background: 'radial-gradient(ellipse 80% 100% at 50% 0%, rgba(124,58,237,0.18) 0%, transparent 70%)',
      }} />
      {/* Bottom horizon glow */}
      <div className="fixed inset-x-0 bottom-0 h-[400px] pointer-events-none" style={{
        background: 'radial-gradient(ellipse 60% 100% at 50% 100%, rgba(168,85,247,0.22) 0%, rgba(124,58,237,0.08) 35%, transparent 70%)',
      }} />
      {/* Grid texture */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.025]" style={{
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
        backgroundSize: '48px 48px',
      }} />

      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-white/[0.06]" style={{ background: 'rgba(6,6,12,0.6)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}>
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

      {/* Hero band with horizon arc */}
      <div className="relative">
        <HorizonGlow height={300} />
        <div className="max-w-5xl mx-auto px-6 pt-12 pb-6 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full mb-5 text-[11px] font-medium text-white/80" style={{
            background: 'rgba(168,85,247,0.12)',
            border: '1px solid rgba(168,85,247,0.30)',
            boxShadow: '0 0 24px -6px rgba(168,85,247,0.5)',
          }}>
            <span className="w-1.5 h-1.5 rounded-full bg-[#a855f7]" style={{ boxShadow: '0 0 8px rgba(168,85,247,0.8)' }} />
            Client Portal
          </div>
          <h1 className="text-5xl md:text-6xl font-black tracking-tight">
            <span className="text-white">Welcome back, </span>
            <span style={{
              background: 'linear-gradient(135deg, #a855f7, #c084fc, #e9d5ff)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              filter: 'drop-shadow(0 0 20px rgba(168,85,247,0.5))',
            }}>{client.brand_name}</span>
          </h1>
          <p className="text-sm text-white/50 mt-3">Select a dashboard to view your performance data and insights.</p>
        </div>
      </div>

      {/* Main content */}
      <main className="relative z-10 max-w-5xl mx-auto px-6 pb-16 pt-4">

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {cards.map((card) => {
            const Icon = card.icon;
            const StatusIcon = card.statusIcon;
            const enabled = card.enabled;
            const accent = card.accent;
            return (
              <button
                key={card.title}
                onClick={() => enabled && navigate(card.route)}
                disabled={!enabled}
                className={`group text-left relative overflow-hidden rounded-3xl p-7 transition-all duration-500 ${enabled ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'}`}
                style={{
                  background:
                    'linear-gradient(180deg, rgba(28,24,42,0.85) 0%, rgba(14,12,22,0.92) 100%)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  boxShadow:
                    '0 1px 0 rgba(255,255,255,0.08) inset, 0 0 0 1px rgba(255,255,255,0.02) inset, 0 20px 60px -20px rgba(0,0,0,0.6)',
                }}
                onMouseEnter={(e) => {
                  if (!enabled) return;
                  const el = e.currentTarget as HTMLElement;
                  el.style.transform = 'translateY(-3px)';
                  el.style.boxShadow = `0 1px 0 rgba(255,255,255,0.12) inset, 0 0 0 1px ${accent}40 inset, 0 30px 80px -20px ${accent}30, 0 0 60px -10px ${accent}25`;
                  el.style.borderColor = `${accent}55`;
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.transform = 'translateY(0)';
                  el.style.boxShadow =
                    '0 1px 0 rgba(255,255,255,0.08) inset, 0 0 0 1px rgba(255,255,255,0.02) inset, 0 20px 60px -20px rgba(0,0,0,0.6)';
                  el.style.borderColor = 'rgba(255,255,255,0.06)';
                }}
              >
                {/* Top inner highlight line */}
                <div
                  className="absolute inset-x-6 top-0 h-px pointer-events-none"
                  style={{
                    background: `linear-gradient(90deg, transparent, ${accent}80, transparent)`,
                    opacity: 0.5,
                  }}
                />

                {/* Soft top-left bloom on hover */}
                <div
                  className="absolute -top-20 -left-20 w-64 h-64 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                  style={{
                    background: `radial-gradient(circle, ${accent}25 0%, transparent 60%)`,
                    filter: 'blur(30px)',
                  }}
                />

                {/* Bottom horizon glow accent */}
                <div
                  className="absolute inset-x-0 -bottom-32 h-48 opacity-30 group-hover:opacity-60 transition-opacity duration-700 pointer-events-none"
                  style={{
                    background: `radial-gradient(ellipse 60% 100% at 50% 100%, ${accent}50 0%, transparent 70%)`,
                    filter: 'blur(20px)',
                  }}
                />

                <div className="relative flex flex-col h-full min-h-[260px]">
                  {/* Header row: icon + arrow */}
                  <div className="flex items-start justify-between mb-6">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-105"
                      style={{
                        background: `linear-gradient(135deg, ${accent}25, ${accent}08)`,
                        boxShadow: `0 0 0 1px ${accent}30 inset, 0 8px 20px -8px ${accent}40`,
                      }}
                    >
                      <Icon className="w-5 h-5" style={{ color: accent }} />
                    </div>
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                      style={{
                        background: 'rgba(255,255,255,0.04)',
                        border: '1px solid rgba(255,255,255,0.06)',
                      }}
                    >
                      <ArrowUpRight className="w-4 h-4 text-white/40 group-hover:text-white transition-colors duration-300" />
                    </div>
                  </div>

                  {/* Title + description */}
                  <h3 className="text-[22px] font-semibold text-white tracking-tight mb-2">
                    {card.title}
                  </h3>
                  <p className="text-sm text-white/45 leading-relaxed mb-6 flex-1">
                    {enabled ? card.description : 'Not yet configured. Contact your account manager to enable this dashboard.'}
                  </p>

                  {/* Footer: status pill */}
                  <div className="flex items-center justify-between pt-5 border-t border-white/[0.05]">
                    <div
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10.5px] font-medium tracking-wide"
                      style={{
                        background: enabled ? `${accent}12` : 'rgba(255,255,255,0.04)',
                        border: `1px solid ${enabled ? `${accent}30` : 'rgba(255,255,255,0.06)'}`,
                        color: enabled ? accent : 'rgba(255,255,255,0.3)',
                      }}
                    >
                      {enabled ? (
                        <>
                          <span className="relative flex w-1.5 h-1.5">
                            <span
                              className="absolute inset-0 rounded-full animate-ping"
                              style={{ background: accent, opacity: 0.6 }}
                            />
                            <span
                              className="relative w-1.5 h-1.5 rounded-full"
                              style={{ background: accent, boxShadow: `0 0 8px ${accent}` }}
                            />
                          </span>
                          <StatusIcon className="w-3 h-3" />
                          {card.statusLabel}
                        </>
                      ) : (
                        <>
                          <span className="w-1.5 h-1.5 rounded-full bg-white/30" />
                          Not configured
                        </>
                      )}
                    </div>
                    {enabled && (
                      <span
                        className="text-[11px] font-semibold uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-1 group-hover:translate-x-0"
                        style={{ color: accent }}
                      >
                        {card.cta} →
                      </span>
                    )}
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
