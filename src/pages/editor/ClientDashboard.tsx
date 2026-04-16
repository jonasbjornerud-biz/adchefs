import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Client, Stage, Module, ModuleCompletion, StageWithModules } from '@/types/playbook';
import { isModuleCompleted } from '@/lib/progression';
import { logout } from '@/lib/auth';
import { BarChart3, ChevronRight, LogOut, Lock, TrendingUp } from 'lucide-react';
import Papa from 'papaparse';

/* ── Mini sparkline from weekly data ── */
function MiniSparkBars({ data }: { data: number[] }) {
  const max = Math.max(...data, 1);
  return (
    <div className="flex items-end gap-1" style={{ height: 60 }}>
      {data.map((v, i) => (
        <div
          key={i}
          className="flex-1 rounded-t-md transition-all duration-300"
          style={{
            height: `${(v / max) * 100}%`,
            minHeight: v > 0 ? 6 : 3,
            minWidth: 6,
            background: v > 0
              ? 'linear-gradient(180deg, #a855f7, #7c3aed)'
              : 'rgba(168,85,247,0.06)',
            boxShadow: v > 0 ? '0 0 8px rgba(168,85,247,0.3)' : 'none',
          }}
        />
      ))}
    </div>
  );
}

const CACHE_KEY_PREFIX = 'adchefs_perf_';
const CACHE_TTL = 12 * 60 * 60 * 1000;

const CARD_SHADOW = '0 0 0 1px rgba(255,255,255,0.06) inset, 0 4px 24px rgba(0,0,0,0.4)';
const CARD_SHADOW_HOVER = '0 0 0 1px rgba(168,85,247,0.2) inset, 0 0 0 1px rgba(99,102,241,0.1) inset, 0 4px 24px rgba(0,0,0,0.4)';

