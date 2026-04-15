import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Client, Stage, Module, ModuleCompletion, StageWithModules } from '@/types/playbook';
import { isModuleCompleted } from '@/lib/progression';
import { logout } from '@/lib/auth';
import { GraduationCap, BarChart3, ChevronRight, LogOut, Lock } from 'lucide-react';
import Papa from 'papaparse';

/* ── Shine animation keyframes (injected once) ── */
const shineStyleId = 'dashboard-shine-style';
if (typeof document !== 'undefined' && !document.getElementById(shineStyleId)) {
  const style = document.createElement('style');
  style.id = shineStyleId;
  style.textContent = `
    @keyframes progress-shine {
      0% { transform: translateX(-100%); }
      100% { transform: translateX(200%); }
    }
    .progress-shine::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent);
      animation: progress-shine 3s ease-in-out infinite;
    }
  `;
  document.head.appendChild(style);
}

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
              ? 'linear-gradient(180deg, #8B5CF6, #6366F1)'
              : 'rgba(139,92,246,0.08)',
            boxShadow: v > 0 ? '0 0 8px rgba(139,92,246,0.3)' : 'none',
          }}
        />
      ))}
    </div>
  );
}

const CACHE_KEY_PREFIX = 'adchefs_perf_';
const CACHE_TTL = 12 * 60 * 60 * 1000;

/* ── Card wrapper styles ── */
const cardBase: React.CSSProperties = {
  background: 'rgba(17, 17, 22, 0.7)',
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(139, 92, 246, 0.12)',
  borderRadius: 16,
  padding: 32,
  boxShadow: '0 0 30px rgba(139,92,246,0.07), 0 4px 20px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.04)',
  transition: 'all 300ms ease',
};
const cardHover: Partial<CSSStyleDeclaration> = {
  borderColor: 'rgba(139, 92, 246, 0.25)',
  boxShadow: '0 0 40px rgba(139,92,246,0.12), 0 4px 20px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)',
  transform: 'scale(1.005)',
};

