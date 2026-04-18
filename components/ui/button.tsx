import { type ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils/cn';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  fullWidth?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant = 'primary', size = 'md', loading, fullWidth, children, disabled, ...props },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          'relative inline-flex items-center justify-center gap-2 rounded-xl font-heading font-bold transition-all duration-100 active:translate-y-1 active:shadow-none disabled:cursor-not-allowed disabled:opacity-50',
          {
            'h-9 px-4 text-sm': size === 'sm',
            'h-11 px-6 text-base': size === 'md',
            'h-14 px-8 text-lg': size === 'lg',
            'w-full': fullWidth,
            'bg-primary text-primary-fg shadow-press hover:bg-primary-hover': variant === 'primary',
            'border-2 border-border bg-surface text-text shadow-sm hover:bg-bg': variant === 'secondary',
            'bg-transparent text-text-muted shadow-none hover:bg-primary/10 hover:text-text': variant === 'ghost',
            'border-2 border-danger/30 bg-danger/10 text-danger shadow-sm hover:bg-danger/20':
              variant === 'danger',
          },
          className
        )}
        {...props}
      >
        {loading ? (
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : null}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
export { Button };
