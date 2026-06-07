import { useState, useRef, useEffect } from 'react';
import { Check, Lock, ChevronRight, Circle } from 'lucide-react';
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
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState(0);
  const completed = isModuleCompleted(module.id, completions);

  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight);
    }
  }, [expanded, module.content]);

  const handleClick = () => {
    if (!isLocked) setExpanded(!expanded);
  };

  return (
    <div
      className={`group rounded-2xl border transition-all duration-300 overflow-hidden ${
        isLocked
          ? 'opacity-40 cursor-not-allowed border-border/30 bg-muted/10'
          : completed
          ? 'border-emerald-500/20 bg-emerald-500/[0.03] hover:border-emerald-500/30'
          : isActive
          ? 'border-sky-500/30 bg-sky-500/[0.03] hover:border-sky-500/50 shadow-[0_0_20px_-5px_hsl(200_90%_50%/0.08)]'
          : 'border-border/60 bg-card/50 hover:border-border hover:bg-card/80'
      }`}
    >
      {/* Clickable header */}
      <button
        onClick={handleClick}
        disabled={isLocked}
        className="w-full flex items-center gap-4 px-5 py-4 text-left cursor-pointer disabled:cursor-not-allowed"
      >
        {/* Status indicator */}
        <div className={`relative flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
          completed
            ? 'bg-emerald-500 shadow-[0_0_12px_hsl(160_84%_39%/0.3)]'
            : isLocked
            ? 'bg-muted/50'
            : isActive
            ? 'border-2 border-sky-400 shadow-[0_0_10px_hsl(200_90%_50%/0.15)]'
            : 'border-2 border-border/60'
        }`}>
          {completed ? (
            <Check className="w-4 h-4 text-white" strokeWidth={3} />
          ) : isLocked ? (
            <Lock className="w-3.5 h-3.5 text-muted-foreground/50" />
          ) : isActive ? (
            <Circle className="w-2.5 h-2.5 fill-sky-400 text-sky-400" />
          ) : null}
        </div>

        {/* Icon + title */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2.5">
            <span className="text-lg leading-none">{module.icon || '📄'}</span>
            <span className={`font-semibold text-[15px] truncate ${
              completed ? 'text-muted-foreground line-through decoration-emerald-500/30' : 'text-foreground'
            }`}>
              {module.title}
            </span>
          </div>
          {module.definition_of_done && !expanded && (
            <p className="text-xs text-muted-foreground mt-1 ml-[30px] line-clamp-1">
              {module.definition_of_done}
            </p>
          )}
        </div>

        {/* Module number + chevron */}
        <span className="font-mono text-[11px] text-muted-foreground/60 tracking-wider">
          {module.module_number}
        </span>
        {!isLocked && (
          <ChevronRight className={`w-4 h-4 text-muted-foreground/40 transition-transform duration-300 ${
            expanded ? 'rotate-90' : 'group-hover:translate-x-0.5'
          }`} />
        )}
      </button>

      {/* Expandable content */}
      <div
        ref={contentRef}
        className="transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{
          maxHeight: expanded ? `${contentHeight + 100}px` : '0px',
          opacity: expanded ? 1 : 0,
        }}
      >
        <div className="px-5 pb-5 space-y-5">
          <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />

          {module.definition_of_done && (
            <div className="rounded-xl bg-sky-500/[0.06] border border-sky-500/10 p-4">
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

          <div className="flex items-center gap-3 pt-2">
            {completed ? (
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => { e.stopPropagation(); onToggleComplete(module.id, false); }}
                className="text-muted-foreground rounded-xl text-xs h-9"
              >
                Undo completion
              </Button>
            ) : (
              <Button
                size="sm"
                onClick={(e) => { e.stopPropagation(); onToggleComplete(module.id, true); }}
                className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs h-9 shadow-[0_2px_10px_hsl(160_84%_39%/0.25)]"
              >
                <Check className="w-3.5 h-3.5 mr-1.5" /> Mark complete
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
