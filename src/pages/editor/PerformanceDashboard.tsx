import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Client } from '@/types/playbook';
import Papa from 'papaparse';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer, AreaChart, Area, Line, ComposedChart,
} from 'recharts';
import { RefreshCw, AlertCircle, FileBarChart, TrendingUp, ArrowLeft, CheckCircle2, Sparkles, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { KpiCard } from '@/components/dashboard/KpiCard';

interface EodRow { Month: string; Week: string; Date: string; Name: string; 'Videos Delivered': string; 'Select the working day the report is for': string; [k: string]: string; }
interface PaymentRow { 'Brief Name': string; 'Approval Date': string; 'Approved Month': string; [k: string]: string; }
interface CachedData { eod: EodRow[]; payment: PaymentRow[]; editors: string[]; months: string[]; lastSynced: number; paymentRaw: string[][]; }

const CACHE_TTL = 12 * 60 * 60 * 1000;
const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
// Monochrome blue ramp derived from brand Accent (#2E6BE6) + Ink.
// Used for grouped/stacked bar series across the backend dashboards.
const BLUE_RAMP = ['#2E6BE6', '#2E6BE6', '#1A1A1A', '#8B887F', '#DDE7FA', '#2E6BE6'];

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
    <div className="glass-dropdown px-3 py-2 text-xs">
      <p className="text-[#8B887F] text-[10px] font-mono uppercase tracking-[0.15em] mb-1">{label}</p>
      {payload.map((p: any, i: number) => (
        <div key={i} className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span className="text-[#8B887F]">{p.name}:</span>
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
        className="appearance-none h-9 px-3 pr-8 rounded-[4px] text-xs font-medium text-[#1A1A1A] cursor-pointer transition-all duration-200 focus:outline-none bg-white/65 backdrop-blur-md border border-white/70 hover:border-[#2E6BE6] shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]"
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
    <div className={`relative bg-white border border-[#E5E3DC] rounded-[8px] overflow-hidden ${className}`}>{children}</div>
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

    // Admin preview path: ?clientId=<uuid> takes precedence over the user's own client.
    const params = new URLSearchParams(window.location.search);
    const overrideId = params.get('clientId');

    let clientData: any = null;
    if (overrideId) {
      const res = await supabase.from('clients').select('*').eq('id', overrideId).maybeSingle();
      clientData = res.data;
    } else {
      const res = await supabase.from('clients').select('*').eq('user_id', user.id).maybeSingle();
      clientData = res.data;
    }

    if (!clientData || !clientData.spreadsheet_id) {
      navigate(overrideId ? `/admin/clients/${overrideId}` : '/dashboard');
      return;
    }
    setClient(clientData as Client);
    fetchData(clientData.spreadsheet_id);
  }

  const fetchData = useCallback(async (sheetId: string, force = false) => {
    const cacheKey = `adchefs_perf_full_v3_${sheetId}`;
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
        // headers=0 prevents gviz from collapsing the first data row ("Founder Story") into the header block.
        fetch(`https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&headers=0&sheet=Payment Tracking`),
        fetch(`https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&sheet=_Helpers`),
      ]);
      if (!eodRes.ok || !payRes.ok || !helpRes.ok) throw new Error('Failed to fetch sheet data');
      const [eodText, payText, helpText] = await Promise.all([eodRes.text(), payRes.text(), helpRes.text()]);
      const eod = parseCSV<EodRow>(eodText);
      const payment = parseCSV<PaymentRow>(payText);
      const paymentRaw = Papa.parse(payText, { header: false, skipEmptyLines: true }).data as string[][];
      const helpers = Papa.parse(helpText, { header: false, skipEmptyLines: true }).data as string[][];

      const editorsHelpers = helpers.slice(1).map(r => r[0]?.trim()).filter(Boolean).filter(n => n !== 'undefined');
      // Payment Tracking: real rows start at sheet row 5 (index 4 after headers=0).
      const editorsPayment = paymentRaw.slice(4).map(r => r[1]?.trim()).filter(Boolean).filter(n => n !== 'undefined');
      const editors = ['(All Editors)', ...Array.from(new Set([...editorsHelpers, ...editorsPayment]))];
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
    // Column A = brief name, Column B = editor, Column C = approved month (empty if not approved)
    const rows = data.paymentRaw.slice(4).filter(r => r[0]?.trim());
    return rows.filter(r => {
      const approvedMonth = r[2]?.trim();
      return approvedMonth && approvedMonth.toLowerCase() === month.toLowerCase();
    }).length;
  }, [data, month]);

  const filteredPayment = useMemo(() => {
    if (!data?.paymentRaw) return [];
    const rows = data.paymentRaw.slice(4).filter(r => r[0]?.trim());
    return rows
      .filter(r => r[2]?.trim()?.toLowerCase() === month.toLowerCase())
      .map(r => ({
        brief: r[0]?.trim() || '',
        editor: r[1]?.trim() || '',
        month: r[2]?.trim() || '',
        approved: !!r[2]?.trim(),
      }))
      .filter(r => r.brief);
  }, [data, month]);

  const monthlyApproved = useMemo(() => {
    if (!data?.paymentRaw) return [];
    const rows = data.paymentRaw.slice(4).filter(r => r[0]?.trim());
    const monthOrder = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    const map: Record<string, number> = {};
    rows.forEach(r => {
      const m = r[2]?.trim();
      if (m) map[m] = (map[m] || 0) + 1;
    });
    return Object.entries(map)
      .sort(([a], [b]) => monthOrder.indexOf(a) - monthOrder.indexOf(b))
      .map(([month, count]) => ({ month, count }));
  }, [data]);

  const kpis = useMemo(() => {
    const delivered = filteredEod.reduce((s, r) => s + (parseInt(r['Videos Delivered']) || 0), 0);
    const uniqueDays = new Set(filteredEod.map(r => r.Date)).size;
    const avg = uniqueDays > 0 ? Number((delivered / uniqueDays).toFixed(1)) : null;
    // "First cut approval rate" replaces the dead Active Editors stat:
    // approved videos in the month / videos delivered in the month.
    const fcar = delivered > 0 ? Math.round((approvedCount / delivered) * 100) : null;
    return { delivered, approved: approvedCount, avg, fcar };
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

  // Sparkline series derived from existing aggregates (no new queries).
  const sparks = useMemo(() => {
    const monthOrder = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    const approvedSeries = monthlyApproved
      .slice()
      .sort((a, b) => monthOrder.indexOf(a.month) - monthOrder.indexOf(b.month))
      .map(m => m.count);
    const deliveredSeries = weeklyOutputAll.map(w => w.total);
    return { delivered: deliveredSeries, approved: approvedSeries, avg: deliveredSeries };
  }, [weeklyOutputAll, monthlyApproved]);

  // Per-editor leaderboard for the selected month — delivered + approval rate.
  const leaderboard = useMemo(() => {
    if (!data) return [] as Array<{ name: string; delivered: number; approved: number; approvalRate: number }>;
    const monthLower = month.toLowerCase();
    const deliveredMap: Record<string, number> = {};
    data.eod
      .filter(r => r.Month?.toLowerCase() === monthLower)
      .forEach(r => {
        const n = r.Name?.trim();
        if (!n) return;
        deliveredMap[n] = (deliveredMap[n] || 0) + (parseInt(r['Videos Delivered']) || 0);
      });
    const approvedMap: Record<string, number> = {};
    data.paymentRaw.slice(4).forEach(r => {
      const editorName = r[1]?.trim();
      const approvedMonth = r[2]?.trim();
      if (!editorName || !approvedMonth) return;
      if (approvedMonth.toLowerCase() !== monthLower) return;
      approvedMap[editorName] = (approvedMap[editorName] || 0) + 1;
    });
    return Object.entries(deliveredMap)
      .map(([name, delivered]) => {
        const approved = approvedMap[name] || 0;
        const approvalRate = delivered > 0 ? Math.round((approved / delivered) * 100) : 0;
        return { name, delivered, approved, approvalRate };
      })
      .sort((a, b) => b.delivered - a.delivered);
  }, [data, month]);

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
      <div className="min-h-screen admin-bloom">
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
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAF7]">
        <div className="flex flex-col items-center gap-4 relative z-10">
          <div className="w-14 h-14 rounded-[4px] bg-destructive/10 flex items-center justify-center border border-destructive/30">
            <AlertCircle className="w-6 h-6 text-destructive" />
          </div>
          <p className="text-sm text-[#1A1A1A]">Failed to load performance data</p>
          <p className="text-xs text-[#8B887F]">{error}</p>
          <Button variant="outline" size="sm" onClick={() => client?.spreadsheet_id && fetchData(client.spreadsheet_id, true)}
            className="rounded-[4px] text-xs bg-white border-[#E2E0D9] text-[#1A1A1A] hover:bg-[#FAFAF7] hover:border-[#1A1A1A] cursor-pointer">
            <RefreshCw className="w-3 h-3 mr-1.5" /> Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAF7] text-[#1A1A1A] relative">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/85 backdrop-blur-sm border-b border-[#E5E3DC]">
        <div className="max-w-[1280px] mx-auto px-5 md:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                const cid = new URLSearchParams(window.location.search).get('clientId');
                navigate(cid ? `/admin/clients/${cid}` : '/dashboard');
              }}
              className="w-8 h-8 rounded-[6px] flex items-center justify-center hover:bg-[#F2F1EC] transition-colors cursor-pointer border border-[#E2E0D9]"
            >
              <ArrowLeft className="w-4 h-4 text-[#1A1A1A]" strokeWidth={1.5} />
            </button>
            <span className="text-sm font-medium text-[#1A1A1A] tracking-tight">Editor Performance</span>
          </div>
          <div className="flex items-center gap-3">
            {data && (
              <span className="text-[11px] text-[#8B887F] hidden sm:inline">
                Synced {new Date(data.lastSynced).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            )}
            <button
              onClick={() => client?.spreadsheet_id && fetchData(client.spreadsheet_id, true)}
              className="h-9 px-4 rounded-[6px] text-sm font-medium text-white bg-[#1A1A1A] hover:bg-black flex items-center gap-2 transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" strokeWidth={1.5} /> Sync
            </button>
          </div>
        </div>
      </header>

      {/* Title */}
      <section className="max-w-[1280px] mx-auto px-5 md:px-8 pt-10 pb-6">
        <h1 className="text-[28px] font-semibold tracking-tight text-[#0F0F0F]" style={{ fontFamily: "'Inter Tight', sans-serif" }}>
          Editor performance
        </h1>
        <p className="mt-2 text-sm text-[#75726B]">
          Daily and weekly output, approvals, and per-editor breakdown for {month}.
        </p>
      </section>

      <main className="max-w-[1280px] mx-auto px-5 md:px-8 pb-16 space-y-6">
        {/* Filters */}
        <div className="flex justify-end items-center gap-2">
          <DarkSelect value={editor} onChange={setEditor} options={data?.editors || []} />
          <DarkSelect value={month} onChange={setMonth} options={data?.months || []} />
        </div>

        {noData ? (
          <PremiumCard className="flex flex-col items-center justify-center py-20 gap-3">
            <FileBarChart className="w-10 h-10 text-[#8B887F]/50" strokeWidth={1.25} />
            <p className="text-sm text-[#8B887F]">
              No data yet for <span className="text-[#1A1A1A] font-medium">{editor}</span> in <span className="text-[#1A1A1A] font-medium">{month}</span>
            </p>
          </PremiumCard>
        ) : (
          <>
            {/* KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
              <KpiCard label="Delivered" value={kpis.delivered ?? null} icon={<FileBarChart className="w-3.5 h-3.5" />} delay={0} spark={sparks.delivered} trend={undefined} />
              <KpiCard label="Approved" value={kpis.approved ?? null} icon={<CheckCircle2 className="w-3.5 h-3.5" />} delay={100} spark={sparks.approved} />
              <KpiCard label="Avg/Day" value={kpis.avg ?? null} icon={<TrendingUp className="w-3.5 h-3.5" />} delay={200} spark={sparks.avg} />
              <KpiCard label="First Cut Approval" value={kpis.fcar !== null ? `${kpis.fcar}%` : null} icon={<Sparkles className="w-3.5 h-3.5" />} delay={300} />
            </div>

            {/* Charts row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {/* Daily by Week */}
              <PremiumCard className="p-6">
                <h4 className="text-[15px] font-semibold text-[#1A1A1A] tracking-tight">Daily deliveries by week</h4>
                <p className="text-xs text-[#8B887F] mt-1 mb-4">Grouped by weekday</p>
                <div className="h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dailyByWeek} barCategoryGap="20%">
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(26,26,26,0.06)" vertical={false} />
                      <XAxis dataKey="day" tick={{ fill: '#8B887F', fontFamily: "'JetBrains Mono', monospace", fontSize: 11 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: '#8B887F', fontFamily: "'JetBrains Mono', monospace", fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
                      <Tooltip content={<ChartTooltip />} />
                      <Legend wrapperStyle={{ fontSize: 10, color: '#8B887F' }} />
                      {weekKeys.map((wk, i) => (
                        <Bar key={wk} dataKey={wk} fill={BLUE_RAMP[i % BLUE_RAMP.length]} radius={[4, 4, 0, 0]} />
                      ))}
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </PremiumCard>

              {/* Weekly Output */}
              <PremiumCard className="p-6">
                <h4 className="text-[15px] font-semibold text-[#1A1A1A] tracking-tight">Weekly trend</h4>
                <p className="text-xs text-[#8B887F] mt-1 mb-4">Total videos per week</p>
                <div className="h-56 overflow-x-auto">
                  <div style={{ minWidth: weeklyOutputAll.length > 12 ? `${weeklyOutputAll.length * 40}px` : '100%', height: '100%' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <ComposedChart data={weeklyOutputAll}>
                        <defs>
                          <linearGradient id="weeklyArea" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#2E6BE6" stopOpacity={0.10} />
                            <stop offset="100%" stopColor="#2E6BE6" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="2 5" stroke="rgba(26,26,26,0.06)" vertical={false} />
                        <XAxis dataKey="week" tick={{ fill: '#8B887F', fontFamily: "'JetBrains Mono', monospace", fontSize: 10 }} axisLine={false} tickLine={false} interval={0} angle={weeklyOutputAll.length > 15 ? -45 : 0} textAnchor={weeklyOutputAll.length > 15 ? 'end' : 'middle'} />
                        <YAxis tick={{ fill: '#8B887F', fontFamily: "'JetBrains Mono', monospace", fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
                        <Tooltip content={<ChartTooltip />} />
                        <Area type="monotone" dataKey="total" stroke="#2E6BE6" strokeWidth={1.5} fill="url(#weeklyArea)" name="Videos" />
                        <Line type="monotone" dataKey="total" stroke="#1A1A1A" strokeWidth={2} dot={{ fill: '#1A1A1A', stroke: '#FAFAF7', strokeWidth: 1.5, r: 3 }} activeDot={{ r: 5, stroke: '#FAFAF7', strokeWidth: 2 }} name="Videos" strokeLinecap="round" />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </PremiumCard>
            </div>

            {/* Per-editor Leaderboard — replaces the old Monthly Approved bar.
                Horizontal bars ranked by delivered, with approval rate inline. */}
            <div>
              <div className="flex items-end justify-between gap-4 mb-4">
                <div>
                  <h2 className="text-[16px] font-semibold tracking-tight text-[#0F0F0F]">Editor leaderboard</h2>
                  <p className="mt-1 text-[12px] text-[#8B887F]">Delivered volume and approval rate for {month}.</p>
                </div>
                <span className="hidden md:inline text-[11px] text-[#8B887F]">
                  {leaderboard.length} editors
                </span>
              </div>
              <PremiumCard className="p-6">
                {leaderboard.length === 0 ? (
                  <p className="text-center py-12 text-sm text-[#9A988F]">No editor data yet.</p>
                ) : (
                  <ul className="space-y-3.5">
                    {leaderboard.map((ed, i) => {
                      const max = Math.max(...leaderboard.map(e => e.delivered), 1);
                      const pct = (ed.delivered / max) * 100;
                      return (
                        <li key={ed.name} className="grid grid-cols-[24px_minmax(140px,1.4fr)_minmax(0,3fr)_auto] items-center gap-3 md:gap-5">
                          <span className="text-[12px] tabular-nums text-[#8A8780]">{i + 1}</span>
                          <span className="text-[13px] font-medium text-[#1A1A1A] truncate">
                            {ed.name}
                          </span>
                          <div className="h-[6px] rounded-full overflow-hidden bg-[#F0EEE7]">
                            <div className="h-full rounded-full bg-[#2E6BE6] transition-all duration-500" style={{ width: `${pct}%` }} />
                          </div>
                          <div className="flex items-center gap-4 justify-end min-w-[130px]">
                            <span className="tabular-nums text-[14px] font-semibold text-[#0F0F0F]">{ed.delivered}</span>
                            <span className="text-[11px] tabular-nums text-[#75726B] w-[70px] text-right">{ed.approvalRate}% appr.</span>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </PremiumCard>
            </div>

            {/* Editor Breakdown Table */}
            {editorBreakdown.length > 0 && (
              <div>
                <div className="flex items-end justify-between gap-4 mb-4">
                  <div>
                    <h2 className="text-[16px] font-semibold tracking-tight text-[#0F0F0F]">Editor breakdown</h2>
                    <p className="mt-1 text-[12px] text-[#8B887F]">Per-editor output for {month}. Sorted by delivered volume.</p>
                  </div>
                  <span className="hidden md:inline text-[11px] text-[#8B887F]">{editorBreakdown.length} editors</span>
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
                                      ? { background: 'linear-gradient(180deg, #1A1A1A 0%, #2D2D2D 100%)', color: '#2E6BE6', boxShadow: '0 0 8px rgba(158,216,245,0.25)' }
                                      : { background: '#F2F1EC', color: '#8B887F' }
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
                                      color: isTop ? '#1A4A6B' : '#8B887F',
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
                                      <p className="mt-0.5 mono text-[9px] uppercase tracking-[0.2em] text-[#2E6BE6]">
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
                                          ? 'linear-gradient(90deg, #2E6BE6 0%, #2E6BE6 100%)'
                                          : 'linear-gradient(90deg, #C8E9F7 0%, #6FB8E0 100%)',
                                        boxShadow: isTop ? '0 0 6px rgba(158,216,245,0.5)' : 'none',
                                      }}
                                    />
                                  </div>
                                  <span className="mono text-[11px] tabular-nums text-[#8B887F] w-10 text-right">
                                    {sharePct}%
                                  </span>
                                </div>
                              </td>
                              <td className="px-5 py-4 text-right tabular-nums text-[#1A1A1A] text-[13px]">{ed.avg}</td>
                              <td className="px-5 py-4 text-right tabular-nums text-[#8B887F] text-[13px]">{ed.activeDays}</td>
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
                <h2 className="text-[16px] font-semibold tracking-tight text-[#0F0F0F] mb-4">Approved videos</h2>
                <PremiumCard className="overflow-hidden">
                  <div className="px-6 py-4 border-b border-[#E2E0D9]">
                    <p className="text-xs text-[#75726B]"><span className="text-[#1A1A1A] font-semibold">{filteredPayment.filter(r => r.approved).length}</span> approved in {month}</p>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-[#FAFAF7]">
                          <th className="text-left py-3 px-6 text-[10px] font-mono uppercase tracking-[0.15em] text-[#8B887F]">Brief Name</th>
                          <th className="text-left py-3 px-6 text-[10px] font-mono uppercase tracking-[0.15em] text-[#8B887F]">Editor</th>
                          <th className="text-left py-3 px-6 text-[10px] font-mono uppercase tracking-[0.15em] text-[#8B887F]">Month</th>
                          <th className="text-left py-3 px-6 text-[10px] font-mono uppercase tracking-[0.15em] text-[#8B887F]">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredPayment.map((row, i) => (
                          <tr key={i} className="hover:bg-[#FAFAF7] transition-colors duration-200 border-b border-[#E2E0D9] last:border-b-0">
                            <td className="py-5 px-6 text-[#1A1A1A]">{row.brief}</td>
                            <td className="py-5 px-6 text-[#8B887F]">{row.editor || '—'}</td>
                            <td className="py-5 px-6 text-[#8B887F]">{row.month}</td>
                            <td className="py-5 px-6">
                              {row.approved ? (
                                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[4px] text-[10px] font-mono uppercase tracking-[0.1em] bg-[#2E6BE6]/25 text-[#1A1A1A] border border-[#2E6BE6]">
                                  <span className="w-1.5 h-1.5 rounded-full bg-[#2E6BE6]" />
                                  Approved
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[4px] text-[10px] font-mono uppercase tracking-[0.1em] bg-[#FAFAF7] text-[#8B887F] border border-[#E2E0D9]">
                                  <span className="w-1.5 h-1.5 rounded-full bg-[#8B887F]" />
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
