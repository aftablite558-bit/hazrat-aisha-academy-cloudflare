import { SelectHTMLAttributes, ReactNode, useId } from 'react';
import { cn } from '../../utils/index';
import { ChevronDown } from 'lucide-react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options?: { label: string; value: string }[];
  children?: ReactNode;
}

export const GlassSelect = ({ label, options, children, className, id, ...props }: SelectProps) => {
  const autoId = useId();
  const selectId = id || (label ? `select-${autoId}` : undefined);

  return (
    <div className="flex flex-col gap-2">
      {label && <label htmlFor={selectId} className="text-sm font-extrabold text-foreground tracking-wide">{label}</label>}
      <div className="relative">
        <select
          id={selectId}
          className={cn(
            'w-full px-5 py-3.5 rounded-2xl bg-slate-900/60 dark:bg-slate-950/80 border border-white/10 dark:border-white/10 text-foreground shadow-inner focus:border-emerald-500/80 focus:ring-4 focus:ring-emerald-500/20 outline-none transition-all duration-300 appearance-none font-medium',
            className
          )}
          {...props}
        >
          {children ? children : (
            <>
              <option value="" disabled className="bg-slate-900 text-muted-foreground">Select an option</option>
              {options?.map((option) => (
                <option key={option.value} value={option.value} className="bg-slate-900 text-foreground">
                  {option.label}
                </option>
              ))}
            </>
          )}
        </select>
        <div className="absolute inset-y-0 right-5 flex items-center pointer-events-none text-muted-foreground">
          <ChevronDown size={20} />
        </div>
      </div>
    </div>
  );
};

export const PremiumSelect = GlassSelect;
export const Select = GlassSelect;
