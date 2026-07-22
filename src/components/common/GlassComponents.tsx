import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'dark' | 'muted';
}

export const GlassCard: React.FC<GlassCardProps> = ({ 
  children, 
  className, 
  variant = 'default' 
}) => {
  const variants = {
    default: 'bg-white/10 border-white/20',
    dark: 'bg-black/40 border-white/10',
    muted: 'bg-white/5 border-white/5'
  };

  return (
    <div className={cn(
      "backdrop-blur-md border rounded-3xl shadow-xl transition-all duration-300",
      variants[variant],
      className
    )}>
      {children}
    </div>
  );
};

interface GlassButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export const GlassButton: React.FC<GlassButtonProps> = ({
  children,
  className,
  variant = 'primary',
  size = 'md',
  ...props
}) => {
  const variants = {
    primary: 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/30',
    secondary: 'bg-white/10 border-white/20 text-white hover:bg-white/20',
    ghost: 'bg-transparent border-transparent text-white/70 hover:bg-white/5 hover:text-white'
  };

  const sizes = {
    sm: 'px-4 py-1.5 text-sm',
    md: 'px-6 py-2.5',
    lg: 'px-8 py-3.5 text-lg'
  };

  return (
    <button
      className={cn(
        "backdrop-blur-md border font-semibold rounded-full transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:pointer-events-none",
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
