import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Client, Stage, Module, ModuleCompletion, StageWithModules } from '@/types/playbook';
import { isModuleCompleted } from '@/lib/progression';
import { ProgressBar } from '@/components/playbook/ProgressBar';
import { Button } from '@/components/ui/button';
import { ArrowLeft, BookOpen, BarChart3, Edit, Trash2, RotateCcw, ChevronRight, Shield } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { generatePassword } from '@/lib/auth';

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
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-sky-500 border-t-transparent rounded-full animate-spin" />
        <span className="text-sm text-muted-foreground">Loading…</span>
      </div>
    </div>
  );
  if (!client) return <div className="min-h-screen flex items-center justify-center text-muted-foreground bg-background">Client not found</div>;

  const totalModules = stages.reduce((sum, s) => sum + s.modules.length, 0);
  const completedModules = stages.reduce((sum, s) => sum + s.modules.filter(m => isModuleCompleted(m.id, completions)).length, 0);
  const pct = totalModules > 0 ? Math.round((completedModules / totalModules) * 100) : 0;
  const stageCount = stages.length;
  const stagesComplete = stages.filter(s => s.modules.length > 0 && s.modules.every(m => isModuleCompleted(m.id, completions))).length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-border/40 bg-background/80 backdrop-blur-xl">
        <div className="max-w-5xl mx-auto px-6 py-3 flex items-center justify-between">
          <button onClick={() => navigate('/admin')} className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> All Clients
          </button>
          <div className="flex gap-1.5">
            <Button variant="outline" size="sm" onClick={resetPassword} className="rounded-xl text-[11px] h-8 px-3">
              <RotateCcw className="w-3 h-3 mr-1" /> Reset PW
            </Button>
            <Button variant="outline" size="sm" onClick={handleDelete} className="rounded-xl text-[11px] h-8 px-3 text-destructive hover:text-destructive">
              <Trash2 className="w-3 h-3 mr-1" /> Delete
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8 space-y-8">
        {/* Client hero */}
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-sky-500/20 to-violet-500/10 border border-sky-500/10 flex items-center justify-center text-2xl font-bold text-sky-500">
            {client.brand_name.charAt(0)}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight">{client.brand_name}</h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-muted-foreground font-mono bg-muted/30 px-2 py-0.5 rounded-md">@{client.username}</span>
              <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                <Shield className="w-3 h-3" /> Admin view
              </span>
            </div>
          </div>
        </div>

        {/* Dashboard cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Playbook card */}
          <button
            onClick={() => navigate(`/admin/clients/${clientId}/playbook-view`)}
            className="group text-left rounded-2xl border border-border/40 bg-gradient-to-br from-card/80 to-card/40 p-6 hover:border-sky-500/30 hover:shadow-[0_0_30px_-8px_hsl(200_90%_50%/0.1)] transition-all duration-300"
          >
            <div className="flex items-start justify-between mb-5">
              <div className="w-12 h-12 rounded-xl bg-sky-500/10 border border-sky-500/10 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-sky-500" />
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground/30 group-hover:text-sky-500/60 group-hover:translate-x-0.5 transition-all" />
            </div>

            <h3 className="text-base font-semibold text-foreground mb-1">Video Editing Playbook</h3>
            <p className="text-xs text-muted-foreground mb-5">Training modules, SOPs, and progression tracking</p>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-3 mb-5">
              <div className="rounded-xl bg-muted/20 border border-border/20 p-3 text-center">
                <p className="text-lg font-bold font-mono text-foreground">{totalModules}</p>
                <p className="text-[9px] text-muted-foreground uppercase tracking-wider font-medium">Modules</p>
              </div>
              <div className="rounded-xl bg-muted/20 border border-border/20 p-3 text-center">
                <p className="text-lg font-bold font-mono text-foreground">{stagesComplete}/{stageCount}</p>
                <p className="text-[9px] text-muted-foreground uppercase tracking-wider font-medium">Stages</p>
              </div>
              <div className="rounded-xl bg-muted/20 border border-border/20 p-3 text-center">
                <p className={`text-lg font-bold font-mono ${pct === 100 ? 'text-emerald-500' : 'text-foreground'}`}>{pct}%</p>
                <p className="text-[9px] text-muted-foreground uppercase tracking-wider font-medium">Complete</p>
              </div>
            </div>

            <ProgressBar completed={completedModules} total={totalModules} />

            <div className="mt-4 flex items-center gap-2">
              <span className="text-[10px] font-medium text-sky-500 group-hover:text-sky-400 transition-colors uppercase tracking-wider">
                View Playbook →
              </span>
            </div>
          </button>

          {/* Performance card (placeholder) */}
          <div className="relative rounded-2xl border border-border/40 bg-gradient-to-br from-card/80 to-card/40 p-6 overflow-hidden">
            <div className="flex items-start justify-between mb-5">
              <div className="w-12 h-12 rounded-xl bg-violet-500/10 border border-violet-500/10 flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-violet-500" />
              </div>
            </div>

            <h3 className="text-base font-semibold text-foreground mb-1">Video Editor Performance</h3>
            <p className="text-xs text-muted-foreground mb-5">Revision rates, turnaround times, and quality scores</p>

            {/* Placeholder stats */}
            <div className="grid grid-cols-3 gap-3 mb-5">
              <div className="rounded-xl bg-muted/20 border border-border/20 p-3 text-center">
                <p className="text-lg font-bold font-mono text-muted-foreground/40">—</p>
                <p className="text-[9px] text-muted-foreground uppercase tracking-wider font-medium">Videos</p>
              </div>
              <div className="rounded-xl bg-muted/20 border border-border/20 p-3 text-center">
                <p className="text-lg font-bold font-mono text-muted-foreground/40">—</p>
                <p className="text-[9px] text-muted-foreground uppercase tracking-wider font-medium">Avg. Revisions</p>
              </div>
              <div className="rounded-xl bg-muted/20 border border-border/20 p-3 text-center">
                <p className="text-lg font-bold font-mono text-muted-foreground/40">—</p>
                <p className="text-[9px] text-muted-foreground uppercase tracking-wider font-medium">Score</p>
              </div>
            </div>

            {/* Placeholder bar */}
            <div className="h-2 rounded-full bg-muted/30 overflow-hidden">
              <div className="h-full w-0 rounded-full bg-violet-500/20" />
            </div>

            {/* Coming soon overlay */}
            <div className="absolute inset-0 rounded-2xl bg-background/60 backdrop-blur-[2px] flex items-center justify-center">
              <span className="text-xs font-semibold text-muted-foreground bg-muted/40 border border-border/30 px-3 py-1.5 rounded-full uppercase tracking-wider">
                Coming Soon
              </span>
            </div>
          </div>
        </div>

        {/* Quick actions */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/admin/clients/${clientId}/playbook`)}
            className="rounded-xl text-xs"
          >
            <Edit className="w-3.5 h-3.5 mr-1.5" /> Edit Playbook Content
          </Button>
        </div>
      </main>
    </div>
  );
}
