import { TextareaHTMLAttributes, useId } from 'react';
import { cn } from '../../utils/index';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

export const GlassTextarea = ({ label, className, id, ...props }: TextareaProps) => {
  const autoId = useId();
  const textareaId = id || (label ? `textarea-${autoId}` : undefined);

  return (
    <div className="flex flex-col gap-2">
      {label && <label htmlFor={textareaId} className="text-sm font-extrabold text-foreground tracking-wide">{label}</label>}
      <textarea
        id={textareaId}
        className={cn(
          'w-full px-5 py-3.5 rounded-2xl bg-slate-900/60 dark:bg-slate-950/80 border border-white/10 dark:border-white/10 text-foreground shadow-inner focus:border-emerald-500/80 focus:ring-4 focus:ring-emerald-500/20 outline-none transition-all duration-300 min-h-[120px] resize-y custom-scrollbar font-medium placeholder:text-muted-foreground/60',
          className
        )}
        {...props}
      />
    </div>
  );
};

export const PremiumTextarea = GlassTextarea;
export const Textarea = GlassTextarea;
