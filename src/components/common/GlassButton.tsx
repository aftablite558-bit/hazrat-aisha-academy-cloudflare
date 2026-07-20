import { motion } from 'motion/react';
import { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '../../utils/index';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'glass' | 'ghost' | 'outline';
  children: ReactNode;
}

export const GlassButton = ({ variant = 'primary', className, children, ...props }: ButtonProps) => {
  const variants = {
    primary: 'bg-[rgba(6,182,212,0.4)] backdrop-blur-xl border border-[rgba(6,182,212,0.5)] shadow-[0_0_20px_rgba(6,182,212,0.4),inset_0_2px_4px_rgba(255,255,255,0.4)] text-white hover:shadow-[0_15px_45px_rgba(0,0,0,0.15),0_0_30px_rgba(6,182,212,0.6)] relative overflow-hidden group',
    glass: 'glass !rounded-full text-foreground font-semibold hover:shadow-[0_15px_45px_rgba(0,0,0,0.15)] group',
    ghost: 'hover:bg-black/5 dark:hover:bg-white/10 text-secondary-foreground !rounded-full',
    outline: 'border border-white/35 dark:border-white/10 glass !rounded-full text-secondary-foreground hover:shadow-md group',
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={cn('px-8 py-3.5 rounded-full font-medium transition-all duration-300 flex items-center justify-center gap-2', variants[variant], className)}
      {...props as any}
    >
      {variant === 'primary' && (
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      )}
      {(variant === 'glass' || variant === 'outline') && (
         <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full pointer-events-none" />
      )}
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </motion.button>
  );
};
