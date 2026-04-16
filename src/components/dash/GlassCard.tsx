import { forwardRef, HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
  delay?: number;
}

export const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, hover = true, delay = 0, style, children, ...rest }, ref) => (
    <div
      ref={ref}
      className={cn(
        'relative rounded-[12px] border transition-all duration-200 dash-card-enter',
        className,
      )}
      style={{
        background: 'var(--dash-bg-surface)',
        borderColor: 'var(--dash-border-subtle)',
        boxShadow: 'var(--dash-shadow-card)',
        animationDelay: `${delay}ms`,
        ...style,
      }}
      onMouseEnter={hover ? (e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.boxShadow = 'var(--dash-shadow-card-hover)';
        el.style.transform = 'translateY(-2px)';
      } : undefined}
      onMouseLeave={hover ? (e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.boxShadow = 'var(--dash-shadow-card)';
        el.style.transform = 'translateY(0)';
      } : undefined}
      {...rest}
    >
      {children}
    </div>
  ),
);
GlassCard.displayName = 'GlassCard';
