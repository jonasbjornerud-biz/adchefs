import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Client } from '@/types/playbook';
import Papa from 'papaparse';
import {
  BarChart, Bar, LineChart, Line, Area, AreaChart, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer,
} from 'recharts';
import { RefreshCw, AlertCircle, FileBarChart, TrendingUp, Calendar, ArrowLeft, CheckCircle2, Clock } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';

interface EodRow { Month: string; Week: string; Date: string; Name: string; 'Videos Delivered': string; 'Select the working day the report is for': string; [k: string]: string; }
interface PaymentRow { 'Brief Name': string; 'Approval Date': string; 'Approved Month': string; [k: string]: string; }
interface CachedData { eod: EodRow[]; payment: PaymentRow[]; editors: string[]; months: string[]; lastSynced: number; }

const CACHE_TTL = 12 * 60 * 60 * 1000;
const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const COLORS = ['#8B5CF6', '#06b6d4', '#f59e0b', '#10B981', '#ec4899', '#3b82f6', '#ef4444', '#a78bfa'];

function parseCSV<T>(text: string): T[] {
  return Papa.parse<T>(text, { header: true, skipEmptyLines: true }).data;
}
function getCurrentMonth(): string {
  return new Date().toLocaleString('en-US', { month: 'long' });
}

/* Custom tooltip */
function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg px-3 py-2 text-xs shadow-xl" style={{ background: '#1a1a1f', border: '1px solid rgba(139,92,246,0.3)' }}>
      <p className="text-white/50 mb-1" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{label}</p>
      {payload.map((p: any, i: number) => (
        <div key={i} className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span className="text-white/70">{p.name}:</span>
          <span className="text-white font-medium" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{p.value}</span>
        </div>
      ))}
    </div>
  );
}

/* Styled select */
function DarkSelect({ value, onChange, options, placeholder }: { value: string; onChange: (v: string) => void; options: string[]; placeholder: string }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="appearance-none h-9 px-3 pr-8 rounded-lg text-xs font-medium text-white/80 cursor-pointer transition-colors focus:outline-none focus:ring-1 focus:ring-violet-500/50"
        style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}
      >
        {options.map(o => <option key={o} value={o} className="bg-[#111] text-white">{o}</option>)}
      </select>
      <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
        <svg width="10" height="6" viewBox="0 0 10 6" fill="none"><path d="M1 1L5 5L9 1" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </div>
    </div>
  );
}

