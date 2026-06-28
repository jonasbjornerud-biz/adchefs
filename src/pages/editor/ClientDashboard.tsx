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
    <div className={`${hideChrome ? '' : 'min-h-screen bg-[#FAFAF7]'} text-[#1A1A1A] relative`}>
      {/* Header */}
      {!hideChrome && (
      <header className="sticky top-0 z-40 bg-white/85 backdrop-blur-sm border-b border-[#E5E3DC]">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-[6px] flex items-center justify-center text-[#1A1A1A] text-xs font-semibold border border-[#E5E3DC] bg-white overflow-hidden">
              {logoSrc ? (
                <img src={logoSrc} alt={client.brand_name} className="w-full h-full object-cover" />
              ) : (
                client.brand_name.charAt(0)
              )}
            </div>
            <span className="text-sm font-medium tracking-tight">{client.brand_name}</span>
          </div>
          <button
            onClick={() => { logout(); navigate('/login'); }}
            className="flex items-center gap-1.5 text-xs text-[#75726B] hover:text-[#1A1A1A] transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" /> Sign out
          </button>
        </div>
      </header>
      )}

      {/* Title */}
      <section className="max-w-6xl mx-auto px-6 pt-12 pb-8">
        <h1 className="text-[32px] font-semibold tracking-tight text-[#0F0F0F]" style={{ fontFamily: "'Inter Tight', sans-serif" }}>
          Welcome back, {client.brand_name}
        </h1>
        <p className="mt-2 text-sm text-[#75726B]">Here's where things stand today.</p>
      </section>

      {/* Cards */}
      <main className="max-w-6xl mx-auto px-6 pb-24">
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
                className={`group text-left relative overflow-hidden bg-white border border-[#E5E3DC] rounded-[10px] p-7 transition-colors ${
                  enabled ? 'hover:border-[#1A1A1A]/25 cursor-pointer' : 'cursor-not-allowed opacity-55'
                }`}
              >
                <div className="relative flex flex-col h-full min-h-[260px]">
                  {/* Header row */}
                  <div className="flex items-start justify-between mb-6">
                    <span className="inline-flex items-center justify-center w-9 h-9 rounded-[8px] bg-[#F2F1EC] text-[#2E6BE6]">
                      <Icon className="w-4 h-4" strokeWidth={1.75} />
                    </span>
                    <span className="text-[#75726B] transition-transform duration-200 group-hover:translate-x-0.5">
                      <ArrowRight className="w-4 h-4" strokeWidth={1.75} />
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-[22px] leading-tight tracking-tight font-semibold mb-2 text-[#0F0F0F]" style={{ fontFamily: "'Inter Tight', sans-serif" }}>
                    {card.title}
                  </h3>
                  <p className="text-[13.5px] text-[#75726B] leading-relaxed max-w-sm">
                    {enabled ? card.description : 'Not yet configured. Contact your account manager to enable this dashboard.'}
                  </p>

                  {/* Stats strip */}
                  {enabled && (
                    <div className="mt-6 mb-5 grid grid-cols-2 gap-6 pt-5 border-t border-[#F0EEE7]">
                      {card.stats.map((s, i) => (
                        <div key={i}>
                          <div className="text-[11px] uppercase tracking-[0.08em] text-[#8A8780] mb-1.5">{s.label}</div>
                          <div className="text-[20px] tracking-tight tabular-nums text-[#0F0F0F] font-semibold" style={{ fontFamily: "'Inter Tight', sans-serif" }}>
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
                  <div className="flex items-center justify-between pt-4 border-t border-[#F0EEE7] mt-auto">
                    <div className="inline-flex items-center gap-2 text-[11px] text-[#75726B]">
                      {enabled ? (
                        <>
                          <span className="w-1.5 h-1.5 rounded-full bg-[#2E6BE6]" />
                          {card.statusLabel}
                        </>
                      ) : (
                        <>
                          <span className="w-1.5 h-1.5 rounded-full bg-[#C4C2BC]" />
                          Not configured
                        </>
                      )}
                    </div>
                    {enabled && (
                      <span className="text-[11px] text-[#1A1A1A] font-medium">
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
        <div className="mt-10 flex items-center justify-between text-[11px] text-[#75726B]">
          <span>AdChefs Client Portal</span>
          <span>v1.0 · {new Date().getFullYear()}</span>
        </div>
      </main>
    </div>
  );
}
