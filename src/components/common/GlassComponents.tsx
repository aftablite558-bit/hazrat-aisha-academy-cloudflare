import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface GlassProps {
  className?: string;
  children?: React.ReactNode;
}

export const GlassCard: React.FC<GlassProps & { variant?: 'light' | 'dark' | 'emerald' }> = ({ 
  className, 
  children, 
  variant = 'light' 
}) => {
  const variants = {
    light: 'bg-white/10 border-white/20 hover:bg-white/15',
    dark: 'bg-black/40 border-white/10 hover:bg-black/50',
    emerald: 'bg-emerald-500/10 border-emerald-500/20 hover:bg-emerald-500/15'
  };

  return (
    <div className={cn(
      "backdrop-blur-xl border rounded-3xl shadow-2xl transition-all duration-300",
      variants[variant],
      className
    )}>
      {children}
    </div>
  );
};

export const GlassButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { 
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger',
  size?: 'sm' | 'md' | 'lg'
}> = ({ 
  className, 
  children, 
  variant = 'primary', 
  size = 'md',
  ...props 
}) => {
  const variants = {
    primary: 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/30 shadow-emerald-500/10',
    secondary: 'bg-blue-500/20 border-blue-500/30 text-blue-400 hover:bg-blue-500/30 shadow-blue-500/10',
    outline: 'bg-transparent border-white/20 text-white hover:bg-white/10',
    ghost: 'bg-transparent border-transparent text-white/70 hover:text-white hover:bg-white/5',
    danger: 'bg-rose-500/20 border-rose-500/30 text-rose-400 hover:bg-rose-500/30 shadow-rose-500/10'
  };

  const sizes = {
    sm: 'px-4 py-1.5 text-sm',
    md: 'px-6 py-2.5',
    lg: 'px-8 py-3.5 text-lg'
  };

  return (
    <button 
      className={cn(
        "backdrop-blur-md border rounded-full font-bold transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export const GlassInput: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = ({ className, ...props }) => {
  return (
    <input 
      className={cn(
        "w-full bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl px-5 py-3.5 text-white placeholder:text-slate-500 outline-none focus:border-emerald-500/50 focus:bg-white/10 transition-all duration-300",
        className
      )}
      {...props}
    />
  );
};

export const GlassBadge: React.FC<GlassProps & { color?: 'emerald' | 'blue' | 'amber' | 'rose' | 'slate' }> = ({ 
  className, 
  children, 
  color = 'emerald' 
}) => {
  const colors = {
    emerald: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
    blue: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
    amber: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
    rose: 'bg-rose-500/10 border-rose-500/20 text-rose-400',
    slate: 'bg-slate-500/10 border-slate-500/20 text-slate-400'
  };

  return (
    <span className={cn(
      "px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase border backdrop-blur-sm",
      colors[color],
      className
    )}>
      {children}
    </span>
  );
};
