import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Client, StageWithModules, ModuleCompletion, Stage, Module } from '@/types/playbook';
import { isModuleCompleted } from '@/lib/progression';
import { ProgressBar } from '@/components/playbook/ProgressBar';
import { StageSection } from '@/components/playbook/StageSection';
import { Button } from '@/components/ui/button';
import { logout } from '@/lib/auth';
import { LogOut, Trophy, BookOpen } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function Playbook() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [client, setClient] = useState<Client | null>(null);
  const [stages, setStages] = useState<StageWithModules[]>([]);
  const [completions, setCompletions] = useState<ModuleCompletion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadData(); }, []);

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-sky-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm text-muted-foreground">Loading playbook…</span>
        </div>
      </div>
    );
  }

  if (!client) return null;

  const totalModules = stages.reduce((sum, s) => sum + s.modules.length, 0);
  const completedModules = stages.reduce((sum, s) => sum + s.modules.filter(m => isModuleCompleted(m.id, completions)).length, 0);
  const allComplete = totalModules > 0 && completedModules === totalModules;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-border/60 bg-background/80 backdrop-blur-xl">
        <div className="max-w-3xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-sky-500/10 flex items-center justify-center">
                <BookOpen className="w-4.5 h-4.5 text-sky-500" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-foreground">{client.brand_name}</h1>
                <p className="text-[11px] text-muted-foreground uppercase tracking-wider font-medium">Editing Playbook</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => { logout(); navigate('/login'); }}
              className="text-muted-foreground hover:text-foreground rounded-xl text-xs"
            >
              <LogOut className="w-3.5 h-3.5 mr-1.5" /> Logout
            </Button>
          </div>
          <ProgressBar completed={completedModules} total={totalModules} />
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-8 space-y-6">
        {stages
          .sort((a, b) => a.sort_order - b.sort_order)
          .map(stage => (
            <StageSection
              key={stage.id}
              stage={stage}
              allStages={stages}
              completions={completions}
              onToggleComplete={handleToggleComplete}
            />
          ))}

        {/* Completion banner */}
        {allComplete && (
          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.04] p-8 text-center space-y-3">
            <Trophy className="w-12 h-12 text-emerald-500 mx-auto" />
            <h3 className="text-xl font-bold text-emerald-600 dark:text-emerald-400">All stages complete! 🎉</h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              You're now ready to edit live ads for {client.brand_name}. Great work!
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