export default function PerformanceDashboard() {
  const navigate = useNavigate();
  const [client, setClient] = useState<Client | null>(null);
  const [data, setData] = useState<CachedData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editor, setEditor] = useState('(All Editors)');
  const [month, setMonth] = useState(getCurrentMonth());

  useEffect(() => {
    loadClient();
  }, []);

  async function loadClient() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { navigate('/login'); return; }
    const { data: clientData } = await supabase.from('clients').select('*').eq('user_id', user.id).maybeSingle();
    if (!clientData || !(clientData as any).spreadsheet_id) { navigate('/dashboard'); return; }
    setClient(clientData as Client);
    fetchData((clientData as any).spreadsheet_id);
  }

  const fetchData = useCallback(async (sheetId: string, force = false) => {
    const cacheKey = `adchefs_perf_full_${sheetId}`;
    if (!force) {
      try {
        const cached = localStorage.getItem(cacheKey);
        if (cached) {
          const parsed: CachedData = JSON.parse(cached);
          if (Date.now() - parsed.lastSynced < CACHE_TTL) { setData(parsed); setLoading(false); return; }
        }
      } catch {}
    }
    setLoading(true); setError(null);
    try {
      const [eodRes, payRes, helpRes] = await Promise.all([
        fetch(`https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&sheet=EOD-Report`),
        fetch(`https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&sheet=Payment Tracking`),
        fetch(`https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&sheet=_Helpers`),
      ]);
      if (!eodRes.ok || !payRes.ok || !helpRes.ok) throw new Error('Failed to fetch sheet data');
      const [eodText, payText, helpText] = await Promise.all([eodRes.text(), payRes.text(), helpRes.text()]);
      const eod = parseCSV<EodRow>(eodText);
      const payment = parseCSV<PaymentRow>(payText);
      const helpers = Papa.parse(helpText, { header: false, skipEmptyLines: true }).data as string[][];
      const editorsA = helpers.map(r => r[0]).filter(Boolean);
      const editorsC = helpers.map(r => r[2]).filter(Boolean);
      const editors = [...new Set([...editorsA, ...editorsC])].filter(n => n && n !== 'undefined');
      const months = helpers.map(r => r[1]).filter(Boolean).filter(m => m !== 'undefined');
      const cached: CachedData = { eod, payment, editors, months, lastSynced: Date.now() };
      localStorage.setItem(cacheKey, JSON.stringify(cached));
      setData(cached);
    } catch (err: any) { setError(err.message || 'Unknown error'); } finally { setLoading(false); }
  }, []);

  const filteredEod = useMemo(() => {
    if (!data) return [];
    return data.eod.filter(r => {
      const matchMonth = r.Month?.toLowerCase() === month.toLowerCase();
      const matchEditor = editor === '(All Editors)' || r.Name === editor;
      return matchMonth && matchEditor;
    });
  }, [data, editor, month]);

  const filteredPayment = useMemo(() => {
    if (!data) return [];
    return data.payment.filter(r => r['Approved Month']?.toLowerCase() === month.toLowerCase());
  }, [data, month]);

  const kpis = useMemo(() => {
    const delivered = filteredEod.reduce((s, r) => s + (parseInt(r['Videos Delivered']) || 0), 0);
    const approved = filteredPayment.filter(r => r['Approval Date']?.trim()).length;
    const uniqueDays = new Set(filteredEod.map(r => r.Date)).size;
    const avg = uniqueDays > 0 ? (delivered / uniqueDays).toFixed(1) : '—';
    return { delivered, approved, avg };
  }, [filteredEod, filteredPayment]);

  const dailyByWeek = useMemo(() => {
    const weeks = [...new Set(filteredEod.map(r => r.Week))].sort((a, b) => parseInt(a) - parseInt(b));
    const dayMap: Record<string, Record<string, number>> = {};
    WEEKDAYS.forEach(d => { dayMap[d] = {}; });
    filteredEod.forEach(row => {
      const dayStr = row['Select the working day the report is for'] || '';
      let dow = '';
      for (const wd of WEEKDAYS) { if (dayStr.toLowerCase().includes(wd.toLowerCase())) { dow = wd; break; } }
      if (!dow) {
        const dateNum = parseInt(row.Date);
        const monthIdx = new Date(`${row.Month} 1, 2025`).getMonth();
        if (!isNaN(dateNum) && !isNaN(monthIdx)) {
          const d = new Date(2025, monthIdx, dateNum);
          const mapped = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d.getDay()];
          if (WEEKDAYS.includes(mapped)) dow = mapped;
        }
      }
      if (!dow) return;
      dayMap[dow][row.Week] = (dayMap[dow][row.Week] || 0) + (parseInt(row['Videos Delivered']) || 0);
    });
    return WEEKDAYS.map(day => {
      const entry: any = { day };
      weeks.forEach(w => { entry[`Wk ${w}`] = dayMap[day]?.[w] || 0; });
      return entry;
    });
  }, [filteredEod]);

  const weekKeys = useMemo(() => {
    return [...new Set(filteredEod.map(r => r.Week))].sort((a, b) => parseInt(a) - parseInt(b)).map(w => `Wk ${w}`);
  }, [filteredEod]);

  const weeklyOutput = useMemo(() => {
    const map: Record<string, number> = {};
    filteredEod.forEach(r => { const w = `Wk ${r.Week}`; map[w] = (map[w] || 0) + (parseInt(r['Videos Delivered']) || 0); });
    return Object.entries(map).sort(([a], [b]) => parseInt(a.replace('Wk ', '')) - parseInt(b.replace('Wk ', ''))).map(([week, total]) => ({ week, total }));
  }, [filteredEod]);

  const weeklyLines = useMemo(() => {
    if (editor !== '(All Editors)') {
      const map: Record<string, number> = {};
      filteredEod.forEach(r => { const w = `Wk ${r.Week}`; map[w] = (map[w] || 0) + (parseInt(r['Videos Delivered']) || 0); });
      return Object.entries(map).sort(([a], [b]) => parseInt(a.replace('Wk ', '')) - parseInt(b.replace('Wk ', ''))).map(([week, total]) => ({ week, total }));
    }
    const editors = [...new Set(filteredEod.map(r => r.Name))];
    const weeks = [...new Set(filteredEod.map(r => r.Week))].sort((a, b) => parseInt(a) - parseInt(b));
    return weeks.map(w => {
      const entry: any = { week: `Wk ${w}` };
      editors.forEach(ed => {
        entry[ed] = filteredEod.filter(r => r.Week === w && r.Name === ed).reduce((s, r) => s + (parseInt(r['Videos Delivered']) || 0), 0);
      });
      return entry;
    });
  }, [filteredEod, editor]);

  const lineEditors = useMemo(() => {
    if (editor !== '(All Editors)') return [];
    return [...new Set(filteredEod.map(r => r.Name))];
  }, [filteredEod, editor]);

  // Payment table
  const paymentRows = useMemo(() => {
    return filteredPayment.map(r => ({
      brief: r['Brief Name'] || '',
      date: r['Approval Date'] || '',
      month: r['Approved Month'] || '',
      approved: !!r['Approval Date']?.trim(),
    })).filter(r => r.brief);
  }, [filteredPayment]);

  const noData = filteredEod.length === 0 && !loading;

  const shimmerSkeleton = "relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/[0.03] before:to-transparent before:animate-[shimmer_2s_infinite]";

  if (loading) {
    return (
      <div className="min-h-screen" style={{ background: '#09090B' }}>
        <div className="max-w-6xl mx-auto px-6 py-8 space-y-6">
          <div className="flex gap-4">
            {[...Array(3)].map((_, i) => <div key={i} className={`h-28 rounded-xl flex-1 ${shimmerSkeleton}`} style={{ background: '#111113' }} />)}
          </div>
          <div className={`h-72 rounded-xl ${shimmerSkeleton}`} style={{ background: '#111113' }} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#09090B' }}>
        <div className="flex flex-col items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
            <AlertCircle className="w-6 h-6 text-red-400" />
          </div>
          <p className="text-sm text-white/50">Failed to load performance data</p>
          <p className="text-xs text-white/20" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{error}</p>
          <Button variant="outline" size="sm" onClick={() => client?.spreadsheet_id && fetchData(client.spreadsheet_id, true)}
            className="rounded-lg text-xs bg-white/5 border-white/10 text-white/60 hover:bg-white/10 hover:text-white">
            <RefreshCw className="w-3 h-3 mr-1.5" /> Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: '#09090B' }}>
      <div className="fixed inset-0 pointer-events-none" style={{
        backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)',
        backgroundSize: '24px 24px',
      }} />

      {/* Header */}
      <header className="relative z-10 border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/dashboard')} className="flex items-center gap-1.5 text-xs text-white/30 hover:text-white/60 transition-colors">
              <ArrowLeft className="w-3.5 h-3.5" /> Back
            </button>
            <div className="h-4 w-px bg-white/10" />
            <span className="text-sm font-medium text-white">Editor Performance</span>
          </div>
          <div className="flex items-center gap-3">
            {data && (
              <span className="text-[10px] text-white/20" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                Synced {new Date(data.lastSynced).toLocaleString()}
              </span>
            )}
            <button
              onClick={() => client?.spreadsheet_id && fetchData(client.spreadsheet_id, true)}
              className="flex items-center gap-1.5 h-7 px-2.5 rounded-lg text-[11px] text-white/40 hover:text-white/70 transition-colors"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
            >
              <RefreshCw className="w-3 h-3" /> Sync
            </button>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-6xl mx-auto px-6 py-8 space-y-6">
        {/* Filters */}
        <div className="flex gap-3">
          <DarkSelect value={editor} onChange={setEditor} options={data?.editors || []} placeholder="Editor" />
          <DarkSelect value={month} onChange={setMonth} options={data?.months || []} placeholder="Month" />
        </div>

        {noData ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 rounded-2xl" style={{ background: '#111113', border: '1px solid rgba(255,255,255,0.06)' }}>
            <FileBarChart className="w-10 h-10 text-white/10" />
            <p className="text-sm text-white/30">
              No data yet for <span className="text-white/60 font-medium">{editor}</span> in <span className="text-white/60 font-medium">{month}</span>
            </p>
          </div>
        ) : (
          <>
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { icon: FileBarChart, label: 'Total Delivered', value: kpis.delivered, color: '#8B5CF6' },
                { icon: TrendingUp, label: 'Videos Approved', value: kpis.approved, color: '#10B981' },
                { icon: Calendar, label: 'Avg Videos/Day', value: kpis.avg, color: '#06b6d4' },
              ].map((kpi, i) => (
                <div key={i} className="rounded-xl p-5 transition-all duration-200 hover:scale-[1.01]"
                  style={{ background: '#111113', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div className="flex items-center gap-2.5 mb-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${kpi.color}15`, border: `1px solid ${kpi.color}25` }}>
                      <kpi.icon className="w-4 h-4" style={{ color: kpi.color }} />
                    </div>
                  </div>
                  <p className="text-3xl font-bold text-white" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{kpi.value}</p>
                  <p className="text-[10px] uppercase tracking-widest text-white/30 mt-1">{kpi.label}</p>
                </div>
              ))}
            </div>

            {/* Charts row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {/* Daily by Week */}
              <div className="rounded-xl p-5" style={{ background: '#111113', border: '1px solid rgba(255,255,255,0.06)' }}>
                <h4 className="text-sm font-semibold text-white mb-0.5">Daily Deliveries by Week</h4>
                <p className="text-[10px] text-white/30 mb-4">Grouped by weekday</p>
                <div className="h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dailyByWeek} barCategoryGap="20%">
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis dataKey="day" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
                      <Tooltip content={<ChartTooltip />} />
                      <Legend wrapperStyle={{ fontSize: 10, color: 'rgba(255,255,255,0.4)' }} />
                      {weekKeys.map((wk, i) => (
                        <Bar key={wk} dataKey={wk} fill={COLORS[i % COLORS.length]} radius={[3, 3, 0, 0]} />
                      ))}
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Weekly Output */}
              <div className="rounded-xl p-5" style={{ background: '#111113', border: '1px solid rgba(255,255,255,0.06)' }}>
                <h4 className="text-sm font-semibold text-white mb-0.5">Weekly Output</h4>
                <p className="text-[10px] text-white/30 mb-4">Total videos per week</p>
                <div className="h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={weeklyOutput}>
                      <defs>
                        <linearGradient id="barGradDark" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#8B5CF6" stopOpacity={0.9} />
                          <stop offset="100%" stopColor="#6366F1" stopOpacity={0.6} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis dataKey="week" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
                      <Tooltip content={<ChartTooltip />} />
                      <Bar dataKey="total" fill="url(#barGradDark)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Weekly Deliveries Line Chart */}
            <div className="rounded-xl p-5" style={{ background: '#111113', border: '1px solid rgba(255,255,255,0.06)' }}>
              <h4 className="text-sm font-semibold text-white mb-0.5">Weekly Deliveries</h4>
              <p className="text-[10px] text-white/30 mb-4">Trend across weeks</p>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={weeklyLines}>
                    <defs>
                      {editor === '(All Editors)' ? lineEditors.map((ed, i) => (
                        <linearGradient key={ed} id={`area_${i}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={COLORS[i % COLORS.length]} stopOpacity={0.15} />
                          <stop offset="100%" stopColor={COLORS[i % COLORS.length]} stopOpacity={0} />
                        </linearGradient>
                      )) : (
                        <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#8B5CF6" stopOpacity={0.15} />
                          <stop offset="100%" stopColor="#8B5CF6" stopOpacity={0} />
                        </linearGradient>
                      )}
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="week" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
                    <Tooltip content={<ChartTooltip />} />
                    <Legend wrapperStyle={{ fontSize: 10, color: 'rgba(255,255,255,0.4)' }} />
                    {editor === '(All Editors)' ? lineEditors.map((ed, i) => (
                      <Area key={ed} type="monotone" dataKey={ed} stroke={COLORS[i % COLORS.length]} strokeWidth={2} fill={`url(#area_${i})`} dot={{ r: 3, fill: COLORS[i % COLORS.length] }} />
                    )) : (
                      <Area type="monotone" dataKey="total" stroke="#8B5CF6" strokeWidth={2} fill="url(#areaGrad)" dot={{ r: 3, fill: '#8B5CF6' }} />
                    )}
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Payment Status Table */}
            {paymentRows.length > 0 && (
              <div className="rounded-xl overflow-hidden" style={{ background: '#111113', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="px-5 py-4 border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                  <h4 className="text-sm font-semibold text-white">Payment Status</h4>
                  <p className="text-[10px] text-white/30 mt-0.5">{paymentRows.filter(r => r.approved).length} approved in {month}</p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                        <th className="text-left py-3 px-5 text-white/30 font-medium uppercase tracking-wider text-[10px]">Brief Name</th>
                        <th className="text-left py-3 px-5 text-white/30 font-medium uppercase tracking-wider text-[10px]">Approval Date</th>
                        <th className="text-left py-3 px-5 text-white/30 font-medium uppercase tracking-wider text-[10px]">Month</th>
                        <th className="text-left py-3 px-5 text-white/30 font-medium uppercase tracking-wider text-[10px]">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paymentRows.map((row, i) => (
                        <tr key={i} className="hover:bg-white/[0.02] transition-colors" style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                          <td className="py-2.5 px-5 text-white/70">{row.brief}</td>
                          <td className="py-2.5 px-5 text-white/50" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{row.date || '—'}</td>
                          <td className="py-2.5 px-5 text-white/50">{row.month}</td>
                          <td className="py-2.5 px-5">
                            {row.approved ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                <CheckCircle2 className="w-3 h-3" /> Approved
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
                                <Clock className="w-3 h-3" /> Pending
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
