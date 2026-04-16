import { ArrowLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Crumb { label: string; }

interface PageHeaderProps {
  backTo?: string;
  crumbs: Crumb[];
  badge?: { label: string };
  rightSlot?: React.ReactNode;
}

export function PageHeader({ backTo, crumbs, badge, rightSlot }: PageHeaderProps) {
  const navigate = useNavigate();
  return (
    <header
      className="sticky top-0 z-40 border-b backdrop-blur-xl"
      style={{
        background: 'rgba(10, 10, 15, 0.85)',
        borderColor: 'var(--dash-border-subtle)',
      }}
    >
      <div className="max-w-[1280px] mx-auto px-5 md:px-8 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2.5 min-w-0">
          {backTo && (
            <button
              onClick={() => navigate(backTo)}
              className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer hover:bg-white/[0.04]"
              aria-label="Back"
            >
              <ArrowLeft className="w-4 h-4" style={{ color: 'var(--dash-text-tertiary)' }} />
            </button>
          )}
          {crumbs.map((c, i) => (
            <div key={i} className="flex items-center gap-2.5 min-w-0">
              <span
                className="text-sm font-semibold truncate dash-font-body"
                style={{ color: i === crumbs.length - 1 ? 'var(--dash-text-primary)' : 'var(--dash-text-tertiary)' }}
              >
                {c.label}
              </span>
              {i < crumbs.length - 1 && (
                <ChevronRight className="w-3.5 h-3.5 shrink-0" style={{ color: 'var(--dash-text-tertiary)' }} />
              )}
            </div>
          ))}
          {badge && (
            <span
              className="ml-1 px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wider whitespace-nowrap"
              style={{
                background: 'var(--dash-accent-subtle)',
                color: 'var(--dash-accent-glow)',
                border: '1px solid rgba(168, 85, 247, 0.2)',
              }}
            >
              {badge.label}
            </span>
          )}
        </div>
        {rightSlot && <div className="flex items-center gap-2">{rightSlot}</div>}
      </div>
    </header>
  );
}
