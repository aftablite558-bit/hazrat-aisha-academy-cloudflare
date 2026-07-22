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
      {label && <label htmlFor={selectId} className="text-sm font-semibold text-secondary-foreground">{label}</label>}
      <div className="relative">
        <select
          id={selectId}
          className={cn(
            'w-full px-5 py-3.5 !rounded-2xl glass text-foreground !shadow-[inset_0_2px_8px_rgba(0,0,0,0.05),0_1px_2px_rgba(255,255,255,0.2)] focus:!shadow-[0_0_0_4px_rgba(16,185,129,0.2),inset_0_2px_8px_rgba(0,0,0,0.05)] focus:!border-emerald-500/60 outline-none transition-all duration-300 appearance-none',
            className
          )}
          {...props}
        >
          {children ? children : (
            <>
              <option value="" disabled className="bg-slate-50 dark:bg-slate-900 text-muted-foreground">Select an option</option>
              {options?.map((option) => (
                <option key={option.value} value={option.value} className="bg-slate-50 dark:bg-slate-900 text-foreground">
                  {option.label}
                </option>
              ))}
            </>
          )}
        </select>
        <div className="absolute inset-y-0 right-6 flex items-center pointer-events-none text-secondary-foreground">
          <ChevronDown size={20} />
        </div>
      </div>
    </div>
  );
};