export default function ClientDashboard() {
  const navigate = useNavigate();
  const [client, setClient] = useState<Client | null>(null);
  const [stages, setStages] = useState<StageWithModules[]>([]);
  const [completions, setCompletions] = useState<ModuleCompletion[]>([]);
  const [loading, setLoading] = useState(true);
  const [perfStats, setPerfStats] = useState<{ delivered: number; approved: number; avg: string; weeklyData: number[] } | null>(null);

  useEffect(() => { loadData(); }, []);

  async function loadData() {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: clientData } = await supabase
      .from('clients')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    if (!clientData) { setLoading(false); return; }
    const c = clientData as Client;
    setClient(c);

    const [stagesRes, modulesRes, completionsRes] = await Promise.all([
      supabase.from('stages').select('*').eq('client_id', c.id).order('sort_order'),
      supabase.from('modules').select('*').eq('client_id', c.id).order('sort_order'),
      supabase.from('module_completions').select('*').eq('client_id', c.id),
    ]);

    setCompletions((completionsRes.data || []) as ModuleCompletion[]);
    const stagesData = (stagesRes.data || []) as Stage[];
    const modulesData = (modulesRes.data || []) as Module[];
    setStages(stagesData.map(s => ({ ...s, modules: modulesData.filter(m => m.stage_id === s.id) })));

    if (c.spreadsheet_id) loadPerfPreview(c.spreadsheet_id);
    setLoading(false);
  }

  async function loadPerfPreview(sheetId: string) {
    const cacheKey = CACHE_KEY_PREFIX + sheetId;
    try {
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Date.now() - parsed.lastSynced < CACHE_TTL) {
          computePerfStats(parsed.eod, parsed.paymentRaw || []);
          return;
        }
      }
    } catch {}

    try {
      const [eodRes, payRes] = await Promise.all([
        fetch(`https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&sheet=EOD-Report`),
        fetch(`https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&sheet=Payment Tracking`),
      ]);
      if (!eodRes.ok || !payRes.ok) return;
      const [eodText, payText] = await Promise.all([eodRes.text(), payRes.text()]);
      const eod = Papa.parse(eodText, { header: true, skipEmptyLines: true }).data as any[];
      const paymentRaw = Papa.parse(payText, { header: false, skipEmptyLines: true }).data as string[][];
      localStorage.setItem(cacheKey, JSON.stringify({ eod, paymentRaw, lastSynced: Date.now() }));
      computePerfStats(eod, paymentRaw);
    } catch {}
  }

  function computePerfStats(eod: any[], paymentRaw: string[][]) {
    const currentMonth = new Date().toLocaleString('en-US', { month: 'long' });
    const filtered = eod.filter((r: any) => r.Month?.toLowerCase() === currentMonth.toLowerCase());
    const delivered = filtered.reduce((s: number, r: any) => s + (parseInt(r['Videos Delivered']) || 0), 0);
    const rows = paymentRaw.slice(1).filter(r => r[1]?.trim());
    const approved = rows.filter(r => r[2]?.trim() && r[3]?.trim()?.toLowerCase() === currentMonth.toLowerCase()).length;
    const uniqueDays = new Set(filtered.map((r: any) => r.Date)).size;
    const avg = uniqueDays > 0 ? (delivered / uniqueDays).toFixed(1) : '—';

    const weekMap: Record<string, number> = {};
    filtered.forEach((r: any) => {
      const w = r.Week;
      if (w) weekMap[w] = (weekMap[w] || 0) + (parseInt(r['Videos Delivered']) || 0);
    });
    const weeklyData = Object.keys(weekMap).sort((a, b) => parseInt(a) - parseInt(b)).map(k => weekMap[k]);
    setPerfStats({ delivered, approved, avg, weeklyData });
  }

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

  return (
    <div className="min-h-screen bg-[#09090f] relative">
      {/* Purple glow */}
      <div className="fixed inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse 80% 40% at 50% 0%, rgba(124,58,237,0.15) 0%, transparent 100%)',
      }} />

      {/* Top bar */}
      <header className="relative z-10 border-b border-white/[0.06]" style={{ background: 'rgba(9,9,15,0.85)', backdropFilter: 'blur(12px)' }}>
        <div className="max-w-5xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center text-white text-xs font-bold"
              style={{
                background: 'linear-gradient(135deg, #a855f7, #7c3aed)',
                boxShadow: '0 0 16px rgba(168,85,247,0.3)',
              }}
            >
              {client.brand_name.charAt(0)}
            </div>
            <div>
              <span className="text-sm font-medium text-white">{client.brand_name}</span>
              <span className="text-[10px] ml-2 text-white/30">Client Portal</span>
            </div>
          </div>
          <button
            onClick={() => { logout(); navigate('/login'); }}
            className="flex items-center gap-1.5 text-[11px] text-white/40 hover:text-white transition-all duration-200 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" /> Sign out
          </button>
        </div>
      </header>

      <main className="relative z-10 max-w-5xl mx-auto px-6 py-12 space-y-10">
        {/* Greeting */}
        <div>
          <p className="text-lg font-normal text-white/40">
            Welcome back,
          </p>
          <h1 className="text-3xl font-bold mt-1">
            <span className="text-white">Welcome back, </span>
            <span style={{ color: '#a855f7' }}>{client.brand_name}</span>
          </h1>
          <p className="text-sm mt-2 text-white/30">Here's your portal overview</p>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl">
          {/* Editor Performance card */}
          {client.spreadsheet_id ? (
            <button
              onClick={() => navigate('/performance')}
              className="group text-left cursor-pointer w-full bg-[#111118] rounded-2xl p-8 transition-all duration-200"
              style={{ boxShadow: CARD_SHADOW }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = CARD_SHADOW_HOVER; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = CARD_SHADOW; }}
            >
              <div className="flex items-start justify-between mb-6">
                <span className="text-white/30"><BarChart3 className="w-3.5 h-3.5" /></span>
                <ChevronRight className="w-4 h-4 text-white/20 group-hover:translate-x-1 transition-transform duration-200" />
              </div>

              <h3 className="text-base font-semibold text-white mb-1">Editor Performance</h3>
              <p className="text-xs text-white/30 mb-6">Delivery tracking, output metrics, and status</p>

              {perfStats ? (
                <>
                  <div className="grid grid-cols-3 gap-3 mb-6">
                    {[
                      { val: perfStats.delivered, label: 'DELIVERED' },
                      { val: perfStats.approved, label: 'APPROVED' },
                      { val: perfStats.avg, label: 'AVG/DAY' },
                    ].map((s, i) => (
                      <div key={i} className="text-center rounded-xl p-3" style={{ background: 'rgba(168,85,247,0.06)', boxShadow: '0 0 0 1px rgba(255,255,255,0.04) inset' }}>
                        <p className="text-2xl font-black text-white">{s.val}</p>
                        <p className="text-[9px] uppercase tracking-widest mt-1 text-white/40">{s.label}</p>
                      </div>
                    ))}
                  </div>
                  {perfStats.weeklyData.length > 0 && <MiniSparkBars data={perfStats.weeklyData} />}
                </>
              ) : (
                <div className="flex items-center gap-2 py-8 justify-center">
                  <div className="w-4 h-4 border-2 border-[#a855f7] border-t-transparent rounded-full animate-spin" />
                  <span className="text-xs text-white/30">Loading metrics…</span>
                </div>
              )}

              <div className="mt-6 flex items-center gap-1">
                <span className="text-sm font-semibold text-[#a855f7] group-hover:translate-x-1 transition-all duration-200">
                  View Performance →
                </span>
              </div>
            </button>
          ) : (
            <div className="relative overflow-hidden bg-[#111118] rounded-2xl p-8 opacity-60" style={{ boxShadow: CARD_SHADOW }}>
              <div className="flex items-start justify-between mb-6">
                <Lock className="w-3.5 h-3.5 text-white/20" />
              </div>
              <h3 className="text-base font-semibold text-white/40">Editor Performance</h3>
              <p className="text-xs text-white/20 mb-6">Performance tracking not yet configured</p>
              <div className="flex items-center gap-2 py-10 justify-center">
                <Lock className="w-5 h-5 text-white/10" />
                <span className="text-xs text-white/15">Coming soon</span>
              </div>
            </div>
          )}

          {/* Meta Ads card */}
          <button
            onClick={() => navigate('/ads')}
            className="group text-left cursor-pointer w-full bg-[#111118] rounded-2xl p-8 transition-all duration-200"
            style={{ boxShadow: CARD_SHADOW }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = CARD_SHADOW_HOVER; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = CARD_SHADOW; }}
          >
            <div className="flex items-start justify-between mb-6">
              <span className="text-white/30"><TrendingUp className="w-3.5 h-3.5" /></span>
              <ChevronRight className="w-4 h-4 text-white/20 group-hover:translate-x-1 transition-transform duration-200" />
            </div>

            <h3 className="text-base font-semibold text-white mb-1">Meta Ads</h3>
            <p className="text-xs text-white/30 mb-6">Ad performance, ROAS, CTR, and spend analytics</p>

            <div className="grid grid-cols-3 gap-3 mb-6">
              {[
                { val: '—', label: 'CTR' },
                { val: '—', label: 'ROAS' },
                { val: '—', label: 'CPA' },
              ].map((s, i) => (
                <div key={i} className="text-center rounded-xl p-3" style={{ background: 'rgba(168,85,247,0.06)', boxShadow: '0 0 0 1px rgba(255,255,255,0.04) inset' }}>
                  <p className="text-2xl font-black text-white">{s.val}</p>
                  <p className="text-[9px] uppercase tracking-widest mt-1 text-white/40">{s.label}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 flex items-center gap-1">
              <span className="text-sm font-semibold text-[#a855f7] group-hover:translate-x-1 transition-all duration-200">
                View Ad Performance →
              </span>
            </div>
          </button>
        </div>
      </main>
    </div>
  );
}
