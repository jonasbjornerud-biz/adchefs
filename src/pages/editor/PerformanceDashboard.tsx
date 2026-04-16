import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Client } from '@/types/playbook';
import Papa from 'papaparse';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer,
} from 'recharts';
import { RefreshCw, AlertCircle, FileBarChart, TrendingUp, Calendar, ArrowLeft, CheckCircle2, Clock, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { KpiCard } from '@/components/dashboard/KpiCard';

interface EodRow { Month: string; Week: string; Date: string; Name: string; 'Videos Delivered': string; 'Select the working day the report is for': string; [k: string]: string; }
interface PaymentRow { 'Brief Name': string; 'Approval Date': string; 'Approved Month': string; [k: string]: string; }
interface CachedData { eod: EodRow[]; payment: PaymentRow[]; editors: string[]; months: string[]; lastSynced: number; paymentRaw: string[][]; }

const CACHE_TTL = 12 * 60 * 60 * 1000;
const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const COLORS = ['#a855f7', '#06b6d4', '#fbbf24', '#34d399', '#ec4899', '#3b82f6', '#f87171', '#c084fc'];

const CARD_SHADOW = '0 0 0 1px rgba(255,255,255,0.06) inset, 0 4px 24px rgba(0,0,0,0.4)';
const CARD_SHADOW_HOVER = '0 0 0 1px rgba(168,85,247,0.2) inset, 0 0 0 1px rgba(99,102,241,0.1) inset, 0 4px 24px rgba(0,0,0,0.4)';

function parseCSV<T>(text: string): T[] {
  return Papa.parse<T>(text, { header: true, skipEmptyLines: true }).data;
}
function getCurrentMonth(): string {
  return new Date().toLocaleString('en-US', { month: 'long' });
}

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl px-3 py-2 text-xs" style={{ background: '#1a1a24', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }}>
      <p className="text-white/30 mb-1">{label}</p>
      {payload.map((p: any, i: number) => (
        <div key={i} className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span className="text-white/50">{p.name}:</span>
          <span className="text-white font-black">{p.value}</span>
        </div>
      ))}
    </div>
  );
}

function DarkSelect({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: string[]; placeholder?: string }) {
  return (
    <div className="relative group">
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="appearance-none h-9 px-3 pr-8 rounded-lg text-xs font-medium text-white/60 cursor-pointer transition-all duration-200 focus:outline-none bg-[#111118] border border-white/[0.06]"
        style={{ boxShadow: CARD_SHADOW }}
        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = CARD_SHADOW_HOVER; }}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = CARD_SHADOW; }}
      >
        {options.map(o => <option key={o} value={o} className="bg-[#111118] text-white">{o}</option>)}
      </select>
      <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
        <svg width="10" height="6" viewBox="0 0 10 6" fill="none"><path d="M1 1L5 5L9 1" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </div>
    </div>
  );
}

function PremiumCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`bg-[#111118] rounded-2xl transition-all duration-200 ${className}`}
      style={{ boxShadow: CARD_SHADOW }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = CARD_SHADOW_HOVER; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = CARD_SHADOW; }}
    >
      {children}
    </div>
  );
}

