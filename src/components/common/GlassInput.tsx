import { InputHTMLAttributes, useId } from 'react';
import { cn } from '../../utils/index';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const GlassInput = ({ label, className, id, ...props }: InputProps) => {
  const autoId = useId();
  const inputId = id || (label ? `input-${autoId}` : undefined);

  return (
    <div className="flex flex-col gap-2">
      {label && <label htmlFor={inputId} className="text-sm font-extrabold text-foreground tracking-wide">{label}</label>}
      <input
        id={inputId}
        className={cn(
          'w-full px-5 py-3.5 rounded-2xl bg-slate-900/60 dark:bg-slate-950/80 border border-white/10 dark:border-white/10 text-foreground shadow-inner focus:border-emerald-500/80 focus:ring-4 focus:ring-emerald-500/20 outline-none transition-all duration-300 placeholder:text-muted-foreground/60 font-medium',
          className
        )}
        {...props}
      />
    </div>
  );
};

export const PremiumInput = GlassInput;
export const Input = GlassInput;
