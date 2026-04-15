import { Module, ModuleCompletion, StageWithModules } from '@/types/playbook';

export function isModuleCompleted(moduleId: string, completions: ModuleCompletion[]): boolean {
  return completions.some(c => c.module_id === moduleId && c.completed);
}

export function canAccessModule(
  stageNumber: number,
  moduleIndex: number,
  stagesWithModules: StageWithModules[],
  completions: ModuleCompletion[]
): boolean {
  const stage1 = stagesWithModules.find(s => s.stage_number === 1);
  
  if (stageNumber === 1) {
    if (moduleIndex === 0) return true;
    const prevModule = stage1?.modules[moduleIndex - 1];
    return prevModule ? isModuleCompleted(prevModule.id, completions) : false;
  }

  // Stage 2 and 3: all stage 1 modules must be complete
  if (stage1) {
    const allStage1Complete = stage1.modules.every(m => isModuleCompleted(m.id, completions));
    if (!allStage1Complete) return false;
  }

  if (moduleIndex === 0) return true;
  
  const currentStage = stagesWithModules.find(s => s.stage_number === stageNumber);
  const prevModule = currentStage?.modules[moduleIndex - 1];
  return prevModule ? isModuleCompleted(prevModule.id, completions) : false;
}

export function isStageUnlocked(
  stageNumber: number,
  stagesWithModules: StageWithModules[],
  completions: ModuleCompletion[]
): boolean {
  if (stageNumber === 1) return true;
  const stage1 = stagesWithModules.find(s => s.stage_number === 1);
  if (!stage1) return true;
  return stage1.modules.every(m => isModuleCompleted(m.id, completions));
}
