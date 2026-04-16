import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Client } from '@/types/playbook';
import Papa from 'papaparse';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer,
} from 'recharts';
import {
  RefreshCw, AlertCircle, FileBarChart, TrendingUp, CheckCircle2, Users,
} from 'lucide-react';
import { MetricCard } from '@/components/dash/MetricCard';
import { GlassCard } from '@/components/dash/GlassCard';
import { EmptyState } from '@/components/dash/EmptyState';
import { PageHeader } from '@/components/dash/PageHeader';
import { PrimaryButton } from '@/components/dash/PrimaryButton';
import { StatusPill } from '@/components/dash/StatusPill';

interface EodRow { Month: string; Week: string; Date: string; Name: string; 'Videos Delivered': string; 'Select the working day the report is for': string; [k: string]: string; }
interface PaymentRow { 'Brief Name': string; 'Approval Date': string; 'Approved Month': string; [k: string]: string; }
interface CachedData { eod: EodRow[]; payment: PaymentRow[]; editors: string[]; months: string[]; lastSynced: number; paymentRaw: string[][]; }

const CACHE_TTL = 12 * 60 * 60 * 1000;
const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const COLORS = ['#A855F7', '#06B6D4', '#FBBF24', '#34D399', '#EC4899', '#3B82F6', '#F87171', '#C084FC'];

function parseCSV<T>(text: string): T[] {
  return Papa.parse<T>(text, { header: true, skipEmptyLines: true }).data;
}
function getCurrentMonth(): string {
  return new Date().toLocaleString('en-US', { month: 'long' });
}

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg px-3 py-2" style={{ background: 'var(--dash-bg-elevated)', border: '1px solid var(--dash-border-default)', borderLeft: '3px solid var(--dash-accent)', boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }}>
      <p className="text-[11px] mb-1 dash-font-label">{label}</p>
      {payload.map((p: any, i: number) => (
        <div key={i} className="flex items-center gap-2 text-xs">
          <div className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span style={{ color: 'var(--dash-text-secondary)' }}>{p.name}:</span>
          <span className="dash-font-mono font-semibold" style={{ color: 'var(--dash-text-primary)' }}>{p.value}</span>
        </div>
      ))}
    </div>
  );
}

function GlassSelect({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="appearance-none h-9 px-3 pr-8 rounded-lg text-xs font-semibold cursor-pointer focus:outline-none transition-all duration-200 backdrop-blur-md"
        style={{
          background: 'var(--dash-bg-glass)',
          color: 'var(--dash-text-secondary)',
          border: '1px solid var(--dash-border-subtle)',
        }}
      >
        {options.map(o => <option key={o} value={o} style={{ background: '#12121A', color: '#FAFAFA' }}>{o}</option>)}
      </select>
      <svg className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" width="10" height="6" viewBox="0 0 10 6" fill="none">
        <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--dash-text-tertiary)' }} />
      </svg>
    </div>
  );
}

function initials(name: string) {
  return name.split(/\s+/).map(p => p[0]).slice(0, 2).join('').toUpperCase();
}