const statBoxStyle: React.CSSProperties = {
  background: 'rgba(139, 92, 246, 0.06)',
  border: '1px solid rgba(139, 92, 246, 0.1)',
  borderRadius: 12,
  padding: '16px 20px',
  boxShadow: 'inset 0 0 20px rgba(139,92,246,0.05)',
};

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

  const applyHover = (e: React.MouseEvent) => {
    const el = e.currentTarget as HTMLElement;
    Object.assign(el.style, cardHover);
  };
  const removeHover = (e: React.MouseEvent) => {
    const el = e.currentTarget as HTMLElement;
    el.style.borderColor = 'rgba(139, 92, 246, 0.12)';
    el.style.boxShadow = '0 0 30px rgba(139,92,246,0.07), 0 4px 20px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.04)';
    el.style.transform = 'scale(1)';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#06060A' }}>
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm" style={{ color: 'rgba(255,255,255,0.3)' }}>Loading…</span>
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
    <div className="min-h-screen relative" style={{ background: '#06060A' }}>
      {/* Layered background */}
      <div className="fixed inset-0 pointer-events-none" style={{
        backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)',
        backgroundSize: '20px 20px',
      }} />
      <div className="fixed inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse at 50% 30%, rgba(139,92,246,0.06) 0%, transparent 60%)',
      }} />
      <div className="fixed inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse at 80% 80%, rgba(99,102,241,0.04) 0%, transparent 50%)',
      }} />

      {/* Top bar */}
      <header className="relative z-10" style={{
        background: 'rgba(9,9,11,0.8)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
      }}>
        <div className="max-w-5xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center text-white text-xs font-bold"
              style={{
                background: 'linear-gradient(135deg, #8B5CF6, #6366F1)',
                boxShadow: '0 0 16px rgba(139,92,246,0.3)',
                border: '2px solid transparent',
                backgroundClip: 'padding-box',
                outline: '2px solid rgba(139,92,246,0.3)',
                outlineOffset: -2,
              }}
            >
              {client.brand_name.charAt(0)}
            </div>
            <div>
              <span className="text-sm font-medium text-white">{client.brand_name}</span>
              <span className="text-[10px] ml-2" style={{ color: 'rgba(255,255,255,0.3)' }}>Client Portal</span>
            </div>
          </div>
          <button
            onClick={() => { logout(); navigate('/login'); }}
            className="flex items-center gap-1.5 text-[11px] transition-colors"
            style={{ color: 'rgba(255,255,255,0.4)' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,1)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.4)')}
          >
            <LogOut className="w-3.5 h-3.5" /> Sign out
          </button>
        </div>
      </header>

      <main className="relative z-10 max-w-5xl mx-auto px-6 py-12 space-y-10">
        {/* Greeting */}
        <div>
          <p className="text-lg font-normal" style={{ color: 'rgba(255,255,255,0.5)' }}>
            Welcome back,
          </p>
          <h1
            className="text-3xl font-bold mt-1"
            style={{
              background: 'linear-gradient(135deg, #8B5CF6, #a78bfa, #c4b5fd)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {client.brand_name}
          </h1>
          <p className="text-sm mt-2" style={{ color: 'rgba(255,255,255,0.3)' }}>Here's your portal overview</p>
        </div>

        {/* Two cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: Onboarding */}
          <button
            onClick={() => navigate('/playbook')}
            className="group text-left cursor-pointer"
            style={cardBase}
            onMouseEnter={applyHover}
            onMouseLeave={removeHover}
          >
            <div className="flex items-start justify-between mb-6">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, rgba(139,92,246,0.15), rgba(99,102,241,0.1))',
                  border: '1px solid rgba(139,92,246,0.2)',
                  boxShadow: '0 0 20px rgba(139,92,246,0.1)',
                }}
              >
                <GraduationCap className="w-5 h-5" style={{ color: '#8B5CF6' }} />
              </div>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" style={{ color: 'rgba(255,255,255,0.2)' }} />
            </div>

            <h3 className="text-base font-semibold text-white mb-1">Video Editor Onboarding</h3>
            <p className="text-xs mb-6" style={{ color: 'rgba(255,255,255,0.3)' }}>SOPs, modules, and progression tracking</p>

            {/* Mini stats */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              {[
                { val: totalModules, label: 'MODULES' },
                { val: `${stagesComplete}/${stageCount}`, label: 'STAGES' },
                { val: `${pct}%`, label: 'COMPLETE', highlight: pct === 100 },
              ].map((s, i) => (
                <div key={i} className="text-center" style={statBoxStyle}>
                  <p
                    className="text-2xl font-bold"
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      color: s.highlight ? '#34D399' : '#fff',
                    }}
                  >{s.val}</p>
                  <p className="text-[9px] uppercase tracking-widest mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>{s.label}</p>
                </div>
              ))}
            </div>

            {/* Progress bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px]" style={{ color: 'rgba(255,255,255,0.3)' }}>{pct === 100 ? '🎉 Complete!' : 'Progress'}</span>
                <span className="text-xs font-bold" style={{ color: 'rgba(255,255,255,0.6)', fontFamily: "'JetBrains Mono', monospace" }}>{pct}%</span>
              </div>
              <div className="h-2 rounded-full overflow-hidden relative" style={{ background: 'rgba(139,92,246,0.1)' }}>
                <div
                  className="h-full rounded-full transition-all duration-700 relative overflow-hidden progress-shine"
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

            <div className="mt-6 flex items-center gap-1">
              <span
                className="text-sm font-semibold group-hover:translate-x-1 transition-all duration-300"
                style={{ color: '#8B5CF6' }}
              >
                Open Onboarding →
              </span>
            </div>
          </button>

          {/* Card 2: Editor Performance */}
          {client.spreadsheet_id ? (
            <button
              onClick={() => navigate('/performance')}
              className="group text-left cursor-pointer"
              style={cardBase}
              onMouseEnter={applyHover}
              onMouseLeave={removeHover}
            >
              <div className="flex items-start justify-between mb-6">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{
                    background: 'linear-gradient(135deg, rgba(139,92,246,0.15), rgba(99,102,241,0.1))',
                    border: '1px solid rgba(139,92,246,0.2)',
                    boxShadow: '0 0 20px rgba(139,92,246,0.1)',
                  }}
                >
                  <BarChart3 className="w-5 h-5" style={{ color: '#8B5CF6' }} />
                </div>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" style={{ color: 'rgba(255,255,255,0.2)' }} />
              </div>

              <h3 className="text-base font-semibold text-white mb-1">Editor Performance</h3>
              <p className="text-xs mb-6" style={{ color: 'rgba(255,255,255,0.3)' }}>Delivery tracking, output metrics, and status</p>

              {perfStats ? (
                <>
                  <div className="grid grid-cols-3 gap-3 mb-6">
                    {[
                      { val: perfStats.delivered, label: 'DELIVERED' },
                      { val: perfStats.approved, label: 'APPROVED' },
                      { val: perfStats.avg, label: 'AVG/DAY' },
                    ].map((s, i) => (
                      <div key={i} className="text-center" style={statBoxStyle}>
                        <p className="text-2xl font-bold text-white" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{s.val}</p>
                        <p className="text-[9px] uppercase tracking-widest mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>{s.label}</p>
                      </div>
                    ))}
                  </div>
                  {perfStats.weeklyData.length > 0 && <MiniSparkBars data={perfStats.weeklyData} />}
                </>
              ) : (
                <div className="flex items-center gap-2 py-8 justify-center">
                  <div className="w-4 h-4 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
                  <span className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>Loading metrics…</span>
                </div>
              )}

              <div className="mt-6 flex items-center gap-1">
                <span
                  className="text-sm font-semibold group-hover:translate-x-1 transition-all duration-300"
                  style={{ color: '#8B5CF6' }}
                >
                  View Performance →
                </span>
              </div>
            </button>
          ) : (
            <div style={{ ...cardBase, opacity: 0.6 }} className="relative overflow-hidden">
              <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.01), transparent)' }} />
              <div className="relative">
                <div className="flex items-start justify-between mb-6">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center"
                    style={{
                      background: 'rgba(139,92,246,0.04)',
                      border: '1px solid rgba(139,92,246,0.08)',
                    }}
                  >
                    <Lock className="w-5 h-5" style={{ color: 'rgba(255,255,255,0.2)' }} />
                  </div>
                </div>
                <h3 className="text-base font-semibold" style={{ color: 'rgba(255,255,255,0.4)' }}>Editor Performance</h3>
                <p className="text-xs mb-6" style={{ color: 'rgba(255,255,255,0.2)' }}>Performance tracking not yet configured</p>
                <div className="flex items-center gap-2 py-10 justify-center">
                  <Lock className="w-5 h-5" style={{ color: 'rgba(255,255,255,0.1)' }} />
                  <span className="text-xs" style={{ color: 'rgba(255,255,255,0.15)' }}>Coming soon</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
