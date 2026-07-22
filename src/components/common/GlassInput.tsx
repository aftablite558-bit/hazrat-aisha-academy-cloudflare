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
      {label && <label htmlFor={inputId} className="text-sm font-semibold text-secondary-foreground">{label}</label>}
      <input
        id={inputId}
        className={cn(
          'w-full px-5 py-3.5 !rounded-2xl glass text-foreground !shadow-[inset_0_2px_8px_rgba(0,0,0,0.05),0_1px_2px_rgba(255,255,255,0.2)] focus:!shadow-[0_0_0_4px_rgba(16,185,129,0.2),inset_0_2px_8px_rgba(0,0,0,0.05)] focus:!border-emerald-500/60 outline-none transition-all duration-300',
          className
        )}
        {...props}
      />
    </div>
  );
};
