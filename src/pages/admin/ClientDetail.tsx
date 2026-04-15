import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Client, Stage, Module, ModuleCompletion, StageWithModules } from '@/types/playbook';
import { isModuleCompleted, canAccessModule, isStageUnlocked } from '@/lib/progression';
import { ProgressBar } from '@/components/playbook/ProgressBar';
import { RichTextRenderer } from '@/components/playbook/RichTextRenderer';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit, Trash2, RotateCcw, ChevronRight, Check, Lock, BookOpen, Shield, Circle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { generatePassword } from '@/lib/auth';

/* ─── Admin Module Card ─── */
function AdminModuleCard({
  module,
  completed,
  isLocked,
  isActive,
  onToggleComplete,
}: {
  module: Module;
  completed: boolean;
  isLocked: boolean;
  isActive: boolean;
  onToggleComplete: (moduleId: string, completed: boolean) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const [justCompleted, setJustCompleted] = useState(false);
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; color: string; angle: number; speed: number }[]>([]);

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isLocked) return;

    if (!completed) {
      // Trigger celebration
      setJustCompleted(true);
      const colors = ['#22c55e', '#4ade80', '#86efac', '#10b981', '#34d399', '#6ee7b7', '#a7f3d0'];
      const newParticles = Array.from({ length: 16 }, (_, i) => ({
        id: Date.now() + i,
        x: 0,
        y: 0,
        color: colors[Math.floor(Math.random() * colors.length)],
        angle: (360 / 16) * i + (Math.random() * 20 - 10),
        speed: 40 + Math.random() * 30,
      }));
      setParticles(newParticles);
      setTimeout(() => { setJustCompleted(false); setParticles([]); }, 800);
    }

    onToggleComplete(module.id, !completed);
  };

  return (
    <div
      className={`group relative rounded-2xl border transition-all duration-500 overflow-visible ${
        isLocked
          ? 'opacity-40 cursor-not-allowed border-border/20 bg-muted/5'
          : completed
          ? 'border-emerald-500/20 bg-gradient-to-r from-emerald-500/[0.04] to-emerald-500/[0.01]'
          : isActive
          ? 'border-sky-500/30 bg-gradient-to-br from-sky-500/[0.05] to-transparent shadow-[0_0_24px_-6px_hsl(200_90%_50%/0.1)]'
          : 'border-border/40 bg-card/40 hover:border-border/70 hover:bg-card/60'
      } ${justCompleted ? 'scale-[1.01]' : ''}`}
    >
      {/* Active indicator bar */}
      {isActive && !isLocked && (
        <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-sky-400 to-sky-600 rounded-full" />
      )}
      {completed && (
        <div className={`absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-emerald-400 to-emerald-600 rounded-full transition-all duration-500 ${justCompleted ? 'shadow-[0_0_8px_hsl(160_84%_39%/0.6)]' : ''}`} />
      )}

      <div className="flex items-stretch">
        {/* Completion checkbox area */}
        <button
          onClick={handleToggle}
          disabled={isLocked}
          className={`relative flex-shrink-0 w-16 flex items-center justify-center border-r transition-colors ${
            isLocked
              ? 'border-border/10 cursor-not-allowed'
              : completed
              ? 'border-emerald-500/10 hover:bg-emerald-500/10 cursor-pointer'
              : 'border-border/20 hover:bg-sky-500/5 cursor-pointer'
          }`}
        >
          {/* Particle burst */}
          {particles.map(p => (
            <span
              key={p.id}
              className="absolute w-1.5 h-1.5 rounded-full pointer-events-none"
              style={{
                background: p.color,
                left: '50%',
                top: '50%',
                animation: `particle-burst 0.7s cubic-bezier(0.22, 1, 0.36, 1) forwards`,
                transform: `translate(-50%, -50%)`,
                ['--angle' as string]: `${p.angle}deg`,
                ['--dist' as string]: `${p.speed}px`,
              }}
            />
          ))}

          <div className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-300 ${
            completed
              ? `bg-emerald-500 shadow-[0_0_14px_hsl(160_84%_39%/0.35)] ${justCompleted ? 'scale-125' : 'scale-100'}`
              : isLocked
              ? 'bg-muted/30 border border-border/30'
              : isActive
              ? 'border-2 border-sky-400/70 hover:border-sky-400 hover:scale-110 shadow-[0_0_10px_hsl(200_90%_50%/0.12)]'
              : 'border-2 border-border/40 hover:border-border/70 hover:scale-110'
          }`}>
            {completed ? (
              <Check className={`w-4 h-4 text-white transition-transform duration-300 ${justCompleted ? 'scale-125' : ''}`} strokeWidth={3} />
            ) : isLocked ? (
              <Lock className="w-3 h-3 text-muted-foreground/30" />
            ) : isActive ? (
              <Circle className="w-2 h-2 fill-sky-400/50 text-sky-400/50" />
            ) : null}
          </div>
        </button>
        {/* Content area */}
        <button
          onClick={() => { if (!isLocked) setExpanded(!expanded); }}
          disabled={isLocked}
          className="flex-1 flex items-center gap-3.5 px-4 py-4 text-left min-w-0 cursor-pointer disabled:cursor-not-allowed"
        >
          <span className="text-xl leading-none">{module.icon || '📄'}</span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className={`font-semibold text-[15px] leading-tight ${
                completed ? 'text-muted-foreground/70' : isLocked ? 'text-muted-foreground/40' : 'text-foreground'
              }`}>
                {module.title}
              </span>
              {completed && (
                <span className="text-[9px] font-bold uppercase tracking-widest text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded-md">
                  Done
                </span>
              )}
            </div>
            {module.definition_of_done && !expanded && (
              <p className="text-xs text-muted-foreground/60 mt-1 line-clamp-1 leading-relaxed">
                {module.definition_of_done}
              </p>
            )}
          </div>

          <span className="font-mono text-[10px] text-muted-foreground/40 tracking-wider tabular-nums">
            {module.module_number}
          </span>
          {!isLocked && (
            <ChevronRight className={`w-4 h-4 text-muted-foreground/30 transition-transform duration-300 flex-shrink-0 ${
              expanded ? 'rotate-90' : 'group-hover:translate-x-0.5'
            }`} />
          )}
        </button>
      </div>

      {/* Expandable content */}
      {expanded && !isLocked && (
        <div ref={contentRef} className="border-t border-border/20">
          <div className="px-5 py-5 space-y-5 ml-16">
            {module.definition_of_done && (
              <div className="rounded-xl bg-sky-500/[0.05] border border-sky-500/10 p-4">
                <p className="text-[10px] font-bold text-sky-600 dark:text-sky-400 uppercase tracking-[0.15em] mb-1.5">
                  Definition of Done
                </p>
                <p className="text-sm text-foreground/70 leading-relaxed">{module.definition_of_done}</p>
              </div>
            )}

            {module.content && (
              <div className="prose prose-sm max-w-none dark:prose-invert">
                <RichTextRenderer content={module.content} />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Main Page ─── */
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

  const handleToggleComplete = useCallback(async (moduleId: string, completed: boolean) => {
    if (!clientId) return;

    if (completed) {
      const { data, error } = await supabase.from('module_completions').upsert({
        module_id: moduleId,
        client_id: clientId,
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
        .eq('client_id', clientId);

      setCompletions(prev => prev.filter(c => c.module_id !== moduleId));
    }
  }, [clientId, toast]);

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

  const stageThemes: Record<number, { accent: string; bg: string; border: string; icon: string }> = {
    1: { accent: 'text-sky-500', bg: 'from-sky-500/[0.06] to-sky-500/[0.01]', border: 'border-sky-500/15', icon: '📋' },
    2: { accent: 'text-violet-500', bg: 'from-violet-500/[0.06] to-violet-500/[0.01]', border: 'border-violet-500/15', icon: '⚡' },
    3: { accent: 'text-amber-500', bg: 'from-amber-500/[0.06] to-amber-500/[0.01]', border: 'border-amber-500/15', icon: '🧠' },
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Sticky header */}
      <header className="sticky top-0 z-20 border-b border-border/40 bg-background/80 backdrop-blur-xl">
        <div className="max-w-3xl mx-auto px-6 py-3 flex items-center justify-between">
          <button onClick={() => navigate('/admin')} className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> Dashboard
          </button>
          <div className="flex gap-1.5">
            <Button variant="outline" size="sm" onClick={() => navigate(`/admin/clients/${clientId}/playbook`)} className="rounded-xl text-[11px] h-8 px-3">
              <Edit className="w-3 h-3 mr-1" /> Edit Playbook
            </Button>
            <Button variant="outline" size="sm" onClick={resetPassword} className="rounded-xl text-[11px] h-8 px-3">
              <RotateCcw className="w-3 h-3 mr-1" /> Reset PW
            </Button>
            <Button variant="outline" size="sm" onClick={handleDelete} className="rounded-xl text-[11px] h-8 px-3 text-destructive hover:text-destructive">
              <Trash2 className="w-3 h-3 mr-1" /> Delete
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-8 space-y-8">
        {/* Hero section */}
        <div className="rounded-2xl border border-border/30 bg-gradient-to-br from-card/80 to-card/40 p-8 space-y-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-sky-500/20 to-violet-500/10 border border-sky-500/10 flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-sky-500" />
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

            {/* Stats */}
            <div className="flex gap-6 text-right">
              <div>
                <p className="text-2xl font-bold font-mono text-foreground">
                  {totalModules > 0 ? Math.round((completedModules / totalModules) * 100) : 0}%
                </p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">Complete</p>
              </div>
              <div>
                <p className="text-2xl font-bold font-mono text-foreground">{completedModules}/{totalModules}</p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">Modules</p>
              </div>
            </div>
          </div>

          <ProgressBar completed={completedModules} total={totalModules} />
        </div>

        {/* Stages */}
        {stages
          .sort((a, b) => a.sort_order - b.sort_order)
          .map(stage => {
            const theme = stageThemes[stage.stage_number] || stageThemes[1];
            const stageCompleted = stage.modules.filter(m => isModuleCompleted(m.id, completions)).length;
            const stageTotal = stage.modules.length;
            const pct = stageTotal > 0 ? Math.round((stageCompleted / stageTotal) * 100) : 0;
            const unlocked = isStageUnlocked(stage.stage_number, stages, completions);

            return (
              <div key={stage.id} className={`rounded-2xl border ${theme.border} bg-gradient-to-br ${theme.bg} overflow-hidden transition-all duration-300 ${!unlocked ? 'opacity-50' : ''}`}>
                {/* Stage header */}
                <div className="px-6 py-5 flex items-center gap-4">
                  <span className="text-2xl">{theme.icon}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2.5 mb-0.5">
                      <span className={`text-[10px] font-bold uppercase tracking-[0.2em] ${theme.accent}`}>
                        Stage {stage.stage_number}
                      </span>
                      {!unlocked && (
                        <span className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-muted-foreground/50 bg-muted/20 px-1.5 py-0.5 rounded-md">
                          <Lock className="w-2.5 h-2.5" /> Locked
                        </span>
                      )}
                      {stageCompleted === stageTotal && stageTotal > 0 && (
                        <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded-md">
                          ✓ Complete
                        </span>
                      )}
                    </div>
                    <h3 className="text-base font-semibold text-foreground">{stage.title}</h3>
                  </div>

                  {/* Mini ring */}
                  <div className="relative w-11 h-11">
                    <svg className="w-11 h-11 -rotate-90" viewBox="0 0 36 36">
                      <circle cx="18" cy="18" r="14" fill="none" strokeWidth="2.5" className="stroke-border/20" />
                      <circle cx="18" cy="18" r="14" fill="none" strokeWidth="2.5"
                        strokeDasharray={`${pct} ${100 - pct}`}
                        strokeLinecap="round"
                        className={pct === 100 ? 'stroke-emerald-500' : 'stroke-sky-500'}
                        style={{ transition: 'stroke-dasharray 0.6s ease' }}
                      />
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center text-[9px] font-bold font-mono text-muted-foreground">
                      {stageCompleted}/{stageTotal}
                    </span>
                  </div>
                </div>

                {/* Module list */}
                {!unlocked ? (
                  <div className="px-4 pb-4">
                    <div className="flex items-center gap-3 p-5 rounded-xl border border-dashed border-border/20 bg-muted/5 text-muted-foreground/40 text-sm">
                      <Lock className="w-4 h-4" />
                      Complete all Stage 1 modules to unlock
                    </div>
                  </div>
                ) : stage.modules.length === 0 ? (
                  <div className="px-4 pb-4">
                    <p className="text-sm text-muted-foreground/50 italic p-4">No modules yet</p>
                  </div>
                ) : (
                  <div className="px-4 pb-4 space-y-2">
                    {stage.modules.sort((a, b) => a.sort_order - b.sort_order).map((module, idx) => {
                      const accessible = canAccessModule(stage.stage_number, idx, stages, completions);
                      const isActive = accessible && !isModuleCompleted(module.id, completions);
                      return (
                        <AdminModuleCard
                          key={module.id}
                          module={module}
                          completed={isModuleCompleted(module.id, completions)}
                          isLocked={!accessible}
                          isActive={isActive}
                          onToggleComplete={handleToggleComplete}
                        />
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
      </main>
    </div>
  );
}
