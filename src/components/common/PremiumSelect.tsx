import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { ChevronDown } from 'lucide-react';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { label: string; value: string | number }[];
}

export const PremiumSelect: React.FC<SelectProps> = ({
  label,
  error,
  options,
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
      <div className="relative group">
        <select
          className={cn(
            'w-full bg-neutral-50/50 border border-neutral-100 rounded-2xl px-5 py-3.5 text-sm transition-all duration-300 appearance-none cursor-pointer',
            'focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/30 focus:bg-white',
            error && 'border-rose-200 focus:ring-rose-500/10 focus:border-rose-500/30',
            className
          )}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-400 group-hover:text-neutral-600 transition-colors">
          <ChevronDown className="h-4 w-4" />
        </div>
      </div>
      {error && (
        <p className="text-[10px] font-bold text-rose-500 uppercase tracking-wider ml-1">
          {error}
        </p>
      )}
    </div>
  );
};
