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
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
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
const COLORS = ['#a855f7', '#06b6d4', '#f59e0b', '#22c55e', '#ec4899', '#3b82f6', '#ef4444', '#8b5cf6'];

function parseCSV<T>(text: string): T[] {
  const result = Papa.parse<T>(text, { header: true, skipEmptyLines: true });
  return result.data;
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

  // Chart 1: Daily Deliveries by Week
  const dailyByWeek = useMemo(() => {
    const weeks = [...new Set(filteredEod.map(r => r.Week))].sort((a, b) => parseInt(a) - parseInt(b));
    // Map each row to a day-of-week — we infer from Date + Month
    const dayMap: Record<string, Record<string, number>> = {};
    WEEKDAYS.forEach(d => { dayMap[d] = {}; });

    filteredEod.forEach(row => {
      const dayStr = row['Select the working day the report is for'] || '';
      // Try to extract day-of-week from the "Select..." column
      let dow = '';
      for (const wd of WEEKDAYS) {
        if (dayStr.toLowerCase().includes(wd.toLowerCase())) { dow = wd; break; }
      }
      if (!dow) {
        // Fallback: compute from Date + Month
        const dateNum = parseInt(row.Date);
        const monthIdx = new Date(`${row.Month} 1, 2025`).getMonth();
        if (!isNaN(dateNum) && !isNaN(monthIdx)) {
          const d = new Date(2025, monthIdx, dateNum);
          const dayIdx = d.getDay(); // 0=Sun
          const mapped = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][dayIdx];
          if (WEEKDAYS.includes(mapped)) dow = mapped;
        }
      }
      if (!dow) return;
      const wk = row.Week;
      dayMap[dow][wk] = (dayMap[dow][wk] || 0) + (parseInt(row['Videos Delivered']) || 0);
    });

    return WEEKDAYS.map(day => {
      const entry: any = { day };
      weeks.forEach(w => { entry[`Wk ${w}`] = dayMap[day]?.[w] || 0; });
      return entry;
    });
  }, [filteredEod]);

  const weekKeys = useMemo(() => {
    const weeks = [...new Set(filteredEod.map(r => r.Week))].sort((a, b) => parseInt(a) - parseInt(b));
    return weeks.map(w => `Wk ${w}`);
  }, [filteredEod]);

  // Chart 2: Weekly Output
  const weeklyOutput = useMemo(() => {
    const map: Record<string, number> = {};
    filteredEod.forEach(r => {
      const w = `Wk ${r.Week}`;
      map[w] = (map[w] || 0) + (parseInt(r['Videos Delivered']) || 0);
    });
    return Object.entries(map).sort(([a], [b]) => parseInt(a.replace('Wk ', '')) - parseInt(b.replace('Wk ', ''))).map(([week, total]) => ({ week, total }));
  }, [filteredEod]);

  // Chart 3: Cumulative Deliveries
  const cumulative = useMemo(() => {
    if (editor === '(All Editors)') {
      // One line per editor
      const editors = [...new Set(filteredEod.map(r => r.Name))];
      const allDays = [...new Set(filteredEod.map(r => parseInt(r.Date)))].filter(d => !isNaN(d)).sort((a, b) => a - b);
      return allDays.map(day => {
        const entry: any = { day };
        editors.forEach(ed => {
          const prev = allDays.indexOf(day) > 0 ? allDays[allDays.indexOf(day) - 1] : null;
          // Sum up to this day
          entry[ed] = filteredEod
            .filter(r => r.Name === ed && parseInt(r.Date) <= day)
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

  const [sortCol, setSortCol] = useState<string>('Brief Name');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const sortedPayment = useMemo(() => {
    return [...filteredPayment].sort((a, b) => {
      const va = (a as any)[sortCol] || '';
      const vb = (b as any)[sortCol] || '';
      return sortDir === 'asc' ? va.localeCompare(vb) : vb.localeCompare(va);
    });
  }, [filteredPayment, sortCol, sortDir]);

  const toggleSort = (col: string) => {
    if (sortCol === col) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortCol(col); setSortDir('asc'); }
  };

  const noData = filteredEod.length === 0 && !loading;

  const chartTooltipStyle = {
    contentStyle: { background: 'rgba(15,15,25,0.95)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, fontSize: 12, fontFamily: "'JetBrains Mono', monospace" },
    labelStyle: { color: '#a0a0b8' },
    itemStyle: { color: '#e4e4ed' },
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-28 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)' }} />)}
        </div>
        <Skeleton className="h-64 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)' }} />
        <Skeleton className="h-64 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)' }} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.15)' }}>
          <AlertCircle className="w-6 h-6 text-red-400" />
        </div>
        <p className="text-sm" style={{ color: '#8b8b9e' }}>Failed to load performance data</p>
        <p className="text-xs font-mono" style={{ color: '#4a4a5c' }}>{error}</p>
        <Button variant="outline" size="sm" onClick={() => fetchData(true)}
          className="rounded-lg text-xs border-white/[0.08] bg-white/[0.03] text-[#a0a0b8] hover:bg-white/[0.06] hover:text-white">
          <RefreshCw className="w-3 h-3 mr-1.5" /> Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Filters + Sync */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex gap-3">
          <Select value={editor} onValueChange={setEditor}>
            <SelectTrigger className="w-[180px] h-9 rounded-lg text-xs border-white/[0.08] bg-white/[0.03] text-[#e4e4ed]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="rounded-lg border-white/[0.08] bg-[#14141f]">
              {data?.editors.map(e => (
                <SelectItem key={e} value={e} className="text-xs text-[#e4e4ed] focus:bg-white/[0.06]">{e}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={month} onValueChange={setMonth}>
            <SelectTrigger className="w-[140px] h-9 rounded-lg text-xs border-white/[0.08] bg-white/[0.03] text-[#e4e4ed]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="rounded-lg border-white/[0.08] bg-[#14141f]">
              {data?.months.map(m => (
                <SelectItem key={m} value={m} className="text-xs text-[#e4e4ed] focus:bg-white/[0.06]">{m}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-3">
          {data && (
            <span className="text-[10px] font-mono" style={{ color: '#4a4a5c' }}>
              Last synced: {new Date(data.lastSynced).toLocaleString()}
            </span>
          )}
          <Button variant="outline" size="sm" onClick={() => fetchData(true)}
            className="rounded-lg text-[11px] h-7 px-2.5 border-white/[0.08] bg-white/[0.03] text-[#a0a0b8] hover:bg-white/[0.06] hover:text-white">
            <RefreshCw className="w-3 h-3 mr-1" /> Sync now
          </Button>
        </div>
      </div>

      {noData ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <FileBarChart className="w-10 h-10" style={{ color: '#2a2a3c' }} />
          <p className="text-sm" style={{ color: '#6b6b80' }}>
            No data yet for <span className="text-[#a0a0b8] font-medium">{editor}</span> in <span className="text-[#a0a0b8] font-medium">{month}</span>
          </p>
        </div>
      ) : (
        <>
          {/* KPI Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: FileBarChart, label: 'Total Delivered', value: kpis.delivered, color: '#a855f7' },
              { icon: TrendingUp, label: 'Videos Approved', value: kpis.approved, color: '#06b6d4' },
              { icon: Percent, label: 'Approval Rate', value: kpis.rate !== null ? `${kpis.rate}%` : '—', color: '#22c55e' },
              { icon: Calendar, label: 'Avg Videos/Day', value: kpis.avg ?? '—', color: '#f59e0b' },
            ].map((kpi, i) => (
              <div key={i} className="rounded-xl p-5 transition-all duration-200 hover:border-white/[0.1]"
                style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="flex items-center gap-2 mb-3">
                  <kpi.icon className="w-3.5 h-3.5" style={{ color: kpi.color }} />
                  <span className="text-[10px] uppercase tracking-widest font-medium" style={{ color: '#6b6b80' }}>{kpi.label}</span>
                </div>
                <p className="text-2xl font-bold font-mono text-white" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                  {kpi.value}
                </p>
              </div>
            ))}
          </div>

          {/* Charts row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Chart 1: Daily Deliveries by Week */}
            <div className="rounded-xl p-5" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <h4 className="text-sm font-semibold text-white mb-1">Daily Deliveries by Week</h4>
              <p className="text-[10px] mb-4" style={{ color: '#6b6b80' }}>Grouped by weekday, colored per week</p>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dailyByWeek} barCategoryGap="20%">
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                    <XAxis dataKey="day" tick={{ fill: '#6b6b80', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: '#6b6b80', fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
                    <Tooltip {...chartTooltipStyle} />
                    <Legend wrapperStyle={{ fontSize: 10, color: '#8b8b9e' }} />
                    {weekKeys.map((wk, i) => (
                      <Bar key={wk} dataKey={wk} fill={COLORS[i % COLORS.length]} radius={[3, 3, 0, 0]} />
                    ))}
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 2: Weekly Output */}
            <div className="rounded-xl p-5" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <h4 className="text-sm font-semibold text-white mb-1">Weekly Output</h4>
              <p className="text-[10px] mb-4" style={{ color: '#6b6b80' }}>Total videos delivered per week</p>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyOutput}>
                    <defs>
                      <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#a855f7" stopOpacity={0.9} />
                        <stop offset="100%" stopColor="#06b6d4" stopOpacity={0.7} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                    <XAxis dataKey="week" tick={{ fill: '#6b6b80', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: '#6b6b80', fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
                    <Tooltip {...chartTooltipStyle} />
                    <Bar dataKey="total" fill="url(#barGrad)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Chart 3: Cumulative Deliveries (full width) */}
          <div className="rounded-xl p-5" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <h4 className="text-sm font-semibold text-white mb-1">Cumulative Deliveries</h4>
            <p className="text-[10px] mb-4" style={{ color: '#6b6b80' }}>Running total across the month</p>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={cumulative}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <XAxis dataKey="day" tick={{ fill: '#6b6b80', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#6b6b80', fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
                  <Tooltip {...chartTooltipStyle} />
                  <Legend wrapperStyle={{ fontSize: 10, color: '#8b8b9e' }} />
                  {editor === '(All Editors)' ? (
                    cumulativeEditors.map((ed, i) => (
                      <Line key={ed} type="monotone" dataKey={ed} stroke={COLORS[i % COLORS.length]} strokeWidth={2} dot={false} />
                    ))
                  ) : (
                    <Line type="monotone" dataKey="total" stroke="#a855f7" strokeWidth={2} dot={false} />
                  )}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Payment Status Table */}
          <div className="rounded-xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="p-5 pb-3">
              <h4 className="text-sm font-semibold text-white mb-0.5">Payment Status</h4>
              <p className="text-[10px]" style={{ color: '#6b6b80' }}>Approval tracking for {month}</p>
            </div>
            <Table>
              <TableHeader>
                <TableRow className="border-white/[0.06] hover:bg-transparent">
                  {['Brief Name', 'Approval Date', 'Approved Month', 'Status'].map(col => (
                    <TableHead key={col}
                      className="text-[10px] uppercase tracking-widest font-medium cursor-pointer select-none hover:text-white transition-colors"
                      style={{ color: '#6b6b80' }}
                      onClick={() => col !== 'Status' && toggleSort(col)}>
                      {col} {sortCol === col ? (sortDir === 'asc' ? '↑' : '↓') : ''}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedPayment.length === 0 ? (
                  <TableRow className="border-white/[0.06]">
                    <TableCell colSpan={4} className="text-center py-8" style={{ color: '#4a4a5c' }}>
                      No payment data for {month}
                    </TableCell>
                  </TableRow>
                ) : sortedPayment.map((row, i) => (
                  <TableRow key={i} className="border-white/[0.06] hover:bg-white/[0.02]">
                    <TableCell className="text-xs text-[#e4e4ed] font-medium">{row['Brief Name']}</TableCell>
                    <TableCell className="text-xs font-mono" style={{ color: '#8b8b9e' }}>{row['Approval Date'] || '—'}</TableCell>
                    <TableCell className="text-xs" style={{ color: '#8b8b9e' }}>{row['Approved Month']}</TableCell>
                    <TableCell>
                      {row['Approval Date']?.trim() ? (
                        <Badge className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/15">
                          Approved
                        </Badge>
                      ) : (
                        <Badge className="text-[10px] px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-400 border-amber-500/20 hover:bg-amber-500/15">
                          Pending
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              {sortedPayment.length > 0 && (
                <TableFooter className="bg-white/[0.02] border-white/[0.06]">
                  <TableRow className="border-white/[0.06]">
                    <TableCell className="text-xs font-semibold text-[#a0a0b8]">Total Approved</TableCell>
                    <TableCell colSpan={3} className="text-xs font-bold font-mono text-white" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                      {filteredPayment.filter(r => r['Approval Date']?.trim()).length}
                    </TableCell>
                  </TableRow>
                </TableFooter>
              )}
            </Table>
          </div>
        </>
      )}
    </div>
  );
}
