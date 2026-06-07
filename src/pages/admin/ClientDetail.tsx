import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Client, Stage, Module, ModuleCompletion, StageWithModules } from '@/types/playbook';
import { isModuleCompleted } from '@/lib/progression';
import { Button } from '@/components/ui/button';
import { ArrowLeft, BarChart3, Edit, Trash2, RotateCcw, ChevronRight, BookOpen, GraduationCap, Lock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { generatePassword } from '@/lib/auth';

function ProgressBar({ pct }: { pct: number }) {
  const done = pct === 100;
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-[10px] text-white/30">{done ? '🎉 Complete!' : 'Progress'}</span>
        <span className="text-xs font-bold text-white/60" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{pct}%</span>
      </div>
      <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{
            width: `${pct}%`,
            background: done
              ? 'linear-gradient(90deg, #10B981, #34D399)'
              : 'linear-gradient(90deg, #8B5CF6, #6366F1)',
            boxShadow: pct > 0 ? '0 0 12px rgba(139,92,246,0.4)' : 'none',
          }}
        />
      </div>
    </div>
  );
}

export default function ClientDetail() {
  const { clientId } = useParams<{ clientId: string }>();
  const navigate = useNavigate();
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
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#09090B' }}>
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
        <span className="text-sm text-white/30">Loading…</span>
      </div>
    </div>
  );

  if (!client) return (
    <div className="min-h-screen flex items-center justify-center text-white/30" style={{ background: '#09090B' }}>
      Client not found
    </div>
  );

  const totalModules = stages.reduce((sum, s) => sum + s.modules.length, 0);
  const completedModules = stages.reduce((sum, s) => sum + s.modules.filter(m => isModuleCompleted(m.id, completions)).length, 0);
  const pct = totalModules > 0 ? Math.round((completedModules / totalModules) * 100) : 0;
  const stageCount = stages.length;
  const stagesComplete = stages.filter(s => s.modules.length > 0 && s.modules.every(m => isModuleCompleted(m.id, completions))).length;

  return (
    <div className="min-h-screen" style={{ background: '#09090B' }}>
      {/* Dot grid */}
      <div className="fixed inset-0 pointer-events-none" style={{
        backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)',
        backgroundSize: '24px 24px',
      }} />

      {/* Header */}
      <header className="relative z-10 border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
        <div className="max-w-5xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/admin')} className="flex items-center gap-1.5 text-xs text-white/30 hover:text-white/60 transition-colors">
              <ArrowLeft className="w-3.5 h-3.5" /> Back
            </button>
            <div className="h-4 w-px bg-white/10" />
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center text-[11px] font-bold text-white shadow-lg shadow-violet-500/20">
                {client.brand_name.charAt(0)}
              </div>
              <span className="text-sm font-medium text-white">{client.brand_name}</span>
              <span className="text-[10px] text-white/20">Admin View</span>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={resetPassword}
              className="flex items-center gap-1 h-7 px-2.5 rounded-lg text-[11px] text-white/40 hover:text-white/70 transition-colors"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <RotateCcw className="w-3 h-3" /> Reset PW
            </button>
            <button onClick={handleDelete}
              className="flex items-center gap-1 h-7 px-2.5 rounded-lg text-[11px] text-red-400/60 hover:text-red-400 transition-colors"
              style={{ background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.1)' }}>
              <Trash2 className="w-3 h-3" /> Delete
            </button>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-5xl mx-auto px-6 py-10 space-y-8">
        {/* Hero */}
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500/20 to-indigo-500/20 border border-violet-500/20 flex items-center justify-center text-xl font-bold text-violet-400 shrink-0">
            {client.brand_name.charAt(0)}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">{client.brand_name}</h1>
            <span className="text-xs px-2 py-0.5 rounded-md text-white/40 border border-white/10" style={{ fontFamily: "'JetBrains Mono', monospace", background: 'rgba(255,255,255,0.04)' }}>
              @{client.username}
            </span>
          </div>
        </div>

        {/* Two cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Onboarding card */}
          <button
            onClick={() => navigate(`/admin/clients/${clientId}/playbook-view`)}
            className="group text-left rounded-2xl p-6 transition-all duration-200 hover:scale-[1.01]"
            style={{ background: '#111113', border: '1px solid rgba(255,255,255,0.06)' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = '0 0 30px -5px rgba(139,92,246,0.15)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = 'none'; }}
          >
            <div className="flex items-start justify-between mb-5">
              <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-violet-400" />
              </div>
              <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-violet-400 group-hover:translate-x-0.5 transition-all" />
            </div>
            <h3 className="text-base font-semibold text-white mb-0.5">Onboarding</h3>
            <p className="text-xs text-white/30 mb-5">SOPs, modules, and progression tracking</p>

            <div className="grid grid-cols-3 gap-2 mb-5">
              {[
                { val: totalModules, label: 'MODULES' },
                { val: `${stagesComplete}/${stageCount}`, label: 'STAGES' },
                { val: `${pct}%`, label: 'COMPLETE', highlight: pct === 100 },
              ].map((s, i) => (
                <div key={i} className="rounded-xl p-3 text-center" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.04)' }}>
                  <p className={`text-lg font-bold ${s.highlight ? 'text-emerald-400' : 'text-white'}`} style={{ fontFamily: "'JetBrains Mono', monospace" }}>{s.val}</p>
                  <p className="text-[8px] uppercase tracking-widest text-white/30">{s.label}</p>
                </div>
              ))}
            </div>

            <ProgressBar pct={pct} />

            <div className="mt-5 flex items-center gap-1.5">
              <span className="text-[10px] font-semibold uppercase tracking-widest text-violet-400 group-hover:text-violet-300 transition-colors">
                View Playbook →
              </span>
            </div>
          </button>

          {/* Editor Performance card */}
          <div className="rounded-2xl p-6 relative overflow-hidden" style={{ background: '#111113', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="flex items-start justify-between mb-5">
              <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-violet-400" />
              </div>
            </div>
            <h3 className="text-base font-semibold text-white mb-0.5">Editor Performance</h3>
            <p className="text-xs text-white/30 mb-5">Delivery tracking and output metrics</p>
            {client.spreadsheet_id ? (
              <div className="flex items-center gap-2 py-4 justify-center">
                <span className="text-xs text-emerald-400/60">✓ Sheet connected</span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2 py-6">
                <Lock className="w-5 h-5 text-white/10" />
                <span className="text-xs text-white/20">Connect a Google Sheet to enable tracking</span>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={() => navigate(`/admin/clients/${clientId}/playbook`)}
            className="flex items-center gap-1.5 h-8 px-3 rounded-lg text-xs text-white/40 hover:text-white/70 transition-colors"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
          >
            <Edit className="w-3.5 h-3.5" /> Edit Playbook Content
          </button>
        </div>
      </main>
    </div>
  );
}
