import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  cta?: { label: string; onClick?: () => void; href?: string };
  className?: string;
}

export function EmptyState({ icon: Icon, title, description, cta, className = '' }: EmptyStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center text-center py-16 px-6 ${className}`}>
      <Icon className="w-10 h-10 mb-4" style={{ color: 'rgba(255,255,255,0.2)' }} strokeWidth={1.5} />
      <p className="text-sm dash-font-body" style={{ color: 'var(--dash-text-secondary)' }}>{title}</p>
      {description && (
        <p className="text-xs mt-1.5 max-w-sm dash-font-body" style={{ color: 'var(--dash-text-tertiary)' }}>
          {description}
        </p>
      )}
      {cta && (
        cta.href ? (
          <a href={cta.href} className="mt-4 text-xs font-semibold transition-opacity hover:opacity-80" style={{ color: 'var(--dash-accent-glow)' }}>
            {cta.label} →
          </a>
        ) : (
          <button onClick={cta.onClick} className="mt-4 text-xs font-semibold transition-opacity hover:opacity-80 cursor-pointer" style={{ color: 'var(--dash-accent-glow)' }}>
            {cta.label} →
          </button>
        )
      )}
    </div>
  );
}