export default function PerformanceDashboard() {
  const navigate = useNavigate();
  const { clientId: adminClientId } = useParams<{ clientId?: string }>();
  const isAdminView = !!adminClientId;
  const [client, setClient] = useState<Client | null>(null);
  const [data, setData] = useState<CachedData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editor, setEditor] = useState('(All Editors)');
  const [month, setMonth] = useState(getCurrentMonth());

  useEffect(() => { loadClient(); }, [adminClientId]);

  async function loadClient() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { navigate('/login'); return; }

    let clientData: any = null;
    if (isAdminView) {
      const res = await supabase.from('clients').select('*').eq('id', adminClientId!).maybeSingle();
      clientData = res.data;
      if (!clientData?.spreadsheet_id) { navigate(`/admin/clients/${adminClientId}`); return; }
    } else {
      const res = await supabase.from('clients').select('*').eq('user_id', user.id).maybeSingle();
      clientData = res.data;
      if (!clientData || !clientData.spreadsheet_id) { navigate('/dashboard'); return; }
    }
    setClient(clientData as Client);
    fetchData(clientData.spreadsheet_id);
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
      const paymentRaw = Papa.parse(payText, { header: false, skipEmptyLines: true }).data as string[][];
      const helpers = Papa.parse(helpText, { header: false, skipEmptyLines: true }).data as string[][];

      const editorsA = helpers.slice(1).map(r => r[0]?.trim()).filter(Boolean).filter(n => n !== 'undefined');
      const editors = ['(All Editors)', ...new Set(editorsA)];
      const months = helpers.map(r => r[1]).filter(Boolean).filter(m => m !== 'undefined');

      const cached: CachedData = { eod, payment, paymentRaw, editors, months, lastSynced: Date.now() };
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

  const approvedCount = useMemo(() => {
    if (!data?.paymentRaw) return 0;
    const rows = data.paymentRaw.slice(1).filter(r => r[1]?.trim());
    return rows.filter(r => {
      const hasDate = r[2]?.trim();
      const approvedMonth = r[3]?.trim();
      return hasDate && approvedMonth?.toLowerCase() === month.toLowerCase();
    }).length;
  }, [data, month]);

  const filteredPayment = useMemo(() => {
    if (!data?.paymentRaw) return [];
    const rows = data.paymentRaw.slice(1).filter(r => r[1]?.trim());
    return rows
      .filter(r => r[3]?.trim()?.toLowerCase() === month.toLowerCase())
      .map(r => ({
        brief: r[1]?.trim() || '',
        date: r[2]?.trim() || '',
        month: r[3]?.trim() || '',
        approved: !!r[2]?.trim(),
      }))
      .filter(r => r.brief);
  }, [data, month]);

  const monthlyApproved = useMemo(() => {
    if (!data?.paymentRaw) return [];
    const rows = data.paymentRaw.slice(1).filter(r => r[1]?.trim());
    const monthOrder = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    const map: Record<string, number> = {};
    rows.forEach(r => {
      const hasDate = r[2]?.trim();
      const m = r[3]?.trim();
      if (hasDate && m) map[m] = (map[m] || 0) + 1;
    });
    return Object.entries(map)
      .sort(([a], [b]) => monthOrder.indexOf(a) - monthOrder.indexOf(b))
      .map(([month, count]) => ({ month, count }));
  }, [data]);

  const kpis = useMemo(() => {
    const delivered = filteredEod.reduce((s, r) => s + (parseInt(r['Videos Delivered']) || 0), 0);
    const uniqueDays = new Set(filteredEod.map(r => r.Date)).size;
    const avg = uniqueDays > 0 ? (delivered / uniqueDays).toFixed(1) : '—';
    const activeEditors = new Set(filteredEod.map(r => r.Name).filter(Boolean)).size;
    return { delivered, approved: approvedCount, avg, activeEditors };
  }, [filteredEod, approvedCount]);

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

  const weeklyOutputAll = useMemo(() => {
    if (!data) return [];
    const editorFiltered = data.eod.filter(r => editor === '(All Editors)' || r.Name === editor);
    const map: Record<string, number> = {};
    editorFiltered.forEach(r => {
      const w = r.Week;
      if (w) map[w] = (map[w] || 0) + (parseInt(r['Videos Delivered']) || 0);
    });
    return Object.entries(map)
      .sort(([a], [b]) => parseInt(a) - parseInt(b))
      .map(([week, total]) => ({ week: `Wk ${week}`, total }));
  }, [data, editor]);

  // Editor breakdown table
  const editorBreakdown = useMemo(() => {
    if (!data) return [];
    const monthFiltered = data.eod.filter(r => r.Month?.toLowerCase() === month.toLowerCase());
    const map: Record<string, { delivered: number; days: Set<string> }> = {};
    monthFiltered.forEach(r => {
      const name = r.Name;
      if (!name) return;
      if (!map[name]) map[name] = { delivered: 0, days: new Set() };
      map[name].delivered += parseInt(r['Videos Delivered']) || 0;
      if (r.Date) map[name].days.add(r.Date);
    });
    return Object.entries(map)
      .map(([name, stats]) => ({
        name,
        delivered: stats.delivered,
        activeDays: stats.days.size,
        avg: stats.days.size > 0 ? (stats.delivered / stats.days.size).toFixed(1) : '—',
      }))
      .sort((a, b) => b.delivered - a.delivered);
  }, [data, month]);

  const noData = filteredEod.length === 0 && !loading;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#09090f]">
        <div className="fixed inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 80% 40% at 50% 0%, rgba(124,58,237,0.15) 0%, transparent 100%)' }} />
        <div className="max-w-[1200px] mx-auto px-5 md:px-8 py-8 space-y-6 relative z-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => <div key={i} className="h-[100px] rounded-2xl bg-[#111118] animate-pulse" />)}
          </div>
          <div className="h-72 rounded-2xl bg-[#111118] animate-pulse" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#09090f]">
        <div className="fixed inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 80% 40% at 50% 0%, rgba(124,58,237,0.15) 0%, transparent 100%)' }} />
        <div className="flex flex-col items-center gap-4 relative z-10">
          <div className="w-14 h-14 rounded-2xl bg-red-500/10 flex items-center justify-center" style={{ boxShadow: '0 0 0 1px rgba(248,113,113,0.2) inset' }}>
            <AlertCircle className="w-6 h-6 text-red-400" />
          </div>
          <p className="text-sm text-white/40">Failed to load performance data</p>
          <p className="text-xs text-white/20">{error}</p>
          <Button variant="outline" size="sm" onClick={() => client?.spreadsheet_id && fetchData(client.spreadsheet_id, true)}
            className="rounded-lg text-xs bg-[#111118] border-white/[0.06] text-white/60 hover:bg-white/[0.04] hover:text-white cursor-pointer">
            <RefreshCw className="w-3 h-3 mr-1.5" /> Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#09090f]">
      {/* Purple glow */}
      <div className="fixed inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse 80% 40% at 50% 0%, rgba(124,58,237,0.15) 0%, transparent 100%)',
      }} />

      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-white/[0.06]" style={{ background: 'rgba(9,9,15,0.85)', backdropFilter: 'blur(12px)' }}>
        <div className="max-w-[1200px] mx-auto px-5 md:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(isAdminView ? `/admin/clients/${adminClientId}` : '/dashboard')} className="flex items-center gap-1.5 text-xs text-white/30 hover:text-white/60 transition-all duration-200 cursor-pointer">
              <ArrowLeft className="w-3.5 h-3.5" /> Back
            </button>
            <div className="h-4 w-px bg-white/10" />
            <span className="text-sm font-medium text-white">Editor Performance</span>
            {isAdminView && client && (
              <span className="text-[10px] text-[#a855f7] uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#a855f7]/10">
                Admin · {client.brand_name}
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            {data && (
              <span className="text-[10px] text-white/20">
                Synced {new Date(data.lastSynced).toLocaleString()}
              </span>
            )}
            <button
              onClick={() => client?.spreadsheet_id && fetchData(client.spreadsheet_id, true)}
              className="h-9 px-4 rounded-lg text-sm font-medium text-white flex items-center gap-2 transition-all duration-200 cursor-pointer"
              style={{ background: 'linear-gradient(135deg, #a855f7, #7c3aed)' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = '0 0 20px rgba(168,85,247,0.4)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = 'none'; }}
            >
              <RefreshCw className="w-3.5 h-3.5" /> Sync
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-[1200px] mx-auto px-5 md:px-8 py-8 space-y-7 relative z-10">
        {/* Title + Filters */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold text-white">Editor Performance</h1>
            <p className="text-sm text-white/40 mt-1">{month} · {editor}</p>
          </div>
          <div className="flex items-center gap-2">
            <DarkSelect value={editor} onChange={setEditor} options={data?.editors || []} />
            <DarkSelect value={month} onChange={setMonth} options={data?.months || []} />
          </div>
        </div>

        {noData ? (
          <PremiumCard className="flex flex-col items-center justify-center py-20 gap-3">
            <FileBarChart className="w-10 h-10 text-white/10" />
            <p className="text-sm text-white/30">
              No data yet for <span className="text-white/60 font-medium">{editor}</span> in <span className="text-white/60 font-medium">{month}</span>
            </p>
          </PremiumCard>
        ) : (
          <>
            {/* KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
              <KpiCard label="Delivered" value={`${kpis.delivered}`} icon={<FileBarChart className="w-3.5 h-3.5" />} delay={0} />
              <KpiCard label="Approved" value={`${kpis.approved}`} icon={<CheckCircle2 className="w-3.5 h-3.5" />} delay={100} />
              <KpiCard label="Avg/Day" value={`${kpis.avg}`} icon={<TrendingUp className="w-3.5 h-3.5" />} delay={200} />
              <KpiCard label="Active Editors" value={`${kpis.activeEditors}`} icon={<Users className="w-3.5 h-3.5" />} delay={300} />
            </div>

            {/* Charts row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {/* Daily by Week */}
              <PremiumCard className="p-6">
                <h4 className="text-sm font-semibold text-white mb-0.5">Daily Deliveries by Week</h4>
                <p className="text-xs uppercase tracking-widest text-white/40 mb-4 font-medium">Grouped by weekday</p>
                <div className="h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dailyByWeek} barCategoryGap="20%">
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                      <XAxis dataKey="day" tick={{ fill: 'rgba(255,255,255,0.30)', fontSize: 11 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: 'rgba(255,255,255,0.30)', fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
                      <Tooltip content={<ChartTooltip />} />
                      <Legend wrapperStyle={{ fontSize: 10, color: 'rgba(255,255,255,0.4)' }} />
                      {weekKeys.map((wk, i) => (
                        <Bar key={wk} dataKey={wk} fill={COLORS[i % COLORS.length]} radius={[3, 3, 0, 0]} />
                      ))}
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </PremiumCard>

              {/* Weekly Output */}
              <PremiumCard className="p-6">
                <h4 className="text-sm font-semibold text-white mb-0.5">Weekly Output</h4>
                <p className="text-xs uppercase tracking-widest text-white/40 mb-4 font-medium">Total videos per week (all time)</p>
                <div className="h-56 overflow-x-auto">
                  <div style={{ minWidth: weeklyOutputAll.length > 12 ? `${weeklyOutputAll.length * 40}px` : '100%', height: '100%' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={weeklyOutputAll}>
                        <defs>
                          <linearGradient id="barGradDark" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#a855f7" stopOpacity={0.9} />
                            <stop offset="100%" stopColor="#7c3aed" stopOpacity={0.6} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                        <XAxis dataKey="week" tick={{ fill: 'rgba(255,255,255,0.30)', fontSize: 10 }} axisLine={false} tickLine={false} interval={0} angle={weeklyOutputAll.length > 15 ? -45 : 0} textAnchor={weeklyOutputAll.length > 15 ? 'end' : 'middle'} />
                        <YAxis tick={{ fill: 'rgba(255,255,255,0.30)', fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
                        <Tooltip content={<ChartTooltip />} />
                        <Bar dataKey="total" fill="url(#barGradDark)" radius={[3, 3, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </PremiumCard>
            </div>

            {/* Monthly Approved Videos */}
            <PremiumCard className="p-6">
              <h4 className="text-sm font-semibold text-white mb-0.5">Monthly Approved Videos</h4>
              <p className="text-xs uppercase tracking-widest text-white/40 mb-4 font-medium">Approved videos per month (all time overview)</p>
              {monthlyApproved.length === 0 ? (
                <div className="flex items-center justify-center h-64">
                  <p className="text-white/30 text-sm">No approval data available</p>
                </div>
              ) : (
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyApproved}>
                      <defs>
                        <linearGradient id="approvedGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#34d399" stopOpacity={0.9} />
                          <stop offset="100%" stopColor="#059669" stopOpacity={0.6} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                      <XAxis dataKey="month" tick={{ fill: 'rgba(255,255,255,0.30)', fontSize: 11 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: 'rgba(255,255,255,0.30)', fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
                      <Tooltip content={<ChartTooltip />} />
                      <Bar dataKey="count" fill="url(#approvedGrad)" radius={[4, 4, 0, 0]} name="Approved" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </PremiumCard>

            {/* Editor Breakdown Table */}
            {editorBreakdown.length > 0 && (
              <div>
                <h2 className="text-xs uppercase tracking-widest text-white/40 font-medium mb-4">Editor Breakdown</h2>
                <PremiumCard className="overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr style={{ borderTop: '1px solid rgba(168,85,247,0.2)' }}>
                          <th className="px-4 py-3 text-left text-xs uppercase tracking-widest font-medium text-white/40">Editor</th>
                          <th className="px-4 py-3 text-left text-xs uppercase tracking-widest font-medium text-white/40">Delivered</th>
                          <th className="px-4 py-3 text-left text-xs uppercase tracking-widest font-medium text-white/40">Active Days</th>
                          <th className="px-4 py-3 text-left text-xs uppercase tracking-widest font-medium text-white/40">Avg/Day</th>
                          <th className="px-4 py-3 text-left text-xs uppercase tracking-widest font-medium text-white/40">Output</th>
                        </tr>
                      </thead>
                      <tbody>
                        {editorBreakdown.map((ed) => {
                          const maxDelivered = Math.max(...editorBreakdown.map(e => e.delivered), 1);
                          const pct = (ed.delivered / maxDelivered) * 100;
                          return (
                            <tr key={ed.name} className="border-b border-white/[0.03] hover:bg-white/[0.03] transition-all duration-200">
                              <td className="px-4 py-5 text-white font-medium">{ed.name}</td>
                              <td className="px-4 py-5 font-black text-white">{ed.delivered}</td>
                              <td className="px-4 py-5 text-white/60">{ed.activeDays}</td>
                              <td className="px-4 py-5 text-white/60">{ed.avg}</td>
                              <td className="px-4 py-5 min-w-[160px]">
                                <div className="flex items-center gap-2">
                                  <div className="flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden">
                                    <div className="h-full rounded-full transition-all duration-300" style={{ width: `${pct}%`, background: '#a855f7' }} />
                                  </div>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </PremiumCard>
              </div>
            )}

            {/* Approved Videos Table */}
            {filteredPayment.length > 0 && (
              <div>
                <h2 className="text-xs uppercase tracking-widest text-white/40 font-medium mb-4">Approved Videos</h2>
                <PremiumCard className="overflow-hidden">
                  <div className="px-6 py-4 border-b border-white/[0.06]">
                    <p className="text-xs text-white/40">{filteredPayment.filter(r => r.approved).length} approved in {month}</p>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr style={{ borderTop: '1px solid rgba(168,85,247,0.2)' }}>
                          <th className="text-left py-3 px-6 text-xs uppercase tracking-widest text-white/40 font-medium">Brief Name</th>
                          <th className="text-left py-3 px-6 text-xs uppercase tracking-widest text-white/40 font-medium">Approval Date</th>
                          <th className="text-left py-3 px-6 text-xs uppercase tracking-widest text-white/40 font-medium">Month</th>
                          <th className="text-left py-3 px-6 text-xs uppercase tracking-widest text-white/40 font-medium">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredPayment.map((row, i) => (
                          <tr key={i} className="hover:bg-white/[0.03] transition-all duration-200 border-b border-white/[0.03]">
                            <td className="py-5 px-6 text-white/60">{row.brief}</td>
                            <td className="py-5 px-6 text-white/40">{row.date || '—'}</td>
                            <td className="py-5 px-6 text-white/40">{row.month}</td>
                            <td className="py-5 px-6">
                              {row.approved ? (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                                  Approved
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400">
                                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                                  Pending
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </PremiumCard>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
