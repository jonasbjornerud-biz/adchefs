import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Papa from 'papaparse';
import { supabase } from '@/integrations/supabase/client';
import { Client } from '@/types/playbook';
import { logout } from '@/lib/auth';
import { LogOut, BarChart3, TrendingUp, ArrowRight, FileSpreadsheet, Zap } from 'lucide-react';
import { getWeekToDateRange, formatCurrency, formatNumber } from '@/lib/weekToDate';


const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

interface WtdState {
  loading: boolean;
  perfStats: { label: string; value: string }[];
  adsStats: { label: string; value: string }[];
}

interface ClientDashboardProps {
  clientOverride?: Client;
  hideChrome?: boolean;
}

export default function ClientDashboard({ clientOverride, hideChrome = false }: ClientDashboardProps = {}) {
  const navigate = useNavigate();
  const [client, setClient] = useState<Client | null>(clientOverride ?? null);
  const [loading, setLoading] = useState(!clientOverride);
  const [logoSrc, setLogoSrc] = useState<string | null>(null);
  const wtd = getWeekToDateRange();
  const [wtdData, setWtdData] = useState<WtdState>({
    loading: true,
    perfStats: [
      { label: 'Videos delivered', value: '—' },
      { label: 'Active editors', value: '—' },
    ],
    adsStats: [
      { label: 'Ad spend', value: '—' },
      { label: 'ROAS', value: '—' },
    ],
  });

  useEffect(() => {
    if (clientOverride) {
      setClient(clientOverride);
      setLoading(false);
      loadWtd(clientOverride);
      return;
    }
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { navigate('/login'); return; }
      const { data: clientData } = await supabase.from('clients').select('*').eq('user_id', user.id).maybeSingle();
      if (!clientData) { setLoading(false); return; }
      setClient(clientData as Client);
      setLoading(false);
      loadWtd(clientData as Client);
    })();
  }, [clientOverride?.id]);

  useEffect(() => {
    if (!client?.logo_url) { setLogoSrc(null); return; }
    if (/^https?:\/\//.test(client.logo_url)) { setLogoSrc(client.logo_url); return; }
    (async () => {
      const { data } = await supabase.storage.from('module-assets').createSignedUrl(client.logo_url!, 60 * 60 * 24 * 7);
      if (data?.signedUrl) setLogoSrc(data.signedUrl);
    })();
  }, [client?.logo_url]);

  async function loadWtd(c: Client) {
    const currentMonth = MONTHS[new Date().getMonth()];
    const sinceStr = wtd.start.toISOString().split('T')[0];
    const untilStr = wtd.end.toISOString().split('T')[0];

    const perfPromise = (async () => {
      if (!c.spreadsheet_id) {
        return [
          { label: 'Videos delivered', value: '—' },
          { label: 'Active editors', value: '—' },
        ];
      }
      try {
        const res = await fetch(`https://docs.google.com/spreadsheets/d/${c.spreadsheet_id}/gviz/tq?tqx=out:csv&sheet=EOD-Report`);
        const text = await res.text();
        const rows = Papa.parse<Record<string, string>>(text, { header: true, skipEmptyLines: true }).data;
        const monthRows = rows.filter((r) => r.Month?.toLowerCase() === currentMonth.toLowerCase());
        const delivered = monthRows.reduce((s, r) => s + (parseInt(r['Videos Delivered']) || 0), 0);
        const editors = new Set(monthRows.map((r) => r.Name).filter(Boolean)).size;
        return [
          { label: `Videos this ${currentMonth.slice(0, 3)}.`, value: formatNumber(delivered) },
          { label: 'Active editors', value: String(editors) },
        ];
      } catch {
        return [
          { label: 'Videos delivered', value: '—' },
          { label: 'Active editors', value: '—' },
        ];
      }
    })();

    const adsPromise = (async () => {
      try {
        const { data, error } = await supabase.functions.invoke('meta-ads', {
          body: { since: sinceStr, until: untilStr },
        });
        if (error || data?.error) throw new Error('ads');
        const ads = (data?.ads || []) as Array<{ spend?: number; revenue?: number }>;
        const spend = ads.reduce((s, a) => s + (a.spend || 0), 0);
        const revenue = ads.reduce((s, a) => s + (a.revenue || 0), 0);
        const roas = spend > 0 ? revenue / spend : 0;
        return [
          { label: 'Ad spend', value: formatCurrency(spend) },
          { label: 'ROAS', value: roas > 0 ? `${roas.toFixed(2)}x` : '—' },
        ];
      } catch {
        return [
          { label: 'Ad spend', value: '—' },
          { label: 'ROAS', value: '—' },
        ];
      }
    })();

    const [perfStats, adsStats] = await Promise.all([perfPromise, adsPromise]);
    setWtdData({ loading: false, perfStats, adsStats });
  }

  if (loading) {
    return (
      <div className={`${hideChrome ? 'min-h-[400px]' : 'min-h-screen'} flex items-center justify-center bg-[#F7F6F3]`}>
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[#1A1A1A] border-t-transparent rounded-full animate-spin" />
          <span className="text-xs uppercase tracking-[0.18em] font-mono text-[#75726B]">Loading</span>
        </div>
      </div>
    );
  }

  if (!client) return null;

  const cards = [
    {
      title: 'Editor Performance',
      emphasis: 'Performance',
      titlePrefix: 'Editor',
      description: 'Track deliveries, editor output, approval rates, and weekly trends across your team.',
      icon: BarChart3,
      route: '/performance',
      enabled: !!client.spreadsheet_id,
      statusLabel: 'Sheet API connected',
      statusIcon: FileSpreadsheet,
      cta: 'Open Performance',
      stats: wtdData.perfStats,
      rangeLabel: MONTHS[new Date().getMonth()].slice(0, 3) + ' MTD',
    },
    {
      title: 'KPI Dashboard',
      emphasis: 'Dashboard',
      titlePrefix: 'KPI',
      description: 'Monitor ad spend, ROAS, CTR, CPA, and revenue with real-time Meta Ads data.',
      icon: TrendingUp,
      route: '/ads',
      enabled: true,
      statusLabel: 'Meta API connected',
      statusIcon: Zap,
      cta: 'Open Dashboard',
      stats: wtdData.adsStats,
      rangeLabel: wtd.label,
    },
  ];

  return (
    <div className={`${hideChrome ? '' : 'min-h-screen admin-bloom'} text-[#1A1A1A] relative overflow-hidden`}>
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
      {!hideChrome && (
      <header className="sticky top-0 z-40 glass-topbar">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-[4px] flex items-center justify-center text-[#1A1A1A] text-xs font-semibold border border-[#1A1A1A]/15 bg-[#9ED8F5] overflow-hidden">
              {logoSrc ? (
                <img src={logoSrc} alt={client.brand_name} className="w-full h-full object-cover" />
              ) : (
                client.brand_name.charAt(0)
              )}
            </div>
            <span className="text-sm font-medium tracking-tight">
              {client.brand_name}
              <span className="text-[#9ED8F5]">.</span>
            </span>
          </div>
          <button
            onClick={() => { logout(); navigate('/login'); }}
            className="flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-[0.15em] text-[#75726B] hover:text-[#1A1A1A] transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" /> Sign out
          </button>
        </div>
      </header>
      )}

      {/* Hero band — dark, matches job detail */}
      <section className="relative z-10 bg-foreground text-background overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.07] pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(hsl(var(--accent)) 1px, transparent 1.5px)',
            backgroundSize: '24px 24px',
          }}
        />
        <div
          className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle, hsl(var(--accent) / 0.25) 0%, transparent 65%)',
            filter: 'blur(40px)',
          }}
        />
        <div className="relative max-w-6xl mx-auto px-6 pt-20 pb-20">
          {logoSrc && (
            <img src={logoSrc} alt={client.brand_name} className="w-16 h-16 rounded-[8px] object-cover mb-6 border border-background/20" />
          )}
          <h1 className="font-display text-[48px] sm:text-[64px] md:text-[76px] leading-[1.0] tracking-[-0.03em] max-w-4xl">
            Welcome back,{' '}
            <em style={{ fontFamily: "'Instrument Serif', serif", fontStyle: 'italic', fontWeight: 400, color: 'hsl(var(--accent))' }}>
              {client.brand_name}
            </em>
            .
          </h1>
          <p className="mt-6 text-[15px] text-background/65 max-w-xl leading-relaxed">
            Here's where things stand today.
          </p>
        </div>
      </section>

      {/* Cards */}
      <main className="relative z-10 max-w-6xl mx-auto px-6 pt-16 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {cards.map((card, idx) => {
            const Icon = card.icon;
            const StatusIcon = card.statusIcon;
            const enabled = card.enabled;
            return (
              <button
                key={card.title}
                onClick={() => {
                  if (!enabled) return;
                  // When admin is previewing a client, pass the clientId so the
                  // sub-page loads that client's data instead of the admin's own.
                  const target = clientOverride
                    ? `${card.route}?clientId=${clientOverride.id}`
                    : card.route;
                  navigate(target);
                }}
                disabled={!enabled}
                className={`group text-left relative overflow-hidden rounded-[12px] p-8 transition-all duration-500 border ${
                  enabled
                    ? 'cursor-pointer border-[#E5E3DC] hover:border-[#1A1A1A]/30 hover:-translate-y-[3px]'
                    : 'cursor-not-allowed opacity-55 border-[#E2E0D9]'
                }`}
                style={{
                  background: 'linear-gradient(180deg, #FFFFFF 0%, #FBFAF6 100%)',
                  boxShadow: enabled
                    ? '0 1px 0 rgba(255,255,255,0.9) inset, 0 18px 40px -28px rgba(26,26,26,0.25)'
                    : '0 1px 0 rgba(255,255,255,0.7) inset',
                }}
              >
                {/* Top accent rail */}
                <span
                  className="absolute top-0 left-0 h-[2px] transition-all duration-500 group-hover:w-full"
                  style={{
                    width: enabled ? '80px' : '24px',
                    background: 'linear-gradient(90deg, #9ED8F5 0%, #3B86A8 50%, transparent 100%)',
                    boxShadow: enabled ? '0 0 10px rgba(158,216,245,0.5)' : 'none',
                  }}
                />
                {/* Soft corner glow */}
                {enabled && (
                  <span
                    aria-hidden
                    className="pointer-events-none absolute -right-24 -top-24 w-72 h-72 rounded-full opacity-60 transition-opacity duration-500 group-hover:opacity-100"
                    style={{ background: 'radial-gradient(circle, rgba(158,216,245,0.18) 0%, transparent 65%)' }}
                  />
                )}

                <div className="relative flex flex-col h-full min-h-[280px]">
                  {/* Header row */}
                  <div className="flex items-start justify-between mb-8">
                    <div className="flex items-center gap-3">
                      <span className="inline-flex items-center justify-center w-9 h-9 rounded-[8px] bg-white border border-[#E5E3DC] text-[#3B86A8] shadow-[0_1px_0_rgba(255,255,255,0.8)_inset]">
                        <Icon className="w-4 h-4" strokeWidth={1.5} />
                      </span>
                      <span className="mono text-[10px] uppercase tracking-[0.22em] text-[#8A8780]">
                        0{idx + 1} / 02
                      </span>
                    </div>
                    <span className="w-9 h-9 rounded-full flex items-center justify-center border border-transparent group-hover:border-[#1A1A1A]/15 transition-all duration-300">
                      <ArrowRight className="w-4 h-4 text-[#1A1A1A] transition-transform duration-300 group-hover:translate-x-0.5" strokeWidth={1.75} />
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-[30px] leading-[1.02] tracking-[-0.025em] font-semibold mb-3" style={{ fontFamily: "'Inter Tight', sans-serif", fontWeight: 700 }}>
                    {card.titlePrefix} <em>{card.emphasis}</em>
                  </h3>
                  <p className="text-[14px] text-[#75726B] leading-relaxed max-w-sm">
                    {enabled ? card.description : 'Not yet configured. Contact your account manager to enable this dashboard.'}
                  </p>

                  {/* Stats strip */}
                  {enabled && (
                    <div className="mt-7 mb-6 grid grid-cols-2 gap-px rounded-[10px] overflow-hidden border border-[#E5E3DC]" style={{ background: '#E5E3DC' }}>
                      {card.stats.map((s, i) => (
                        <div key={i} className="px-4 py-4" style={{ background: 'linear-gradient(180deg, #FFFFFF 0%, #FBFAF6 100%)' }}>
                          <div className="text-[9px] uppercase tracking-[0.22em] font-mono text-[#8A8780] mb-1.5">
                            {s.label}
                          </div>
                          <div className="text-[22px] tracking-[-0.025em] tabular-nums text-[#0F0F0F]" style={{ fontFamily: "'Inter Tight', sans-serif", fontWeight: 600 }}>
                            {wtdData.loading ? (
                              <span className="inline-block w-14 h-6 rounded-sm bg-[#EFEEE8] animate-pulse" />
                            ) : (
                              s.value
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Footer: status + range */}
                  <div className="flex items-center justify-between pt-5 border-t border-[#E2E0D9] mt-auto">
                    <div className="inline-flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.15em] text-[#75726B]">
                      {enabled ? (
                        <>
                          <span className="relative flex w-1.5 h-1.5">
                            <span className="absolute inset-0 rounded-full bg-[#9ED8F5] animate-ping opacity-60" />
                            <span className="relative w-1.5 h-1.5 rounded-full bg-[#9ED8F5]" />
                          </span>
                          <StatusIcon className="w-3 h-3" strokeWidth={1.5} />
                          {card.statusLabel}
                        </>
                      ) : (
                        <>
                          <span className="w-1.5 h-1.5 rounded-full bg-[#75726B]/40" />
                          Not configured
                        </>
                      )}
                    </div>
                    {enabled && (
                      <span className="text-[10px] font-mono uppercase tracking-[0.15em] text-[#1A1A1A]">
                        {card.rangeLabel}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>


        {/* Footer trust line */}
        <div className="mt-10 flex items-center justify-between text-[10px] font-mono uppercase tracking-[0.15em] text-[#75726B]">
          <span>AdChefs<span className="text-[#9ED8F5]">.</span> Client Portal</span>
          <span>v1.0 · {new Date().getFullYear()}</span>
        </div>
      </main>
    </div>
  );
}
