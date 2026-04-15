import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Client, Stage, Module, ModuleCompletion, StageWithModules } from '@/types/playbook';
import { isModuleCompleted } from '@/lib/progression';
import { ProgressBar } from '@/components/playbook/ProgressBar';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit, Trash2, RotateCcw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { logout } from '@/lib/auth';

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
    await supabase.from('clients').delete().eq('id', clientId!);
    toast({ title: 'Client deleted' });
    navigate('/admin');
  }

  async function resetPassword() {
    const newPassword = prompt('Enter new password (or leave empty to auto-generate):');
    // For simplicity, we'd need an edge function to reset password
    // For now just show a message
    toast({ title: 'Password reset', description: 'Use Supabase dashboard to reset the password for now.' });
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Loading...</div>;
  if (!client) return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Client not found</div>;

  const totalModules = stages.reduce((sum, s) => sum + s.modules.length, 0);
  const completedModules = stages.reduce((sum, s) => sum + s.modules.filter(m => isModuleCompleted(m.id, completions)).length, 0);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <button onClick={() => navigate('/admin')} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-4 h-4" /> Dashboard
          </button>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => navigate(`/admin/clients/${clientId}/playbook`)}>
              <Edit className="w-4 h-4 mr-1" /> Edit Playbook
            </Button>
            <Button variant="outline" size="sm" onClick={resetPassword}>
              <RotateCcw className="w-4 h-4 mr-1" /> Reset Password
            </Button>
            <Button variant="outline" size="sm" onClick={handleDelete} className="text-destructive hover:text-destructive">
              <Trash2 className="w-4 h-4 mr-1" /> Delete
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8 space-y-8">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">{client.brand_name}</h1>
          <p className="text-sm text-muted-foreground font-mono">@{client.username}</p>
        </div>

        <div className="max-w-md">
          <p className="text-sm text-muted-foreground mb-2">Overall Progress</p>
          <ProgressBar completed={completedModules} total={totalModules} />
        </div>

        {stages
          .sort((a, b) => a.sort_order - b.sort_order)
          .map(stage => (
            <div key={stage.id} className="space-y-3">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Stage {stage.stage_number}: {stage.title}
              </h3>
              {stage.modules.length === 0 ? (
                <p className="text-sm text-muted-foreground italic">No modules yet</p>
              ) : (
                <div className="space-y-1">
                  {stage.modules.sort((a, b) => a.sort_order - b.sort_order).map(module => {
                    const completed = isModuleCompleted(module.id, completions);
                    return (
                      <div key={module.id} className="flex items-center gap-3 p-3 rounded-lg border border-border bg-card">
                        <div className={`w-6 h-6 rounded flex items-center justify-center text-xs ${
                          completed ? 'bg-emerald-500 text-white' : 'bg-muted text-muted-foreground'
                        }`}>
                          {completed ? '✓' : module.module_number}
                        </div>
                        <span className="text-sm">{module.icon} {module.title}</span>
                        <span className={`ml-auto text-xs font-mono ${completed ? 'text-emerald-500' : 'text-muted-foreground'}`}>
                          {completed ? 'Done' : 'Pending'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
      </main>
    </div>
  );
}
