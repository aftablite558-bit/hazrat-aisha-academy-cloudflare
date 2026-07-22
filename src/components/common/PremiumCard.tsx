import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const PremiumCard: React.FC<{
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}> = ({ children, className, hoverable = true, padding = 'md' }) => {
  const paddings = {
    none: 'p-0',
    sm: 'p-4',
    md: 'p-8',
    lg: 'p-12',
  };

  return (
    <div className={cn(
      'bg-white rounded-[32px] border border-neutral-100/80 shadow-sm shadow-neutral-200/40 transition-all duration-500 ease-out',
      hoverable && 'hover:shadow-2xl hover:shadow-neutral-200/60 hover:-translate-y-1.5',
      paddings[padding],
      className
    )}>
      {children}
    </div>
  );
};
