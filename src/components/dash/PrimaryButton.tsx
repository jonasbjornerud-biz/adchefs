import { ButtonHTMLAttributes, forwardRef } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PrimaryButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
}

export const PrimaryButton = forwardRef<HTMLButtonElement, PrimaryButtonProps>(
  ({ className, loading, children, disabled, ...rest }, ref) => (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={cn(
        'relative h-9 px-4 rounded-lg text-sm font-semibold text-white',
        'inline-flex items-center gap-2 transition-all duration-200 cursor-pointer',
        'disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden',
        loading && 'dash-shimmer',
        className,
      )}
      style={{
        background: 'linear-gradient(135deg, #A855F7, #6D28D9)',
        boxShadow: '0 4px 16px -4px rgba(168, 85, 247, 0.4)',
      }}
      onMouseEnter={(e) => {
        if (!(e.currentTarget as HTMLButtonElement).disabled) {
          (e.currentTarget as HTMLElement).style.boxShadow = '0 0 24px rgba(168,85,247,0.5), 0 4px 16px -4px rgba(168,85,247,0.5)';
        }
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 16px -4px rgba(168, 85, 247, 0.4)';
      }}
      {...rest}
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      {children}
    </button>
  ),
);
PrimaryButton.displayName = 'PrimaryButton';
