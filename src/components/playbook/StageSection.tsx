import { Lock } from 'lucide-react';
import { StageWithModules, ModuleCompletion } from '@/types/playbook';
import { canAccessModule, isModuleCompleted, isStageUnlocked } from '@/lib/progression';
import { ModuleCard } from './ModuleCard';

interface StageSectionProps {
  stage: StageWithModules;
  allStages: StageWithModules[];
  completions: ModuleCompletion[];
  onToggleComplete: (moduleId: string, completed: boolean) => void;
}

const stageBadgeColors: Record<number, string> = {
  1: 'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400',
  2: 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400',
  3: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
};

export function StageSection({ stage, allStages, completions, onToggleComplete }: StageSectionProps) {
  const unlocked = isStageUnlocked(stage.stage_number, allStages, completions);
  const completedCount = stage.modules.filter(m => isModuleCompleted(m.id, completions)).length;

  return (
    <div className={`space-y-3 ${!unlocked ? 'opacity-60' : ''}`}>
      <div className="flex items-center gap-3 mb-4">
        <span className={`px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${stageBadgeColors[stage.stage_number] || stageBadgeColors[1]}`}>
          Stage {stage.stage_number}
        </span>
        <span className="text-sm font-medium text-foreground">{stage.title}</span>
        <span className="text-xs font-mono text-muted-foreground ml-auto">
          {completedCount}/{stage.modules.length}
        </span>
      </div>

      {!unlocked ? (
        <div className="flex items-center gap-2 p-4 rounded-xl border border-dashed border-border bg-muted/20 text-muted-foreground text-sm">
          <Lock className="w-4 h-4" />
          Complete Stage 1 to unlock
        </div>
      ) : (
        <div className="space-y-2">
          {stage.modules
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
            })}
        </div>
      )}
    </div>
  );
}
