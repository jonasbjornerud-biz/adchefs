import { useState, useEffect, useMemo, useCallback } from 'react';
import Papa from 'papaparse';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer
} from 'recharts';
import { RefreshCw, AlertCircle, FileBarChart, TrendingUp, Percent, Calendar } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';

const SHEET_ID = '1GU3ygb7Fx4TJJQn9gYZLBpo_ZqmpDHchEBpTy7POQH0';
const SHEETS = {
  eod: `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=EOD-Report`,
  payment: `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=Payment Tracking`,
  helpers: `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=_Helpers`,
};
const CACHE_KEY = 'adchefs_perf_cache';
const CACHE_TTL = 12 * 60 * 60 * 1000;

interface EodRow { Timestamp: string; Month: string; Week: string; Date: string; Name: string; 'Videos Delivered': string; 'Brief Names': string; Blockers: string; [k: string]: string; }
interface PaymentRow { 'Brief Name': string; 'Approval Date': string; 'Approved Month': string; [k: string]: string; }
interface CachedData { eod: EodRow[]; payment: PaymentRow[]; editors: string[]; months: string[]; lastSynced: number; }

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const COLORS = ['#3B86A8', '#3B86A8', '#75726B', '#3B86A8', '#9ED8F5', '#3B86A8', '#75726B', '#9ED8F5'];

function parseCSV<T>(text: string): T[] {
  return Papa.parse<T>(text, { header: true, skipEmptyLines: true }).data;
}

function getCurrentMonth(): string {
  return new Date().toLocaleString('en-US', { month: 'long' });
}

