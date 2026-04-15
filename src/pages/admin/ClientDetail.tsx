import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Client, Stage, Module, ModuleCompletion, StageWithModules } from '@/types/playbook';
import { isModuleCompleted } from '@/lib/progression';
import { Button } from '@/components/ui/button';
import { ArrowLeft, BookOpen, BarChart3, Edit, Trash2, RotateCcw, ChevronRight, Lock, Shield, Terminal } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { generatePassword } from '@/lib/auth';
import EditorPerformance from '@/components/EditorPerformance';

/* ── Animated dot-grid background ── */
function DotGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let raf: number;
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize);

    let t = 0;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const gap = 32;
      for (let x = gap; x < canvas.width; x += gap) {
        for (let y = gap; y < canvas.height; y += gap) {
          const wave = Math.sin((x + y) * 0.003 + t * 0.8) * 0.5 + 0.5;
          const alpha = 0.06 + wave * 0.08;
          ctx.beginPath();
          ctx.arc(x, y, 1, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(168, 130, 255, ${alpha})`;
          ctx.fill();
        }
      }
      t += 0.016;
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />;
}

/* ── Glowing progress bar ── */
function GlowProgress({ pct }: { pct: number }) {
  const allDone = pct === 100;
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs text-[#8b8b9e]">
          {allDone ? '✦ All missions complete' : 'Mission progress'}
        </span>
        <span className="font-mono text-sm font-bold" style={{ color: allDone ? '#4ade80' : '#c084fc' }}>
          {pct}%
        </span>
      </div>
      <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.04)' }}>
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{
            width: `${pct}%`,
            background: allDone
              ? 'linear-gradient(90deg, #22c55e, #4ade80)'
              : 'linear-gradient(90deg, #7c3aed, #a855f7, #06b6d4)',
            boxShadow: allDone
              ? '0 0 16px rgba(74, 222, 128, 0.5)'
              : '0 0 16px rgba(168, 85, 247, 0.4), 0 0 32px rgba(6, 182, 212, 0.2)',
          }}
        />
      </div>
    </div>
  );
}

  const [activeTab, setActiveTab] = useState<'overview' | 'performance'>('overview');
  const { toast } = useToast();
  const [client, setClient] = useState<Client | null>(null);
  const [stages, setStages] = useState<StageWithModules[]>([]);
  const [completions, setCompletions] = useState<ModuleCompletion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadData(); }, [clientId]);

  async function loadData() {
    if (!clientId) return;
    setLoading(true);
    const [clientRes, stagesRes, modulesRes, completionsRes] = await Promise.all([
      supabase.from('clients').select('*').eq('id', clientId).single(),
      supabase.from('stages').select('*').eq('client_id', clientId).order('sort_order'),
      supabase.from('modules').select('*').eq('client_id', clientId).order('sort_order'),
      supabase.from('module_completions').select('*').eq('client_id', clientId),
    ]);
    setClient(clientRes.data as Client | null);
    setCompletions((completionsRes.data || []) as ModuleCompletion[]);
    const stagesData = (stagesRes.data || []) as Stage[];
    const modulesData = (modulesRes.data || []) as Module[];
    setStages(stagesData.map(s => ({
      ...s,
      modules: modulesData.filter(m => m.stage_id === s.id),
    })));
    setLoading(false);
  }

  async function handleDelete() {
    if (!confirm('Delete this client and all their data? This cannot be undone.')) return;
    const { data, error } = await supabase.functions.invoke('manage-clients', {
      body: { action: 'delete_client', client_id: clientId },
    });
    if (error || data?.error) {
      toast({ title: 'Error', description: data?.error || error?.message, variant: 'destructive' });
      return;
    }
    toast({ title: 'Client deleted' });
    navigate('/admin');
  }

  async function resetPassword() {
    const newPassword = generatePassword();
    const { data, error } = await supabase.functions.invoke('manage-clients', {
      body: { action: 'reset_password', client_id: clientId, new_password: newPassword },
    });
    if (error || data?.error) {
      toast({ title: 'Error', description: data?.error || error?.message, variant: 'destructive' });
      return;
    }
    navigator.clipboard.writeText(`New password: ${newPassword}`);
    toast({ title: 'Password reset', description: `New password copied to clipboard: ${newPassword}` });
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#0a0a0f' }}>
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
        <span className="text-sm text-[#6b6b80] font-mono">Initializing…</span>
      </div>
    </div>
  );

  if (!client) return (
    <div className="min-h-screen flex items-center justify-center text-[#6b6b80]" style={{ background: '#0a0a0f' }}>
      Client not found
    </div>
  );

  const totalModules = stages.reduce((sum, s) => sum + s.modules.length, 0);
  const completedModules = stages.reduce((sum, s) => sum + s.modules.filter(m => isModuleCompleted(m.id, completions)).length, 0);
  const pct = totalModules > 0 ? Math.round((completedModules / totalModules) * 100) : 0;
  const stageCount = stages.length;
  const stagesComplete = stages.filter(s => s.modules.length > 0 && s.modules.every(m => isModuleCompleted(m.id, completions))).length;

  return (
    <div className="min-h-screen relative" style={{ background: '#0a0a0f', color: '#e4e4ed' }}>
      <DotGrid />

      {/* Ambient glow */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-[600px] h-[400px] rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.3), transparent 70%)', filter: 'blur(80px)' }} />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[350px] rounded-full opacity-15"
          style={{ background: 'radial-gradient(circle, rgba(6,182,212,0.25), transparent 70%)', filter: 'blur(80px)' }} />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-30 border-b"
        style={{ borderColor: 'rgba(255,255,255,0.06)', background: 'rgba(10,10,15,0.8)', backdropFilter: 'blur(20px)' }}>
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/admin')} className="flex items-center gap-2 text-xs transition-colors hover:text-white" style={{ color: '#6b6b80' }}>
              <ArrowLeft className="w-3.5 h-3.5" /> All Clients
            </button>
            <div className="h-4 w-px" style={{ background: 'rgba(255,255,255,0.08)' }} />
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-bold"
                style={{ background: 'linear-gradient(135deg, #7c3aed, #06b6d4)', color: '#fff' }}>
                A
              </div>
              <div>
                <span className="text-sm font-semibold text-white">AdChefs</span>
                <span className="text-[10px] ml-2" style={{ color: '#6b6b80' }}>Editor Command Center</span>
              </div>
            </div>
          </div>
          <div className="flex gap-1.5">
            <Button variant="outline" size="sm" onClick={resetPassword}
              className="rounded-lg text-[11px] h-7 px-2.5 border-white/[0.08] bg-white/[0.03] text-[#a0a0b8] hover:bg-white/[0.06] hover:text-white">
              <RotateCcw className="w-3 h-3 mr-1" /> Reset PW
            </Button>
            <Button variant="outline" size="sm" onClick={handleDelete}
              className="rounded-lg text-[11px] h-7 px-2.5 border-white/[0.08] bg-white/[0.03] text-red-400/70 hover:bg-red-500/10 hover:text-red-400">
              <Trash2 className="w-3 h-3 mr-1" /> Delete
            </Button>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-6xl mx-auto px-6 py-10 space-y-10">
        {/* Hero section */}
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold shrink-0"
            style={{
              background: 'linear-gradient(135deg, rgba(124,58,237,0.15), rgba(6,182,212,0.1))',
              border: '1px solid rgba(124,58,237,0.15)',
              color: '#c084fc',
            }}>
            {client.brand_name.charAt(0)}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">{client.brand_name}</h1>
            <div className="flex items-center gap-3 mt-1.5">
              <span className="font-mono text-xs px-2 py-0.5 rounded-md"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', color: '#8b8b9e' }}>
                @{client.username}
              </span>
              <span className="flex items-center gap-1 text-[10px]" style={{ color: '#6b6b80' }}>
                <Shield className="w-3 h-3" /> Admin access
              </span>
            </div>
          </div>
        </div>

        {/* Dashboard cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* ── Playbook / Missions card ── */}
          <button
            onClick={() => navigate(`/admin/clients/${clientId}/playbook-view`)}
            className="group text-left rounded-2xl p-6 transition-all duration-300 hover:-translate-y-0.5"
            style={{
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.06)',
              backdropFilter: 'blur(12px)',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.borderColor = 'rgba(124,58,237,0.3)';
              (e.currentTarget as HTMLElement).style.boxShadow = '0 0 40px rgba(124,58,237,0.08), 0 8px 32px rgba(0,0,0,0.3)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.06)';
              (e.currentTarget as HTMLElement).style.boxShadow = 'none';
            }}
          >
            <div className="flex items-start justify-between mb-6">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center"
                style={{ background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.12)' }}>
                <Terminal className="w-5 h-5" style={{ color: '#a855f7' }} />
              </div>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" style={{ color: 'rgba(255,255,255,0.15)' }} />
            </div>

            <h3 className="text-base font-semibold text-white mb-0.5">Mission Control</h3>
            <p className="text-xs mb-6" style={{ color: '#6b6b80' }}>Clearance levels, SOPs, and progression tracking</p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              {[
                { val: totalModules, label: 'Missions' },
                { val: `${stagesComplete}/${stageCount}`, label: 'Clearance' },
                { val: `${pct}%`, label: 'Complete', highlight: pct === 100 },
              ].map((s, i) => (
                <div key={i} className="rounded-xl p-3 text-center"
                  style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
                  <p className={`text-lg font-bold font-mono ${s.highlight ? 'text-emerald-400' : 'text-white'}`}
                    style={{ fontFamily: "'JetBrains Mono', monospace" }}>{s.val}</p>
                  <p className="text-[9px] uppercase tracking-widest font-medium" style={{ color: '#6b6b80' }}>{s.label}</p>
                </div>
              ))}
            </div>

            <GlowProgress pct={pct} />

            <div className="mt-5 flex items-center gap-2">
              <span className="text-[10px] font-semibold uppercase tracking-widest group-hover:text-purple-300 transition-colors" style={{ color: '#a855f7' }}>
                Enter Mission Control →
              </span>
            </div>
          </button>

          {/* ── Performance card (locked) ── */}
          <div className="relative rounded-2xl p-6 overflow-hidden"
            style={{
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.06)',
              backdropFilter: 'blur(12px)',
            }}>
            <div className="flex items-start justify-between mb-6">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center"
                style={{ background: 'rgba(6,182,212,0.08)', border: '1px solid rgba(6,182,212,0.1)' }}>
                <BarChart3 className="w-5 h-5" style={{ color: '#22d3ee' }} />
              </div>
            </div>

            <h3 className="text-base font-semibold text-white mb-0.5">Editor Performance</h3>
            <p className="text-xs mb-6" style={{ color: '#6b6b80' }}>Revision rates, turnaround times, quality metrics</p>

            <div className="grid grid-cols-3 gap-3 mb-6">
              {['Videos', 'Avg. Rev', 'Score'].map((label, i) => (
                <div key={i} className="rounded-xl p-3 text-center"
                  style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
                  <p className="text-lg font-bold font-mono" style={{ color: 'rgba(255,255,255,0.12)', fontFamily: "'JetBrains Mono', monospace" }}>—</p>
                  <p className="text-[9px] uppercase tracking-widest font-medium" style={{ color: '#6b6b80' }}>{label}</p>
                </div>
              ))}
            </div>

            <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.04)' }}>
              <div className="h-full w-0 rounded-full" style={{ background: 'rgba(6,182,212,0.15)' }} />
            </div>

            {/* Frosted lock overlay */}
            <div className="absolute inset-0 rounded-2xl flex flex-col items-center justify-center gap-3"
              style={{ background: 'rgba(10,10,15,0.7)', backdropFilter: 'blur(6px)' }}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  boxShadow: '0 0 20px rgba(124,58,237,0.1)',
                }}>
                <Lock className="w-5 h-5" style={{ color: '#6b6b80' }} />
              </div>
              <div className="text-center">
                <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#8b8b9e' }}>
                  Encrypted
                </span>
                <p className="text-[10px] mt-1" style={{ color: '#4a4a5c' }}>Module under development</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick actions */}
        <div className="flex gap-3">
          <Button
            variant="outline" size="sm"
            onClick={() => navigate(`/admin/clients/${clientId}/playbook`)}
            className="rounded-lg text-xs border-white/[0.08] bg-white/[0.03] text-[#a0a0b8] hover:bg-white/[0.06] hover:text-white"
          >
            <Edit className="w-3.5 h-3.5 mr-1.5" /> Edit Playbook Content
          </Button>
        </div>
      </main>
    </div>
  );
}
