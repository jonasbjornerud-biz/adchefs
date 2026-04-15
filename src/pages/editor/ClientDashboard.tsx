import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Client, Stage, Module, ModuleCompletion, StageWithModules } from '@/types/playbook';
import { isModuleCompleted } from '@/lib/progression';
import { logout } from '@/lib/auth';
import { GraduationCap, BarChart3, ChevronRight, LogOut, Lock } from 'lucide-react';
import Papa from 'papaparse';

/* ── Mini sparkline from weekly data ── */
function MiniSparkBars({ data }: { data: number[] }) {
  const max = Math.max(...data, 1);
  return (
    <div className="flex items-end gap-1 h-10">
      {data.map((v, i) => (
        <div
          key={i}
          className="w-5 rounded-sm transition-all duration-300"
          style={{
            height: `${(v / max) * 100}%`,
            minHeight: v > 0 ? 4 : 2,
            background: v > 0
              ? 'linear-gradient(180deg, #8B5CF6, #6366F1)'
              : 'rgba(255,255,255,0.06)',
          }}
        />
      ))}
    </div>
  );
}

const CACHE_KEY_PREFIX = 'adchefs_perf_';
const CACHE_TTL = 12 * 60 * 60 * 1000;

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

    // Load perf preview if sheet configured
    if (c.spreadsheet_id) {
      loadPerfPreview(c.spreadsheet_id);
    }

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
    // Count non-empty column C (index 2) from row 5+ (index 4+) where column D matches current month
    const rows = paymentRaw.slice(4);
    const approved = rows.filter(r => r[2]?.trim() && r[3]?.trim()?.toLowerCase() === currentMonth.toLowerCase()).length;
    const uniqueDays = new Set(filtered.map((r: any) => r.Date)).size;
    const avg = uniqueDays > 0 ? (delivered / uniqueDays).toFixed(1) : '—';

    // Weekly data for sparkline
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
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#09090B' }}>
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm text-white/30">Loading…</span>
        </div>
      </div>
    );
  }

  if (!client) return null;

  const totalModules = stages.reduce((sum, s) => sum + s.modules.length, 0);
  const completedModules = stages.reduce((sum, s) => sum + s.modules.filter(m => isModuleCompleted(m.id, completions)).length, 0);
  const pct = totalModules > 0 ? Math.round((completedModules / totalModules) * 100) : 0;
  const stageCount = stages.length;
  const stagesComplete = stages.filter(s => s.modules.length > 0 && s.modules.every(m => isModuleCompleted(m.id, completions))).length;

  return (
    <div className="min-h-screen" style={{ background: '#09090B' }}>
      {/* Dot grid */}
      <div className="fixed inset-0 pointer-events-none" style={{
        backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)',
        backgroundSize: '24px 24px',
      }} />
      <div className="fixed inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse at 50% 0%, rgba(139,92,246,0.06) 0%, transparent 50%)',
      }} />

      {/* Top bar */}
      <header className="relative z-10 border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
        <div className="max-w-5xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center text-white text-xs font-bold shadow-lg shadow-violet-500/20">
              {client.brand_name.charAt(0)}
            </div>
            <div>
              <span className="text-sm font-medium text-white">{client.brand_name}</span>
              <span className="text-[10px] text-white/30 ml-2">Client Portal</span>
            </div>
          </div>
          <button
            onClick={() => { logout(); navigate('/login'); }}
            className="flex items-center gap-1.5 text-[11px] text-white/30 hover:text-white/60 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" /> Sign out
          </button>
        </div>
      </header>

      <main className="relative z-10 max-w-5xl mx-auto px-6 py-10 space-y-8">
        {/* Greeting */}
        <div>
          <h1 className="text-2xl font-medium text-white">
            Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-400">{client.brand_name}</span>
          </h1>
          <p className="text-sm text-white/30 mt-1">Here's your portal overview</p>
        </div>

        {/* Two cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Card 1: Onboarding */}
          <button
            onClick={() => navigate('/playbook')}
            className="group text-left rounded-2xl p-6 transition-all duration-200 hover:scale-[1.01]"
            style={{
              background: '#111113',
              border: '1px solid rgba(255,255,255,0.06)',
              boxShadow: '0 0 0 0 rgba(139,92,246,0)',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = '0 0 30px -5px rgba(139,92,246,0.15)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(139,92,246,0.2)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = '0 0 0 0 rgba(139,92,246,0)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.06)'; }}
          >
            <div className="flex items-start justify-between mb-5">
              <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-violet-400" />
              </div>
              <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-violet-400 group-hover:translate-x-0.5 transition-all" />
            </div>

            <h3 className="text-base font-semibold text-white mb-0.5">Onboarding</h3>
            <p className="text-xs text-white/30 mb-5">SOPs, modules, and progression tracking</p>

            {/* Mini stats */}
            <div className="grid grid-cols-3 gap-2 mb-5">
              {[
                { val: totalModules, label: 'MODULES' },
                { val: `${stagesComplete}/${stageCount}`, label: 'STAGES' },
                { val: `${pct}%`, label: 'COMPLETE', highlight: pct === 100 },
              ].map((s, i) => (
                <div key={i} className="rounded-xl p-3 text-center" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.04)' }}>
                  <p className={`text-lg font-bold ${s.highlight ? 'text-emerald-400' : 'text-white'}`} style={{ fontFamily: "'JetBrains Mono', monospace" }}>{s.val}</p>
                  <p className="text-[8px] uppercase tracking-widest text-white/30">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Progress bar */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-white/30">{pct === 100 ? '🎉 Complete!' : 'Progress'}</span>
                <span className="text-xs font-bold text-white/60" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{pct}%</span>
              </div>
              <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${pct}%`,
                    background: pct === 100
                      ? 'linear-gradient(90deg, #10B981, #34D399)'
                      : 'linear-gradient(90deg, #8B5CF6, #6366F1)',
                    boxShadow: pct > 0 ? '0 0 12px rgba(139,92,246,0.4)' : 'none',
                  }}
                />
              </div>
            </div>

            <div className="mt-5 flex items-center gap-1.5">
              <span className="text-[10px] font-semibold uppercase tracking-widest text-violet-400 group-hover:text-violet-300 transition-colors">
                Open Onboarding →
              </span>
            </div>
          </button>

          {/* Card 2: Editor Performance */}
          {client.spreadsheet_id ? (
            <button
              onClick={() => navigate('/performance')}
              className="group text-left rounded-2xl p-6 transition-all duration-200 hover:scale-[1.01]"
              style={{
                background: '#111113',
                border: '1px solid rgba(255,255,255,0.06)',
                boxShadow: '0 0 0 0 rgba(139,92,246,0)',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = '0 0 30px -5px rgba(139,92,246,0.15)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(139,92,246,0.2)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = '0 0 0 0 rgba(139,92,246,0)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.06)'; }}
            >
              <div className="flex items-start justify-between mb-5">
                <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-violet-400" />
                </div>
                <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-violet-400 group-hover:translate-x-0.5 transition-all" />
              </div>

              <h3 className="text-base font-semibold text-white mb-0.5">Editor Performance</h3>
              <p className="text-xs text-white/30 mb-5">Delivery tracking, output metrics, and status</p>

              {perfStats ? (
                <>
                  <div className="grid grid-cols-3 gap-2 mb-5">
                    {[
                      { val: perfStats.delivered, label: 'DELIVERED' },
                      { val: perfStats.approved, label: 'APPROVED' },
                      { val: perfStats.avg, label: 'AVG/DAY' },
                    ].map((s, i) => (
                      <div key={i} className="rounded-xl p-3 text-center" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.04)' }}>
                        <p className="text-lg font-bold text-white" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{s.val}</p>
                        <p className="text-[8px] uppercase tracking-widest text-white/30">{s.label}</p>
                      </div>
                    ))}
                  </div>
                  {perfStats.weeklyData.length > 0 && <MiniSparkBars data={perfStats.weeklyData} />}
                </>
              ) : (
                <div className="flex items-center gap-2 py-6 justify-center">
                  <div className="w-4 h-4 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
                  <span className="text-xs text-white/30">Loading metrics…</span>
                </div>
              )}

              <div className="mt-5 flex items-center gap-1.5">
                <span className="text-[10px] font-semibold uppercase tracking-widest text-violet-400 group-hover:text-violet-300 transition-colors">
                  View Performance →
                </span>
              </div>
            </button>
          ) : (
            <div
              className="rounded-2xl p-6 relative overflow-hidden"
              style={{
                background: '#111113',
                border: '1px solid rgba(255,255,255,0.06)',
                backdropFilter: 'blur(20px)',
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent" />
              <div className="relative">
                <div className="flex items-start justify-between mb-5">
                  <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center">
                    <Lock className="w-5 h-5 text-white/20" />
                  </div>
                </div>
                <h3 className="text-base font-semibold text-white/40 mb-0.5">Editor Performance</h3>
                <p className="text-xs text-white/20 mb-5">Performance tracking not yet configured</p>
                <div className="flex items-center gap-2 py-8 justify-center">
                  <Lock className="w-5 h-5 text-white/10" />
                  <span className="text-xs text-white/15">Coming soon</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