export default function PerformanceDashboard() {
  const navigate = useNavigate();
  const { clientId: adminClientId } = useParams<{ clientId?: string }>();
  const isAdminView = !!adminClientId;
  const [client, setClient] = useState<Client | null>(null);
  const [data, setData] = useState<CachedData | null>(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
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
    if (force) setSyncing(true); else setLoading(true);
    setError(null);
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
    } catch (err: any) {
      setError(err.message || 'Unknown error');
    } finally {
      setLoading(false);
      setSyncing(false);
    }
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
      .map(r => ({ brief: r[1]?.trim() || '', date: r[2]?.trim() || '', month: r[3]?.trim() || '', approved: !!r[2]?.trim() }))
      .filter(r => r.brief);
  }, [data, month]);

  const monthlyApproved = useMemo(() => {
    if (!data?.paymentRaw) return [];
    const rows = data.paymentRaw.slice(1).filter(r => r[1]?.trim());
    const order = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    const map: Record<string, number> = {};
    rows.forEach(r => {
      const hasDate = r[2]?.trim();
      const m = r[3]?.trim();
      if (hasDate && m) map[m] = (map[m] || 0) + 1;
    });
    return Object.entries(map)
      .sort(([a], [b]) => order.indexOf(a) - order.indexOf(b))
      .map(([month, count]) => ({ month, count }));
  }, [data]);

  const kpis = useMemo(() => {
    const delivered = filteredEod.reduce((s, r) => s + (parseInt(r['Videos Delivered']) || 0), 0);
    const uniqueDays = new Set(filteredEod.map(r => r.Date)).size;
    const avg = uniqueDays > 0 ? delivered / uniqueDays : 0;
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
      <div className="dash-bg">
        <div className="max-w-[1280px] mx-auto px-5 md:px-8 py-8 space-y-6 relative z-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => <div key={i} className="h-[140px] rounded-[12px] animate-pulse" style={{ background: 'var(--dash-bg-surface)' }} />)}
          </div>
          <div className="h-72 rounded-[12px] animate-pulse" style={{ background: 'var(--dash-bg-surface)' }} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dash-bg flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 relative z-10">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'rgba(239,68,68,0.12)' }}>
            <AlertCircle className="w-5 h-5" style={{ color: 'var(--dash-danger)' }} />
          </div>
          <p className="text-sm dash-font-body" style={{ color: 'var(--dash-text-secondary)' }}>Failed to load performance data</p>
          <p className="text-xs dash-font-mono" style={{ color: 'var(--dash-text-tertiary)' }}>{error}</p>
          <PrimaryButton onClick={() => client?.spreadsheet_id && fetchData(client.spreadsheet_id, true)}>
            <RefreshCw className="w-3.5 h-3.5" /> Retry
          </PrimaryButton>
        </div>
      </div>
    );
  }

  return (
    <div className="dash-bg">
      <PageHeader
        backTo={isAdminView ? `/admin/clients/${adminClientId}` : '/dashboard'}
        crumbs={[{ label: 'Editor Performance' }]}
        badge={isAdminView && client ? { label: `Admin · ${client.brand_name}` } : undefined}
        rightSlot={
          <>
            {data && (
              <span className="text-[11px] mr-1 dash-font-body hidden md:inline" style={{ color: 'var(--dash-text-tertiary)' }}>
                Synced {new Date(data.lastSynced).toLocaleString()}
              </span>
            )}
            <PrimaryButton onClick={() => client?.spreadsheet_id && fetchData(client.spreadsheet_id, true)} loading={syncing}>
              {!syncing && <RefreshCw className="w-3.5 h-3.5" />} Sync
            </PrimaryButton>
          </>
        }
      />

      <main className="max-w-[1280px] mx-auto px-5 md:px-8 py-8 space-y-7 relative z-10">
        {/* Title row */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h1 className="dash-font-display" style={{ fontSize: 40, color: 'var(--dash-text-primary)' }}>
              Editor Performance
            </h1>
            <p className="text-[13px] mt-2 dash-font-body" style={{ color: 'var(--dash-text-tertiary)' }}>
              {month} · {editor}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <GlassSelect value={editor} onChange={setEditor} options={data?.editors || []} />
            <GlassSelect value={month} onChange={setMonth} options={data?.months || []} />
          </div>
        </div>

        {noData ? (
          <GlassCard hover={false} className="p-2">
            <EmptyState icon={FileBarChart} title={`No data yet for ${editor} in ${month}`} description="Try a different editor or month." />
          </GlassCard>
        ) : (
          <>
            {/* KPIs */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
              <MetricCard label="Delivered"      numericValue={kpis.delivered}     icon={<FileBarChart className="w-3.5 h-3.5" />}  delay={0}   />
              <MetricCard label="Approved"       numericValue={kpis.approved}      icon={<CheckCircle2 className="w-3.5 h-3.5" />} delay={60}  />
              <MetricCard label="Avg/Day"        numericValue={kpis.avg} decimals={1} icon={<TrendingUp className="w-3.5 h-3.5" />} delay={120} />
              <MetricCard label="Active Editors" numericValue={kpis.activeEditors} icon={<Users className="w-3.5 h-3.5" />}        delay={180} />
            </div>

            {/* Two charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <GlassCard className="p-6" hover={false}>
                <h4 className="dash-font-display font-bold text-base" style={{ color: 'var(--dash-text-primary)' }}>Daily Deliveries by Week</h4>
                <p className="dash-font-label mt-1 mb-4">Grouped by weekday</p>
                <div className="h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dailyByWeek} barCategoryGap="20%">
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                      <XAxis dataKey="day" tick={{ fill: 'var(--dash-text-tertiary)', fontSize: 11, fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: 'var(--dash-text-tertiary)', fontSize: 11, fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} allowDecimals={false} />
                      <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(168,85,247,0.05)' }} />
                      <Legend wrapperStyle={{ fontSize: 10 }} />
                      {weekKeys.map((wk, i) => (
                        <Bar key={wk} dataKey={wk} fill={COLORS[i % COLORS.length]} radius={[4, 4, 0, 0]} />
                      ))}
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </GlassCard>

              <GlassCard className="p-6" hover={false}>
                <h4 className="dash-font-display font-bold text-base" style={{ color: 'var(--dash-text-primary)' }}>Weekly Output</h4>
                <p className="dash-font-label mt-1 mb-4">Total videos per week (all time)</p>
                <div className="h-56 overflow-x-auto">
                  <div style={{ minWidth: weeklyOutputAll.length > 12 ? `${weeklyOutputAll.length * 40}px` : '100%', height: '100%' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={weeklyOutputAll}>
                        <defs>
                          <linearGradient id="barGradPurple" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#A855F7" stopOpacity={1} />
                            <stop offset="100%" stopColor="#6D28D9" stopOpacity={0.6} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                        <XAxis dataKey="week" tick={{ fill: 'var(--dash-text-tertiary)', fontSize: 10, fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} interval={0} angle={weeklyOutputAll.length > 15 ? -45 : 0} textAnchor={weeklyOutputAll.length > 15 ? 'end' : 'middle'} />
                        <YAxis tick={{ fill: 'var(--dash-text-tertiary)', fontSize: 11, fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} allowDecimals={false} />
                        <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(168,85,247,0.05)' }} />
                        <Bar dataKey="total" fill="url(#barGradPurple)" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </GlassCard>
            </div>

            {/* Monthly approved */}
            <GlassCard className="p-6" hover={false}>
              <h4 className="dash-font-display font-bold text-base" style={{ color: 'var(--dash-text-primary)' }}>Monthly Approved Videos</h4>
              <p className="dash-font-label mt-1 mb-4">Approved videos per month (all time)</p>
              {monthlyApproved.length === 0 ? (
                <EmptyState icon={CheckCircle2} title="No approval data yet" description="Deliveries will appear here once approved by clients." />
              ) : (
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyApproved}>
                      <defs>
                        <linearGradient id="approvedGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#10B981" stopOpacity={1} />
                          <stop offset="100%" stopColor="#059669" stopOpacity={0.6} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                      <XAxis dataKey="month" tick={{ fill: 'var(--dash-text-tertiary)', fontSize: 11, fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: 'var(--dash-text-tertiary)', fontSize: 11, fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} allowDecimals={false} />
                      <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(16,185,129,0.05)' }} />
                      <Bar dataKey="count" fill="url(#approvedGrad)" radius={[4, 4, 0, 0]} name="Approved" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </GlassCard>

            {/* Editor Breakdown */}
            {editorBreakdown.length > 0 && (
              <div>
                <h2 className="dash-font-label mb-4">Editor Breakdown</h2>
                <GlassCard hover={false} className="overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr style={{ borderBottom: '1px solid var(--dash-border-subtle)' }}>
                          {['Editor', 'Delivered', 'Active Days', 'Avg/Day', 'Output'].map(h => (
                            <th key={h} className="px-5 py-3 text-left dash-font-label">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {editorBreakdown.map((ed) => {
                          const maxDelivered = Math.max(...editorBreakdown.map(e => e.delivered), 1);
                          const pct = (ed.delivered / maxDelivered) * 100;
                          return (
                            <tr key={ed.name} className="transition-colors duration-150 hover:bg-white/[0.02]" style={{ borderBottom: '1px solid var(--dash-border-subtle)' }}>
                              <td className="px-5 py-3.5">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold" style={{ background: 'var(--dash-accent-subtle)', color: 'var(--dash-accent-glow)' }}>
                                    {initials(ed.name)}
                                  </div>
                                  <span className="font-semibold dash-font-body" style={{ color: 'var(--dash-text-primary)' }}>{ed.name}</span>
                                </div>
                              </td>
                              <td className="px-5 py-3.5 dash-font-mono font-bold" style={{ color: 'var(--dash-text-primary)' }}>{ed.delivered}</td>
                              <td className="px-5 py-3.5 dash-font-mono" style={{ color: 'var(--dash-text-secondary)' }}>{ed.activeDays}</td>
                              <td className="px-5 py-3.5 dash-font-mono" style={{ color: 'var(--dash-text-secondary)' }}>{ed.avg}</td>
                              <td className="px-5 py-3.5 min-w-[180px]">
                                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--dash-border-subtle)' }}>
                                  <div
                                    className="h-full rounded-full transition-all duration-500"
                                    style={{ width: `${pct}%`, background: 'linear-gradient(90deg, #6D28D9, #A855F7)' }}
                                  />
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </GlassCard>
              </div>
            )}

            {/* Approved Videos */}
            {filteredPayment.length > 0 && (
              <div>
                <h2 className="dash-font-label mb-4">Approved Videos</h2>
                <GlassCard hover={false} className="overflow-hidden">
                  <div className="px-5 py-3 border-b" style={{ borderColor: 'var(--dash-border-subtle)' }}>
                    <p className="text-xs dash-font-body" style={{ color: 'var(--dash-text-tertiary)' }}>
                      <span className="dash-font-mono" style={{ color: 'var(--dash-text-primary)' }}>{filteredPayment.filter(r => r.approved).length}</span> approved in {month}
                    </p>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr style={{ borderBottom: '1px solid var(--dash-border-subtle)' }}>
                          {['Brief Name', 'Approval Date', 'Month', 'Status'].map(h => (
                            <th key={h} className="px-5 py-3 text-left dash-font-label">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {filteredPayment.map((row, i) => (
                          <tr key={i} className="transition-colors duration-150 hover:bg-white/[0.02]" style={{ borderBottom: '1px solid var(--dash-border-subtle)' }}>
                            <td className="px-5 py-3.5 dash-font-body" style={{ color: 'var(--dash-text-primary)' }}>{row.brief}</td>
                            <td className="px-5 py-3.5 dash-font-mono" style={{ color: 'var(--dash-text-secondary)' }}>{row.date || '—'}</td>
                            <td className="px-5 py-3.5 dash-font-body" style={{ color: 'var(--dash-text-secondary)' }}>{row.month}</td>
                            <td className="px-5 py-3.5">
                              <StatusPill variant={row.approved ? 'success' : 'warning'} dot>
                                {row.approved ? 'Approved' : 'Pending'}
                              </StatusPill>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </GlassCard>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
