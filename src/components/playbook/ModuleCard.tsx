import { useState } from 'react';
import { Check, Lock, ChevronDown, ChevronUp } from 'lucide-react';
import { Module, ModuleCompletion } from '@/types/playbook';
import { isModuleCompleted } from '@/lib/progression';
import { RichTextRenderer } from './RichTextRenderer';
import { Button } from '@/components/ui/button';

interface ModuleCardProps {
  module: Module;
  completions: ModuleCompletion[];
  isLocked: boolean;
  isActive: boolean;
  onToggleComplete: (moduleId: string, completed: boolean) => void;
}

export function ModuleCard({ module, completions, isLocked, isActive, onToggleComplete }: ModuleCardProps) {
  const [expanded, setExpanded] = useState(false);
  const completed = isModuleCompleted(module.id, completions);

  const handleClick = () => {
    if (!isLocked) setExpanded(!expanded);
  };

  return (
    <div
      className={`rounded-xl border transition-all duration-200 ${
        isLocked
          ? 'opacity-50 cursor-not-allowed border-border/50 bg-muted/30'
          : completed
          ? 'border-emerald-500/30 bg-emerald-50/50 dark:bg-emerald-950/10'
          : isActive
          ? 'border-sky-500/40 bg-sky-50/30 dark:bg-sky-950/10 shadow-sm shadow-sky-500/5'
          : 'border-border hover:border-border/80 bg-card hover:shadow-sm'
      }`}
    >
      <button
        onClick={handleClick}
        disabled={isLocked}
        className="w-full flex items-center gap-4 p-4 text-left"
      >
        {/* Completion indicator */}
        <div className={`flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-xs ${
          completed
            ? 'bg-emerald-500 text-white'
            : isLocked
            ? 'bg-muted text-muted-foreground'
            : 'border-2 border-sky-400/60 text-sky-500'
        }`}>
          {completed ? <Check className="w-4 h-4" /> : isLocked ? <Lock className="w-3.5 h-3.5" /> : null}
        </div>

        {/* Module number */}
        <span className="font-mono text-xs text-muted-foreground w-6">{module.module_number}</span>

        {/* Icon */}
        <span className="text-lg">{module.icon || '📄'}</span>

        {/* Title */}
        <span className={`flex-1 font-medium text-sm ${completed ? 'text-muted-foreground' : 'text-foreground'}`}>
          {module.title}
        </span>

        {/* Expand icon */}
        {!isLocked && (
          expanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />
        )}
      </button>

      {/* Expanded content */}
      {expanded && !isLocked && (
        <div className="px-4 pb-5 border-t border-border/50 pt-4 space-y-4">
          {module.definition_of_done && (
            <div className="rounded-lg bg-sky-50 dark:bg-sky-950/20 border border-sky-200/50 dark:border-sky-800/30 p-3">
              <p className="text-xs font-semibold text-sky-700 dark:text-sky-400 uppercase tracking-wider mb-1">Definition of Done</p>
              <p className="text-sm text-foreground/80">{module.definition_of_done}</p>
            </div>
          )}

          {module.content && (
            <div className="prose prose-sm max-w-none dark:prose-invert">
              <RichTextRenderer content={module.content} />
            </div>
          )}

          <div className="pt-2">
            {completed ? (
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => { e.stopPropagation(); onToggleComplete(module.id, false); }}
                className="text-muted-foreground"
              >
                Undo completion
              </Button>
            ) : (
              <Button
                size="sm"
                onClick={(e) => { e.stopPropagation(); onToggleComplete(module.id, true); }}
                className="bg-sky-500 hover:bg-sky-600 text-white"
              >
                <Check className="w-4 h-4 mr-1" /> Mark as completed
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
