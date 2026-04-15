import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Client, Stage, Module, ModuleCompletion, StageWithModules } from '@/types/playbook';
import { isModuleCompleted } from '@/lib/progression';
import { Button } from '@/components/ui/button';
import { ArrowLeft, BarChart3, Edit, Trash2, RotateCcw, ChevronRight, Shield, BookOpen, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { generatePassword } from '@/lib/auth';
import EditorPerformance from '@/components/EditorPerformance';

/* ── Friendly progress bar ── */
function ProgressBar({ pct }: { pct: number }) {
  const done = pct === 100;
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-slate-500">
          {done ? '🎉 All modules complete!' : 'Progress'}
        </span>
        <span className="text-sm font-bold font-mono" style={{ color: done ? '#16a34a' : '#7c3aed' }}>
          {pct}%
        </span>
      </div>
      <div className="h-2.5 rounded-full bg-slate-100 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{
            width: `${pct}%`,
            background: done
              ? 'linear-gradient(90deg, #22c55e, #4ade80)'
              : 'linear-gradient(90deg, #7c3aed, #a78bfa)',
          }}
        />
      </div>
    </div>
  );
}

export default function ClientDetail() {
  const { clientId } = useParams<{ clientId: string }>();
  const navigate = useNavigate();
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
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-violet-400 border-t-transparent rounded-full animate-spin" />
        <span className="text-sm text-slate-400">Loading…</span>
      </div>
    </div>
  );

  if (!client) return (
    <div className="min-h-screen flex items-center justify-center bg-white text-slate-400">
      Client not found
    </div>
  );

  const totalModules = stages.reduce((sum, s) => sum + s.modules.length, 0);
  const completedModules = stages.reduce((sum, s) => sum + s.modules.filter(m => isModuleCompleted(m.id, completions)).length, 0);
  const pct = totalModules > 0 ? Math.round((completedModules / totalModules) * 100) : 0;
  const stageCount = stages.length;
  const stagesComplete = stages.filter(s => s.modules.length > 0 && s.modules.every(m => isModuleCompleted(m.id, completions))).length;

  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white border-b border-slate-200/80">
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/admin')} className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-600 transition-colors">
              <ArrowLeft className="w-3.5 h-3.5" /> Back
            </button>
            <div className="h-4 w-px bg-slate-200" />
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center text-[11px] font-bold text-white shadow-sm">
                A
              </div>
              <div>
                <span className="text-sm font-semibold text-slate-800">AdChefs</span>
                <span className="text-[10px] ml-2 text-slate-400">Client Portal</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={resetPassword}
              className="rounded-lg text-[11px] h-7 px-2.5 border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-700">
              <RotateCcw className="w-3 h-3 mr-1" /> Reset PW
            </Button>
            <Button variant="outline" size="sm" onClick={handleDelete}
              className="rounded-lg text-[11px] h-7 px-2.5 border-slate-200 text-red-400 hover:bg-red-50 hover:text-red-500 hover:border-red-200">
              <Trash2 className="w-3 h-3 mr-1" /> Delete
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8 space-y-8">
        {/* Client hero */}
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-100 to-indigo-100 border border-violet-200/50 flex items-center justify-center text-xl font-bold text-violet-600 shrink-0">
            {client.brand_name.charAt(0)}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">{client.brand_name}</h1>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-xs font-mono px-2 py-0.5 rounded-md bg-slate-100 text-slate-500 border border-slate-200/50">
                @{client.username}
              </span>
              <span className="flex items-center gap-1 text-[10px] text-slate-400">
                <Shield className="w-3 h-3" /> Admin
              </span>
            </div>
          </div>
        </div>

        {/* Tab navigation */}
        <div className="flex gap-1 p-1 rounded-xl bg-slate-100 border border-slate-200/50 w-fit">
          {[
            { key: 'overview' as const, label: 'Playbook', icon: BookOpen },
            { key: 'performance' as const, label: 'Editor Performance', icon: BarChart3 },
          ].map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
                activeTab === tab.key
                  ? 'bg-white text-slate-800 shadow-sm border border-slate-200/80'
                  : 'text-slate-500 hover:text-slate-700'
              }`}>
              <tab.icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {activeTab === 'overview' ? (
          <div className="space-y-6">
            {/* Playbook card */}
            <button
              onClick={() => navigate(`/admin/clients/${clientId}/playbook-view`)}
              className="group w-full text-left rounded-2xl p-6 bg-white border border-slate-200/80 shadow-sm transition-all duration-300 hover:shadow-md hover:border-violet-200 hover:-translate-y-0.5"
            >
              <div className="flex items-start justify-between mb-5">
                <div className="w-11 h-11 rounded-xl bg-violet-50 border border-violet-100 flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-violet-500" />
                </div>
                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-violet-400 group-hover:translate-x-0.5 transition-all" />
              </div>

              <h3 className="text-base font-semibold text-slate-800 mb-0.5">Video Editing Playbook</h3>
              <p className="text-xs text-slate-400 mb-5">SOPs, modules, and progression tracking</p>

              <div className="grid grid-cols-3 gap-3 mb-5">
                {[
                  { val: totalModules, label: 'Modules' },
                  { val: `${stagesComplete}/${stageCount}`, label: 'Stages' },
                  { val: `${pct}%`, label: 'Complete', highlight: pct === 100 },
                ].map((s, i) => (
                  <div key={i} className="rounded-xl p-3 text-center bg-slate-50 border border-slate-100">
                    <p className={`text-lg font-bold font-mono ${s.highlight ? 'text-green-500' : 'text-slate-800'}`}
                      style={{ fontFamily: "'JetBrains Mono', monospace" }}>{s.val}</p>
                    <p className="text-[9px] uppercase tracking-widest font-medium text-slate-400">{s.label}</p>
                  </div>
                ))}
              </div>

              <ProgressBar pct={pct} />

              <div className="mt-5 flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-violet-400" />
                <span className="text-[10px] font-semibold uppercase tracking-widest text-violet-500 group-hover:text-violet-600 transition-colors">
                  Open Playbook →
                </span>
              </div>
            </button>

            <div className="flex gap-3">
              <Button
                variant="outline" size="sm"
                onClick={() => navigate(`/admin/clients/${clientId}/playbook`)}
                className="rounded-lg text-xs border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-700"
              >
                <Edit className="w-3.5 h-3.5 mr-1.5" /> Edit Playbook Content
              </Button>
            </div>
          </div>
        ) : (
          <EditorPerformance />
        )}
      </main>
    </div>
  );
}
