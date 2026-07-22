import { ReactNode } from 'react';
import { cn } from '../../utils/index';

interface GlassBadgeProps {
  children: ReactNode;
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'default';
  className?: string;
}

export const GlassBadge = ({ children, variant = 'default', className }: GlassBadgeProps) => {
  const variants = {
    primary: 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 font-bold',
    success: 'bg-success-500/20 text-success-600 dark:text-success-400 border border-success-500/30',
    warning: 'bg-warning-500/20 text-warning-600 dark:text-warning-400 border border-warning-500/30',
    danger: 'bg-danger-500/20 text-danger-600 dark:text-danger-400 border border-danger-500/30',
    default: 'glass text-secondary-foreground border border-white/20 dark:border-white/10',
  };

  return (
    <span
      className={cn(
        'px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md shadow-sm',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
};
