import { SelectHTMLAttributes } from 'react';
import { cn } from '../../utils/index';
import { ChevronDown } from 'lucide-react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { label: string; value: string }[];
}

export const GlassSelect = ({ label, options, className, ...props }: SelectProps) => {
  return (
    <div className="flex flex-col gap-2">
      {label && <label className="text-sm font-semibold text-secondary-foreground">{label}</label>}
      <div className="relative">
        <select
          className={cn(
            'w-full px-5 py-3.5 !rounded-2xl glass text-foreground !shadow-[inset_0_2px_8px_rgba(0,0,0,0.05),0_1px_2px_rgba(255,255,255,0.2)] focus:!shadow-[0_0_0_4px_rgba(6,182,212,0.15),inset_0_2px_8px_rgba(0,0,0,0.05)] focus:!border-primary-500/50 outline-none transition-all duration-300 appearance-none',
            className
          )}
          {...props}
        >
          <option value="" disabled className="bg-slate-50 dark:bg-slate-900 text-muted-foreground">Select an option</option>
          {options.map((option) => (
            <option key={option.value} value={option.value} className="bg-slate-50 dark:bg-slate-900 text-foreground">
              {option.label}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-6 flex items-center pointer-events-none text-secondary-foreground">
          <ChevronDown size={20} />
        </div>
      </div>
    </div>
  );
};
