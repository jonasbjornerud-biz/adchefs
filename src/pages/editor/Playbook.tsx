import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Client, StageWithModules, ModuleCompletion, Stage, Module } from '@/types/playbook';
import { isModuleCompleted } from '@/lib/progression';
import { ProgressBar } from '@/components/playbook/ProgressBar';
import { StageSection } from '@/components/playbook/StageSection';
import { Button } from '@/components/ui/button';
import { logout } from '@/lib/auth';
import { LogOut, Trophy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function Playbook() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [client, setClient] = useState<Client | null>(null);
  const [stages, setStages] = useState<StageWithModules[]>([]);
  const [completions, setCompletions] = useState<ModuleCompletion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { navigate('/login'); return; }

    const { data: clientData } = await supabase
      .from('clients')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_admin', false)
      .maybeSingle();

    if (!clientData) { navigate('/login'); return; }
    setClient(clientData as Client);

    const [stagesRes, modulesRes, completionsRes] = await Promise.all([
      supabase.from('stages').select('*').eq('client_id', clientData.id).order('sort_order'),
      supabase.from('modules').select('*').eq('client_id', clientData.id).order('sort_order'),
      supabase.from('module_completions').select('*').eq('client_id', clientData.id),
    ]);

    const stagesData = (stagesRes.data || []) as Stage[];
    const modulesData = (modulesRes.data || []) as Module[];
    setCompletions((completionsRes.data || []) as ModuleCompletion[]);

    const enriched: StageWithModules[] = stagesData.map(s => ({
      ...s,
      modules: modulesData.filter(m => m.stage_id === s.id),
    }));
    setStages(enriched);
    setLoading(false);
  }

  const handleToggleComplete = useCallback(async (moduleId: string, completed: boolean) => {
    if (!client) return;

    if (completed) {
      const { data, error } = await supabase.from('module_completions').upsert({
        module_id: moduleId,
        client_id: client.id,
        completed: true,
        completed_at: new Date().toISOString(),
      }, { onConflict: 'module_id,client_id' }).select();

      if (error) { toast({ title: 'Error', description: error.message, variant: 'destructive' }); return; }
      
      setCompletions(prev => {
        const filtered = prev.filter(c => c.module_id !== moduleId);
        return [...filtered, ...(data as ModuleCompletion[])];
      });
    } else {
      await supabase.from('module_completions').delete()
        .eq('module_id', moduleId)
        .eq('client_id', client.id);
      
      setCompletions(prev => prev.filter(c => c.module_id !== moduleId));
    }
  }, [client, toast]);

  if (loading) return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Loading playbook...</div>;
  if (!client) return null;

  const totalModules = stages.reduce((sum, s) => sum + s.modules.length, 0);
  const completedModules = stages.reduce((sum, s) => sum + s.modules.filter(m => isModuleCompleted(m.id, completions)).length, 0);
  const allComplete = totalModules > 0 && completedModules === totalModules;

  const stage1 = stages.find(s => s.stage_number === 1);
  const stages23 = stages.filter(s => s.stage_number > 1).sort((a, b) => a.stage_number - b.stage_number);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-semibold text-foreground">{client.brand_name}</h1>
              <p className="text-sm text-muted-foreground">Video Editing Playbook</p>
            </div>
            <Button variant="ghost" size="sm" onClick={() => { logout(); navigate('/login'); }} className="text-muted-foreground">
              <LogOut className="w-4 h-4 mr-1" /> Logout
            </Button>
          </div>
          <ProgressBar completed={completedModules} total={totalModules} />
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8 space-y-10">
        {/* Stage 1 */}
        {stage1 && (
          <StageSection
            stage={stage1}
            allStages={stages}
            completions={completions}
            onToggleComplete={handleToggleComplete}
          />
        )}

        {/* Stages 2 & 3 */}
        {stages23.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {stages23.map(stage => (
              <StageSection
                key={stage.id}
                stage={stage}
                allStages={stages}
                completions={completions}
                onToggleComplete={handleToggleComplete}
              />
            ))}
          </div>
        )}

        {/* Completion banner */}
        {allComplete && (
          <div className="rounded-xl border border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/20 p-6 text-center space-y-2">
            <Trophy className="w-10 h-10 text-emerald-500 mx-auto" />
            <h3 className="text-lg font-semibold text-emerald-700 dark:text-emerald-400">🎉 All stages complete!</h3>
            <p className="text-sm text-muted-foreground">You're now ready to edit live ads for {client.brand_name}.</p>
          </div>
        )}
      </main>
    </div>
  );
}
