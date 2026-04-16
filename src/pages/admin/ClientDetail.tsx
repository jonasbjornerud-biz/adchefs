import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Client } from '@/types/playbook';
import { ArrowLeft, BarChart3, TrendingUp, ChevronRight, RotateCcw, Trash2, Lock, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { generatePassword } from '@/lib/auth';

const CARD_SHADOW = '0 0 0 1px rgba(255,255,255,0.06) inset, 0 4px 24px rgba(0,0,0,0.4)';

export default function ClientDetail() {
  const { clientId } = useParams<{ clientId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadClient(); }, [clientId]);

  async function loadClient() {
    if (!clientId) return;
    setLoading(true);
    const { data } = await supabase.from('clients').select('*').eq('id', clientId).single();
    setClient(data as Client | null);
    setLoading(false);
  }

  async function handleDelete() {
    if (!confirm('Delete this client and all their data? This cannot be undone.')) return;
    const { data, error } = await supabase.functions.invoke('manage-clients', {
      body: { action: 'delete_client', client_id: clientId },
    });
    if (error || data?.error) {
      toast({ title: 'Error', description: data?.error || error?.message, variant: 'destructive' });
      return;
    }
    toast({ title: 'Client deleted' });
    navigate('/admin');
  }

  async function resetPassword() {
    const newPassword = generatePassword();
    const { data, error } = await supabase.functions.invoke('manage-clients', {
      body: { action: 'reset_password', client_id: clientId, new_password: newPassword },
    });
    if (error || data?.error) {
      toast({ title: 'Error', description: data?.error || error?.message, variant: 'destructive' });
      return;
    }
    navigator.clipboard.writeText(`New password: ${newPassword}`);
    toast({ title: 'Password reset', description: `New password copied to clipboard: ${newPassword}` });
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#09090f]">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-[#a855f7] border-t-transparent rounded-full animate-spin" />
        <span className="text-sm text-white/30">Loading…</span>
      </div>
    </div>
  );

  if (!client) return (
    <div className="min-h-screen flex items-center justify-center bg-[#09090f] text-white/30">
      Client not found
    </div>
  );

  const cards = [
    {
      title: 'Editor Performance',
      description: 'Track deliveries, editor output, approval rates, and weekly trends across the team.',
      icon: BarChart3,
      route: `/admin/clients/${clientId}/performance`,
      accent: '#a855f7',
      enabled: !!client.spreadsheet_id,
    },
    {
      title: 'KPI Dashboard',
      description: 'Monitor ad spend, ROAS, CTR, CPA, and revenue with real-time Meta Ads data.',
      icon: TrendingUp,
      route: `/admin/clients/${clientId}/ads`,
      accent: '#34d399',
      enabled: true,
    },
  ];

  return (
    <div className="min-h-screen bg-[#09090f] relative overflow-hidden">
      {/* Glows */}
      <div className="fixed inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(124,58,237,0.18) 0%, transparent 100%)',
      }} />
      <div className="fixed inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse 60% 40% at 30% 80%, rgba(52,211,153,0.04) 0%, transparent 100%)',
      }} />

      {/* Header */}
      <header className="relative z-10 border-b border-white/[0.06]" style={{ background: 'rgba(9,9,15,0.85)', backdropFilter: 'blur(12px)' }}>
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/admin')} className="flex items-center gap-1.5 text-xs text-white/40 hover:text-white transition-colors">
              <ArrowLeft className="w-3.5 h-3.5" /> Clients
            </button>
            <div className="h-4 w-px bg-white/10" />
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-[11px] font-bold"
              style={{ background: 'linear-gradient(135deg, #a855f7, #7c3aed)', boxShadow: '0 0 20px rgba(168,85,247,0.3)' }}
            >
              {client.brand_name.charAt(0)}
            </div>
            <span className="text-sm font-medium text-white">{client.brand_name}</span>
            <span className="text-[10px] text-white/30 uppercase tracking-wider">Admin View</span>
          </div>
          <div className="flex gap-2">
            <button onClick={resetPassword}
              className="flex items-center gap-1 h-7 px-2.5 rounded-lg text-[11px] text-white/40 hover:text-white/70 transition-colors"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <RotateCcw className="w-3 h-3" /> Reset PW
            </button>
            <button onClick={handleDelete}
              className="flex items-center gap-1 h-7 px-2.5 rounded-lg text-[11px] text-red-400/60 hover:text-red-400 transition-colors"
              style={{ background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.1)' }}>
              <Trash2 className="w-3 h-3" /> Delete
            </button>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-5xl mx-auto px-6 pt-20 pb-16">
        {/* Welcome */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-medium text-white/40 mb-6" style={{
            background: 'rgba(168,85,247,0.08)',
            boxShadow: '0 0 0 1px rgba(168,85,247,0.15) inset',
          }}>
            <Sparkles className="w-3 h-3 text-[#a855f7]" /> Viewing as Admin
          </div>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
            <span className="text-white">Client portal for</span>
            <br />
            <span style={{
              background: 'linear-gradient(135deg, #a855f7, #c084fc, #e9d5ff)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              filter: 'drop-shadow(0 0 20px rgba(168,85,247,0.5))',
            }}>{client.brand_name}</span>
          </h1>
          <p className="text-white/30 text-base mt-4 max-w-md mx-auto">
            Exact same view the client sees. Open a dashboard to inspect their data.
          </p>
        </div>

        {/* Cards — mirror ClientDashboard */}
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
                  <p className="text-xs text-white/20 leading-relaxed flex items-center gap-1.5">
                    <Lock className="w-3 h-3" /> Connect a Google Sheet to enable
                  </p>
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
