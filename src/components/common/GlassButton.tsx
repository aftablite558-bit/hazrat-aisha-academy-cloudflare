import { motion, HTMLMotionProps } from 'motion/react';
import { ReactNode } from 'react';
import { cn } from '../../utils/index';

export interface ButtonProps extends HTMLMotionProps<'button'> {
  variant?: 'primary' | 'gold' | 'glass' | 'ghost' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  className?: string;
}

export const GlassButton = ({
  variant = 'primary',
  size = 'md',
  children,
  icon,
  iconPosition = 'right',
  className,
  ...props
}: ButtonProps) => {
  const sizeClasses = {
    sm: 'px-4 py-2 text-xs font-bold rounded-xl gap-1.5',
    md: 'px-6 py-3 text-sm font-extrabold rounded-2xl gap-2',
    lg: 'px-8 py-4 text-base font-black rounded-2xl gap-2.5',
  };

  const variantClasses = {
    primary: 'bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 text-white shadow-lg shadow-emerald-950/40 border border-emerald-400/40 hover:shadow-emerald-500/25',
    gold: 'bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-slate-950 font-black shadow-lg shadow-amber-950/40 border border-amber-300/50 hover:shadow-amber-500/30',
    glass: 'bg-slate-900/60 dark:bg-slate-950/70 backdrop-blur-xl border border-white/10 text-foreground hover:bg-slate-800/80 hover:border-emerald-500/40 shadow-md',
    outline: 'border border-emerald-500/30 dark:border-amber-500/30 bg-emerald-500/5 hover:bg-emerald-500/10 text-foreground hover:border-emerald-500/60',
    ghost: 'hover:bg-white/10 dark:hover:bg-white/5 text-muted-foreground hover:text-foreground',
    danger: 'bg-gradient-to-r from-rose-600 to-red-600 text-white shadow-lg shadow-rose-950/40 border border-rose-400/30 hover:shadow-rose-500/25',
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        'relative inline-flex items-center justify-center transition-all duration-300 overflow-hidden group select-none cursor-pointer',
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
      {...props}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none" />

      {icon && iconPosition === 'left' && <span className="shrink-0">{icon}</span>}
      <span className="relative z-10 flex items-center gap-2">{children}</span>
      {icon && iconPosition === 'right' && <span className="shrink-0 transition-transform group-hover:translate-x-1">{icon}</span>}
    </motion.button>
  );
};

export const PremiumButton = GlassButton;
export const Button = GlassButton;

