import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer,
} from 'recharts';
import { RefreshCw, FileBarChart, TrendingUp, ArrowLeft, CheckCircle2, Users } from 'lucide-react';
import { KpiCard } from '@/components/dashboard/KpiCard';
import { HorizonGlow } from '@/components/dashboard/HorizonGlow';
import { generateMockPerformanceData, MockPerformanceData } from '@/data/mockDemoData';

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const COLORS = ['#a855f7', '#06b6d4', '#fbbf24', '#34d399', '#ec4899', '#3b82f6', '#f87171', '#c084fc'];
const CARD_SHADOW = '0 0 0 1px rgba(255,255,255,0.06) inset, 0 4px 24px rgba(0,0,0,0.4)';
const CARD_SHADOW_HOVER = '0 0 0 1px rgba(168,85,247,0.2) inset, 0 0 0 1px rgba(99,102,241,0.1) inset, 0 4px 24px rgba(0,0,0,0.4)';

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

function DarkSelect({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: string[] }) {
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

export default function MockPerformanceDashboard() {
  const navigate = useNavigate();
  const [data] = useState<MockPerformanceData>(() => generateMockPerformanceData());
  const [editor, setEditor] = useState('(All Editors)');
  const [month, setMonth] = useState('April');

  const filteredEod = useMemo(() => {
    return data.eod.filter(r => {
      const matchMonth = r.Month.toLowerCase() === month.toLowerCase();
      const matchEditor = editor === '(All Editors)' || r.Name === editor;
      return matchMonth && matchEditor;
    });
  }, [data, editor, month]);

  const filteredPayment = useMemo(() => {
    return data.paymentRows.filter(r => r.month.toLowerCase() === month.toLowerCase());
  }, [data, month]);

  const approvedCount = useMemo(() => filteredPayment.filter(r => r.approved).length, [filteredPayment]);

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
      const dow = row['Select the working day the report is for'];
      if (!dow || !WEEKDAYS.includes(dow)) return;
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

  const monthlyApproved = useMemo(() => {
    const monthOrder = ['January', 'February', 'March', 'April'];
    const map: Record<string, number> = {};
    data.paymentRows.filter(r => r.approved).forEach(r => {
      map[r.month] = (map[r.month] || 0) + 1;
    });
    return monthOrder.filter(m => map[m]).map(month => ({ month, count: map[month] }));
  }, [data]);

  const editorBreakdown = useMemo(() => {
    const monthFiltered = data.eod.filter(r => r.Month.toLowerCase() === month.toLowerCase());
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

  return (
    <div className="min-h-screen bg-[#09090f]">
      <div className="fixed inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 80% 40% at 50% 0%, rgba(124,58,237,0.15) 0%, transparent 100%)' }} />

      <header className="sticky top-0 z-40 border-b border-white/[0.06]" style={{ background: 'rgba(9,9,15,0.85)', backdropFilter: 'blur(12px)' }}>
        <div className="max-w-[1200px] mx-auto px-5 md:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/mock')} className="flex items-center gap-1.5 text-xs text-white/30 hover:text-white/60 transition-all duration-200 cursor-pointer">
              <ArrowLeft className="w-3.5 h-3.5" /> Back
            </button>
            <div className="h-4 w-px bg-white/10" />
            <span className="text-sm font-medium text-white">Editor Performance</span>
            <span className="text-[10px] text-white/20 ml-2">Demo Data</span>
          </div>
        </div>
      </header>

      <main className="max-w-[1200px] mx-auto px-5 md:px-8 py-8 space-y-7 relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold text-white">Editor Performance</h1>
            <p className="text-sm text-white/40 mt-1">{month} · {editor}</p>
          </div>
          <div className="flex items-center gap-2">
            <DarkSelect value={editor} onChange={setEditor} options={data.editors} />
            <DarkSelect value={month} onChange={setMonth} options={data.months} />
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          <KpiCard label="Delivered" value={`${kpis.delivered}`} icon={<FileBarChart className="w-3.5 h-3.5" />} delay={0} />
          <KpiCard label="Approved" value={`${kpis.approved}`} icon={<CheckCircle2 className="w-3.5 h-3.5" />} delay={100} />
          <KpiCard label="Avg/Day" value={`${kpis.avg}`} icon={<TrendingUp className="w-3.5 h-3.5" />} delay={200} />
          <KpiCard label="Active Editors" value={`${kpis.activeEditors}`} icon={<Users className="w-3.5 h-3.5" />} delay={300} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
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

          <PremiumCard className="p-6">
            <h4 className="text-sm font-semibold text-white mb-0.5">Weekly Output</h4>
            <p className="text-xs uppercase tracking-widest text-white/40 mb-4 font-medium">Total videos per week (all time)</p>
            <div className="h-56 overflow-x-auto">
              <div style={{ minWidth: weeklyOutputAll.length > 12 ? `${weeklyOutputAll.length * 40}px` : '100%', height: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyOutputAll}>
                    <defs>
                      <linearGradient id="mockBarGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#a855f7" stopOpacity={0.9} />
                        <stop offset="100%" stopColor="#7c3aed" stopOpacity={0.6} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis dataKey="week" tick={{ fill: 'rgba(255,255,255,0.30)', fontSize: 10 }} axisLine={false} tickLine={false} interval={0} />
                    <YAxis tick={{ fill: 'rgba(255,255,255,0.30)', fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
                    <Tooltip content={<ChartTooltip />} />
                    <Bar dataKey="total" fill="url(#mockBarGrad)" radius={[3, 3, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </PremiumCard>
        </div>

        <PremiumCard className="p-6">
          <h4 className="text-sm font-semibold text-white mb-0.5">Monthly Approved Videos</h4>
          <p className="text-xs uppercase tracking-widest text-white/40 mb-4 font-medium">Approved videos per month</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyApproved}>
                <defs>
                  <linearGradient id="mockApprovedGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#34d399" stopOpacity={0.9} />
                    <stop offset="100%" stopColor="#059669" stopOpacity={0.6} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="month" tick={{ fill: 'rgba(255,255,255,0.30)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'rgba(255,255,255,0.30)', fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip content={<ChartTooltip />} />
                <Bar dataKey="count" fill="url(#mockApprovedGrad)" radius={[4, 4, 0, 0]} name="Approved" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </PremiumCard>

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
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Approved
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" /> Pending
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
      </main>
    </div>
  );
}
