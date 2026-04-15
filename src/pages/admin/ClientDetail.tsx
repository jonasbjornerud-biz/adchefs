import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Client, Stage, Module, ModuleCompletion, StageWithModules } from '@/types/playbook';
import { isModuleCompleted } from '@/lib/progression';
import { ProgressBar } from '@/components/playbook/ProgressBar';
import { RichTextRenderer } from '@/components/playbook/RichTextRenderer';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit, Trash2, RotateCcw, ChevronRight, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { generatePassword } from '@/lib/auth';

function AdminModuleCard({ module, completed }: { module: Module; completed: boolean }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
      completed
        ? 'border-emerald-500/20 bg-emerald-500/[0.03]'
        : 'border-border/60 bg-card/50 hover:border-border'
    }`}>
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-4 px-5 py-4 text-left cursor-pointer"
      >
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          completed
            ? 'bg-emerald-500 shadow-[0_0_12px_hsl(160_84%_39%/0.3)]'
            : 'border-2 border-border/60'
        }`}>
          {completed && <Check className="w-4 h-4 text-white" strokeWidth={3} />}
        </div>

        <span className="text-lg leading-none">{module.icon || '📄'}</span>
        <div className="flex-1 min-w-0">
          <span className={`font-semibold text-[15px] ${completed ? 'text-muted-foreground line-through decoration-emerald-500/30' : 'text-foreground'}`}>
            {module.title}
          </span>
          {module.definition_of_done && !expanded && (
            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{module.definition_of_done}</p>
          )}
        </div>

        <span className="font-mono text-[11px] text-muted-foreground/60 tracking-wider">{module.module_number}</span>
        <span className={`text-xs font-mono ${completed ? 'text-emerald-500' : 'text-muted-foreground/50'}`}>
          {completed ? 'Done' : 'Pending'}
        </span>
        <ChevronRight className={`w-4 h-4 text-muted-foreground/40 transition-transform duration-300 ${expanded ? 'rotate-90' : ''}`} />
      </button>

      {expanded && (
        <div className="px-5 pb-5 space-y-4">
          <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />

          {module.definition_of_done && (
            <div className="rounded-xl bg-sky-500/[0.06] border border-sky-500/10 p-4">
              <p className="text-[10px] font-bold text-sky-600 dark:text-sky-400 uppercase tracking-[0.15em] mb-1.5">Definition of Done</p>
              <p className="text-sm text-foreground/70 leading-relaxed">{module.definition_of_done}</p>
            </div>
          )}

          {module.content && (
            <div className="prose prose-sm max-w-none dark:prose-invert">
              <RichTextRenderer content={module.content} />
            </div>
          )}
        </div>
      )}
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
    
    const enriched: StageWithModules[] = stagesData.map(s => ({
      ...s,
      modules: modulesData.filter(m => m.stage_id === s.id),
    }));
    setStages(enriched);
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
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-sky-500 border-t-transparent rounded-full animate-spin" />
        <span className="text-sm text-muted-foreground">Loading…</span>
      </div>
    </div>
  );
  if (!client) return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Client not found</div>;

  const totalModules = stages.reduce((sum, s) => sum + s.modules.length, 0);
  const completedModules = stages.reduce((sum, s) => sum + s.modules.filter(m => isModuleCompleted(m.id, completions)).length, 0);

  const stageThemes: Record<number, { accent: string; bg: string; border: string }> = {
    1: { accent: 'text-sky-600 dark:text-sky-400', bg: 'bg-sky-500/[0.04]', border: 'border-sky-500/10' },
    2: { accent: 'text-violet-600 dark:text-violet-400', bg: 'bg-violet-500/[0.04]', border: 'border-violet-500/10' },
    3: { accent: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-500/[0.04]', border: 'border-amber-500/10' },
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-20 border-b border-border/60 bg-background/80 backdrop-blur-xl">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <button onClick={() => navigate('/admin')} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" /> Dashboard
          </button>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => navigate(`/admin/clients/${clientId}/playbook`)} className="rounded-xl text-xs">
              <Edit className="w-3.5 h-3.5 mr-1.5" /> Edit Playbook
            </Button>
            <Button variant="outline" size="sm" onClick={resetPassword} className="rounded-xl text-xs">
              <RotateCcw className="w-3.5 h-3.5 mr-1.5" /> Reset Password
            </Button>
            <Button variant="outline" size="sm" onClick={handleDelete} className="rounded-xl text-xs text-destructive hover:text-destructive">
              <Trash2 className="w-3.5 h-3.5 mr-1.5" /> Delete
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-8 space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{client.brand_name}</h1>
          <p className="text-sm text-muted-foreground font-mono">@{client.username}</p>
        </div>

        <ProgressBar completed={completedModules} total={totalModules} />

        {stages
          .sort((a, b) => a.sort_order - b.sort_order)
          .map(stage => {
            const theme = stageThemes[stage.stage_number] || stageThemes[1];
            const stageCompleted = stage.modules.filter(m => isModuleCompleted(m.id, completions)).length;
            return (
              <div key={stage.id} className={`rounded-2xl border ${theme.border} ${theme.bg} overflow-hidden`}>
                <div className="px-6 py-5 flex items-center gap-3">
                  <span className={`text-[11px] font-bold uppercase tracking-[0.15em] ${theme.accent}`}>
                    Stage {stage.stage_number}
                  </span>
                  <span className="text-lg font-semibold text-foreground">{stage.title}</span>
                  <span className="ml-auto text-xs font-mono text-muted-foreground">{stageCompleted}/{stage.modules.length}</span>
                </div>
                {stage.modules.length === 0 ? (
                  <div className="px-4 pb-4">
                    <p className="text-sm text-muted-foreground italic p-4">No modules yet</p>
                  </div>
                ) : (
                  <div className="px-4 pb-4 space-y-2">
                    {stage.modules.sort((a, b) => a.sort_order - b.sort_order).map(module => (
                      <AdminModuleCard
                        key={module.id}
                        module={module}
                        completed={isModuleCompleted(module.id, completions)}
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
      </main>
    </div>
  );
}