export default function EditorPerformance() {
  const [data, setData] = useState<CachedData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editor, setEditor] = useState('(All Editors)');
  const [month, setMonth] = useState(getCurrentMonth());

  const fetchData = useCallback(async (force = false) => {
    if (!force) {
      try {
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
          const parsed: CachedData = JSON.parse(cached);
          if (Date.now() - parsed.lastSynced < CACHE_TTL) {
            setData(parsed);
            setLoading(false);
            return;
          }
        }
      } catch {}
    }
    setLoading(true);
    setError(null);
    try {
      const [eodRes, payRes, helpRes] = await Promise.all([
        fetch(SHEETS.eod), fetch(SHEETS.payment), fetch(SHEETS.helpers),
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
      localStorage.setItem(CACHE_KEY, JSON.stringify(cached));
      setData(cached);
    } catch (err: any) {
      setError(err.message || 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

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
    const rate = delivered > 0 ? Math.round((approved / delivered) * 100) : null;
    const uniqueDays = new Set(filteredEod.map(r => r.Date)).size;
    const avg = uniqueDays > 0 ? (delivered / uniqueDays).toFixed(1) : null;
    return { delivered, approved, rate, avg };
  }, [filteredEod, filteredPayment]);

  const dailyByWeek = useMemo(() => {
    const weeks = [...new Set(filteredEod.map(r => r.Week))].sort((a, b) => parseInt(a) - parseInt(b));
    const dayMap: Record<string, Record<string, number>> = {};
    WEEKDAYS.forEach(d => { dayMap[d] = {}; });
    filteredEod.forEach(row => {
      const dayStr = row['Select the working day the report is for'] || '';
      let dow = '';
      for (const wd of WEEKDAYS) {
        if (dayStr.toLowerCase().includes(wd.toLowerCase())) { dow = wd; break; }
      }
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
    filteredEod.forEach(r => {
      const w = `Wk ${r.Week}`;
      map[w] = (map[w] || 0) + (parseInt(r['Videos Delivered']) || 0);
    });
    return Object.entries(map).sort(([a], [b]) => parseInt(a.replace('Wk ', '')) - parseInt(b.replace('Wk ', ''))).map(([week, total]) => ({ week, total }));
  }, [filteredEod]);

  const cumulative = useMemo(() => {
    if (editor === '(All Editors)') {
      const editors = [...new Set(filteredEod.map(r => r.Name))];
      const allDays = [...new Set(filteredEod.map(r => parseInt(r.Date)))].filter(d => !isNaN(d)).sort((a, b) => a - b);
      return allDays.map(day => {
        const entry: any = { day };
        editors.forEach(ed => {
          entry[ed] = filteredEod.filter(r => r.Name === ed && parseInt(r.Date) <= day)
            .reduce((s, r) => s + (parseInt(r['Videos Delivered']) || 0), 0);
        });
        return entry;
      });
    } else {
      const allDays = [...new Set(filteredEod.map(r => parseInt(r.Date)))].filter(d => !isNaN(d)).sort((a, b) => a - b);
      let cum = 0;
      return allDays.map(day => {
        cum += filteredEod.filter(r => parseInt(r.Date) === day).reduce((s, r) => s + (parseInt(r['Videos Delivered']) || 0), 0);
        return { day, total: cum };
      });
    }
  }, [filteredEod, editor]);

  const cumulativeEditors = useMemo(() => {
    if (editor !== '(All Editors)') return [];
    return [...new Set(filteredEod.map(r => r.Name))];
  }, [filteredEod, editor]);

  const noData = filteredEod.length === 0 && !loading;

  const chartTooltipStyle = {
    contentStyle: { background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10, fontSize: 12, fontFamily: "'JetBrains Mono', monospace", boxShadow: '0 4px 12px rgba(0,0,0,0.08)' },
    labelStyle: { color: '#64748b' },
    itemStyle: { color: '#334155' },
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-28 rounded-xl bg-secondary" />)}
        </div>
        <Skeleton className="h-64 rounded-xl bg-secondary" />
        <Skeleton className="h-64 rounded-xl bg-secondary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="w-14 h-14 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center">
          <AlertCircle className="w-6 h-6 text-destructive" />
        </div>
        <p className="text-sm text-muted-foreground">Failed to load performance data</p>
        <p className="text-xs font-mono text-muted-foreground">{error}</p>
        <Button variant="outline" size="sm" onClick={() => fetchData(true)}
          className="rounded-lg text-xs border-border text-muted-foreground hover:bg-secondary">
          <RefreshCw className="w-3 h-3 mr-1.5" /> Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters + Sync */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex gap-3">
          <Select value={editor} onValueChange={setEditor}>
            <SelectTrigger className="w-[180px] h-9 rounded-lg text-xs border-border bg-white text-foreground">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="rounded-lg border-border bg-white">
              {data?.editors.map(e => (
                <SelectItem key={e} value={e} className="text-xs">{e}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={month} onValueChange={setMonth}>
            <SelectTrigger className="w-[140px] h-9 rounded-lg text-xs border-border bg-white text-foreground">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="rounded-lg border-border bg-white">
              {data?.months.map(m => (
                <SelectItem key={m} value={m} className="text-xs">{m}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-3">
          {data && (
            <span className="text-[10px] font-mono text-muted-foreground">
              Last synced: {new Date(data.lastSynced).toLocaleString()}
            </span>
          )}
          <Button variant="outline" size="sm" onClick={() => fetchData(true)}
            className="rounded-lg text-[11px] h-7 px-2.5 border-border text-muted-foreground hover:bg-secondary hover:text-foreground">
            <RefreshCw className="w-3 h-3 mr-1" /> Sync now
          </Button>
        </div>
      </div>

      {noData ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3 bg-white rounded-2xl border border-border/80">
          <FileBarChart className="w-10 h-10 text-muted-foreground/40" />
          <p className="text-sm text-muted-foreground">
            No data yet for <span className="text-foreground/80 font-medium">{editor}</span> in <span className="text-foreground/80 font-medium">{month}</span>
          </p>
        </div>
      ) : (
        <>
          {/* KPI Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: FileBarChart, label: 'Total Delivered', value: kpis.delivered, color: '#3B86A8', bg: 'bg-secondary', border: 'border-border' },
              { icon: TrendingUp, label: 'Videos Approved', value: kpis.approved, color: '#3B86A8', bg: 'bg-cyan-50', border: 'border-cyan-100' },
              { icon: Percent, label: 'Approval Rate', value: kpis.rate !== null ? `${kpis.rate}%` : '—', color: '#3B86A8', bg: 'bg-secondary', border: 'border-border' },
              { icon: Calendar, label: 'Avg Videos/Day', value: kpis.avg ?? '—', color: '#75726B', bg: 'bg-amber-50', border: 'border-amber-100' },
            ].map((kpi, i) => (
              <div key={i} className="rounded-xl p-5 bg-white border border-border/80 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-2 mb-3">
                  <div className={`w-7 h-7 rounded-lg ${kpi.bg} ${kpi.border} border flex items-center justify-center`}>
                    <kpi.icon className="w-3.5 h-3.5" style={{ color: kpi.color }} />
                  </div>
                </div>
                <p className="text-2xl font-bold font-mono text-foreground" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                  {kpi.value}
                </p>
                <p className="text-[10px] uppercase tracking-widest font-medium text-muted-foreground mt-1">{kpi.label}</p>
              </div>
            ))}
          </div>

          {/* Charts row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="rounded-xl p-5 bg-white border border-border/80 shadow-sm">
              <h4 className="text-sm font-semibold text-foreground mb-0.5">Daily Deliveries by Week</h4>
              <p className="text-[10px] text-muted-foreground mb-4">Grouped by weekday, colored per week</p>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dailyByWeek} barCategoryGap="20%">
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="day" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
                    <Tooltip {...chartTooltipStyle} />
                    <Legend wrapperStyle={{ fontSize: 10, color: '#64748b' }} />
                    {weekKeys.map((wk, i) => (
                      <Bar key={wk} dataKey={wk} fill={COLORS[i % COLORS.length]} radius={[4, 4, 0, 0]} />
                    ))}
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="rounded-xl p-5 bg-white border border-border/80 shadow-sm">
              <h4 className="text-sm font-semibold text-foreground mb-0.5">Weekly Output</h4>
              <p className="text-[10px] text-muted-foreground mb-4">Total videos delivered per week</p>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyOutput}>
                    <defs>
                      <linearGradient id="barGradLight" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#3B86A8" stopOpacity={0.85} />
                        <stop offset="100%" stopColor="#a78bfa" stopOpacity={0.6} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="week" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
                    <Tooltip {...chartTooltipStyle} />
                    <Bar dataKey="total" fill="url(#barGradLight)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Cumulative chart */}
          <div className="rounded-xl p-5 bg-white border border-border/80 shadow-sm">
            <h4 className="text-sm font-semibold text-foreground mb-0.5">Cumulative Deliveries</h4>
            <p className="text-[10px] text-muted-foreground mb-4">Running total across the month</p>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={cumulative}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="day" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
                  <Tooltip {...chartTooltipStyle} />
                  <Legend wrapperStyle={{ fontSize: 10, color: '#64748b' }} />
                  {editor === '(All Editors)' ? (
                    cumulativeEditors.map((ed, i) => (
                      <Line key={ed} type="monotone" dataKey={ed} stroke={COLORS[i % COLORS.length]} strokeWidth={2} dot={false} />
                    ))
                  ) : (
                    <Line type="monotone" dataKey="total" stroke="#3B86A8" strokeWidth={2} dot={false} />
                  )}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
