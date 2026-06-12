import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
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
const COLORS = ['#1A1A1A', '#9ED8F5', '#75726B', '#3B86A8', '#C2BCAF', '#1A1A1A', '#9ED8F5', '#75726B'];

const CARD_SHADOW = 'none';
const CARD_SHADOW_HOVER = 'none';

function parseCSV<T>(text: string): T[] {
  return Papa.parse<T>(text, { header: true, skipEmptyLines: true }).data;
}
function getCurrentMonth(): string {
  return new Date().toLocaleString('en-US', { month: 'long' });
}

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-[4px] px-3 py-2 text-xs bg-white border border-[#1A1A1A] shadow-[0_8px_24px_-8px_rgba(26,26,26,0.25)]">
      <p className="text-[#75726B] text-[10px] font-mono uppercase tracking-[0.15em] mb-1">{label}</p>
      {payload.map((p: any, i: number) => (
        <div key={i} className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span className="text-[#75726B]">{p.name}:</span>
          <span className="text-[#1A1A1A] font-semibold tabular-nums">{p.value}</span>
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
        className="appearance-none h-9 px-3 pr-8 rounded-[4px] text-xs font-medium text-[#1A1A1A] cursor-pointer transition-all duration-200 focus:outline-none bg-white border border-[#E2E0D9] hover:border-[#1A1A1A]"
      >
        {options.map(o => <option key={o} value={o} className="bg-white text-[#1A1A1A]">{o}</option>)}
      </select>
      <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
        <svg width="10" height="6" viewBox="0 0 10 6" fill="none"><path d="M1 1L5 5L9 1" stroke="#1A1A1A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </div>
    </div>
  );
}

function PremiumCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`relative bg-white rounded-[4px] border border-[#E2E0D9] transition-colors duration-200 hover:border-[#1A1A1A]/40 ${className}`}>
      <span className="absolute top-0 left-0 h-px w-16 bg-[#9ED8F5]" />
      {children}
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

  useEffect(() => { loadClient(); }, []);

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
    const map: Record<string, { delivered: number; days: Set<string>; weeks: Set<string> }> = {};
    monthFiltered.forEach(r => {
      const name = r.Name;
      if (!name) return;
      if (!map[name]) map[name] = { delivered: 0, days: new Set(), weeks: new Set() };
      map[name].delivered += parseInt(r['Videos Delivered']) || 0;
      if (r.Date) map[name].days.add(r.Date);
      if (r.Week) map[name].weeks.add(r.Week);
    });
    const totalDelivered = Object.values(map).reduce((s, v) => s + v.delivered, 0) || 1;
    return Object.entries(map)
      .map(([name, stats]) => ({
        name,
        delivered: stats.delivered,
        activeDays: stats.days.size,
        weeksActive: stats.weeks.size,
        avg: stats.days.size > 0 ? (stats.delivered / stats.days.size).toFixed(1) : '—',
        sharePct: Math.round((stats.delivered / totalDelivered) * 100),
      }))
      .sort((a, b) => b.delivered - a.delivered);
  }, [data, month]);

  function initialsOf(name: string) {
    return name.split(/\s+/).filter(Boolean).slice(0, 2).map(s => s[0]?.toUpperCase()).join('');
  }

  const noData = filteredEod.length === 0 && !loading;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F6F3]">
        <div className="max-w-[1280px] mx-auto px-5 md:px-8 py-8 space-y-6 relative z-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => <div key={i} className="h-[100px] rounded-[4px] bg-[#EEEDE8] animate-pulse" />)}
          </div>
          <div className="h-72 rounded-[4px] bg-[#EEEDE8] animate-pulse" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7F6F3]">
        <div className="flex flex-col items-center gap-4 relative z-10">
          <div className="w-14 h-14 rounded-[4px] bg-destructive/10 flex items-center justify-center border border-destructive/30">
            <AlertCircle className="w-6 h-6 text-destructive" />
          </div>
          <p className="text-sm text-[#1A1A1A]">Failed to load performance data</p>
          <p className="text-xs text-[#75726B]">{error}</p>
          <Button variant="outline" size="sm" onClick={() => client?.spreadsheet_id && fetchData(client.spreadsheet_id, true)}
            className="rounded-[4px] text-xs bg-white border-[#E2E0D9] text-[#1A1A1A] hover:bg-[#F7F6F3] hover:border-[#1A1A1A] cursor-pointer">
            <RefreshCw className="w-3 h-3 mr-1.5" /> Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F6F3] text-[#1A1A1A] relative overflow-hidden">
      {/* Subtle paper grain */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.04] z-[1]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.6'/></svg>\")",
          backgroundSize: '200px 200px',
        }}
      />
      <div
        className="absolute inset-x-0 top-0 h-[420px] pointer-events-none z-[1]"
        style={{ background: 'radial-gradient(ellipse at 90% 0%, rgba(158, 216, 245, 0.28) 0%, transparent 55%)' }}
      />

      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-[#E2E0D9] bg-[#F7F6F3]/85 backdrop-blur-md">
        <div className="max-w-[1280px] mx-auto px-5 md:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/dashboard')}
              className="w-8 h-8 rounded-[4px] flex items-center justify-center hover:bg-white transition-all duration-200 cursor-pointer border border-[#E2E0D9] hover:border-[#1A1A1A]"
            >
              <ArrowLeft className="w-4 h-4 text-[#1A1A1A]" strokeWidth={1.5} />
            </button>
            <span className="text-sm font-medium text-[#1A1A1A] tracking-tight">Editor Performance</span>
          </div>
          <div className="flex items-center gap-3">
            {data && (
              <span className="text-[10px] font-mono uppercase tracking-[0.15em] text-[#75726B] hidden sm:inline">
                Synced {new Date(data.lastSynced).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            )}
            <button
              onClick={() => client?.spreadsheet_id && fetchData(client.spreadsheet_id, true)}
              className="h-9 px-4 rounded-[4px] text-sm font-medium text-[#F7F6F3] bg-[#1A1A1A] hover:bg-black flex items-center gap-2 transition-all duration-200 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" strokeWidth={1.5} /> Sync
            </button>
          </div>
        </div>
      </header>

      {/* Hero band */}
      <section className="relative z-10 max-w-[1280px] mx-auto px-5 md:px-8 pt-16 pb-10">
        <span className="eyebrow eyebrow-accent">Editor Output — {month}</span>
        <h1 className="mt-6 text-5xl md:text-6xl leading-[0.95] tracking-tight font-semibold max-w-3xl">
          Editor <em>performance</em>.
        </h1>
        <p className="mt-5 text-[15px] text-[#75726B] max-w-xl leading-relaxed">
          Daily and weekly output, approvals, and per-editor breakdown — straight from the production sheet.
        </p>
        <hr className="w-[100px] h-px bg-[#E2E0D9] border-0 mt-8" />
      </section>

      <main className="max-w-[1280px] mx-auto px-5 md:px-8 pb-16 space-y-7 relative z-10">
        {/* Filters */}
        <div className="flex justify-end items-center gap-2">
          <DarkSelect value={editor} onChange={setEditor} options={data?.editors || []} />
          <DarkSelect value={month} onChange={setMonth} options={data?.months || []} />
        </div>

        {noData ? (
          <PremiumCard className="flex flex-col items-center justify-center py-20 gap-3">
            <FileBarChart className="w-10 h-10 text-[#75726B]/50" strokeWidth={1.25} />
            <p className="text-sm text-[#75726B]">
              No data yet for <span className="text-[#1A1A1A] font-medium">{editor}</span> in <span className="text-[#1A1A1A] font-medium">{month}</span>
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
                <h4 className="text-base font-semibold text-[#1A1A1A] mb-1 tracking-tight">Daily <em>Deliveries</em> by Week</h4>
                <p className="text-[10px] font-mono uppercase tracking-[0.15em] text-[#75726B] mb-4">Grouped by weekday</p>
                <div className="h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dailyByWeek} barCategoryGap="20%">
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(26,26,26,0.06)" vertical={false} />
                      <XAxis dataKey="day" tick={{ fill: '#75726B', fontSize: 11 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: '#75726B', fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
                      <Tooltip content={<ChartTooltip />} />
                      <Legend wrapperStyle={{ fontSize: 10, color: '#75726B' }} />
                      {weekKeys.map((wk, i) => (
                        <Bar key={wk} dataKey={wk} fill={COLORS[i % COLORS.length]} radius={[2, 2, 0, 0]} />
                      ))}
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </PremiumCard>

              {/* Weekly Output */}
              <PremiumCard className="p-6">
                <h4 className="text-base font-semibold text-[#1A1A1A] mb-1 tracking-tight">Weekly <em>Output</em></h4>
                <p className="text-[10px] font-mono uppercase tracking-[0.15em] text-[#75726B] mb-4">Total videos per week (all time)</p>
                <div className="h-56 overflow-x-auto">
                  <div style={{ minWidth: weeklyOutputAll.length > 12 ? `${weeklyOutputAll.length * 40}px` : '100%', height: '100%' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={weeklyOutputAll}>
                        <defs>
                          <linearGradient id="barGradDark" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#1A1A1A" stopOpacity={1} />
                            <stop offset="100%" stopColor="#1A1A1A" stopOpacity={0.55} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(26,26,26,0.06)" vertical={false} />
                        <XAxis dataKey="week" tick={{ fill: '#75726B', fontSize: 10 }} axisLine={false} tickLine={false} interval={0} angle={weeklyOutputAll.length > 15 ? -45 : 0} textAnchor={weeklyOutputAll.length > 15 ? 'end' : 'middle'} />
                        <YAxis tick={{ fill: '#75726B', fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
                        <Tooltip content={<ChartTooltip />} />
                        <Bar dataKey="total" fill="url(#barGradDark)" radius={[2, 2, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </PremiumCard>
            </div>

            {/* Monthly Approved Videos */}
            <PremiumCard className="p-6">
              <h4 className="text-base font-semibold text-[#1A1A1A] mb-1 tracking-tight">Monthly <em>Approved</em> Videos</h4>
              <p className="text-[10px] font-mono uppercase tracking-[0.15em] text-[#75726B] mb-4">Approved videos per month (all time)</p>
              {monthlyApproved.length === 0 ? (
                <div className="flex items-center justify-center h-64">
                  <p className="text-[#75726B] text-sm">No approval data available</p>
                </div>
              ) : (
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyApproved}>
                      <defs>
                        <linearGradient id="approvedGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#9ED8F5" stopOpacity={1} />
                          <stop offset="100%" stopColor="#9ED8F5" stopOpacity={0.55} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(26,26,26,0.06)" vertical={false} />
                      <XAxis dataKey="month" tick={{ fill: '#75726B', fontSize: 11 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: '#75726B', fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
                      <Tooltip content={<ChartTooltip />} />
                      <Bar dataKey="count" fill="url(#approvedGrad)" radius={[2, 2, 0, 0]} name="Approved" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </PremiumCard>

            {/* Editor Breakdown Table */}
            {editorBreakdown.length > 0 && (
              <div>
                <div className="flex items-end justify-between gap-4 mb-4">
                  <div>
                    <span className="eyebrow">Editor Breakdown</span>
                    <p className="mt-2 text-[12px] text-[#75726B]">
                      Per-editor output for {month}. Sorted by delivered volume.
                    </p>
                  </div>
                  <div className="hidden md:flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.18em] text-[#75726B]">
                    <span className="inline-flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#3B86A8]" /> Top performer
                    </span>
                    <span className="text-[#D8D7D2]">·</span>
                    <span>{editorBreakdown.length} editors</span>
                  </div>
                </div>
                <PremiumCard className="overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm" style={{ borderCollapse: 'collapse' }}>
                      <thead>
                        <tr style={{ background: '#FAF8F3', borderBottom: '1px solid #EEEDE8' }}>
                          <th className="px-5 py-3 text-left text-[9px] font-mono uppercase tracking-[0.2em] text-[#8A8780] w-12">#</th>
                          <th className="px-5 py-3 text-left text-[9px] font-mono uppercase tracking-[0.2em] text-[#8A8780]">Editor</th>
                          <th className="px-5 py-3 text-right text-[9px] font-mono uppercase tracking-[0.2em] text-[#8A8780]">Delivered</th>
                          <th className="px-5 py-3 text-left text-[9px] font-mono uppercase tracking-[0.2em] text-[#8A8780] min-w-[180px]">Share of output</th>
                          <th className="px-5 py-3 text-right text-[9px] font-mono uppercase tracking-[0.2em] text-[#8A8780]">Avg / day</th>
                          <th className="px-5 py-3 text-right text-[9px] font-mono uppercase tracking-[0.2em] text-[#8A8780]">Active days</th>
                        </tr>
                      </thead>
                      <tbody>
                        {editorBreakdown.map((ed, i) => {
                          const isTop = i === 0;
                          const sharePct = ed.sharePct;
                          return (
                            <tr
                              key={ed.name}
                              className="border-b last:border-b-0 transition-colors duration-200"
                              style={{
                                borderColor: '#F1EFE8',
                                background: isTop
                                  ? 'linear-gradient(90deg, rgba(236,247,253,0.55) 0%, transparent 80%)'
                                  : 'transparent',
                              }}
                              onMouseEnter={e => { if (!isTop) (e.currentTarget as HTMLTableRowElement).style.background = 'rgba(158,216,245,0.05)'; }}
                              onMouseLeave={e => { if (!isTop) (e.currentTarget as HTMLTableRowElement).style.background = 'transparent'; }}
                            >
                              <td className="px-5 py-4 align-middle">
                                <span
                                  className="inline-flex items-center justify-center w-7 h-6 rounded-[4px] mono text-[10px] tabular-nums"
                                  style={
                                    isTop
                                      ? { background: 'linear-gradient(180deg, #1A1A1A 0%, #2D2D2D 100%)', color: '#9ED8F5', boxShadow: '0 0 8px rgba(158,216,245,0.25)' }
                                      : { background: '#F2F1EC', color: '#75726B' }
                                  }
                                >
                                  {String(i + 1).padStart(2, '0')}
                                </span>
                              </td>
                              <td className="px-5 py-4 align-middle">
                                <div className="flex items-center gap-3">
                                  <span
                                    className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] tracking-[0.05em] tabular-nums shrink-0"
                                    style={{
                                      background: isTop
                                        ? 'linear-gradient(135deg, #BFE3F5 0%, #ECF7FD 100%)'
                                        : 'linear-gradient(135deg, #F2F1EC 0%, #FAF8F3 100%)',
                                      color: isTop ? '#1A4A6B' : '#75726B',
                                      border: '1px solid #E5E3DC',
                                      fontFamily: "'Inter Tight', sans-serif",
                                      fontWeight: 600,
                                    }}
                                  >
                                    {initialsOf(ed.name) || '–'}
                                  </span>
                                  <div className="min-w-0">
                                    <p
                                      className="text-[14px] tracking-[-0.01em] text-[#1A1A1A] leading-tight truncate"
                                      style={{ fontFamily: "'Inter Tight', sans-serif", fontWeight: 600 }}
                                    >
                                      {ed.name}
                                    </p>
                                    {isTop && (
                                      <p className="mt-0.5 mono text-[9px] uppercase tracking-[0.2em] text-[#3B86A8]">
                                        Top performer
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </td>
                              <td
                                className="px-5 py-4 text-right tabular-nums text-[#0F0F0F]"
                                style={{ fontFamily: "'Inter Tight', sans-serif", fontWeight: 600, fontSize: '18px', letterSpacing: '-0.02em' }}
                              >
                                {ed.delivered}
                              </td>
                              <td className="px-5 py-4 align-middle">
                                <div className="flex items-center gap-3">
                                  <div className="flex-1 h-[6px] rounded-full overflow-hidden" style={{ background: '#EFEEE8' }}>
                                    <div
                                      className="h-full rounded-full transition-all duration-500"
                                      style={{
                                        width: `${sharePct}%`,
                                        background: isTop
                                          ? 'linear-gradient(90deg, #9ED8F5 0%, #3B86A8 100%)'
                                          : 'linear-gradient(90deg, #C8E9F7 0%, #6FB8E0 100%)',
                                        boxShadow: isTop ? '0 0 6px rgba(158,216,245,0.5)' : 'none',
                                      }}
                                    />
                                  </div>
                                  <span className="mono text-[11px] tabular-nums text-[#75726B] w-10 text-right">
                                    {sharePct}%
                                  </span>
                                </div>
                              </td>
                              <td className="px-5 py-4 text-right tabular-nums text-[#1A1A1A] text-[13px]">{ed.avg}</td>
                              <td className="px-5 py-4 text-right tabular-nums text-[#75726B] text-[13px]">{ed.activeDays}</td>
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
                <span className="eyebrow mb-4 inline-block">Approved Videos</span>
                <PremiumCard className="overflow-hidden">
                  <div className="px-6 py-4 border-b border-[#E2E0D9]">
                    <p className="text-[10px] font-mono uppercase tracking-[0.15em] text-[#75726B]">
                      <span className="text-[#1A1A1A] font-semibold">{filteredPayment.filter(r => r.approved).length}</span> approved in {month}
                    </p>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-[#F7F6F3]">
                          <th className="text-left py-3 px-6 text-[10px] font-mono uppercase tracking-[0.15em] text-[#75726B]">Brief Name</th>
                          <th className="text-left py-3 px-6 text-[10px] font-mono uppercase tracking-[0.15em] text-[#75726B]">Approval Date</th>
                          <th className="text-left py-3 px-6 text-[10px] font-mono uppercase tracking-[0.15em] text-[#75726B]">Month</th>
                          <th className="text-left py-3 px-6 text-[10px] font-mono uppercase tracking-[0.15em] text-[#75726B]">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredPayment.map((row, i) => (
                          <tr key={i} className="hover:bg-[#F7F6F3] transition-colors duration-200 border-b border-[#E2E0D9] last:border-b-0">
                            <td className="py-5 px-6 text-[#1A1A1A]">{row.brief}</td>
                            <td className="py-5 px-6 text-[#75726B] tabular-nums">{row.date || '—'}</td>
                            <td className="py-5 px-6 text-[#75726B]">{row.month}</td>
                            <td className="py-5 px-6">
                              {row.approved ? (
                                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[4px] text-[10px] font-mono uppercase tracking-[0.1em] bg-[#9ED8F5]/25 text-[#1A1A1A] border border-[#9ED8F5]">
                                  <span className="w-1.5 h-1.5 rounded-full bg-[#9ED8F5]" />
                                  Approved
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[4px] text-[10px] font-mono uppercase tracking-[0.1em] bg-[#F7F6F3] text-[#75726B] border border-[#E2E0D9]">
                                  <span className="w-1.5 h-1.5 rounded-full bg-[#75726B]" />
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
