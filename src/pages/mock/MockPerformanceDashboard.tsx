import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer,
} from 'recharts';
import { FileBarChart, TrendingUp, ArrowLeft, CheckCircle2, Users } from 'lucide-react';
import { KpiCard } from '@/components/dashboard/KpiCard';
import { generateMockPerformanceData, MockPerformanceData } from '@/data/mockDemoData';

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const COLORS = ['#1A1A1A', '#9ED8F5', '#75726B', '#3B86A8', '#C2BCAF', '#1A1A1A', '#9ED8F5', '#75726B'];

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

function DarkSelect({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: string[] }) {
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
    <div className={`relative glass-card overflow-hidden ${className}`}>
      <span aria-hidden className="glass-rail" />
      {children}
    </div>
  );
}

export default function MockPerformanceDashboard() {
  const navigate = useNavigate();
  const [data] = useState<MockPerformanceData>(() => generateMockPerformanceData());
  const [editor, setEditor] = useState('(All Editors)');
  const [month, setMonth] = useState('April');

  const filteredEod = useMemo(() => data.eod.filter(r => {
    const matchMonth = r.Month.toLowerCase() === month.toLowerCase();
    const matchEditor = editor === '(All Editors)' || r.Name === editor;
    return matchMonth && matchEditor;
  }), [data, editor, month]);

  const filteredPayment = useMemo(() => data.paymentRows.filter(r => r.month.toLowerCase() === month.toLowerCase()), [data, month]);
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

  const weekKeys = useMemo(() => [...new Set(filteredEod.map(r => r.Week))].sort((a, b) => parseInt(a) - parseInt(b)).map(w => `Wk ${w}`), [filteredEod]);

  const weeklyOutputAll = useMemo(() => {
    const editorFiltered = data.eod.filter(r => editor === '(All Editors)' || r.Name === editor);
    const map: Record<string, number> = {};
    editorFiltered.forEach(r => { const w = r.Week; if (w) map[w] = (map[w] || 0) + (parseInt(r['Videos Delivered']) || 0); });
    return Object.entries(map).sort(([a], [b]) => parseInt(a) - parseInt(b)).map(([week, total]) => ({ week: `Wk ${week}`, total }));
  }, [data, editor]);

  const monthlyApproved = useMemo(() => {
    const monthOrder = ['January', 'February', 'March', 'April'];
    const map: Record<string, number> = {};
    data.paymentRows.filter(r => r.approved).forEach(r => { map[r.month] = (map[r.month] || 0) + 1; });
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
              onClick={() => navigate('/mock')}
              className="w-8 h-8 rounded-[4px] flex items-center justify-center hover:bg-white transition-all duration-200 cursor-pointer border border-[#E2E0D9] hover:border-[#1A1A1A]"
            >
              <ArrowLeft className="w-4 h-4 text-[#1A1A1A]" strokeWidth={1.5} />
            </button>
            <span className="text-sm font-medium text-[#1A1A1A] tracking-tight">Editor Performance</span>
          </div>
          <span className="text-[10px] font-mono uppercase tracking-[0.15em] text-[#75726B] inline-flex items-center gap-1.5">
            <span className="relative flex w-1.5 h-1.5">
              <span className="absolute inset-0 rounded-full bg-[#9ED8F5] animate-ping opacity-60" />
              <span className="relative w-1.5 h-1.5 rounded-full bg-[#9ED8F5]" />
            </span>
            Demo
          </span>
        </div>
      </header>

      {/* Hero band */}
      <section className="relative z-10 max-w-[1280px] mx-auto px-5 md:px-8 pt-16 pb-10">
        <span className="eyebrow eyebrow-accent">Editor Output — {month}</span>
        <h1 className="mt-6 text-5xl md:text-6xl leading-[0.95] tracking-tight font-semibold max-w-3xl">
          Editor <em>performance</em>.
        </h1>
        <p className="mt-5 text-[15px] text-[#75726B] max-w-xl leading-relaxed">
          Sample data showing daily and weekly output, approvals, and per-editor breakdown — exactly what your client portal looks like.
        </p>
        <hr className="w-[100px] h-px bg-[#E2E0D9] border-0 mt-8" />
      </section>

      <main className="max-w-[1280px] mx-auto px-5 md:px-8 pb-16 space-y-7 relative z-10">
        <div className="flex justify-end items-center gap-2">
          <DarkSelect value={editor} onChange={setEditor} options={data.editors} />
          <DarkSelect value={month} onChange={setMonth} options={data.months} />
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          <KpiCard label="Delivered" value={`${kpis.delivered}`} icon={<FileBarChart className="w-3.5 h-3.5" />} delay={0} />
          <KpiCard label="Approved" value={`${kpis.approved}`} icon={<CheckCircle2 className="w-3.5 h-3.5" />} delay={100} />
          <KpiCard label="Avg/Day" value={`${kpis.avg}`} icon={<TrendingUp className="w-3.5 h-3.5" />} delay={200} />
          <KpiCard label="Active Editors" value={`${kpis.activeEditors}`} icon={<Users className="w-3.5 h-3.5" />} delay={300} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
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

          <PremiumCard className="p-6">
            <h4 className="text-base font-semibold text-[#1A1A1A] mb-1 tracking-tight">Weekly <em>Output</em></h4>
            <p className="text-[10px] font-mono uppercase tracking-[0.15em] text-[#75726B] mb-4">Total videos per week (all time)</p>
            <div className="h-56 overflow-x-auto">
              <div style={{ minWidth: weeklyOutputAll.length > 12 ? `${weeklyOutputAll.length * 40}px` : '100%', height: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyOutputAll}>
                    <defs>
                      <linearGradient id="mockBarGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#1A1A1A" stopOpacity={1} />
                        <stop offset="100%" stopColor="#1A1A1A" stopOpacity={0.55} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(26,26,26,0.06)" vertical={false} />
                    <XAxis dataKey="week" tick={{ fill: '#75726B', fontSize: 10 }} axisLine={false} tickLine={false} interval={0} />
                    <YAxis tick={{ fill: '#75726B', fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
                    <Tooltip content={<ChartTooltip />} />
                    <Bar dataKey="total" fill="url(#mockBarGrad)" radius={[2, 2, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </PremiumCard>
        </div>

        <PremiumCard className="p-6">
          <h4 className="text-base font-semibold text-[#1A1A1A] mb-1 tracking-tight">Monthly <em>Approved</em> Videos</h4>
          <p className="text-[10px] font-mono uppercase tracking-[0.15em] text-[#75726B] mb-4">Approved videos per month</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyApproved}>
                <defs>
                  <linearGradient id="mockApprovedGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#9ED8F5" stopOpacity={1} />
                    <stop offset="100%" stopColor="#9ED8F5" stopOpacity={0.55} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(26,26,26,0.06)" vertical={false} />
                <XAxis dataKey="month" tick={{ fill: '#75726B', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#75726B', fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip content={<ChartTooltip />} />
                <Bar dataKey="count" fill="url(#mockApprovedGrad)" radius={[2, 2, 0, 0]} name="Approved" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </PremiumCard>

        {editorBreakdown.length > 0 && (
          <div>
            <span className="eyebrow mb-4 inline-block">Editor Breakdown</span>
            <PremiumCard className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-[#F7F6F3]">
                      <th className="px-4 py-3 text-left text-[10px] font-mono uppercase tracking-[0.15em] text-[#75726B]">Editor</th>
                      <th className="px-4 py-3 text-left text-[10px] font-mono uppercase tracking-[0.15em] text-[#75726B]">Delivered</th>
                      <th className="px-4 py-3 text-left text-[10px] font-mono uppercase tracking-[0.15em] text-[#75726B]">Active Days</th>
                      <th className="px-4 py-3 text-left text-[10px] font-mono uppercase tracking-[0.15em] text-[#75726B]">Avg/Day</th>
                      <th className="px-4 py-3 text-left text-[10px] font-mono uppercase tracking-[0.15em] text-[#75726B]">Output</th>
                    </tr>
                  </thead>
                  <tbody>
                    {editorBreakdown.map((ed) => {
                      const maxDelivered = Math.max(...editorBreakdown.map(e => e.delivered), 1);
                      const pct = (ed.delivered / maxDelivered) * 100;
                      return (
                        <tr key={ed.name} className="border-b border-[#E2E0D9] last:border-b-0 hover:bg-[#F7F6F3] transition-colors duration-200">
                          <td className="px-4 py-5 text-[#1A1A1A] font-medium">{ed.name}</td>
                          <td className="px-4 py-5 font-semibold text-[#1A1A1A] tabular-nums">{ed.delivered}</td>
                          <td className="px-4 py-5 text-[#75726B] tabular-nums">{ed.activeDays}</td>
                          <td className="px-4 py-5 text-[#75726B] tabular-nums">{ed.avg}</td>
                          <td className="px-4 py-5 min-w-[160px]">
                            <div className="flex items-center gap-2">
                              <div className="flex-1 h-[3px] rounded-full bg-[#E2E0D9] overflow-hidden">
                                <div className="h-full rounded-full bg-[#1A1A1A] transition-all duration-300" style={{ width: `${pct}%` }} />
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
      </main>
    </div>
  );
}
