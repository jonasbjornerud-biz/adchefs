import { cn } from '@/lib/utils';

type Variant = 'active' | 'paused' | 'success' | 'danger' | 'warning' | 'info' | 'neutral';

interface StatusPillProps {
  variant?: Variant;
  children: React.ReactNode;
  className?: string;
  dot?: boolean;
  icon?: React.ReactNode;
}

const variants: Record<Variant, { bg: string; text: string; dot: string }> = {
  active:  { bg: 'rgba(16, 185, 129, 0.12)',  text: '#10B981', dot: '#10B981' },
  success: { bg: 'rgba(16, 185, 129, 0.12)',  text: '#10B981', dot: '#10B981' },
  paused:  { bg: 'rgba(245, 158, 11, 0.12)',  text: '#F59E0B', dot: '#F59E0B' },
  warning: { bg: 'rgba(245, 158, 11, 0.12)',  text: '#F59E0B', dot: '#F59E0B' },
  danger:  { bg: 'rgba(239, 68, 68, 0.12)',   text: '#EF4444', dot: '#EF4444' },
  info:    { bg: 'rgba(168, 85, 247, 0.12)',  text: '#C084FC', dot: '#A855F7' },
  neutral: { bg: 'rgba(255, 255, 255, 0.06)', text: '#A1A1AA', dot: '#A1A1AA' },
};

export function StatusPill({ variant = 'neutral', children, className, dot, icon }: StatusPillProps) {
  const v = variants[variant];
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wider',
        className,
      )}
      style={{ background: v.bg, color: v.text }}
    >
      {dot && <span className="w-1.5 h-1.5 rounded-full" style={{ background: v.dot }} />}
      {icon}
      {children}
    </span>
  );
}
