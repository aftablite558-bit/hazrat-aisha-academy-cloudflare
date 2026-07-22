import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const PremiumTextarea: React.FC<TextareaProps> = ({
  label,
  error,
  icon,
  className,
  ...props
}) => {
  return (
    <div className="space-y-2 w-full">
      {label && (
        <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest ml-1">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-5 top-5 text-neutral-400">
            {icon}
          </div>
        )}
        <textarea
          className={cn(
            'w-full bg-neutral-50/50 border border-neutral-100 rounded-2xl py-4 text-sm transition-all duration-300 min-h-[120px] resize-none',
            icon ? 'pl-14 pr-5' : 'px-5',
            'placeholder:text-neutral-400 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/30 focus:bg-white',
            error && 'border-rose-200 focus:ring-rose-500/10 focus:border-rose-500/30',
            className
          )}
          {...props}
        />
      </div>
      {error && (
        <p className="text-[10px] font-bold text-rose-500 uppercase tracking-wider ml-1">
          {error}
        </p>
      )}
    </div>
  );
};
