import { Lock, ChevronDown } from 'lucide-react';
import { StageWithModules, ModuleCompletion } from '@/types/playbook';
import { canAccessModule, isModuleCompleted, isStageUnlocked } from '@/lib/progression';
import { ModuleCard } from './ModuleCard';
import { useState } from 'react';

interface StageSectionProps {
  stage: StageWithModules;
  allStages: StageWithModules[];
  completions: ModuleCompletion[];
  onToggleComplete: (moduleId: string, completed: boolean) => void;
}

const stageThemes: Record<number, { accent: string; bg: string; border: string; glow: string }> = {
  1: {
    accent: 'text-sky-600 dark:text-sky-400',
    bg: 'bg-sky-500/[0.04]',
    border: 'border-sky-500/10',
    glow: 'shadow-[0_0_30px_-10px_hsl(200_90%_50%/0.08)]',
  },
  2: {
    accent: 'text-violet-600 dark:text-violet-400',
    bg: 'bg-violet-500/[0.04]',
    border: 'border-violet-500/10',
    glow: 'shadow-[0_0_30px_-10px_hsl(262_83%_58%/0.08)]',
  },
  3: {
    accent: 'text-amber-600 dark:text-amber-400',
    bg: 'bg-amber-500/[0.04]',
    border: 'border-amber-500/10',
    glow: 'shadow-[0_0_30px_-10px_hsl(38_92%_50%/0.08)]',
  },
};

export function StageSection({ stage, allStages, completions, onToggleComplete }: StageSectionProps) {
  const unlocked = isStageUnlocked(stage.stage_number, allStages, completions);
  const completedCount = stage.modules.filter(m => isModuleCompleted(m.id, completions)).length;
  const total = stage.modules.length;
  const allDone = total > 0 && completedCount === total;
  const theme = stageThemes[stage.stage_number] || stageThemes[1];
  const [collapsed, setCollapsed] = useState(false);

  const pct = total > 0 ? Math.round((completedCount / total) * 100) : 0;

  return (
    <div className={`rounded-2xl border ${theme.border} ${theme.bg} ${theme.glow} overflow-hidden transition-all duration-300`}>
      {/* Stage header */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="w-full flex items-center gap-4 px-6 py-5 text-left"
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <span className={`text-[11px] font-bold uppercase tracking-[0.15em] ${theme.accent}`}>
              Stage {stage.stage_number}
            </span>
            {allDone && (
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                Complete
              </span>
            )}
            {!unlocked && (
              <span className="flex items-center gap-1 text-[10px] font-medium text-muted-foreground/60 bg-muted/30 px-2 py-0.5 rounded-full">
                <Lock className="w-3 h-3" /> Locked
              </span>
            )}
          </div>
          <h3 className="text-lg font-semibold text-foreground">{stage.title}</h3>
        </div>

        <div className="flex items-center gap-4">
          {/* Mini progress ring */}
          <div className="relative w-10 h-10">
            <svg className="w-10 h-10 -rotate-90" viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="15.5" fill="none" strokeWidth="2.5"
                className="stroke-border/30" />
              <circle cx="18" cy="18" r="15.5" fill="none" strokeWidth="2.5"
                strokeDasharray={`${pct} ${100 - pct}`}
                strokeLinecap="round"
                className={allDone ? 'stroke-emerald-500' : 'stroke-sky-500'}
                style={{ transition: 'stroke-dasharray 0.5s ease' }}
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold font-mono text-muted-foreground">
              {completedCount}/{total}
            </span>
          </div>

          <ChevronDown className={`w-4 h-4 text-muted-foreground/40 transition-transform duration-300 ${collapsed ? '-rotate-90' : ''}`} />
        </div>
      </button>

      {/* Modules */}
      {!collapsed && (
        <div className="px-4 pb-4 space-y-2">
          {!unlocked ? (
            <div className="flex items-center gap-3 p-5 rounded-xl border border-dashed border-border/40 bg-muted/10 text-muted-foreground/60 text-sm">
              <Lock className="w-4 h-4" />
              Complete all Stage 1 modules to unlock
            </div>
          ) : (
            stage.modules
              .sort((a, b) => a.sort_order - b.sort_order)
              .map((module, idx) => {
                const accessible = canAccessModule(stage.stage_number, idx, allStages, completions);
                const isActive = accessible && !isModuleCompleted(module.id, completions);
                return (
                  <ModuleCard
                    key={module.id}
                    module={module}
                    completions={completions}
                    isLocked={!accessible}
                    isActive={isActive}
                    onToggleComplete={onToggleComplete}
                  />
                );
              })
          )}
        </div>
      )}
    </div>
  );
}
